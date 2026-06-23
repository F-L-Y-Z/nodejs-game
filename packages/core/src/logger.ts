export type LogMeta = Record<string, unknown>;

export type Logger = {
  debug(message: string, meta?: LogMeta): void;
  info(message: string, meta?: LogMeta): void;
  warn(message: string, meta?: LogMeta): void;
  error(message: string, meta?: LogMeta): void;
};

export function createConsoleLogger(scope: string): Logger {
  const format = (level: string, message: string, meta?: LogMeta) => {
    const prefix = `[${scope}] ${level}: ${message}`;
    return meta === undefined ? [prefix] : [prefix, meta];
  };

  return {
    debug: (message, meta) => console.debug(...format('debug', message, meta)),
    info: (message, meta) => console.info(...format('info', message, meta)),
    warn: (message, meta) => console.warn(...format('warn', message, meta)),
    error: (message, meta) => console.error(...format('error', message, meta)),
  };
}

export const noopLogger: Logger = {
  debug: () => undefined,
  info: () => undefined,
  warn: () => undefined,
  error: () => undefined,
};
