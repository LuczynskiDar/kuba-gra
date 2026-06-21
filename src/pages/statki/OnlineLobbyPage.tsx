import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getSocket } from '../../socket'
import './OnlineLobbyPage.css'

type LobbyState = 'form' | 'waiting' | 'error'

export default function OnlineLobbyPage() {
  const navigate = useNavigate()
  const [lobbyState, setLobbyState] = useState<LobbyState>('form')
  const [action, setAction]         = useState<'create' | 'join'>('create')
  const [name, setName]             = useState('')
  const [code, setCode]             = useState('')
  const [roomCode, setRoomCode]     = useState('')
  const [errorMsg, setErrorMsg]     = useState('')
  const [opponentJoined, setOpponentJoined] = useState(false)

  useEffect(() => {
    const socket = getSocket()
    if (!socket.connected) socket.connect()

    socket.on('room-created', ({ code: c }: { code: string }) => {
      setRoomCode(c)
      setLobbyState('waiting')
    })

    socket.on('opponent-joined', ({ opponentName }: { opponentName: string }) => {
      setOpponentJoined(true)
      // Short delay so user sees "opponent joined", then navigate to setup
      setTimeout(() => {
        navigate('/statki/setup', {
          state: {
            mode: '2players-online',
            difficulty: null,
            player1: name.trim(),
            player2: opponentName,
            roomCode: roomCode || code.toUpperCase(),
            playerIndex: 0,
          },
        })
      }, 1200)
    })

    socket.on('room-joined', ({ opponentName, yourIndex }: { opponentName: string; yourIndex: number }) => {
      navigate('/statki/setup', {
        state: {
          mode: '2players-online',
          difficulty: null,
          player1: name.trim(),
          player2: opponentName,
          roomCode: code.toUpperCase(),
          playerIndex: yourIndex,
        },
      })
    })

    socket.on('rejoined', ({ status, turn, yourIndex, opponentName }: {
      status: string; turn: number; yourIndex: number; opponentName: string
    }) => {
      if (status === 'playing' || status === 'setup') {
        navigate('/statki/setup', {
          state: {
            mode: '2players-online',
            difficulty: null,
            player1: name.trim(),
            player2: opponentName,
            roomCode: code.toUpperCase(),
            playerIndex: yourIndex,
            reconnecting: true,
            gameState: { status, turn },
          },
        })
      }
    })

    socket.on('room-error', ({ message }: { message: string }) => {
      setErrorMsg(message)
      setLobbyState('error')
    })

    return () => {
      socket.off('room-created')
      socket.off('opponent-joined')
      socket.off('room-joined')
      socket.off('rejoined')
      socket.off('room-error')
    }
  }, [name, roomCode, code, navigate])

  function handleCreate() {
    if (!name.trim()) return
    const socket = getSocket()
    socket.emit('create-room', { name: name.trim() })
  }

  function handleJoin() {
    if (!name.trim() || code.trim().length < 8) return
    const socket = getSocket()
    socket.emit('join-room', { code: code.trim().toUpperCase(), name: name.trim() })
  }

  return (
    <div className="online-lobby">
      {lobbyState === 'form' && (
        <div className="online-lobby__box">
          <h2 className="online-lobby__title">2 Graczy Online</h2>

          <div className="online-lobby__field">
            <label>Twoje imię</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Wpisz imię..."
              maxLength={20}
              autoFocus
            />
          </div>

          <div className="online-lobby__tabs">
            <button
              className={`online-lobby__tab${action === 'create' ? ' online-lobby__tab--active' : ''}`}
              onClick={() => setAction('create')}
            >Utwórz grę</button>
            <button
              className={`online-lobby__tab${action === 'join' ? ' online-lobby__tab--active' : ''}`}
              onClick={() => setAction('join')}
            >Dołącz do gry</button>
          </div>

          {action === 'create' ? (
            <button
              className="online-lobby__btn-primary"
              onClick={handleCreate}
              disabled={!name.trim()}
            >
              Utwórz grę →
            </button>
          ) : (
            <>
              <div className="online-lobby__field">
                <label>Kod pokoju</label>
                <input
                  type="text"
                  value={code}
                  onChange={e => setCode(e.target.value.toUpperCase())}
                  placeholder="ABCD1234"
                  maxLength={8}
                  className="online-lobby__code-input"
                />
              </div>
              <button
                className="online-lobby__btn-primary"
                onClick={handleJoin}
                disabled={!name.trim() || code.trim().length < 8}
              >
                Dołącz →
              </button>
            </>
          )}

          <button className="statki-btn-back" onClick={() => navigate('/statki/mode')}>← Wróć</button>
        </div>
      )}

      {lobbyState === 'waiting' && (
        <div className="online-lobby__box">
          <h2 className="online-lobby__title">
            {opponentJoined ? '✓ Przeciwnik dołączył!' : 'Oczekuję na gracza...'}
          </h2>
          {!opponentJoined && (
            <>
              <p className="online-lobby__hint">Podaj ten kod przeciwnikowi:</p>
              <div className="online-lobby__room-code">{roomCode}</div>
              <p className="online-lobby__hint online-lobby__hint--small">
                Przeciwnik wchodzi na stronę, wybiera „2 Graczy Online" i wpisuje kod
              </p>
              <div className="online-lobby__spinner" />
            </>
          )}
          {opponentJoined && (
            <p className="online-lobby__hint">Przechodzę do ustawiania statków...</p>
          )}
        </div>
      )}

      {lobbyState === 'error' && (
        <div className="online-lobby__box">
          <h2 className="online-lobby__title online-lobby__title--error">Błąd</h2>
          <p className="online-lobby__hint">{errorMsg}</p>
          <button className="online-lobby__btn-primary" onClick={() => setLobbyState('form')}>
            Spróbuj ponownie
          </button>
        </div>
      )}
    </div>
  )
}
