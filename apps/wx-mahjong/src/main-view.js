import { Button, Container, anchor } from '@repo/mc2d';
import MainController from './main-controller.js';
import BoardGraphic, { getActionLayout, getHandHitRects } from './view/board-graphic.js';

export default class MainView extends Container {
  constructor(app, authSession = null) {
    super();

    this.app = app;
    this.state = null;
    this.authSession = authSession;
    this.controls = [];
    this.controlSizeKey = '';
    this.setLayout(anchor({ anchor: 'top-left', width: '100%', height: '100%' }));
    this.board = this.addChild(new BoardGraphic(app.assets));
    this.board.setLayout(anchor({ anchor: 'top-left', width: '100%', height: '100%' }));
    this.controller = new MainController(this);
    if (authSession) this.controller.setAuthSession(authSession);
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
          anchor: 'top-left',
          x: rect.x,
          y: rect.y,
          width: rect.width,
          height: rect.height,
        }),
      );
      hit.on('tap', () => {
        this.controller.discard(rect.index);
      });
      this.controls.push(hit);
    });

    getActionLayout(this.state, width, height).forEach((action) => {
      const button = this.addChild(
        new Button(action.label, {
          background: { fillStyle: '#2f7df6', radius: 6 },
          label: { fillStyle: '#fff', fontSize: 15 },
        }),
      );
      button.setLayout(
        anchor({
          anchor: 'top-left',
          x: action.x,
          y: action.y,
          width: action.width,
          height: action.height,
        }),
      );
      button.on('tap', () => this.handleAction(action));
      this.controls.push(button);
    });

    this.invalidatePaint();
  }

  handleAction(action) {
    if (action.key === 'pass') this.controller.pass();
    else if (action.key === 'peng') this.controller.peng();
    else if (action.key === 'gang') this.controller.gang();
    else if (action.key === 'hu') this.controller.hu();
    else if (action.key === 'restart') this.controller.restart();
    else if (action.key.indexOf('gang:') === 0) this.controller.gang(action.tile);
  }
}
