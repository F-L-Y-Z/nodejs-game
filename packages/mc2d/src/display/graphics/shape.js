import Graphic from './graphic'

export default class Shape extends Graphic {
  constructor(options = {}) {
    super(Object.assign({
      shape: 'rect',
      radius: 0,
      fillStyle: '#fff',
      strokeStyle: '',
      lineWidth: 1
    }, options))
  }

  drawRoundRect(ctx, width, height, radius) {
    const r = Math.max(0, Math.min(radius, width / 2, height / 2))
    ctx.beginPath()
    ctx.moveTo(r, 0)
    ctx.lineTo(width - r, 0)
    ctx.arcTo(width, 0, width, r, r)
    ctx.lineTo(width, height - r)
    ctx.arcTo(width, height, width - r, height, r)
    ctx.lineTo(r, height)
    ctx.arcTo(0, height, 0, height - r, r)
    ctx.lineTo(0, r)
    ctx.arcTo(0, 0, r, 0, r)
    ctx.closePath()
  }

  draw(ctx) {
    const {shape, fillStyle, strokeStyle, lineWidth, radius} = this.options
    ctx.beginPath()
    if (shape === 'circle') {
      const r = Math.min(this.width, this.height) / 2
      ctx.arc(this.width / 2, this.height / 2, r, 0, Math.PI * 2)
    } else if (shape === 'ellipse') {
      ctx.ellipse(this.width / 2, this.height / 2, this.width / 2, this.height / 2, 0, 0, Math.PI * 2)
    } else if (radius > 0 || shape === 'roundRect') {
      this.drawRoundRect(ctx, this.width, this.height, radius || this.options.roundRadius || 6)
    } else {
      ctx.rect(0, 0, this.width, this.height)
    }

    if (fillStyle) {
      ctx.fillStyle = fillStyle
      ctx.fill()
    }
    if (strokeStyle && lineWidth > 0) {
      ctx.strokeStyle = strokeStyle
      ctx.lineWidth = lineWidth
      ctx.stroke()
    }
  }
}
