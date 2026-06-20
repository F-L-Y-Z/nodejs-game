const SUITS = [
  { key: 'W', name: '万' },
  { key: 'B', name: '筒' },
  { key: 'T', name: '条' },
] as const;

export const ZHONG = 'ZH';

export function createTileTypes(): string[] {
  const types: string[] = [];
  SUITS.forEach((suit) => {
    for (let rank = 1; rank <= 9; rank++) {
      types.push(`${suit.key}${rank}`);
    }
  });
  types.push(ZHONG);
  return types;
}

export const TILE_TYPES = createTileTypes();

export function createDeck(): string[] {
  const deck: string[] = [];
  TILE_TYPES.forEach((tile) => {
    for (let i = 0; i < 4; i++) deck.push(tile);
  });
  return deck;
}

export function shuffle<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const t = arr[i];
    arr[i] = arr[j];
    arr[j] = t;
  }
  return arr;
}

export function tileSuit(tile: string): string | null {
  if (tile === ZHONG) return null;
  return tile[0] ?? null;
}

export function tileRank(tile: string): number {
  if (tile === ZHONG) return 0;
  return parseInt(tile.slice(1), 10);
}

export function tileOrder(tile: string): number {
  if (tile === ZHONG) return 99;
  const suitIndex = SUITS.findIndex((suit) => suit.key === tileSuit(tile));
  return suitIndex * 10 + tileRank(tile);
}

export function sortTiles(tiles: string[]): string[] {
  return tiles.slice().sort((a, b) => tileOrder(a) - tileOrder(b));
}

export function countTiles(tiles: string[]): Record<string, number> {
  return tiles.reduce<Record<string, number>>((map, tile) => {
    map[tile] = (map[tile] || 0) + 1;
    return map;
  }, {});
}

export function removeTiles(hand: string[], tile: string, count: number): boolean {
  let removed = 0;
  for (let i = hand.length - 1; i >= 0 && removed < count; i--) {
    if (hand[i] === tile) {
      hand.splice(i, 1);
      removed++;
    }
  }
  return removed === count;
}
