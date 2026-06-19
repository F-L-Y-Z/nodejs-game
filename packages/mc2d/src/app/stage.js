import Container from '../display/container'
import Rect from '../math/rect'

export default class Stage extends Container {
  constructor(app) {
    super()
    this.app = app
    this.touchEnabled = true
    this.setStage(this)
    this.viewport = new Rect()
    this.renderRequested = true
  }

  resize(width, height) {
    this.setFrame(0, 0, width, height)
    this.viewport.set(0, 0, width, height)
    this.worldBounds.set(0, 0, width, height)
    this.renderRequested = true
  }

  requestRender() {
    this.renderRequested = true
  }

  layoutTree() {
    this.layoutSelf(this.viewport, 0, 0)
  }

  renderStage(ctx) {
    const {width, height} = this.viewport
    if (width <= 0 || height <= 0) return
    ctx.clearRect(0, 0, width, height)
    this.children.forEach(child => child.render(ctx))
    if (this.app.sharedCanvas) ctx.drawImage(this.app.sharedCanvas, 0, 0, width, height)
    this.renderRequested = false
    this.dirtyPaint = false
  }
}
