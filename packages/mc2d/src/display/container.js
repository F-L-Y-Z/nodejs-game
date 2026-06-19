import DisplayObject from './display-object'

export default class Container extends DisplayObject {
  constructor() {
    super()
    this.children = []
    this.childLayout = null
  }

  get numChildren() {
    return this.children.length
  }

  setChildLayout(layout) {
    this.childLayout = layout
    this.invalidateLayout()
    return this
  }

  setStage(stage) {
    super.setStage(stage)
    this.children.forEach(child => child.setStage(stage))
  }

  addChild(child) {
    if (child.parent === this) return child
    if (child.parent) child.parent.removeChild(child)
    child.parent = this
    child.setStage(this.stage)
    this.children.push(child)
    this.invalidateLayout()
    return child
  }

  addChildAt(child, index) {
    if (child.parent) child.parent.removeChild(child)
    child.parent = this
    child.setStage(this.stage)
    this.children.splice(index, 0, child)
    this.invalidateLayout()
    return child
  }

  getChild(index) {
    return this.children[index] || null
  }

  setOrder(child, order) {
    const index = this.children.indexOf(child)
    if (index < 0) return child
    this.children.splice(index, 1)
    this.children.splice(Math.max(0, Math.min(order, this.children.length)), 0, child)
    this.invalidatePaint()
    return child
  }

  removeChild(child) {
    const index = this.children.indexOf(child)
    if (index < 0) return child
    this.children.splice(index, 1)
    child.parent = null
    child.setStage(null)
    this.invalidateLayout()
    return child
  }

  removeChildren() {
    this.children.slice().forEach(child => this.removeChild(child))
  }

  forEach(handler) {
    this.children.forEach(child => {
      if (handler(child)) return
      if (child.forEach) child.forEach(handler)
    })
  }

  bubble(handler) {
    for (let i = this.children.length - 1; i >= 0; i--) {
      const child = this.children[i]
      if (child.bubble && child.bubble(handler)) return true
      if (handler(child)) return true
    }
    return false
  }

  update(dt) {
    this.children.forEach(child => child.update(dt))
  }

  layoutSelf(parentBounds, parentWorldX = 0, parentWorldY = 0) {
    super.layoutSelf(parentBounds, parentWorldX, parentWorldY)
    if (this.childLayout) this.childLayout.layoutChildren(this)
    else if (this.layout && this.layout.layoutChildren) this.layout.layoutChildren(this)
    const childParentBounds = this.worldBounds
    this.children.forEach(child => {
      child.layoutSelf(childParentBounds, this.worldBounds.x, this.worldBounds.y)
    })
  }

  render(ctx) {
    if (!this.visible || this.alpha <= 0) return
    ctx.save()
    ctx.globalAlpha *= this.alpha
    ctx.translate(this.x, this.y)
    ctx.scale(this.scaleX, this.scaleY)
    this.draw(ctx)
    this.children.forEach(child => child.render(ctx))
    ctx.restore()
    this.dirtyPaint = false
  }

  hitTest(x, y) {
    if (!this.visible || !this.containsPoint(x, y)) return null
    for (let i = this.children.length - 1; i >= 0; i--) {
      const target = this.children[i].hitTest(x, y)
      if (target) return target
    }
    return this.touchEnabled ? this : null
  }
}
