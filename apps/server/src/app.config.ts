import { ROOM_NAMES } from '@repo/shared';
import { defineRoom, defineServer, monitor, playground } from 'colyseus';
import { MahjongRoom } from './rooms/mahjong-room.js';

const server = defineServer({
  rooms: {
    [ROOM_NAMES.Mahjong]: defineRoom(MahjongRoom),
  },

  // routes: createRouter({
  //   api_hello: createEndpoint('/api/hello', { method: 'GET' }, async (ctx) => {
  //     return { message: 'Hello World' };
  //   }),
  // }),

  express: (app) => {
    // app.get('/hi', (req, res) => {
    //   res.send("It's time to kick ass and chew bubblegum!");
    // });

    app.use('/monitor', monitor());

    if (process.env.NODE_ENV !== 'production') {
      app.use('/', playground());
    }
  },
});

export default server;
