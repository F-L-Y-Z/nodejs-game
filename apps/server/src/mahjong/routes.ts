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

class MahjongLobby {
  private table = new MahjongTable();
  private autoTimer: NodeJS.Timeout | null = null;
  private lastSeen = new Map<string, number>();

  join(auth: AuthContext, name: string): boolean {
    this.pruneStaleClients();
    const seat = this.table.addHuman(auth.userId, auth.userId, name || auth.displayName || 'player');
    if (seat !== null) this.touch(auth);
    this.scheduleAuto();
    return seat !== null;
  }

  snapshot(auth: AuthContext) {
    this.pruneStaleClients();
    this.touch(auth);
    this.scheduleAuto();
    return this.table.snapshotFor(auth.userId);
  }

  action(auth: AuthContext, action: MahjongAction, payload: Record<string, unknown>): boolean {
    this.pruneStaleClients();
    this.touch(auth);
    const changed = this.table.handleAction(auth.userId, action, payload);
    this.scheduleAuto();
    return changed;
  }

  private touch(auth: AuthContext): void {
    this.lastSeen.set(auth.userId, Date.now());
  }

  private pruneStaleClients(): void {
    const now = Date.now();
    this.lastSeen.forEach((seenAt, userId) => {
      if (now - seenAt < STALE_CLIENT_MS) return;
      this.lastSeen.delete(userId);
      this.table.removeHuman(userId);
    });
  }

  private scheduleAuto(): void {
    this.clearAutoTimer();
    if (!this.table.shouldAutoRun()) return;
    this.autoTimer = setTimeout(() => {
      this.autoTimer = null;
      this.table.runAutoStep();
      this.scheduleAuto();
    }, AUTO_DELAY_MS);
  }

  private clearAutoTimer(): void {
    if (!this.autoTimer) return;
    clearTimeout(this.autoTimer);
    this.autoTimer = null;
  }
}

const lobby = new MahjongLobby();

export function registerMahjongRoutes(app: Express): void {
  app.post('/mahjong/join', async (request, response) => {
    const auth = await authenticate(request, response);
    if (!auth) return;

    const name = normalizeName(request.body?.name, auth.displayName);
    if (!lobby.join(auth, name)) {
      response.status(409).json({ ok: false, message: '房间已满。' });
      return;
    }

    response.json({ ok: true, state: lobby.snapshot(auth) });
  });

  app.get('/mahjong/snapshot', async (request, response) => {
    const auth = await authenticate(request, response);
    if (!auth) return;
    response.json({ ok: true, state: lobby.snapshot(auth) });
  });

  app.post('/mahjong/action', async (request, response) => {
    const auth = await authenticate(request, response);
    if (!auth) return;

    const action = String(request.body?.action || '') as MahjongAction;
    const payload = typeof request.body === 'object' && request.body ? request.body : {};
    if (!['discard', 'pass', 'peng', 'gang', 'hu', 'restart'].includes(action)) {
      response.status(400).json({ ok: false, message: '未知操作。' });
      return;
    }

    const changed = lobby.action(auth, action, payload);
    response.json({
      ok: changed,
      message: changed ? undefined : '当前不能执行该操作。',
      state: lobby.snapshot(auth),
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
