import Graphic from './graphic'

export default class Sequence extends Graphic {
  constructor(assetManager, imageList = [], onStop = null) {
    super()
    this.assetManager = assetManager
    this.onStop = onStop
    this.assets = []
    this.index = -1
    this.count = 0
    this.playing = false
    if (imageList.length) this.init(imageList)
  }

  init(imageList, type = '') {
    this.index = -1
    this.assets = imageList.map(key => this.assetManager.image(key, type))
    this.count = this.assets.length
    Promise.all(this.assets.map(asset => asset.promise)).then(() => this.invalidatePaint()).catch(() => this.invalidatePaint())
    return this
  }

  play(speed = 1, loop = false, index = -1) {
    if (this.count === 0) return this
    this.speed = speed
    this.loop = loop
    this.index = index
    this.playing = true
    this.invalidatePaint()
    return this
  }

  stop() {
    this.playing = false
    this.index = -1
    this.invalidatePaint()
    if (this.onStop) this.onStop()
    return this
  }

  update() {
    if (!this.playing || this.count === 0) return
    this.index += this.speed
    if (this.loop) this.index %= this.count
    else if (this.index >= this.count) {
      this.stop()
      return
    }
    this.invalidatePaint()
  }

  draw(ctx) {
    const asset = this.assets[Math.floor(this.index)]
    if (!asset || asset.status !== 'loaded') return
    ctx.drawImage(asset.image, 0, 0, this.width, this.height)
  }
}
