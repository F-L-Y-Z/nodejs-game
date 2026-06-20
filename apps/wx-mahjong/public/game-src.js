(() => {
  // ../../packages/mc2d/src/assets/asset-manager.js
  var AssetManager = class {
    constructor(platform) {
      this.platform = platform;
      this.pathFormatters = /* @__PURE__ */ Object.create(null);
      this.images = /* @__PURE__ */ Object.create(null);
      this.audio = /* @__PURE__ */ Object.create(null);
    }
    setPathFormatter(type, formatter) {
      this.pathFormatters[type] = formatter;
    }
    resolve(key, type = "") {
      const formatter = this.pathFormatters[type];
      return formatter ? formatter(key) : key;
    }
    image(key, type = "") {
      const path = this.resolve(key, type);
      if (!this.images[path]) this.images[path] = this.createImageRecord(path);
      return this.images[path];
    }
    loadImage(key, type = "") {
      return this.image(key, type).promise;
    }
    preloadImages(keys, type = "") {
      return Promise.all(keys.map((key) => this.loadImage(key, type)));
    }
    createImageRecord(path) {
      const image = this.platform.createImage();
      const record = {
        path,
        image,
        status: "loading",
        error: null,
        width: 0,
        height: 0,
        promise: null
      };
      record.promise = new Promise((resolve, reject) => {
        image.onload = () => {
          record.status = "loaded";
          record.width = image.width;
          record.height = image.height;
          resolve(record);
        };
        image.onerror = (error) => {
          record.status = "error";
          record.error = error || new Error(`Image load failed: ${path}`);
          reject(record.error);
        };
      });
      image.src = path;
      return record;
    }
    sound(key, type = "") {
      const path = this.resolve(key, type);
      if (!this.audio[path]) {
        const audio = this.platform.createAudio();
        audio.src = path;
        this.audio[path] = audio;
      }
      return this.audio[path];
    }
  };

  // ../../packages/mc2d/src/assets/audio-manager.js
  var AudioManager = class {
    constructor(assetManager) {
      this.assets = assetManager;
      this.bgmEnabled = true;
      this.sfxEnabled = true;
      this.bgmAudio = null;
    }
    enableBgm(enabled) {
      this.bgmEnabled = !!enabled;
      if (!this.bgmEnabled && this.bgmAudio) this.bgmAudio.pause();
    }
    enableSfx(enabled) {
      this.sfxEnabled = !!enabled;
    }
    playSfx(key, type = "") {
      if (!this.sfxEnabled) return null;
      const audio = this.assets.sound(key, type);
      try {
        audio.currentTime = 0;
        audio.play();
      } catch (e) {
      }
      return audio;
    }
    playBgm(key, type = "") {
      if (!this.bgmEnabled) return null;
      const audio = this.assets.sound(key, type);
      if (this.bgmAudio && this.bgmAudio !== audio) this.bgmAudio.pause();
      this.bgmAudio = audio;
      try {
        audio.currentTime = 0;
        audio.loop = true;
        audio.play();
      } catch (e) {
      }
      return audio;
    }
    stopBgm() {
      if (!this.bgmAudio) return;
      this.bgmAudio.pause();
      this.bgmAudio = null;
    }
  };

  // ../../packages/mc2d/src/state/event-emitter.js
  var EventEmitter = class {
    constructor() {
      this.listeners = /* @__PURE__ */ Object.create(null);
    }
    on(type, handler) {
      if (!this.listeners[type]) this.listeners[type] = [];
      this.listeners[type].push(handler);
      return () => this.off(type, handler);
    }
    once(type, handler) {
      const off = this.on(type, (...args) => {
        off();
        handler(...args);
      });
      return off;
    }
    off(type, handler) {
      const listeners = this.listeners[type];
      if (!listeners) return;
      const index = listeners.indexOf(handler);
      if (index >= 0) listeners.splice(index, 1);
      if (listeners.length === 0) delete this.listeners[type];
    }
    emit(type, ...args) {
      const listeners = this.listeners[type];
      if (!listeners) return false;
      listeners.slice().forEach((handler) => handler(...args));
      return true;
    }
    removeAllListeners(type = null) {
      if (type) delete this.listeners[type];
      else this.listeners = /* @__PURE__ */ Object.create(null);
    }
  };

  // ../../packages/mc2d/src/math/rect.js
  var Rect = class _Rect {
    constructor(x = 0, y = 0, width = 0, height = 0) {
      this.set(x, y, width, height);
    }
    set(x = 0, y = 0, width = 0, height = 0) {
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
      return this;
    }
    copyFrom(rect) {
      return this.set(rect.x, rect.y, rect.width, rect.height);
    }
    clone() {
      return new _Rect(this.x, this.y, this.width, this.height);
    }
    equals(rect) {
      return this.x === rect.x && this.y === rect.y && this.width === rect.width && this.height === rect.height;
    }
    contains(x, y) {
      return x >= this.x && y >= this.y && x <= this.x + this.width && y <= this.y + this.height;
    }
    get empty() {
      return this.width <= 0 || this.height <= 0;
    }
  };

  // ../../packages/mc2d/src/display/display-object.js
  var nextDisplayObjectId = 1;
  var DisplayObject = class extends EventEmitter {
    constructor() {
      super();
      this.id = nextDisplayObjectId++;
      this.name = `${this.constructor.name} ${this.id}`;
      this.parent = null;
      this.stage = null;
      this.layout = null;
      this.x = 0;
      this.y = 0;
      this.width = 0;
      this.height = 0;
      this.scaleX = 1;
      this.scaleY = 1;
      this.alpha = 1;
      this.visible = true;
      this.touchEnabled = false;
      this.bounds = new Rect();
      this.worldBounds = new Rect();
      this.dirtyLayout = true;
      this.dirtyPaint = true;
      this.dirtyTransform = true;
    }
    get tap() {
      return this._tap || null;
    }
    set tap(handler) {
      if (this._tap) this.off("tap", this._tap);
      this._tap = typeof handler === "function" ? handler : null;
      if (this._tap) {
        this.touchEnabled = true;
        this.on("tap", this._tap);
      }
    }
    get touchstart() {
      return this._touchstart || null;
    }
    set touchstart(handler) {
      if (this._touchstart) this.off("pointerdown", this._touchstart);
      this._touchstart = typeof handler === "function" ? handler : null;
      if (this._touchstart) {
        this.touchEnabled = true;
        this.on("pointerdown", this._touchstart);
      }
    }
    get touchmove() {
      return this._touchmove || null;
    }
    set touchmove(handler) {
      if (this._touchmove) this.off("pointermove", this._touchmove);
      this._touchmove = typeof handler === "function" ? handler : null;
      if (this._touchmove) {
        this.touchEnabled = true;
        this.on("pointermove", this._touchmove);
      }
    }
    get touchend() {
      return this._touchend || null;
    }
    set touchend(handler) {
      if (this._touchend) this.off("pointerup", this._touchend);
      this._touchend = typeof handler === "function" ? handler : null;
      if (this._touchend) {
        this.touchEnabled = true;
        this.on("pointerup", this._touchend);
      }
    }
    setLayout(layout) {
      this.layout = layout;
      this.invalidateLayout();
      return this;
    }
    setStage(stage) {
      this.stage = stage;
    }
    remove() {
      if (this.parent) this.parent.removeChild(this);
      return this;
    }
    setFrame(x, y, width, height) {
      if (this.x === x && this.y === y && this.width === width && this.height === height) {
        return this;
      }
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
      this.invalidateLayout();
      return this;
    }
    invalidateLayout() {
      this.dirtyLayout = true;
      this.invalidateTransform();
    }
    invalidateTransform() {
      this.dirtyTransform = true;
      this.invalidatePaint();
    }
    invalidatePaint() {
      this.dirtyPaint = true;
      if (this.parent) this.parent.invalidatePaint();
      else if (this.stage) this.stage.requestRender();
    }
    update(dt) {
    }
    onScreenResize(systemInfo) {
    }
    measure(parentBounds) {
      if (this.layout) this.layout.applyTo(this, parentBounds);
    }
    updateWorldBounds(parentWorldX = 0, parentWorldY = 0) {
      const x = parentWorldX + this.x;
      const y = parentWorldY + this.y;
      this.bounds.set(this.x, this.y, this.width, this.height);
      this.worldBounds.set(x, y, this.width * this.scaleX, this.height * this.scaleY);
      this.dirtyTransform = false;
    }
    layoutSelf(parentBounds, parentWorldX = 0, parentWorldY = 0) {
      this.measure(parentBounds);
      this.updateWorldBounds(parentWorldX, parentWorldY);
      this.dirtyLayout = false;
    }
    render(ctx) {
      if (!this.visible || this.alpha <= 0 || this.worldBounds.empty) return;
      ctx.save();
      ctx.globalAlpha *= this.alpha;
      ctx.translate(this.x, this.y);
      ctx.scale(this.scaleX, this.scaleY);
      this.draw(ctx);
      ctx.restore();
      this.dirtyPaint = false;
    }
    draw(ctx) {
    }
    containsPoint(x, y) {
      return this.visible && this.worldBounds.contains(x, y);
    }
    hitTest(x, y) {
      if (!this.touchEnabled || !this.containsPoint(x, y)) return null;
      return this;
    }
    dispatch(event) {
      event.currentTarget = this;
      this.emit(event.type, event);
      return event.propagationStopped;
    }
  };

  // ../../packages/mc2d/src/display/container.js
  var Container = class extends DisplayObject {
    constructor() {
      super();
      this.children = [];
      this.childLayout = null;
    }
    get numChildren() {
      return this.children.length;
    }
    setChildLayout(layout) {
      this.childLayout = layout;
      this.invalidateLayout();
      return this;
    }
    setStage(stage) {
      super.setStage(stage);
      this.children.forEach((child) => child.setStage(stage));
    }
    addChild(child) {
      if (child.parent === this) return child;
      if (child.parent) child.parent.removeChild(child);
      child.parent = this;
      child.setStage(this.stage);
      this.children.push(child);
      this.invalidateLayout();
      return child;
    }
    addChildAt(child, index) {
      if (child.parent) child.parent.removeChild(child);
      child.parent = this;
      child.setStage(this.stage);
      this.children.splice(index, 0, child);
      this.invalidateLayout();
      return child;
    }
    getChild(index) {
      return this.children[index] || null;
    }
    setOrder(child, order) {
      const index = this.children.indexOf(child);
      if (index < 0) return child;
      this.children.splice(index, 1);
      this.children.splice(Math.max(0, Math.min(order, this.children.length)), 0, child);
      this.invalidatePaint();
      return child;
    }
    removeChild(child) {
      const index = this.children.indexOf(child);
      if (index < 0) return child;
      this.children.splice(index, 1);
      child.parent = null;
      child.setStage(null);
      this.invalidateLayout();
      return child;
    }
    removeChildren() {
      this.children.slice().forEach((child) => this.removeChild(child));
    }
    forEach(handler) {
      this.children.forEach((child) => {
        if (handler(child)) return;
        if (child.forEach) child.forEach(handler);
      });
    }
    bubble(handler) {
      for (let i = this.children.length - 1; i >= 0; i--) {
        const child = this.children[i];
        if (child.bubble && child.bubble(handler)) return true;
        if (handler(child)) return true;
      }
      return false;
    }
    update(dt) {
      this.children.forEach((child) => child.update(dt));
    }
    layoutSelf(parentBounds, parentWorldX = 0, parentWorldY = 0) {
      super.layoutSelf(parentBounds, parentWorldX, parentWorldY);
      if (this.childLayout) this.childLayout.layoutChildren(this);
      else if (this.layout && this.layout.layoutChildren) this.layout.layoutChildren(this);
      const childParentBounds = this.worldBounds;
      this.children.forEach((child) => {
        child.layoutSelf(childParentBounds, this.worldBounds.x, this.worldBounds.y);
      });
    }
    render(ctx) {
      if (!this.visible || this.alpha <= 0) return;
      ctx.save();
      ctx.globalAlpha *= this.alpha;
      ctx.translate(this.x, this.y);
      ctx.scale(this.scaleX, this.scaleY);
      this.draw(ctx);
      this.children.forEach((child) => child.render(ctx));
      ctx.restore();
      this.dirtyPaint = false;
    }
    hitTest(x, y) {
      if (!this.visible || !this.containsPoint(x, y)) return null;
      for (let i = this.children.length - 1; i >= 0; i--) {
        const target = this.children[i].hitTest(x, y);
        if (target) return target;
      }
      return this.touchEnabled ? this : null;
    }
  };

  // ../../packages/mc2d/src/display/graphics/graphic.js
  var Graphic = class extends DisplayObject {
    constructor(options = {}) {
      super();
      this.options = Object.assign({
        fillStyle: "#fff",
        strokeStyle: "",
        lineWidth: 1
      }, options);
    }
    setOptions(options) {
      Object.assign(this.options, options);
      this.invalidatePaint();
      return this;
    }
  };

  // ../../packages/mc2d/src/display/graphics/login-button.js
  var LoginButton = class extends Graphic {
    constructor(platform, options = {}, type = "text", value = "\u767B\u5F55") {
      super(Object.assign({
        textAlign: "center",
        lineHeight: 40,
        fontSize: 16,
        borderRadius: 4
      }, options));
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
  };

  // ../../packages/mc2d/src/input/pointer-event.js
  var PointerEvent = class {
    constructor(type, data) {
      this.type = type;
      this.pointerId = data.pointerId || 0;
      this.x = data.x;
      this.y = data.y;
      this.startX = data.startX;
      this.startY = data.startY;
      this.deltaX = data.deltaX || 0;
      this.deltaY = data.deltaY || 0;
      this.target = data.target || null;
      this.currentTarget = null;
      this.originalEvent = data.originalEvent || null;
      this.propagationStopped = false;
    }
    stopPropagation() {
      this.propagationStopped = true;
    }
  };

  // ../../packages/mc2d/src/input/input-manager.js
  var TAP_DISTANCE = 10;
  var TAP_DURATION = 350;
  function getTouch(event) {
    const list = event.changedTouches && event.changedTouches.length ? event.changedTouches : event.touches;
    return list && list[0];
  }
  var InputManager = class {
    constructor(stage, platform) {
      this.stage = stage;
      this.platform = platform;
      this.unbind = null;
      this.active = null;
      this.touchPoint = null;
      this.touchMoveVector = { x: 0, y: 0, fixedX: 0, fixedY: 0 };
      this.handleStart = this.handleStart.bind(this);
      this.handleMove = this.handleMove.bind(this);
      this.handleEnd = this.handleEnd.bind(this);
      this.handleCancel = this.handleCancel.bind(this);
    }
    bind(canvas) {
      this.destroy();
      this.unbind = this.platform.bindTouch(canvas, {
        start: this.handleStart,
        move: this.handleMove,
        end: this.handleEnd,
        cancel: this.handleCancel
      });
    }
    destroy() {
      if (this.unbind) this.unbind();
      this.unbind = null;
      this.active = null;
    }
    toPoint(event) {
      const touch = getTouch(event);
      if (!touch) return null;
      return {
        pointerId: touch.identifier || 0,
        x: touch.clientX,
        y: touch.clientY
      };
    }
    getTouchPoint() {
      return this.touchPoint || { x: -1, y: -1 };
    }
    getTouchMoveVector() {
      return this.touchMoveVector;
    }
    bubble(target, event) {
      let node = target;
      while (node) {
        if (node.dispatch(event)) return;
        node = node.parent;
      }
    }
    emit(type, target, point, originalEvent, extra = {}) {
      const event = new PointerEvent(type, Object.assign({}, extra, {
        pointerId: point.pointerId,
        x: point.x,
        y: point.y,
        target,
        originalEvent
      }));
      this.bubble(target, event);
      return event;
    }
    handleStart(event) {
      const point = this.toPoint(event);
      if (!point || this.active) return;
      const target = this.stage.hitTest(point.x, point.y);
      if (!target) return;
      this.active = {
        target,
        pointerId: point.pointerId,
        startX: point.x,
        startY: point.y,
        lastX: point.x,
        lastY: point.y,
        time: Date.now()
      };
      this.touchPoint = { x: point.x, y: point.y };
      this.touchMoveVector.x = this.touchMoveVector.y = 0;
      this.touchMoveVector.fixedX = this.touchMoveVector.fixedY = 0;
      this.emit("pointerdown", target, point, event, {
        startX: point.x,
        startY: point.y
      });
    }
    handleMove(event) {
      const point = this.toPoint(event);
      const active = this.active;
      if (!point || !active) return;
      const deltaX = point.x - active.lastX;
      const deltaY = point.y - active.lastY;
      this.touchPoint = { x: point.x, y: point.y };
      this.touchMoveVector.x = this.touchMoveVector.fixedX = deltaX;
      this.touchMoveVector.y = this.touchMoveVector.fixedY = deltaY;
      active.lastX = point.x;
      active.lastY = point.y;
      this.emit("pointermove", active.target, point, event, {
        startX: active.startX,
        startY: active.startY,
        deltaX,
        deltaY
      });
    }
    handleEnd(event) {
      const point = this.toPoint(event);
      const active = this.active;
      if (!point || !active) return;
      this.emit("pointerup", active.target, point, event, {
        startX: active.startX,
        startY: active.startY,
        deltaX: point.x - active.lastX,
        deltaY: point.y - active.lastY
      });
      const dx = point.x - active.startX;
      const dy = point.y - active.startY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance <= TAP_DISTANCE && Date.now() - active.time <= TAP_DURATION) {
        const endTarget = this.stage.hitTest(point.x, point.y);
        if (endTarget === active.target) {
          this.emit("tap", active.target, point, event, {
            startX: active.startX,
            startY: active.startY
          });
        }
      }
      this.active = null;
      this.touchPoint = null;
      this.touchMoveVector.x = this.touchMoveVector.y = 0;
      this.touchMoveVector.fixedX = this.touchMoveVector.fixedY = 0;
    }
    handleCancel(event) {
      const point = this.toPoint(event);
      const active = this.active;
      if (point && active) {
        this.emit("pointercancel", active.target, point, event, {
          startX: active.startX,
          startY: active.startY
        });
      }
      this.active = null;
      this.touchPoint = null;
      this.touchMoveVector.x = this.touchMoveVector.y = 0;
      this.touchMoveVector.fixedX = this.touchMoveVector.fixedY = 0;
    }
  };

  // ../../packages/mc2d/src/app/canvas-scale.js
  function applyCanvasScale(ctx, pixelRatio, allowScaleFallback = false) {
    if (ctx.setTransform) {
      ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    } else if (allowScaleFallback) {
      ctx.scale(pixelRatio, pixelRatio);
    }
  }

  // ../../packages/mc2d/src/app/stage.js
  var Stage = class extends Container {
    constructor(app2) {
      super();
      this.app = app2;
      this.touchEnabled = true;
      this.setStage(this);
      this.viewport = new Rect();
      this.renderRequested = true;
    }
    resize(width, height) {
      this.setFrame(0, 0, width, height);
      this.viewport.set(0, 0, width, height);
      this.worldBounds.set(0, 0, width, height);
      this.renderRequested = true;
    }
    requestRender() {
      this.renderRequested = true;
    }
    layoutTree() {
      this.layoutSelf(this.viewport, 0, 0);
    }
    renderStage(ctx) {
      const { width, height } = this.viewport;
      if (width <= 0 || height <= 0) return;
      ctx.clearRect(0, 0, width, height);
      this.children.forEach((child) => child.render(ctx));
      if (this.app.sharedCanvas) ctx.drawImage(this.app.sharedCanvas, 0, 0, width, height);
      this.renderRequested = false;
      this.dirtyPaint = false;
    }
  };

  // ../../packages/mc2d/src/app/mc2d-app.js
  var noop = () => {
  };
  var Mc2dApp = class extends EventEmitter {
    constructor(options = {}) {
      super();
      const { platform, canvas, fps = 60, autoRender = true } = options;
      if (!platform) throw new Error("Mc2dApp requires a platform adapter");
      if (!canvas) throw new Error("Mc2dApp requires a canvas");
      this.platform = platform;
      this.canvas = canvas;
      this.ctx = canvas.getContext("2d");
      this.fps = fps;
      this.autoRender = autoRender;
      this.running = false;
      this.frameId = 0;
      this.lastTime = 0;
      this.scaleInitialized = false;
      this.minFrameTime = fps > 0 ? 1e3 / fps : 0;
      this.assets = new AssetManager(platform);
      this.audio = new AudioManager(this.assets);
      this.stage = new Stage(this);
      this.rootLayer = new Container();
      this.effects = new Container();
      this.topLayer = new Container();
      this.layers = {
        root: this.rootLayer,
        effects: this.effects,
        top: this.topLayer
      };
      this.input = new InputManager(this.stage, platform);
      this.input.bind(canvas);
      this.sharedContext = platform.getOpenDataContext ? platform.getOpenDataContext() : null;
      this.sharedCanvas = this.sharedContext && this.sharedContext.canvas;
      this.tick = this.tick.bind(this);
      this.handleShow = this.handleShow.bind(this);
      this.handleHide = this.handleHide.bind(this);
      if (platform.setFPS) platform.setFPS(fps);
      if (platform.onShow) this.unbindShow = platform.onShow(this.handleShow);
      if (platform.onHide) this.unbindHide = platform.onHide(this.handleHide);
      this.resize();
    }
    setRoot(root) {
      this.stage.removeChildren();
      this.rootLayer.removeChildren();
      this.stage.addChild(this.rootLayer);
      this.stage.addChild(this.effects);
      this.stage.addChild(this.topLayer);
      if (root) this.rootLayer.addChild(root);
      this.stage.requestRender();
      this.stage.layoutTree();
      this.stage.update(0);
      this.stage.layoutTree();
      this.render();
      return root;
    }
    start(root = null) {
      if (root) this.setRoot(root);
      if (this.running) return;
      this.running = true;
      this.lastTime = 0;
      this.frameId = this.platform.requestAnimationFrame(this.tick);
    }
    stop() {
      this.running = false;
      if (this.frameId) this.platform.cancelAnimationFrame(this.frameId);
      this.frameId = 0;
    }
    resize(info = null) {
      const systemInfo = info || this.platform.getSystemInfo();
      const width = systemInfo.windowWidth || systemInfo.width || this.canvas.width || 0;
      const height = systemInfo.windowHeight || systemInfo.height || this.canvas.height || 0;
      const pixelRatio = systemInfo.pixelRatio || 1;
      this.systemInfo = systemInfo;
      this.width = width;
      this.height = height;
      this.pixelRatio = pixelRatio;
      const backingWidth = Math.round(width * pixelRatio);
      const backingHeight = Math.round(height * pixelRatio);
      const resized = this.canvas.width !== backingWidth || this.canvas.height !== backingHeight;
      if (this.canvas.width !== backingWidth) this.canvas.width = backingWidth;
      if (this.canvas.height !== backingHeight) this.canvas.height = backingHeight;
      applyCanvasScale(this.ctx, pixelRatio, resized || !this.scaleInitialized);
      this.scaleInitialized = true;
      this.stage.resize(width, height);
      Object.values(this.layers).forEach((layer) => layer.setFrame(0, 0, width, height));
      this.stage.layoutTree();
      this.stage.forEach((node) => {
        if (node.onScreenResize) node.onScreenResize(this.systemInfo);
      });
      if (this.sharedCanvas) {
        this.sharedCanvas.width = backingWidth;
        this.sharedCanvas.height = backingHeight;
        if (this.sharedContext.postMessage) {
          this.sharedContext.postMessage({
            command: "resize",
            pixelRatio,
            width: backingWidth,
            height: backingHeight
          });
        }
      }
      this.render();
    }
    tick(time = Date.now()) {
      if (!this.running) return;
      const elapsed = this.lastTime ? time - this.lastTime : this.minFrameTime;
      if (!this.minFrameTime || elapsed >= this.minFrameTime - 1) {
        this.lastTime = time;
        const dt = elapsed / 1e3;
        this.stage.update(dt);
        this.stage.layoutTree();
        if (this.autoRender || this.stage.renderRequested) this.render();
      }
      this.frameId = this.platform.requestAnimationFrame(this.tick);
    }
    render() {
      applyCanvasScale(this.ctx, this.pixelRatio);
      this.stage.renderStage(this.ctx);
    }
    handleShow(event) {
      this.emit("show", event);
      this.resize();
    }
    handleHide(event) {
      this.emit("hide", event);
    }
    enableShare(callback) {
      this.shareCallback = callback;
      if (this.platform.setShare) this.platform.setShare(callback);
    }
    share(options = null) {
      const payload = options || (this.shareCallback ? this.shareCallback() : null);
      if (payload && this.platform.share) this.platform.share(payload);
    }
    request(options) {
      return this.platform.request ? this.platform.request(options) : Promise.reject(new Error("platform.request is not available"));
    }
    createUserInfoButton(options) {
      return this.platform.createUserInfoButton ? this.platform.createUserInfoButton(options) : null;
    }
    getSetting(options = {}) {
      return this.platform.getSetting ? this.platform.getSetting(options) : Promise.reject(new Error("platform.getSetting is not available"));
    }
    getUserInfo(options = {}) {
      const {
        container = null,
        forceShowButton = false,
        onShowButton = null,
        type = "text",
        value = "\u767B\u5F55",
        style = null,
        userInfoOptions = {}
      } = options;
      return this.getSetting().then((setting) => {
        const authorized = setting.authSetting && setting.authSetting["scope.userInfo"];
        if (!forceShowButton && authorized && this.platform.getUserInfo) {
          return this.platform.getUserInfo(userInfoOptions).then((userInfo) => ({ setting, userInfo }));
        }
        if (!container) {
          if (!this.platform.getUserInfo) {
            return Promise.reject(new Error("platform.getUserInfo is not available"));
          }
          return this.platform.getUserInfo(userInfoOptions).then((userInfo) => ({ setting, userInfo }));
        }
        return new Promise((resolve, reject) => {
          const buttonNode = container.addChild(new LoginButton(this.platform, style || {}, type, value));
          const nativeButton = buttonNode.button;
          if (onShowButton) onShowButton(buttonNode, nativeButton);
          if (!nativeButton) {
            container.removeChild(buttonNode);
            reject(new Error("platform.createUserInfoButton is not available"));
            return;
          }
          nativeButton.onTap((userInfo) => {
            if (nativeButton.offTap) nativeButton.offTap();
            if (nativeButton.destroy) nativeButton.destroy();
            container.removeChild(buttonNode);
            resolve({ setting, userInfo });
          });
        });
      });
    }
    platformLogin(options = {}) {
      return this.platform.login ? this.platform.login(options) : Promise.reject(new Error("platform.login is not available"));
    }
    login(options = {}) {
      const {
        container = null,
        forceShowButton = false,
        onShowButton = null,
        onButtonTap = null,
        requestOptions = null,
        type = "text",
        value = "\u767B\u5F55",
        style = null,
        userInfoOptions = {},
        loginOptions = {}
      } = options;
      return this.getUserInfo({
        container,
        forceShowButton,
        onShowButton,
        type,
        value,
        style,
        userInfoOptions
      }).then(({ setting, userInfo }) => {
        if (onButtonTap) onButtonTap(setting, userInfo);
        return this.platformLogin(loginOptions).then((loginInfo) => {
          const requestConfig = typeof requestOptions === "function" ? requestOptions(setting, userInfo, loginInfo) : requestOptions;
          if (requestConfig && requestConfig.url) {
            return this.request(requestConfig).then((response) => ({ setting, userInfo, loginInfo, response })).catch((response) => ({ setting, userInfo, loginInfo, response }));
          }
          return { setting, userInfo, loginInfo, response: null };
        });
      });
    }
    getTouchPoint() {
      return this.input.getTouchPoint();
    }
    getTouchMoveVector() {
      return this.input.getTouchMoveVector();
    }
    lerp(a, b, t) {
      const diff = b - a;
      if (Math.abs(diff) < 1e-5) return b;
      return a + diff * Math.max(0, Math.min(1, t));
    }
    destroy() {
      this.stop();
      this.input.destroy();
      if (this.unbindShow) this.unbindShow();
      if (this.unbindHide) this.unbindHide();
      this.stage.removeChildren();
      this.platform.destroy ? this.platform.destroy() : noop();
    }
  };

  // ../../packages/mc2d/src/platform/wechat-adapter.js
  function fallbackRequestAnimationFrame(handler) {
    return setTimeout(() => handler(Date.now()), 16);
  }
  function fallbackCancelAnimationFrame(id) {
    clearTimeout(id);
  }
  var WeChatAdapter = {
    onShow(handler) {
      if (!wx.onShow) return null;
      wx.onShow(handler);
      return wx.offShow ? () => wx.offShow(handler) : null;
    },
    onHide(handler) {
      if (!wx.onHide) return null;
      wx.onHide(handler);
      return wx.offHide ? () => wx.offHide(handler) : null;
    },
    setFPS(fps) {
      if (wx.setPreferredFramesPerSecond) wx.setPreferredFramesPerSecond(fps);
    },
    getSystemInfo() {
      const info = wx.getSystemInfoSync();
      const { windowWidth, windowHeight, safeArea } = info;
      info.safeAreaTop = safeArea ? safeArea.top : windowHeight / windowWidth > 2 ? 50 : 0;
      return info;
    },
    createCanvas() {
      return wx.createCanvas();
    },
    createImage() {
      return wx.createImage ? wx.createImage() : new Image();
    },
    createAudio() {
      return wx.createInnerAudioContext ? wx.createInnerAudioContext() : new Audio();
    },
    getOpenDataContext() {
      return wx.getOpenDataContext ? wx.getOpenDataContext() : null;
    },
    createUserInfoButton(options) {
      return wx.createUserInfoButton ? wx.createUserInfoButton(options) : null;
    },
    share(options) {
      if (wx.shareAppMessage) wx.shareAppMessage(options);
    },
    setShare(handler) {
      if (wx.showShareMenu) wx.showShareMenu({ withShareTicket: true, menus: ["shareAppMessage", "shareTimeline"] });
      if (wx.onShareAppMessage) wx.onShareAppMessage(() => handler());
    },
    request(options) {
      if (!wx.request) return Promise.reject(new Error("wx.request is not available"));
      return new Promise((resolve, reject) => {
        wx.request(Object.assign({ timeout: 5e3 }, options, {
          success: (result) => {
            if (options && options.success) options.success(result);
            resolve(result);
          },
          fail: (error) => {
            if (options && options.fail) options.fail(error);
            reject(error);
          },
          complete: (result) => {
            if (options && options.complete) options.complete(result);
          }
        }));
      });
    },
    getSetting(options = {}) {
      if (!wx.getSetting) return Promise.reject(new Error("wx.getSetting is not available"));
      return new Promise((resolve, reject) => {
        wx.getSetting(Object.assign({}, options, {
          success: (result) => {
            if (options.success) options.success(result);
            resolve(result);
          },
          fail: (error) => {
            if (options.fail) options.fail(error);
            reject(error);
          },
          complete: (result) => {
            if (options.complete) options.complete(result);
          }
        }));
      });
    },
    getUserInfo(options = {}) {
      if (!wx.getUserInfo) return Promise.reject(new Error("wx.getUserInfo is not available"));
      return new Promise((resolve, reject) => {
        wx.getUserInfo(Object.assign({}, options, {
          success: (result) => {
            if (options.success) options.success(result);
            resolve(result);
          },
          fail: (error) => {
            if (options.fail) options.fail(error);
            reject(error);
          },
          complete: (result) => {
            if (options.complete) options.complete(result);
          }
        }));
      });
    },
    login(options = {}) {
      if (!wx.login) return Promise.reject(new Error("wx.login is not available"));
      return new Promise((resolve, reject) => {
        wx.login(Object.assign({}, options, {
          success: (result) => {
            if (options.success) options.success(result);
            resolve(result);
          },
          fail: (error) => {
            if (options.fail) options.fail(error);
            reject(error);
          },
          complete: (result) => {
            if (options.complete) options.complete(result);
          }
        }));
      });
    },
    requestAnimationFrame(handler) {
      const raf = wx.requestAnimationFrame || globalThis.requestAnimationFrame || (typeof requestAnimationFrame !== "undefined" ? requestAnimationFrame : null) || fallbackRequestAnimationFrame;
      return raf(handler);
    },
    cancelAnimationFrame(id) {
      const caf = wx.cancelAnimationFrame || globalThis.cancelAnimationFrame || (typeof cancelAnimationFrame !== "undefined" ? cancelAnimationFrame : null) || fallbackCancelAnimationFrame;
      caf(id);
    },
    bindTouch(canvas, handlers) {
      if (canvas.addEventListener) {
        canvas.addEventListener("touchstart", handlers.start);
        canvas.addEventListener("touchmove", handlers.move);
        canvas.addEventListener("touchend", handlers.end);
        canvas.addEventListener("touchcancel", handlers.cancel);
        return () => {
          canvas.removeEventListener("touchstart", handlers.start);
          canvas.removeEventListener("touchmove", handlers.move);
          canvas.removeEventListener("touchend", handlers.end);
          canvas.removeEventListener("touchcancel", handlers.cancel);
        };
      }
      wx.onTouchStart(handlers.start);
      wx.onTouchMove(handlers.move);
      wx.onTouchEnd(handlers.end);
      if (wx.onTouchCancel) wx.onTouchCancel(handlers.cancel);
      return () => {
        if (wx.offTouchStart) wx.offTouchStart(handlers.start);
        if (wx.offTouchMove) wx.offTouchMove(handlers.move);
        if (wx.offTouchEnd) wx.offTouchEnd(handlers.end);
        if (wx.offTouchCancel) wx.offTouchCancel(handlers.cancel);
      };
    },
    getStorage(key) {
      try {
        return wx.getStorageSync(key);
      } catch (e) {
        return null;
      }
    },
    setStorage(key, value) {
      try {
        wx.setStorageSync(key, value);
      } catch (e) {
      }
    },
    removeStorage(key) {
      try {
        wx.removeStorageSync(key);
      } catch (e) {
      }
    }
  };
  var wechat_adapter_default = WeChatAdapter;

  // ../../packages/mc2d/src/display/graphics/shape.js
  var Shape = class extends Graphic {
    constructor(options = {}) {
      super(Object.assign({
        shape: "rect",
        radius: 0,
        fillStyle: "#fff",
        strokeStyle: "",
        lineWidth: 1
      }, options));
    }
    drawRoundRect(ctx, width, height, radius) {
      const r = Math.max(0, Math.min(radius, width / 2, height / 2));
      ctx.beginPath();
      ctx.moveTo(r, 0);
      ctx.lineTo(width - r, 0);
      ctx.arcTo(width, 0, width, r, r);
      ctx.lineTo(width, height - r);
      ctx.arcTo(width, height, width - r, height, r);
      ctx.lineTo(r, height);
      ctx.arcTo(0, height, 0, height - r, r);
      ctx.lineTo(0, r);
      ctx.arcTo(0, 0, r, 0, r);
      ctx.closePath();
    }
    draw(ctx) {
      const { shape, fillStyle, strokeStyle, lineWidth, radius } = this.options;
      ctx.beginPath();
      if (shape === "circle") {
        const r = Math.min(this.width, this.height) / 2;
        ctx.arc(this.width / 2, this.height / 2, r, 0, Math.PI * 2);
      } else if (shape === "ellipse") {
        ctx.ellipse(this.width / 2, this.height / 2, this.width / 2, this.height / 2, 0, 0, Math.PI * 2);
      } else if (radius > 0 || shape === "roundRect") {
        this.drawRoundRect(ctx, this.width, this.height, radius || this.options.roundRadius || 6);
      } else {
        ctx.rect(0, 0, this.width, this.height);
      }
      if (fillStyle) {
        ctx.fillStyle = fillStyle;
        ctx.fill();
      }
      if (strokeStyle && lineWidth > 0) {
        ctx.strokeStyle = strokeStyle;
        ctx.lineWidth = lineWidth;
        ctx.stroke();
      }
    }
  };

  // ../../packages/mc2d/src/display/graphics/text.js
  var Text = class extends Graphic {
    constructor(text = "", options = {}) {
      super(Object.assign({
        fillStyle: "#fff",
        fontSize: 14,
        fontFamily: "Arial",
        textAlign: "center",
        textBaseline: "middle",
        lineHeight: 0,
        maxLines: 0,
        ellipsis: false,
        strokeStyle: "",
        lineWidth: 1
      }, options));
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
      const {
        fillStyle,
        fontSize,
        fontFamily,
        textAlign,
        textBaseline,
        lineHeight,
        maxLines,
        ellipsis,
        strokeStyle,
        lineWidth
      } = this.options;
      let lines = this._text.split("\n");
      if (maxLines > 0 && lines.length > maxLines) {
        lines = lines.slice(0, maxLines);
        if (ellipsis) lines[lines.length - 1] += "...";
      }
      const lh = lineHeight || fontSize * 1.25;
      const totalHeight = lh * lines.length;
      let y = this.height / 2 - totalHeight / 2 + lh / 2;
      let x = this.width / 2;
      if (textAlign === "left") x = 0;
      else if (textAlign === "right") x = this.width;
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
  };

  // ../../packages/mc2d/src/display/graphics/button.js
  var Button = class extends Container {
    constructor(label = "", options = {}) {
      super();
      this.touchEnabled = true;
      const normalBackground = Object.assign({
        fillStyle: "#2f7df6",
        radius: 6
      }, options.background);
      const normalLabel = Object.assign({
        fillStyle: "#fff",
        fontSize: 16
      }, options.label);
      this.styles = {
        normal: options.normal || {
          background: normalBackground,
          label: normalLabel
        },
        pressed: options.pressed || null,
        disabled: options.disabled || null
      };
      this.state = "normal";
      this.background = this.addChild(new Shape(normalBackground));
      this.labelView = this.addChild(new Text(label, normalLabel));
      this.on("pointerdown", () => this.setState("pressed"));
      this.on("pointerup", () => this.setState("normal"));
      this.on("pointercancel", () => this.setState("normal"));
    }
    get label() {
      return this.labelView.text;
    }
    set label(value) {
      this.labelView.text = value;
    }
    setState(state) {
      if (state === "pressed" && !this.styles.pressed) state = "normal";
      if (state === "disabled") this.touchEnabled = false;
      else if (this.state === "disabled") this.touchEnabled = true;
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
  };

  // ../../packages/mc2d/src/display/layout/unit.js
  var Unit = class _Unit {
    constructor(value = 0, percent = false, valid = true) {
      this.value = value;
      this.percent = percent;
      this.valid = valid;
    }
    static parse(value, fallback = 0) {
      if (value === null || value === void 0 || value === "") return new _Unit(fallback, false, false);
      if (typeof value === "string" && value.indexOf("%") >= 0) {
        return new _Unit(parseFloat(value) / 100, true, !isNaN(parseFloat(value)));
      }
      const number = Number(value);
      return new _Unit(number, false, !isNaN(number));
    }
    resolve(total, fallback = 0) {
      if (!this.valid) return fallback;
      return this.percent ? total * this.value : this.value;
    }
  };

  // ../../packages/mc2d/src/display/layout/anchor-layout.js
  var ANCHORS = {
    "top-left": [0, 0],
    top: [0.5, 0],
    "top-center": [0.5, 0],
    "top-right": [1, 0],
    left: [0, 0.5],
    "middle-left": [0, 0.5],
    center: [0.5, 0.5],
    middle: [0.5, 0.5],
    right: [1, 0.5],
    "middle-right": [1, 0.5],
    "bottom-left": [0, 1],
    bottom: [0.5, 1],
    "bottom-center": [0.5, 1],
    "bottom-right": [1, 1]
  };
  var AnchorLayout = class {
    constructor(options = {}) {
      this.anchor = options.anchor || "top-left";
      this.x = Unit.parse(options.x || 0);
      this.y = Unit.parse(options.y || 0);
      this.width = Unit.parse(options.width === void 0 ? "100%" : options.width);
      this.height = Unit.parse(options.height === void 0 ? "100%" : options.height);
    }
    applyTo(target, parentBounds) {
      const anchor2 = ANCHORS[this.anchor] || ANCHORS.center;
      const width = this.width.resolve(parentBounds.width, target.width);
      const height = this.height.resolve(parentBounds.height, target.height);
      const offsetX = this.x.resolve(parentBounds.width);
      const offsetY = this.y.resolve(parentBounds.height);
      target.x = (parentBounds.width - width) * anchor2[0] + offsetX;
      target.y = (parentBounds.height - height) * anchor2[1] + offsetY;
      target.width = width;
      target.height = height;
    }
  };

  // ../../packages/mc2d/src/display/layout/index.js
  function anchor(options) {
    return new AnchorLayout(options);
  }

  // ../../packages/mc2d/src/index.js
  function createWeChatApp(options = {}) {
    const platform = options.platform || wechat_adapter_default;
    const mainCanvas = options.canvas || globalThis.canvas || platform.createCanvas();
    return new Mc2dApp(Object.assign({}, options, {
      platform,
      canvas: mainCanvas
    }));
  }

  // src/config.js
  var GAME_ID = "mahjong";
  var SERVER_BASE_URL = "http://192.168.2.191:2567";

  // src/auth/wechat-login.js
  var AUTH_STORAGE_KEY = "wxMahjong.authSession";
  function getCachedAuthSession(app2, options = {}) {
    try {
      const gameId = getGameId(options);
      const session = app2.platform.getStorage ? app2.platform.getStorage(AUTH_STORAGE_KEY) : null;
      if (session && session.gameId === gameId && session.token && session.user) return session;
    } catch (error) {
    }
    return null;
  }
  function clearCachedAuthSession(app2) {
    try {
      if (app2.platform.removeStorage) {
        app2.platform.removeStorage(AUTH_STORAGE_KEY);
      }
    } catch (error) {
    }
  }
  async function loginWechatMiniGame(app2, options = {}) {
    const gameId = getGameId(options);
    const userProfile = normalizeUserProfile(options.userInfo);
    const loginInfo = await app2.platformLogin();
    if (!loginInfo || !loginInfo.code) {
      throw new Error("wx.login did not return a code.");
    }
    const loginUrl = `${getServerBaseUrl(options)}/auth/wechat/minigame/login`;
    console.info("[wx-mahjong] wechat login request", {
      gameId,
      url: loginUrl,
      hasAvatarUrl: Boolean(userProfile.avatarUrl)
    });
    let response = null;
    try {
      response = await app2.request({
        url: loginUrl,
        method: "POST",
        header: {
          "content-type": "application/json"
        },
        data: {
          gameId,
          code: loginInfo.code,
          name: options.name || userProfile.nickName || "player",
          avatarUrl: userProfile.avatarUrl || ""
        }
      });
    } catch (error) {
      console.warn("[wx-mahjong] wechat login request failed", {
        gameId,
        url: loginUrl,
        errMsg: error && error.errMsg,
        errno: error && error.errno
      });
      throw error;
    }
    const data = response && response.data;
    if (!response || response.statusCode < 200 || response.statusCode >= 300 || !data || !data.ok || !data.token) {
      throw new Error(data && data.message || "Wechat login request failed.");
    }
    const session = {
      gameId,
      token: data.token,
      user: data.user
    };
    if (app2.platform.setStorage) {
      app2.platform.setStorage(AUTH_STORAGE_KEY, session);
    }
    return session;
  }
  function getServerBaseUrl(options) {
    const value = options.serverBaseUrl || globalThis.__WX_MAHJONG_SERVER_URL__ || SERVER_BASE_URL;
    return String(value).replace(/\/+$/, "");
  }
  function getGameId(options) {
    return String(options.gameId || globalThis.__WX_MAHJONG_GAME_ID__ || GAME_ID);
  }
  function normalizeUserProfile(value) {
    const userInfo = value && value.userInfo ? value.userInfo : value;
    return {
      nickName: userInfo && userInfo.nickName || "",
      avatarUrl: userInfo && userInfo.avatarUrl || ""
    };
  }

  // src/login-view.js
  var LoginView = class extends Container {
    constructor(app2, options = {}) {
      super();
      this.app = app2;
      this.onLogin = options.onLogin || null;
      this.initialMessage = options.message || "\u51C6\u5907\u767B\u5F55";
      this.status = "idle";
      this.setLayout(anchor({ anchor: "top-left", width: "100%", height: "100%" }));
      this.background = this.addChild(new Shape({ fillStyle: "#173b32" }));
      this.background.setLayout(anchor({ anchor: "top-left", width: "100%", height: "100%" }));
      this.title = this.addChild(
        new Text("\u7EA2\u4E2D\u9EBB\u5C06", {
          fillStyle: "#f9f2dc",
          fontSize: 28,
          textAlign: "center"
        })
      );
      this.title.setLayout(anchor({ anchor: "top", y: 120, width: 240, height: 44 }));
      this.statusText = this.addChild(
        new Text(this.initialMessage, {
          fillStyle: "#dce8de",
          fontSize: 14,
          lineHeight: 20,
          maxLines: 2
        })
      );
      this.statusText.setLayout(anchor({ anchor: "top", y: 176, width: 260, height: 48 }));
      this.retryButton = this.addChild(
        new Button("\u91CD\u8BD5", {
          background: { fillStyle: "#2f7df6", radius: 6 },
          label: { fillStyle: "#fff", fontSize: 16 }
        })
      );
      this.retryButton.setLayout(anchor({ anchor: "top", y: 246, width: 150, height: 42 }));
      this.retryButton.visible = false;
      this.retryButton.on("tap", () => this.startLogin(true));
    }
    async startLogin(force = false) {
      if (this.status === "loading") return;
      const cachedSession = !force ? getCachedAuthSession(this.app) : null;
      if (cachedSession) {
        this.finishLogin(cachedSession);
        return;
      }
      this.setStatus("waiting");
      try {
        const { userInfo } = await this.app.getUserInfo({
          container: this,
          forceShowButton: true,
          value: "\u5FAE\u4FE1\u767B\u5F55",
          style: {
            backgroundColor: "#07c160",
            color: "#ffffff",
            borderRadius: 6,
            fontSize: 16,
            lineHeight: 44
          },
          onShowButton: (button) => {
            button.setLayout(anchor({ anchor: "top", y: 246, width: 150, height: 44 }));
          }
        });
        this.setStatus("loading");
        const authSession = await loginWechatMiniGame(this.app, { userInfo });
        this.finishLogin(authSession);
      } catch (error) {
        this.setStatus("failed", error);
      }
    }
    finishLogin(authSession) {
      this.setStatus("ready");
      if (this.onLogin) this.onLogin(authSession);
    }
    setStatus(status, error = null) {
      this.status = status;
      this.retryButton.visible = status === "failed";
      if (status === "waiting") this.statusText.text = "\u8BF7\u5148\u5B8C\u6210\u5FAE\u4FE1\u767B\u5F55";
      else if (status === "loading") this.statusText.text = "\u5FAE\u4FE1\u767B\u5F55\u4E2D...";
      else if (status === "ready") this.statusText.text = "\u767B\u5F55\u6210\u529F";
      else if (status === "failed") this.statusText.text = "\u767B\u5F55\u5931\u8D25\uFF0C\u8BF7\u91CD\u8BD5";
      else this.statusText.text = this.initialMessage;
      if (error) console.warn("[wx-mahjong] wechat login failed", error);
      this.invalidatePaint();
    }
  };

  // src/server/tiles.js
  var SUITS = [
    { key: "W", name: "\u4E07", color: "#c0392b" },
    { key: "B", name: "\u7B52", color: "#1f7a4d" },
    { key: "T", name: "\u6761", color: "#2563a8" }
  ];
  var ZHONG = "ZH";
  function createTileTypes() {
    const types = [];
    SUITS.forEach((suit) => {
      for (let rank = 1; rank <= 9; rank++) {
        types.push(`${suit.key}${rank}`);
      }
    });
    types.push(ZHONG);
    return types;
  }
  var TILE_TYPES = createTileTypes();
  function createDeck() {
    const deck = [];
    TILE_TYPES.forEach((tile) => {
      for (let i = 0; i < 4; i++) deck.push(tile);
    });
    return deck;
  }
  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const t = arr[i];
      arr[i] = arr[j];
      arr[j] = t;
    }
    return arr;
  }
  function tileSuit(tile) {
    if (tile === ZHONG) return null;
    return tile[0];
  }
  function tileRank(tile) {
    if (tile === ZHONG) return 0;
    return parseInt(tile.slice(1), 10);
  }
  function tileInfo(tile) {
    if (tile === ZHONG) {
      return { label: "\u4E2D", subLabel: "\u7EA2", color: "#d71920", suit: null, rank: 0 };
    }
    const suit = SUITS.find((item) => item.key === tileSuit(tile));
    const rank = tileRank(tile);
    return {
      label: `${rank}`,
      subLabel: suit.name,
      color: suit.color,
      suit: suit.key,
      rank
    };
  }
  function tileOrder(tile) {
    if (tile === ZHONG) return 99;
    const suitIndex = SUITS.findIndex((suit) => suit.key === tileSuit(tile));
    return suitIndex * 10 + tileRank(tile);
  }
  function sortTiles(tiles) {
    return tiles.slice().sort((a, b) => tileOrder(a) - tileOrder(b));
  }
  function countTiles(tiles) {
    return tiles.reduce((map, tile) => {
      map[tile] = (map[tile] || 0) + 1;
      return map;
    }, {});
  }
  function removeTiles(hand, tile, count) {
    let removed = 0;
    for (let i = hand.length - 1; i >= 0 && removed < count; i--) {
      if (hand[i] === tile) {
        hand.splice(i, 1);
        removed++;
      }
    }
    return removed === count;
  }

  // src/server/hu.js
  var NORMAL_TYPES = TILE_TYPES.filter((tile) => tile !== ZHONG);
  function cloneCounts(counts) {
    return Object.assign({}, counts);
  }
  function countTotal(counts) {
    return NORMAL_TYPES.reduce((sum, tile) => sum + (counts[tile] || 0), 0);
  }
  function firstTile(counts) {
    return NORMAL_TYPES.find((tile) => (counts[tile] || 0) > 0);
  }
  function keyOf(counts, wildcards, groupsLeft) {
    const body = NORMAL_TYPES.map((tile) => counts[tile] || 0).join("");
    return `${body}|${wildcards}|${groupsLeft}`;
  }
  function consume(counts, tile, amount) {
    const available = counts[tile] || 0;
    const used = Math.min(available, amount);
    counts[tile] = available - used;
    return amount - used;
  }
  function canMakeGroups(counts, wildcards, groupsLeft, memo) {
    if (groupsLeft === 0) return countTotal(counts) === 0;
    const memoKey = keyOf(counts, wildcards, groupsLeft);
    if (memo[memoKey] !== void 0) return memo[memoKey];
    const tile = firstTile(counts);
    if (!tile) return memo[memoKey] = wildcards >= groupsLeft * 3;
    let next = cloneCounts(counts);
    let need = consume(next, tile, 3);
    if (need <= wildcards && canMakeGroups(next, wildcards - need, groupsLeft - 1, memo)) {
      return memo[memoKey] = true;
    }
    const suit = tileSuit(tile);
    const rank = tileRank(tile);
    if (rank <= 7) {
      const seq = [`${suit}${rank}`, `${suit}${rank + 1}`, `${suit}${rank + 2}`];
      next = cloneCounts(counts);
      need = 0;
      seq.forEach((item) => {
        need += consume(next, item, 1);
      });
      if (need <= wildcards && canMakeGroups(next, wildcards - need, groupsLeft - 1, memo)) {
        return memo[memoKey] = true;
      }
    }
    return memo[memoKey] = false;
  }
  function canHuWithMelds(hand, meldCount = 0) {
    const groupsLeft = 4 - meldCount;
    if (groupsLeft < 0) return false;
    if (hand.length !== groupsLeft * 3 + 2) return false;
    const counts = countTiles(hand);
    const wildcards = counts[ZHONG] || 0;
    delete counts[ZHONG];
    for (const pairTile of NORMAL_TYPES) {
      const pairCounts = cloneCounts(counts);
      const need = consume(pairCounts, pairTile, 2);
      if (need <= wildcards && canMakeGroups(pairCounts, wildcards - need, groupsLeft, {})) {
        return true;
      }
    }
    if (wildcards >= 2 && canMakeGroups(cloneCounts(counts), wildcards - 2, groupsLeft, {})) {
      return true;
    }
    return false;
  }

  // src/server/mahjong-server.js
  var PLAYER_NAMES = ["\u4F60", "\u4E0B\u5BB6", "\u5BF9\u5BB6", "\u4E0A\u5BB6"];
  function nextPlayer(player) {
    return (player + 1) % 4;
  }
  function clonePlayer(player, index) {
    const hand = player.drawnTile ? player.hand.concat(player.drawnTile) : player.hand.slice();
    return {
      index,
      name: PLAYER_NAMES[index],
      hand,
      drawnTile: player.drawnTile,
      handCount: hand.length,
      discards: player.discards.slice(),
      melds: player.melds.map((meld) => Object.assign({}, meld, { tiles: meld.tiles.slice() }))
    };
  }
  var MahjongServer = class {
    constructor(onUpdate) {
      this.onUpdate = onUpdate;
      this.autoDelay = 650;
      this.autoTimer = null;
      this.start();
    }
    start() {
      this.clearAutoTimer();
      this.wall = shuffle(createDeck());
      this.players = PLAYER_NAMES.map(() => ({ hand: [], drawnTile: null, discards: [], melds: [] }));
      this.currentPlayer = 0;
      this.phase = "waiting-discard";
      this.lastDiscard = null;
      this.pendingActions = [];
      this.winner = null;
      this.bird = null;
      this.message = "\u8F6E\u5230\u4F60\u51FA\u724C\u3002\u7EA2\u4E2D\u53EF\u4F5C\u4E07\u80FD\u724C\uFF0C\u4E0D\u80FD\u6253\u51FA\u3002";
      for (let i = 0; i < 13; i++) {
        this.players.forEach((player) => player.hand.push(this.wall.pop()));
      }
      this.players[0].drawnTile = this.wall.pop();
      this.sortHands();
      this.emit();
    }
    sortHands() {
      this.players.forEach((player) => {
        player.hand = sortTiles(player.hand);
      });
    }
    emit() {
      if (this.onUpdate) this.onUpdate(this.snapshot());
    }
    snapshot() {
      return {
        phase: this.phase,
        currentPlayer: this.currentPlayer,
        wallCount: this.wall.length,
        lastDiscard: this.lastDiscard && Object.assign({}, this.lastDiscard),
        message: this.message,
        winner: this.winner,
        bird: this.bird,
        actions: this.getPlayerActions(),
        players: this.players.map(clonePlayer)
      };
    }
    getPlayerActions() {
      if (this.phase === "round-over") return {};
      if (this.phase === "waiting-action") {
        const action = this.pendingActions.find((item) => item.player === 0);
        return action ? { pass: true, peng: action.peng, gang: action.gang } : {};
      }
      if (this.currentPlayer !== 0 || this.phase !== "waiting-discard") return {};
      return {
        discard: true,
        hu: this.canCurrentHu(0),
        gangTiles: this.getConcealedGangTiles(0)
      };
    }
    playerDiscard(tileIndex) {
      if (this.phase !== "waiting-discard" || this.currentPlayer !== 0) return;
      if (this.discardTile(0, tileIndex)) this.scheduleAuto();
      this.emit();
    }
    playerPass() {
      if (this.phase !== "waiting-action") return;
      this.pendingActions = this.pendingActions.filter((action) => action.player !== 0);
      this.message = "\u4F60\u9009\u62E9\u8FC7\u3002";
      this.resolvePendingActions();
      this.scheduleAuto();
      this.emit();
    }
    playerPeng() {
      this.claimDiscard(0, "peng");
      this.emit();
    }
    playerGang(tile = null) {
      if (this.phase === "waiting-action") {
        this.claimDiscard(0, "gang");
      } else if (this.currentPlayer === 0 && this.phase === "waiting-discard") {
        const gangTile = tile || this.getConcealedGangTiles(0)[0];
        if (gangTile) this.concealedGang(0, gangTile);
      }
      this.emit();
    }
    playerHu() {
      if (this.currentPlayer !== 0 || this.phase !== "waiting-discard") return;
      if (!this.canCurrentHu(0)) return;
      this.finishRound(0, "\u4F60\u81EA\u6478\u80E1\u724C");
      this.emit();
    }
    discardTile(playerIndex, tileIndex) {
      const player = this.players[playerIndex];
      const handTiles = this.getPlayerTiles(playerIndex);
      const tile = handTiles[tileIndex];
      if (!tile || tile === ZHONG) {
        this.message = "\u7EA2\u4E2D\u4E0D\u80FD\u6253\u51FA\u3002";
        return false;
      }
      if (player.drawnTile && tileIndex === player.hand.length) {
        player.drawnTile = null;
      } else {
        player.hand.splice(tileIndex, 1);
        this.commitDrawnTile(playerIndex);
      }
      player.hand = sortTiles(player.hand);
      player.discards.push(tile);
      this.lastDiscard = { tile, from: playerIndex };
      this.message = `${PLAYER_NAMES[playerIndex]}\u6253\u51FA${this.tileText(tile)}\u3002`;
      this.collectPendingActions();
      if (this.phase !== "waiting-action") this.nextTurn(nextPlayer(playerIndex));
      return true;
    }
    collectPendingActions() {
      const { tile, from } = this.lastDiscard;
      const actions = [];
      for (let offset = 1; offset <= 3; offset++) {
        const playerIndex = (from + offset) % 4;
        const count = countTiles(this.players[playerIndex].hand)[tile] || 0;
        if (tile !== ZHONG && count >= 2) {
          actions.push({ player: playerIndex, peng: true, gang: count >= 3 });
        }
      }
      this.pendingActions = actions;
      this.phase = actions.length ? "waiting-action" : "waiting-discard";
      if (actions.find((action) => action.player === 0)) {
        this.message = `\u6709\u4EBA\u6253\u51FA${this.tileText(tile)}\uFF0C\u4F60\u53EF\u4EE5\u78B0/\u6760\u3002`;
      }
    }
    resolvePendingActions() {
      if (!this.pendingActions.length) {
        this.nextTurn(nextPlayer(this.lastDiscard.from));
        return;
      }
      const aiAction = this.pendingActions.find((action) => action.player !== 0);
      if (!aiAction) return;
      this.claimDiscard(aiAction.player, aiAction.gang ? "gang" : "peng");
    }
    claimDiscard(playerIndex, type) {
      if (!this.lastDiscard) return;
      const action = this.pendingActions.find((item) => item.player === playerIndex);
      if (!action || type === "gang" && !action.gang || type === "peng" && !action.peng) return;
      const player = this.players[playerIndex];
      const need = type === "gang" ? 3 : 2;
      const tile = this.lastDiscard.tile;
      if (!removeTiles(player.hand, tile, need)) return;
      const from = this.lastDiscard.from;
      const discardPile = this.players[from].discards;
      discardPile.splice(discardPile.lastIndexOf(tile), 1);
      player.melds.push({ type, tiles: new Array(need + 1).fill(tile), from });
      this.currentPlayer = playerIndex;
      this.phase = "waiting-discard";
      this.pendingActions = [];
      this.lastDiscard = null;
      if (type === "gang") this.drawTile(playerIndex);
      this.sortHands();
      this.message = `${PLAYER_NAMES[playerIndex]}${type === "gang" ? "\u6760" : "\u78B0"}\u724C\u3002`;
    }
    concealedGang(playerIndex, tile) {
      const player = this.players[playerIndex];
      if ((countTiles(this.getPlayerTiles(playerIndex))[tile] || 0) < 4 || tile === ZHONG) return;
      this.commitDrawnTile(playerIndex);
      removeTiles(player.hand, tile, 4);
      player.melds.push({ type: "angang", tiles: [tile, tile, tile, tile], from: playerIndex });
      this.drawTile(playerIndex);
      this.sortHands();
      this.message = `${PLAYER_NAMES[playerIndex]}\u6697\u6760\u3002`;
    }
    nextTurn(playerIndex) {
      this.currentPlayer = playerIndex;
      this.phase = "waiting-discard";
      if (!this.drawTile(playerIndex)) return;
      if (this.canCurrentHu(playerIndex)) {
        if (playerIndex === 0) {
          this.message = "\u4F60\u53EF\u4EE5\u81EA\u6478\u80E1\u724C\u3002";
        } else {
          this.finishRound(playerIndex, `${PLAYER_NAMES[playerIndex]}\u81EA\u6478\u80E1\u724C`);
        }
      } else {
        this.message = playerIndex === 0 ? "\u8F6E\u5230\u4F60\u6478\u724C\u540E\u51FA\u724C\u3002" : `${PLAYER_NAMES[playerIndex]}\u6478\u724C\u3002`;
      }
    }
    drawTile(playerIndex) {
      if (!this.wall.length) {
        this.phase = "round-over";
        this.message = "\u724C\u5899\u6478\u5B8C\uFF0C\u6D41\u5C40\u3002";
        return false;
      }
      this.players[playerIndex].drawnTile = this.wall.pop();
      return true;
    }
    clearAutoTimer() {
      if (!this.autoTimer) return;
      clearTimeout(this.autoTimer);
      this.autoTimer = null;
    }
    scheduleAuto() {
      this.clearAutoTimer();
      if (this.phase === "round-over") return;
      if (this.currentPlayer === 0 && this.phase !== "waiting-action") return;
      if (this.pendingActions.find((action) => action.player === 0)) return;
      this.autoTimer = setTimeout(() => {
        this.autoTimer = null;
        this.runAutoStep();
      }, this.autoDelay);
    }
    runAutoStep() {
      if (this.phase === "round-over") return;
      if (this.phase === "waiting-action") {
        if (this.pendingActions.find((action) => action.player === 0)) return;
        this.resolvePendingActions();
        this.emit();
        this.scheduleAuto();
        return;
      }
      if (this.currentPlayer === 0) return;
      const playerIndex = this.currentPlayer;
      if (this.canCurrentHu(playerIndex)) {
        this.finishRound(playerIndex, `${PLAYER_NAMES[playerIndex]}\u81EA\u6478\u80E1\u724C`);
        this.emit();
        return;
      }
      const gangTile = this.getConcealedGangTiles(playerIndex)[0];
      if (gangTile) {
        this.concealedGang(playerIndex, gangTile);
        this.emit();
        this.scheduleAuto();
        return;
      }
      const discardIndex = this.chooseAIDiscard(playerIndex);
      this.discardTile(playerIndex, discardIndex);
      this.emit();
      this.scheduleAuto();
    }
    chooseAIDiscard(playerIndex) {
      const hand = this.getPlayerTiles(playerIndex);
      const counts = countTiles(hand);
      let bestIndex = hand.findIndex((tile) => tile !== ZHONG);
      let bestScore = -Infinity;
      hand.forEach((tile, index) => {
        if (tile === ZHONG) return;
        const score = this.discardScore(tile, counts);
        if (score > bestScore) {
          bestIndex = index;
          bestScore = score;
        }
      });
      return bestIndex;
    }
    discardScore(tile, counts) {
      const order = tileOrder(tile);
      let score = order / 100;
      if (counts[tile] > 1) score -= 4;
      const suit = tile[0];
      const rank = parseInt(tile.slice(1), 10);
      if (counts[`${suit}${rank - 1}`]) score -= 1;
      if (counts[`${suit}${rank + 1}`]) score -= 1;
      if (counts[`${suit}${rank - 2}`]) score -= 0.4;
      if (counts[`${suit}${rank + 2}`]) score -= 0.4;
      return score;
    }
    getConcealedGangTiles(playerIndex) {
      const counts = countTiles(this.getPlayerTiles(playerIndex));
      return Object.keys(counts).filter((tile) => tile !== ZHONG && counts[tile] >= 4);
    }
    canCurrentHu(playerIndex) {
      const player = this.players[playerIndex];
      return canHuWithMelds(this.getPlayerTiles(playerIndex), player.melds.length);
    }
    getPlayerTiles(playerIndex) {
      const player = this.players[playerIndex];
      return player.drawnTile ? player.hand.concat(player.drawnTile) : player.hand.slice();
    }
    commitDrawnTile(playerIndex) {
      const player = this.players[playerIndex];
      if (!player.drawnTile) return;
      player.hand.push(player.drawnTile);
      player.drawnTile = null;
    }
    finishRound(winner, reason) {
      this.phase = "round-over";
      this.winner = winner;
      this.bird = this.wall.pop() || null;
      this.message = `${reason}\u3002${this.bird ? `\u624E\u9E1F\uFF1A${this.tileText(this.bird)}\u3002` : ""}`;
    }
    tileText(tile) {
      if (tile === ZHONG) return "\u7EA2\u4E2D";
      return `${tile.slice(1)}${tile[0] === "W" ? "\u4E07" : tile[0] === "B" ? "\u7B52" : "\u6761"}`;
    }
  };

  // src/main-controller.js
  var POLL_INTERVAL_MS = 900;
  var MainController = class {
    constructor(view, authSession = null, roomOptions = {}) {
      this.view = view;
      this.authSession = authSession;
      this.roomOptions = roomOptions;
      this.roomId = roomOptions.roomId || "";
      this.clientId = createClientId();
      this.localServer = null;
      this.online = false;
      this.pollTimer = null;
      this.requestingSnapshot = false;
      this.socket = null;
      this.socketOpen = false;
      if (authSession && authSession.token) {
        this.connect();
      } else {
        this.startLocal("\u672A\u767B\u5F55\uFF0C\u4F7F\u7528\u672C\u5730\u5355\u673A\u6A21\u5F0F\u3002");
      }
    }
    setAuthSession(authSession) {
      this.authSession = authSession;
      if (authSession && authSession.token && !this.online) {
        this.connect();
      }
    }
    async connect() {
      this.stopPolling();
      this.view.renderState(createStatusState("\u6B63\u5728\u8FDE\u63A5\u591A\u4EBA\u724C\u5C40..."));
      try {
        const user = this.authSession && this.authSession.user || {};
        const data = await this.request(this.getJoinPath(), {
          method: "POST",
          data: {
            name: user.displayName || user.name || "player",
            password: this.roomOptions.password || "",
            timeoutSeconds: this.roomOptions.timeoutSeconds || 30
          }
        });
        this.online = true;
        this.roomId = data.roomId || this.roomId;
        this.localServer = null;
        this.renderResponseState(data);
        this.startPolling();
        this.connectWebSocket();
      } catch (error) {
        console.warn("[wx-mahjong] multiplayer connect failed", error);
        if (error && error.statusCode === 401 && this.view.backToLogin) {
          this.view.backToLogin("\u767B\u5F55\u5DF2\u8FC7\u671F\uFF0C\u8BF7\u91CD\u65B0\u767B\u5F55\u3002");
        } else if (error && (error.statusCode === 404 || error.statusCode === 409 || error.statusCode === 410) && this.view.backToLobby) {
          this.view.backToLobby(error.message || "\u623F\u95F4\u4E0D\u53EF\u7528\uFF0C\u8BF7\u91CD\u65B0\u521B\u5EFA\u6216\u52A0\u5165\u3002");
        } else {
          this.startLocal("\u591A\u4EBA\u8FDE\u63A5\u5931\u8D25\uFF0C\u5DF2\u5207\u6362\u672C\u5730\u6A21\u5F0F\u3002");
        }
      }
    }
    restart() {
      if (this.online) this.sendAction("restart");
      else this.startLocal();
    }
    ready() {
      if (this.online) this.sendAction("ready");
    }
    leave() {
      if (this.online) this.sendAction("leave");
    }
    discard(index) {
      if (this.online) this.sendAction("discard", { index });
      else if (this.localServer) this.localServer.playerDiscard(index);
    }
    pass() {
      if (this.online) this.sendAction("pass");
      else if (this.localServer) this.localServer.playerPass();
    }
    peng() {
      if (this.online) this.sendAction("peng");
      else if (this.localServer) this.localServer.playerPeng();
    }
    gang(tile = null) {
      if (this.online) this.sendAction("gang", tile ? { tile } : {});
      else if (this.localServer) this.localServer.playerGang(tile);
    }
    hu() {
      if (this.online) this.sendAction("hu");
      else if (this.localServer) this.localServer.playerHu();
    }
    async sendAction(action, payload = {}) {
      if (!this.roomId) return;
      if (this.socketOpen && this.socket) {
        console.info("[wx-mahjong] websocket action", { action, roomId: this.roomId, clientId: this.clientId });
        this.socket.send(JSON.stringify(Object.assign({ type: "action", action }, payload)));
        return;
      }
      console.warn("[wx-mahjong] http action fallback", { action, roomId: this.roomId, clientId: this.clientId });
      try {
        const data = await this.request(this.getActionPath(), {
          method: "POST",
          data: Object.assign({ action }, payload)
        });
        if (data && data.left) {
          this.stopPolling();
          this.online = false;
          if (this.view.backToLobby) this.view.backToLobby(data.message || "\u5DF2\u9000\u51FA\u623F\u95F4\u3002");
          return;
        }
        this.renderResponseState(data);
        if (data && data.ok === false && this.view.showError) {
          this.view.showError(data.message || "\u5F53\u524D\u4E0D\u80FD\u6267\u884C\u8BE5\u64CD\u4F5C\u3002");
        }
      } catch (error) {
        console.warn("[wx-mahjong] action failed", action, error);
        this.handleRequestError(error);
      }
    }
    startPolling() {
      this.stopPolling();
      console.warn("[wx-mahjong] http polling start", { roomId: this.roomId, clientId: this.clientId });
      this.pollTimer = setInterval(() => this.pollSnapshot(), POLL_INTERVAL_MS);
    }
    stopPolling() {
      if (!this.pollTimer) return;
      console.info("[wx-mahjong] http polling stop", { roomId: this.roomId, clientId: this.clientId });
      clearInterval(this.pollTimer);
      this.pollTimer = null;
    }
    async pollSnapshot() {
      if (!this.online || this.requestingSnapshot || !this.roomId) return;
      this.requestingSnapshot = true;
      try {
        const data = await this.request(`/mahjong/rooms/${this.roomId}/snapshot`, { method: "GET" });
        this.renderResponseState(data);
      } catch (error) {
        console.warn("[wx-mahjong] snapshot poll failed", error);
        this.handleRequestError(error);
      } finally {
        this.requestingSnapshot = false;
      }
    }
    async request(path, options = {}) {
      const response = await this.view.app.request({
        url: `${getServerBaseUrl2()}${path}`,
        method: options.method || "GET",
        header: {
          authorization: `Bearer ${this.authSession.token}`,
          "content-type": "application/json",
          "x-client-id": this.clientId
        },
        data: Object.assign({ clientId: this.clientId }, options.data || {})
      });
      const data = response && response.data;
      if (!response || response.statusCode < 200 || response.statusCode >= 300 || !data) {
        const error = new Error(data && data.message || "Mahjong request failed.");
        error.statusCode = response && response.statusCode;
        error.code = data && data.code;
        throw error;
      }
      return data;
    }
    connectWebSocket() {
      if (!this.online || !this.roomId || !this.authSession || !this.authSession.token) return;
      this.closeSocket();
      const url = `${getWsBaseUrl()}/mahjong/ws?token=${encodeURIComponent(this.authSession.token)}&roomId=${encodeURIComponent(this.roomId)}&clientId=${encodeURIComponent(this.clientId)}`;
      console.info("[wx-mahjong] websocket connecting", { url: maskSocketUrl(url), roomId: this.roomId, clientId: this.clientId });
      const socket = createSocket(url);
      if (!socket) {
        console.warn("[wx-mahjong] websocket unavailable, keep http polling");
        return;
      }
      this.socket = socket;
      socket.onOpen(() => {
        console.info("[wx-mahjong] websocket open", { roomId: this.roomId, clientId: this.clientId });
        this.socketOpen = true;
        this.stopPolling();
      });
      socket.onMessage((message) => {
        this.handleSocketMessage(message);
      });
      socket.onClose((event) => {
        console.warn("[wx-mahjong] websocket close", { roomId: this.roomId, clientId: this.clientId, event });
        this.socketOpen = false;
        this.socket = null;
        if (this.online) this.startPolling();
      });
      socket.onError((error) => {
        console.warn("[wx-mahjong] websocket error", { roomId: this.roomId, clientId: this.clientId, error });
        this.socketOpen = false;
        this.socket = null;
        if (this.online) this.startPolling();
      });
    }
    handleSocketMessage(rawMessage) {
      let data = null;
      try {
        data = JSON.parse(typeof rawMessage === "string" ? rawMessage : rawMessage.data);
      } catch (error) {
        console.warn("[wx-mahjong] invalid websocket message", rawMessage);
        return;
      }
      if (data.type === "snapshot") {
        this.renderResponseState(data);
        return;
      }
      if (data.type === "action_result") {
        this.renderResponseState(data);
        if (data.ok === false && this.view.showError) {
          this.view.showError(data.message || "\u5F53\u524D\u4E0D\u80FD\u6267\u884C\u8BE5\u64CD\u4F5C\u3002");
        }
        return;
      }
      if (data.type === "left") {
        this.closeSocket();
        this.stopPolling();
        this.online = false;
        if (this.view.backToLobby) this.view.backToLobby(data.message || "\u5DF2\u9000\u51FA\u623F\u95F4\u3002");
        return;
      }
      if (data.type === "error") {
        const error = new Error(data.message || "WebSocket request failed.");
        error.code = data.code;
        error.statusCode = data.code === "account_replaced" ? 409 : data.code === "room_not_found" ? 404 : 400;
        this.handleRequestError(error);
      }
    }
    renderResponseState(data) {
      if (data && data.roomId) this.roomId = data.roomId;
      if (data && data.state) {
        data.state.roomId = this.roomId;
        this.view.renderState(data.state);
      }
    }
    startLocal(message = "") {
      this.stopPolling();
      this.closeSocket();
      this.online = false;
      this.localServer = new MahjongServer((state) => {
        if (message) {
          state.message = message;
          message = "";
        }
        this.view.renderState(state);
      });
    }
    handleRequestError(error) {
      const statusCode = error && error.statusCode;
      if (statusCode === 401) {
        this.stopPolling();
        this.closeSocket();
        this.online = false;
        if (this.view.backToLogin) {
          this.view.backToLogin("\u767B\u5F55\u5DF2\u8FC7\u671F\uFF0C\u8BF7\u91CD\u65B0\u767B\u5F55\u3002");
          return;
        }
      }
      if (statusCode === 409 && error.code === "account_replaced") {
        this.stopPolling();
        this.closeSocket();
        this.online = false;
        if (this.view.backToLobby) {
          this.view.backToLobby(error.message || "\u8D26\u53F7\u5DF2\u5728\u5176\u4ED6\u8BBE\u5907\u8FDB\u5165\u8BE5\u623F\u95F4\u3002");
          return;
        }
      }
      if (statusCode === 404 || statusCode === 410) {
        this.stopPolling();
        this.closeSocket();
        this.online = false;
        if (this.view.backToLobby) {
          this.view.backToLobby(error.message || "\u623F\u95F4\u5DF2\u5931\u6548\uFF0C\u8BF7\u91CD\u65B0\u521B\u5EFA\u6216\u52A0\u5165\u3002");
          return;
        }
      }
      if (this.view.showError) {
        this.view.showError(error.message || "\u64CD\u4F5C\u5931\u8D25\uFF0C\u8BF7\u7A0D\u540E\u91CD\u8BD5\u3002");
        return;
      }
      this.startLocal("\u591A\u4EBA\u8FDE\u63A5\u5F02\u5E38\uFF0C\u5DF2\u5207\u6362\u672C\u5730\u6A21\u5F0F\u3002");
    }
    closeSocket() {
      if (!this.socket) return;
      const socket = this.socket;
      this.socket = null;
      this.socketOpen = false;
      socket.close();
    }
    getJoinPath() {
      if (this.roomId) return `/mahjong/rooms/${this.roomId}/join`;
      return "/mahjong/rooms";
    }
    getActionPath() {
      return `/mahjong/rooms/${this.roomId}/action`;
    }
  };
  function createClientId() {
    return `wx-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
  }
  function getServerBaseUrl2() {
    const value = globalThis.__WX_MAHJONG_SERVER_URL__ || SERVER_BASE_URL;
    return String(value).replace(/\/+$/, "");
  }
  function getWsBaseUrl() {
    const baseUrl = getServerBaseUrl2();
    if (baseUrl.indexOf("https://") === 0) return `wss://${baseUrl.slice("https://".length)}`;
    if (baseUrl.indexOf("http://") === 0) return `ws://${baseUrl.slice("http://".length)}`;
    return baseUrl;
  }
  function maskSocketUrl(url) {
    return String(url).replace(/token=([^&]+)/, "token=***");
  }
  function createSocket(url) {
    if (globalThis.wx && globalThis.wx.connectSocket) {
      const task = globalThis.wx.connectSocket({ url });
      return {
        send(data) {
          task.send({ data });
        },
        close() {
          task.close();
        },
        onOpen(handler) {
          task.onOpen(handler);
        },
        onMessage(handler) {
          task.onMessage((event) => handler(event.data));
        },
        onClose(handler) {
          task.onClose(handler);
        },
        onError(handler) {
          task.onError(handler);
        }
      };
    }
    if (globalThis.WebSocket) {
      const socket = new globalThis.WebSocket(url);
      return {
        send(data) {
          socket.send(data);
        },
        close() {
          socket.close();
        },
        onOpen(handler) {
          socket.addEventListener("open", handler);
        },
        onMessage(handler) {
          socket.addEventListener("message", (event) => handler(event.data));
        },
        onClose(handler) {
          socket.addEventListener("close", handler);
        },
        onError(handler) {
          socket.addEventListener("error", handler);
        }
      };
    }
    return null;
  }
  function createStatusState(message) {
    return {
      phase: "connecting",
      currentPlayer: 0,
      wallCount: 0,
      lastDiscard: null,
      message,
      winner: null,
      bird: null,
      actions: {},
      players: ["\u4F60", "\u4E0B\u5BB6", "\u5BF9\u5BB6", "\u4E0A\u5BB6"].map((name, index) => ({
        index,
        name,
        hand: [],
        drawnTile: null,
        handCount: 0,
        discards: [],
        melds: []
      }))
    };
  }

  // src/view/board-graphic.js
  var PLAYER_POS = ["bottom", "right", "top", "left"];
  var TILE_SPRITE = {
    src: "images/sprite.png",
    x: 30,
    y: 33,
    width: 94,
    height: 122,
    gapX: 18,
    gapY: 25
  };
  var MINI_TILE_W = 24;
  var MINI_TILE_H = 34;
  var DISCARD_STEP_X = 26;
  var DISCARD_STEP_Y = 36;
  var MELD_TILE_W = 20;
  var MELD_TILE_H = 28;
  var MELD_STEP_X = 22;
  var MELD_GAP = 8;
  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }
  function getRemainingSeconds(deadlineAt) {
    return Math.max(0, Math.ceil((deadlineAt - Date.now()) / 1e3));
  }
  function getActionItems(state) {
    const actions = [];
    const enabled = state && state.actions ? state.actions : {};
    if (enabled.ready) actions.push({ key: "ready", label: "\u51C6\u5907" });
    if (enabled.leave) actions.push({ key: "leave", label: "\u9000\u51FA" });
    if (enabled.pass) actions.push({ key: "pass", label: "\u8FC7" });
    if (enabled.peng) actions.push({ key: "peng", label: "\u78B0" });
    if (enabled.gang) actions.push({ key: "gang", label: "\u6760" });
    if (enabled.hu) actions.push({ key: "hu", label: "\u80E1" });
    (enabled.gangTiles || []).forEach((tile) => actions.push({ key: `gang:${tile}`, label: "\u6697\u6760", tile }));
    if (state && state.phase === "round-over") actions.push({ key: "restart", label: "\u91CD\u5F00" });
    return actions;
  }
  function getBoardMetrics(width, height) {
    const safeWidth = width || 375;
    const safeHeight = height || 667;
    const isLandscape = safeWidth > safeHeight;
    const edgePad = isLandscape ? 18 : 8;
    const bottomPad = isLandscape ? 10 : 18;
    const gap = isLandscape ? 4 : safeWidth < 360 ? 2 : 3;
    const maxTileW = isLandscape ? 40 : 42;
    const minTileW = isLandscape ? 26 : 18;
    const drawnGap = isLandscape ? 16 : safeWidth < 360 ? 8 : 10;
    const availableHandW = Math.max(260, safeWidth - edgePad * 2);
    const tileW = Math.floor(clamp((availableHandW - drawnGap - gap * 13) / 14, minTileW, maxTileW));
    const tileH = Math.round(tileW * 1.42);
    const handWidth = tileW * 14 + gap * 13 + drawnGap;
    const handX = Math.max(edgePad, (safeWidth - handWidth) / 2);
    const handY = safeHeight - tileH - bottomPad;
    const sideRail = isLandscape ? clamp(safeWidth * 0.12, 80, 124) : clamp(safeWidth * 0.12, 36, 52);
    const tableLeft = sideRail;
    const tableRight = safeWidth - sideRail;
    const tableTop = isLandscape ? 54 : 112;
    const meldY = handY - (isLandscape ? 38 : 42);
    const tableBottom = Math.max(tableTop + 120, meldY - (isLandscape ? 12 : 18));
    const centerX = safeWidth / 2;
    const centerY = (tableTop + tableBottom) / 2;
    return {
      centerX,
      centerY,
      drawnGap,
      gap,
      handX,
      handY,
      isLandscape,
      meldY,
      tableBottom,
      tableLeft,
      tableRight,
      tableTop,
      tileH,
      tileW
    };
  }
  function drawRoundRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.arcTo(x + width, y, x + width, y + radius, radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius);
    ctx.lineTo(x + radius, y + height);
    ctx.arcTo(x, y + height, x, y + height - radius, radius);
    ctx.lineTo(x, y + radius);
    ctx.arcTo(x, y, x + radius, y, radius);
    ctx.closePath();
  }
  function drawText(ctx, text, x, y, size, color, align = "center", maxWidth = null) {
    ctx.fillStyle = color;
    ctx.font = `${size}px Arial`;
    ctx.textAlign = align;
    ctx.textBaseline = "middle";
    if (maxWidth) ctx.fillText(text, x, y, maxWidth);
    else ctx.fillText(text, x, y);
  }
  function getSpriteCell(tile) {
    if (tile === "BACK") return { row: 3, col: 6 };
    if (tile === "ZH") return { row: 3, col: 4 };
    const suit = tile[0];
    const rank = parseInt(tile.slice(1), 10);
    const rowMap = { W: 0, B: 1, T: 2 };
    return { row: rowMap[suit], col: rank - 1 };
  }
  function drawFallbackTile(ctx, tile, x, y, width, height, selected) {
    if (tile === "BACK") {
      drawRoundRect(ctx, x, y, width, height, 4);
      ctx.fillStyle = "#2f7867";
      ctx.fill();
      ctx.strokeStyle = "#1f574b";
      ctx.stroke();
      ctx.fillStyle = "rgba(255,255,255,0.18)";
      ctx.fillRect(x + width * 0.25, y + height * 0.18, width * 0.5, height * 0.64);
      return;
    }
    const info = tileInfo(tile);
    drawRoundRect(ctx, x, y, width, height, 5);
    ctx.fillStyle = selected ? "#fff6d7" : "#f7f2e8";
    ctx.fill();
    ctx.lineWidth = 1;
    ctx.strokeStyle = selected ? "#d39b22" : "#c7bca8";
    ctx.stroke();
    drawText(ctx, info.label, x + width / 2, y + height * 0.38, Math.max(18, width * 0.52), info.color);
    drawText(ctx, info.subLabel, x + width / 2, y + height * 0.72, Math.max(10, width * 0.28), info.color);
  }
  function drawTile(ctx, tile, x, y, width, height, asset, selected = false, highlighted = false) {
    ctx.save();
    if (highlighted) {
      drawRoundRect(ctx, x - 3, y - 3, width + 6, height + 6, 7);
      ctx.fillStyle = "rgba(255,210,0,0.32)";
      ctx.fill();
      ctx.strokeStyle = "#f0a800";
      ctx.lineWidth = 2;
      ctx.stroke();
    }
    if (!asset || asset.status !== "loaded") {
      drawFallbackTile(ctx, tile, x, y, width, height, selected);
    } else {
      const cell = getSpriteCell(tile);
      const sx = TILE_SPRITE.x + cell.col * (TILE_SPRITE.width + TILE_SPRITE.gapX);
      const sy = TILE_SPRITE.y + cell.row * (TILE_SPRITE.height + TILE_SPRITE.gapY);
      ctx.drawImage(asset.image, sx, sy, TILE_SPRITE.width, TILE_SPRITE.height, x, y, width, height);
      if (selected) {
        drawRoundRect(ctx, x, y, width, height, 5);
        ctx.strokeStyle = "#d39b22";
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    }
    ctx.restore();
  }
  function drawMiniTile(ctx, tile, x, y, asset, highlighted = false) {
    drawTile(ctx, tile, x, y, MINI_TILE_W, MINI_TILE_H, asset, false, highlighted);
  }
  function drawMeldTile(ctx, tile, x, y, asset) {
    drawTile(ctx, tile, x, y, MELD_TILE_W, MELD_TILE_H, asset);
  }
  function getMeldWidth(meld) {
    return Math.max(0, (meld.tiles.length - 1) * MELD_STEP_X + MELD_TILE_W);
  }
  function getMeldRows(melds, maxWidth) {
    const rows = [];
    let row = [];
    let rowWidth = 0;
    melds.forEach((meld) => {
      const meldWidth = getMeldWidth(meld);
      const nextWidth = row.length ? rowWidth + MELD_GAP + meldWidth : meldWidth;
      if (row.length && nextWidth > maxWidth) {
        rows.push({ melds: row, width: rowWidth });
        row = [];
        rowWidth = 0;
      }
      row.push(meld);
      rowWidth = rowWidth ? rowWidth + MELD_GAP + meldWidth : meldWidth;
    });
    if (row.length) rows.push({ melds: row, width: rowWidth });
    return rows;
  }
  function drawMeldRows(ctx, melds, x, y, maxWidth, asset, align = "left") {
    const rows = getMeldRows(melds, maxWidth);
    rows.forEach((row, rowIndex) => {
      let tx = align === "right" ? x + maxWidth - row.width : x;
      const ty = y + rowIndex * (MELD_TILE_H + 4);
      row.melds.forEach((meld) => {
        meld.tiles.forEach((tile, tileIndex) => {
          drawMeldTile(ctx, tile, tx + tileIndex * MELD_STEP_X, ty, asset);
        });
        tx += getMeldWidth(meld) + MELD_GAP;
      });
    });
  }
  function rowsInRange(top, bottom) {
    return Math.max(1, Math.floor((bottom - top - MINI_TILE_H) / DISCARD_STEP_Y) + 1);
  }
  function getSideMeldMaxWidth(width, metrics) {
    return metrics.isLandscape ? 190 : Math.max(82, Math.min(128, width * 0.34));
  }
  function getDiscardLayout(index, width, metrics, melds = []) {
    const topMeldRows = getMeldRows(melds, width - 24).length;
    const sideMeldRows = getMeldRows(melds, getSideMeldMaxWidth(width, metrics)).length;
    const topStartY = Math.max(
      metrics.tableTop + (metrics.isLandscape ? 64 : 86),
      metrics.tableTop + 6 + topMeldRows * (MELD_TILE_H + 4) + 8
    );
    const topEndY = metrics.centerY - 8;
    const bottomStartY = metrics.centerY + 8;
    const bottomEndY = metrics.tableBottom;
    const verticalStartY = Math.max(
      topStartY,
      metrics.tableTop + 40 + sideMeldRows * (MELD_TILE_H + 4) + 8
    );
    const verticalEndY = metrics.tableBottom;
    if (index === 0 || index === 2) {
      const cols2 = metrics.isLandscape ? 8 : 5;
      const y = index === 2 ? topStartY : bottomStartY;
      const rows2 = rowsInRange(y, index === 2 ? topEndY : bottomEndY);
      return {
        cols: cols2,
        capacity: cols2 * rows2,
        x: metrics.centerX - (cols2 * DISCARD_STEP_X - 2) / 2,
        y
      };
    }
    const cols = metrics.isLandscape ? 5 : 2;
    const rows = Math.min(metrics.isLandscape ? 4 : 8, rowsInRange(verticalStartY, verticalEndY));
    const gridW = cols * DISCARD_STEP_X - 2;
    const gridH = rows * DISCARD_STEP_Y - 2;
    return {
      cols,
      capacity: cols * rows,
      x: index === 1 ? width - metrics.tableLeft - gridW : metrics.tableLeft,
      y: clamp(metrics.centerY - gridH / 2, verticalStartY, verticalEndY - MINI_TILE_H)
    };
  }
  function getHandHitRects(state, width, height) {
    const { drawnGap, gap, tileW, tileH, handX, handY } = getBoardMetrics(width, height);
    const player = state && state.players && state.players[0] ? state.players[0] : null;
    const hand = player ? player.hand : [];
    const drawnIndex = player && player.drawnTile ? hand.length - 1 : -1;
    return hand.map((tile, index) => ({
      index,
      x: handX + index * (tileW + gap) + (index === drawnIndex ? drawnGap : 0),
      y: handY,
      width: tileW,
      height: tileH
    }));
  }
  function getActionLayout(state, width, height) {
    const { handY, isLandscape, meldY, tableTop } = getBoardMetrics(width, height);
    const actions = getActionItems(state);
    if (!actions.length) return [];
    const safeWidth = width || 375;
    const gap = isLandscape ? 8 : safeWidth < 360 ? 5 : 7;
    const maxButtonW = isLandscape ? 64 : 70;
    const buttonH = isLandscape ? 34 : 36;
    const availableW = Math.max(180, safeWidth - 24);
    const buttonW = Math.floor(
      clamp((availableW - Math.max(0, actions.length - 1) * gap) / actions.length, 40, maxButtonW)
    );
    const totalW = actions.length * buttonW + Math.max(0, actions.length - 1) * gap;
    const startX = Math.max(12, (safeWidth - totalW) / 2);
    const preferredY = Math.min(handY - buttonH - 10, meldY - buttonH - 8);
    const y = Math.max(tableTop + 8, preferredY);
    return actions.map(
      (action, index) => Object.assign(action, {
        x: startX + index * (buttonW + gap),
        y,
        width: buttonW,
        height: buttonH
      })
    );
  }
  var BoardGraphic = class extends Graphic {
    constructor(assetManager) {
      super();
      this.assets = assetManager;
      this.state = null;
      this.spriteAsset = null;
    }
    setState(state) {
      this.state = state;
      this.invalidatePaint();
    }
    draw(ctx) {
      const x = 0;
      const y = 0;
      const width = this.width;
      const height = this.height;
      const state = this.state;
      const metrics = getBoardMetrics(width, height);
      const spriteAsset = this.getSpriteAsset();
      ctx.fillStyle = "#173b32";
      ctx.fillRect(x, y, width, height);
      ctx.fillStyle = "#205447";
      ctx.fillRect(
        x + metrics.tableLeft,
        y + metrics.tableTop,
        metrics.tableRight - metrics.tableLeft,
        metrics.tableBottom - metrics.tableTop
      );
      ctx.fillStyle = "rgba(0,0,0,0.16)";
      ctx.fillRect(x, y + metrics.handY - 8, width, height - metrics.handY + 8);
      if (!state) return;
      this.drawHeader(ctx, state, x, y, width, metrics, spriteAsset);
      this.drawMelds(ctx, state, x, y, width, height, metrics, spriteAsset);
      this.drawPlayers(ctx, state, x, y, width, height, metrics);
      this.drawDiscards(ctx, state, x, y, width, height, metrics, spriteAsset);
      this.drawStatus(ctx, state, x, y, width, metrics, spriteAsset);
      this.drawHand(ctx, state, width, height, spriteAsset);
    }
    getSpriteAsset() {
      if (!this.spriteAsset && this.assets) {
        this.spriteAsset = this.assets.image(TILE_SPRITE.src);
        this.spriteAsset.promise.then(() => this.invalidatePaint()).catch(() => this.invalidatePaint());
      }
      return this.spriteAsset;
    }
    drawHeader(ctx, state, x, y, width, metrics, spriteAsset) {
      const titleY = metrics.isLandscape ? 20 : 22;
      drawText(ctx, "\u7EA2\u4E2D\u9EBB\u5C06", x + 18, y + titleY, 18, "#f9f2dc", "left");
      if (state.roomId) {
        drawText(ctx, `\u623F\u95F4 ${state.roomId}`, x + width / 2, y + titleY, 13, "#dce8de");
      }
      drawText(ctx, `\u724C\u5899 ${state.wallCount}`, x + width - 18, y + titleY, 14, "#dce8de", "right");
      if (state.bird) {
        const birdY = metrics.isLandscape ? 34 : 58;
        drawText(ctx, "\u9E1F", x + width - 54, y + birdY + 16, 12, "#f9f2dc");
        drawMiniTile(ctx, state.bird, x + width - 42, y + birdY, spriteAsset);
      }
    }
    drawStatus(ctx, state, x, y, width, metrics, spriteAsset) {
      const actions = getActionLayout(state, width, this.height);
      const panelW = metrics.isLandscape ? 210 : Math.min(190, width - 24);
      const panelX = x + width - panelW - 12;
      const preferredY = actions.length ? actions[0].y - 62 : metrics.handY - 82;
      const panelY = y + clamp(preferredY, metrics.tableTop + 8, metrics.handY - 58);
      const textX = panelX + panelW;
      if (state.lastDiscard) {
        const name = state.players[state.lastDiscard.from].name;
        drawText(ctx, `\u5F53\u524D\u5F03\u724C\uFF1A${name}`, textX - MINI_TILE_W - 8, panelY + 18, 12, "#dce8de", "right", panelW - 40);
        drawMiniTile(ctx, state.lastDiscard.tile, textX - MINI_TILE_W, panelY, spriteAsset, true);
      } else {
        drawText(ctx, "\u5F53\u524D\u5F03\u724C\uFF1A\u65E0", textX, panelY + 16, 12, "#dce8de", "right", panelW);
      }
      drawText(ctx, state.message, textX, panelY + 50, 13, "#fff4c5", "right", panelW);
    }
    drawPlayers(ctx, state, x, y, width, height, metrics) {
      state.players.forEach((player, index) => {
        const pos = PLAYER_POS[index];
        const active = state.currentPlayer === index && state.phase !== "round-over";
        const color = active ? "#ffd86b" : "#dce8de";
        const countdownText = active && state.turnDeadlineAt ? ` ${getRemainingSeconds(state.turnDeadlineAt)}s` : "";
        const readyText = state.roomStatus === "waiting" || state.roomStatus === "settling" ? ` ${player.isReady ? "\u5DF2\u51C6\u5907" : "\u672A\u51C6\u5907"}` : "";
        const label = `${player.name}${readyText}${countdownText}`;
        if (pos === "bottom") {
          drawText(
            ctx,
            label,
            x + Math.max(18, metrics.handX - 18),
            y + metrics.handY + metrics.tileH / 2,
            13,
            color
          );
        } else if (pos === "top") {
          drawText(ctx, `${label} ${player.handCount}\u5F20`, x + width / 2, y + metrics.tableTop - 16, 13, color);
        } else if (pos === "left") {
          const nameX = metrics.isLandscape ? metrics.tableLeft - 50 : 20;
          drawText(ctx, `${label} ${player.handCount}\u5F20`, x + nameX, y + metrics.centerY - 76, 13, color);
        } else if (pos === "right") {
          const nameX = metrics.isLandscape ? metrics.tableRight + 50 : width - 20;
          drawText(ctx, `${label} ${player.handCount}\u5F20`, x + nameX, y + metrics.centerY - 76, 13, color);
        }
      });
    }
    drawDiscards(ctx, state, x, y, width, height, metrics, spriteAsset) {
      state.players.forEach((player, index) => {
        const layout = getDiscardLayout(index, width, metrics, player.melds);
        const tiles = player.discards.slice(-layout.capacity);
        const isLastFrom = state.lastDiscard && state.lastDiscard.from === index;
        const lastTileIdx = tiles.length - 1;
        tiles.forEach((tile, tileIndex) => {
          const tx = x + layout.x + tileIndex % layout.cols * DISCARD_STEP_X;
          const ty = y + layout.y + Math.floor(tileIndex / layout.cols) * DISCARD_STEP_Y;
          drawMiniTile(ctx, tile, tx, ty, spriteAsset, isLastFrom && tileIndex === lastTileIdx);
        });
      });
    }
    drawMelds(ctx, state, x, y, width, height, metrics, spriteAsset) {
      const topMaxWidth = width - 24;
      const sideMaxWidth = getSideMeldMaxWidth(width, metrics);
      drawMeldRows(ctx, state.players[2].melds, x + 12, y + metrics.tableTop + 6, topMaxWidth, spriteAsset);
      drawMeldRows(ctx, state.players[3].melds, x + 12, y + metrics.tableTop + 40, sideMaxWidth, spriteAsset);
      drawMeldRows(ctx, state.players[1].melds, x + width - 12 - sideMaxWidth, y + metrics.tableTop + 40, sideMaxWidth, spriteAsset, "right");
      let mx = metrics.isLandscape ? 18 : 12;
      const actionLayout = getActionLayout(state, width, height);
      const my = actionLayout.length ? Math.max(metrics.tableTop + 8, actionLayout[0].y - 42) : metrics.meldY;
      state.players[0].melds.forEach((meld) => {
        meld.tiles.forEach((tile) => {
          drawMiniTile(ctx, tile, mx, my, spriteAsset);
          mx += 26;
        });
        mx += 8;
      });
    }
    drawHand(ctx, state, width, height, spriteAsset) {
      const rects = getHandHitRects(state, width, height);
      const canDiscard = state.actions.discard;
      rects.forEach((rect) => {
        const tile = state.players[0].hand[rect.index];
        drawTile(ctx, tile, rect.x, rect.y, rect.width, rect.height, spriteAsset, canDiscard && tile !== "ZH");
      });
    }
  };

  // src/main-view.js
  var MainView = class extends Container {
    constructor(app2, authSession = null, roomOptions = {}) {
      super();
      this.app = app2;
      this.state = null;
      this.authSession = authSession;
      this.controls = [];
      this.controlSizeKey = "";
      this.setLayout(anchor({ anchor: "top-left", width: "100%", height: "100%" }));
      this.board = this.addChild(new BoardGraphic(app2.assets));
      this.board.setLayout(anchor({ anchor: "top-left", width: "100%", height: "100%" }));
      this.controller = new MainController(this, authSession, roomOptions);
    }
    renderState(state) {
      this.state = state;
      this.board.setState(state);
      this.rebuildControls();
    }
    update() {
      if (!this.state) return;
      const sizeKey = `${this.width}x${this.height}`;
      if (this.width && this.height && this.controlSizeKey !== sizeKey) {
        this.rebuildControls();
      }
      if (this.state.turnDeadlineAt) {
        this.board.invalidatePaint();
      }
    }
    rebuildControls() {
      if (!this.state) return;
      this.controls.forEach((control) => control.remove());
      this.controls = [];
      const width = this.width || 375;
      const height = this.height || 667;
      this.controlSizeKey = `${width}x${height}`;
      getHandHitRects(this.state, width, height).forEach((rect) => {
        const hit = this.addChild(new Container());
        hit.touchEnabled = true;
        hit.setLayout(
          anchor({
            anchor: "top-left",
            x: rect.x,
            y: rect.y,
            width: rect.width,
            height: rect.height
          })
        );
        hit.on("tap", () => {
          this.controller.discard(rect.index);
        });
        this.controls.push(hit);
      });
      getActionLayout(this.state, width, height).forEach((action) => {
        const button = this.addChild(
          new Button(action.label, {
            background: { fillStyle: "#2f7df6", radius: 6 },
            label: { fillStyle: "#fff", fontSize: 15 }
          })
        );
        button.setLayout(
          anchor({
            anchor: "top-left",
            x: action.x,
            y: action.y,
            width: action.width,
            height: action.height
          })
        );
        button.on("tap", () => this.handleAction(action));
        this.controls.push(button);
      });
      this.invalidatePaint();
    }
    handleAction(action) {
      if (action.key === "ready") this.controller.ready();
      else if (action.key === "leave") this.controller.leave();
      else if (action.key === "pass") this.controller.pass();
      else if (action.key === "peng") this.controller.peng();
      else if (action.key === "gang") this.controller.gang();
      else if (action.key === "hu") this.controller.hu();
      else if (action.key === "restart") this.controller.restart();
      else if (action.key.indexOf("gang:") === 0) this.controller.gang(action.tile);
    }
    backToLobby(message = "") {
      this.app.setRoot(new LobbyView(this.app, this.authSession, { message }));
    }
    backToLogin(message = "") {
      const loginView2 = new LoginView(this.app, {
        message,
        onLogin: (authSession) => {
          this.app.setRoot(new LobbyView(this.app, authSession));
        }
      });
      this.app.setRoot(loginView2);
      loginView2.startLogin(true);
    }
    showError(message) {
      if (!this.state) return;
      this.state = Object.assign({}, this.state, { message });
      this.board.setState(this.state);
      this.rebuildControls();
    }
  };

  // src/lobby-view.js
  var LobbyView = class _LobbyView extends Container {
    constructor(app2, authSession, options = {}) {
      super();
      this.app = app2;
      this.authSession = authSession;
      this.status = options.message || "\u8BF7\u9009\u62E9\u623F\u95F4\u64CD\u4F5C";
      this.setLayout(anchor({ anchor: "top-left", width: "100%", height: "100%" }));
      this.background = this.addChild(new Shape({ fillStyle: "#173b32" }));
      this.background.setLayout(anchor({ anchor: "top-left", width: "100%", height: "100%" }));
      this.title = this.addChild(
        new Text("\u7EA2\u4E2D\u9EBB\u5C06", {
          fillStyle: "#f9f2dc",
          fontSize: 28,
          textAlign: "center"
        })
      );
      this.title.setLayout(anchor({ anchor: "top", y: 108, width: 240, height: 44 }));
      this.statusText = this.addChild(
        new Text(this.status, {
          fillStyle: "#dce8de",
          fontSize: 14,
          lineHeight: 22,
          maxLines: 3,
          textAlign: "center"
        })
      );
      this.statusText.setLayout(anchor({ anchor: "top", y: 168, width: 280, height: 70 }));
      this.createButton = this.addChild(
        new Button("\u521B\u5EFA\u623F\u95F4", {
          background: { fillStyle: "#2f7df6", radius: 6 },
          label: { fillStyle: "#fff", fontSize: 16 }
        })
      );
      this.createButton.setLayout(anchor({ anchor: "top", y: 260, width: 170, height: 44 }));
      this.createButton.on("tap", () => this.handleCreate());
      this.joinButton = this.addChild(
        new Button("\u52A0\u5165\u623F\u95F4", {
          background: { fillStyle: "#f2a33a", radius: 6 },
          label: { fillStyle: "#173b32", fontSize: 16 }
        })
      );
      this.joinButton.setLayout(anchor({ anchor: "top", y: 320, width: 170, height: 44 }));
      this.joinButton.on("tap", () => this.handleJoin());
      this.reloginButton = this.addChild(
        new Button("\u91CD\u65B0\u767B\u5F55", {
          background: { fillStyle: "#385f55", radius: 6 },
          label: { fillStyle: "#f9f2dc", fontSize: 15 }
        })
      );
      this.reloginButton.setLayout(anchor({ anchor: "top", y: 382, width: 170, height: 40 }));
      this.reloginButton.on("tap", () => this.handleRelogin());
    }
    async handleJoin() {
      const { roomId, password } = await requestJoinInfo();
      if (!roomId) return;
      if (!/^\d{6}$/.test(roomId)) {
        this.setStatus("\u8BF7\u8F93\u5165 6 \u4F4D\u623F\u95F4\u53F7");
        return;
      }
      this.enterRoom({ roomId, password });
    }
    async handleCreate() {
      const config = await requestRoomConfig();
      if (!config) return;
      this.enterRoom(Object.assign({ createRoom: true }, config));
    }
    enterRoom(options) {
      this.app.setRoot(new MainView(this.app, this.authSession, options));
    }
    handleRelogin() {
      clearCachedAuthSession(this.app);
      const loginView2 = new LoginView(this.app, {
        message: "\u5DF2\u6E05\u9664\u767B\u5F55\u7F13\u5B58\uFF0C\u8BF7\u91CD\u65B0\u767B\u5F55",
        onLogin: (authSession) => {
          this.app.setRoot(new _LobbyView(this.app, authSession));
        }
      });
      this.app.setRoot(loginView2);
      loginView2.startLogin(true);
    }
    setStatus(text) {
      this.status = text;
      this.statusText.text = text;
      this.invalidatePaint();
    }
  };
  function requestJoinInfo() {
    if (globalThis.wx && globalThis.wx.showModal) {
      return new Promise((resolve) => {
        globalThis.wx.showModal({
          title: "\u52A0\u5165\u623F\u95F4",
          placeholderText: "\u623F\u95F4\u53F7,\u5BC6\u7801\u53EF\u9009",
          editable: true,
          success(result) {
            resolve(result && result.confirm ? parseJoinInfo(result.content) : { roomId: "", password: "" });
          },
          fail() {
            resolve({ roomId: "", password: "" });
          }
        });
      });
    }
    if (globalThis.prompt) {
      return Promise.resolve(parseJoinInfo(globalThis.prompt("\u623F\u95F4\u53F7,\u5BC6\u7801\u53EF\u9009") || ""));
    }
    return Promise.resolve({ roomId: "", password: "" });
  }
  function requestRoomConfig() {
    if (globalThis.wx && globalThis.wx.showModal) {
      return new Promise((resolve) => {
        globalThis.wx.showModal({
          title: "\u521B\u5EFA\u623F\u95F4",
          placeholderText: "\u8D85\u65F6\u79D2\u6570,\u5BC6\u7801\u53EF\u9009\uFF0C\u5982 30,1234",
          editable: true,
          success(result) {
            resolve(result && result.confirm ? parseRoomConfig(result.content) : null);
          },
          fail() {
            resolve(null);
          }
        });
      });
    }
    if (globalThis.prompt) {
      return Promise.resolve(parseRoomConfig(globalThis.prompt("\u8D85\u65F6\u79D2\u6570,\u5BC6\u7801\u53EF\u9009\uFF0C\u5982 30,1234") || ""));
    }
    return Promise.resolve({ timeoutSeconds: 30, password: "" });
  }
  function parseJoinInfo(value) {
    const parts = String(value || "").split(",").map((item) => item.trim());
    return {
      roomId: parts[0] || "",
      password: parts[1] || ""
    };
  }
  function parseRoomConfig(value) {
    const parts = String(value || "").split(",").map((item) => item.trim());
    const timeoutSeconds = Number(parts[0] || 30);
    return {
      timeoutSeconds: Number.isFinite(timeoutSeconds) ? timeoutSeconds : 30,
      password: parts[1] || ""
    };
  }

  // src/index.js
  var app = createWeChatApp({ fps: 60 });
  var loginView = new LoginView(app, {
    onLogin(authSession) {
      app.setRoot(new LobbyView(app, authSession));
    }
  });
  app.start(loginView);
  loginView.startLogin();
})();
