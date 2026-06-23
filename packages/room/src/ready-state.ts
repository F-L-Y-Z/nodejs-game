import type { RoomSeatInfo } from './types.js';

export class RoomReadyState {
  private readonly readyUserIds = new Set<string>();

  markReady(userId: string): void {
    this.readyUserIds.add(userId);
  }

  delete(userId: string): void {
    this.readyUserIds.delete(userId);
  }

  clear(): void {
    this.readyUserIds.clear();
  }

  has(userId: string): boolean {
    return this.readyUserIds.has(userId);
  }

  readySeatCount(seats: readonly RoomSeatInfo[]): number {
    return seats.filter((seat) => !seat.isHuman || this.readyUserIds.has(seat.userId || '')).length;
  }

  allHumanSeatsReady(seats: readonly RoomSeatInfo[], humanCount: number): boolean {
    return humanCount > 0 && seats.every((seat) => !seat.isHuman || this.readyUserIds.has(seat.userId || ''));
  }
}
