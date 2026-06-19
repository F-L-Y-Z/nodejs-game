import { createConsoleLogger } from '@repo/logger';
import { SERVICE_NAME } from '@repo/shared';
import { createAuthTokenService } from './token.js';

export const authTokenService = createAuthTokenService(createConsoleLogger(`${SERVICE_NAME}:auth`));
