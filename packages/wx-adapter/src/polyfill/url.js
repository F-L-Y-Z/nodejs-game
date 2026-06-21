class SimpleURLSearchParams {
  constructor(search = '') {
    this.params = new Map();

    if (search.startsWith('?')) {
      search = search.slice(1);
    }

    for (const pair of search.split('&')) {
      if (!pair) continue;
      const [k, v = ''] = pair.split('=');
      this.params.set(decodeURIComponent(k), decodeURIComponent(v));
    }
  }

  get(key) {
    return this.params.get(key) ?? null;
  }

  set(key, value) {
    this.params.set(key, String(value));
  }

  append(key, value) {
    this.set(key, value);
  }

  toString() {
    return [...this.params.entries()].map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`).join('&');
  }
}

class URLPolyfill {
  constructor(url) {
    this.href = url;

    const match = url.match(/^(\w+):\/\/([^/]+)(\/[^?#]*)?(\?[^#]*)?(#.*)?$/);

    if (match) {
      this.protocol = match[1] + ':';
      this.host = match[2];
      this.hostname = match[2];
      this.pathname = match[3] || '/';
      this.search = match[4] || '';
      this.hash = match[5] || '';
      this.origin = `${this.protocol}//${this.host}`;
      this.searchParams = new SimpleURLSearchParams(this.search);
    }
  }

  toString() {
    return this.href;
  }
}

globalThis.URLSearchParams = SimpleURLSearchParams;
globalThis.URL = URLPolyfill;
