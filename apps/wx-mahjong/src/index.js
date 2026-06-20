import { createWeChatApp } from '@repo/mc2d';
import LoginView from './login-view';
import MainView from './main-view';

const app = createWeChatApp({ fps: 60 });
const loginView = new LoginView(app, {
  onLogin(authSession) {
    app.setRoot(new MainView(app, authSession));
  },
});

app.start(loginView);
loginView.startLogin();
