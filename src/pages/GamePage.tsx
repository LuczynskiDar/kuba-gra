import { useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useGame } from '../hooks/useGame'
import HangmanSVG from '../components/HangmanSVG'
import WordDisplay from '../components/WordDisplay'
import Keyboard from '../components/Keyboard'
import type { GameMode } from '../types'
import './GamePage.css'

export default function GamePage() {
  const navigate = useNavigate()
  const location = useLocation()
  const mode = (location.state?.mode ?? '1player') as GameMode
  const initialized = useRef(false)

  const { turnState, turnStatus, phase, startGame, guessLetter, nextTurn } = useGame()

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true
      startGame(mode)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (phase === 'finished' && turnState) {
      navigate('/summary', {
        state: { results: turnState.roundResults, mode },
      })
    }
  }, [phase]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!turnState) return null

  const isRoundOver = turnStatus !== 'playing'
  const isTwoPlayer = mode === '2players'

  const totalTurns = isTwoPlayer ? 6 : 3
  const isLastTurn = turnState.roundResults.length === totalTurns - 1 && isRoundOver

  return (
    <div className="game-page">
      <header className="game-header">
        <div className="game-header__round">
          Runda <strong>{turnState.currentRound}</strong> / 3
        </div>
        {isTwoPlayer && (
          <div className="game-header__player">
            Gracz <strong>{turnState.currentPlayer}</strong>
          </div>
        )}
        <div className="game-header__mistakes">
          Błędy: <strong className={turnState.mistakes >= 6 ? 'danger' : ''}>
            {turnState.mistakes}
          </strong> / {turnState.maxMistakes}
        </div>
      </header>

      <main className="game-main">
        <div className="game-hangman">
          <HangmanSVG mistakes={turnState.mistakes} />
        </div>

        <div className="game-right">
          <WordDisplay
            word={turnState.word}
            guessedLetters={turnState.guessedLetters}
            revealed={turnStatus === 'lost'}
            category={turnState.category}
          />

          {isRoundOver && (
            <div className={`round-result round-result--${turnStatus}`}>
              <p className="round-result__message">
                {turnStatus === 'won'
                  ? 'Brawo! Słowo odgadnięte!'
                  : `Niestety! Słowo to: ${turnState.word}`}
              </p>
              <button className="btn-next" onClick={nextTurn}>
                {isLastTurn ? 'Zobacz wyniki →' : 'Następna tura →'}
              </button>
            </div>
          )}

          <Keyboard
            guessedLetters={turnState.guessedLetters}
            word={turnState.word}
            onGuess={guessLetter}
            disabled={isRoundOver}
          />
        </div>
      </main>
    </div>
  )
}
