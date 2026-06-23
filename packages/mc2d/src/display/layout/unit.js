export default class Unit {
  constructor(value = 0, percent = false, valid = true) {
    this.value = value;
    this.percent = percent;
    this.valid = valid;
  }

  static parse(value, fallback = 0) {
    if (value === null || value === undefined || value === '') return new Unit(fallback, false, false);
    if (typeof value === 'string' && value.indexOf('%') >= 0) {
      return new Unit(parseFloat(value) / 100, true, !isNaN(parseFloat(value)));
    }
    const number = Number(value);
    return new Unit(number, false, !isNaN(number));
  }

  resolve(total, fallback = 0) {
    if (!this.valid) return fallback;
    return this.percent ? total * this.value : this.value;
  }
}
