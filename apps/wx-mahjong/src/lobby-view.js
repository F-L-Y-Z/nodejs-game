import { Button, Container, Shape, Text, anchor } from '@repo/mc2d';
import MainView from './main-view.js';

export default class LobbyView extends Container {
  constructor(app, authSession) {
    super();

    this.app = app;
    this.authSession = authSession;
    this.status = '请选择房间操作';
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
    this.createButton.on('tap', () => this.enterRoom({ createRoom: true }));

    this.joinButton = this.addChild(
      new Button('加入房间', {
        background: { fillStyle: '#f2a33a', radius: 6 },
        label: { fillStyle: '#173b32', fontSize: 16 },
      }),
    );
    this.joinButton.setLayout(anchor({ anchor: 'top', y: 320, width: 170, height: 44 }));
    this.joinButton.on('tap', () => this.handleJoin());
  }

  async handleJoin() {
    const roomId = await requestRoomId();
    if (!roomId) return;
    if (!/^\d{6}$/.test(roomId)) {
      this.setStatus('请输入 6 位房间号');
      return;
    }
    this.enterRoom({ roomId });
  }

  enterRoom(options) {
    this.app.setRoot(new MainView(this.app, this.authSession, options));
  }

  setStatus(text) {
    this.status = text;
    this.statusText.text = text;
    this.invalidatePaint();
  }
}

function requestRoomId() {
  if (globalThis.wx && globalThis.wx.showModal) {
    return new Promise((resolve) => {
      globalThis.wx.showModal({
        title: '加入房间',
        placeholderText: '请输入 6 位房间号',
        editable: true,
        success(result) {
          resolve(result && result.confirm ? String(result.content || '').trim() : '');
        },
        fail() {
          resolve('');
        },
      });
    });
  }

  if (globalThis.prompt) {
    return Promise.resolve(String(globalThis.prompt('请输入 6 位房间号') || '').trim());
  }

  return Promise.resolve('');
}
