import type { Client } from 'colyseus';
import { Room } from 'colyseus';
import type { AuthContext } from '@repo/auth';
import { createDevTokenVerifier } from '@repo/auth/server';
import { readBooleanEnv } from '@repo/config';
import {
  CLIENT_MESSAGES,
  SERVER_MESSAGES,
  type JoinRoomOptions,
  type MahjongActionMessage,
} from '@repo/shared';
import { requireString } from '@repo/validators';
import { MahjongTable } from '../mahjong/mahjong-table.js';
import { authTokenService } from '../auth/service.js';
import { GameState } from '../schemas/game-state.js';

const verifyDevToken = createDevTokenVerifier();
const allowDevTokens = readBooleanEnv('AUTH_ALLOW_DEV_TOKENS', true);
const AUTO_DELAY_MS = 650;

export class GameRoom extends Room {
  maxClients = 4;
  private table = new MahjongTable();
  private autoTimer: NodeJS.Timeout | null = null;

  onCreate(): void {
    this.state = new GameState();

    this.onMessage(CLIENT_MESSAGES.MahjongAction, (client, message: MahjongActionMessage) => {
      const changed = this.table.handleAction(client.sessionId, message.action, message);
      if (!changed) {
        client.send(SERVER_MESSAGES.MahjongError, { message: '当前不能执行该操作。' });
        this.sendSnapshot(client);
        return;
      }
      this.broadcastSnapshots();
      this.scheduleAuto();
    });
  }

  async onAuth(_client: Client, options: JoinRoomOptions = {}) {
    try {
      return await authTokenService.verify(options.token);
    } catch (error) {
      if (!allowDevTokens) {
        throw error;
      }

      return verifyDevToken(options.token);
    }
  }

  onJoin(client: Client, options: JoinRoomOptions = {}, auth: AuthContext): void {
    const name = requireString(options.name, auth.displayName, 24);
    const seat = this.table.addHuman(client.sessionId, auth.userId, name);
    if (seat === null) {
      client.leave(4400, '房间已满。');
      return;
    }

    this.broadcastSnapshots();
    this.scheduleAuto();
  }

  onLeave(client: Client): void {
    this.table.removeHuman(client.sessionId);
    this.broadcastSnapshots();
    this.scheduleAuto();
  }

  onDispose(): void {
    this.clearAutoTimer();
  }

  private broadcastSnapshots(): void {
    this.clients.forEach((client) => this.sendSnapshot(client));
  }

  private sendSnapshot(client: Client): void {
    client.send(SERVER_MESSAGES.MahjongSnapshot, this.table.snapshotFor(client.sessionId));
  }

  private scheduleAuto(): void {
    this.clearAutoTimer();
    if (!this.table.shouldAutoRun()) return;
    this.autoTimer = setTimeout(() => {
      this.autoTimer = null;
      const changed = this.table.runAutoStep();
      if (changed) this.broadcastSnapshots();
      this.scheduleAuto();
    }, AUTO_DELAY_MS);
  }

  private clearAutoTimer(): void {
    if (!this.autoTimer) return;
    clearTimeout(this.autoTimer);
    this.autoTimer = null;
  }
}
