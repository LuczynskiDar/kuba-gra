import React from 'react'
import type { ShotGrid, LastShot } from '../../hooks/useBattleship'
import type { BoardGrid } from '../../types/statki'
import './GameBoard.css'

const COL_LABELS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']

interface GameBoardProps {
  title: string
  board: BoardGrid
  shots: ShotGrid
  showShips: boolean
  interactive: boolean
  lastShot: LastShot | null
  onCellClick: (row: number, col: number) => void
}

export default function GameBoard({ title, board, shots, showShips, interactive, lastShot, onCellClick }: GameBoardProps) {
  return (
    <div className="game-board">
      <h3 className="game-board__title">{title}</h3>
      <div className={`game-board__grid${interactive ? ' game-board__grid--interactive' : ''}`}>
        <div className="game-board__corner" />
        {COL_LABELS.map(c => (
          <div key={c} className="game-board__label">{c}</div>
        ))}
        {Array.from({ length: 10 }, (_, row) => (
          <React.Fragment key={row}>
            <div className="game-board__label">{row + 1}</div>
            {Array.from({ length: 10 }, (_, col) => {
              const shot = shots[row][col]
              const hasShip = board[row][col] !== null
              const isLast = lastShot?.row === row && lastShot?.col === col
              const canClick = interactive && shot === 'none'

              const cls = [
                'game-board__cell',
                showShips && hasShip && shot === 'none' ? 'game-board__cell--ship' : '',
                shot === 'miss'  ? 'game-board__cell--miss'  : '',
                shot === 'hit'   ? 'game-board__cell--hit'   : '',
                shot === 'sunk'  ? 'game-board__cell--sunk'  : '',
                canClick         ? 'game-board__cell--target' : '',
                isLast && lastShot?.result === 'miss' ? 'game-board__cell--last-miss' : '',
                isLast && lastShot?.result === 'hit'  ? 'game-board__cell--last-hit'  : '',
                isLast && lastShot?.result === 'sunk' ? 'game-board__cell--last-sunk' : '',
              ].filter(Boolean).join(' ')

              return (
                <div
                  key={col}
                  className={cls}
                  onClick={() => canClick && onCellClick(row, col)}
                />
              )
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}
