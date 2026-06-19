import type { Client } from 'colyseus';
import { Room } from 'colyseus';
import type { AuthContext } from '@repo/auth';
import { createDevTokenVerifier } from '@repo/auth/server';
import { readBooleanEnv } from '@repo/config';
import {
  CLIENT_MESSAGES,
  SERVER_MESSAGES,
  type JoinRoomOptions,
  type MoveMessage,
  type PlayerJoinedMessage,
  type PlayerLeftMessage,
} from '@repo/shared';
import { clampNumber, requireString } from '@repo/validators';
import { authTokenService } from '../auth/service.js';
import { GameState, Player } from '../schemas/GameState.js';

const MAX_SPEED = 1;
const WORLD_LIMIT = 500;
const verifyDevToken = createDevTokenVerifier();
const allowDevTokens = readBooleanEnv('AUTH_ALLOW_DEV_TOKENS', true);

export class GameRoom extends Room<{ state: GameState }> {
  maxClients = 16;

  onCreate(): void {
    this.state = new GameState();
    this.setSimulationInterval((deltaTime) => this.update(deltaTime));

    this.onMessage(CLIENT_MESSAGES.Move, (client, message: MoveMessage) => {
      const player = this.state.players.get(client.sessionId);
      if (!player) {
        return;
      }

      player.vx = clampNumber(message.x, -MAX_SPEED, MAX_SPEED);
      player.vy = clampNumber(message.y, -MAX_SPEED, MAX_SPEED);
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
    const player = new Player();
    player.id = auth.userId;
    player.name = requireString(options.name, auth.displayName, 24);
    player.x = Math.round(Math.random() * 100);
    player.y = Math.round(Math.random() * 100);

    this.state.players.set(client.sessionId, player);
    this.broadcast(
      SERVER_MESSAGES.PlayerJoined,
      { id: client.sessionId, name: player.name } satisfies PlayerJoinedMessage,
      { except: client },
    );
  }

  onLeave(client: Client): void {
    this.state.players.delete(client.sessionId);
    this.broadcast(SERVER_MESSAGES.PlayerLeft, { id: client.sessionId } satisfies PlayerLeftMessage);
  }

  private update(deltaTime: number): void {
    const deltaSeconds = deltaTime / 1000;
    this.state.elapsedTime += deltaSeconds;

    this.state.players.forEach((player: Player) => {
      player.x = clampNumber(player.x + player.vx * 180 * deltaSeconds, -WORLD_LIMIT, WORLD_LIMIT);
      player.y = clampNumber(player.y + player.vy * 180 * deltaSeconds, -WORLD_LIMIT, WORLD_LIMIT);
    });
  }
}
