import Unit from './unit'

const ANCHORS = {
  'top-left': [0, 0],
  top: [0.5, 0],
  'top-center': [0.5, 0],
  'top-right': [1, 0],
  left: [0, 0.5],
  'middle-left': [0, 0.5],
  center: [0.5, 0.5],
  middle: [0.5, 0.5],
  right: [1, 0.5],
  'middle-right': [1, 0.5],
  'bottom-left': [0, 1],
  bottom: [0.5, 1],
  'bottom-center': [0.5, 1],
  'bottom-right': [1, 1]
}

export default class AnchorLayout {
  constructor(options = {}) {
    this.anchor = options.anchor || 'top-left'
    this.x = Unit.parse(options.x || 0)
    this.y = Unit.parse(options.y || 0)
    this.width = Unit.parse(options.width === undefined ? '100%' : options.width)
    this.height = Unit.parse(options.height === undefined ? '100%' : options.height)
  }

  applyTo(target, parentBounds) {
    const anchor = ANCHORS[this.anchor] || ANCHORS.center
    const width = this.width.resolve(parentBounds.width, target.width)
    const height = this.height.resolve(parentBounds.height, target.height)
    const offsetX = this.x.resolve(parentBounds.width)
    const offsetY = this.y.resolve(parentBounds.height)
    target.x = (parentBounds.width - width) * anchor[0] + offsetX
    target.y = (parentBounds.height - height) * anchor[1] + offsetY
    target.width = width
    target.height = height
  }
}
