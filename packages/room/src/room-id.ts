export type NumericRoomIdAllocatorOptions = {
  min?: number;
  max?: number;
  initialValue?: number;
};

export const DEFAULT_ROOM_ID_LENGTH = 6;
export const ROOM_ID_PATTERN = /^\d{6}$/;
export const DEFAULT_ROOM_ID_MIN = 100000;
export const DEFAULT_ROOM_ID_MAX = 999999;

export class NumericRoomIdAllocator {
  private readonly min: number;
  private readonly max: number;
  private readonly width: number;
  private nextValue: number;
  private allocatedRoomIds = new Set<string>();

  constructor(options: NumericRoomIdAllocatorOptions = {}) {
    this.min = normalizeRoomIdBoundary(options.min, DEFAULT_ROOM_ID_MIN);
    this.max = normalizeRoomIdBoundary(options.max, DEFAULT_ROOM_ID_MAX);

    if (this.min > this.max) {
      throw new Error('Room ID allocator min cannot be greater than max.');
    }

    this.width = String(this.max).length;
    this.nextValue = this.normalizeInitialValue(options.initialValue);
  }

  allocate(): string {
    if (this.allocatedRoomIds.size >= this.capacity) {
      throw new Error('No room IDs available.');
    }

    for (let scanned = 0; scanned < this.capacity; scanned += 1) {
      const roomId = this.format(this.nextValue);
      this.advance();

      if (this.allocatedRoomIds.has(roomId)) continue;

      this.allocatedRoomIds.add(roomId);
      return roomId;
    }

    throw new Error('No room IDs available.');
  }

  reserve(roomId: string): boolean {
    if (!this.isInRange(roomId) || this.allocatedRoomIds.has(roomId)) return false;
    this.allocatedRoomIds.add(roomId);
    return true;
  }

  release(roomId: string): void {
    this.allocatedRoomIds.delete(roomId);
  }

  has(roomId: string): boolean {
    return this.allocatedRoomIds.has(roomId);
  }

  get size(): number {
    return this.allocatedRoomIds.size;
  }

  get capacity(): number {
    return this.max - this.min + 1;
  }

  private advance(): void {
    this.nextValue = this.nextValue >= this.max ? this.min : this.nextValue + 1;
  }

  private format(value: number): string {
    return String(value).padStart(this.width, '0');
  }

  private isInRange(roomId: string): boolean {
    if (!/^\d+$/.test(roomId)) return false;
    const value = Number(roomId);
    return value >= this.min && value <= this.max;
  }

  private normalizeInitialValue(value: unknown): number {
    const numberValue = normalizeRoomIdBoundary(value, this.min);
    if (numberValue < this.min || numberValue > this.max) return this.min;
    return numberValue;
  }
}

export function isValidRoomId(value: unknown): value is string {
  return typeof value === 'string' && ROOM_ID_PATTERN.test(value);
}

function normalizeRoomIdBoundary(value: unknown, defaultValue: number): number {
  const numberValue = Number(value);
  if (!Number.isFinite(numberValue)) return defaultValue;
  return Math.floor(numberValue);
}
