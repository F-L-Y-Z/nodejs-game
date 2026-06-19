import { readStringEnv } from '@repo/config';

const WECHAT_CODE_TO_SESSION_URL = 'https://api.weixin.qq.com/sns/jscode2session';

export type WechatSession = {
  openid: string;
  sessionKey: string;
  unionid?: string;
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

export async function exchangeWechatMiniGameCode(code: string): Promise<WechatSession> {
  const appId = readStringEnv('WECHAT_MINIGAME_APP_ID', '');
  const appSecret = readStringEnv('WECHAT_MINIGAME_APP_SECRET', '');

  if (!appId || !appSecret) {
    throw new WechatAuthError('Wechat Mini Game credentials are not configured.', 500);
  }

  const url = new URL(WECHAT_CODE_TO_SESSION_URL);
  url.searchParams.set('appid', appId);
  url.searchParams.set('secret', appSecret);
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
