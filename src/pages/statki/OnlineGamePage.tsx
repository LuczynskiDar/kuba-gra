import { useEffect, useRef, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import type { BoardGrid, ShipDef } from '../../types/statki'
import type { ShotGrid, LastShot } from '../../utils/battleshipUtils'
import { createEmptyBoard } from '../../utils/battleshipUtils'
import { createEmptyShotGrid, processShot, isAllSunk } from '../../utils/battleshipUtils'
import { getSocket } from '../../socket'
import GameBoard from '../../components/statki/GameBoard'
import './GamePage.css'

interface OnlineRouteState {
  roomCode: string
  playerIndex: 0 | 1
  playerName: string
  opponentName: string
  playerFleet: ShipDef[]
  playerBoard: BoardGrid
  firstTurn: 0 | 1
}

type GameStatus = 'playing' | 'won' | 'lost'

export default function OnlineGamePage() {
  const navigate    = useNavigate()
  const location    = useLocation()
  const routeState  = location.state as OnlineRouteState | null

  useEffect(() => {
    if (!routeState) navigate('/statki')
  }, []) // eslint-disable-line

  const { roomCode, playerIndex, playerName, opponentName, playerFleet, playerBoard, firstTurn }
    = routeState ?? { roomCode: '', playerIndex: 0 as const, playerName: '', opponentName: '',
        playerFleet: [], playerBoard: [], firstTurn: 0 as const }

  // My board / fleet stored in refs (stable across renders)
  const myBoardRef  = useRef<BoardGrid>(playerBoard)
  const myFleetRef  = useRef<ShipDef[]>(playerFleet)

  // Shot grids
  const [myShots, setMyShots]               = useState<ShotGrid>(createEmptyShotGrid)
  const [opponentShots, setOpponentShots]   = useState<ShotGrid>(createEmptyShotGrid)
  const opponentShotsRef                    = useRef<ShotGrid>(createEmptyShotGrid())

  // Game state
  const [turn, setTurn]                     = useState<0 | 1>(firstTurn)
  const [status, setStatus]                 = useState<GameStatus>('playing')
  const [lastMyShot, setLastMyShot]         = useState<LastShot | null>(null)
  const [lastOpponentShot, setLastOpponentShot] = useState<LastShot | null>(null)
  const [pendingFire, setPendingFire]       = useState(false)
  const [disconnected, setDisconnected]     = useState(false)
  const [mySunkCount, setMySunkCount]       = useState(0)
  const [opponentSunkCount, setOpponentSunkCount] = useState(0)

  const opponentIndex = (1 - playerIndex) as 0 | 1

  useEffect(() => {
    if (!routeState) return
    const socket = getSocket()

    // Opponent fires at my board
    socket.on('incoming-fire', ({ row, col }: { row: number; col: number }) => {
      const { newShots, result } = processShot(
        myBoardRef.current, myFleetRef.current, opponentShotsRef.current, row, col
      )
      opponentShotsRef.current = newShots
      setOpponentShots([...newShots])
      setLastOpponentShot({ row, col, result })
      const gameOver = isAllSunk(myFleetRef.current, newShots)
      socket.emit('fire-result', { code: roomCode, row, col, result, updatedShots: newShots, gameOver })
      if (gameOver) setStatus('lost')
    })

    // My shot was confirmed by opponent
    socket.on('fire-confirmed', ({ row, col, result, updatedShots, yourTurn, gameOver }: {
      row: number; col: number; result: 'miss'|'hit'|'sunk'
      updatedShots: ShotGrid; yourTurn: boolean; gameOver: boolean
    }) => {
      setMyShots(updatedShots)
      setLastMyShot({ row, col, result })
      setPendingFire(false)
      // Sunk count updated via separate useEffect on myShots
      if (gameOver) {
        setStatus('won')
      } else if (!yourTurn) {
        setTurn(opponentIndex)
      }
    })

    // It's my turn now (after opponent missed)
    socket.on('your-turn', () => {
      setTurn(playerIndex)
    })

    // Game over notification
    socket.on('game-over', ({ winnerIndex }: { winnerIndex: number }) => {
      setStatus(winnerIndex === playerIndex ? 'won' : 'lost')
    })

    socket.on('opponent-disconnected', () => setDisconnected(true))
    socket.on('opponent-reconnected',  () => setDisconnected(false))

    return () => {
      socket.off('incoming-fire')
      socket.off('fire-confirmed')
      socket.off('your-turn')
      socket.off('game-over')
      socket.off('opponent-disconnected')
      socket.off('opponent-reconnected')
    }
  }, []) // eslint-disable-line

  // Track my sunk count from opponentShots
  useEffect(() => {
    const sunk = opponentShots.flat().filter(s => s === 'sunk').length
    // Each sunk ship contributes its size; we just show sunk ship count
    // Use fleet to compute properly
    const sunkShips = myFleetRef.current.filter(ship => {
      if (ship.startRow === null || ship.startCol === null) return false
      const size = ship.size
      let sunkCount = 0
      const orientation = ship.orientation
      for (let i = 0; i < size; i++) {
        const r = orientation === 'vertical' ? ship.startRow + i : ship.startRow
        const c = orientation === 'horizontal' ? ship.startCol + i : ship.startCol
        if (opponentShots[r]?.[c] === 'sunk') sunkCount++
      }
      return sunkCount === size
    }).length
    setMySunkCount(sunkShips)
  }, [opponentShots])

  // Navigate to summary after game ends
  useEffect(() => {
    if (status === 'playing') return
    const timer = setTimeout(() => {
      const shots  = myShots.flat()
      const fired  = shots.filter(s => s !== 'none' && s !== 'border').length
      const hits   = shots.filter(s => s === 'hit' || s === 'sunk').length
      navigate('/statki/summary', {
        state: {
          mode: '2players-online',
          difficulty: null,
          player1: playerName,
          player2: opponentName,
          winner: status === 'won' ? playerName : opponentName,
          playerShots:    fired,
          playerAccuracy: fired > 0 ? Math.round(hits / fired * 100) : 0,
          computerShots:    0,
          computerAccuracy: 0,
          isOnlineWinner: status === 'won',
        }
      })
    }, 2200)
    return () => clearTimeout(timer)
  }, [status]) // eslint-disable-line

  function handleFire(row: number, col: number) {
    if (turn !== playerIndex || status !== 'playing' || pendingFire) return
    if (myShots[row][col] !== 'none') return
    setPendingFire(true)
    getSocket().emit('fire', { code: roomCode, row, col })
  }

  if (!routeState) return null

  const isMyTurn = turn === playerIndex && status === 'playing' && !pendingFire
  const totalShips = myFleetRef.current.length

  return (
    <div className="statki-game">
      {disconnected && (
        <div className="statki-game__disconnect-banner">
          ⚠️ Przeciwnik rozłączył się. Oczekuję na powrót...
        </div>
      )}

      {/* Status */}
      <div className={`statki-game__status statki-game__status--${
        status === 'playing'
          ? (isMyTurn || pendingFire ? 'player' : 'computer')
          : (status === 'won' ? 'player-won' : 'computer-won')
      }`}>
        {status === 'won'  && `🏆 Wygrałeś, ${playerName}!`}
        {status === 'lost' && `🏆 Wygrał ${opponentName}!`}
        {status === 'playing' && (isMyTurn || pendingFire) && `🎯 Twoja tura, ${playerName} — wybierz cel`}
        {status === 'playing' && !isMyTurn && !pendingFire && `⏳ ${opponentName} celuje...`}
      </div>

      {/* Scoreboard */}
      <div className="statki-game__score">
        <div className="statki-game__score-player">
          <span className="statki-game__score-name">{playerName}</span>
          <span className="statki-game__score-sunk">{opponentSunkCount} / {totalShips} zatopionych</span>
        </div>
        <span className="statki-game__score-vs">vs</span>
        <div className="statki-game__score-player statki-game__score-player--right">
          <span className="statki-game__score-name">{opponentName}</span>
          <span className="statki-game__score-sunk">{mySunkCount} / {totalShips} zatopionych</span>
        </div>
      </div>

      {/* Boards */}
      <div className="statki-game__boards">
        <GameBoard
          title={`Twoja plansza — ${playerName}`}
          board={myBoardRef.current}
          shots={opponentShots}
          showShips={true}
          interactive={false}
          lastShot={lastOpponentShot}
          onCellClick={() => {}}
          variant={playerIndex === 0 ? 'blue' : 'red'}
        />
        <GameBoard
          title={`Plansza ${opponentName}`}
          board={createEmptyBoard()}
          shots={myShots}
          showShips={false}
          interactive={isMyTurn}
          lastShot={lastMyShot}
          onCellClick={handleFire}
          variant={playerIndex === 0 ? 'red' : 'blue'}
        />
      </div>

      {/* Last shot info */}
      {(lastMyShot || lastOpponentShot) && (
        <div className="statki-game__last-shot">
          {lastMyShot && (
            <span className={`statki-game__shot-badge statki-game__shot-badge--${lastMyShot.result}`}>
              Twój strzał:{' '}
              {lastMyShot.result === 'miss' ? 'Pudło!' : lastMyShot.result === 'hit' ? 'Trafiony!' : '💥 Zatopiony!'}
            </span>
          )}
          {lastOpponentShot && (
            <span className={`statki-game__shot-badge statki-game__shot-badge--enemy statki-game__shot-badge--${lastOpponentShot.result}`}>
              Strzał {opponentName}:{' '}
              {lastOpponentShot.result === 'miss' ? 'Pudło!' : lastOpponentShot.result === 'hit' ? 'Trafił!' : '💥 Zatopił!'}
            </span>
          )}
        </div>
      )}
    </div>
  )
}
