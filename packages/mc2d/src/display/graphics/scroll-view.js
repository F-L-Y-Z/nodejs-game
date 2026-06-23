import Container from '../container';

export default class ScrollView extends Container {
  constructor(options = {}) {
    super();
    this.touchEnabled = true;
    this.content = new Container();
    this.addChild(this.content);
    this.scrollY = 0;
    this.targetScrollY = 0;
    this.contentHeight = options.contentHeight || 0;
    this.bounce = options.bounce === undefined ? 0.2 : options.bounce;
    this.smooth = options.smooth === undefined ? 0.25 : options.smooth;
    this.on('pointerdown', (event) => this.handleDown(event));
    this.on('pointermove', (event) => this.handleMove(event));
    this.on('pointerup', () => this.handleEnd());
    this.on('pointercancel', () => this.handleEnd());
  }

  get maxScrollY() {
    return Math.max(0, this.contentHeight - this.height);
  }

  addContent(child) {
    return this.content.addChild(child);
  }

  setContentHeight(height) {
    this.contentHeight = Math.max(0, height);
    this.targetScrollY = Math.max(0, Math.min(this.maxScrollY, this.targetScrollY));
    this.invalidateLayout();
    return this;
  }

  handleDown(event) {
    this.startScrollY = this.targetScrollY;
    this.lastPointerY = event.y;
  }

  handleMove(event) {
    const delta = event.y - this.lastPointerY;
    this.lastPointerY = event.y;
    const edge = this.height * this.bounce;
    this.targetScrollY = Math.max(-edge, Math.min(this.maxScrollY + edge, this.targetScrollY - delta));
    this.invalidateLayout();
    event.stopPropagation();
  }

  handleEnd() {
    this.targetScrollY = Math.max(0, Math.min(this.maxScrollY, this.targetScrollY));
  }

  update(dt) {
    this.scrollY += (this.targetScrollY - this.scrollY) * this.smooth;
    if (Math.abs(this.targetScrollY - this.scrollY) < 0.1) this.scrollY = this.targetScrollY;
    this.content.update(dt);
    this.invalidateLayout();
  }

  layoutSelf(parentBounds, parentWorldX = 0, parentWorldY = 0) {
    super.layoutSelf(parentBounds, parentWorldX, parentWorldY);
    this.content.setFrame(0, -this.scrollY, this.width, Math.max(this.height, this.contentHeight));
    this.content.layoutSelf(this.worldBounds, this.worldBounds.x, this.worldBounds.y);
  }

  render(ctx) {
    if (!this.visible || this.alpha <= 0) return;
    ctx.save();
    ctx.globalAlpha *= this.alpha;
    ctx.translate(this.x, this.y);
    ctx.beginPath();
    ctx.rect(0, 0, this.width, this.height);
    ctx.clip();
    this.draw(ctx);
    this.content.render(ctx);
    ctx.restore();
    this.dirtyPaint = false;
  }
}
