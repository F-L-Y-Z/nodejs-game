# MC2D

MC2D 是一个面向微信小游戏等 Canvas 运行时的轻量 2D UI/游戏框架。它当前服务于本项目的麻将小游戏迁移，目标是提供一套比旧 `sc2d` 更清晰的基础设施：显式平台适配、非单例 App、显示树、布局、输入事件、资源缓存和可扩展的自定义绘制节点。

它不是完整游戏引擎。目前没有物理系统、动画系统、场景编辑器、粒子系统、WebGL 渲染、复杂文本排版或组件生命周期管理。

## 目录结构

```text
js/mc2d
├── app/                 # App、Stage、Canvas DPR 缩放
├── assets/              # 图片和音频资源缓存
├── display/             # 显示树、缓存容器、图形节点、布局
├── input/               # pointer/tap 输入事件
├── math/                # Rect 等基础几何类型
├── platform/            # 微信小游戏平台适配
├── state/               # EventEmitter、observable
└── index.js             # 统一导出入口
```

业务代码优先从 `js/mc2d/index.js` 导入，不直接依赖内部路径。

## 快速开始

微信小游戏入口中可以直接使用 `createWeChatApp`：

```js
import { Button, Container, Shape, Text, anchor, createWeChatApp } from './js/mc2d/index';

const app = createWeChatApp({ fps: 60 });

const root = new Container();
root.setLayout(anchor({ anchor: 'top-left', width: '100%', height: '100%' }));

const bg = root.addChild(new Shape({ fillStyle: '#173b32' }));
bg.setLayout(anchor({ anchor: 'top-left', width: '100%', height: '100%' }));

const title = root.addChild(new Text('MC2D', { fontSize: 24 }));
title.setLayout(anchor({ anchor: 'top', y: 24, width: '100%', height: 40 }));

const button = root.addChild(new Button('Start'));
button.setLayout(anchor({ anchor: 'center', width: 160, height: 48 }));
button.on('tap', () => {
  title.text = 'Tapped';
});

app.start(root);
```

也可以手动注入平台和 canvas：

```js
import { Mc2dApp, WeChatAdapter } from './js/mc2d/index';

const app = new Mc2dApp({
  platform: WeChatAdapter,
  canvas: globalThis.canvas,
  fps: 60,
});
```

`createWeChatApp()` 的 canvas 获取顺序是：

1. `options.canvas`
2. `globalThis.canvas`
3. `platform.createCanvas()`

## App 和 Stage

`Mc2dApp` 是应用实例，不是全局单例。一个 App 持有：

- `app.canvas`：主 canvas
- `app.ctx`：主 2D context
- `app.stage`：根显示树
- `app.assets`：资源管理器
- `app.audio`：BGM/SFX 音频管理器
- `app.input`：输入管理器
- `app.layers.root` / `app.effects` / `app.topLayer`：主层、效果层、顶层
- `app.width` / `app.height` / `app.pixelRatio`：逻辑尺寸和 DPR

常用方法：

```js
app.start(root); // 设置 root 并启动帧循环
app.setRoot(root); // 替换根节点，不改变 running 状态
app.stop(); // 停止帧循环
app.resize(); // 重新读取平台尺寸并重设 canvas
app.resize(info); // 使用传入尺寸信息重设 canvas
app.render(); // 立即重绘
app.destroy(); // 停止、解绑输入、清理根节点
```

`Mc2dApp` 也是事件源，当前会透出微信小游戏生命周期：

```js
app.on('show', () => {});
app.on('hide', () => {});
```

`fps` 默认是 `60`。`autoRender` 默认是 `true`，表示每帧全量清屏并重绘。把 `autoRender` 设为 `false` 时，只有调用 `invalidatePaint()` 触发 `stage.requestRender()` 后才会重绘。

注意：当前渲染策略优先保证正确性，默认不是脏矩形渲染。小游戏 UI 和棋盘类场景通常可以接受；如果节点很多或绘制很重，应考虑使用 `CachedContainer` 或后续实现局部重绘。

## 显示树

所有可显示对象都继承自 `DisplayObject`。

基础属性：

```js
node.x = 0;
node.y = 0;
node.width = 100;
node.height = 50;
node.scaleX = 1;
node.scaleY = 1;
node.alpha = 1;
node.visible = true;
node.touchEnabled = false;
```

基础方法：

```js
node.setFrame(x, y, width, height);
node.setLayout(layout);
node.remove();
node.invalidateLayout();
node.invalidatePaint();
node.update(dt);
node.draw(ctx);
node.on(type, handler);
node.off(type, handler);
```

`Container` 是显示对象容器：

```js
const panel = new Container();
panel.addChild(child);
panel.addChildAt(child, 0);
panel.removeChild(child);
panel.removeChildren();
panel.setChildLayout(stack({ direction: 'horizontal', gap: 8 }));
```

渲染顺序是 children 数组顺序，后添加的节点后绘制，也更优先命中输入事件。

### 自定义绘制节点

需要复杂绘制时，继承 `Graphic` 或 `DisplayObject` 并实现 `draw(ctx)`：

```js
import { Graphic } from '../mc2d/index';

class BoardGraphic extends Graphic {
  constructor() {
    super();
    this.state = null;
  }

  setState(state) {
    this.state = state;
    this.invalidatePaint();
  }

  draw(ctx) {
    ctx.fillStyle = '#173b32';
    ctx.fillRect(0, 0, this.width, this.height);
    if (!this.state) return;
    // draw game state...
  }
}
```

`draw(ctx)` 内部使用节点自己的局部坐标，左上角是 `(0, 0)`。不要在 `draw()` 内直接使用全局 canvas 尺寸，优先使用 `this.width` / `this.height`。

## 图形节点

### Shape

绘制矩形或圆角矩形。

```js
const shape = new Shape({
  fillStyle: '#205447',
  strokeStyle: '#dce8de',
  lineWidth: 1,
  radius: 6,
});
shape.setLayout(anchor({ anchor: 'center', width: 120, height: 48 }));
```

### Text

绘制简单文本，支持换行、字号、字体、颜色、对齐。

```js
const label = new Text('hello\nworld', {
  fillStyle: '#fff',
  fontSize: 16,
  fontFamily: 'Arial',
  textAlign: 'center',
  textBaseline: 'middle',
  lineHeight: 22,
});

label.text = 'new text';
```

注意：当前 `Text` 不支持自动换行、富文本、描边、阴影、测量缓存和复杂字体 fallback。长文本需要业务侧自行截断或换行。

### Sprite

绘制图片或图片图集区域。

```js
const sprite = new Sprite(app.assets, 'images/sprite.png', {
  fit: 'contain',
});
sprite.setLayout(anchor({ anchor: 'center', width: 96, height: 96 }));
```

图集裁剪：

```js
const tile = new Sprite(app.assets, 'images/sprite.png', {
  sourceX: 30,
  sourceY: 33,
  sourceWidth: 94,
  sourceHeight: 122,
  fit: 'stretch',
});
```

`fit` 当前支持：

- `stretch`：拉伸填满目标区域，默认值。
- `contain`：保持比例完整显示，可能留空白。
- `cover`：保持比例填满目标区域，可能裁切。
- `center`：按原图尺寸居中绘制。

注意：当前没有九宫格缩放、旋转、滤镜、混合模式和纹理批处理。

### Button

`Button` 是一个 `Container`，内部包含背景 `Shape` 和文字 `Text`，默认开启 `touchEnabled`。

```js
const button = new Button('开始', {
  background: { fillStyle: '#2f7df6', radius: 6 },
  label: { fillStyle: '#fff', fontSize: 15 },
});
button.setLayout(anchor({ anchor: 'bottom', y: -24, width: 120, height: 40 }));
button.on('tap', () => startGame());
```

注意：当前按钮支持基础 pressed/disabled 样式切换，但没有内建 loading 状态。

`Button` 现在可传 `pressed` / `disabled` 样式，用于覆盖背景和文字：

```js
const button = new Button('开始', {
  pressed: { background: { fillStyle: '#1f5fd0' } },
  disabled: { background: { fillStyle: '#8892a0' } },
});
button.setState('disabled');
```

### Sequence、SpriteNumber、ScrollView、LoginButton

为覆盖旧 `sc2d` 的常用组件，当前也导出了：

- `Sequence`：图片序列帧动画。
- `SpriteNumber`：用图片数字绘制数值。
- `ScrollView`：带裁剪、拖拽和回弹的滚动容器。
- `LoginButton`：微信原生 `createUserInfoButton` 的显示树占位节点。

## 布局

布局分两类：

- 节点自身布局：`node.setLayout(anchor(...))` 或 `node.setLayout(box(...))`
- 容器子项布局：`container.setChildLayout(stack(...))`

布局值支持数字和百分比字符串，例如 `120`、`'50%'`、`'100%'`。

### AnchorLayout

适合按锚点定位。

```js
node.setLayout(
  anchor({
    anchor: 'bottom-right',
    x: -16,
    y: -16,
    width: 120,
    height: 44,
  }),
);
```

支持的 `anchor`：

- `top-left`
- `top` / `top-center`
- `top-right`
- `left` / `middle-left`
- `center` / `middle`
- `right` / `middle-right`
- `bottom-left`
- `bottom` / `bottom-center`
- `bottom-right`

注意：`x` / `y` 是基于锚点计算后的偏移量。右下角一类锚点通常使用负偏移。

### BoxLayout

适合按边距定位。

```js
node.setLayout(
  box({
    left: 16,
    right: 16,
    top: 80,
    height: 120,
  }),
);
```

规则：

- 同时给 `left` 和 `right` 时，宽度为 `parent.width - left - right`。
- 同时给 `top` 和 `bottom` 时，高度为 `parent.height - top - bottom`。
- 只给 `right` 时，节点靠右定位。
- 只给 `bottom` 时，节点靠下定位。

### StackLayout

适合简单横向或纵向排列子节点。

```js
const row = new Container();
row.setChildLayout(
  stack({
    direction: 'horizontal',
    padding: 12,
    gap: 8,
    itemWidth: 80,
  }),
);
```

注意：

- `stack(...)` 应通过 `setChildLayout()` 设置在容器上。
- 当前不会自动计算容器自身尺寸。
- 当前只做一维排列，不支持换行、主轴/交叉轴对齐、flex-grow、百分比分配和滚动。

## 输入事件

输入系统使用事件模型。节点需要设置 `touchEnabled = true` 才能被命中。

```js
const hit = new Container();
hit.touchEnabled = true;
hit.setLayout(anchor({ anchor: 'top-left', x: 20, y: 20, width: 80, height: 80 }));
hit.on('tap', (event) => {
  console.log(event.x, event.y);
});
```

当前事件类型：

- `pointerdown`
- `pointermove`
- `pointerup`
- `pointercancel`
- `tap`

事件对象字段：

```js
event.type;
event.pointerId;
event.x;
event.y;
event.startX;
event.startY;
event.deltaX;
event.deltaY;
event.target;
event.currentTarget;
event.originalEvent;
event.stopPropagation();
```

事件会从命中目标向父节点冒泡：

```js
child.on('tap', (event) => {
  event.stopPropagation();
});
```

tap 判定阈值：

- 移动距离不超过 10 像素。
- 按下到抬起不超过 350ms。
- 抬起时命中目标必须仍然是按下时的目标。

注意：

- 当前只处理单点触控。
- 没有 capture 阶段。
- 没有显式 pointer capture API，但 `pointermove` / `pointerup` 会持续发给按下时的目标。
- 命中区域使用节点的矩形 `worldBounds`，不支持像素级命中、圆形命中或复杂路径命中。

## 资源管理

资源管理器挂在 `app.assets` 上。

### 图片

```js
const record = app.assets.image('images/sprite.png');

record.status; // 'loading' | 'loaded' | 'error'
record.image;
record.width;
record.height;
record.promise;
```

预加载：

```js
await app.assets.loadImage('images/sprite.png');
await app.assets.preloadImages(['images/a.png', 'images/b.png']);
```

路径 formatter：

```js
app.assets.setPathFormatter('ui', (key) => `images/ui/${key}.png`);
const button = app.assets.image('button_start', 'ui');
```

图片加载完成后，使用 `Sprite` 会自动 `invalidatePaint()`。如果是自定义绘制类直接使用 `app.assets.image()`，需要在 `record.promise` 完成后自己触发重绘：

```js
const record = app.assets.image('images/sprite.png');
record.promise.then(() => this.invalidatePaint());
```

### 音频

```js
const click = app.assets.sound('audio/click.mp3');
click.play();
```

也可以使用 `app.audio`：

```js
app.audio.enableSfx(true);
app.audio.playSfx('audio/click.mp3');
app.audio.enableBgm(true);
app.audio.playBgm('audio/bgm.mp3');
```

注意：当前封装了 BGM/SFX 开关和基础播放，不封装音量管理、播放队列、解码状态和失败重试。

## 缓存容器

`CachedContainer` 用离屏 canvas 缓存自身及子节点绘制结果。

```js
const cached = new CachedContainer();
cached.setLayout(anchor({ anchor: 'center', width: 300, height: 200 }));
cached.addChild(expensiveNode);
```

适用场景：

- 复杂但不常变化的面板。
- 静态背景。
- 多个绘制成本较高的子节点组合。

注意：

- 缓存是显式优化，不是默认行为。
- 子节点调用 `invalidatePaint()` 会向上冒泡，让缓存重建。
- 缓存画布会占额外内存，不适合大量大尺寸节点。
- 当前没有自动缓存淘汰策略。

## 状态和事件工具

### EventEmitter

```js
const off = emitter.on('change', (value) => {});
emitter.emit('change', 1);
off();
```

支持：

- `on(type, handler)`
- `once(type, handler)`
- `off(type, handler)`
- `emit(type, ...args)`
- `removeAllListeners(type)`

### observable

```js
const state = observable({ score: 0 });

state.on('score', (value, oldValue) => {
  scoreText.text = String(value);
});

state.score += 1;
```

也可以监听全部字段：

```js
state.on('*', (prop, value, oldValue) => {});
```

注意：当前 `observable` 只监听对象第一层属性，不递归代理嵌套对象和数组内部变更。

## 平台适配

当前内置 `WeChatAdapter`，负责封装：

- `getSystemInfo()`
- `createCanvas()`
- `createImage()`
- `createAudio()`
- `requestAnimationFrame()`
- `cancelAnimationFrame()`
- `bindTouch(canvas, handlers)`
- `getStorage(key)`
- `setStorage(key, value)`
- `onShow(handler)` / `onHide(handler)`
- `setFPS(fps)`
- `getOpenDataContext()`
- `share(options)` / `setShare(handler)`
- `request(options)`
- `getSetting(options)`
- `getUserInfo(options)`
- `login(options)`

如果要支持其他小游戏平台，应实现同样的 adapter 接口：

```js
const MyAdapter = {
  getSystemInfo() {},
  createCanvas() {},
  createImage() {},
  createAudio() {},
  requestAnimationFrame(handler) {},
  cancelAnimationFrame(id) {},
  bindTouch(canvas, handlers) {
    return () => {};
  },
  getStorage(key) {},
  setStorage(key, value) {},
  removeStorage(key) {},
  getSetting(options) {},
  getUserInfo(options) {},
  login(options) {},
};
```

### 平台登录

`Mc2dApp` 对 `wx.login` 提供两层封装：

```js
const loginInfo = await app.platformLogin();
```

也可以走包含授权按钮和可选后台请求的完整流程：

```js
const result = await app.login({
  container: app.topLayer,
  forceShowButton: false,
  onShowButton(button) {
    button.setLayout(anchor({ anchor: 'center', width: 160, height: 44 }));
  },
  onButtonTap() {},
  requestOptions(setting, userInfo, loginInfo) {
    return {
      url: 'https://example.com/login',
      method: 'POST',
      data: { code: loginInfo.code },
    };
  },
  type: 'text',
  value: '登录',
});

result.setting;
result.userInfo;
result.loginInfo;
result.response;
```

然后注入：

```js
const app = new Mc2dApp({
  platform: MyAdapter,
  canvas: myCanvas,
});
```

## 当前项目中的用法

本项目麻将入口已经迁到 MC2D：

```js
import { createWeChatApp } from './js/mc2d/index';
import MainView from './js/game/main-view';

const app = createWeChatApp({ fps: 60 });
app.start(new MainView(app.assets));
```

棋盘绘制使用自定义 `Graphic`，手牌点击区使用透明 `Container` 作为命中区域，动作按钮使用 `Button`。

## 使用注意事项

- 不要假设 `Mc2dApp` 是单例。业务对象需要资源或平台能力时，应显式传入 `app` 或 `app.assets`。
- 自定义绘制节点修改内部状态后要调用 `invalidatePaint()`。
- 修改节点尺寸、位置或布局后优先使用 `setFrame()` / `setLayout()`，或者手动调用 `invalidateLayout()`。
- 输入命中依赖 `touchEnabled = true` 和节点布局后的矩形区域。
- `draw(ctx)` 中坐标是局部坐标；不要重复 `ctx.translate(this.x, this.y)`。
- 默认每帧全量重绘，重绘成本高的静态区域可以考虑 `CachedContainer`。
- 文本不会自动适配容器，业务侧要控制字号、换行和截断。
- 当前没有通用组件生命周期，异步回调中要注意节点是否还在显示树上。

## 尚未实现但这类框架通常应该具备的能力

渲染与性能：

- 脏矩形渲染。
- 渲染批处理。
- 更完整的离屏缓存策略和缓存淘汰。
- 节点旋转、锚点、skew、矩阵变换。
- 通用裁剪区域、mask、scroll rect。
- blend mode、滤镜、阴影统一封装。

显示对象与组件：

- 通用组件生命周期，如 `onMount` / `onUnmount` / `onResize`。
- 更丰富的基础组件，如 ListView、Modal、Toggle、Slider。
- hover、loading 等更多交互状态。
- 层级管理工具，如 `bringToFront()` / `sendToBack()`。

布局：

- Flex/Grid 类布局。
- 自动测量内容尺寸。
- 最小/最大尺寸约束。
- 安全区适配。
- 响应式断点。

输入：

- 多点触控。
- capture 阶段。
- 显式 pointer capture。
- 手势识别，如 drag、swipe、pinch、longpress。
- 非矩形命中测试。

资源：

- 资源分组卸载。
- 引用计数。
- 失败重试。
- 加载进度。
- 图集 JSON 解析。
- 音量、播放队列和更完整的 BGM/SFX 管理。

动画：

- Tween。
- 时间轴。
- 缓动函数。
- Tween 与序列帧组合控制。
- 状态机动画。

工程化：

- 单元测试。
- 小游戏运行时集成测试。
- 性能 benchmark。
- TypeScript 类型声明。
- API 文档生成。

这些能力不应该一次性堆进框架。当前建议优先补：组件生命周期、资源加载进度、九宫格缩放、以及至少一组输入/布局单元测试。
