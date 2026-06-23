import Container from './container';
import { applyCanvasScale } from '../app/canvas-scale';

export default class CachedContainer extends Container {
  constructor() {
    super();
    this.cacheCanvas = null;
    this.cacheCtx = null;
    this.cacheWidth = 0;
    this.cacheHeight = 0;
  }

  ensureCache() {
    if (!this.stage || !this.stage.app) return false;
    const dpr = this.stage.app.pixelRatio || 1;
    const width = Math.max(1, Math.round(this.width * dpr));
    const height = Math.max(1, Math.round(this.height * dpr));
    if (!this.cacheCanvas) {
      this.cacheCanvas = this.stage.app.platform.createCanvas();
      this.cacheCtx = this.cacheCanvas.getContext('2d');
    }
    if (this.cacheWidth !== width || this.cacheHeight !== height) {
      this.cacheWidth = width;
      this.cacheHeight = height;
      this.cacheCanvas.width = width;
      this.cacheCanvas.height = height;
      applyCanvasScale(this.cacheCtx, dpr, true);
      this.dirtyPaint = true;
    }
    return true;
  }

  rebuildCache() {
    if (!this.ensureCache()) return;
    const dpr = this.stage.app.pixelRatio || 1;
    const ctx = this.cacheCtx;
    applyCanvasScale(ctx, dpr);
    ctx.clearRect(0, 0, this.width, this.height);
    this.draw(ctx);
    this.children.forEach((child) => child.render(ctx));
    this.dirtyPaint = false;
  }

  render(ctx) {
    if (!this.visible || this.alpha <= 0) return;
    if (this.dirtyPaint || !this.cacheCanvas) this.rebuildCache();
    if (!this.cacheCanvas) return;
    ctx.save();
    ctx.globalAlpha *= this.alpha;
    ctx.translate(this.x, this.y);
    ctx.scale(this.scaleX, this.scaleY);
    ctx.drawImage(this.cacheCanvas, 0, 0, this.width, this.height);
    ctx.restore();
  }
}
