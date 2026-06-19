import EventEmitter from '../state/event-emitter'
import Rect from '../math/rect'

let nextDisplayObjectId = 1

export default class DisplayObject extends EventEmitter {
  constructor() {
    super()
    this.id = nextDisplayObjectId++
    this.name = `${this.constructor.name} ${this.id}`
    this.parent = null
    this.stage = null
    this.layout = null

    this.x = 0
    this.y = 0
    this.width = 0
    this.height = 0
    this.scaleX = 1
    this.scaleY = 1
    this.alpha = 1
    this.visible = true
    this.touchEnabled = false

    this.bounds = new Rect()
    this.worldBounds = new Rect()
    this.dirtyLayout = true
    this.dirtyPaint = true
    this.dirtyTransform = true
  }

  get tap() {
    return this._tap || null
  }

  set tap(handler) {
    if (this._tap) this.off('tap', this._tap)
    this._tap = typeof handler === 'function' ? handler : null
    if (this._tap) {
      this.touchEnabled = true
      this.on('tap', this._tap)
    }
  }

  get touchstart() {
    return this._touchstart || null
  }

  set touchstart(handler) {
    if (this._touchstart) this.off('pointerdown', this._touchstart)
    this._touchstart = typeof handler === 'function' ? handler : null
    if (this._touchstart) {
      this.touchEnabled = true
      this.on('pointerdown', this._touchstart)
    }
  }

  get touchmove() {
    return this._touchmove || null
  }

  set touchmove(handler) {
    if (this._touchmove) this.off('pointermove', this._touchmove)
    this._touchmove = typeof handler === 'function' ? handler : null
    if (this._touchmove) {
      this.touchEnabled = true
      this.on('pointermove', this._touchmove)
    }
  }

  get touchend() {
    return this._touchend || null
  }

  set touchend(handler) {
    if (this._touchend) this.off('pointerup', this._touchend)
    this._touchend = typeof handler === 'function' ? handler : null
    if (this._touchend) {
      this.touchEnabled = true
      this.on('pointerup', this._touchend)
    }
  }

  setLayout(layout) {
    this.layout = layout
    this.invalidateLayout()
    return this
  }

  setStage(stage) {
    this.stage = stage
  }

  remove() {
    if (this.parent) this.parent.removeChild(this)
    return this
  }

  setFrame(x, y, width, height) {
    if (this.x === x && this.y === y && this.width === width && this.height === height) {
      return this
    }
    this.x = x
    this.y = y
    this.width = width
    this.height = height
    this.invalidateLayout()
    return this
  }

  invalidateLayout() {
    this.dirtyLayout = true
    this.invalidateTransform()
  }

  invalidateTransform() {
    this.dirtyTransform = true
    this.invalidatePaint()
  }

  invalidatePaint() {
    this.dirtyPaint = true
    if (this.parent) this.parent.invalidatePaint()
    else if (this.stage) this.stage.requestRender()
  }

  update(dt) {}

  onScreenResize(systemInfo) {}

  measure(parentBounds) {
    if (this.layout) this.layout.applyTo(this, parentBounds)
  }

  updateWorldBounds(parentWorldX = 0, parentWorldY = 0) {
    const x = parentWorldX + this.x
    const y = parentWorldY + this.y
    this.bounds.set(this.x, this.y, this.width, this.height)
    this.worldBounds.set(x, y, this.width * this.scaleX, this.height * this.scaleY)
    this.dirtyTransform = false
  }

  layoutSelf(parentBounds, parentWorldX = 0, parentWorldY = 0) {
    this.measure(parentBounds)
    this.updateWorldBounds(parentWorldX, parentWorldY)
    this.dirtyLayout = false
  }

  render(ctx) {
    if (!this.visible || this.alpha <= 0 || this.worldBounds.empty) return
    ctx.save()
    ctx.globalAlpha *= this.alpha
    ctx.translate(this.x, this.y)
    ctx.scale(this.scaleX, this.scaleY)
    this.draw(ctx)
    ctx.restore()
    this.dirtyPaint = false
  }

  draw(ctx) {}

  containsPoint(x, y) {
    return this.visible && this.worldBounds.contains(x, y)
  }

  hitTest(x, y) {
    if (!this.touchEnabled || !this.containsPoint(x, y)) return null
    return this
  }

  dispatch(event) {
    event.currentTarget = this
    this.emit(event.type, event)
    return event.propagationStopped
  }
}
