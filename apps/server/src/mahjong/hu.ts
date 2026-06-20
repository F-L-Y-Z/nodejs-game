import { TILE_TYPES, ZHONG, countTiles, tileRank, tileSuit } from './tiles.js';

const NORMAL_TYPES = TILE_TYPES.filter((tile) => tile !== ZHONG);

function cloneCounts(counts: Record<string, number>): Record<string, number> {
  return { ...counts };
}

function countTotal(counts: Record<string, number>): number {
  return NORMAL_TYPES.reduce((sum, tile) => sum + (counts[tile] || 0), 0);
}

function firstTile(counts: Record<string, number>): string | undefined {
  return NORMAL_TYPES.find((tile) => (counts[tile] || 0) > 0);
}

function keyOf(counts: Record<string, number>, wildcards: number, groupsLeft: number): string {
  const body = NORMAL_TYPES.map((tile) => counts[tile] || 0).join('');
  return `${body}|${wildcards}|${groupsLeft}`;
}

function consume(counts: Record<string, number>, tile: string, amount: number): number {
  const available = counts[tile] || 0;
  const used = Math.min(available, amount);
  counts[tile] = available - used;
  return amount - used;
}

function canMakeGroups(
  counts: Record<string, number>,
  wildcards: number,
  groupsLeft: number,
  memo: Record<string, boolean>,
): boolean {
  if (groupsLeft === 0) return countTotal(counts) === 0;

  const memoKey = keyOf(counts, wildcards, groupsLeft);
  if (memo[memoKey] !== undefined) return memo[memoKey];

  const tile = firstTile(counts);
  if (!tile) {
    memo[memoKey] = wildcards >= groupsLeft * 3;
    return memo[memoKey];
  }

  let next = cloneCounts(counts);
  let need = consume(next, tile, 3);
  if (need <= wildcards && canMakeGroups(next, wildcards - need, groupsLeft - 1, memo)) {
    memo[memoKey] = true;
    return true;
  }

  const suit = tileSuit(tile);
  const rank = tileRank(tile);
  if (suit && rank <= 7) {
    const seq = [`${suit}${rank}`, `${suit}${rank + 1}`, `${suit}${rank + 2}`];
    next = cloneCounts(counts);
    need = 0;
    seq.forEach((item) => {
      need += consume(next, item, 1);
    });
    if (need <= wildcards && canMakeGroups(next, wildcards - need, groupsLeft - 1, memo)) {
      memo[memoKey] = true;
      return true;
    }
  }

  memo[memoKey] = false;
  return false;
}

export function canHuWithMelds(hand: string[], meldCount = 0): boolean {
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

  return wildcards >= 2 && canMakeGroups(cloneCounts(counts), wildcards - 2, groupsLeft, {});
}
