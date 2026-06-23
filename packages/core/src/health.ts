import type { HealthResponse } from '@repo/shared';

export function createHealthResponse(service: string, uptime: number): HealthResponse {
  return {
    ok: true,
    service,
    uptime,
  };
}
