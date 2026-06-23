import Graphic from './graphic';

export default class LoginButton extends Graphic {
  constructor(platform, options = {}, type = 'text', value = '登录') {
    super(
      Object.assign(
        {
          textAlign: 'center',
          lineHeight: 40,
          fontSize: 16,
          borderRadius: 4,
        },
        options,
      ),
    );
    this.button = platform && platform.createUserInfoButton ? platform.createUserInfoButton({ type, [type]: value, style: this.options }) : null;
  }

  onTap(handler) {
    if (this.button && this.button.onTap) this.button.onTap(handler);
    return this;
  }

  destroy() {
    if (this.button && this.button.destroy) this.button.destroy();
  }

  draw() {
    if (!this.button || !this.button.style) return;
    const style = this.button.style;
    style.left = this.worldBounds.x;
    style.top = this.worldBounds.y;
    style.width = this.worldBounds.width;
    style.height = this.worldBounds.height;
  }
}
