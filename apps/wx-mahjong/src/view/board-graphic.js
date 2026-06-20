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
const MINI_TILE_W = 24;
const MINI_TILE_H = 34;
const DISCARD_STEP_X = 26;
const DISCARD_STEP_Y = 36;
const MELD_TILE_W = 20;
const MELD_TILE_H = 28;
const MELD_STEP_X = 22;
const MELD_GAP = 8;

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function getActionItems(state) {
  const actions = [];
  const enabled = state && state.actions ? state.actions : {};
  if (enabled.ready) actions.push({ key: 'ready', label: '准备' });
  if (enabled.leave) actions.push({ key: 'leave', label: '退出' });
  if (enabled.pass) actions.push({ key: 'pass', label: '过' });
  if (enabled.peng) actions.push({ key: 'peng', label: '碰' });
  if (enabled.gang) actions.push({ key: 'gang', label: '杠' });
  if (enabled.hu) actions.push({ key: 'hu', label: '胡' });
  (enabled.gangTiles || []).forEach((tile) => actions.push({ key: `gang:${tile}`, label: '暗杠', tile }));
  if (state && state.phase === 'round-over') actions.push({ key: 'restart', label: '重开' });
  return actions;
}

function getBoardMetrics(width, height) {
  const safeWidth = width || 375;
  const safeHeight = height || 667;
  const isLandscape = safeWidth > safeHeight;
  const edgePad = isLandscape ? 18 : 8;
  const bottomPad = isLandscape ? 10 : 18;
  const gap = isLandscape ? 4 : safeWidth < 360 ? 2 : 3;
  const maxTileW = isLandscape ? 40 : 42;
  const minTileW = isLandscape ? 26 : 18;
  const drawnGap = isLandscape ? 16 : safeWidth < 360 ? 8 : 10;
  const availableHandW = Math.max(260, safeWidth - edgePad * 2);
  const tileW = Math.floor(clamp((availableHandW - drawnGap - gap * 13) / 14, minTileW, maxTileW));
  const tileH = Math.round(tileW * 1.42);
  const handWidth = tileW * 14 + gap * 13 + drawnGap;
  const handX = Math.max(edgePad, (safeWidth - handWidth) / 2);
  const handY = safeHeight - tileH - bottomPad;
  const sideRail = isLandscape ? clamp(safeWidth * 0.12, 80, 124) : clamp(safeWidth * 0.12, 36, 52);
  const tableLeft = sideRail;
  const tableRight = safeWidth - sideRail;
  const tableTop = isLandscape ? 54 : 112;
  const meldY = handY - (isLandscape ? 38 : 42);
  const tableBottom = Math.max(tableTop + 120, meldY - (isLandscape ? 12 : 18));
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
    meldY,
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

function drawText(ctx, text, x, y, size, color, align = 'center', maxWidth = null) {
  ctx.fillStyle = color;
  ctx.font = `${size}px Arial`;
  ctx.textAlign = align;
  ctx.textBaseline = 'middle';
  if (maxWidth) ctx.fillText(text, x, y, maxWidth);
  else ctx.fillText(text, x, y);
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

function drawMiniTile(ctx, tile, x, y, asset, highlighted = false) {
  drawTile(ctx, tile, x, y, MINI_TILE_W, MINI_TILE_H, asset, false, highlighted);
}

function drawMeldTile(ctx, tile, x, y, asset) {
  drawTile(ctx, tile, x, y, MELD_TILE_W, MELD_TILE_H, asset);
}

function getMeldWidth(meld) {
  return Math.max(0, (meld.tiles.length - 1) * MELD_STEP_X + MELD_TILE_W);
}

function getMeldRows(melds, maxWidth) {
  const rows = [];
  let row = [];
  let rowWidth = 0;
  melds.forEach((meld) => {
    const meldWidth = getMeldWidth(meld);
    const nextWidth = row.length ? rowWidth + MELD_GAP + meldWidth : meldWidth;
    if (row.length && nextWidth > maxWidth) {
      rows.push({ melds: row, width: rowWidth });
      row = [];
      rowWidth = 0;
    }
    row.push(meld);
    rowWidth = rowWidth ? rowWidth + MELD_GAP + meldWidth : meldWidth;
  });
  if (row.length) rows.push({ melds: row, width: rowWidth });
  return rows;
}

function drawMeldRows(ctx, melds, x, y, maxWidth, asset, align = 'left') {
  const rows = getMeldRows(melds, maxWidth);
  rows.forEach((row, rowIndex) => {
    let tx = align === 'right' ? x + maxWidth - row.width : x;
    const ty = y + rowIndex * (MELD_TILE_H + 4);
    row.melds.forEach((meld) => {
      meld.tiles.forEach((tile, tileIndex) => {
        drawMeldTile(ctx, tile, tx + tileIndex * MELD_STEP_X, ty, asset);
      });
      tx += getMeldWidth(meld) + MELD_GAP;
    });
  });
}

function rowsInRange(top, bottom) {
  return Math.max(1, Math.floor((bottom - top - MINI_TILE_H) / DISCARD_STEP_Y) + 1);
}

function getSideMeldMaxWidth(width, metrics) {
  return metrics.isLandscape ? 190 : Math.max(82, Math.min(128, width * 0.34));
}

function getDiscardLayout(index, width, metrics, melds = []) {
  const topMeldRows = getMeldRows(melds, width - 24).length;
  const sideMeldRows = getMeldRows(melds, getSideMeldMaxWidth(width, metrics)).length;
  const topStartY = Math.max(
    metrics.tableTop + (metrics.isLandscape ? 64 : 86),
    metrics.tableTop + 6 + topMeldRows * (MELD_TILE_H + 4) + 8,
  );
  const topEndY = metrics.centerY - 8;
  const bottomStartY = metrics.centerY + 8;
  const bottomEndY = metrics.tableBottom;
  const verticalStartY = Math.max(
    topStartY,
    metrics.tableTop + 40 + sideMeldRows * (MELD_TILE_H + 4) + 8,
  );
  const verticalEndY = metrics.tableBottom;

  if (index === 0 || index === 2) {
    const cols = metrics.isLandscape ? 8 : 5;
    const y = index === 2 ? topStartY : bottomStartY;
    const rows = rowsInRange(y, index === 2 ? topEndY : bottomEndY);
    return {
      cols,
      capacity: cols * rows,
      x: metrics.centerX - (cols * DISCARD_STEP_X - 2) / 2,
      y,
    };
  }

  const cols = metrics.isLandscape ? 5 : 2;
  const rows = Math.min(metrics.isLandscape ? 4 : 8, rowsInRange(verticalStartY, verticalEndY));
  const gridW = cols * DISCARD_STEP_X - 2;
  const gridH = rows * DISCARD_STEP_Y - 2;
  return {
    cols,
    capacity: cols * rows,
    x: index === 1 ? width - metrics.tableLeft - gridW : metrics.tableLeft,
    y: clamp(metrics.centerY - gridH / 2, verticalStartY, verticalEndY - MINI_TILE_H),
  };
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
  const { handY, isLandscape, meldY, tableTop } = getBoardMetrics(width, height);
  const actions = getActionItems(state);
  if (!actions.length) return [];

  const safeWidth = width || 375;
  const gap = isLandscape ? 8 : safeWidth < 360 ? 5 : 7;
  const maxButtonW = isLandscape ? 64 : 70;
  const buttonH = isLandscape ? 34 : 36;
  const availableW = Math.max(180, safeWidth - 24);
  const buttonW = Math.floor(
    clamp((availableW - Math.max(0, actions.length - 1) * gap) / actions.length, 40, maxButtonW),
  );
  const totalW = actions.length * buttonW + Math.max(0, actions.length - 1) * gap;
  const startX = Math.max(12, (safeWidth - totalW) / 2);
  const preferredY = Math.min(handY - buttonH - 10, meldY - buttonH - 8);
  const y = Math.max(tableTop + 8, preferredY);
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
    this.drawMelds(ctx, state, x, y, width, height, metrics, spriteAsset);
    this.drawPlayers(ctx, state, x, y, width, height, metrics);
    this.drawDiscards(ctx, state, x, y, width, height, metrics, spriteAsset);
    this.drawStatus(ctx, state, x, y, width, metrics, spriteAsset);
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
      const readyText =
        state.roomStatus === 'waiting' || state.roomStatus === 'settling'
          ? ` ${player.isReady ? '已准备' : '未准备'}`
          : '';
      if (pos === 'bottom') {
        drawText(
          ctx,
          `${player.name}${readyText}`,
          x + Math.max(18, metrics.handX - 18),
          y + metrics.handY + metrics.tileH / 2,
          13,
          color,
        );
      } else if (pos === 'top') {
        drawText(ctx, `${player.name}${readyText} ${player.handCount}张`, x + width / 2, y + metrics.tableTop - 16, 13, color);
      } else if (pos === 'left') {
        const nameX = metrics.isLandscape ? metrics.tableLeft - 50 : 20;
        drawText(ctx, `${player.name}${readyText} ${player.handCount}张`, x + nameX, y + metrics.centerY - 76, 13, color);
      } else if (pos === 'right') {
        const nameX = metrics.isLandscape ? metrics.tableRight + 50 : width - 20;
        drawText(ctx, `${player.name}${readyText} ${player.handCount}张`, x + nameX, y + metrics.centerY - 76, 13, color);
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
    drawMeldRows(ctx, state.players[1].melds, x + width - 12 - sideMaxWidth, y + metrics.tableTop + 40, sideMaxWidth, spriteAsset, 'right');

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
