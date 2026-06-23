import { ROOM_NAMES } from '@repo/shared';
import { createRouter, defineRoom, defineServer, monitor, playground } from 'colyseus';
import { MahjongRoom } from './rooms/mahjong/index.js';
import createWxLoginRoute from './routes/wx-login.js';

const server = defineServer({
  rooms: {
    [ROOM_NAMES.Mahjong]: defineRoom(MahjongRoom),
  },

  routes: createRouter({
    wxLogin: createWxLoginRoute(),
  }),

  express: (app) => {
    app.use('/monitor', monitor());

    if (process.env.NODE_ENV !== 'production') {
      app.use('/', playground());
    }
  },
});

export default server;
