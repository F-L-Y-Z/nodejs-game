import type { AuthContext } from '@repo/auth';
import { createDevTokenVerifier } from '@repo/auth/server';
import { readBooleanEnv } from '@repo/config';
import type { Express, Request, Response } from 'express';
import { authTokenService } from '../auth/service.js';
import { isLobbyError, lobby, type LobbyError } from './mahjong-lobby.js';
import { type MahjongAction } from './mahjong-table.js';

const verifyDevToken = createDevTokenVerifier();
const allowDevTokens = readBooleanEnv('AUTH_ALLOW_DEV_TOKENS', true);
const DEFAULT_TIMEOUT_SECONDS = 30;
const MIN_TIMEOUT_SECONDS = 5;
const MAX_TIMEOUT_SECONDS = 120;

export function registerMahjongRoutes(app: Express): void {
  app.post('/mahjong/rooms', async (request, response) => {
    const auth = await authenticate(request, response);
    if (!auth) return;

    const name = normalizeName(request.body?.name, auth.displayName);
    const clientId = readClientId(request);
    try {
      const result = lobby.createRoom(auth, name, clientId, {
        password: normalizePassword(request.body?.password),
        timeoutSeconds: normalizeTimeoutSeconds(request.body?.timeoutSeconds),
      });
      if (isLobbyError(result)) {
        sendLobbyError(response, result);
        return;
      }
      response.json({ ok: true, ...result });
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
    const result = lobby.joinRoom(roomId, auth, name, readClientId(request), {
      password: normalizePassword(request.body?.password),
    });
    if (isLobbyError(result)) {
      sendLobbyError(response, result);
      return;
    }
    response.json({ ok: true, ...result });
  });

  app.get('/mahjong/rooms/:roomId/snapshot', async (request, response) => {
    const auth = await authenticate(request, response);
    if (!auth) return;

    const roomId = normalizeRoomId(request.params.roomId);
    const result = roomId
      ? lobby.snapshot(roomId, auth, readClientId(request))
      : { status: 400, code: 'invalid_room_id', message: '房间号无效。' };
    if (isLobbyError(result)) {
      sendLobbyError(response, result);
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
    if (!['discard', 'pass', 'peng', 'gang', 'hu', 'restart', 'ready', 'leave'].includes(action)) {
      response.status(400).json({ ok: false, message: '未知操作。' });
      return;
    }

    const result = lobby.action(roomId, auth, action, payload, readClientId(request));
    if (isLobbyError(result)) {
      sendLobbyError(response, result);
      return;
    }
    response.json({
      ok: result.changed,
      roomId: result.roomId,
      left: result.left,
      message: result.message || (result.changed ? undefined : '当前不能执行该操作。'),
      state: result.state,
    });
  });
}

function sendLobbyError(response: Response, error: LobbyError): void {
  response.status(error.status).json({ ok: false, code: error.code, message: error.message });
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

function readClientId(request: Request): string {
  const headerValue = request.header('x-client-id');
  const bodyValue = request.body?.clientId;
  const value = typeof headerValue === 'string' && headerValue ? headerValue : bodyValue;
  const normalized = typeof value === 'string' ? value.trim().replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 64) : '';
  return normalized || `client-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function normalizeName(value: unknown, fallback: string): string {
  const text = typeof value === 'string' ? value.trim() : '';
  return (text || fallback || 'player').slice(0, 24);
}

function normalizePassword(value: unknown): string {
  return typeof value === 'string' ? value.trim().slice(0, 32) : '';
}

function normalizeTimeoutSeconds(value: unknown): number {
  const numberValue = Number(value);
  if (!Number.isFinite(numberValue)) return DEFAULT_TIMEOUT_SECONDS;
  return Math.max(MIN_TIMEOUT_SECONDS, Math.min(MAX_TIMEOUT_SECONDS, Math.round(numberValue)));
}

function normalizeRoomId(value: unknown): string {
  const text = String(value || '').trim();
  return /^\d{6}$/.test(text) ? text : '';
}
