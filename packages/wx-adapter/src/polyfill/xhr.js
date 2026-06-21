class WxXMLHttpRequest {
  constructor() {
    this.readyState = 0;
    this.status = 0;
    this.statusText = '';
    this.response = null;
    this.responseText = '';
    this.responseType = '';
    this.timeout = 0;
    this.withCredentials = false;

    this.onreadystatechange = null;
    this.onload = null;
    this.onerror = null;
    this.ontimeout = null;
    this.onloadend = null;

    this._method = 'GET';
    this._url = '';
    this._headers = {};
    this._aborted = false;
  }

  open(method, url, async = true) {
    this._method = method;
    this._url = url;
    this.readyState = 1;
    this._emitReadyStateChange();
  }

  setRequestHeader(name, value) {
    this._headers[name] = value;
  }

  getResponseHeader(name) {
    const key = name.toLowerCase();
    return this._responseHeaders?.[key] ?? null;
  }

  getAllResponseHeaders() {
    if (!this._responseHeadersRaw) return '';
    return Object.entries(this._responseHeadersRaw)
      .map(([k, v]) => `${k}: ${v}`)
      .join('\r\n');
  }

  send(body = null) {
    this._aborted = false;
    this.readyState = 2;
    this._emitReadyStateChange();

    wx.request({
      url: this._url,
      method: this._method,
      data: body,
      header: this._headers,
      responseType: this.responseType === 'arraybuffer' ? 'arraybuffer' : 'text',
      timeout: this.timeout || undefined,

      success: (res) => {
        if (this._aborted) return;

        this.status = res.statusCode;
        this.statusText = String(res.statusCode);

        this._responseHeadersRaw = res.header || {};
        this._responseHeaders = {};
        Object.keys(this._responseHeadersRaw).forEach((k) => {
          this._responseHeaders[k.toLowerCase()] = this._responseHeadersRaw[k];
        });

        this.readyState = 3;
        this._emitReadyStateChange();

        if (this.responseType === 'arraybuffer') {
          this.response = res.data;
          this.responseText = '';
        } else if (this.responseType === 'json') {
          this.responseText = typeof res.data === 'string' ? res.data : JSON.stringify(res.data);
          try {
            this.response = JSON.parse(this.responseText);
          } catch {
            this.response = null;
          }
        } else {
          this.responseText = typeof res.data === 'string' ? res.data : JSON.stringify(res.data);
          this.response = this.responseText;
        }

        this.readyState = 4;
        this._emitReadyStateChange();
        this.onload?.({ type: 'load', target: this });
        this.onloadend?.({ type: 'loadend', target: this });
      },

      fail: (err) => {
        if (this._aborted) return;

        const event = {
          type: err?.errMsg?.includes('timeout') ? 'timeout' : 'error',
          target: this,
          error: err,
        };

        this.readyState = 4;
        this._emitReadyStateChange();

        if (event.type === 'timeout') {
          this.ontimeout?.(event);
        } else {
          this.onerror?.(event);
        }

        this.onloadend?.({ type: 'loadend', target: this });
      },
    });
  }

  abort() {
    this._aborted = true;
    this.readyState = 0;
  }

  addEventListener(type, listener) {
    this[`on${type}`] = listener;
  }

  removeEventListener(type, listener) {
    if (this[`on${type}`] === listener) {
      this[`on${type}`] = null;
    }
  }

  _emitReadyStateChange() {
    this.onreadystatechange?.({
      type: 'readystatechange',
      target: this,
    });
  }
}

globalThis.XMLHttpRequest = WxXMLHttpRequest;

export default WxXMLHttpRequest;
