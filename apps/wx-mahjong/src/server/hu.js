import { TILE_TYPES, ZHONG, countTiles, tileRank, tileSuit } from './tiles.js';

const NORMAL_TYPES = TILE_TYPES.filter((tile) => tile !== ZHONG);

function cloneCounts(counts) {
  return Object.assign({}, counts);
}

function countTotal(counts) {
  return NORMAL_TYPES.reduce((sum, tile) => sum + (counts[tile] || 0), 0);
}

function firstTile(counts) {
  return NORMAL_TYPES.find((tile) => (counts[tile] || 0) > 0);
}

function keyOf(counts, wildcards, groupsLeft) {
  const body = NORMAL_TYPES.map((tile) => counts[tile] || 0).join('');
  return `${body}|${wildcards}|${groupsLeft}`;
}

function consume(counts, tile, amount) {
  const available = counts[tile] || 0;
  const used = Math.min(available, amount);
  counts[tile] = available - used;
  return amount - used;
}

function canMakeGroups(counts, wildcards, groupsLeft, memo) {
  if (groupsLeft === 0) return countTotal(counts) === 0;

  const memoKey = keyOf(counts, wildcards, groupsLeft);
  if (memo[memoKey] !== undefined) return memo[memoKey];

  const tile = firstTile(counts);
  if (!tile) return (memo[memoKey] = wildcards >= groupsLeft * 3);

  let next = cloneCounts(counts);
  let need = consume(next, tile, 3);
  if (need <= wildcards && canMakeGroups(next, wildcards - need, groupsLeft - 1, memo)) {
    return (memo[memoKey] = true);
  }

  const suit = tileSuit(tile);
  const rank = tileRank(tile);
  if (rank <= 7) {
    const seq = [`${suit}${rank}`, `${suit}${rank + 1}`, `${suit}${rank + 2}`];
    next = cloneCounts(counts);
    need = 0;
    seq.forEach((item) => {
      need += consume(next, item, 1);
    });
    if (need <= wildcards && canMakeGroups(next, wildcards - need, groupsLeft - 1, memo)) {
      return (memo[memoKey] = true);
    }
  }

  return (memo[memoKey] = false);
}

function canHuWithMelds(hand, meldCount = 0) {
  const groupsLeft = 4 - meldCount;
  if (groupsLeft < 0) return false;
  if (hand.length !== groupsLeft * 3 + 2) return false;

  const counts = countTiles(hand);
  const wildcards = counts[ZHONG] || 0;
  delete counts[ZHONG];

  for (const pairTile of NORMAL_TYPES) {
    const pairCounts = cloneCounts(counts);
    const need = consume(pairCounts, pairTile, 2);
    if (need <= wildcards && canMakeGroups(pairCounts, wildcards - need, groupsLeft, {})) {
      return true;
    }
  }

  if (wildcards >= 2 && canMakeGroups(cloneCounts(counts), wildcards - 2, groupsLeft, {})) {
    return true;
  }

  return false;
}

export { canHuWithMelds };
