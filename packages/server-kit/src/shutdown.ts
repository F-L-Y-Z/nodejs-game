export type ShutdownHandler = () => Promise<void> | void;

export function registerShutdownHandlers(handler: ShutdownHandler): void {
  const runtime = (globalThis as {
    process?: {
      once(signal: string, listener: () => void): void;
      exit(code?: number): never;
    };
  }).process;

  if (!runtime) {
    return;
  }

  const signals = ['SIGINT', 'SIGTERM'];

  for (const signal of signals) {
    runtime.once(signal, async () => {
      await handler();
      runtime.exit(0);
    });
  }
}
