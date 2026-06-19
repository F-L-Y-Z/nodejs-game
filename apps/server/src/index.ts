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
import { authTokenService } from './auth/service.js';
import { GameRoom } from './rooms/GameRoom.js';

const port = readNumberEnv('PORT', 2567);
const logger = createConsoleLogger(SERVICE_NAME);

const app = express();
app.use(cors());
app.use(express.json());

registerHealthRoute(app, {
  service: SERVICE_NAME,
  getUptime: () => process.uptime(),
});
registerAuthRoutes(app, authTokenService);

const httpServer = createServer(app);

const gameServer = new Server({
  transport: new WebSocketTransport({
    server: httpServer,
  }),
});

gameServer.define(ROOM_NAMES.Game, GameRoom);

app.use('/colyseus', monitor());

await gameServer.listen(port);

logger.info(`Colyseus server listening on http://localhost:${port}`);
logger.info(`Monitor available at http://localhost:${port}/colyseus`);
