import { createWechatUserId, exchangeWechatMiniGameCode, WechatAuthError } from '@repo/auth/server';
import { createConsoleLogger } from '@repo/logger';
import { ERROR_CODES, type ErrorResponse, SERVICE_NAME } from '@repo/shared';
import { requireString } from '@repo/validators';
import { createEndpoint } from 'colyseus';
import { authTokenService } from '../service.js';

const logger = createConsoleLogger(`${SERVICE_NAME}:auth:routes`);
const wechatLogger = createConsoleLogger(`${SERVICE_NAME}:auth:wechat`);

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

export default function () {
  return createEndpoint(
    '/auth/wechat/minigame/login',
    {
      method: 'POST',
    },
    async (ctx) => {
      const requestId = createRequestId();
      const gameId = requireString(ctx.body?.gameId, '', 64);
      const code = requireString(ctx.body?.code, '', 256);
      const displayName = requireString(ctx.body?.name, 'Wechat Player', 24);
      const avatarUrl = requireString(ctx.body?.avatarUrl, '', 512);

      logger.info('Wechat Mini Game login request received.', {
        requestId,
        gameId: gameId || undefined,
        hasCode: Boolean(code),
        displayName,
        hasAvatarUrl: Boolean(avatarUrl),
      });

      if (!isValidGameId(gameId)) {
        logger.warn('Wechat Mini Game login rejected: invalid gameId.', {
          requestId,
          gameId: gameId || undefined,
        });
        ctx.setStatus(400);
        return errorResponse(ERROR_CODES.ValidationFailed, 'Missing gameId.');
      }

      if (!code) {
        logger.warn('Wechat Mini Game login rejected: missing code.', {
          requestId,
          gameId,
        });
        ctx.setStatus(400);
        return errorResponse(ERROR_CODES.ValidationFailed, 'Missing login code.');
      }

      try {
        const session = await exchangeWechatMiniGameCode(gameId, code, wechatLogger);
        const userId = createWechatUserId(gameId, session.openid);
        const token = authTokenService.sign({ userId, displayName, roles: ['player'], gameId, avatarUrl });

        logger.info('Wechat Mini Game login succeeded.', {
          requestId,
          gameId,
          userId,
          hasUnionid: Boolean(session.unionid),
          hasAvatarUrl: Boolean(avatarUrl),
        });

        return { ok: true, token, gameId, user: { id: userId, displayName, avatarUrl } };
      } catch (error) {
        if (error instanceof WechatAuthError) {
          logger.warn('Wechat Mini Game login failed.', {
            requestId,
            gameId,
            status: error.status,
            message: error.message,
          });
          ctx.setStatus(403); //error.status
          return errorResponse(errorCodeForStatus(error.status), error.message);
        }

        logger.error('Wechat Mini Game login failed unexpectedly.', {
          requestId,
          gameId,
          error: error instanceof Error ? error.message : String(error),
        });
        ctx.setStatus(500);
        return errorResponse(ERROR_CODES.Internal, 'Login failed.');
      }
    },
  );
}
