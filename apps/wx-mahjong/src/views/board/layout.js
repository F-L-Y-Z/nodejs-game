import { clamp, DISCARD_STEP_X, DISCARD_STEP_Y, getMeldRows, MELD_TILE_H, MINI_TILE_H } from './renderers.js';

// --- Action items ---

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

// --- Board metrics ---

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

// --- Discard / meld layout helpers ---

function rowsInRange(top, bottom) {
  return Math.max(1, Math.floor((bottom - top - MINI_TILE_H) / DISCARD_STEP_Y) + 1);
}

export function getSideMeldMaxWidth(width, metrics) {
  return metrics.isLandscape ? 190 : Math.max(82, Math.min(128, width * 0.34));
}

export function getDiscardLayout(index, width, metrics, melds = []) {
  const topMeldRows = getMeldRows(melds, width - 24).length;
  const sideMeldRows = getMeldRows(melds, getSideMeldMaxWidth(width, metrics)).length;
  const topStartY = Math.max(metrics.tableTop + (metrics.isLandscape ? 64 : 86), metrics.tableTop + 6 + topMeldRows * (MELD_TILE_H + 4) + 8);
  const topEndY = metrics.centerY - 8;
  const bottomStartY = metrics.centerY + 8;
  const bottomEndY = metrics.tableBottom;
  const verticalStartY = Math.max(topStartY, metrics.tableTop + 40 + sideMeldRows * (MELD_TILE_H + 4) + 8);
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

// --- Public API ---

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
  const buttonW = Math.floor(clamp((availableW - Math.max(0, actions.length - 1) * gap) / actions.length, 40, maxButtonW));
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

// Re-export getBoardMetrics for internal use by BoardGraphic
export { getBoardMetrics };
