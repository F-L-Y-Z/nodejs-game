import DisplayObject from '../display-object';

export default class Graphic extends DisplayObject {
  constructor(options = {}) {
    super();
    this.options = Object.assign(
      {
        fillStyle: '#fff',
        strokeStyle: '',
        lineWidth: 1,
      },
      options,
    );
  }

  setOptions(options) {
    Object.assign(this.options, options);
    this.invalidatePaint();
    return this;
  }
}
