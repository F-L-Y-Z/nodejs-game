import type { AuthContext } from '@repo/auth';
import { CLIENT_MESSAGES, SERVER_MESSAGES, type JoinRoomOptions, type MahjongActionMessage } from '@repo/shared';
import { requireString } from '@repo/validators';
import { Client, CloseCode, Room } from 'colyseus';
import { authTokenService } from '../../auth/service.js';
import { MahjongTable } from './mahjong-table.js';
import { GameState } from './schema.js';

const AUTO_DELAY_MS = 650;
const DEFAULT_TIMEOUT_SECONDS = 30;

type RoomStatus = 'waiting' | 'playing' | 'settling';

export class MahjongRoom extends Room {
  // Colyseus limits connections here; MahjongTable still enforces 4 playable seats.
  maxClients = 8;
  private table = new MahjongTable(false);
  private autoTimer: NodeJS.Timeout | null = null;
  private readyUserIds = new Set<string>();
  private authBySessionId = new Map<string, AuthContext>();
  private activeSessionIdByUserId = new Map<string, string>();
  private status: RoomStatus = 'waiting';
  private timeoutSeconds = DEFAULT_TIMEOUT_SECONDS;
  private password = '';
  private turnDeadlineAt: number | null = null;

  messages = {
    [CLIENT_MESSAGES.MahjongAction]: (client: Client, message: MahjongActionMessage) => {
      const auth = this.authBySessionId.get(client.sessionId);
      if (!auth || this.activeSessionIdByUserId.get(auth.userId) !== client.sessionId) {
        client.send(SERVER_MESSAGES.MahjongError, {
          code: 'account_replaced',
          message: '账号已在其他设备进入该房间。',
        });
        client.leave(4409, 'account_replaced');
        return;
      }

      const result = this.handleAction(auth.userId, message.action, message);
      if (result.left) {
        client.send(SERVER_MESSAGES.MahjongSnapshot, { left: true, message: '已退出房间。' });
        client.leave(1000, 'left');
        this.broadcastSnapshots();
        return;
      }

      const changed = result.changed;
      if (!changed) {
        client.send(SERVER_MESSAGES.MahjongError, { message: result.message || '当前不能执行该操作。' });
        this.sendSnapshot(client);
        return;
      }
      this.broadcastSnapshots();
      this.scheduleAuto();
    },
  };

  onCreate(options: Record<string, unknown> = {}): void {
    this.state = new GameState();
    this.timeoutSeconds = normalizeTimeoutSeconds(options.timeoutSeconds);
    this.password = normalizeString(options.password, 32);
    console.log('[mahjong] onCreated', this.timeoutSeconds, this.password);
  }

  async onAuth(_client: Client, options: JoinRoomOptions = {}) {
    console.debug('[mahjong] onAuth', options);
    return await authTokenService.verify(options.token);
  }

  onJoin(client: Client, options: JoinRoomOptions = {}, auth: AuthContext): void {
    console.debug('[mahjong] onJoin', options);
    if (this.password && this.password !== normalizeString((options as Record<string, unknown>).password, 32)) {
      client.leave(4403, 'invalid_room_password');
      return;
    }

    const name = requireString(options.name, auth.displayName, 24);
    const restoringSeat = this.table.hasHuman(auth.userId);
    const previousSessionId = this.activeSessionIdByUserId.get(auth.userId);
    const seat = this.table.addHuman(auth.userId, auth.userId, name, auth.avatarUrl || '');
    if (seat === null) {
      client.leave(4400, '房间已满。');
      return;
    }

    this.authBySessionId.set(client.sessionId, auth);
    this.activeSessionIdByUserId.set(auth.userId, client.sessionId);

    if (previousSessionId && previousSessionId !== client.sessionId) {
      const previousClient = this.clients.find((item) => item.sessionId === previousSessionId);
      previousClient?.send(SERVER_MESSAGES.MahjongError, {
        code: 'account_replaced',
        message: '账号已在其他设备进入该房间。',
      });
      previousClient?.leave(4409, 'account_replaced');
    }

    if (!restoringSeat && (this.status === 'waiting' || this.status === 'settling')) {
      this.readyUserIds.delete(auth.userId);
    }

    this.broadcastSnapshots();
    this.scheduleAuto();
  }

  onLeave(client: Client, code: CloseCode): void {
    const auth = this.authBySessionId.get(client.sessionId);
    this.authBySessionId.delete(client.sessionId);
    if (auth && this.activeSessionIdByUserId.get(auth.userId) === client.sessionId) {
      this.activeSessionIdByUserId.delete(auth.userId);
      this.readyUserIds.delete(auth.userId);
      if (this.status === 'waiting' || this.status === 'settling') {
        this.table.removeHuman(auth.userId);
      }
    }
    this.broadcastSnapshots();
    this.scheduleAuto();
  }

  onDispose(): void {
    console.log('[mahjong] onDispose');
    this.clearAutoTimer();
  }

  private broadcastSnapshots(): void {
    this.clients.forEach((client) => this.sendSnapshot(client));
  }

  private sendSnapshot(client: Client): void {
    const auth = this.authBySessionId.get(client.sessionId);
    if (!auth) return;
    client.send(SERVER_MESSAGES.MahjongSnapshot, this.snapshotFor(auth.userId));
  }

  private scheduleAuto(): void {
    this.clearAutoTimer();
    if (this.status !== 'playing') return;

    if (this.table.shouldAutoRun()) {
      this.autoTimer = setTimeout(() => {
        this.autoTimer = null;
        const changed = this.table.runAutoStep();
        this.syncStatus();
        this.refreshTurnDeadline(changed);
        if (changed) this.broadcastSnapshots();
        this.scheduleAuto();
      }, AUTO_DELAY_MS);
      return;
    }

    this.refreshTurnDeadline(false);
    if (!this.turnDeadlineAt) return;
    this.autoTimer = setTimeout(
      () => {
        this.autoTimer = null;
        const changed = this.table.runAutoStep(true);
        this.syncStatus();
        this.refreshTurnDeadline(changed);
        if (changed) this.broadcastSnapshots();
        this.scheduleAuto();
      },
      Math.max(0, this.turnDeadlineAt - Date.now()),
    );
  }

  private clearAutoTimer(): void {
    if (!this.autoTimer) return;
    clearTimeout(this.autoTimer);
    this.autoTimer = null;
  }

  private handleAction(
    userId: string,
    action: MahjongActionMessage['action'],
    payload: Record<string, unknown>,
  ): { changed: boolean; left?: boolean; message?: string } {
    if (action === 'leave') {
      if (this.status !== 'waiting' && this.status !== 'settling') {
        return { changed: false, message: '牌局进行中不能退出房间。' };
      }
      const sessionId = this.activeSessionIdByUserId.get(userId);
      if (sessionId) this.table.removeHuman(userId);
      this.activeSessionIdByUserId.delete(userId);
      this.readyUserIds.delete(userId);
      return { changed: true, left: true };
    }

    if (action === 'ready') {
      if (this.status !== 'waiting' && this.status !== 'settling') return { changed: false };
      this.readyUserIds.add(userId);
      if (this.allPlayersReady()) {
        this.readyUserIds.clear();
        this.status = 'playing';
        this.table.startRoundKeepingHumans();
        this.refreshTurnDeadline(true);
      }
      return { changed: true };
    }

    if (this.status !== 'playing' || action === 'restart') return { changed: false };
    const changed = this.table.handleAction(userId, action, payload);
    this.syncStatus();
    this.refreshTurnDeadline(changed);
    return { changed };
  }

  private allPlayersReady(): boolean {
    const seats = this.table.getSeatInfos();
    return (
      this.table.getHumanCount() > 0 && seats.every((seat) => !seat.isHuman || this.readyUserIds.has(seat.userId || ''))
    );
  }

  private syncStatus(): void {
    if (this.status === 'playing') {
      const snapshot = this.table.snapshotFor(this.table.getHumanUserIds()[0] || '');
      if (snapshot.phase === 'round-over') {
        this.status = 'settling';
        this.readyUserIds.clear();
        this.turnDeadlineAt = null;
      }
    }
  }

  private refreshTurnDeadline(reset: boolean): void {
    if (this.status !== 'playing' || !this.table.shouldWaitForHumanAction()) {
      this.turnDeadlineAt = null;
      return;
    }
    if (reset || !this.turnDeadlineAt || this.turnDeadlineAt <= Date.now()) {
      this.turnDeadlineAt = Date.now() + this.timeoutSeconds * 1000;
    }
  }

  private snapshotFor(userId: string): Record<string, unknown> {
    const state = this.table.snapshotFor(userId);
    const viewerSeat = this.table.getSeatByClient(userId) ?? 0;
    const seats = this.table.getSeatInfos();
    const waiting = this.status === 'waiting' || this.status === 'settling';
    const readySeatCount = seats.filter((seat) => !seat.isHuman || this.readyUserIds.has(seat.userId || '')).length;
    const players = state.players.map((player, viewSeat) => {
      const tableSeat = (viewerSeat + viewSeat) % seats.length;
      const seat = seats[tableSeat];
      return {
        ...player,
        isHuman: seat.isHuman,
        isReady: !waiting || !seat.isHuman || this.readyUserIds.has(seat.userId || ''),
      };
    });

    return {
      ...state,
      players,
      phase: waiting ? this.status : state.phase,
      roomId: this.roomId,
      roomStatus: this.status,
      readyCount: waiting ? readySeatCount : seats.length,
      requiredReadyCount: seats.length,
      humanCount: this.table.getHumanCount(),
      serverTime: Date.now(),
      turnDeadlineAt: this.turnDeadlineAt,
      config: {
        timeoutSeconds: this.timeoutSeconds,
        hasPassword: Boolean(this.password),
      },
      actions: waiting ? { ready: !this.readyUserIds.has(userId), leave: true } : state.actions,
      message: waiting
        ? this.readyUserIds.has(userId)
          ? `已准备，等待其他玩家。(${readySeatCount}/${seats.length})`
          : `等待所有玩家准备。(${readySeatCount}/${seats.length})`
        : state.message,
    };
  }
}

function normalizeString(value: unknown, maxLength: number): string {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : '';
}

function normalizeTimeoutSeconds(value: unknown): number {
  const numberValue = Number(value);
  if (!Number.isFinite(numberValue)) return DEFAULT_TIMEOUT_SECONDS;
  return Math.max(5, Math.min(120, Math.round(numberValue)));
}
