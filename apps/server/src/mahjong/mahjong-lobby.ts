import type { AuthContext } from '@repo/auth';
import { MahjongTable, type MahjongAction } from './mahjong-table.js';

const AUTO_DELAY_MS = 650;
const STALE_CLIENT_MS = 120_000;
const ROOM_ID_LENGTH = 6;
const DEFAULT_TIMEOUT_SECONDS = 30;

type MahjongRoomStatus = 'waiting' | 'playing' | 'settling' | 'closed';

type MahjongRoom = {
  id: string;
  ownerUserId: string;
  status: MahjongRoomStatus;
  table: MahjongTable;
  lastSeen: Map<string, number>;
  activeClientIds: Map<string, string>;
  readyUserIds: Set<string>;
  autoTimer: NodeJS.Timeout | null;
  password: string;
  timeoutSeconds: number;
  turnDeadlineAt: number | null;
  createdAt: number;
  updatedAt: number;
};

export type LobbyError = {
  status: number;
  code: string;
  message: string;
};

type LobbyActionResult = {
  roomId: string;
  changed: boolean;
  state?: unknown;
  left?: boolean;
  message?: string;
};

type RoomListener = (roomId: string) => void;

export class MahjongLobby {
  private rooms = new Map<string, MahjongRoom>();
  private roomIdByUserId = new Map<string, string>();
  private listeners = new Set<RoomListener>();

  onRoomChanged(listener: RoomListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  createRoom(
    auth: AuthContext,
    name: string,
    clientId: string,
    options: { password?: string; timeoutSeconds?: number } = {},
  ): { roomId: string; state: unknown } | LobbyError {
    this.pruneAllRooms();
    const existingRoomId = this.roomIdByUserId.get(auth.userId);
    if (existingRoomId && this.rooms.has(existingRoomId)) {
      return { status: 409, code: 'already_in_room', message: '你已在其他房间中，请先回到原房间。' };
    }
    const room = this.createRoomRecord(auth.userId, options);
    const joined = this.joinRoomRecord(room, auth, name, clientId);
    if (!joined) {
      throw new Error('创建房间失败。');
    }
    this.notifyRoomChanged(room.id);
    return { roomId: room.id, state: this.snapshotFor(room, auth.userId) };
  }

  joinRoom(
    roomId: string,
    auth: AuthContext,
    name: string,
    clientId: string,
    options: { password?: string } = {},
  ): { roomId: string; state: unknown } | LobbyError {
    this.pruneAllRooms();
    const room = this.rooms.get(roomId);
    if (!room || room.status === 'closed') {
      return { status: 404, code: 'room_not_found', message: '房间不存在或已销毁。' };
    }
    const existingRoomId = this.roomIdByUserId.get(auth.userId);
    if (existingRoomId && existingRoomId !== roomId && this.rooms.has(existingRoomId)) {
      return { status: 409, code: 'already_in_room', message: '你已在其他房间中，请先回到原房间。' };
    }
    if (room.password && room.password !== (options.password || '')) {
      return { status: 403, code: 'invalid_room_password', message: '房间密码错误。' };
    }
    if (!this.joinRoomRecord(room, auth, name, clientId)) {
      return { status: 409, code: 'room_full', message: '房间已满。' };
    }
    this.notifyRoomChanged(room.id);
    return { roomId: room.id, state: this.snapshotFor(room, auth.userId) };
  }

  snapshot(roomId: string, auth: AuthContext, clientId: string): { roomId: string; state: unknown } | LobbyError {
    this.pruneAllRooms();
    const room = this.rooms.get(roomId);
    if (!room || room.status === 'closed' || !room.table.hasHuman(auth.userId)) {
      return { status: 404, code: 'room_not_found', message: '房间不存在或已销毁。' };
    }
    const clientError = this.ensureActiveClient(room, auth.userId, clientId);
    if (clientError) return clientError;
    this.touch(room, auth.userId);
    this.syncRoomStatus(room);
    this.scheduleAuto(room);
    return { roomId: room.id, state: this.snapshotFor(room, auth.userId) };
  }

  action(
    roomId: string,
    auth: AuthContext,
    action: MahjongAction,
    payload: Record<string, unknown>,
    clientId: string,
  ): LobbyActionResult | LobbyError {
    this.pruneAllRooms();
    const room = this.rooms.get(roomId);
    if (!room || room.status === 'closed' || !room.table.hasHuman(auth.userId)) {
      return { status: 404, code: 'room_not_found', message: '房间不存在或已销毁。' };
    }
    const clientError = this.ensureActiveClient(room, auth.userId, clientId);
    if (clientError) return clientError;
    this.touch(room, auth.userId);
    if (action === 'leave') {
      return this.leaveRoom(room, auth.userId);
    }
    const changed = action === 'ready' ? this.ready(room, auth.userId) : this.playAction(room, auth.userId, action, payload);
    room.updatedAt = Date.now();
    this.syncRoomStatus(room);
    this.scheduleAuto(room);
    if (changed) this.refreshTurnDeadline(room, true);
    if (changed) this.notifyRoomChanged(room.id);
    return { roomId: room.id, state: this.snapshotFor(room, auth.userId), changed };
  }

  private createRoomRecord(ownerUserId: string, options: { password?: string; timeoutSeconds?: number }): MahjongRoom {
    const room: MahjongRoom = {
      id: this.generateRoomId(),
      ownerUserId,
      status: 'waiting',
      table: new MahjongTable(false),
      lastSeen: new Map(),
      activeClientIds: new Map(),
      readyUserIds: new Set(),
      autoTimer: null,
      password: options.password || '',
      timeoutSeconds: options.timeoutSeconds || DEFAULT_TIMEOUT_SECONDS,
      turnDeadlineAt: null,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    this.rooms.set(room.id, room);
    return room;
  }

  private joinRoomRecord(room: MahjongRoom, auth: AuthContext, name: string, clientId: string): boolean {
    this.pruneStaleClients(room);
    const restoringSeat = room.table.hasHuman(auth.userId);
    const seat = room.table.addHuman(auth.userId, auth.userId, name || auth.displayName || 'player');
    if (seat === null) return false;
    if (!restoringSeat && (room.status === 'waiting' || room.status === 'settling')) {
      room.readyUserIds.delete(auth.userId);
    }
    this.touch(room, auth.userId);
    room.activeClientIds.set(auth.userId, clientId);
    this.roomIdByUserId.set(auth.userId, room.id);
    room.updatedAt = Date.now();
    this.scheduleAuto(room);
    return true;
  }

  private touch(room: MahjongRoom, userId: string): void {
    room.lastSeen.set(userId, Date.now());
  }

  private pruneAllRooms(): void {
    this.rooms.forEach((room) => {
      this.pruneStaleClients(room);
      if (room.table.getHumanCount() === 0) {
        this.closeRoom(room);
      }
    });
  }

  private pruneStaleClients(room: MahjongRoom): void {
    const now = Date.now();
    room.lastSeen.forEach((seenAt, userId) => {
      if (now - seenAt < STALE_CLIENT_MS) return;
      room.lastSeen.delete(userId);
      room.activeClientIds.delete(userId);
      this.roomIdByUserId.delete(userId);
      room.readyUserIds.delete(userId);
      room.table.removeHuman(userId);
      room.updatedAt = now;
    });
  }

  private scheduleAuto(room: MahjongRoom): void {
    this.clearAutoTimer(room);
    if (room.status !== 'playing') return;

    if (room.table.shouldAutoRun()) {
      room.autoTimer = setTimeout(() => {
        room.autoTimer = null;
        const changed = room.table.runAutoStep();
        if (changed) room.updatedAt = Date.now();
        this.syncRoomStatus(room);
        this.refreshTurnDeadline(room, changed);
        if (changed) this.notifyRoomChanged(room.id);
        this.scheduleAuto(room);
      }, AUTO_DELAY_MS);
      return;
    }

    this.refreshTurnDeadline(room, false);
    if (!room.turnDeadlineAt) return;
    const delay = Math.max(0, room.turnDeadlineAt - Date.now());
    room.autoTimer = setTimeout(() => {
      room.autoTimer = null;
      const changed = room.table.runAutoStep(true);
      if (changed) room.updatedAt = Date.now();
      this.syncRoomStatus(room);
      this.refreshTurnDeadline(room, changed);
      if (changed) this.notifyRoomChanged(room.id);
      this.scheduleAuto(room);
    }, delay);
  }

  private clearAutoTimer(room: MahjongRoom): void {
    if (!room.autoTimer) return;
    clearTimeout(room.autoTimer);
    room.autoTimer = null;
  }

  private generateRoomId(): string {
    for (let i = 0; i < 20; i++) {
      const roomId = String(Math.floor(Math.random() * 10 ** ROOM_ID_LENGTH)).padStart(ROOM_ID_LENGTH, '0');
      if (!this.rooms.has(roomId)) return roomId;
    }
    throw new Error('无法生成房间号。');
  }

  private ensureActiveClient(room: MahjongRoom, userId: string, clientId: string): LobbyError | null {
    const activeClientId = room.activeClientIds.get(userId);
    if (!activeClientId || activeClientId === clientId) return null;
    return {
      status: 409,
      code: 'account_replaced',
      message: '账号已在其他设备进入该房间。',
    };
  }

  private ready(room: MahjongRoom, userId: string): boolean {
    if (room.status !== 'waiting' && room.status !== 'settling') return false;
    room.readyUserIds.add(userId);
    if (this.allPlayersReady(room)) {
      room.readyUserIds.clear();
      room.status = 'playing';
      room.table.startRoundKeepingHumans();
      this.refreshTurnDeadline(room, true);
    }
    return true;
  }

  private leaveRoom(room: MahjongRoom, userId: string): LobbyActionResult {
    if (room.status !== 'waiting' && room.status !== 'settling') {
      return {
        roomId: room.id,
        changed: false,
        state: this.snapshotFor(room, userId),
        message: '牌局进行中不能退出房间。',
      };
    }

    room.lastSeen.delete(userId);
    room.activeClientIds.delete(userId);
    room.readyUserIds.delete(userId);
    this.roomIdByUserId.delete(userId);
    room.table.removeHuman(userId);
    room.updatedAt = Date.now();
    room.turnDeadlineAt = null;
    this.reassignOwner(room);
    this.syncRoomStatus(room);
    this.notifyRoomChanged(room.id);

    return {
      roomId: room.id,
      changed: true,
      left: true,
      message: '已退出房间。',
    };
  }

  private playAction(
    room: MahjongRoom,
    userId: string,
    action: MahjongAction,
    payload: Record<string, unknown>,
  ): boolean {
    if (room.status !== 'playing') return false;
    if (action === 'restart') return false;
    return room.table.handleAction(userId, action, payload);
  }

  private allPlayersReady(room: MahjongRoom): boolean {
    const seats = room.table.getSeatInfos();
    return room.table.getHumanCount() > 0 && seats.every((seat) => !seat.isHuman || room.readyUserIds.has(seat.userId || ''));
  }

  private syncRoomStatus(room: MahjongRoom): void {
    if (room.status === 'closed') return;
    if (room.table.getHumanCount() === 0) {
      this.closeRoom(room);
      return;
    }
    if (room.status === 'playing') {
      const ownerSnapshot = room.table.snapshotFor(room.ownerUserId);
      if (ownerSnapshot.phase === 'round-over') {
        room.status = 'settling';
        room.readyUserIds.clear();
        room.turnDeadlineAt = null;
      }
    }
  }

  private refreshTurnDeadline(room: MahjongRoom, reset: boolean): void {
    if (room.status !== 'playing' || !room.table.shouldWaitForHumanAction()) {
      room.turnDeadlineAt = null;
      return;
    }
    if (reset || !room.turnDeadlineAt || room.turnDeadlineAt <= Date.now()) {
      room.turnDeadlineAt = Date.now() + room.timeoutSeconds * 1000;
    }
  }

  private reassignOwner(room: MahjongRoom): void {
    if (room.table.hasHuman(room.ownerUserId)) return;
    const nextOwner = room.table.getHumanUserIds()[0];
    if (nextOwner) room.ownerUserId = nextOwner;
  }

  private snapshotFor(room: MahjongRoom, userId: string): unknown {
    const state = room.table.snapshotFor(userId);
    const viewerSeat = room.table.getSeatByClient(userId) ?? 0;
    const seats = room.table.getSeatInfos();
    const seatCount = seats.length;
    const readySeatCount = seats.filter((seat) => !seat.isHuman || room.readyUserIds.has(seat.userId || '')).length;
    const isReady = room.readyUserIds.has(userId);
    const waiting = room.status === 'waiting' || room.status === 'settling';
    const players = state.players.map((player, viewSeat) => {
      const tableSeat = (viewerSeat + viewSeat) % seats.length;
      const seat = seats[tableSeat];
      return {
        ...player,
        isHuman: seat.isHuman,
        isReady: !waiting || !seat.isHuman || room.readyUserIds.has(seat.userId || ''),
      };
    });

    return {
      ...state,
      players,
      phase: waiting ? room.status : state.phase,
      roomStatus: room.status,
      readyCount: waiting ? readySeatCount : seatCount,
      requiredReadyCount: seatCount,
      humanCount: room.table.getHumanCount(),
      serverTime: Date.now(),
      turnDeadlineAt: room.turnDeadlineAt,
      config: {
        timeoutSeconds: room.timeoutSeconds,
        hasPassword: Boolean(room.password),
      },
      actions: waiting ? { ready: !isReady, leave: true } : state.actions,
      message: waiting
        ? isReady
          ? `已准备，等待其他玩家。(${readySeatCount}/${seatCount})`
          : `等待所有玩家准备。(${readySeatCount}/${seatCount})`
        : state.message,
    };
  }

  private closeRoom(room: MahjongRoom): void {
    room.status = 'closed';
    this.clearAutoTimer(room);
    room.lastSeen.forEach((_seenAt, userId) => {
      this.roomIdByUserId.delete(userId);
    });
    this.rooms.delete(room.id);
    this.notifyRoomChanged(room.id);
  }

  private notifyRoomChanged(roomId: string): void {
    this.listeners.forEach((listener) => listener(roomId));
  }
}

export const lobby = new MahjongLobby();

export function isLobbyError(value: unknown): value is LobbyError {
  return typeof value === 'object' && value !== null && 'status' in value && 'code' in value && 'message' in value;
}
