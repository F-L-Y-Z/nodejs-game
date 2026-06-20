import { readBooleanEnv, readStringEnv } from '@repo/config';
import type { Logger } from '@repo/logger';
import { noopLogger } from '@repo/logger';

const WECHAT_CODE_TO_SESSION_URL = 'https://api.weixin.qq.com/sns/jscode2session';

export type WechatSession = {
  openid: string;
  sessionKey: string;
  unionid?: string;
};

type WechatMiniGameConfig = {
  appId: string;
  appSecret: string;
};

type WechatCodeToSessionResponse = {
  openid?: string;
  session_key?: string;
  unionid?: string;
  errcode?: number;
  errmsg?: string;
};

export class WechatAuthError extends Error {
  readonly status: number;
  readonly detail?: unknown;

  constructor(message: string, status: number, detail?: unknown) {
    super(message);
    this.name = 'WechatAuthError';
    this.status = status;
    this.detail = detail;
  }
}

export async function exchangeWechatMiniGameCode(
  gameId: string,
  code: string,
  logger: Logger = noopLogger,
): Promise<WechatSession> {
  if (readBooleanEnv('WECHAT_MINIGAME_MOCK_LOGIN', false)) {
    logger.warn('Wechat Mini Game mock login enabled.', {
      gameId,
      codeLength: code.length,
    });
    return createMockWechatSession(gameId, code);
  }

  const config = readWechatMiniGameConfig(gameId, logger);
  logger.info('Exchanging Wechat Mini Game login code.', {
    gameId,
    appId: maskAppId(config.appId),
    codeLength: code.length,
  });

  const url = new URL(WECHAT_CODE_TO_SESSION_URL);
  url.searchParams.set('appid', config.appId);
  url.searchParams.set('secret', config.appSecret);
  url.searchParams.set('js_code', code);
  url.searchParams.set('grant_type', 'authorization_code');

  const response = await fetch(url);

  if (!response.ok) {
    logger.warn('Wechat Mini Game code exchange HTTP request failed.', {
      gameId,
      status: response.status,
    });
    throw new WechatAuthError('Wechat code exchange request failed.', 502, {
      status: response.status,
    });
  }

  const data = (await response.json()) as WechatCodeToSessionResponse;

  if (data.errcode !== undefined && data.errcode !== 0) {
    logger.warn('Wechat Mini Game rejected login code.', {
      gameId,
      errcode: data.errcode,
      errmsg: data.errmsg,
    });
    throw new WechatAuthError('Wechat rejected login code.', 401, data);
  }

  if (!data.openid || !data.session_key) {
    logger.warn('Wechat Mini Game code exchange response is incomplete.', {
      gameId,
      hasOpenid: Boolean(data.openid),
      hasSessionKey: Boolean(data.session_key),
      hasUnionid: Boolean(data.unionid),
    });
    throw new WechatAuthError('Wechat code exchange response is incomplete.', 502, data);
  }

  logger.info('Wechat Mini Game code exchange succeeded.', {
    gameId,
    openid: maskOpenid(data.openid),
    hasUnionid: Boolean(data.unionid),
  });

  return {
    openid: data.openid,
    sessionKey: data.session_key,
    unionid: data.unionid,
  };
}

function readWechatMiniGameConfig(gameId: string, logger: Logger): WechatMiniGameConfig {
  const appsConfig = readStringEnv('WECHAT_MINIGAME_APPS', '');

  if (appsConfig) {
    logger.debug('Using WECHAT_MINIGAME_APPS config map.', { gameId });
    return readWechatMiniGameConfigMap(appsConfig, gameId, logger);
  }

  const appId = readStringEnv('WECHAT_MINIGAME_APP_ID', '');
  const appSecret = readStringEnv('WECHAT_MINIGAME_APP_SECRET', '');

  if (!appId || !appSecret) {
    logger.error('Wechat Mini Game single-app credentials are not configured.', {
      gameId,
      hasAppId: Boolean(appId),
      hasAppSecret: Boolean(appSecret),
    });
    throw new WechatAuthError('Wechat Mini Game credentials are not configured.', 500);
  }

  logger.debug('Using single Wechat Mini Game credential config.', {
    gameId,
    appId: maskAppId(appId),
  });

  return { appId, appSecret };
}

function readWechatMiniGameConfigMap(value: string, gameId: string, logger: Logger): WechatMiniGameConfig {
  let configMap: unknown;

  try {
    configMap = JSON.parse(value);
  } catch {
    logger.error('WECHAT_MINIGAME_APPS is not valid JSON.', { gameId });
    throw new WechatAuthError('WECHAT_MINIGAME_APPS must be valid JSON.', 500);
  }

  if (!isRecord(configMap)) {
    logger.error('WECHAT_MINIGAME_APPS is not a JSON object.', { gameId });
    throw new WechatAuthError('WECHAT_MINIGAME_APPS must be a JSON object.', 500);
  }

  const config = configMap[gameId];
  if (!isRecord(config)) {
    logger.warn('Wechat Mini Game config not found for gameId.', {
      gameId,
      availableGameIds: Object.keys(configMap),
    });
    throw new WechatAuthError(`Wechat Mini Game config is not found for gameId: ${gameId}.`, 400);
  }

  const appId = typeof config.appId === 'string' ? config.appId.trim() : '';
  const appSecret = typeof config.appSecret === 'string' ? config.appSecret.trim() : '';

  if (!appId || !appSecret) {
    logger.error('Wechat Mini Game config is incomplete.', {
      gameId,
      hasAppId: Boolean(appId),
      hasAppSecret: Boolean(appSecret),
    });
    throw new WechatAuthError(`Wechat Mini Game config is incomplete for gameId: ${gameId}.`, 500);
  }

  logger.debug('Wechat Mini Game config selected.', {
    gameId,
    appId: maskAppId(appId),
  });

  return { appId, appSecret };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function createMockWechatSession(gameId: string, code: string): WechatSession {
  const normalizedGameId = gameId.trim().replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 32);
  const normalizedCode = code.trim().replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 32);
  const suffix = normalizedCode || String(Date.now());

  return {
    openid: `mock-${normalizedGameId || 'game'}-${suffix}`,
    sessionKey: 'mock-session-key',
  };
}

function maskAppId(value: string): string {
  return maskValue(value, 4, 4);
}

function maskOpenid(value: string): string {
  return maskValue(value, 4, 4);
}

function maskValue(value: string, prefixLength: number, suffixLength: number): string {
  if (value.length <= prefixLength + suffixLength) {
    return '*'.repeat(value.length);
  }

  return `${value.slice(0, prefixLength)}...${value.slice(-suffixLength)}`;
}
