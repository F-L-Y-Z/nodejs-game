import { Button, Container, Shape, Text, anchor } from '@repo/mc2d';
import { getCachedAuthSession, loginWechatMiniGame } from '../auth/wechat-login.js';

export default class LoginView extends Container {
  constructor(app, options = {}) {
    super();

    this.app = app;
    this.onLogin = options.onLogin || null;
    this.initialMessage = options.message || '准备登录';
    this.status = 'idle';
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
    this.title.setLayout(anchor({ anchor: 'top', y: 100, width: 240, height: 44 }));

    this.statusText = this.addChild(
      new Text(this.initialMessage, {
        fillStyle: '#dce8de',
        fontSize: 14,
        lineHeight: 20,
        maxLines: 2,
      }),
    );
    this.statusText.setLayout(anchor({ anchor: 'top', y: 156, width: 260, height: 48 }));

    this.retryButton = this.addChild(
      new Button('重试', {
        background: { fillStyle: '#2f7df6', radius: 6 },
        label: { fillStyle: '#fff', fontSize: 16 },
      }),
    );
    this.retryButton.setLayout(anchor({ anchor: 'top', y: 226, width: 150, height: 42 }));
    this.retryButton.visible = false;
    this.retryButton.on('tap', () => this.startLogin(true));
  }

  async startLogin(force = false) {
    if (this.status === 'loading') return;

    const cachedSession = !force ? getCachedAuthSession(this.app) : null;
    if (cachedSession) {
      this.finishLogin(cachedSession);
      return;
    }

    this.setStatus('waiting');
    try {
      const { userInfo } = await this.app.getUserInfo({
        container: this,
        forceShowButton: true,
        value: '微信登录',
        style: {
          backgroundColor: '#07c160',
          color: '#ffffff',
          borderRadius: 6,
          fontSize: 16,
          lineHeight: 44,
        },
        onShowButton: (button) => {
          button.setLayout(anchor({ anchor: 'top', y: 226, width: 150, height: 44 }));
        },
      });

      this.setStatus('loading');
      const authSession = await loginWechatMiniGame(this.app, { userInfo });
      this.finishLogin(authSession);
    } catch (error) {
      this.setStatus('failed', error);
    }
  }

  finishLogin(authSession) {
    this.setStatus('ready');
    if (this.onLogin) this.onLogin(authSession);
  }

  setStatus(status, error = null) {
    this.status = status;
    this.retryButton.visible = status === 'failed';

    if (status === 'waiting') this.statusText.text = '请先完成微信登录';
    else if (status === 'loading') this.statusText.text = '微信登录中...';
    else if (status === 'ready') this.statusText.text = '登录成功';
    else if (status === 'failed') this.statusText.text = '登录失败，请重试';
    else this.statusText.text = this.initialMessage;

    if (error) console.warn('[wx-mahjong] wechat login failed', error);
    this.invalidatePaint();
  }
}
