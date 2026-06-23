function fallbackRequestAnimationFrame(handler) {
  return setTimeout(() => handler(Date.now()), 16);
}

function fallbackCancelAnimationFrame(id) {
  clearTimeout(id);
}

const WeChatAdapter = {
  onShow(handler) {
    if (!wx.onShow) return null;
    wx.onShow(handler);
    return wx.offShow ? () => wx.offShow(handler) : null;
  },

  onHide(handler) {
    if (!wx.onHide) return null;
    wx.onHide(handler);
    return wx.offHide ? () => wx.offHide(handler) : null;
  },

  setFPS(fps) {
    if (wx.setPreferredFramesPerSecond) wx.setPreferredFramesPerSecond(fps);
  },

  getSystemInfo() {
    const info = wx.getSystemInfoSync();
    const { windowWidth, windowHeight, safeArea } = info;
    info.safeAreaTop = safeArea ? safeArea.top : windowHeight / windowWidth > 2 ? 50 : 0;
    return info;
  },

  createCanvas() {
    return wx.createCanvas();
  },

  createImage() {
    return wx.createImage ? wx.createImage() : new Image();
  },

  createAudio() {
    return wx.createInnerAudioContext ? wx.createInnerAudioContext() : new Audio();
  },

  getOpenDataContext() {
    return wx.getOpenDataContext ? wx.getOpenDataContext() : null;
  },

  createUserInfoButton(options) {
    return wx.createUserInfoButton ? wx.createUserInfoButton(options) : null;
  },

  share(options) {
    if (wx.shareAppMessage) wx.shareAppMessage(options);
  },

  setShare(handler) {
    if (wx.showShareMenu) wx.showShareMenu({ withShareTicket: true, menus: ['shareAppMessage', 'shareTimeline'] });
    if (wx.onShareAppMessage) wx.onShareAppMessage(() => handler());
  },

  request(options) {
    if (!wx.request) return Promise.reject(new Error('wx.request is not available'));
    return new Promise((resolve, reject) => {
      wx.request(
        Object.assign({ timeout: 5000 }, options, {
          success: (result) => {
            if (options && options.success) options.success(result);
            resolve(result);
          },
          fail: (error) => {
            if (options && options.fail) options.fail(error);
            reject(error);
          },
          complete: (result) => {
            if (options && options.complete) options.complete(result);
          },
        }),
      );
    });
  },

  getSetting(options = {}) {
    if (!wx.getSetting) return Promise.reject(new Error('wx.getSetting is not available'));
    return new Promise((resolve, reject) => {
      wx.getSetting(
        Object.assign({}, options, {
          success: (result) => {
            if (options.success) options.success(result);
            resolve(result);
          },
          fail: (error) => {
            if (options.fail) options.fail(error);
            reject(error);
          },
          complete: (result) => {
            if (options.complete) options.complete(result);
          },
        }),
      );
    });
  },

  getUserInfo(options = {}) {
    if (!wx.getUserInfo) return Promise.reject(new Error('wx.getUserInfo is not available'));
    return new Promise((resolve, reject) => {
      wx.getUserInfo(
        Object.assign({}, options, {
          success: (result) => {
            if (options.success) options.success(result);
            resolve(result);
          },
          fail: (error) => {
            if (options.fail) options.fail(error);
            reject(error);
          },
          complete: (result) => {
            if (options.complete) options.complete(result);
          },
        }),
      );
    });
  },

  login(options = {}) {
    if (!wx.login) return Promise.reject(new Error('wx.login is not available'));
    return new Promise((resolve, reject) => {
      wx.login(
        Object.assign({}, options, {
          success: (result) => {
            if (options.success) options.success(result);
            resolve(result);
          },
          fail: (error) => {
            if (options.fail) options.fail(error);
            reject(error);
          },
          complete: (result) => {
            if (options.complete) options.complete(result);
          },
        }),
      );
    });
  },

  requestAnimationFrame(handler) {
    const raf =
      wx.requestAnimationFrame ||
      globalThis.requestAnimationFrame ||
      (typeof requestAnimationFrame !== 'undefined' ? requestAnimationFrame : null) ||
      fallbackRequestAnimationFrame;
    return raf(handler);
  },

  cancelAnimationFrame(id) {
    const caf =
      wx.cancelAnimationFrame ||
      globalThis.cancelAnimationFrame ||
      (typeof cancelAnimationFrame !== 'undefined' ? cancelAnimationFrame : null) ||
      fallbackCancelAnimationFrame;
    caf(id);
  },

  bindTouch(canvas, handlers) {
    if (canvas.addEventListener) {
      canvas.addEventListener('touchstart', handlers.start);
      canvas.addEventListener('touchmove', handlers.move);
      canvas.addEventListener('touchend', handlers.end);
      canvas.addEventListener('touchcancel', handlers.cancel);
      return () => {
        canvas.removeEventListener('touchstart', handlers.start);
        canvas.removeEventListener('touchmove', handlers.move);
        canvas.removeEventListener('touchend', handlers.end);
        canvas.removeEventListener('touchcancel', handlers.cancel);
      };
    }

    wx.onTouchStart(handlers.start);
    wx.onTouchMove(handlers.move);
    wx.onTouchEnd(handlers.end);
    if (wx.onTouchCancel) wx.onTouchCancel(handlers.cancel);
    return () => {
      if (wx.offTouchStart) wx.offTouchStart(handlers.start);
      if (wx.offTouchMove) wx.offTouchMove(handlers.move);
      if (wx.offTouchEnd) wx.offTouchEnd(handlers.end);
      if (wx.offTouchCancel) wx.offTouchCancel(handlers.cancel);
    };
  },

  getStorage(key) {
    try {
      return wx.getStorageSync(key);
    } catch (e) {
      return null;
    }
  },

  setStorage(key, value) {
    try {
      wx.setStorageSync(key, value);
    } catch (e) {}
  },

  removeStorage(key) {
    try {
      wx.removeStorageSync(key);
    } catch (e) {}
  },
};

export default WeChatAdapter;
