import { createAuthTokenService } from '@repo/auth/server';
import { createConsoleLogger } from '@repo/logger';
import { SERVICE_NAME } from '@repo/shared';

export const authRouteLogger = createConsoleLogger(`${SERVICE_NAME}:auth:routes`);
export const authWechatLogger = createConsoleLogger(`${SERVICE_NAME}:auth:wechat`);
export const authTokenService = createAuthTokenService(createConsoleLogger(`${SERVICE_NAME}:auth:token`));
