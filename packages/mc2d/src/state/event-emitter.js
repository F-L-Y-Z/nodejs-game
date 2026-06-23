export default class EventEmitter {
  constructor() {
    this.listeners = Object.create(null);
  }

  on(type, handler) {
    if (!this.listeners[type]) this.listeners[type] = [];
    this.listeners[type].push(handler);
    return () => this.off(type, handler);
  }

  once(type, handler) {
    const off = this.on(type, (...args) => {
      off();
      handler(...args);
    });
    return off;
  }

  off(type, handler) {
    const listeners = this.listeners[type];
    if (!listeners) return;
    const index = listeners.indexOf(handler);
    if (index >= 0) listeners.splice(index, 1);
    if (listeners.length === 0) delete this.listeners[type];
  }

  emit(type, ...args) {
    const listeners = this.listeners[type];
    if (!listeners) return false;
    listeners.slice().forEach((handler) => handler(...args));
    return true;
  }

  removeAllListeners(type = null) {
    if (type) delete this.listeners[type];
    else this.listeners = Object.create(null);
  }
}
