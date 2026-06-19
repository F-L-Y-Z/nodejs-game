export type Validator<T> = (value: unknown) => value is T;

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

export function isNumberInRange(value: unknown, min: number, max: number): value is number {
  return isFiniteNumber(value) && value >= min && value <= max;
}

export function clampNumber(value: unknown, min: number, max: number, fallback = 0): number {
  if (!isFiniteNumber(value)) {
    return fallback;
  }

  return Math.max(min, Math.min(max, value));
}

export function requireString(value: unknown, fallback: string, maxLength = 128): string {
  if (typeof value !== 'string') {
    return fallback;
  }

  const normalized = value.trim().slice(0, maxLength);
  return normalized.length > 0 ? normalized : fallback;
}
