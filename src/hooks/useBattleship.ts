import { useState, useRef, useEffect, useCallback } from 'react'
import type { ShipDef, BoardGrid, Difficulty } from '../types/statki'
import { getShipCells, makeInitialFleet, randomPlaceFleet } from '../utils/battleshipUtils'

export type ShotState = 'none' | 'miss' | 'hit' | 'sunk' | 'border'
export type ShotGrid = ShotState[][]

export interface LastShot {
  row: number
  col: number
  result: 'miss' | 'hit' | 'sunk'
}

export interface BattleshipState {
  playerBoard: BoardGrid
  computerBoard: BoardGrid
  playerShots: ShotGrid
  computerShots: ShotGrid
  playerFleet: ShipDef[]
  computerFleet: ShipDef[]
  turn: 'player' | 'computer'
  status: 'playing' | 'player-won' | 'computer-won'
  lastPlayerShot: LastShot | null
  lastComputerShot: LastShot | null
}

interface AiState {
  mode: 'hunt' | 'target'
  targets: [number, number][]
  pendingHits: [number, number][]
}

function createEmptyShotGrid(): ShotGrid {
  return Array.from({ length: 10 }, () => Array(10).fill('none'))
}

function processShot(
  targetBoard: BoardGrid,
  fleet: ShipDef[],
  shotsGrid: ShotGrid,
  row: number,
  col: number
): { newShots: ShotGrid; result: 'miss' | 'hit' | 'sunk' } {
  const shipId = targetBoard[row][col]
  const newShots = shotsGrid.map(r => [...r]) as ShotGrid

  if (!shipId) {
    newShots[row][col] = 'miss'
    return { newShots, result: 'miss' }
  }

  newShots[row][col] = 'hit'
  const ship = fleet.find(s => s.id === shipId)
  if (ship && ship.startRow !== null && ship.startCol !== null) {
    const cells = getShipCells(ship.startRow, ship.startCol, ship.size, ship.orientation)
    if (cells.every(([r, c]) => newShots[r][c] === 'hit')) {
      cells.forEach(([r, c]) => { newShots[r][c] = 'sunk' })
      // Mark surrounding border zone — ships can't be adjacent
      for (const [r, c] of cells) {
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            const nr = r + dr, nc = c + dc
            if (nr >= 0 && nr <= 9 && nc >= 0 && nc <= 9 && newShots[nr][nc] === 'none') {
              newShots[nr][nc] = 'border'
            }
          }
        }
      }
      return { newShots, result: 'sunk' }
    }
  }
  return { newShots, result: 'hit' }
}

function isAllSunk(fleet: ShipDef[], shots: ShotGrid): boolean {
  return fleet.every(ship => {
    if (ship.startRow === null || ship.startCol === null) return true
    return getShipCells(ship.startRow, ship.startCol, ship.size, ship.orientation)
      .every(([r, c]) => shots[r][c] === 'sunk')
  })
}

function countSunk(fleet: ShipDef[], shots: ShotGrid): number {
  return fleet.filter(ship => {
    if (ship.startRow === null || ship.startCol === null) return false
    return getShipCells(ship.startRow, ship.startCol, ship.size, ship.orientation)
      .every(([r, c]) => shots[r][c] === 'sunk')
  }).length
}

function getAiShot(shotsGrid: ShotGrid, fleet: ShipDef[], difficulty: Difficulty, aiState: AiState): [number, number] {
  const unshot: [number, number][] = []
  for (let r = 0; r < 10; r++)
    for (let c = 0; c < 10; c++)
      if (shotsGrid[r][c] === 'none') unshot.push([r, c])

  if (difficulty === 'easy') {
    return unshot[Math.floor(Math.random() * unshot.length)]
  }

  // medium + hard: use target queue first
  if (aiState.mode === 'target') {
    const validTargets = aiState.targets.filter(([r, c]) => shotsGrid[r][c] === 'none')
    if (validTargets.length > 0) return validTargets[0]
  }

  // Hunt mode
  if (difficulty === 'hard') {
    const sunkIds = new Set(
      fleet.filter(s => s.startRow !== null && s.startCol !== null &&
        getShipCells(s.startRow!, s.startCol!, s.size, s.orientation)
          .every(([r, c]) => shotsGrid[r][c] === 'sunk')
      ).map(s => s.id)
    )
    const remaining = fleet.filter(s => !sunkIds.has(s.id))
    const minSize = remaining.length > 0 ? Math.min(...remaining.map(s => s.size)) : 1
    if (minSize >= 2) {
      const checkerboard = unshot.filter(([r, c]) => (r + c) % 2 === 0)
      if (checkerboard.length > 0)
        return checkerboard[Math.floor(Math.random() * checkerboard.length)]
    }
  }

  return unshot[Math.floor(Math.random() * unshot.length)]
}

function updateAiState(aiState: AiState, newShots: ShotGrid, row: number, col: number, result: 'miss' | 'hit' | 'sunk'): AiState {
  if (result === 'sunk') {
    return { mode: 'hunt', targets: [], pendingHits: [] }
  }

  if (result === 'miss') {
    return { ...aiState, targets: aiState.targets.filter(([r, c]) => !(r === row && c === col)) }
  }

  // Hit — add unshot adjacent cells to target queue
  const pendingHits: [number, number][] = [...aiState.pendingHits, [row, col]]
  const adjacent: [number, number][] = (
    [[row - 1, col], [row + 1, col], [row, col - 1], [row, col + 1]] as [number, number][]
  ).filter(([r, c]) => r >= 0 && r <= 9 && c >= 0 && c <= 9 && newShots[r][c] === 'none')

  // Prioritize direction if we have multiple hits in line
  let prioritized = adjacent
  if (pendingHits.length >= 2) {
    const rows = pendingHits.map(([r]) => r)
    const cols = pendingHits.map(([, c]) => c)
    const allSameRow = rows.every(r => r === rows[0])
    const allSameCol = cols.every(c => c === cols[0])
    if (allSameRow) prioritized = adjacent.filter(([r]) => r === rows[0])
    else if (allSameCol) prioritized = adjacent.filter(([, c]) => c === cols[0])
  }

  const existing = aiState.targets.filter(([r, c]) =>
    newShots[r][c] === 'none' && !prioritized.some(([pr, pc]) => pr === r && pc === c)
  )

  return { mode: 'target', targets: [...prioritized, ...existing], pendingHits }
}

export function useBattleship(initPlayerBoard: BoardGrid, initPlayerFleet: ShipDef[], difficulty: Difficulty) {
  const [state, setState] = useState<BattleshipState>(() => {
    const { fleet: computerFleet, board: computerBoard } = randomPlaceFleet(makeInitialFleet())
    return {
      playerBoard: initPlayerBoard,
      computerBoard,
      playerShots: createEmptyShotGrid(),
      computerShots: createEmptyShotGrid(),
      playerFleet: initPlayerFleet,
      computerFleet,
      turn: 'player',
      status: 'playing',
      lastPlayerShot: null,
      lastComputerShot: null,
    }
  })

  const aiStateRef = useRef<AiState>({ mode: 'hunt', targets: [], pendingHits: [] })

  const playerFire = useCallback((row: number, col: number) => {
    setState(prev => {
      if (prev.turn !== 'player' || prev.status !== 'playing') return prev
      if (prev.playerShots[row][col] !== 'none') return prev
      const { newShots, result } = processShot(prev.computerBoard, prev.computerFleet, prev.playerShots, row, col)
      const won = isAllSunk(prev.computerFleet, newShots)
      return {
        ...prev,
        playerShots: newShots,
        status: won ? 'player-won' : 'playing',
        turn: won ? 'player' : 'computer',
        lastPlayerShot: { row, col, result },
      }
    })
  }, [])

  // Computer turn
  useEffect(() => {
    if (state.turn !== 'computer' || state.status !== 'playing') return
    const timer = setTimeout(() => {
      setState(prev => {
        if (prev.turn !== 'computer' || prev.status !== 'playing') return prev
        const [row, col] = getAiShot(prev.computerShots, prev.playerFleet, difficulty, aiStateRef.current)
        const { newShots, result } = processShot(prev.playerBoard, prev.playerFleet, prev.computerShots, row, col)
        aiStateRef.current = updateAiState(aiStateRef.current, newShots, row, col, result)
        const won = isAllSunk(prev.playerFleet, newShots)
        return {
          ...prev,
          computerShots: newShots,
          status: won ? 'computer-won' : 'playing',
          turn: won ? 'computer' : 'player',
          lastComputerShot: { row, col, result },
        }
      })
    }, 900)
    return () => clearTimeout(timer)
  }, [state.turn, state.status, difficulty])

  const sunkByPlayer = countSunk(state.computerFleet, state.playerShots)
  const sunkByComputer = countSunk(state.playerFleet, state.computerShots)

  return { state, playerFire, sunkByPlayer, sunkByComputer }
}
