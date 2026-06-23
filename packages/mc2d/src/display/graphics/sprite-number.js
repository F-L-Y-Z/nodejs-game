import Graphic from './graphic';

export default class SpriteNumber extends Graphic {
  constructor(assetManager, assetForDigit, value = 0, type = '') {
    super();
    this.assetManager = assetManager;
    this.assetForDigit = assetForDigit;
    this.type = type;
    this.assets = [];
    this.sourceWidth = 0;
    this.sourceHeight = 0;
    this._value = null;
    this.value = value;
  }

  get value() {
    return this._value;
  }

  set value(next) {
    if (this._value === next || isNaN(next)) return;
    this._value = next;
    this.assets = String(next)
      .split('')
      .map((char) => {
        const key = this.assetForDigit(char);
        return this.assetManager.image(key, this.type);
      });
    Promise.all(this.assets.map((asset) => asset.promise))
      .then((records) => {
        this.sourceWidth = records.reduce((sum, item) => sum + item.width, 0);
        this.sourceHeight = records.reduce((height, item) => Math.max(height, item.height), 0);
        this.invalidatePaint();
      })
      .catch(() => this.invalidatePaint());
  }

  draw(ctx) {
    if (!this.sourceWidth || !this.sourceHeight) return;
    const scale = this.height / this.sourceHeight;
    let x = (this.width - this.sourceWidth * scale) / 2;
    this.assets.forEach((asset) => {
      if (asset.status !== 'loaded') return;
      const width = asset.width * scale;
      ctx.drawImage(asset.image, x, 0, width, this.height);
      x += width;
    });
  }
}
