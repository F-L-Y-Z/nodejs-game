import { readBooleanEnv, readStringEnv } from '@repo/config';

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

export async function exchangeWechatMiniGameCode(gameId: string, code: string): Promise<WechatSession> {
  if (readBooleanEnv('WECHAT_MINIGAME_MOCK_LOGIN', false)) {
    return createMockWechatSession(gameId, code);
  }

  const config = readWechatMiniGameConfig(gameId);

  const url = new URL(WECHAT_CODE_TO_SESSION_URL);
  url.searchParams.set('appid', config.appId);
  url.searchParams.set('secret', config.appSecret);
  url.searchParams.set('js_code', code);
  url.searchParams.set('grant_type', 'authorization_code');

  const response = await fetch(url);

  if (!response.ok) {
    throw new WechatAuthError('Wechat code exchange request failed.', 502, {
      status: response.status,
    });
  }

  const data = (await response.json()) as WechatCodeToSessionResponse;

  if (data.errcode !== undefined && data.errcode !== 0) {
    throw new WechatAuthError('Wechat rejected login code.', 401, data);
  }

  if (!data.openid || !data.session_key) {
    throw new WechatAuthError('Wechat code exchange response is incomplete.', 502, data);
  }

  return {
    openid: data.openid,
    sessionKey: data.session_key,
    unionid: data.unionid,
  };
}

function readWechatMiniGameConfig(gameId: string): WechatMiniGameConfig {
  const appsConfig = readStringEnv('WECHAT_MINIGAME_APPS', '');

  if (appsConfig) {
    return readWechatMiniGameConfigMap(appsConfig, gameId);
  }

  const appId = readStringEnv('WECHAT_MINIGAME_APP_ID', '');
  const appSecret = readStringEnv('WECHAT_MINIGAME_APP_SECRET', '');

  if (!appId || !appSecret) {
    throw new WechatAuthError('Wechat Mini Game credentials are not configured.', 500);
  }

  return { appId, appSecret };
}

function readWechatMiniGameConfigMap(value: string, gameId: string): WechatMiniGameConfig {
  let configMap: unknown;

  try {
    configMap = JSON.parse(value);
  } catch {
    throw new WechatAuthError('WECHAT_MINIGAME_APPS must be valid JSON.', 500);
  }

  if (!isRecord(configMap)) {
    throw new WechatAuthError('WECHAT_MINIGAME_APPS must be a JSON object.', 500);
  }

  const config = configMap[gameId];
  if (!isRecord(config)) {
    throw new WechatAuthError(`Wechat Mini Game config is not found for gameId: ${gameId}.`, 400);
  }

  const appId = typeof config.appId === 'string' ? config.appId.trim() : '';
  const appSecret = typeof config.appSecret === 'string' ? config.appSecret.trim() : '';

  if (!appId || !appSecret) {
    throw new WechatAuthError(`Wechat Mini Game config is incomplete for gameId: ${gameId}.`, 500);
  }

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
