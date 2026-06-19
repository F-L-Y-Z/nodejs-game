import { canHuWithMelds } from './hu.js';
import { ZHONG, countTiles, createDeck, removeTiles, shuffle, sortTiles, tileOrder } from './tiles.js';

const PLAYER_NAMES = ['你', '下家', '对家', '上家'];

function nextPlayer(player) {
  return (player + 1) % 4;
}

function clonePlayer(player, index) {
  const hand = player.drawnTile ? player.hand.concat(player.drawnTile) : player.hand.slice();
  return {
    index,
    name: PLAYER_NAMES[index],
    hand,
    drawnTile: player.drawnTile,
    handCount: hand.length,
    discards: player.discards.slice(),
    melds: player.melds.map((meld) => Object.assign({}, meld, { tiles: meld.tiles.slice() })),
  };
}

export default class MahjongServer {
  constructor(onUpdate) {
    this.onUpdate = onUpdate;
    this.autoDelay = 650;
    this.autoTimer = null;
    this.start();
  }

  start() {
    this.clearAutoTimer();
    this.wall = shuffle(createDeck());
    this.players = PLAYER_NAMES.map(() => ({ hand: [], drawnTile: null, discards: [], melds: [] }));
    this.currentPlayer = 0;
    this.phase = 'waiting-discard';
    this.lastDiscard = null;
    this.pendingActions = [];
    this.winner = null;
    this.bird = null;
    this.message = '轮到你出牌。红中可作万能牌，不能打出。';

    for (let i = 0; i < 13; i++) {
      this.players.forEach((player) => player.hand.push(this.wall.pop()));
    }
    this.players[0].drawnTile = this.wall.pop();
    this.sortHands();
    this.emit();
  }

  sortHands() {
    this.players.forEach((player) => {
      player.hand = sortTiles(player.hand);
    });
  }

  emit() {
    if (this.onUpdate) this.onUpdate(this.snapshot());
  }

  snapshot() {
    return {
      phase: this.phase,
      currentPlayer: this.currentPlayer,
      wallCount: this.wall.length,
      lastDiscard: this.lastDiscard && Object.assign({}, this.lastDiscard),
      message: this.message,
      winner: this.winner,
      bird: this.bird,
      actions: this.getPlayerActions(),
      players: this.players.map(clonePlayer),
    };
  }

  getPlayerActions() {
    if (this.phase === 'round-over') return {};
    if (this.phase === 'waiting-action') {
      const action = this.pendingActions.find((item) => item.player === 0);
      return action ? { pass: true, peng: action.peng, gang: action.gang } : {};
    }
    if (this.currentPlayer !== 0 || this.phase !== 'waiting-discard') return {};
    return {
      discard: true,
      hu: this.canCurrentHu(0),
      gangTiles: this.getConcealedGangTiles(0),
    };
  }

  playerDiscard(tileIndex) {
    if (this.phase !== 'waiting-discard' || this.currentPlayer !== 0) return;
    if (this.discardTile(0, tileIndex)) this.scheduleAuto();
    this.emit();
  }

  playerPass() {
    if (this.phase !== 'waiting-action') return;
    this.pendingActions = this.pendingActions.filter((action) => action.player !== 0);
    this.message = '你选择过。';
    this.resolvePendingActions();
    this.scheduleAuto();
    this.emit();
  }

  playerPeng() {
    this.claimDiscard(0, 'peng');
    this.emit();
  }

  playerGang(tile = null) {
    if (this.phase === 'waiting-action') {
      this.claimDiscard(0, 'gang');
    } else if (this.currentPlayer === 0 && this.phase === 'waiting-discard') {
      const gangTile = tile || this.getConcealedGangTiles(0)[0];
      if (gangTile) this.concealedGang(0, gangTile);
    }
    this.emit();
  }

  playerHu() {
    if (this.currentPlayer !== 0 || this.phase !== 'waiting-discard') return;
    if (!this.canCurrentHu(0)) return;
    this.finishRound(0, '你自摸胡牌');
    this.emit();
  }

  discardTile(playerIndex, tileIndex) {
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
    this.message = `${PLAYER_NAMES[playerIndex]}打出${this.tileText(tile)}。`;
    this.collectPendingActions();
    if (this.phase !== 'waiting-action') this.nextTurn(nextPlayer(playerIndex));
    return true;
  }

  collectPendingActions() {
    const { tile, from } = this.lastDiscard;
    const actions = [];
    for (let offset = 1; offset <= 3; offset++) {
      const playerIndex = (from + offset) % 4;
      const count = countTiles(this.players[playerIndex].hand)[tile] || 0;
      if (tile !== ZHONG && count >= 2) {
        actions.push({ player: playerIndex, peng: true, gang: count >= 3 });
      }
    }
    this.pendingActions = actions;
    this.phase = actions.length ? 'waiting-action' : 'waiting-discard';
    if (actions.find((action) => action.player === 0)) {
      this.message = `有人打出${this.tileText(tile)}，你可以碰/杠。`;
    }
  }

  resolvePendingActions() {
    if (!this.pendingActions.length) {
      this.nextTurn(nextPlayer(this.lastDiscard.from));
      return;
    }

    const aiAction = this.pendingActions.find((action) => action.player !== 0);
    if (!aiAction) return;
    this.claimDiscard(aiAction.player, aiAction.gang ? 'gang' : 'peng');
  }

  claimDiscard(playerIndex, type) {
    if (!this.lastDiscard) return;
    const action = this.pendingActions.find((item) => item.player === playerIndex);
    if (!action || (type === 'gang' && !action.gang) || (type === 'peng' && !action.peng)) return;

    const player = this.players[playerIndex];
    const need = type === 'gang' ? 3 : 2;
    const tile = this.lastDiscard.tile;
    if (!removeTiles(player.hand, tile, need)) return;

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
    this.message = `${PLAYER_NAMES[playerIndex]}${type === 'gang' ? '杠' : '碰'}牌。`;
  }

  concealedGang(playerIndex, tile) {
    const player = this.players[playerIndex];
    if ((countTiles(this.getPlayerTiles(playerIndex))[tile] || 0) < 4 || tile === ZHONG) return;
    this.commitDrawnTile(playerIndex);
    removeTiles(player.hand, tile, 4);
    player.melds.push({ type: 'angang', tiles: [tile, tile, tile, tile], from: playerIndex });
    this.drawTile(playerIndex);
    this.sortHands();
    this.message = `${PLAYER_NAMES[playerIndex]}暗杠。`;
  }

  nextTurn(playerIndex) {
    this.currentPlayer = playerIndex;
    this.phase = 'waiting-discard';
    if (!this.drawTile(playerIndex)) return;
    if (this.canCurrentHu(playerIndex)) {
      if (playerIndex === 0) {
        this.message = '你可以自摸胡牌。';
      } else {
        this.finishRound(playerIndex, `${PLAYER_NAMES[playerIndex]}自摸胡牌`);
      }
    } else {
      this.message = playerIndex === 0 ? '轮到你摸牌后出牌。' : `${PLAYER_NAMES[playerIndex]}摸牌。`;
    }
  }

  drawTile(playerIndex) {
    if (!this.wall.length) {
      this.phase = 'round-over';
      this.message = '牌墙摸完，流局。';
      return false;
    }
    this.players[playerIndex].drawnTile = this.wall.pop();
    return true;
  }

  clearAutoTimer() {
    if (!this.autoTimer) return;
    clearTimeout(this.autoTimer);
    this.autoTimer = null;
  }

  scheduleAuto() {
    this.clearAutoTimer();
    if (this.phase === 'round-over') return;
    if (this.currentPlayer === 0 && this.phase !== 'waiting-action') return;
    if (this.pendingActions.find((action) => action.player === 0)) return;
    this.autoTimer = setTimeout(() => {
      this.autoTimer = null;
      this.runAutoStep();
    }, this.autoDelay);
  }

  runAutoStep() {
    if (this.phase === 'round-over') return;

    if (this.phase === 'waiting-action') {
      if (this.pendingActions.find((action) => action.player === 0)) return;
      this.resolvePendingActions();
      this.emit();
      this.scheduleAuto();
      return;
    }

    if (this.currentPlayer === 0) return;

    const playerIndex = this.currentPlayer;
    if (this.canCurrentHu(playerIndex)) {
      this.finishRound(playerIndex, `${PLAYER_NAMES[playerIndex]}自摸胡牌`);
      this.emit();
      return;
    }

    const gangTile = this.getConcealedGangTiles(playerIndex)[0];
    if (gangTile) {
      this.concealedGang(playerIndex, gangTile);
      this.emit();
      this.scheduleAuto();
      return;
    }

    const discardIndex = this.chooseAIDiscard(playerIndex);
    this.discardTile(playerIndex, discardIndex);
    this.emit();
    this.scheduleAuto();
  }

  chooseAIDiscard(playerIndex) {
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

  discardScore(tile, counts) {
    const order = tileOrder(tile);
    let score = order / 100;
    if (counts[tile] > 1) score -= 4;
    const suit = tile[0];
    const rank = parseInt(tile.slice(1), 10);
    if (counts[`${suit}${rank - 1}`]) score -= 1;
    if (counts[`${suit}${rank + 1}`]) score -= 1;
    if (counts[`${suit}${rank - 2}`]) score -= 0.4;
    if (counts[`${suit}${rank + 2}`]) score -= 0.4;
    return score;
  }

  getConcealedGangTiles(playerIndex) {
    const counts = countTiles(this.getPlayerTiles(playerIndex));
    return Object.keys(counts).filter((tile) => tile !== ZHONG && counts[tile] >= 4);
  }

  canCurrentHu(playerIndex) {
    const player = this.players[playerIndex];
    return canHuWithMelds(this.getPlayerTiles(playerIndex), player.melds.length);
  }

  getPlayerTiles(playerIndex) {
    const player = this.players[playerIndex];
    return player.drawnTile ? player.hand.concat(player.drawnTile) : player.hand.slice();
  }

  commitDrawnTile(playerIndex) {
    const player = this.players[playerIndex];
    if (!player.drawnTile) return;
    player.hand.push(player.drawnTile);
    player.drawnTile = null;
  }

  finishRound(winner, reason) {
    this.phase = 'round-over';
    this.winner = winner;
    this.bird = this.wall.pop() || null;
    this.message = `${reason}。${this.bird ? `扎鸟：${this.tileText(this.bird)}。` : ''}`;
  }

  tileText(tile) {
    if (tile === ZHONG) return '红中';
    return `${tile.slice(1)}${tile[0] === 'W' ? '万' : tile[0] === 'B' ? '筒' : '条'}`;
  }
}
