import { Button, Container, Shape, Text, anchor } from '@repo/mc2d';
import { clearCachedAuthSession } from './auth/wechat-login.js';
import LoginView from './login-view.js';
import MainView from './main-view.js';

export default class LobbyView extends Container {
  constructor(app, authSession, options = {}) {
    super();

    this.app = app;
    this.authSession = authSession;
    this.status = options.message || '请选择房间操作';
    this.setLayout(anchor({ anchor: 'top-left', width: '100%', height: '100%' }));

    this.background = this.addChild(new Shape({ fillStyle: '#173b32' }));
    this.background.setLayout(anchor({ anchor: 'top-left', width: '100%', height: '100%' }));

    this.title = this.addChild(
      new Text('红中麻将', {
        fillStyle: '#f9f2dc',
        fontSize: 28,
        textAlign: 'center',
      }),
    );
    this.title.setLayout(anchor({ anchor: 'top', y: 108, width: 240, height: 44 }));

    this.statusText = this.addChild(
      new Text(this.status, {
        fillStyle: '#dce8de',
        fontSize: 14,
        lineHeight: 22,
        maxLines: 3,
        textAlign: 'center',
      }),
    );
    this.statusText.setLayout(anchor({ anchor: 'top', y: 168, width: 280, height: 70 }));

    this.createButton = this.addChild(
      new Button('创建房间', {
        background: { fillStyle: '#2f7df6', radius: 6 },
        label: { fillStyle: '#fff', fontSize: 16 },
      }),
    );
    this.createButton.setLayout(anchor({ anchor: 'top', y: 260, width: 170, height: 44 }));
    this.createButton.on('tap', () => this.handleCreate());

    this.joinButton = this.addChild(
      new Button('加入房间', {
        background: { fillStyle: '#f2a33a', radius: 6 },
        label: { fillStyle: '#173b32', fontSize: 16 },
      }),
    );
    this.joinButton.setLayout(anchor({ anchor: 'top', y: 320, width: 170, height: 44 }));
    this.joinButton.on('tap', () => this.handleJoin());

    this.reloginButton = this.addChild(
      new Button('重新登录', {
        background: { fillStyle: '#385f55', radius: 6 },
        label: { fillStyle: '#f9f2dc', fontSize: 15 },
      }),
    );
    this.reloginButton.setLayout(anchor({ anchor: 'top', y: 382, width: 170, height: 40 }));
    this.reloginButton.on('tap', () => this.handleRelogin());
  }

  async handleJoin() {
    const { roomId, password } = await requestJoinInfo();
    if (!roomId) return;
    if (!/^[a-zA-Z0-9_-]{6,64}$/.test(roomId)) {
      this.setStatus('请输入有效房间 ID');
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
    const loginView = new LoginView(this.app, {
      message: '已清除登录缓存，请重新登录',
      onLogin: (authSession) => {
        this.app.setRoot(new LobbyView(this.app, authSession));
      },
    });
    this.app.setRoot(loginView);
    loginView.startLogin(true);
  }

  setStatus(text) {
    this.status = text;
    this.statusText.text = text;
    this.invalidatePaint();
  }
}

function requestJoinInfo() {
  if (globalThis.wx && globalThis.wx.showModal) {
    return new Promise((resolve) => {
      globalThis.wx.showModal({
        title: '加入房间',
        placeholderText: '房间号,密码可选',
        editable: true,
        success(result) {
          resolve(result && result.confirm ? parseJoinInfo(result.content) : { roomId: '', password: '' });
        },
        fail() {
          resolve({ roomId: '', password: '' });
        },
      });
    });
  }

  if (globalThis.prompt) {
    return Promise.resolve(parseJoinInfo(globalThis.prompt('房间号,密码可选') || ''));
  }

  return Promise.resolve({ roomId: '', password: '' });
}

function requestRoomConfig() {
  if (globalThis.wx && globalThis.wx.showModal) {
    return new Promise((resolve) => {
      globalThis.wx.showModal({
        title: '创建房间',
        placeholderText: '超时秒数,密码可选，如 30,1234',
        editable: true,
        success(result) {
          resolve(result && result.confirm ? parseRoomConfig(result.content) : null);
        },
        fail() {
          resolve(null);
        },
      });
    });
  }

  if (globalThis.prompt) {
    return Promise.resolve(parseRoomConfig(globalThis.prompt('超时秒数,密码可选，如 30,1234') || ''));
  }

  return Promise.resolve({ timeoutSeconds: 30, password: '' });
}

function parseJoinInfo(value) {
  const parts = String(value || '').split(',').map((item) => item.trim());
  return {
    roomId: parts[0] || '',
    password: parts[1] || '',
  };
}

function parseRoomConfig(value) {
  const parts = String(value || '').split(',').map((item) => item.trim());
  const timeoutSeconds = Number(parts[0] || 30);
  return {
    timeoutSeconds: Number.isFinite(timeoutSeconds) ? timeoutSeconds : 30,
    password: parts[1] || '',
  };
}
