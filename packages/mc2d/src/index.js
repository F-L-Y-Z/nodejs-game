import Mc2dApp from './app/mc2d-app';
import WeChatAdapter from './platform/wechat-adapter';

export { default as Mc2dApp } from './app/mc2d-app';
export { default as Stage } from './app/stage';
export { default as AudioManager } from './assets/audio-manager';
export { default as AssetManager } from './assets/asset-manager';
export { default as CachedContainer } from './display/cached-container';
export { default as Container } from './display/container';
export { default as DisplayObject } from './display/display-object';
export { Button, Graphic, LoginButton, ScrollView, Sequence, Shape, Sprite, SpriteNumber, Text } from './display/graphics/index';
export { AnchorLayout, BoxLayout, StackLayout, Unit, anchor, box, stack } from './display/layout/index';
export { default as InputManager } from './input/input-manager';
export { default as PointerEvent } from './input/pointer-event';
export { default as Rect } from './math/rect';
export { default as WeChatAdapter } from './platform/wechat-adapter';
export { default as createStore } from './state/create-store';
export { default as EventEmitter } from './state/event-emitter';
export { default as localJson } from './state/local-json';
export { default as observable } from './state/observable';

export function createWeChatApp(options = {}) {
  const platform = options.platform || WeChatAdapter;
  const mainCanvas = options.canvas || globalThis.canvas || platform.createCanvas();
  return new Mc2dApp(
    Object.assign({}, options, {
      platform,
      canvas: mainCanvas,
    }),
  );
}
