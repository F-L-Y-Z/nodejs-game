import Graphic from './graphic'

export default class Sprite extends Graphic {
  constructor(assetManager, src = '', options = {}) {
    super(Object.assign({
      fit: 'stretch',
      sourceX: 0,
      sourceY: 0,
      sourceWidth: 0,
      sourceHeight: 0,
      type: ''
    }, options))
    this.assetManager = assetManager
    this.asset = null
    this._src = ''
    if (src) this.src = src
  }

  get src() {
    return this._src
  }

  set src(value) {
    if (value === this._src) return
    this._src = value
    this.asset = value ? this.assetManager.image(value, this.options.type) : null
    if (this.asset) {
      this.asset.promise.then(() => this.invalidatePaint()).catch(() => this.invalidatePaint())
    }
    this.invalidatePaint()
  }

  draw(ctx) {
    const asset = this.asset
    if (!asset || asset.status !== 'loaded') return
    const image = asset.image
    let sx = this.options.sourceX
    let sy = this.options.sourceY
    let sw = this.options.sourceWidth || asset.width
    let sh = this.options.sourceHeight || asset.height
    let dx = 0
    let dy = 0
    let dw = this.width
    let dh = this.height

    if ((this.options.fit === 'contain' || this.options.fit === 'cover') && sw > 0 && sh > 0) {
      const sourceRatio = sw / sh
      const targetRatio = this.width / this.height
      const scaleByHeight = this.options.fit === 'contain'
        ? targetRatio > sourceRatio
        : targetRatio < sourceRatio
      if (scaleByHeight) {
        dw = this.height * sourceRatio
        dx = (this.width - dw) / 2
      } else {
        dh = this.width / sourceRatio
        dy = (this.height - dh) / 2
      }
    } else if (this.options.fit === 'center') {
      dw = sw
      dh = sh
      dx = (this.width - dw) / 2
      dy = (this.height - dh) / 2
    }

    ctx.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh)
  }
}
