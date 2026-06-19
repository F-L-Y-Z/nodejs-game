import { createWeChatApp } from '@repo/mc2d';
import MainView from './main-view';

const app = createWeChatApp({ fps: 60 });
app.start(new MainView(app.assets));
