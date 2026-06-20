const SUITS = [
  { key: 'W', name: '万', color: '#c0392b' },
  { key: 'B', name: '筒', color: '#1f7a4d' },
  { key: 'T', name: '条', color: '#2563a8' },
]

const ZHONG = 'ZH'

function tileSuit(tile) {
  if (tile === ZHONG) return null
  return tile[0]
}

function tileRank(tile) {
  if (tile === ZHONG) return 0
  return parseInt(tile.slice(1), 10)
}

export function tileInfo(tile) {
  if (tile === ZHONG) {
    return { label: '中', subLabel: '红', color: '#d71920', suit: null, rank: 0 }
  }
  const suit = SUITS.find((item) => item.key === tileSuit(tile)) || SUITS[0]
  const rank = tileRank(tile)
  return {
    label: `${rank}`,
    subLabel: suit.name,
    color: suit.color,
    suit: suit.key,
    rank,
  }
}
