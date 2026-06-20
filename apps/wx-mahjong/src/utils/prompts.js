/**
 * Prompt the user for room join info (roomId, password).
 * Uses WeChat mini-game modal if available, falls back to browser prompt.
 */
export function requestJoinInfo() {
  if (globalThis.wx && globalThis.wx.showModal) {
    return new Promise((resolve) => {
      globalThis.wx.showModal({
        title: '加入房间',
        placeholderText: '房间号,密码可选',
        editable: true,
        success(result) {
          resolve(result && result.confirm ? parseJoinInfo(result.content) : { roomId: '', password: '' });
        },
        fail() {
          resolve({ roomId: '', password: '' });
        },
      });
    });
  }

  if (globalThis.prompt) {
    return Promise.resolve(parseJoinInfo(globalThis.prompt('房间号,密码可选') || ''));
  }

  return Promise.resolve({ roomId: '', password: '' });
}

/**
 * Parse comma-separated join info string into { roomId, password }.
 */
export function parseJoinInfo(value) {
  const parts = String(value || '')
    .split(',')
    .map((item) => item.trim());
  return {
    roomId: parts[0] || '',
    password: parts[1] || '',
  };
}
