import { canHuWithMelds } from './hu.js';
import { ZHONG, countTiles, createDeck, removeTiles, shuffle, sortTiles, tileOrder } from './tiles.js';

export type MahjongAction = 'discard' | 'pass' | 'peng' | 'gang' | 'hu' | 'restart' | 'ready' | 'leave';

type Meld = {
  type: string;
  tiles: string[];
  from: number;
};

type MahjongPlayer = {
  clientId: string | null;
  userId: string | null;
  name: string;
  avatarUrl: string;
  hand: string[];
  drawnTile: string | null;
  discards: string[];
  melds: Meld[];
};

type PendingAction = {
  player: number;
  peng: boolean;
  gang: boolean;
};

export type MahjongSnapshot = {
  phase: string;
  currentPlayer: number;
  wallCount: number;
  lastDiscard: { tile: string; from: number } | null;
  message: string;
  winner: number | null;
  bird: string | null;
  actions: Record<string, unknown>;
  players: Array<{
    index: number;
    name: string;
    avatarUrl: string;
    isHuman: boolean;
    isReady?: boolean;
    hand: string[];
    drawnTile: string | null;
    handCount: number;
    discards: string[];
    melds: Meld[];
  }>;
};

const AI_NAMES = ['陪玩一', '陪玩二', '陪玩三', '陪玩四'];

function nextPlayer(player: number): number {
  return (player + 1) % 4;
}

function cloneMelds(melds: Meld[]): Meld[] {
  return melds.map((meld) => ({ ...meld, tiles: meld.tiles.slice() }));
}

export class MahjongTable {
  private wall: string[] = [];
  private players: MahjongPlayer[] = [];
  private currentPlayer = 0;
  private phase = 'waiting-discard';
  private lastDiscard: { tile: string; from: number } | null = null;
  private pendingActions: PendingAction[] = [];
  private winner: number | null = null;
  private bird: string | null = null;
  private message = '';

  constructor(startNow = true) {
    this.resetSeats();
    if (startNow) this.startRoundKeepingHumans();
    else this.message = '等待玩家准备。';
  }

  addHuman(clientId: string, userId: string, name: string, avatarUrl = ''): number | null {
    const existingSeat = this.getSeatByClient(clientId);
    if (existingSeat !== null) {
      this.players[existingSeat].name = name;
      this.players[existingSeat].avatarUrl = avatarUrl;
      return existingSeat;
    }

    const reusableSeat = this.players.findIndex((player) => !player.clientId);
    if (reusableSeat < 0) return null;

    this.players[reusableSeat].clientId = clientId;
    this.players[reusableSeat].userId = userId;
    this.players[reusableSeat].name = name;
    this.players[reusableSeat].avatarUrl = avatarUrl;
    this.message = `${name}加入牌局。`;
    return reusableSeat;
  }

  removeHuman(clientId: string): void {
    const seat = this.getSeatByClient(clientId);
    if (seat === null) return;
    const player = this.players[seat];
    player.clientId = null;
    player.userId = null;
    player.name = AI_NAMES[seat];
    player.avatarUrl = '';
    this.message = `玩家离开，${player.name}接管。`;
  }

  getSeatByClient(clientId: string): number | null {
    const seat = this.players.findIndex((player) => player.clientId === clientId);
    return seat >= 0 ? seat : null;
  }

  hasHuman(clientId: string): boolean {
    return this.getSeatByClient(clientId) !== null;
  }

  getHumanUserIds(): string[] {
    return this.players
      .map((player) => player.userId)
      .filter((userId): userId is string => Boolean(userId));
  }

  getHumanCount(): number {
    return this.getHumanUserIds().length;
  }

  getSeatInfos(): Array<{ index: number; userId: string | null; name: string; avatarUrl: string; isHuman: boolean }> {
    return this.players.map((player, index) => ({
      index,
      userId: player.userId,
      name: player.name,
      avatarUrl: player.avatarUrl,
      isHuman: Boolean(player.userId),
    }));
  }

  start(): void {
    this.resetSeats();
    this.startRoundKeepingHumans();
  }

  startRoundKeepingHumans(): void {
    this.dealRound();
  }

  private resetSeats(): void {
    this.players = AI_NAMES.map((name) => ({
      clientId: null,
      userId: null,
      name,
      avatarUrl: '',
      hand: [],
      drawnTile: null,
      discards: [],
      melds: [],
    }));
    this.wall = [];
    this.currentPlayer = 0;
    this.phase = 'waiting';
    this.lastDiscard = null;
    this.pendingActions = [];
    this.winner = null;
    this.bird = null;
    this.message = '等待玩家准备。';
  }

  private dealRound(): void {
    const humans = this.players.map((player, index) => ({
      clientId: player.clientId,
      userId: player.userId,
      name: player.clientId ? player.name : AI_NAMES[index],
      avatarUrl: player.clientId ? player.avatarUrl : '',
    }));
    this.wall = shuffle(createDeck());
    this.players = AI_NAMES.map((name, index) => ({
      clientId: humans[index]?.clientId || null,
      userId: humans[index]?.userId || null,
      name: humans[index]?.name || name,
      avatarUrl: humans[index]?.avatarUrl || '',
      hand: [],
      drawnTile: null,
      discards: [],
      melds: [],
    }));
    this.currentPlayer = 0;
    this.phase = 'waiting-discard';
    this.lastDiscard = null;
    this.pendingActions = [];
    this.winner = null;
    this.bird = null;
    this.message = '牌局开始，等待玩家操作。';

    for (let i = 0; i < 13; i++) {
      this.players.forEach((player) => player.hand.push(this.wall.pop() as string));
    }
    this.players[0].drawnTile = this.wall.pop() || null;
    this.sortHands();
  }

  snapshotFor(clientId: string): MahjongSnapshot {
    const seat = this.getSeatByClient(clientId) ?? 0;
    return {
      phase: this.phase,
      currentPlayer: this.toViewSeat(this.currentPlayer, seat),
      wallCount: this.wall.length,
      lastDiscard: this.lastDiscard && {
        tile: this.lastDiscard.tile,
        from: this.toViewSeat(this.lastDiscard.from, seat),
      },
      message: this.messageFor(seat),
      winner: this.winner === null ? null : this.toViewSeat(this.winner, seat),
      bird: this.bird,
      actions: this.getPlayerActions(seat),
      players: [0, 1, 2, 3].map((viewSeat) => this.clonePlayerForView(this.toTableSeat(viewSeat, seat), viewSeat)),
    };
  }

  handleAction(clientId: string, action: MahjongAction, payload: Record<string, unknown> = {}): boolean {
    const seat = this.getSeatByClient(clientId);
    if (seat === null) return false;

    if (action === 'restart') {
      this.startRoundKeepingHumans();
      return true;
    }
    if (action === 'discard') return this.playerDiscard(seat, Number(payload.index));
    if (action === 'pass') return this.playerPass(seat);
    if (action === 'peng') return this.claimDiscard(seat, 'peng');
    if (action === 'gang') return this.playerGang(seat, typeof payload.tile === 'string' ? payload.tile : null);
    if (action === 'hu') return this.playerHu(seat);
    return false;
  }

  runAutoStep(forceHumans = false): boolean {
    if (this.phase === 'round-over') return false;

    if (this.phase === 'waiting-action') {
      const humanAction = this.pendingActions.find((action) => this.players[action.player].clientId);
      if (humanAction && !forceHumans) return false;
      if (humanAction && forceHumans) {
        this.pendingActions = this.pendingActions.filter((action) => !this.players[action.player].clientId);
        this.message = '操作超时，自动过。';
      }
      this.resolvePendingActions();
      return true;
    }

    if (this.players[this.currentPlayer].clientId && !forceHumans) return false;

    const playerIndex = this.currentPlayer;
    if (!forceHumans && this.canCurrentHu(playerIndex)) {
      this.finishRound(playerIndex, `${this.players[playerIndex].name}自摸胡牌`);
      return true;
    }

    const gangTile = this.getConcealedGangTiles(playerIndex)[0];
    if (!forceHumans && gangTile) {
      this.concealedGang(playerIndex, gangTile);
      return true;
    }

    return this.discardTile(playerIndex, this.chooseAIDiscard(playerIndex));
  }

  shouldAutoRun(): boolean {
    if (this.phase === 'round-over') return false;
    if (this.phase === 'waiting-action') {
      return !this.pendingActions.some((action) => this.players[action.player].clientId);
    }
    return !this.players[this.currentPlayer].clientId;
  }

  shouldWaitForHumanAction(): boolean {
    if (this.phase === 'round-over') return false;
    if (this.phase === 'waiting-action') {
      return this.pendingActions.some((action) => this.players[action.player].clientId);
    }
    return this.phase === 'waiting-discard' && Boolean(this.players[this.currentPlayer].clientId);
  }

  private sortHands(): void {
    this.players.forEach((player) => {
      player.hand = sortTiles(player.hand);
    });
  }

  private clonePlayerForView(tableSeat: number, viewSeat: number): MahjongSnapshot['players'][number] {
    const player = this.players[tableSeat];
    const ownSeat = viewSeat === 0;
    const revealHand = this.phase === 'round-over' && this.winner !== null;
    const hand = ownSeat || revealHand
      ? player.drawnTile
        ? player.hand.concat(player.drawnTile)
        : player.hand.slice()
      : new Array(this.getPlayerTiles(tableSeat).length).fill('BACK');
    return {
      index: viewSeat,
      name: ownSeat ? '你' : player.name,
      avatarUrl: player.avatarUrl,
      isHuman: Boolean(player.userId),
      hand,
      drawnTile: ownSeat || revealHand ? player.drawnTile : null,
      handCount: this.getPlayerTiles(tableSeat).length,
      discards: player.discards.slice(),
      melds: cloneMelds(player.melds),
    };
  }

  private getPlayerActions(playerIndex: number): Record<string, unknown> {
    if (this.phase === 'round-over') return {};
    if (this.phase === 'waiting-action') {
      const action = this.pendingActions.find((item) => item.player === playerIndex);
      return action ? { pass: true, peng: action.peng, gang: action.gang } : {};
    }
    if (this.currentPlayer !== playerIndex || this.phase !== 'waiting-discard') return {};
    return {
      discard: true,
      hu: this.canCurrentHu(playerIndex),
      gangTiles: this.getConcealedGangTiles(playerIndex),
    };
  }

  private playerDiscard(playerIndex: number, tileIndex: number): boolean {
    if (this.phase !== 'waiting-discard' || this.currentPlayer !== playerIndex) return false;
    return this.discardTile(playerIndex, tileIndex);
  }

  private playerPass(playerIndex: number): boolean {
    if (this.phase !== 'waiting-action') return false;
    if (!this.pendingActions.some((action) => action.player === playerIndex)) return false;
    this.pendingActions = this.pendingActions.filter((action) => action.player !== playerIndex);
    this.message = `${this.players[playerIndex].name}选择过。`;
    this.resolvePendingActions();
    return true;
  }

  private playerGang(playerIndex: number, tile: string | null): boolean {
    if (this.phase === 'waiting-action') return this.claimDiscard(playerIndex, 'gang');
    if (this.currentPlayer !== playerIndex || this.phase !== 'waiting-discard') return false;
    const gangTile = tile || this.getConcealedGangTiles(playerIndex)[0];
    if (!gangTile) return false;
    this.concealedGang(playerIndex, gangTile);
    return true;
  }

  private playerHu(playerIndex: number): boolean {
    if (this.currentPlayer !== playerIndex || this.phase !== 'waiting-discard') return false;
    if (!this.canCurrentHu(playerIndex)) return false;
    this.finishRound(playerIndex, `${this.players[playerIndex].name}自摸胡牌`);
    return true;
  }

  private discardTile(playerIndex: number, tileIndex: number): boolean {
    const player = this.players[playerIndex];
    const handTiles = this.getPlayerTiles(playerIndex);
    const tile = handTiles[tileIndex];
    if (!tile || tile === ZHONG) {
      this.message = '红中不能打出。';
      return false;
    }

    if (player.drawnTile && tileIndex === player.hand.length) {
      player.drawnTile = null;
    } else {
      player.hand.splice(tileIndex, 1);
      this.commitDrawnTile(playerIndex);
    }
    player.hand = sortTiles(player.hand);
    player.discards.push(tile);
    this.lastDiscard = { tile, from: playerIndex };
    this.message = `${player.name}打出${this.tileText(tile)}。`;
    this.collectPendingActions();
    if (this.phase !== 'waiting-action') this.nextTurn(nextPlayer(playerIndex));
    return true;
  }

  private collectPendingActions(): void {
    if (!this.lastDiscard) return;
    const { tile, from } = this.lastDiscard;
    const actions: PendingAction[] = [];
    for (let offset = 1; offset <= 3; offset++) {
      const playerIndex = (from + offset) % 4;
      const count = countTiles(this.players[playerIndex].hand)[tile] || 0;
      if (tile !== ZHONG && count >= 2) {
        actions.push({ player: playerIndex, peng: true, gang: count >= 3 });
      }
    }
    this.pendingActions = actions;
    this.phase = actions.length ? 'waiting-action' : 'waiting-discard';
    if (actions.length) {
      this.message = `有人打出${this.tileText(tile)}，可碰/杠。`;
    }
  }

  private resolvePendingActions(): void {
    if (!this.pendingActions.length) {
      if (this.lastDiscard) this.nextTurn(nextPlayer(this.lastDiscard.from));
      return;
    }

    const action = this.pendingActions[0];
    if (action) this.claimDiscard(action.player, action.gang ? 'gang' : 'peng');
  }

  private claimDiscard(playerIndex: number, type: 'peng' | 'gang'): boolean {
    if (!this.lastDiscard) return false;
    const action = this.pendingActions.find((item) => item.player === playerIndex);
    if (!action || (type === 'gang' && !action.gang) || (type === 'peng' && !action.peng)) return false;

    const player = this.players[playerIndex];
    const need = type === 'gang' ? 3 : 2;
    const tile = this.lastDiscard.tile;
    if (!removeTiles(player.hand, tile, need)) return false;

    const from = this.lastDiscard.from;
    const discardPile = this.players[from].discards;
    discardPile.splice(discardPile.lastIndexOf(tile), 1);
    player.melds.push({ type, tiles: new Array(need + 1).fill(tile), from });
    this.currentPlayer = playerIndex;
    this.phase = 'waiting-discard';
    this.pendingActions = [];
    this.lastDiscard = null;

    if (type === 'gang') this.drawTile(playerIndex);
    this.sortHands();
    this.message = `${player.name}${type === 'gang' ? '杠' : '碰'}牌。`;
    return true;
  }

  private concealedGang(playerIndex: number, tile: string): void {
    const player = this.players[playerIndex];
    if ((countTiles(this.getPlayerTiles(playerIndex))[tile] || 0) < 4 || tile === ZHONG) return;
    this.commitDrawnTile(playerIndex);
    removeTiles(player.hand, tile, 4);
    player.melds.push({ type: 'angang', tiles: [tile, tile, tile, tile], from: playerIndex });
    this.drawTile(playerIndex);
    this.sortHands();
    this.message = `${player.name}暗杠。`;
  }

  private nextTurn(playerIndex: number): void {
    this.currentPlayer = playerIndex;
    this.phase = 'waiting-discard';
    if (!this.drawTile(playerIndex)) return;
    if (this.canCurrentHu(playerIndex)) {
      this.message = this.players[playerIndex].clientId ? '你可以自摸胡牌。' : `${this.players[playerIndex].name}可以胡牌。`;
    } else {
      this.message = `${this.players[playerIndex].name}摸牌。`;
    }
  }

  private drawTile(playerIndex: number): boolean {
    if (!this.wall.length) {
      this.phase = 'round-over';
      this.message = '牌墙摸完，流局。';
      return false;
    }
    this.players[playerIndex].drawnTile = this.wall.pop() || null;
    return true;
  }

  private chooseAIDiscard(playerIndex: number): number {
    const hand = this.getPlayerTiles(playerIndex);
    const counts = countTiles(hand);
    let bestIndex = hand.findIndex((tile) => tile !== ZHONG);
    let bestScore = -Infinity;
    hand.forEach((tile, index) => {
      if (tile === ZHONG) return;
      const score = this.discardScore(tile, counts);
      if (score > bestScore) {
        bestIndex = index;
        bestScore = score;
      }
    });
    return bestIndex;
  }

  private discardScore(tile: string, counts: Record<string, number>): number {
    const order = tileOrder(tile);
    let score = order / 100;
    if ((counts[tile] || 0) > 1) score -= 4;
    const suit = tile[0];
    const rank = parseInt(tile.slice(1), 10);
    if (counts[`${suit}${rank - 1}`]) score -= 1;
    if (counts[`${suit}${rank + 1}`]) score -= 1;
    if (counts[`${suit}${rank - 2}`]) score -= 0.4;
    if (counts[`${suit}${rank + 2}`]) score -= 0.4;
    return score;
  }

  private getConcealedGangTiles(playerIndex: number): string[] {
    const counts = countTiles(this.getPlayerTiles(playerIndex));
    return Object.keys(counts).filter((tile) => tile !== ZHONG && (counts[tile] || 0) >= 4);
  }

  private canCurrentHu(playerIndex: number): boolean {
    const player = this.players[playerIndex];
    if (!player.drawnTile) return false;
    return canHuWithMelds(this.getPlayerTiles(playerIndex), player.melds.length);
  }

  private getPlayerTiles(playerIndex: number): string[] {
    const player = this.players[playerIndex];
    return player.drawnTile ? player.hand.concat(player.drawnTile) : player.hand.slice();
  }

  private commitDrawnTile(playerIndex: number): void {
    const player = this.players[playerIndex];
    if (!player.drawnTile) return;
    player.hand.push(player.drawnTile);
    player.drawnTile = null;
  }

  private finishRound(winner: number, reason: string): void {
    this.phase = 'round-over';
    this.winner = winner;
    this.bird = this.wall.pop() || null;
    this.message = `${reason}。${this.bird ? `扎鸟：${this.tileText(this.bird)}。` : ''}`;
  }

  private toViewSeat(tableSeat: number, viewerSeat: number): number {
    return (tableSeat - viewerSeat + 4) % 4;
  }

  private toTableSeat(viewSeat: number, viewerSeat: number): number {
    return (viewerSeat + viewSeat) % 4;
  }

  private messageFor(viewerSeat: number): string {
    const player = this.players[viewerSeat];
    if (this.phase === 'waiting-discard' && this.currentPlayer === viewerSeat) {
      return this.canCurrentHu(viewerSeat) ? '你可以自摸胡牌。' : '轮到你出牌。红中不能打出。';
    }
    if (this.phase === 'waiting-action' && this.pendingActions.some((action) => action.player === viewerSeat)) {
      return `有人打出${this.tileText(this.lastDiscard?.tile || '')}，你可以碰/杠。`;
    }
    return this.message.replaceAll(player.name, '你');
  }

  private tileText(tile: string): string {
    if (tile === ZHONG) return '红中';
    return `${tile.slice(1)}${tile[0] === 'W' ? '万' : tile[0] === 'B' ? '筒' : '条'}`;
  }
}
