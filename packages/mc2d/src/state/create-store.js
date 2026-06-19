import EventEmitter from './event-emitter'
import observable from './observable'

export default function createStore(data = {}) {
  const events = new EventEmitter()
  const store = observable(data)
  const wrappers = []

  store.on('*', (prop, value) => {
    events.emit(prop, value, store)
  })
  store.watch = handlers => {
    Object.entries(handlers || {}).forEach(([key, handler]) => {
      const wrapped = (value, target) => handler(value, target)
      wrappers.push({key, handler, wrapped})
      events.on(key, wrapped)
    })
    return store
  }
  store.unwatch = (key, handler) => {
    for (let i = wrappers.length - 1; i >= 0; i--) {
      const item = wrappers[i]
      if (item.key === key && (!handler || item.handler === handler)) {
        events.off(item.key, item.wrapped)
        wrappers.splice(i, 1)
      }
    }
    return store
  }
  store.clear = () => {
    events.removeAllListeners()
    wrappers.length = 0
    return store
  }
  return store
}
