export type EnvSource = Record<string, string | undefined>;

function defaultEnv(): EnvSource {
  return (globalThis as { process?: { env?: EnvSource } }).process?.env ?? {};
}

export function readStringEnv(name: string, fallback: string, source: EnvSource = defaultEnv()): string {
  const value = source[name];
  return value === undefined || value.length === 0 ? fallback : value;
}

export function requireStringEnv(name: string, source: EnvSource = defaultEnv()): string {
  const value = source[name];

  if (value === undefined || value.length === 0) {
    throw new Error(`Missing required env: ${name}`);
  }

  return value;
}

export function readNumberEnv(name: string, fallback: number, source: EnvSource = defaultEnv()): number {
  const value = source[name];

  if (value === undefined || value.length === 0) {
    return fallback;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function readBooleanEnv(name: string, fallback: boolean, source: EnvSource = defaultEnv()): boolean {
  const value = source[name];

  if (value === undefined || value.length === 0) {
    return fallback;
  }

  return ['1', 'true', 'yes', 'on'].includes(value.toLowerCase());
}
