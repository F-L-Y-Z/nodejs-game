import { NumericRoomIdAllocator } from '@repo/room';

const roomIdAllocator = new NumericRoomIdAllocator();

export function createUniqueMahjongRoomId(): string {
  return roomIdAllocator.allocate();
}

export function releaseMahjongRoomId(roomId: string): void {
  roomIdAllocator.release(roomId);
}
