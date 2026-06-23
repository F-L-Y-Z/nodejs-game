import AnchorLayout from './anchor-layout';
import BoxLayout from './box-layout';
import StackLayout from './stack-layout';

export { default as AnchorLayout } from './anchor-layout';
export { default as BoxLayout } from './box-layout';
export { default as StackLayout } from './stack-layout';
export { default as Unit } from './unit';

export function anchor(options) {
  return new AnchorLayout(options);
}

export function box(options) {
  return new BoxLayout(options);
}

export function stack(options) {
  return new StackLayout(options);
}
