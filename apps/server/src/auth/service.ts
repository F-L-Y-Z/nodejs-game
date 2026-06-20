import { createConsoleLogger } from '@repo/logger';
import { SERVICE_NAME } from '@repo/shared';
import { createAuthTokenService } from './token.js';

export const authRouteLogger = createConsoleLogger(`${SERVICE_NAME}:auth:routes`);
export const authWechatLogger = createConsoleLogger(`${SERVICE_NAME}:auth:wechat`);
export const authTokenService = createAuthTokenService(createConsoleLogger(`${SERVICE_NAME}:auth:token`));
