import { createAuthTokenService } from '@repo/auth/server';
import { createConsoleLogger } from '@repo/core';
import { SERVICE_NAME } from '@repo/shared';


export const authTokenService = createAuthTokenService(createConsoleLogger(`${SERVICE_NAME}:auth:token`));
