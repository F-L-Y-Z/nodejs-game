const SUITS = [
  { key: 'W', name: '万', color: '#c0392b' },
  { key: 'B', name: '筒', color: '#1f7a4d' },
  { key: 'T', name: '条', color: '#2563a8' },
];

const ZHONG = 'ZH';

function createTileTypes() {
  const types = [];
  SUITS.forEach((suit) => {
    for (let rank = 1; rank <= 9; rank++) {
      types.push(`${suit.key}${rank}`);
    }
  });
  types.push(ZHONG);
  return types;
}

const TILE_TYPES = createTileTypes();

function createDeck() {
  const deck = [];
  TILE_TYPES.forEach((tile) => {
    for (let i = 0; i < 4; i++) deck.push(tile);
  });
  return deck;
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const t = arr[i];
    arr[i] = arr[j];
    arr[j] = t;
  }
  return arr;
}

function tileSuit(tile) {
  if (tile === ZHONG) return null;
  return tile[0];
}

function tileRank(tile) {
  if (tile === ZHONG) return 0;
  return parseInt(tile.slice(1), 10);
}

function tileInfo(tile) {
  if (tile === ZHONG) {
    return { label: '中', subLabel: '红', color: '#d71920', suit: null, rank: 0 };
  }
  const suit = SUITS.find((item) => item.key === tileSuit(tile));
  const rank = tileRank(tile);
  return {
    label: `${rank}`,
    subLabel: suit.name,
    color: suit.color,
    suit: suit.key,
    rank,
  };
}

function tileOrder(tile) {
  if (tile === ZHONG) return 99;
  const suitIndex = SUITS.findIndex((suit) => suit.key === tileSuit(tile));
  return suitIndex * 10 + tileRank(tile);
}

function sortTiles(tiles) {
  return tiles.slice().sort((a, b) => tileOrder(a) - tileOrder(b));
}

function countTiles(tiles) {
  return tiles.reduce((map, tile) => {
    map[tile] = (map[tile] || 0) + 1;
    return map;
  }, {});
}

function removeTiles(hand, tile, count) {
  let removed = 0;
  for (let i = hand.length - 1; i >= 0 && removed < count; i--) {
    if (hand[i] === tile) {
      hand.splice(i, 1);
      removed++;
    }
  }
  return removed === count;
}

export {
  countTiles,
  createDeck,
  removeTiles,
  shuffle,
  sortTiles,
  TILE_TYPES,
  tileInfo,
  tileOrder,
  tileRank,
  tileSuit,
  ZHONG,
};
