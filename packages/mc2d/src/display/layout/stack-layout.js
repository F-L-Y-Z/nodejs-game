import Unit from './unit';

export default class StackLayout {
  constructor(options = {}) {
    this.direction = options.direction || 'vertical';
    this.gap = options.gap || 0;
    this.padding = options.padding || 0;
    this.itemWidth = Unit.parse(options.itemWidth, 0);
    this.itemHeight = Unit.parse(options.itemHeight, 0);
  }

  applyTo() {}

  layoutChildren(target) {
    if (!target.children) return;
    const horizontal = this.direction === 'horizontal';
    let cursor = this.padding;
    target.children.forEach((child) => {
      if (!child.visible) return;
      child.x = horizontal ? cursor : this.padding;
      child.y = horizontal ? this.padding : cursor;
      if (horizontal && this.itemWidth.valid) child.width = this.itemWidth.resolve(target.width);
      if (!horizontal && this.itemHeight.valid) child.height = this.itemHeight.resolve(target.height);
      cursor += (horizontal ? child.width : child.height) + this.gap;
    });
  }
}
