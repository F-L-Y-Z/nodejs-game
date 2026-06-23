import { MapSchema, Schema, type } from '@colyseus/schema';

export class Player extends Schema {
  @type('string') id = '';
  @type('string') name = 'Guest';
  @type('number') x = 0;
  @type('number') y = 0;
  @type('number') vx = 0;
  @type('number') vy = 0;
}

export class GameState extends Schema {
  @type({ map: Player }) players = new MapSchema<Player>();
  @type('number') elapsedTime = 0;
}
