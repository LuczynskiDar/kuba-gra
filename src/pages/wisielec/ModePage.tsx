import { useNavigate } from 'react-router-dom'
import './ModePage.css'

export default function ModePage() {
  const navigate = useNavigate()

  const startGame = (mode: '1player' | '2players') => {
    navigate('/wisielec/game', { state: { mode } })
  }

  return (
    <div className="mode-page">
      <h2>Wybierz tryb gry</h2>
      <div className="mode-buttons">
        <button className="mode-btn" onClick={() => startGame('1player')}>1 Gracz</button>
        <button className="mode-btn" onClick={() => startGame('2players')}>2 Graczy</button>
      </div>
    </div>
  )
}
