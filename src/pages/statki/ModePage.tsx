import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './ModePage.css'

type Mode = 'computer' | '2players-local' | '2players-online'
type Difficulty = 'easy' | 'medium' | 'hard'
type Step = 'mode' | 'difficulty' | 'names'

const COMPUTER_NAMES = [
  'Kapitan Rekin', 'Admirał Delfin', 'Komandor Ośmiornica', 'Kapitan Flądra',
  'Admirał Krab', 'Komandor Meduza', 'Kapitan Wieloryb', 'Admirał Rozgwiazda',
  'Komandor Foka', 'Kapitan Mors', 'Admirał Płaszczka', 'Komandor Homarzec',
  'Kapitan Sardynka', 'Admirał Tuńczyk', 'Komandor Makrela',
]

function randomComputerName() {
  return COMPUTER_NAMES[Math.floor(Math.random() * COMPUTER_NAMES.length)]
}

export default function StatkiModePage() {
  const navigate = useNavigate()
  const [step, setStep] = useState<Step>('mode')
  const [mode, setMode] = useState<Mode | null>(null)
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null)
  const [player1, setPlayer1] = useState('')
  const [player2, setPlayer2] = useState('')
  const [computerName] = useState(randomComputerName)

  function selectMode(m: Mode) {
    setMode(m)
    if (m === 'computer') {
      setStep('difficulty')
    } else {
      setStep('names')
    }
  }

  function selectDifficulty(d: Difficulty) {
    setDifficulty(d)
    setStep('names')
  }

  function startGame() {
    if (!player1.trim()) return
    navigate('/statki/setup', {
      state: { mode, difficulty, player1: player1.trim(), player2: player2.trim() || computerName },
    })
  }

  return (
    <div className="statki-mode">
      {step === 'mode' && (
        <>
          <h2 className="statki-mode__title">Wybierz tryb gry</h2>
          <div className="statki-mode__options">
            <button className="statki-mode__btn" onClick={() => selectMode('computer')}>
              <span className="statki-mode__btn-icon">🤖</span>
              <span className="statki-mode__btn-label">vs Komputer</span>
            </button>
            <button className="statki-mode__btn" onClick={() => selectMode('2players-local')}>
              <span className="statki-mode__btn-icon">👥</span>
              <span className="statki-mode__btn-label">2 Graczy<br/><small>ten sam ekran</small></span>
            </button>
            <button className="statki-mode__btn statki-mode__btn--disabled" disabled>
              <span className="statki-mode__btn-icon">🌐</span>
              <span className="statki-mode__btn-label">2 Graczy<br/><small>przez internet</small></span>
              <span className="statki-mode__badge">Wkrótce</span>
            </button>
          </div>
          <button className="statki-btn-back" onClick={() => navigate('/statki')}>← Wróć</button>
        </>
      )}

      {step === 'difficulty' && (
        <>
          <h2 className="statki-mode__title">Poziom trudności</h2>
          <div className="statki-mode__options">
            <button className="statki-mode__btn statki-mode__btn--easy" onClick={() => selectDifficulty('easy')}>
              <span className="statki-mode__btn-icon">🐠</span>
              <span className="statki-mode__btn-label">Łatwy<br/><small>losowe strzały</small></span>
            </button>
            <button className="statki-mode__btn statki-mode__btn--medium" onClick={() => selectDifficulty('medium')}>
              <span className="statki-mode__btn-icon">🦈</span>
              <span className="statki-mode__btn-label">Średni<br/><small>namierza po trafieniu</small></span>
            </button>
            <button className="statki-mode__btn statki-mode__btn--hard" onClick={() => selectDifficulty('hard')}>
              <span className="statki-mode__btn-icon">💀</span>
              <span className="statki-mode__btn-label">Trudny<br/><small>taktyczne strzały</small></span>
            </button>
          </div>
          <button className="statki-btn-back" onClick={() => setStep('mode')}>← Wróć</button>
        </>
      )}

      {step === 'names' && (
        <>
          <h2 className="statki-mode__title">Podaj imiona</h2>
          <div className="statki-mode__names">
            <div className="statki-mode__name-field">
              <label>Gracz 1</label>
              <input
                type="text"
                placeholder="Twoje imię"
                value={player1}
                onChange={e => setPlayer1(e.target.value)}
                maxLength={20}
                autoFocus
              />
            </div>

            {mode === 'computer' ? (
              <div className="statki-mode__name-field statki-mode__name-field--computer">
                <label>Komputer</label>
                <div className="statki-mode__computer-name">{computerName}</div>
              </div>
            ) : (
              <div className="statki-mode__name-field">
                <label>Gracz 2</label>
                <input
                  type="text"
                  placeholder="Imię drugiego gracza"
                  value={player2}
                  onChange={e => setPlayer2(e.target.value)}
                  maxLength={20}
                />
              </div>
            )}
          </div>

          <button
            className="statki-btn-primary"
            onClick={startGame}
            disabled={!player1.trim() || (mode !== 'computer' && !player2.trim())}
          >
            Dalej →
          </button>
          <button className="statki-btn-back" onClick={() => setStep(mode === 'computer' ? 'difficulty' : 'mode')}>
            ← Wróć
          </button>
        </>
      )}
    </div>
  )
}
