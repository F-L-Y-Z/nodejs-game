import type { AuthContext } from '@repo/auth';
import { createDevTokenVerifier } from '@repo/auth/server';
import { readBooleanEnv } from '@repo/config';
import type { IncomingMessage, Server as HttpServer } from 'node:http';
import { createHash } from 'node:crypto';
import type { Duplex } from 'node:stream';
import { authTokenService } from '../auth/service.js';
import { isLobbyError, lobby } from './routes.js';
import type { MahjongAction } from './mahjong-table.js';

const WS_PATH = '/mahjong/ws';
const WS_GUID = '258EAFA5-E914-47DA-95CA-C5AB0DC85B11';
const verifyDevToken = createDevTokenVerifier();
const allowDevTokens = readBooleanEnv('AUTH_ALLOW_DEV_TOKENS', true);

type MahjongSocket = {
  socket: Duplex;
  auth: AuthContext;
  roomId: string;
  clientId: string;
  closed: boolean;
  buffer: Buffer;
};

export function registerMahjongWebSocket(server: HttpServer): void {
  const connections = new Set<MahjongSocket>();

  lobby.onRoomChanged((roomId) => {
    connections.forEach((connection) => {
      if (connection.roomId === roomId) sendSnapshot(connection);
    });
  });

  server.on('upgrade', async (request, socket, head) => {
    if (!isMahjongSocketRequest(request)) return;

    try {
      const url = getRequestUrl(request);
      console.info('[mahjong-ws] upgrade received', {
        path: url.pathname,
        roomId: url.searchParams.get('roomId') || '',
        clientId: url.searchParams.get('clientId') || '',
      });
      const token = url.searchParams.get('token') || '';
      const roomId = normalizeRoomId(url.searchParams.get('roomId'));
      const clientId = normalizeClientId(url.searchParams.get('clientId'));
      if (!roomId || !clientId) {
        console.warn('[mahjong-ws] upgrade rejected: invalid params', { roomId, clientId });
        rejectUpgrade(socket, 400, 'Bad Request');
        return;
      }

      const auth = await verifyToken(token);
      const snapshot = lobby.snapshot(roomId, auth, clientId);
      if (isLobbyError(snapshot)) {
        console.warn('[mahjong-ws] upgrade rejected', {
          roomId,
          clientId,
          userId: auth.userId,
          code: snapshot.code,
          status: snapshot.status,
        });
        rejectUpgrade(socket, snapshot.status, snapshot.message);
        return;
      }

      acceptUpgrade(request, socket);
      const connection: MahjongSocket = {
        socket,
        auth,
        roomId,
        clientId,
        closed: false,
        buffer: Buffer.from(head || []),
      };
      connections.add(connection);
      console.info('[mahjong-ws] connected', {
        roomId,
        clientId,
        userId: auth.userId,
        connectionCount: connections.size,
      });

      socket.on('data', (chunk) => handleData(connection, chunk, connections));
      socket.on('close', () => {
        connection.closed = true;
        connections.delete(connection);
        console.info('[mahjong-ws] closed', {
          roomId: connection.roomId,
          clientId: connection.clientId,
          userId: connection.auth.userId,
          connectionCount: connections.size,
        });
      });
      socket.on('error', (error) => {
        connection.closed = true;
        connections.delete(connection);
        console.warn('[mahjong-ws] socket error', {
          roomId: connection.roomId,
          clientId: connection.clientId,
          userId: connection.auth.userId,
          message: error instanceof Error ? error.message : String(error),
        });
      });

      sendJson(connection, { type: 'snapshot', ok: true, ...snapshot });
      if (connection.buffer.length) {
        readFrames(connection, connections);
      }
    } catch (error) {
      console.warn('[mahjong-ws] upgrade rejected: auth failed', {
        message: error instanceof Error ? error.message : String(error),
      });
      rejectUpgrade(socket, 401, 'Unauthorized');
    }
  });
}

function isMahjongSocketRequest(request: IncomingMessage): boolean {
  try {
    return getRequestUrl(request).pathname === WS_PATH;
  } catch {
    return false;
  }
}

function getRequestUrl(request: IncomingMessage): URL {
  return new URL(request.url || '/', `http://${request.headers.host || 'localhost'}`);
}

async function verifyToken(token: string): Promise<AuthContext> {
  try {
    return await authTokenService.verify(token);
  } catch (error) {
    if (!allowDevTokens) throw error;
    return verifyDevToken(token);
  }
}

function acceptUpgrade(request: IncomingMessage, socket: Duplex): void {
  const key = request.headers['sec-websocket-key'];
  const accept = createHash('sha1')
    .update(`${Array.isArray(key) ? key[0] : key}${WS_GUID}`)
    .digest('base64');
  socket.write(
    [
      'HTTP/1.1 101 Switching Protocols',
      'Upgrade: websocket',
      'Connection: Upgrade',
      `Sec-WebSocket-Accept: ${accept}`,
      '\r\n',
    ].join('\r\n'),
  );
}

function rejectUpgrade(socket: Duplex, status: number, message: string): void {
  socket.write(`HTTP/1.1 ${status} ${message}\r\nConnection: close\r\n\r\n`);
  socket.destroy();
}

function handleData(connection: MahjongSocket, chunk: Buffer, connections: Set<MahjongSocket>): void {
  connection.buffer = Buffer.concat([connection.buffer, chunk]);
  readFrames(connection, connections);
}

function readFrames(connection: MahjongSocket, connections: Set<MahjongSocket>): void {
  while (!connection.closed) {
    const frame = readFrame(connection.buffer);
    if (!frame) return;
    connection.buffer = connection.buffer.subarray(frame.bytesRead);

    if (frame.opcode === 8) {
      closeConnection(connection);
      return;
    }
    if (frame.opcode === 9) {
      sendFrame(connection.socket, frame.payload, 10);
      continue;
    }
    if (frame.opcode !== 1) continue;

    try {
      const message = JSON.parse(frame.payload.toString('utf8')) as Record<string, unknown>;
      handleMessage(connection, message, connections);
    } catch {
      sendJson(connection, { type: 'error', ok: false, code: 'invalid_message', message: '消息格式无效。' });
    }
  }
}

function readFrame(buffer: Buffer): { opcode: number; payload: Buffer; bytesRead: number } | null {
  if (buffer.length < 2) return null;
  const opcode = buffer[0] & 0x0f;
  const masked = Boolean(buffer[1] & 0x80);
  let length = buffer[1] & 0x7f;
  let offset = 2;

  if (length === 126) {
    if (buffer.length < offset + 2) return null;
    length = buffer.readUInt16BE(offset);
    offset += 2;
  } else if (length === 127) {
    if (buffer.length < offset + 8) return null;
    const largeLength = buffer.readBigUInt64BE(offset);
    if (largeLength > BigInt(Number.MAX_SAFE_INTEGER)) throw new Error('WebSocket frame too large.');
    length = Number(largeLength);
    offset += 8;
  }

  const maskOffset = offset;
  if (masked) offset += 4;
  if (buffer.length < offset + length) return null;

  const payload = Buffer.from(buffer.subarray(offset, offset + length));
  if (masked) {
    const mask = buffer.subarray(maskOffset, maskOffset + 4);
    for (let i = 0; i < payload.length; i++) {
      payload[i] ^= mask[i % 4];
    }
  }
  return { opcode, payload, bytesRead: offset + length };
}

function handleMessage(
  connection: MahjongSocket,
  message: Record<string, unknown>,
  connections: Set<MahjongSocket>,
): void {
  if (message.type !== 'action') {
    sendSnapshot(connection);
    return;
  }

  const action = String(message.action || '') as MahjongAction;
  console.info('[mahjong-ws] action', {
    roomId: connection.roomId,
    clientId: connection.clientId,
    userId: connection.auth.userId,
    action,
  });
  const result = lobby.action(connection.roomId, connection.auth, action, message, connection.clientId);
  if (isLobbyError(result)) {
    console.warn('[mahjong-ws] action rejected', {
      roomId: connection.roomId,
      clientId: connection.clientId,
      userId: connection.auth.userId,
      action,
      code: result.code,
      status: result.status,
    });
    sendJson(connection, { type: 'error', ok: false, code: result.code, message: result.message });
    if (result.code === 'account_replaced' || result.code === 'room_not_found') {
      closeConnection(connection);
      connections.delete(connection);
    }
    return;
  }

  if (result.left) {
    sendJson(connection, { type: 'left', ok: true, roomId: result.roomId, message: result.message });
    closeConnection(connection);
    connections.delete(connection);
    return;
  }

  sendJson(connection, {
    type: 'action_result',
    ok: result.changed,
    roomId: result.roomId,
    message: result.message || (result.changed ? undefined : '当前不能执行该操作。'),
    state: result.state,
  });
}

function sendSnapshot(connection: MahjongSocket): void {
  if (connection.closed) return;
  const result = lobby.snapshot(connection.roomId, connection.auth, connection.clientId);
  if (isLobbyError(result)) {
    sendJson(connection, { type: 'error', ok: false, code: result.code, message: result.message });
    closeConnection(connection);
    return;
  }
  sendJson(connection, { type: 'snapshot', ok: true, ...result });
}

function sendJson(connection: MahjongSocket, payload: unknown): void {
  if (connection.closed) return;
  sendFrame(connection.socket, Buffer.from(JSON.stringify(payload)), 1);
}

function sendFrame(socket: Duplex, payload: Buffer, opcode: number): void {
  const header: number[] = [0x80 | opcode];
  if (payload.length < 126) {
    header.push(payload.length);
  } else if (payload.length < 65536) {
    header.push(126, (payload.length >> 8) & 0xff, payload.length & 0xff);
  } else {
    header.push(127, 0, 0, 0, 0);
    header.push((payload.length >> 24) & 0xff, (payload.length >> 16) & 0xff, (payload.length >> 8) & 0xff, payload.length & 0xff);
  }
  socket.write(Buffer.concat([Buffer.from(header), payload]));
}

function closeConnection(connection: MahjongSocket): void {
  if (connection.closed) return;
  connection.closed = true;
  sendFrame(connection.socket, Buffer.alloc(0), 8);
  connection.socket.end();
}

function normalizeRoomId(value: unknown): string {
  const text = String(value || '').trim();
  return /^\d{6}$/.test(text) ? text : '';
}

function normalizeClientId(value: unknown): string {
  return String(value || '').trim().replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 64);
}
