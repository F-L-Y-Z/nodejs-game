import { createWeChatApp } from '@repo/mc2d';
import MainView from './main-view';

const app = createWeChatApp({ fps: 60 });
const view = new MainView(app);

app.start(view);
view.startLogin();
