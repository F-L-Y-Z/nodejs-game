import { invalidTokenError, missingTokenError } from './errors.js';
import type { AuthContext, TokenVerifier } from './types.js';

export type DevTokenVerifierOptions = {
  prefix?: string;
};

export function createDevTokenVerifier(options: DevTokenVerifierOptions = {}): TokenVerifier {
  const prefix = options.prefix ?? 'dev:';

  return async (token) => {
    if (!token) {
      throw missingTokenError();
    }

    if (!token.startsWith(prefix)) {
      throw invalidTokenError();
    }

    const userId = token.slice(prefix.length).trim();

    if (!userId) {
      throw invalidTokenError();
    }

    return {
      userId,
      displayName: userId,
      roles: ['player'],
    } satisfies AuthContext;
  };
}

export async function allowGuest(token: string | undefined): Promise<AuthContext> {
  return {
    userId: token?.trim() || `guest-${Date.now()}`,
    displayName: 'Guest',
    roles: ['guest'],
  };
}
