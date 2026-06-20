import { tileInfo } from '../../mahjong/tiles.js';

// --- Sprite & layout constants ---

export const PLAYER_POS = ['bottom', 'right', 'top', 'left'];

export const TILE_SPRITE = {
  src: 'images/sprite.png',
  x: 30,
  y: 33,
  width: 94,
  height: 122,
  gapX: 18,
  gapY: 25,
};

export const MINI_TILE_W = 24;
export const MINI_TILE_H = 34;
export const DISCARD_STEP_X = 26;
export const DISCARD_STEP_Y = 36;
export const MELD_TILE_W = 20;
export const MELD_TILE_H = 28;
export const MELD_STEP_X = 22;
export const MELD_GAP = 8;

// --- Math helpers ---

export function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

export function getRemainingSeconds(deadlineAt) {
  return Math.max(0, Math.ceil((deadlineAt - Date.now()) / 1000));
}

// --- Drawing primitives ---

export function drawRoundRect(ctx, x, y, width, height, radius) {
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

export function drawText(ctx, text, x, y, size, color, align = 'center', maxWidth = null) {
  ctx.fillStyle = color;
  ctx.font = `${size}px Arial`;
  ctx.textAlign = align;
  ctx.textBaseline = 'middle';
  if (maxWidth) ctx.fillText(text, x, y, maxWidth);
  else ctx.fillText(text, x, y);
}

// --- Sprite & tile helpers ---

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

export function drawTile(ctx, tile, x, y, width, height, asset, selected = false, highlighted = false) {
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

export function drawMiniTile(ctx, tile, x, y, asset, highlighted = false) {
  drawTile(ctx, tile, x, y, MINI_TILE_W, MINI_TILE_H, asset, false, highlighted);
}

export function drawMeldTile(ctx, tile, x, y, asset) {
  drawTile(ctx, tile, x, y, MELD_TILE_W, MELD_TILE_H, asset);
}

// --- Meld helpers ---

export function getMeldWidth(meld) {
  return Math.max(0, (meld.tiles.length - 1) * MELD_STEP_X + MELD_TILE_W);
}

export function getMeldRows(melds, maxWidth) {
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

export function drawMeldRows(ctx, melds, x, y, maxWidth, asset, align = 'left') {
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
