import EventEmitter from './event-emitter'

export default function observable(data = {}) {
  const events = new EventEmitter()
  const proxy = new Proxy(data, {
    set(target, prop, value) {
      const oldValue = target[prop]
      const success = Reflect.set(target, prop, value)
      if (success && oldValue !== value) {
        events.emit(String(prop), value, oldValue, proxy)
        events.emit('*', String(prop), value, oldValue, proxy)
      }
      return success
    },
    deleteProperty(target, prop) {
      const oldValue = target[prop]
      const existed = Object.prototype.hasOwnProperty.call(target, prop)
      const success = Reflect.deleteProperty(target, prop)
      if (success && existed) {
        events.emit(String(prop), undefined, oldValue, proxy)
        events.emit('*', String(prop), undefined, oldValue, proxy)
      }
      return success
    }
  })

  proxy.on = events.on.bind(events)
  proxy.off = events.off.bind(events)
  proxy.once = events.once.bind(events)
  proxy.emit = events.emit.bind(events)
  return proxy
}
