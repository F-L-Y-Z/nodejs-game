import {
  WechatAuthError,
  createWechatUserId,
  exchangeWechatMiniGameCode,
  type AuthTokenService,
} from '@repo/auth/server';
import { ERROR_CODES, type ErrorResponse } from '@repo/shared';
import type { Logger } from '@repo/logger';
import { requireString } from '@repo/validators';
import type { Express, Request, Response } from 'express';

type WechatMiniGameLoginResponse = {
  ok: true;
  token: string;
  gameId: string;
  user: {
    id: string;
    displayName: string;
    avatarUrl?: string;
  };
};

export type AuthRouteOptions = {
  logger: Logger;
  wechatLogger: Logger;
};

export function registerAuthRoutes(app: Express, tokenService: AuthTokenService, options: AuthRouteOptions): void {
  app.post('/auth/wechat/minigame/login', async (request: Request, response: Response) => {
    const requestId = createRequestId();
    const gameId = requireString(request.body?.gameId, '', 64);
    const code = requireString(request.body?.code, '', 256);
    const displayName = requireString(request.body?.name, 'Wechat Player', 24);
    const avatarUrl = requireString(request.body?.avatarUrl, '', 512);

    options.logger.info('Wechat Mini Game login request received.', {
      requestId,
      gameId: gameId || undefined,
      hasCode: Boolean(code),
      displayName,
      hasAvatarUrl: Boolean(avatarUrl),
    });

    if (!isValidGameId(gameId)) {
      options.logger.warn('Wechat Mini Game login rejected: invalid gameId.', {
        requestId,
        gameId: gameId || undefined,
      });
      response.status(400).json(errorResponse(ERROR_CODES.ValidationFailed, 'Missing gameId.'));
      return;
    }

    if (!code) {
      options.logger.warn('Wechat Mini Game login rejected: missing code.', {
        requestId,
        gameId,
      });
      response.status(400).json(errorResponse(ERROR_CODES.ValidationFailed, 'Missing login code.'));
      return;
    }

    try {
      const session = await exchangeWechatMiniGameCode(gameId, code, options.wechatLogger);
      const userId = createWechatUserId(gameId, session.openid);
      const token = tokenService.sign({
        userId,
        displayName,
        roles: ['player'],
        gameId,
        avatarUrl,
      });

      options.logger.info('Wechat Mini Game login succeeded.', {
        requestId,
        gameId,
        userId,
        hasUnionid: Boolean(session.unionid),
        hasAvatarUrl: Boolean(avatarUrl),
      });

      response.json({
        ok: true,
        token,
        gameId,
        user: {
          id: userId,
          displayName,
          avatarUrl,
        },
      } satisfies WechatMiniGameLoginResponse);
    } catch (error) {
      if (error instanceof WechatAuthError) {
        options.logger.warn('Wechat Mini Game login failed.', {
          requestId,
          gameId,
          status: error.status,
          message: error.message,
        });
        response.status(error.status).json(errorResponse(errorCodeForStatus(error.status), error.message));
        return;
      }

      options.logger.error('Wechat Mini Game login failed unexpectedly.', {
        requestId,
        gameId,
        error: error instanceof Error ? error.message : String(error),
      });
      response.status(500).json(errorResponse(ERROR_CODES.Internal, 'Login failed.'));
    }
  });
}

function isValidGameId(value: string): boolean {
  return /^[a-zA-Z0-9_-]{1,64}$/.test(value);
}

function createRequestId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function errorCodeForStatus(status: number): ErrorResponse['code'] {
  if (status >= 500) return ERROR_CODES.Internal;
  if (status === 400) return ERROR_CODES.ValidationFailed;
  return ERROR_CODES.InvalidToken;
}

function errorResponse(code: ErrorResponse['code'], message: string): ErrorResponse {
  return {
    ok: false,
    code,
    message,
  };
}
