import { Button, Container, Text, anchor } from '@repo/mc2d';
import { getCachedAuthSession, loginWechatMiniGame } from './auth/wechat-login.js';
import MainController from './main-controller.js';
import BoardGraphic, { getActionLayout, getHandHitRects } from './view/board-graphic.js';

export default class MainView extends Container {
  constructor(app) {
    super();

    this.app = app;
    this.state = null;
    this.authStatus = 'idle';
    this.authSession = getCachedAuthSession(app);
    this.controls = [];
    this.controlSizeKey = '';
    this.setLayout(anchor({ anchor: 'top-left', width: '100%', height: '100%' }));
    this.board = this.addChild(new BoardGraphic(app.assets));
    this.board.setLayout(anchor({ anchor: 'top-left', width: '100%', height: '100%' }));
    this.authText = this.addChild(
      new Text('', {
        fillStyle: '#fff',
        fontSize: 13,
        textAlign: 'left',
        strokeStyle: 'rgba(0,0,0,0.6)',
        lineWidth: 3,
      }),
    );
    this.authText.touchEnabled = true;
    this.authText.setLayout(anchor({ anchor: 'top-left', x: 12, y: 8, width: 220, height: 24 }));
    this.authText.on('tap', () => {
      if (this.authStatus === 'failed') this.startLogin();
    });
    this.controller = new MainController(this);
    if (this.authSession) {
      this.controller.setAuthSession(this.authSession);
      this.setAuthStatus('ready');
    } else {
      this.setAuthStatus('idle');
    }
  }

  async startLogin() {
    this.setAuthStatus('loading');
    try {
      const authSession = await loginWechatMiniGame(this.app);
      this.authSession = authSession;
      this.controller.setAuthSession(authSession);
      this.setAuthStatus('ready');
    } catch (error) {
      this.setAuthStatus('failed', error);
    }
  }

  setAuthStatus(status, error = null) {
    this.authStatus = status;

    if (status === 'loading') this.authText.text = '微信登录中...';
    else if (status === 'ready') this.authText.text = `已登录 ${this.getDisplayName()}`;
    else if (status === 'failed') this.authText.text = '登录失败，点击重试';
    else this.authText.text = '未登录';

    if (error) console.warn('[wx-mahjong] wechat login failed', error);
    this.invalidatePaint();
  }

  getDisplayName() {
    const user = this.authSession && this.authSession.user;
    return (user && user.displayName) || 'player';
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
