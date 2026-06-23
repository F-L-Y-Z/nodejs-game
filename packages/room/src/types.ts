import type { AuthContext } from '@repo/auth';

export type RoomStatus = 'waiting' | 'playing' | 'settling' | 'closed';

export type RoomAuthContext = Pick<AuthContext, 'userId' | 'displayName' | 'roles' | 'gameId' | 'avatarUrl'>;

export type RoomSeatInfo = {
  isHuman: boolean;
  userId?: string | null;
};

export const ROOM_ERROR_CODES = {
  AccountReplaced: 'account_replaced',
  InvalidRoomPassword: 'invalid_room_password',
  RoomFull: 'room_full',
  RoomClosed: 'room_closed',
} as const;

export const ROOM_CLOSE_CODES = {
  Normal: 1000,
  InvalidRoomPassword: 4403,
  RoomFull: 4400,
  AccountReplaced: 4409,
} as const;

export type RoomErrorCode = (typeof ROOM_ERROR_CODES)[keyof typeof ROOM_ERROR_CODES];
