import { useEffect, useRef, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import type { BoardGrid, GameMode, Difficulty, ShipDef } from '../../types/statki'
import { useBattleship } from '../../hooks/useBattleship'
import GameBoard from '../../components/statki/GameBoard'
import HandoverScreen from '../../components/statki/HandoverScreen'
import './GamePage.css'

export default function StatkiGamePage() {
  const navigate   = useNavigate()
  const location   = useLocation()
  const routeState = location.state as {
    mode: GameMode; difficulty: Difficulty; player1: string; player2: string
    playerFleet: ShipDef[]; playerBoard: BoardGrid
    player2Fleet?: ShipDef[]; player2Board?: BoardGrid
    initialHandover?: boolean
  } | null

  useEffect(() => {
    if (!routeState) navigate('/statki')
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const { state, playerFire, player2Fire, sunkByPlayer, sunkByComputer } = useBattleship(
    routeState?.playerBoard ?? [],
    routeState?.playerFleet ?? [],
    routeState?.difficulty ?? 'easy',
    routeState?.mode ?? 'computer',
    routeState?.player2Board,
    routeState?.player2Fleet,
  )

  const { mode, difficulty, player1, player2 } = routeState ?? {
    mode: 'computer' as GameMode, difficulty: 'easy' as Difficulty, player1: '', player2: ''
  }

  const is2P = mode === '2players-local'

  // Handover screen state
  const [showHandover, setShowHandover]       = useState(routeState?.initialHandover === true)
  const [handoverTarget, setHandoverTarget]   = useState(player1)
  const [pendingHandover, setPendingHandover] = useState(false)
  const [pendingTarget, setPendingTarget]     = useState('')

  // activeViewer controls WHOSE perspective is shown — decoupled from state.turn
  // so the boards don't flip until after the handover is confirmed
  const [activeViewer, setActiveViewer] = useState<'player' | 'computer'>('player')

  // Track whether it's the initial handover (device hand-off before first shot)
  // — that one must NOT flip activeViewer, only dismiss the overlay
  const isInitialHandover = useRef(routeState?.initialHandover === true)

  // After a miss: show pending button (boards stay in current viewer's perspective)
  const prevPlayerShot   = useRef(state.lastPlayerShot)
  const prevComputerShot = useRef(state.lastComputerShot)

  useEffect(() => {
    if (!is2P || state.status !== 'playing') return
    if (state.lastPlayerShot !== prevPlayerShot.current) {
      prevPlayerShot.current = state.lastPlayerShot
      if (state.lastPlayerShot?.result === 'miss') {
        setPendingTarget(player2)
        setPendingHandover(true)
      }
    }
  }, [state.lastPlayerShot]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!is2P || state.status !== 'playing') return
    if (state.lastComputerShot !== prevComputerShot.current) {
      prevComputerShot.current = state.lastComputerShot
      if (state.lastComputerShot?.result === 'miss') {
        setPendingTarget(player1)
        setPendingHandover(true)
      }
    }
  }, [state.lastComputerShot]) // eslint-disable-line react-hooks/exhaustive-deps

  function handlePassDevice() {
    setPendingHandover(false)
    setHandoverTarget(pendingTarget)
    setShowHandover(true)
  }

  function handleHandoverReady() {
    setShowHandover(false)
    if (isInitialHandover.current) {
      isInitialHandover.current = false   // first handover: just dismiss, don't flip
    } else {
      setActiveViewer(prev => prev === 'player' ? 'computer' : 'player')
    }
  }

  // Navigate to summary when game ends
  useEffect(() => {
    if (state.status === 'playing') return
    const timer = setTimeout(() => {
      const pShots = state.playerShots.flat()
      const cShots = state.computerShots.flat()
      const pFired = pShots.filter(s => s === 'miss' || s === 'hit' || s === 'sunk').length
      const pHits  = pShots.filter(s => s === 'hit'  || s === 'sunk').length
      const cFired = cShots.filter(s => s === 'miss' || s === 'hit' || s === 'sunk').length
      const cHits  = cShots.filter(s => s === 'hit'  || s === 'sunk').length
      navigate('/statki/summary', {
        state: {
          mode, difficulty, player1, player2,
          winner: state.status === 'player-won' ? player1 : player2,
          playerShots:    pFired,
          playerAccuracy: pFired > 0 ? Math.round(pHits  / pFired * 100) : 0,
          computerShots:    cFired,
          computerAccuracy: cFired > 0 ? Math.round(cHits / cFired * 100) : 0,
        }
      })
    }, 2200)
    return () => clearTimeout(timer)
  }, [state.status]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!routeState) return null

  const isPlayerTurn   = state.turn === 'player'   && state.status === 'playing'
  const isComputerTurn = state.turn === 'computer'  && state.status === 'playing'
  const totalShips     = state.playerFleet.length

  // In 2-player mode, boards flip based on who confirmed the handover (not state.turn)
  const p2Turn = is2P && activeViewer === 'computer'

  return (
    <>
      {showHandover && (
        <HandoverScreen
          playerName={handoverTarget}
          onReady={handleHandoverReady}
        />
      )}

      <div className="statki-game">
        {/* Status banner */}
        <div className={`statki-game__status statki-game__status--${state.status === 'playing' ? state.turn : state.status}`}>
          {state.status === 'player-won'   && `🏆 Wygrałeś, ${player1}!`}
          {state.status === 'computer-won' && `🏆 Wygrał ${player2}!`}
          {isPlayerTurn                    && `🎯 Twoja tura, ${player1} — wybierz cel`}
          {isComputerTurn && !is2P         && `⏳ ${player2} celuje...`}
          {isComputerTurn &&  is2P         && `🎯 Twoja tura, ${player2} — wybierz cel`}
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
          {!p2Turn ? (
            // Player 1's turn (or vs Computer): left = P1 own, right = P2 target
            <>
              <GameBoard
                title={`Twoja plansza — ${player1}`}
                board={state.playerBoard}
                shots={state.computerShots}
                showShips={true}
                interactive={false}
                lastShot={state.lastComputerShot}
                onCellClick={() => {}}
                variant="blue"
              />
              <GameBoard
                title={`Plansza ${player2}`}
                board={state.computerBoard}
                shots={state.playerShots}
                showShips={false}
                interactive={isPlayerTurn}
                lastShot={state.lastPlayerShot}
                onCellClick={playerFire}
                variant="red"
              />
            </>
          ) : (
            // Player 2's turn: left = P2 own, right = P1 target
            <>
              <GameBoard
                title={`Twoja plansza — ${player2}`}
                board={state.computerBoard}
                shots={state.playerShots}
                showShips={true}
                interactive={false}
                lastShot={state.lastPlayerShot}
                onCellClick={() => {}}
                variant="red"
              />
              <GameBoard
                title={`Plansza ${player1}`}
                board={state.playerBoard}
                shots={state.computerShots}
                showShips={false}
                interactive={isComputerTurn}
                lastShot={state.lastComputerShot}
                onCellClick={player2Fire}
                variant="blue"
              />
            </>
          )}
        </div>

        {/* Last shot info */}
        {(state.lastPlayerShot || state.lastComputerShot) && (
          <div className="statki-game__last-shot">
            {state.lastPlayerShot && (
              <span className={`statki-game__shot-badge statki-game__shot-badge--${state.lastPlayerShot.result}`}>
                {is2P ? player1 : 'Twój'} strzał:{' '}
                {state.lastPlayerShot.result === 'miss' ? 'Pudło!' : state.lastPlayerShot.result === 'hit' ? 'Trafiony!' : '💥 Zatopiony!'}
              </span>
            )}
            {state.lastComputerShot && (
              <span className={`statki-game__shot-badge statki-game__shot-badge--enemy statki-game__shot-badge--${state.lastComputerShot.result}`}>
                Strzał {player2}:{' '}
                {state.lastComputerShot.result === 'miss' ? 'Pudło!' : state.lastComputerShot.result === 'hit' ? 'Trafił!' : '💥 Zatopił!'}
              </span>
            )}
          </div>
        )}

        {/* Pass device button — appears after miss in 2-player mode */}
        {pendingHandover && (
          <button className="statki-game__pass-btn" onClick={handlePassDevice}>
            Przekaż urządzenie → {pendingTarget}
          </button>
        )}

        {/* Difficulty badge (vs Computer only) */}
        {mode === 'computer' && (
          <div className="statki-game__difficulty">
            Poziom: <strong>{difficulty === 'easy' ? 'Łatwy' : difficulty === 'medium' ? 'Średni' : 'Trudny'}</strong>
          </div>
        )}
      </div>
    </>
  )
}
