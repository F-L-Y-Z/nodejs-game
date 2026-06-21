if (typeof globalThis.document === 'undefined') {
  globalThis.document = {
    createElement() {
      return {};
    },
    addEventListener() {},
    removeEventListener() {},
    dispatchEvent() {
      return true;
    },
    querySelector() {
      return null;
    },
    querySelectorAll() {
      return [];
    },
    body: {},
    head: {},
    documentElement: {},
    visibilityState: 'visible',
    hidden: false,
  };
}
