import Unit from './unit';

export default class BoxLayout {
  constructor(options = {}) {
    this.left = Unit.parse(options.left, 0);
    this.right = Unit.parse(options.right, 0);
    this.top = Unit.parse(options.top, 0);
    this.bottom = Unit.parse(options.bottom, 0);
    this.width = Unit.parse(options.width, 0);
    this.height = Unit.parse(options.height, 0);
  }

  applyTo(target, parentBounds) {
    const hasLeft = this.left.valid;
    const hasRight = this.right.valid;
    const hasTop = this.top.valid;
    const hasBottom = this.bottom.valid;
    const left = this.left.resolve(parentBounds.width);
    const right = this.right.resolve(parentBounds.width);
    const top = this.top.resolve(parentBounds.height);
    const bottom = this.bottom.resolve(parentBounds.height);

    target.width = hasLeft && hasRight ? parentBounds.width - left - right : this.width.resolve(parentBounds.width, target.width);
    target.height = hasTop && hasBottom ? parentBounds.height - top - bottom : this.height.resolve(parentBounds.height, target.height);
    if (hasLeft) target.x = left;
    else if (hasRight) target.x = parentBounds.width - right - target.width;

    if (hasTop) target.y = top;
    else if (hasBottom) target.y = parentBounds.height - bottom - target.height;
  }
}
