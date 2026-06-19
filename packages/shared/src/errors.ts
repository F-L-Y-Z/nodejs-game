export const ERROR_CODES = {
  MissingToken: 'MISSING_TOKEN',
  InvalidToken: 'INVALID_TOKEN',
  Forbidden: 'FORBIDDEN',
  RoomLocked: 'ROOM_LOCKED',
  ValidationFailed: 'VALIDATION_FAILED',
  Internal: 'INTERNAL',
} as const;

export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];

export type ErrorResponse = {
  ok: false;
  code: ErrorCode;
  message: string;
};
