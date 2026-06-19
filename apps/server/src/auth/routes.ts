import { ERROR_CODES, type ErrorResponse } from '@repo/shared';
import { requireString } from '@repo/validators';
import type { Express, Request, Response } from 'express';
import type { AuthTokenService } from './token.js';
import { WechatAuthError, exchangeWechatMiniGameCode } from './wechat.js';

type WechatMiniGameLoginResponse = {
  ok: true;
  token: string;
  user: {
    id: string;
    displayName: string;
  };
};

export function registerAuthRoutes(app: Express, tokenService: AuthTokenService): void {
  app.post('/auth/wechat/minigame/login', async (request: Request, response: Response) => {
    const code = requireString(request.body?.code, '', 256);
    const displayName = requireString(request.body?.name, 'Wechat Player', 24);

    if (!code) {
      response.status(400).json(errorResponse(ERROR_CODES.ValidationFailed, 'Missing login code.'));
      return;
    }

    try {
      const session = await exchangeWechatMiniGameCode(code);
      const userId = `wechat:${session.openid}`;
      const token = tokenService.sign({
        userId,
        displayName,
        roles: ['player'],
      });

      response.json({
        ok: true,
        token,
        user: {
          id: userId,
          displayName,
        },
      } satisfies WechatMiniGameLoginResponse);
    } catch (error) {
      if (error instanceof WechatAuthError) {
        response
          .status(error.status)
          .json(errorResponse(ERROR_CODES.InvalidToken, error.message));
        return;
      }

      response.status(500).json(errorResponse(ERROR_CODES.Internal, 'Login failed.'));
    }
  });
}

function errorResponse(code: ErrorResponse['code'], message: string): ErrorResponse {
  return {
    ok: false,
    code,
    message,
  };
}
