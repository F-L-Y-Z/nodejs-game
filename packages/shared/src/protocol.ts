export const ROOM_NAMES = {
  Game: 'game_room',
} as const;

export const CLIENT_MESSAGES = {
  Move: 'move',
  Ready: 'ready',
  MahjongAction: 'mahjong_action',
} as const;

export const SERVER_MESSAGES = {
  PlayerJoined: 'player_joined',
  PlayerLeft: 'player_left',
  MahjongSnapshot: 'mahjong_snapshot',
  MahjongError: 'mahjong_error',
} as const;

export type RoomName = (typeof ROOM_NAMES)[keyof typeof ROOM_NAMES];
export type ClientMessageName = (typeof CLIENT_MESSAGES)[keyof typeof CLIENT_MESSAGES];
export type ServerMessageName = (typeof SERVER_MESSAGES)[keyof typeof SERVER_MESSAGES];

export type JoinRoomOptions = {
  token?: string;
  name?: string;
};

export type MoveMessage = {
  x: number;
  y: number;
};

export type MahjongActionName = 'discard' | 'pass' | 'peng' | 'gang' | 'hu' | 'restart' | 'ready' | 'leave';

export type MahjongActionMessage = {
  action: MahjongActionName;
  index?: number;
  tile?: string;
};

export type PlayerJoinedMessage = {
  id: string;
  name: string;
};

export type PlayerLeftMessage = {
  id: string;
};
