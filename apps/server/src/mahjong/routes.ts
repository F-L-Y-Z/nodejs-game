import type { AuthContext } from '@repo/auth';
import { createDevTokenVerifier } from '@repo/auth/server';
import { readBooleanEnv } from '@repo/config';
import type { Express, Request, Response } from 'express';
import { authTokenService } from '../auth/service.js';
import { MahjongTable, type MahjongAction } from './MahjongTable.js';

const verifyDevToken = createDevTokenVerifier();
const allowDevTokens = readBooleanEnv('AUTH_ALLOW_DEV_TOKENS', true);
const AUTO_DELAY_MS = 650;
const STALE_CLIENT_MS = 120_000;
const ROOM_ID_LENGTH = 6;

type MahjongRoomStatus = 'playing' | 'closed';

type MahjongRoom = {
  id: string;
  ownerUserId: string;
  status: MahjongRoomStatus;
  table: MahjongTable;
  lastSeen: Map<string, number>;
  autoTimer: NodeJS.Timeout | null;
  createdAt: number;
  updatedAt: number;
};

class MahjongLobby {
  private rooms = new Map<string, MahjongRoom>();

  createRoom(auth: AuthContext, name: string): { roomId: string; state: unknown } {
    this.pruneAllRooms();
    const room = this.createRoomRecord(auth.userId);
    const joined = this.joinRoomRecord(room, auth, name);
    if (!joined) {
      throw new Error('创建房间失败。');
    }
    return { roomId: room.id, state: room.table.snapshotFor(auth.userId) };
  }

  joinRoom(roomId: string, auth: AuthContext, name: string): { roomId: string; state: unknown } | null {
    this.pruneAllRooms();
    const room = this.rooms.get(roomId);
    if (!room || room.status !== 'playing') return null;
    if (!this.joinRoomRecord(room, auth, name)) return null;
    return { roomId: room.id, state: room.table.snapshotFor(auth.userId) };
  }

  snapshot(roomId: string, auth: AuthContext): { roomId: string; state: unknown } | null {
    this.pruneAllRooms();
    const room = this.rooms.get(roomId);
    if (!room || room.status !== 'playing') return null;
    this.touch(room, auth.userId);
    this.scheduleAuto(room);
    return { roomId: room.id, state: room.table.snapshotFor(auth.userId) };
  }

  action(
    roomId: string,
    auth: AuthContext,
    action: MahjongAction,
    payload: Record<string, unknown>,
  ): { roomId: string; state: unknown; changed: boolean } | null {
    this.pruneAllRooms();
    const room = this.rooms.get(roomId);
    if (!room || room.status !== 'playing') return null;
    this.touch(room, auth.userId);
    const changed = room.table.handleAction(auth.userId, action, payload);
    room.updatedAt = Date.now();
    this.scheduleAuto(room);
    return { roomId: room.id, state: room.table.snapshotFor(auth.userId), changed };
  }

  private createRoomRecord(ownerUserId: string): MahjongRoom {
    const room: MahjongRoom = {
      id: this.generateRoomId(),
      ownerUserId,
      status: 'playing',
      table: new MahjongTable(),
      lastSeen: new Map(),
      autoTimer: null,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    this.rooms.set(room.id, room);
    return room;
  }

  private joinRoomRecord(room: MahjongRoom, auth: AuthContext, name: string): boolean {
    this.pruneStaleClients(room);
    const seat = room.table.addHuman(auth.userId, auth.userId, name || auth.displayName || 'player');
    if (seat === null) return false;
    this.touch(room, auth.userId);
    room.updatedAt = Date.now();
    this.scheduleAuto(room);
    return true;
  }

  private touch(room: MahjongRoom, userId: string): void {
    room.lastSeen.set(userId, Date.now());
  }

  private pruneAllRooms(): void {
    this.rooms.forEach((room) => this.pruneStaleClients(room));
  }

  private pruneStaleClients(room: MahjongRoom): void {
    const now = Date.now();
    room.lastSeen.forEach((seenAt, userId) => {
      if (now - seenAt < STALE_CLIENT_MS) return;
      room.lastSeen.delete(userId);
      room.table.removeHuman(userId);
      room.updatedAt = now;
    });
  }

  private scheduleAuto(room: MahjongRoom): void {
    this.clearAutoTimer(room);
    if (!room.table.shouldAutoRun()) return;
    room.autoTimer = setTimeout(() => {
      room.autoTimer = null;
      const changed = room.table.runAutoStep();
      if (changed) room.updatedAt = Date.now();
      this.scheduleAuto(room);
    }, AUTO_DELAY_MS);
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
}

const lobby = new MahjongLobby();

export function registerMahjongRoutes(app: Express): void {
  app.post('/mahjong/rooms', async (request, response) => {
    const auth = await authenticate(request, response);
    if (!auth) return;

    const name = normalizeName(request.body?.name, auth.displayName);
    try {
      response.json({ ok: true, ...lobby.createRoom(auth, name) });
    } catch (error) {
      response.status(500).json({ ok: false, message: error instanceof Error ? error.message : '创建房间失败。' });
    }
  });

  app.post('/mahjong/rooms/:roomId/join', async (request, response) => {
    const auth = await authenticate(request, response);
    if (!auth) return;

    const roomId = normalizeRoomId(request.params.roomId);
    if (!roomId) {
      response.status(400).json({ ok: false, message: '房间号无效。' });
      return;
    }

    const name = normalizeName(request.body?.name, auth.displayName);
    const result = lobby.joinRoom(roomId, auth, name);
    if (!result) {
      response.status(404).json({ ok: false, message: '房间不存在或已满。' });
      return;
    }
    response.json({ ok: true, ...result });
  });

  app.get('/mahjong/rooms/:roomId/snapshot', async (request, response) => {
    const auth = await authenticate(request, response);
    if (!auth) return;

    const roomId = normalizeRoomId(request.params.roomId);
    const result = roomId ? lobby.snapshot(roomId, auth) : null;
    if (!result) {
      response.status(404).json({ ok: false, message: '房间不存在。' });
      return;
    }
    response.json({ ok: true, ...result });
  });

  app.post('/mahjong/rooms/:roomId/action', async (request, response) => {
    const auth = await authenticate(request, response);
    if (!auth) return;

    const roomId = normalizeRoomId(request.params.roomId);
    const action = String(request.body?.action || '') as MahjongAction;
    const payload = typeof request.body === 'object' && request.body ? request.body : {};
    if (!roomId) {
      response.status(400).json({ ok: false, message: '房间号无效。' });
      return;
    }
    if (!['discard', 'pass', 'peng', 'gang', 'hu', 'restart'].includes(action)) {
      response.status(400).json({ ok: false, message: '未知操作。' });
      return;
    }

    const result = lobby.action(roomId, auth, action, payload);
    if (!result) {
      response.status(404).json({ ok: false, message: '房间不存在。' });
      return;
    }
    response.json({
      ok: result.changed,
      roomId: result.roomId,
      message: result.changed ? undefined : '当前不能执行该操作。',
      state: result.state,
    });
  });
}

async function authenticate(request: Request, response: Response): Promise<AuthContext | null> {
  const token = readBearerToken(request);
  try {
    return await authTokenService.verify(token);
  } catch (error) {
    if (allowDevTokens) {
      try {
        return await verifyDevToken(token);
      } catch {
        // Fall through to the 401 response below.
      }
    }
    response.status(401).json({ ok: false, message: '未登录或登录已过期。' });
    return null;
  }
}

function readBearerToken(request: Request): string | undefined {
  const authorization = request.header('authorization') || '';
  const prefix = 'Bearer ';
  if (authorization.startsWith(prefix)) return authorization.slice(prefix.length).trim();
  return typeof request.body?.token === 'string' ? request.body.token : undefined;
}

function normalizeName(value: unknown, fallback: string): string {
  const text = typeof value === 'string' ? value.trim() : '';
  return (text || fallback || 'player').slice(0, 24);
}

function normalizeRoomId(value: unknown): string {
  const text = String(value || '').trim();
  return /^\d{6}$/.test(text) ? text : '';
}
