import { ERROR_CODES, type ErrorCode } from '@repo/shared';

export class AuthError extends Error {
  readonly code: ErrorCode;

  constructor(code: ErrorCode, message: string) {
    super(message);
    this.name = 'AuthError';
    this.code = code;
  }
}

export function missingTokenError(): AuthError {
  return new AuthError(ERROR_CODES.MissingToken, 'Missing auth token.');
}

export function invalidTokenError(): AuthError {
  return new AuthError(ERROR_CODES.InvalidToken, 'Invalid auth token.');
}
