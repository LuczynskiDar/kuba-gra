import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import type { BoardGrid, GameMode, Difficulty, ShipDef } from '../../types/statki'
import { useBattleship } from '../../hooks/useBattleship'
import GameBoard from '../../components/statki/GameBoard'
import './GamePage.css'

export default function StatkiGamePage() {
  const navigate = useNavigate()
  const location = useLocation()
  const routeState = location.state as {
    mode: GameMode; difficulty: Difficulty; player1: string; player2: string
    playerFleet: ShipDef[]; playerBoard: BoardGrid
  } | null

  useEffect(() => {
    if (!routeState) navigate('/statki')
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const { state, playerFire, sunkByPlayer, sunkByComputer } = useBattleship(
    routeState?.playerBoard ?? [],
    routeState?.playerFleet ?? [],
    routeState?.difficulty ?? 'easy'
  )

  const { mode, difficulty, player1, player2 } = routeState ?? { mode: 'computer', difficulty: 'easy', player1: '', player2: '' }

  // Navigate to summary when game ends
  useEffect(() => {
    if (state.status === 'playing') return
    const timer = setTimeout(() => {
      const pShots = state.playerShots.flat()
      const cShots = state.computerShots.flat()
      const pFired  = pShots.filter(s => s !== 'none').length
      const pHits   = pShots.filter(s => s === 'hit' || s === 'sunk').length
      const cFired  = cShots.filter(s => s !== 'none').length
      const cHits   = cShots.filter(s => s === 'hit' || s === 'sunk').length
      navigate('/statki/summary', {
        state: {
          mode, difficulty, player1, player2,
          winner: state.status === 'player-won' ? player1 : player2,
          playerShots: pFired,
          playerAccuracy: pFired > 0 ? Math.round(pHits / pFired * 100) : 0,
          computerShots: cFired,
          computerAccuracy: cFired > 0 ? Math.round(cHits / cFired * 100) : 0,
        }
      })
    }, 2200)
    return () => clearTimeout(timer)
  }, [state.status]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!routeState) return null

  const isPlayerTurn = state.turn === 'player' && state.status === 'playing'
  const isComputerTurn = state.turn === 'computer' && state.status === 'playing'
  const totalShips = state.playerFleet.length

  return (
    <div className="statki-game">
      {/* Status banner */}
      <div className={`statki-game__status statki-game__status--${state.status === 'playing' ? state.turn : state.status}`}>
        {state.status === 'player-won'    && `🏆 Wygrałeś, ${player1}!`}
        {state.status === 'computer-won'  && `💀 ${player2} wygrał!`}
        {isPlayerTurn                     && `🎯 Twoja tura, ${player1} — wybierz cel`}
        {isComputerTurn                   && `⏳ ${player2} celuje...`}
      </div>

      {/* Scoreboard */}
      <div className="statki-game__score">
        <div className="statki-game__score-player">
          <span className="statki-game__score-name">{player1}</span>
          <span className="statki-game__score-sunk">{sunkByPlayer} / {totalShips} zatopionych</span>
        </div>
        <span className="statki-game__score-vs">vs</span>
        <div className="statki-game__score-player statki-game__score-player--right">
          <span className="statki-game__score-name">{player2}</span>
          <span className="statki-game__score-sunk">{sunkByComputer} / {totalShips} zatopionych</span>
        </div>
      </div>

      {/* Boards */}
      <div className="statki-game__boards">
        <GameBoard
          title={`Twoja plansza — ${player1}`}
          board={state.playerBoard}
          shots={state.computerShots}
          showShips={true}
          interactive={false}
          lastShot={state.lastComputerShot}
          onCellClick={() => {}}
        />
        <GameBoard
          title={`Plansza ${player2}`}
          board={state.computerBoard}
          shots={state.playerShots}
          showShips={false}
          interactive={isPlayerTurn}
          lastShot={state.lastPlayerShot}
          onCellClick={playerFire}
        />
      </div>

      {/* Last shot info */}
      {(state.lastPlayerShot || state.lastComputerShot) && (
        <div className="statki-game__last-shot">
          {state.lastPlayerShot && (
            <span className={`statki-game__shot-badge statki-game__shot-badge--${state.lastPlayerShot.result}`}>
              Twój strzał: {state.lastPlayerShot.result === 'miss' ? 'Pudło!' : state.lastPlayerShot.result === 'hit' ? 'Trafiony!' : '💥 Zatopiony!'}
            </span>
          )}
          {state.lastComputerShot && (
            <span className={`statki-game__shot-badge statki-game__shot-badge--enemy statki-game__shot-badge--${state.lastComputerShot.result}`}>
              Strzał {player2}: {state.lastComputerShot.result === 'miss' ? 'Pudło!' : state.lastComputerShot.result === 'hit' ? 'Trafił!' : '💥 Zatopił!'}
            </span>
          )}
        </div>
      )}

      {/* Difficulty badge */}
      {mode === 'computer' && (
        <div className="statki-game__difficulty">
          Poziom: <strong>{difficulty === 'easy' ? 'Łatwy' : difficulty === 'medium' ? 'Średni' : 'Trudny'}</strong>
        </div>
      )}
    </div>
  )
}
