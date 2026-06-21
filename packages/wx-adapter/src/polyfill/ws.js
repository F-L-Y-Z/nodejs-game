class WxWebSocket {
  static CONNECTING = 0;
  static OPEN = 1;
  static CLOSING = 2;
  static CLOSED = 3;

  CONNECTING = 0;
  OPEN = 1;
  CLOSING = 2;
  CLOSED = 3;

  constructor(url, protocols) {
    this.url = url;
    this.protocol = '';
    this.extensions = '';
    this.binaryType = 'arraybuffer';
    this.readyState = WxWebSocket.CONNECTING;
    this.bufferedAmount = 0;

    this.onopen = null;
    this.onmessage = null;
    this.onerror = null;
    this.onclose = null;

    this._listeners = {
      open: new Set(),
      message: new Set(),
      error: new Set(),
      close: new Set(),
    };

    this._socketTask = wx.connectSocket({
      url,
      // 目前发现连接 colyseus 如下句传递 protocols 时，client的create、joinOrCreate、joinById将一直pending
      //protocols: Array.isArray(protocols) ? protocols : protocols ? [protocols] : undefined,
      success: () => {
        //
      },
      fail: (err) => {
        this._emit('error', err);
      },
    });

    this._socketTask.onOpen((res) => {
      this.readyState = WxWebSocket.OPEN;
      this._emit('open', {
        type: 'open',
        target: this,
        ...res,
      });
    });

    this._socketTask.onMessage((res) => {
      this._emit('message', {
        type: 'message',
        target: this,
        data: res.data,
      });
    });

    this._socketTask.onError((err) => {
      this._emit('error', {
        type: 'error',
        target: this,
        error: err,
        message: err?.errMsg,
      });
    });

    this._socketTask.onClose((res) => {
      this.readyState = WxWebSocket.CLOSED;

      this._emit('close', {
        type: 'close',
        target: this,
        code: res?.code ?? 1000,
        reason: res?.reason ?? '',
        wasClean: true,
      });
    });
  }

  send(data) {
    if (this.readyState !== WxWebSocket.OPEN) {
      throw new Error('WebSocket is not open');
    }

    const sendData = this._normalizeSendData(data);

    this._socketTask.send({
      data: sendData,
      fail: (err) => {
        this._emit('error', {
          type: 'error',
          target: this,
          error: err,
          message: err?.errMsg,
        });
      },
    });
  }

  close(code = 1000, reason = '') {
    if (this.readyState === WxWebSocket.CLOSING || this.readyState === WxWebSocket.CLOSED) {
      return;
    }

    this.readyState = WxWebSocket.CLOSING;

    this._socketTask.close({
      code,
      reason,
      fail: (err) => {
        this._emit('error', {
          type: 'error',
          target: this,
          error: err,
          message: err?.errMsg,
        });
      },
    });
  }

  addEventListener(type, listener) {
    this._listeners[type]?.add(listener);
  }

  removeEventListener(type, listener) {
    this._listeners[type]?.delete(listener);
  }

  dispatchEvent(event) {
    this._emit(event.type, event);
    return true;
  }

  _emit(type, event) {
    const handler = this[`on${type}`];
    if (typeof handler === 'function') {
      handler.call(this, event);
    }

    const listeners = this._listeners[type];
    if (listeners) {
      listeners.forEach((listener) => {
        if (typeof listener === 'function') {
          listener.call(this, event);
        } else if (listener && typeof listener.handleEvent === 'function') {
          listener.handleEvent(event);
        }
      });
    }
  }

  _normalizeSendData(data) {
    // Colyseus / msgpack 经常会发 Uint8Array
    if (data instanceof Uint8Array) {
      return data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength);
    }

    if (Array.isArray(data)) {
      return new Uint8Array(data).buffer;
    }

    if (data instanceof ArrayBuffer) {
      return data;
    }

    // DataView / Int8Array / Uint16Array 等
    if (ArrayBuffer.isView(data)) {
      return data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength);
    }

    // string
    return data;
  }
}

globalThis.WebSocket = WxWebSocket;

export default WxWebSocket;
