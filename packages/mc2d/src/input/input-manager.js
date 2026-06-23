import PointerEvent from './pointer-event';

const TAP_DISTANCE = 10;
const TAP_DURATION = 350;

function getTouch(event) {
  const list = event.changedTouches && event.changedTouches.length ? event.changedTouches : event.touches;
  return list && list[0];
}

export default class InputManager {
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
      cancel: this.handleCancel,
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
      y: touch.clientY,
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
    const event = new PointerEvent(
      type,
      Object.assign({}, extra, {
        pointerId: point.pointerId,
        x: point.x,
        y: point.y,
        target,
        originalEvent,
      }),
    );
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
      time: Date.now(),
    };
    this.touchPoint = { x: point.x, y: point.y };
    this.touchMoveVector.x = this.touchMoveVector.y = 0;
    this.touchMoveVector.fixedX = this.touchMoveVector.fixedY = 0;
    this.emit('pointerdown', target, point, event, {
      startX: point.x,
      startY: point.y,
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
    this.emit('pointermove', active.target, point, event, {
      startX: active.startX,
      startY: active.startY,
      deltaX,
      deltaY,
    });
  }

  handleEnd(event) {
    const point = this.toPoint(event);
    const active = this.active;
    if (!point || !active) return;
    this.emit('pointerup', active.target, point, event, {
      startX: active.startX,
      startY: active.startY,
      deltaX: point.x - active.lastX,
      deltaY: point.y - active.lastY,
    });

    const dx = point.x - active.startX;
    const dy = point.y - active.startY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance <= TAP_DISTANCE && Date.now() - active.time <= TAP_DURATION) {
      const endTarget = this.stage.hitTest(point.x, point.y);
      if (endTarget === active.target) {
        this.emit('tap', active.target, point, event, {
          startX: active.startX,
          startY: active.startY,
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
      this.emit('pointercancel', active.target, point, event, {
        startX: active.startX,
        startY: active.startY,
      });
    }
    this.active = null;
    this.touchPoint = null;
    this.touchMoveVector.x = this.touchMoveVector.y = 0;
    this.touchMoveVector.fixedX = this.touchMoveVector.fixedY = 0;
  }
}
