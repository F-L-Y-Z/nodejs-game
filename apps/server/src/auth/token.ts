import type { AuthContext, TokenVerifier } from '@repo/auth';
import { invalidTokenError, missingTokenError } from '@repo/auth';
import { readNumberEnv, readStringEnv } from '@repo/config';
import type { Logger } from '@repo/logger';
import { createHmac, timingSafeEqual } from 'node:crypto';

const TOKEN_PREFIX = 'game.v1';
const DEFAULT_TTL_SECONDS = 7 * 24 * 60 * 60;

type TokenPayload = {
  sub: string;
  name: string;
  avatarUrl?: string;
  roles: AuthContext['roles'];
  gameId?: string;
  provider: 'wechat_minigame';
  iat: number;
  exp: number;
};

export type AuthTokenService = {
  sign(context: Pick<AuthContext, 'userId' | 'displayName' | 'roles' | 'gameId' | 'avatarUrl'>): string;
  verify: TokenVerifier;
};

export function createAuthTokenService(logger: Logger): AuthTokenService {
  const nodeEnv = readStringEnv('NODE_ENV', 'development');
  const configuredSecret = readStringEnv('AUTH_TOKEN_SECRET', '');
  const secret = configuredSecret || 'dev-auth-token-secret';
  const ttlSeconds = readNumberEnv('AUTH_TOKEN_TTL_SECONDS', DEFAULT_TTL_SECONDS);

  if (!configuredSecret) {
    if (nodeEnv === 'production') {
      throw new Error('Missing required env: AUTH_TOKEN_SECRET');
    }

    logger.warn('AUTH_TOKEN_SECRET is not set; using development token secret.');
  }
  logger.info('Auth token service initialized.', {
    ttlSeconds,
    usingConfiguredSecret: Boolean(configuredSecret),
  });

  function sign(context: Pick<AuthContext, 'userId' | 'displayName' | 'roles' | 'gameId' | 'avatarUrl'>): string {
    const now = Math.floor(Date.now() / 1000);
    const payload: TokenPayload = {
      sub: context.userId,
      name: context.displayName,
      avatarUrl: context.avatarUrl,
      roles: context.roles,
      gameId: context.gameId,
      provider: 'wechat_minigame',
      iat: now,
      exp: now + ttlSeconds,
    };
    const encodedPayload = encodeBase64Url(JSON.stringify(payload));
    const signature = signPayload(encodedPayload, secret);

    logger.info('Auth token issued.', {
      userId: context.userId,
      gameId: context.gameId,
      roles: context.roles,
      hasAvatarUrl: Boolean(context.avatarUrl),
      expiresAt: payload.exp,
    });

    return `${TOKEN_PREFIX}.${encodedPayload}.${signature}`;
  }

  async function verify(token: string | undefined): Promise<AuthContext> {
    if (!token) {
      logger.warn('Auth token verification failed: missing token.');
      throw missingTokenError();
    }

    const parts = token.split('.');
    if (parts.length !== 4 || `${parts[0]}.${parts[1]}` !== TOKEN_PREFIX) {
      logger.warn('Auth token verification failed: invalid token format.');
      throw invalidTokenError();
    }

    const [, , encodedPayload, signature] = parts;
    const expectedSignature = signPayload(encodedPayload, secret);

    if (!safeEqual(signature, expectedSignature)) {
      logger.warn('Auth token verification failed: signature mismatch.');
      throw invalidTokenError();
    }

    const payload = parsePayload(encodedPayload);
    const now = Math.floor(Date.now() / 1000);

    if (payload.exp <= now) {
      logger.warn('Auth token verification failed: token expired.', {
        userId: payload.sub,
        gameId: payload.gameId,
        expiresAt: payload.exp,
      });
      throw invalidTokenError();
    }

    logger.debug('Auth token verified.', {
      userId: payload.sub,
      gameId: payload.gameId,
      roles: payload.roles,
    });

    return {
      userId: payload.sub,
      displayName: payload.name,
      roles: payload.roles,
      gameId: payload.gameId,
      avatarUrl: payload.avatarUrl,
    };
  }

  return { sign, verify };
}

function signPayload(encodedPayload: string, secret: string): string {
  return createHmac('sha256', secret).update(`${TOKEN_PREFIX}.${encodedPayload}`).digest('base64url');
}

function safeEqual(value: string, expected: string): boolean {
  const valueBuffer = Buffer.from(value);
  const expectedBuffer = Buffer.from(expected);

  return valueBuffer.length === expectedBuffer.length && timingSafeEqual(valueBuffer, expectedBuffer);
}

function encodeBase64Url(value: string): string {
  return Buffer.from(value, 'utf8').toString('base64url');
}

function parsePayload(encodedPayload: string): TokenPayload {
  try {
    const decoded = Buffer.from(encodedPayload, 'base64url').toString('utf8');
    const value = JSON.parse(decoded) as Partial<TokenPayload>;

    if (
      typeof value.sub !== 'string' ||
      value.sub.length === 0 ||
      typeof value.name !== 'string' ||
      (value.avatarUrl !== undefined && typeof value.avatarUrl !== 'string') ||
      !Array.isArray(value.roles) ||
      !value.roles.every((role) => role === 'player' || role === 'admin' || role === 'guest') ||
      (value.gameId !== undefined && typeof value.gameId !== 'string') ||
      value.provider !== 'wechat_minigame' ||
      typeof value.iat !== 'number' ||
      typeof value.exp !== 'number'
    ) {
      throw invalidTokenError();
    }

    return value as TokenPayload;
  } catch (error) {
    if (error instanceof Error && error.name === 'AuthError') {
      throw error;
    }

    throw invalidTokenError();
  }
}
