import { useState, useRef, useMemo } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import type { ShipDef, BoardGrid, GameMode, Difficulty } from '../../types/statki'
import { makeInitialFleet, createEmptyBoard, getShipCells, canPlace, randomPlaceFleet } from '../../utils/battleshipUtils'
import Board from '../../components/statki/Board'
import HandoverScreen from '../../components/statki/HandoverScreen'
import './SetupPage.css'

interface RouteState {
  mode: GameMode
  difficulty: Difficulty | null
  player1: string
  player2: string
}

type SetupPhase = 'player1' | 'handover' | 'player2'

export default function StatkiSetupPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { mode, difficulty, player1, player2 } = (location.state ?? {}) as RouteState

  // Phase: player1 → handover → player2 (only for 2players-local)
  const [phase, setPhase]     = useState<SetupPhase>('player1')
  const [fleet, setFleet]     = useState<ShipDef[]>(makeInitialFleet)
  const [board, setBoard]     = useState<BoardGrid>(createEmptyBoard)
  const [hoverCell, setHoverCell] = useState<{ row: number; col: number } | null>(null)

  // Saved player 1 data for 2-player mode
  const p1FleetRef = useRef<ShipDef[]>([])
  const p1BoardRef = useRef<BoardGrid>([])

  const dragShipId   = useRef<string | null>(null)
  const grabIndexRef = useRef(0)

  const activeName  = phase === 'player2' ? player2 : player1
  const allPlaced   = fleet.every(s => s.placed)
  const placedCount = fleet.filter(s => s.placed).length

  const preview = useMemo(() => {
    if (!dragShipId.current || !hoverCell) return []
    const ship = fleet.find(s => s.id === dragShipId.current)
    if (!ship) return []
    const gi = grabIndexRef.current
    const startRow = ship.orientation === 'vertical'   ? hoverCell.row - gi : hoverCell.row
    const startCol = ship.orientation === 'horizontal' ? hoverCell.col - gi : hoverCell.col
    const cells = getShipCells(startRow, startCol, ship.size, ship.orientation)
    const valid = canPlace(board, ship.id, startRow, startCol, ship.size, ship.orientation)
    return cells.map(([row, col]) => ({ row, col, valid }))
  }, [hoverCell, fleet, board])

  function handleDragStart(shipId: string) { dragShipId.current = shipId }
  function handleDragEnd()                 { dragShipId.current = null; setHoverCell(null) }

  function handleDrop(row: number, col: number) {
    const shipId = dragShipId.current
    if (!shipId) return
    const ship = fleet.find(s => s.id === shipId)
    if (!ship) return
    const gi = grabIndexRef.current
    const startRow = ship.orientation === 'vertical'   ? row - gi : row
    const startCol = ship.orientation === 'horizontal' ? col - gi : col
    if (!canPlace(board, shipId, startRow, startCol, ship.size, ship.orientation)) return
    const newBoard = board.map(r => [...r])
    if (ship.placed)
      for (let r = 0; r < 10; r++)
        for (let c = 0; c < 10; c++)
          if (newBoard[r][c] === shipId) newBoard[r][c] = null
    getShipCells(startRow, startCol, ship.size, ship.orientation).forEach(([r, c]) => { newBoard[r][c] = shipId })
    setBoard(newBoard)
    setFleet(prev => prev.map(s => s.id === shipId ? { ...s, placed: true, startRow, startCol } : s))
    dragShipId.current = null
    setHoverCell(null)
  }

  function handleCellClick(row: number, col: number) {
    const shipId = board[row][col]
    if (!shipId) return
    const newBoard = board.map(r => [...r])
    for (let r = 0; r < 10; r++)
      for (let c = 0; c < 10; c++)
        if (newBoard[r][c] === shipId) newBoard[r][c] = null
    setBoard(newBoard)
    setFleet(prev => prev.map(s => s.id === shipId ? { ...s, placed: false, startRow: null, startCol: null } : s))
  }

  function handleRotate(shipId: string) {
    setFleet(prev => prev.map(s => s.id === shipId
      ? { ...s, orientation: s.orientation === 'horizontal' ? 'vertical' : 'horizontal' }
      : s
    ))
  }

  function handleRandomize() {
    const result = randomPlaceFleet(makeInitialFleet())
    setFleet(result.fleet)
    setBoard(result.board)
  }

  function handleReady() {
    if (mode === '2players-local' && phase === 'player1') {
      // Save player 1's setup and show handover for player 2
      p1FleetRef.current = fleet
      p1BoardRef.current = board
      setPhase('handover')
    } else if (mode === '2players-local' && phase === 'player2') {
      // Both setups done — navigate to game, start with handover for player 1
      navigate('/statki/game', {
        state: {
          mode, difficulty, player1, player2,
          playerFleet:  p1FleetRef.current,
          playerBoard:  p1BoardRef.current,
          player2Fleet: fleet,
          player2Board: board,
          initialHandover: true,
        }
      })
    } else {
      // vs Computer
      navigate('/statki/game', {
        state: { mode, difficulty, player1, player2, playerFleet: fleet, playerBoard: board }
      })
    }
  }

  function handleHandoverReady() {
    // Switch to player 2's setup — reset board without navigating
    setFleet(makeInitialFleet())
    setBoard(createEmptyBoard())
    setHoverCell(null)
    setPhase('player2')
  }

  const unplacedFleet = fleet.filter(s => !s.placed)

  return (
    <>
      {phase === 'handover' && (
        <HandoverScreen playerName={player2} onReady={handleHandoverReady} />
      )}

      <div className="setup-page">
        <div className="setup-page__header">
          <h2 className="setup-page__title">
            Ustaw flotę, <span>{activeName || 'Graczu'}</span>
          </h2>
          <p className="setup-page__hint">
            Przeciągnij statki na planszę · Kliknij statek na planszy by go zdjąć · ⟳ obraca statek
          </p>
        </div>

        <div className="setup-page__main">
          <div className="setup-page__fleet">
            <h3 className="setup-page__fleet-title">Flota do ustawienia</h3>
            <div className="setup-page__ships">
              {unplacedFleet.map(ship => (
                <div key={ship.id} className="ship-item" draggable
                  onDragStart={() => handleDragStart(ship.id)}
                  onDragEnd={handleDragEnd}
                >
                  <div className={`ship-item__cells ship-item__cells--${ship.orientation}`}>
                    {Array.from({ length: ship.size }, (_, i) => (
                      <div key={i} className="ship-item__cell" onMouseDown={() => { grabIndexRef.current = i }} />
                    ))}
                  </div>
                  <div className="ship-item__meta">
                    <span className="ship-item__name">{ship.name} ({ship.size})</span>
                    <button className="ship-item__rotate" onClick={() => handleRotate(ship.id)} title="Obróć statek">⟳</button>
                  </div>
                </div>
              ))}
              {unplacedFleet.length === 0 && <p className="setup-page__all-placed">✓ Wszystkie statki ustawione!</p>}
            </div>
            <p className="setup-page__progress">{placedCount} / {fleet.length} statków na planszy</p>
          </div>

          <Board
            board={board}
            preview={preview}
            onCellDragOver={(row, col) => setHoverCell({ row, col })}
            onDrop={handleDrop}
            onDragLeave={() => setHoverCell(null)}
            onCellClick={handleCellClick}
          />
        </div>

        <div className="setup-page__actions">
          <button className="setup-btn-secondary" onClick={handleRandomize}>🎲 Losuj ustawienie</button>
          <button className="setup-btn-primary" onClick={handleReady} disabled={!allPlaced}>Gotowy →</button>
          <button className="setup-btn-back" onClick={() => navigate('/statki/mode')}>← Wróć</button>
        </div>
      </div>
    </>
  )
}
