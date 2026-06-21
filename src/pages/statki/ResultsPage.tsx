import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './ResultsPage.css'

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

export default function StatkiResultsPage() {
  const navigate = useNavigate()
  const [tab, setTab]         = useState<'solo' | 'multiplayer'>('solo')
  const [rows, setRows]       = useState<ResultRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(false)

  useEffect(() => {
    setLoading(true)
    setError(false)
    fetch(`/api/results/${tab}`)
      .then(r => { if (!r.ok) throw new Error(); return r.json() })
      .then((data: ResultRow[]) => { setRows(data); setLoading(false) })
      .catch(() => { setError(true); setLoading(false) })
  }, [tab])

  return (
    <div className="statki-results">
      <h1 className="statki-results__title">Tabela wyników</h1>

      <div className="statki-results__tabs">
        <button
          className={`statki-results__tab${tab === 'solo' ? ' statki-results__tab--active' : ''}`}
          onClick={() => setTab('solo')}
        >
          vs Komputer
        </button>
        <button
          className={`statki-results__tab${tab === 'multiplayer' ? ' statki-results__tab--active' : ''}`}
          onClick={() => setTab('multiplayer')}
        >
          2 Graczy
        </button>
      </div>

      {error ? (
        <p className="statki-results__msg">Serwer wyników niedostępny</p>
      ) : loading ? (
        <p className="statki-results__msg">Ładowanie…</p>
      ) : rows.length === 0 ? (
        <p className="statki-results__msg">Brak wyników — zagraj pierwszą grę!</p>
      ) : (
        <div className="statki-results__wrap">
          <table className="statki-results__table">
            <thead>
              <tr>
                <th>#</th>
                <th>Gracz</th>
                <th>Przeciwnik</th>
                <th>W/P</th>
                {tab === 'solo' && <th>Poziom</th>}
                <th>Celność</th>
                <th>Strzały</th>
                <th>Data</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={row.id} className={row.result === 'W' ? 'statki-results__win' : 'statki-results__lose'}>
                  <td>{i + 1}</td>
                  <td>{row.player}</td>
                  <td>{row.opponent}</td>
                  <td className="statki-results__badge">{row.result === 'W' ? '✓' : '✗'}</td>
                  {tab === 'solo' && <td>{diffLabel(row.difficulty ?? '')}</td>}
                  <td>{row.accuracy}%</td>
                  <td>{row.shots}</td>
                  <td>{formatDate(row.played_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <button className="statki-results__back" onClick={() => navigate('/statki')}>
        ← Menu statków
      </button>
    </div>
  )
}
