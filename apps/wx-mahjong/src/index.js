import { createWeChatApp } from '@repo/mc2d';
import LobbyView from './lobby-view';
import LoginView from './login-view';

const app = createWeChatApp({ fps: 60 });
const loginView = new LoginView(app, {
  onLogin(authSession) {
    app.setRoot(new LobbyView(app, authSession));
  },
});

app.start(loginView);
loginView.startLogin();
