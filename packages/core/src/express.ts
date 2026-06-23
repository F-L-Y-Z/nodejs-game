import { createHealthResponse } from './health.js';

export type HttpResponseLike = {
  json(body: unknown): void;
};

export type ExpressLike = {
  get(path: string, handler: (req: unknown, res: HttpResponseLike) => void): void;
};

export type RegisterHealthRouteOptions = {
  path?: string;
  service: string;
  getUptime: () => number;
};

export function registerHealthRoute(app: ExpressLike, options: RegisterHealthRouteOptions): void {
  app.get(options.path ?? '/health', (_req, res) => {
    res.json(createHealthResponse(options.service, options.getUptime()));
  });
}
