import '@iro/wechat-adapter';
import { createWeChatApp } from '@repo/mc2d';
import 'cross-fetch/polyfill';
import 'url-polyfill';
import LobbyView from './views/lobby-view.js';
import LoginView from './views/login-view.js';

const WebSocket_send = globalThis.WebSocket.prototype.send;
globalThis.WebSocket.prototype.send = function (data) {
  console.log('send');
  if (data instanceof Uint8Array) {
    WebSocket_send.call(this, data.slice().buffer);
  } else if (Array.isArray(data)) {
    WebSocket_send.call(this, new Uint8Array(data).buffer);
  } else {
    WebSocket_send.call(this, data);
  }
};

const app = createWeChatApp({ fps: 60 });
const loginView = new LoginView(app, {
  onLogin(authSession) {
    app.setRoot(new LobbyView(app, authSession));
  },
});

app.start(loginView);
loginView.startLogin();
