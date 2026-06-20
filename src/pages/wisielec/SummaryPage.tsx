import { useNavigate, useLocation } from 'react-router-dom'
import type { GameMode, RoundResult } from '../../types'
import './SummaryPage.css'

interface RoundSummary {
  round: number
  player1: RoundResult
  player2: RoundResult
  winner: 1 | 2 | 'tie'
}

function getRoundWinner(p1: RoundResult, p2: RoundResult): 1 | 2 | 'tie' {
  if (p1.won && !p2.won) return 1
  if (!p1.won && p2.won) return 2
  if (p1.won && p2.won) return p1.mistakes <= p2.mistakes ? 1 : 2
  return 'tie'
}

export default function SummaryPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const results: RoundResult[] = location.state?.results ?? []
  const mode: GameMode = location.state?.mode ?? '1player'

  const isTwoPlayer = mode === '2players'

  /* === Tryb 1 gracz === */
  if (!isTwoPlayer) {
    const won = results.filter(r => r.won).length
    const total = results.length

    return (
      <div className="summary-page">
        <h1 className="summary-title">Koniec gry!</h1>
        <p className="summary-score-label">
          Odgadłeś <span className="summary-score">{won}</span> / {total} słów
        </p>

        <table className="summary-table">
          <thead>
            <tr>
              <th>Runda</th>
              <th>Słowo</th>
              <th>Wynik</th>
              <th>Błędy</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r, i) => (
              <tr key={i} className={r.won ? 'row--won' : 'row--lost'}>
                <td>{i + 1}</td>
                <td>{r.word}</td>
                <td>{r.won ? 'Odgadnięte' : 'Przegrana'}</td>
                <td>{r.mistakes} / 8</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="summary-actions">
          <button className="btn-primary" onClick={() => navigate('/wisielec/mode')}>
            Zagraj ponownie
          </button>
          <button className="btn-secondary" onClick={() => navigate('/')}>
            Menu główne
          </button>
        </div>
      </div>
    )
  }

  /* === Tryb 2 graczy === */
  const rounds: RoundSummary[] = []
  for (let i = 0; i < results.length; i += 2) {
    const p1 = results[i]
    const p2 = results[i + 1]
    rounds.push({
      round: i / 2 + 1,
      player1: p1,
      player2: p2,
      winner: getRoundWinner(p1, p2),
    })
  }

  const p1Wins = rounds.filter(r => r.winner === 1).length
  const p2Wins = rounds.filter(r => r.winner === 2).length
  const overallWinner: 1 | 2 | 'tie' =
    p1Wins > p2Wins ? 1 : p2Wins > p1Wins ? 2 : 'tie'

  return (
    <div className="summary-page">
      <h1 className="summary-title">Koniec meczu!</h1>

      <div className={`summary-winner summary-winner--${overallWinner}`}>
        {overallWinner === 'tie'
          ? 'Remis!'
          : `Wygrywa Gracz ${overallWinner}!`}
      </div>

      <div className="summary-score-row">
        <div className={`summary-player-score ${overallWinner === 1 ? 'is-winner' : ''}`}>
          <span className="summary-player-name">Gracz 1</span>
          <span className="summary-player-points">{p1Wins}</span>
        </div>
        <span className="summary-vs">:</span>
        <div className={`summary-player-score ${overallWinner === 2 ? 'is-winner' : ''}`}>
          <span className="summary-player-points">{p2Wins}</span>
          <span className="summary-player-name">Gracz 2</span>
        </div>
      </div>

      <table className="summary-table">
        <thead>
          <tr>
            <th>Runda</th>
            <th>Gracz 1 — słowo</th>
            <th>Błędy</th>
            <th></th>
            <th>Gracz 2 — słowo</th>
            <th>Błędy</th>
            <th>Zwycięzca</th>
          </tr>
        </thead>
        <tbody>
          {rounds.map(r => (
            <tr key={r.round}>
              <td>{r.round}</td>
              <td className={r.player1.won ? 'cell--won' : 'cell--lost'}>
                {r.player1.word}
              </td>
              <td>{r.player1.mistakes}</td>
              <td className="cell--vs">vs</td>
              <td className={r.player2.won ? 'cell--won' : 'cell--lost'}>
                {r.player2.word}
              </td>
              <td>{r.player2.mistakes}</td>
              <td className="cell--winner">
                {r.winner === 'tie' ? 'Remis' : `Gracz ${r.winner}`}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="summary-actions">
        <button className="btn-primary" onClick={() => navigate('/wisielec/mode')}>
          Zagraj ponownie
        </button>
        <button className="btn-secondary" onClick={() => navigate('/')}>
          Menu główne
        </button>
      </div>
    </div>
  )
}
