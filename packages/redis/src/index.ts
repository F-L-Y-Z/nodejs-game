export type CacheSetOptions = {
  ttlSeconds?: number;
};

export type CacheClient = {
  get(key: string): Promise<string | null>;
  set(key: string, value: string, options?: CacheSetOptions): Promise<void>;
  del(key: string): Promise<void>;
};

export type PubSubClient = {
  publish(channel: string, message: string): Promise<void>;
  subscribe(channel: string, handler: (message: string) => void): Promise<() => Promise<void>>;
};

export type LockClient = {
  withLock<T>(key: string, ttlMs: number, handler: () => Promise<T>): Promise<T>;
};

export class MissingRedisClientError extends Error {
  constructor() {
    super('Redis client is not configured.');
    this.name = 'MissingRedisClientError';
  }
}
