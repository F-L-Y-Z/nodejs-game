import Container from '../container';
import Shape from './shape';
import Text from './text';

export default class Button extends Container {
  constructor(label = '', options = {}) {
    super();
    this.touchEnabled = true;
    const normalBackground = Object.assign(
      {
        fillStyle: '#2f7df6',
        radius: 6,
      },
      options.background,
    );
    const normalLabel = Object.assign(
      {
        fillStyle: '#fff',
        fontSize: 16,
      },
      options.label,
    );
    this.styles = {
      normal: options.normal || {
        background: normalBackground,
        label: normalLabel,
      },
      pressed: options.pressed || null,
      disabled: options.disabled || null,
    };
    this.state = 'normal';
    this.background = this.addChild(new Shape(normalBackground));
    this.labelView = this.addChild(new Text(label, normalLabel));
    this.on('pointerdown', () => this.setState('pressed'));
    this.on('pointerup', () => this.setState('normal'));
    this.on('pointercancel', () => this.setState('normal'));
  }

  get label() {
    return this.labelView.text;
  }

  set label(value) {
    this.labelView.text = value;
  }

  setState(state) {
    if (state === 'pressed' && !this.styles.pressed) state = 'normal';
    if (state === 'disabled') this.touchEnabled = false;
    else if (this.state === 'disabled') this.touchEnabled = true;
    this.state = state;
    const style = this.styles[state];
    if (style && style.background) this.background.setOptions(style.background);
    if (style && style.label) this.labelView.setOptions(style.label);
    return this;
  }

  layoutSelf(parentBounds, parentWorldX = 0, parentWorldY = 0) {
    this.measure(parentBounds);
    this.updateWorldBounds(parentWorldX, parentWorldY);
    this.background.setFrame(0, 0, this.width, this.height);
    this.labelView.setFrame(0, 0, this.width, this.height);
    this.children.forEach((child) => {
      child.layoutSelf(this.worldBounds, this.worldBounds.x, this.worldBounds.y);
    });
    this.dirtyLayout = false;
  }
}
