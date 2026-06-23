export type MetricTags = Record<string, string | number | boolean>;

export type Metrics = {
  increment(name: string, value?: number, tags?: MetricTags): void;
  gauge(name: string, value: number, tags?: MetricTags): void;
  timing(name: string, milliseconds: number, tags?: MetricTags): void;
};

export const noopMetrics: Metrics = {
  increment: () => undefined,
  gauge: () => undefined,
  timing: () => undefined,
};
