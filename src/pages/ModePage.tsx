import { useNavigate } from 'react-router-dom'

export default function ModePage() {
  const navigate = useNavigate()

  const startGame = (mode: '1player' | '2players') => {
    navigate('/game', { state: { mode } })
  }

  return (
    <div className="mode-page">
      <h2>Wybierz tryb gry</h2>
      <button onClick={() => startGame('1player')}>1 Gracz</button>
      <button onClick={() => startGame('2players')}>2 Graczy</button>
    </div>
  )
}
