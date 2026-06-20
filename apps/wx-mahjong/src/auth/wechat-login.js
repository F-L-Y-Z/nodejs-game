import { GAME_ID, SERVER_BASE_URL } from '../config.js';

const AUTH_STORAGE_KEY = 'wxMahjong.authSession';

export function getCachedAuthSession(app, options = {}) {
  try {
    const gameId = getGameId(options);
    const session = app.platform.getStorage ? app.platform.getStorage(AUTH_STORAGE_KEY) : null;
    if (session && session.gameId === gameId && session.token && session.user) return session;
  } catch (error) {
    // Ignore broken local storage; the next login will refresh the session.
  }
  return null;
}

export async function loginWechatMiniGame(app, options = {}) {
  const gameId = getGameId(options);
  const userProfile = normalizeUserProfile(options.userInfo);
  const loginInfo = await app.platformLogin();
  if (!loginInfo || !loginInfo.code) {
    throw new Error('wx.login did not return a code.');
  }

  const loginUrl = `${getServerBaseUrl(options)}/auth/wechat/minigame/login`;
  console.info('[wx-mahjong] wechat login request', {
    gameId,
    url: loginUrl,
    hasAvatarUrl: Boolean(userProfile.avatarUrl),
  });

  let response = null;
  try {
    response = await app.request({
      url: loginUrl,
      method: 'POST',
      header: {
        'content-type': 'application/json',
      },
      data: {
        gameId,
        code: loginInfo.code,
        name: options.name || userProfile.nickName || 'player',
        avatarUrl: userProfile.avatarUrl || '',
      },
    });
  } catch (error) {
    console.warn('[wx-mahjong] wechat login request failed', {
      gameId,
      url: loginUrl,
      errMsg: error && error.errMsg,
      errno: error && error.errno,
    });
    throw error;
  }

  const data = response && response.data;
  if (!response || response.statusCode < 200 || response.statusCode >= 300 || !data || !data.ok || !data.token) {
    throw new Error((data && data.message) || 'Wechat login request failed.');
  }

  const session = {
    gameId,
    token: data.token,
    user: data.user,
  };

  if (app.platform.setStorage) {
    app.platform.setStorage(AUTH_STORAGE_KEY, session);
  }

  return session;
}

function getServerBaseUrl(options) {
  const value = options.serverBaseUrl || globalThis.__WX_MAHJONG_SERVER_URL__ || SERVER_BASE_URL;
  return String(value).replace(/\/+$/, '');
}

function getGameId(options) {
  return String(options.gameId || globalThis.__WX_MAHJONG_GAME_ID__ || GAME_ID);
}

function normalizeUserProfile(value) {
  const userInfo = value && value.userInfo ? value.userInfo : value;
  return {
    nickName: (userInfo && userInfo.nickName) || '',
    avatarUrl: (userInfo && userInfo.avatarUrl) || '',
  };
}
