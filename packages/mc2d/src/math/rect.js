export default class Rect {
  constructor(x = 0, y = 0, width = 0, height = 0) {
    this.set(x, y, width, height)
  }

  set(x = 0, y = 0, width = 0, height = 0) {
    this.x = x
    this.y = y
    this.width = width
    this.height = height
    return this
  }

  copyFrom(rect) {
    return this.set(rect.x, rect.y, rect.width, rect.height)
  }

  clone() {
    return new Rect(this.x, this.y, this.width, this.height)
  }

  equals(rect) {
    return (
      this.x === rect.x &&
      this.y === rect.y &&
      this.width === rect.width &&
      this.height === rect.height
    )
  }

  contains(x, y) {
    return (
      x >= this.x &&
      y >= this.y &&
      x <= this.x + this.width &&
      y <= this.y + this.height
    )
  }

  get empty() {
    return this.width <= 0 || this.height <= 0
  }
}
