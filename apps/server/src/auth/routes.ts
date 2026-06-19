import { ERROR_CODES, type ErrorResponse } from '@repo/shared';
import { requireString } from '@repo/validators';
import type { Express, Request, Response } from 'express';
import type { AuthTokenService } from './token.js';
import { WechatAuthError, exchangeWechatMiniGameCode } from './wechat.js';

type WechatMiniGameLoginResponse = {
  ok: true;
  token: string;
  gameId: string;
  user: {
    id: string;
    displayName: string;
  };
};

export function registerAuthRoutes(app: Express, tokenService: AuthTokenService): void {
  app.post('/auth/wechat/minigame/login', async (request: Request, response: Response) => {
    const gameId = requireString(request.body?.gameId, '', 64);
    const code = requireString(request.body?.code, '', 256);
    const displayName = requireString(request.body?.name, 'Wechat Player', 24);

    if (!isValidGameId(gameId)) {
      response.status(400).json(errorResponse(ERROR_CODES.ValidationFailed, 'Missing gameId.'));
      return;
    }

    if (!code) {
      response.status(400).json(errorResponse(ERROR_CODES.ValidationFailed, 'Missing login code.'));
      return;
    }

    try {
      const session = await exchangeWechatMiniGameCode(gameId, code);
      const userId = `wechat:${gameId}:${session.openid}`;
      const token = tokenService.sign({
        userId,
        displayName,
        roles: ['player'],
        gameId,
      });

      response.json({
        ok: true,
        token,
        gameId,
        user: {
          id: userId,
          displayName,
        },
      } satisfies WechatMiniGameLoginResponse);
    } catch (error) {
      if (error instanceof WechatAuthError) {
        response.status(error.status).json(errorResponse(errorCodeForStatus(error.status), error.message));
        return;
      }

      response.status(500).json(errorResponse(ERROR_CODES.Internal, 'Login failed.'));
    }
  });
}

function isValidGameId(value: string): boolean {
  return /^[a-zA-Z0-9_-]{1,64}$/.test(value);
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
