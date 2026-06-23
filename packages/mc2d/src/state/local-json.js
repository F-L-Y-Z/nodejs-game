import observable from './observable';

const cache = Object.create(null);

function readStorage(platform, name) {
  if (platform && platform.getStorage) return platform.getStorage(name);
  try {
    return globalThis.localStorage ? globalThis.localStorage.getItem(name) : '';
  } catch (e) {
    return '';
  }
}

function writeStorage(platform, name, value) {
  if (platform && platform.setStorage) {
    platform.setStorage(name, value);
    return;
  }
  try {
    if (globalThis.localStorage) globalThis.localStorage.setItem(name, value);
  } catch (e) {}
}

function removeStorage(platform, name) {
  if (platform && platform.removeStorage) {
    platform.removeStorage(name);
    return;
  }
  try {
    if (globalThis.localStorage) globalThis.localStorage.removeItem(name);
  } catch (e) {}
}

class LocalJson {
  constructor(name, getDefaultValue, platform = null, delay = 200) {
    this.name = name;
    this.platform = platform;
    this.delay = delay;
    this.getDefaultValue = getDefaultValue || (() => ({}));
    this.timer = 0;
    this.reload();
  }

  scheduleSave() {
    if (this.timer) return;
    this.timer = setTimeout(() => {
      this.timer = 0;
      writeStorage(this.platform, this.name, JSON.stringify(this.cache));
    }, this.delay);
  }

  reload() {
    const defaults = this.getDefaultValue();
    let value = defaults;
    const raw = readStorage(this.platform, this.name);
    if (raw) {
      try {
        value = Object.assign({}, defaults, typeof raw === 'string' ? JSON.parse(raw) : raw);
      } catch (e) {
        value = defaults;
      }
    }
    this.cache = value;
    this.json = observable(this.cache);
    this.json.on('*', () => this.scheduleSave());
    return this;
  }

  destroy() {
    if (this.timer) clearTimeout(this.timer);
    this.timer = 0;
    removeStorage(this.platform, this.name);
    return this.reload();
  }
}

export default function localJson(name, getDefaultValue = null, options = {}) {
  const key = options.platform ? `${name}:platform` : name;
  if (!cache[key]) {
    cache[key] = new LocalJson(name, getDefaultValue, options.platform || null, options.delay || 200);
  }
  return cache[key];
}
