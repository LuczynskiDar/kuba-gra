import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import type { GameMode, Difficulty } from '../../types/statki'
import './SummaryPage.css'

interface ResultRow {
  id: number
  player: string
  opponent: string
  result: 'W' | 'L'
  difficulty?: string
  accuracy: number
  shots: number
  played_at: string
}

function diffLabel(d: string): string {
  return d === 'easy' ? 'Łatwy' : d === 'medium' ? 'Średni' : 'Trudny'
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString('pl-PL', { day: '2-digit', month: '2-digit', year: '2-digit' })
    + ' ' + d.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })
}

export default function StatkiSummaryPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const s = (location.state ?? {}) as {
    mode: GameMode; difficulty: Difficulty | null
    player1: string; player2: string; winner: string
    playerShots: number; playerAccuracy: number
    computerShots: number; computerAccuracy: number
    isOnlineWinner?: boolean  // online mode: true only on winner's device
  }

  const playerWon    = s.winner === s.player1
  const apiMode      = s.mode === 'computer' ? 'solo' : 'multiplayer'
  const shouldSave   = s.mode !== '2players-online' || s.isOnlineWinner === true

  const [rows, setRows]         = useState<ResultRow[]>([])
  const [dbError, setDbError]   = useState(false)
  const savedRef                = useRef(false)

  useEffect(() => {
    if (savedRef.current || !s.player1 || !shouldSave) return
    savedRef.current = true

    // Solo: save player1's result (W or L)
    // Multiplayer: save only the winner
    const loser        = s.winner === s.player1 ? s.player2 : s.player1
    const winnerShots  = s.winner === s.player1 ? s.playerShots    : s.computerShots
    const winnerAcc    = s.winner === s.player1 ? s.playerAccuracy : s.computerAccuracy

    const body = apiMode === 'solo'
      ? {
          mode: 'solo',
          player:     s.player1,
          opponent:   s.player2,
          result:     playerWon ? 'W' : 'L',
          difficulty: s.difficulty ?? undefined,
          accuracy:   s.playerAccuracy,
          shots:      s.playerShots,
        }
      : {
          mode: 'multiplayer',
          player:   s.winner,
          opponent: loser,
          result:   'W',
          accuracy: winnerAcc,
          shots:    winnerShots,
        }

    fetch('/api/results', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(body),
    })
      .then(r => { if (!r.ok) throw new Error() })
      .then(() => fetch(`/api/results/${apiMode}`))
      .then(r => r.json())
      .then((data: ResultRow[]) => setRows(data))
      .catch(() => setDbError(true))
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="statki-summary">
      <div className={`statki-summary__banner statki-summary__banner--${playerWon ? 'win' : 'lose'}`}>
        {playerWon ? '🏆 Zwycięstwo!' : '💀 Przegrana!'}
      </div>

      <h2 className="statki-summary__winner">
        {s.winner} wygrał!
      </h2>

      <div className="statki-summary__stats">
        <div className="statki-summary__stat-block">
          <h3>{s.player1}</h3>
          <div className="statki-summary__stat-row">
            <span>Strzały</span><strong>{s.playerShots}</strong>
          </div>
          <div className="statki-summary__stat-row">
            <span>Celność</span><strong>{s.playerAccuracy}%</strong>
          </div>
        </div>

        <div className="statki-summary__stat-block">
          <h3>{s.player2}</h3>
          <div className="statki-summary__stat-row">
            <span>Strzały</span><strong>{s.computerShots}</strong>
          </div>
          <div className="statki-summary__stat-row">
            <span>Celność</span><strong>{s.computerAccuracy}%</strong>
          </div>
        </div>
      </div>

      {s.difficulty && (
        <p className="statki-summary__difficulty">
          Poziom trudności: <strong>{diffLabel(s.difficulty)}</strong>
        </p>
      )}

      {/* Leaderboard */}
      <div className="statki-summary__leaderboard">
        <h3 className="statki-summary__lb-title">
          Tabela wyników — {apiMode === 'solo' ? 'vs Komputer' : '2 graczy'}
        </h3>

        {dbError ? (
          <p className="statki-summary__lb-error">Serwer wyników niedostępny</p>
        ) : rows.length === 0 ? (
          <p className="statki-summary__lb-empty">Ładowanie…</p>
        ) : (
          <div className="statki-summary__lb-wrap">
            <table className="statki-summary__lb-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Gracz</th>
                  <th>Przeciwnik</th>
                  <th>Wynik</th>
                  {apiMode === 'solo' && <th>Poziom</th>}
                  <th>Celność</th>
                  <th>Strzały</th>
                  <th>Data</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr key={row.id} className={row.result === 'W' ? 'statki-summary__lb-win' : 'statki-summary__lb-lose'}>
                    <td>{i + 1}</td>
                    <td>{row.player}</td>
                    <td>{row.opponent}</td>
                    <td className="statki-summary__lb-result">{row.result === 'W' ? '✓' : '✗'}</td>
                    {apiMode === 'solo' && <td>{diffLabel(row.difficulty ?? '')}</td>}
                    <td>{row.accuracy}%</td>
                    <td>{row.shots}</td>
                    <td>{formatDate(row.played_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="statki-summary__actions">
        <button className="statki-summary__btn-primary" onClick={() => navigate('/statki/mode')}>
          Zagraj ponownie
        </button>
        <button className="statki-summary__btn-back" onClick={() => navigate('/statki')}>
          Menu statków
        </button>
        <button className="statki-summary__btn-back" onClick={() => navigate('/')}>
          Menu główne
        </button>
      </div>
    </div>
  )
}
