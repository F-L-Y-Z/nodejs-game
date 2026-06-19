export * from './errors.js';
export * from './protocol.js';

export type HealthResponse = {
  ok: boolean;
  service: string;
  uptime: number;
};

export const SERVICE_NAME = 'colyseus-node-game-server';
