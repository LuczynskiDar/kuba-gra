import type { ShipDef, Orientation, BoardGrid } from '../types/statki'

export const FLEET_TEMPLATE: Pick<ShipDef, 'id' | 'name' | 'size'>[] = [
  { id: 's4-1', name: 'Pancernik',   size: 4 },
  { id: 's3-1', name: 'Krążownik',   size: 3 },
  { id: 's3-2', name: 'Krążownik',   size: 3 },
  { id: 's2-1', name: 'Niszczyciel', size: 2 },
  { id: 's2-2', name: 'Niszczyciel', size: 2 },
  { id: 's2-3', name: 'Niszczyciel', size: 2 },
  { id: 's1-1', name: 'Łódź',        size: 1 },
  { id: 's1-2', name: 'Łódź',        size: 1 },
  { id: 's1-3', name: 'Łódź',        size: 1 },
  { id: 's1-4', name: 'Łódź',        size: 1 },
]

export function makeInitialFleet(): ShipDef[] {
  return FLEET_TEMPLATE.map(s => ({
    ...s,
    orientation: 'horizontal' as Orientation,
    placed: false,
    startRow: null,
    startCol: null,
  }))
}

export function createEmptyBoard(): BoardGrid {
  return Array.from({ length: 10 }, () => Array(10).fill(null))
}

export function getShipCells(
  startRow: number,
  startCol: number,
  size: number,
  orientation: Orientation
): [number, number][] {
  return Array.from({ length: size }, (_, i) =>
    orientation === 'horizontal'
      ? [startRow, startCol + i]
      : [startRow + i, startCol]
  ) as [number, number][]
}

export function canPlace(
  board: BoardGrid,
  shipId: string,
  startRow: number,
  startCol: number,
  size: number,
  orientation: Orientation
): boolean {
  const cells = getShipCells(startRow, startCol, size, orientation)
  for (const [row, col] of cells) {
    if (row < 0 || row > 9 || col < 0 || col > 9) return false
    if (board[row][col] !== null && board[row][col] !== shipId) return false
  }
  for (const [row, col] of cells) {
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue
        const r = row + dr, c = col + dc
        if (r < 0 || r > 9 || c < 0 || c > 9) continue
        if (board[r][c] !== null && board[r][c] !== shipId) return false
      }
    }
  }
  return true
}

export function randomPlaceFleet(fleet: ShipDef[]): { fleet: ShipDef[]; board: BoardGrid } {
  const board = createEmptyBoard()
  const result: ShipDef[] = fleet.map(s => ({ ...s, placed: false, startRow: null, startCol: null }))
  for (const ship of result) {
    let placed = false
    let attempts = 0
    while (!placed && attempts < 1000) {
      attempts++
      const orientation: Orientation = Math.random() < 0.5 ? 'horizontal' : 'vertical'
      const maxRow = orientation === 'horizontal' ? 9 : 10 - ship.size
      const maxCol = orientation === 'horizontal' ? 10 - ship.size : 9
      const startRow = Math.floor(Math.random() * (maxRow + 1))
      const startCol = Math.floor(Math.random() * (maxCol + 1))
      if (canPlace(board, ship.id, startRow, startCol, ship.size, orientation)) {
        getShipCells(startRow, startCol, ship.size, orientation).forEach(([r, c]) => { board[r][c] = ship.id })
        ship.orientation = orientation
        ship.startRow = startRow
        ship.startCol = startCol
        ship.placed = true
        placed = true
      }
    }
  }
  return { fleet: result, board }
}
