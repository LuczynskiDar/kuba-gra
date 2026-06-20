import React from 'react'
import './Board.css'

const COL_LABELS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']

export interface PreviewCell {
  row: number
  col: number
  valid: boolean
}

interface BoardProps {
  board: (string | null)[][]
  preview: PreviewCell[]
  onCellDragOver: (row: number, col: number) => void
  onDrop: (row: number, col: number) => void
  onDragLeave: () => void
  onCellClick: (row: number, col: number) => void
}

export default function Board({ board, preview, onCellDragOver, onDrop, onDragLeave, onCellClick }: BoardProps) {
  return (
    <div className="setup-board" onDragLeave={onDragLeave}>
      <div className="setup-board__grid">
        <div className="setup-board__corner" />
        {COL_LABELS.map(c => (
          <div key={c} className="setup-board__col-label">{c}</div>
        ))}

        {Array.from({ length: 10 }, (_, row) => (
          <React.Fragment key={row}>
            <div className="setup-board__row-label">{row + 1}</div>
            {Array.from({ length: 10 }, (_, col) => {
              const pre = preview.find(p => p.row === row && p.col === col)
              const hasShip = board[row][col] !== null

              const cls = [
                'setup-board__cell',
                hasShip && !pre ? 'setup-board__cell--ship' : '',
                pre?.valid ? 'setup-board__cell--valid' : '',
                pre && !pre.valid ? 'setup-board__cell--invalid' : '',
              ].filter(Boolean).join(' ')

              return (
                <div
                  key={col}
                  className={cls}
                  onDragOver={e => { e.preventDefault(); onCellDragOver(row, col) }}
                  onDrop={e => { e.preventDefault(); onDrop(row, col) }}
                  onClick={() => onCellClick(row, col)}
                />
              )
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}
