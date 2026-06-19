import { Graphic } from '@repo/mc2d';
import { tileInfo } from '../server/tiles.js';

const PLAYER_POS = ['bottom', 'right', 'top', 'left'];
const TILE_SPRITE = {
  src: 'images/sprite.png',
  x: 30,
  y: 33,
  width: 94,
  height: 122,
  gapX: 18,
  gapY: 25,
};

function getBoardMetrics(width, height) {
  const safeWidth = width || 375;
  const safeHeight = height || 667;
  const isLandscape = safeWidth > safeHeight;
  const sidePad = isLandscape ? 120 : 24;
  const bottomPad = isLandscape ? 10 : 18;
  const gap = isLandscape ? 4 : 3;
  const maxTileW = isLandscape ? 40 : 42;
  const minTileW = isLandscape ? 28 : 24;
  const tileW = Math.max(minTileW, Math.min(maxTileW, (safeWidth - sidePad - gap * 13) / 14));
  const tileH = Math.round(tileW * 1.42);
  const drawnGap = isLandscape ? 18 : 12;
  const handWidth = tileW * 14 + gap * 13 + drawnGap;
  const handX = Math.max(8, (safeWidth - handWidth) / 2);
  const handY = safeHeight - tileH - bottomPad;
  const tableLeft = isLandscape ? 88 : 12;
  const tableRight = isLandscape ? safeWidth - 88 : safeWidth - 12;
  const tableTop = isLandscape ? 50 : 96;
  const tableBottom = handY - (isLandscape ? 16 : 54);
  const centerX = safeWidth / 2;
  const centerY = (tableTop + tableBottom) / 2;
  return {
    centerX,
    centerY,
    drawnGap,
    gap,
    handX,
    handY,
    isLandscape,
    tableBottom,
    tableLeft,
    tableRight,
    tableTop,
    tileH,
    tileW,
  };
}

function drawRoundRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.arcTo(x + width, y, x + width, y + radius, radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius);
  ctx.lineTo(x + radius, y + height);
  ctx.arcTo(x, y + height, x, y + height - radius, radius);
  ctx.lineTo(x, y + radius);
  ctx.arcTo(x, y, x + radius, y, radius);
  ctx.closePath();
}

function drawText(ctx, text, x, y, size, color, align = 'center') {
  ctx.fillStyle = color;
  ctx.font = `${size}px Arial`;
  ctx.textAlign = align;
  ctx.textBaseline = 'middle';
  ctx.fillText(text, x, y);
}

function getSpriteCell(tile) {
  if (tile === 'BACK') return { row: 3, col: 6 };
  if (tile === 'ZH') return { row: 3, col: 4 };
  const suit = tile[0];
  const rank = parseInt(tile.slice(1), 10);
  const rowMap = { W: 0, B: 1, T: 2 };
  return { row: rowMap[suit], col: rank - 1 };
}

function drawFallbackTile(ctx, tile, x, y, width, height, selected) {
  if (tile === 'BACK') {
    drawRoundRect(ctx, x, y, width, height, 4);
    ctx.fillStyle = '#2f7867';
    ctx.fill();
    ctx.strokeStyle = '#1f574b';
    ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.18)';
    ctx.fillRect(x + width * 0.25, y + height * 0.18, width * 0.5, height * 0.64);
    return;
  }
  const info = tileInfo(tile);
  drawRoundRect(ctx, x, y, width, height, 5);
  ctx.fillStyle = selected ? '#fff6d7' : '#f7f2e8';
  ctx.fill();
  ctx.lineWidth = 1;
  ctx.strokeStyle = selected ? '#d39b22' : '#c7bca8';
  ctx.stroke();
  drawText(ctx, info.label, x + width / 2, y + height * 0.38, Math.max(18, width * 0.52), info.color);
  drawText(ctx, info.subLabel, x + width / 2, y + height * 0.72, Math.max(10, width * 0.28), info.color);
}

function drawTile(ctx, tile, x, y, width, height, asset, selected = false, highlighted = false) {
  ctx.save();

  if (highlighted) {
    drawRoundRect(ctx, x - 3, y - 3, width + 6, height + 6, 7);
    ctx.fillStyle = 'rgba(255,210,0,0.32)';
    ctx.fill();
    ctx.strokeStyle = '#f0a800';
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  if (!asset || asset.status !== 'loaded') {
    drawFallbackTile(ctx, tile, x, y, width, height, selected);
  } else {
    const cell = getSpriteCell(tile);
    const sx = TILE_SPRITE.x + cell.col * (TILE_SPRITE.width + TILE_SPRITE.gapX);
    const sy = TILE_SPRITE.y + cell.row * (TILE_SPRITE.height + TILE_SPRITE.gapY);
    ctx.drawImage(asset.image, sx, sy, TILE_SPRITE.width, TILE_SPRITE.height, x, y, width, height);
    if (selected) {
      drawRoundRect(ctx, x, y, width, height, 5);
      ctx.strokeStyle = '#d39b22';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }
  ctx.restore();
}

function drawBack(ctx, x, y, width, height, asset) {
  drawTile(ctx, 'BACK', x, y, width, height, asset);
}

function drawMiniTile(ctx, tile, x, y, asset, highlighted = false) {
  drawTile(ctx, tile, x, y, 24, 34, asset, false, highlighted);
}

export function getHandHitRects(state, width, height) {
  const { drawnGap, gap, tileW, tileH, handX, handY } = getBoardMetrics(width, height);
  const player = state && state.players && state.players[0] ? state.players[0] : null;
  const hand = player ? player.hand : [];
  const drawnIndex = player && player.drawnTile ? hand.length - 1 : -1;
  return hand.map((tile, index) => ({
    index,
    x: handX + index * (tileW + gap) + (index === drawnIndex ? drawnGap : 0),
    y: handY,
    width: tileW,
    height: tileH,
  }));
}

export function getActionLayout(state, width, height) {
  const { handY, isLandscape } = getBoardMetrics(width, height);
  const actions = [];
  const enabled = state && state.actions ? state.actions : {};
  if (enabled.pass) actions.push({ key: 'pass', label: '过' });
  if (enabled.peng) actions.push({ key: 'peng', label: '碰' });
  if (enabled.gang) actions.push({ key: 'gang', label: '杠' });
  if (enabled.hu) actions.push({ key: 'hu', label: '胡' });
  (enabled.gangTiles || []).forEach((tile) => actions.push({ key: `gang:${tile}`, label: '暗杠', tile }));
  if (state && state.phase === 'round-over') actions.push({ key: 'restart', label: '重开' });

  const buttonW = isLandscape ? 64 : 70;
  const buttonH = 36;
  const gap = 8;
  const totalW = actions.length * buttonW + Math.max(0, actions.length - 1) * gap;
  const startX = Math.max(12, ((width || 375) - totalW) / 2);
  const y = isLandscape ? Math.max(58, handY - buttonH - 8) : Math.max(54, handY - buttonH - 12);
  return actions.map((action, index) =>
    Object.assign(action, {
      x: startX + index * (buttonW + gap),
      y,
      width: buttonW,
      height: buttonH,
    }),
  );
}

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
    this.drawPlayers(ctx, state, x, y, width, height, metrics, spriteAsset);
    this.drawDiscards(ctx, state, x, y, width, height, metrics, spriteAsset);
    this.drawMelds(ctx, state, x, y, width, height, metrics, spriteAsset);
    this.drawHand(ctx, state, width, height, spriteAsset);
  }

  getSpriteAsset() {
    if (!this.spriteAsset && this.assets) {
      this.spriteAsset = this.assets.image(TILE_SPRITE.src);
      this.spriteAsset.promise.then(() => this.invalidatePaint()).catch(() => this.invalidatePaint());
    }
    return this.spriteAsset;
  }

  drawHeader(ctx, state, x, y, width, metrics, spriteAsset) {
    const titleY = metrics.isLandscape ? 20 : 22;
    const messageY = metrics.isLandscape ? 42 : 54;
    drawText(ctx, '红中麻将', x + 18, y + titleY, 18, '#f9f2dc', 'left');
    drawText(ctx, `牌墙 ${state.wallCount}`, x + width - 18, y + titleY, 14, '#dce8de', 'right');
    drawText(ctx, state.message, x + width / 2, y + messageY, 14, '#fff4c5');
    if (state.lastDiscard) {
      const lastY = metrics.isLandscape ? metrics.tableTop + 8 : 65;
      drawText(
        ctx,
        `上张：${state.players[state.lastDiscard.from].name}`,
        x + metrics.centerX - 34,
        y + lastY + 17,
        12,
        '#dce8de',
      );
      drawMiniTile(ctx, state.lastDiscard.tile, x + metrics.centerX + 30, y + lastY, spriteAsset, true);
    }
    if (state.bird) {
      const birdY = metrics.isLandscape ? 34 : 58;
      drawText(ctx, '鸟', x + width - 54, y + birdY + 16, 12, '#f9f2dc');
      drawMiniTile(ctx, state.bird, x + width - 42, y + birdY, spriteAsset);
    }
  }

  drawPlayers(ctx, state, x, y, width, height, metrics, spriteAsset) {
    state.players.forEach((player, index) => {
      const pos = PLAYER_POS[index];
      const active = state.currentPlayer === index && state.phase !== 'round-over';
      const color = active ? '#ffd86b' : '#dce8de';
      if (pos === 'bottom') {
        drawText(ctx, player.name, x + metrics.handX - 34, y + metrics.handY + metrics.tileH / 2, 13, color);
      } else if (pos === 'top') {
        drawText(ctx, player.name, x + width / 2, y + metrics.tableTop - 16, 13, color);
        this.drawBackRow(ctx, player.handCount, x + width / 2 - 118, y + metrics.tableTop + 4, 15, 22, 3, spriteAsset);
      } else if (pos === 'left') {
        drawText(ctx, player.name, x + metrics.tableLeft - 50, y + metrics.centerY - 76, 13, color);
        this.drawBackColumn(
          ctx,
          player.handCount,
          x + metrics.tableLeft - 62,
          y + metrics.centerY - 50,
          15,
          22,
          2,
          spriteAsset,
        );
      } else if (pos === 'right') {
        drawText(ctx, player.name, x + metrics.tableRight + 50, y + metrics.centerY - 76, 13, color);
        this.drawBackColumn(
          ctx,
          player.handCount,
          x + metrics.tableRight + 47,
          y + metrics.centerY - 50,
          15,
          22,
          2,
          spriteAsset,
        );
      }
    });
  }

  drawBackRow(ctx, count, x, y, width, height, gap, spriteAsset) {
    for (let i = 0; i < Math.min(count, 14); i++) drawBack(ctx, x + i * (width + gap), y, width, height, spriteAsset);
  }

  drawBackColumn(ctx, count, x, y, width, height, gap, spriteAsset) {
    for (let i = 0; i < Math.min(count, 14); i++)
      drawBack(ctx, x, y + i * (height * 0.38 + gap), width, height, spriteAsset);
  }

  drawDiscards(ctx, state, x, y, width, height, metrics, spriteAsset) {
    const centerX = x + metrics.centerX;
    const centerY = y + metrics.centerY;
    state.players.forEach((player, index) => {
      const tiles = player.discards.slice(metrics.isLandscape ? -24 : -18);
      const cols = metrics.isLandscape ? 8 : 6;
      const startX = centerX - cols * 13;
      const startY = centerY - 42;
      const isLastFrom = state.lastDiscard && state.lastDiscard.from === index;
      const lastTileIdx = tiles.length - 1;
      tiles.forEach((tile, tileIndex) => {
        let tx = startX + (tileIndex % cols) * 26;
        let ty = startY + Math.floor(tileIndex / cols) * 36;
        if (index === 1) tx += metrics.isLandscape ? 166 : 128;
        if (index === 2) ty -= metrics.isLandscape ? 76 : 88;
        if (index === 3) tx -= metrics.isLandscape ? 166 : 128;
        drawMiniTile(ctx, tile, tx, ty, spriteAsset, isLastFrom && tileIndex === lastTileIdx);
      });
    });
  }

  drawMelds(ctx, state, x, y, width, height, metrics, spriteAsset) {
    const userMelds = state.players[0].melds;
    let mx = metrics.isLandscape ? 18 : 12;
    const my = metrics.handY - 40;
    userMelds.forEach((meld) => {
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
