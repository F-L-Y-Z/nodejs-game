export type QueryParams = Record<string, unknown>;

export type DatabaseClient = {
  query<T>(operation: string, params?: QueryParams): Promise<T[]>;
  queryOne<T>(operation: string, params?: QueryParams): Promise<T | null>;
  transaction<T>(handler: (tx: DatabaseClient) => Promise<T>): Promise<T>;
};

export class MissingDatabaseClientError extends Error {
  constructor() {
    super('Database client is not configured.');
    this.name = 'MissingDatabaseClientError';
  }
}

export const missingDatabaseClient: DatabaseClient = {
  async query() {
    throw new MissingDatabaseClientError();
  },
  async queryOne() {
    throw new MissingDatabaseClientError();
  },
  async transaction() {
    throw new MissingDatabaseClientError();
  },
};
