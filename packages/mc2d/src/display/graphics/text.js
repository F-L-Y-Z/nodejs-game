import Graphic from './graphic';

export default class Text extends Graphic {
  constructor(text = '', options = {}) {
    super(
      Object.assign(
        {
          fillStyle: '#fff',
          fontSize: 14,
          fontFamily: 'Arial',
          textAlign: 'center',
          textBaseline: 'middle',
          lineHeight: 0,
          maxLines: 0,
          ellipsis: false,
          strokeStyle: '',
          lineWidth: 1,
        },
        options,
      ),
    );
    this._text = String(text);
  }

  get text() {
    return this._text;
  }

  set text(value) {
    const next = String(value);
    if (next === this._text) return;
    this._text = next;
    this.invalidatePaint();
  }

  draw(ctx) {
    const { fillStyle, fontSize, fontFamily, textAlign, textBaseline, lineHeight, maxLines, ellipsis, strokeStyle, lineWidth } = this.options;
    let lines = this._text.split('\n');
    if (maxLines > 0 && lines.length > maxLines) {
      lines = lines.slice(0, maxLines);
      if (ellipsis) lines[lines.length - 1] += '...';
    }
    const lh = lineHeight || fontSize * 1.25;
    const totalHeight = lh * lines.length;
    let y = this.height / 2 - totalHeight / 2 + lh / 2;
    let x = this.width / 2;

    if (textAlign === 'left') x = 0;
    else if (textAlign === 'right') x = this.width;

    ctx.fillStyle = fillStyle;
    ctx.font = `${fontSize}px ${fontFamily}`;
    ctx.textAlign = textAlign;
    ctx.textBaseline = textBaseline;
    lines.forEach((line) => {
      if (strokeStyle && lineWidth > 0) {
        ctx.strokeStyle = strokeStyle;
        ctx.lineWidth = lineWidth;
        ctx.strokeText(line, x, y);
      }
      ctx.fillText(line, x, y);
      y += lh;
    });
  }
}
