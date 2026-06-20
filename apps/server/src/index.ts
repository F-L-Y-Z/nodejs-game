import './env.js';
import { monitor } from '@colyseus/monitor';
import { WebSocketTransport } from '@colyseus/ws-transport';
import { readNumberEnv } from '@repo/config';
import { createConsoleLogger } from '@repo/logger';
import { registerHealthRoute } from '@repo/server-kit/express';
import { ROOM_NAMES, SERVICE_NAME } from '@repo/shared';
import { Server } from 'colyseus';
import cors from 'cors';
import express from 'express';
import { createServer } from 'node:http';
import { registerAuthRoutes } from './auth/routes.js';
import { authRouteLogger, authTokenService, authWechatLogger } from './auth/service.js';
import { MahjongRoom } from './rooms/mahjong-room.js';

const port = readNumberEnv('PORT', 2567);
const logger = createConsoleLogger(SERVICE_NAME);

const app = express();
app.use(cors());
app.use(express.json());

registerHealthRoute(app, {
  service: SERVICE_NAME,
  getUptime: () => process.uptime(),
});
registerAuthRoutes(app, authTokenService, {
  logger: authRouteLogger,
  wechatLogger: authWechatLogger,
});

const httpServer = createServer(app);

const colyseusTransport = new WebSocketTransport({
  server: httpServer,
});

const gameServer = new Server({
  transport: colyseusTransport,
});

gameServer.define(ROOM_NAMES.Mahjong, MahjongRoom);

app.use('/colyseus', monitor());

await gameServer.listen(port);

logger.info(`Colyseus server listening on http://localhost:${port}`);
logger.info(`Monitor available at http://localhost:${port}/colyseus`);
