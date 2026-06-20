import { useLocation, useNavigate } from 'react-router-dom'
import type { GameMode, Difficulty } from '../../types/statki'
import './SummaryPage.css'

export default function StatkiSummaryPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const s = (location.state ?? {}) as {
    mode: GameMode; difficulty: Difficulty | null
    player1: string; player2: string; winner: string
    playerShots: number; playerAccuracy: number
    computerShots: number; computerAccuracy: number
  }

  const playerWon = s.winner === s.player1

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
          Poziom trudności: <strong>{s.difficulty === 'easy' ? 'Łatwy' : s.difficulty === 'medium' ? 'Średni' : 'Trudny'}</strong>
        </p>
      )}

      <p className="statki-summary__db-note">
        Zapis wyników do bazy danych — Faza 6
      </p>

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
