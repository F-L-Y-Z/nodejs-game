export type NormalizeTimeoutOptions = {
  defaultValue: number;
  min?: number;
  max?: number;
};

export function normalizeRoomString(value: unknown, maxLength: number): string {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : '';
}

export function normalizeRoomTimeoutSeconds(value: unknown, options: NormalizeTimeoutOptions): number {
  const min = options.min ?? 5;
  const max = options.max ?? 120;
  const numberValue = Number(value);

  if (!Number.isFinite(numberValue)) return options.defaultValue;

  return Math.max(min, Math.min(max, Math.round(numberValue)));
}
