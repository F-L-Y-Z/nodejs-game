export default class PointerEvent {
  constructor(type, data) {
    this.type = type
    this.pointerId = data.pointerId || 0
    this.x = data.x
    this.y = data.y
    this.startX = data.startX
    this.startY = data.startY
    this.deltaX = data.deltaX || 0
    this.deltaY = data.deltaY || 0
    this.target = data.target || null
    this.currentTarget = null
    this.originalEvent = data.originalEvent || null
    this.propagationStopped = false
  }

  stopPropagation() {
    this.propagationStopped = true
  }
}
