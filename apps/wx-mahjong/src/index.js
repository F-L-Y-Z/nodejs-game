import '@repo/wx-adapter';
import { createWeChatApp } from '@repo/mc2d';
import LobbyView from './views/lobby-view.js';
import LoginView from './views/login-view.js';

const app = createWeChatApp({ fps: 60 });
const loginView = new LoginView(app, {
  onLogin(authSession) {
    app.setRoot(new LobbyView(app, authSession));
  },
});

app.start(loginView);
loginView.startLogin();
