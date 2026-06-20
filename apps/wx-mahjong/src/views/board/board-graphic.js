import { Graphic } from '@repo/mc2d';
import { getActionLayout, getBoardMetrics, getDiscardLayout, getHandHitRects, getSideMeldMaxWidth } from './layout.js';
import {
  DISCARD_STEP_X,
  DISCARD_STEP_Y,
  MINI_TILE_W,
  PLAYER_POS,
  TILE_SPRITE,
  clamp,
  drawMeldRows,
  drawMiniTile,
  drawText,
  drawTile,
  getRemainingSeconds,
} from './renderers.js';

export default class BoardGraphic extends Graphic {
  constructor(assetManager) {
    super();
    this.assets = assetManager;
    this.state = null;
    this.spriteAsset = null;
  }

  setState(state) {
    this.state = state;
    this.invalidatePaint();
  }

  draw(ctx) {
    const x = 0;
    const y = 0;
    const width = this.width;
    const height = this.height;
    const state = this.state;
    const metrics = getBoardMetrics(width, height);
    const spriteAsset = this.getSpriteAsset();
    ctx.fillStyle = '#173b32';
    ctx.fillRect(x, y, width, height);

    ctx.fillStyle = '#205447';
    ctx.fillRect(
      x + metrics.tableLeft,
      y + metrics.tableTop,
      metrics.tableRight - metrics.tableLeft,
      metrics.tableBottom - metrics.tableTop,
    );
    ctx.fillStyle = 'rgba(0,0,0,0.16)';
    ctx.fillRect(x, y + metrics.handY - 8, width, height - metrics.handY + 8);

    if (!state) return;

    this.drawHeader(ctx, state, x, y, width, metrics, spriteAsset);
    this.drawMelds(ctx, state, x, y, width, height, metrics, spriteAsset);
    this.drawPlayers(ctx, state, x, y, width, height, metrics);
    this.drawDiscards(ctx, state, x, y, width, height, metrics, spriteAsset);
    this.drawStatus(ctx, state, x, y, width, metrics, spriteAsset);
    this.drawHand(ctx, state, width, height, spriteAsset);
  }

  // --- Private helpers ---

  getSpriteAsset() {
    if (!this.spriteAsset && this.assets) {
      this.spriteAsset = this.assets.image(TILE_SPRITE.src);
      this.spriteAsset.promise.then(() => this.invalidatePaint()).catch(() => this.invalidatePaint());
    }
    return this.spriteAsset;
  }

  drawHeader(ctx, state, x, y, width, metrics, spriteAsset) {
    const titleY = metrics.isLandscape ? 20 : 22;
    drawText(ctx, '红中麻将', x + 18, y + titleY, 18, '#f9f2dc', 'left');
    if (state.roomId) {
      drawText(ctx, `房间 ${state.roomId}`, x + width / 2, y + titleY, 13, '#dce8de');
    }
    drawText(ctx, `牌墙 ${state.wallCount}`, x + width - 18, y + titleY, 14, '#dce8de', 'right');
    if (state.bird) {
      const birdY = metrics.isLandscape ? 34 : 58;
      drawText(ctx, '鸟', x + width - 54, y + birdY + 16, 12, '#f9f2dc');
      drawMiniTile(ctx, state.bird, x + width - 42, y + birdY, spriteAsset);
    }
  }

  drawStatus(ctx, state, x, y, width, metrics, spriteAsset) {
    const actions = getActionLayout(state, width, this.height);
    const panelW = metrics.isLandscape ? 210 : Math.min(190, width - 24);
    const panelX = x + width - panelW - 12;
    const preferredY = actions.length ? actions[0].y - 62 : metrics.handY - 82;
    const panelY = y + clamp(preferredY, metrics.tableTop + 8, metrics.handY - 58);
    const textX = panelX + panelW;

    if (state.lastDiscard) {
      const name = state.players[state.lastDiscard.from].name;
      drawText(ctx, `当前弃牌：${name}`, textX - MINI_TILE_W - 8, panelY + 18, 12, '#dce8de', 'right', panelW - 40);
      drawMiniTile(ctx, state.lastDiscard.tile, textX - MINI_TILE_W, panelY, spriteAsset, true);
    } else {
      drawText(ctx, '当前弃牌：无', textX, panelY + 16, 12, '#dce8de', 'right', panelW);
    }
    drawText(ctx, state.message, textX, panelY + 50, 13, '#fff4c5', 'right', panelW);
  }

  drawPlayers(ctx, state, x, y, width, height, metrics) {
    state.players.forEach((player, index) => {
      const pos = PLAYER_POS[index];
      const active = state.currentPlayer === index && state.phase !== 'round-over';
      const color = active ? '#ffd86b' : '#dce8de';
      const countdownText = active && state.turnDeadlineAt ? ` ${getRemainingSeconds(state.turnDeadlineAt)}s` : '';
      const readyText =
        state.roomStatus === 'waiting' || state.roomStatus === 'settling'
          ? ` ${player.isReady ? '已准备' : '未准备'}`
          : '';
      const label = `${player.name}${readyText}${countdownText}`;
      if (pos === 'bottom') {
        drawText(ctx, label, x + Math.max(18, metrics.handX - 18), y + metrics.handY + metrics.tileH / 2, 13, color);
      } else if (pos === 'top') {
        drawText(ctx, `${label} ${player.handCount}张`, x + width / 2, y + metrics.tableTop - 16, 13, color);
      } else if (pos === 'left') {
        const nameX = metrics.isLandscape ? metrics.tableLeft - 50 : 20;
        drawText(ctx, `${label} ${player.handCount}张`, x + nameX, y + metrics.centerY - 76, 13, color);
      } else if (pos === 'right') {
        const nameX = metrics.isLandscape ? metrics.tableRight + 50 : width - 20;
        drawText(ctx, `${label} ${player.handCount}张`, x + nameX, y + metrics.centerY - 76, 13, color);
      }
    });
  }

  drawDiscards(ctx, state, x, y, width, height, metrics, spriteAsset) {
    state.players.forEach((player, index) => {
      const layout = getDiscardLayout(index, width, metrics, player.melds);
      const tiles = player.discards.slice(-layout.capacity);
      const isLastFrom = state.lastDiscard && state.lastDiscard.from === index;
      const lastTileIdx = tiles.length - 1;
      tiles.forEach((tile, tileIndex) => {
        const tx = x + layout.x + (tileIndex % layout.cols) * DISCARD_STEP_X;
        const ty = y + layout.y + Math.floor(tileIndex / layout.cols) * DISCARD_STEP_Y;
        drawMiniTile(ctx, tile, tx, ty, spriteAsset, isLastFrom && tileIndex === lastTileIdx);
      });
    });
  }

  drawMelds(ctx, state, x, y, width, height, metrics, spriteAsset) {
    const topMaxWidth = width - 24;
    const sideMaxWidth = getSideMeldMaxWidth(width, metrics);
    drawMeldRows(ctx, state.players[2].melds, x + 12, y + metrics.tableTop + 6, topMaxWidth, spriteAsset);
    drawMeldRows(ctx, state.players[3].melds, x + 12, y + metrics.tableTop + 40, sideMaxWidth, spriteAsset);
    drawMeldRows(
      ctx,
      state.players[1].melds,
      x + width - 12 - sideMaxWidth,
      y + metrics.tableTop + 40,
      sideMaxWidth,
      spriteAsset,
      'right',
    );

    let mx = metrics.isLandscape ? 18 : 12;
    const actionLayout = getActionLayout(state, width, height);
    const my = actionLayout.length ? Math.max(metrics.tableTop + 8, actionLayout[0].y - 42) : metrics.meldY;
    state.players[0].melds.forEach((meld) => {
      meld.tiles.forEach((tile) => {
        drawMiniTile(ctx, tile, mx, my, spriteAsset);
        mx += 26;
      });
      mx += 8;
    });
  }

  drawHand(ctx, state, width, height, spriteAsset) {
    const rects = getHandHitRects(state, width, height);
    const canDiscard = state.actions.discard;
    rects.forEach((rect) => {
      const tile = state.players[0].hand[rect.index];
      drawTile(ctx, tile, rect.x, rect.y, rect.width, rect.height, spriteAsset, canDiscard && tile !== 'ZH');
    });
  }
}
