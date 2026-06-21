const http    = require('http')
const express = require('express')
const cors    = require('cors')
const { Server } = require('socket.io')
const Database = require('better-sqlite3')
const path    = require('path')
const fs      = require('fs')

const PORT    = process.env.PORT || 3001
const DB_DIR  = process.env.DB_DIR || path.join(__dirname, 'data')
const DB_PATH = path.join(DB_DIR, 'results.db')
const MAX_ROWS = 30

fs.mkdirSync(DB_DIR, { recursive: true })
const db = new Database(DB_PATH)

// --- Schema -----------------------------------------------------------------
db.exec(`
  CREATE TABLE IF NOT EXISTS results_solo (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    player     TEXT    NOT NULL,
    opponent   TEXT    NOT NULL,
    result     TEXT    NOT NULL,
    difficulty TEXT    NOT NULL,
    accuracy   INTEGER NOT NULL,
    shots      INTEGER NOT NULL,
    played_at  TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))
  );

  CREATE TABLE IF NOT EXISTS results_multiplayer (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    player     TEXT    NOT NULL,
    opponent   TEXT    NOT NULL,
    result     TEXT    NOT NULL,
    accuracy   INTEGER NOT NULL,
    shots      INTEGER NOT NULL,
    played_at  TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))
  );
`)

const stmts = {
  insertSolo: db.prepare(`
    INSERT INTO results_solo (player, opponent, result, difficulty, accuracy, shots)
    VALUES (@player, @opponent, @result, @difficulty, @accuracy, @shots)
  `),
  trimSolo: db.prepare(`
    DELETE FROM results_solo WHERE id NOT IN (
      SELECT id FROM results_solo ORDER BY id DESC LIMIT ${MAX_ROWS}
    )
  `),
  getSolo: db.prepare(`
    SELECT id, player, opponent, result, difficulty, accuracy, shots, played_at
    FROM results_solo ORDER BY id DESC LIMIT ${MAX_ROWS}
  `),
  insertMulti: db.prepare(`
    INSERT INTO results_multiplayer (player, opponent, result, accuracy, shots)
    VALUES (@player, @opponent, @result, @accuracy, @shots)
  `),
  trimMulti: db.prepare(`
    DELETE FROM results_multiplayer WHERE id NOT IN (
      SELECT id FROM results_multiplayer ORDER BY id DESC LIMIT ${MAX_ROWS}
    )
  `),
  getMulti: db.prepare(`
    SELECT id, player, opponent, result, accuracy, shots, played_at
    FROM results_multiplayer ORDER BY id DESC LIMIT ${MAX_ROWS}
  `),
}

const saveSolo  = db.transaction(row => { stmts.insertSolo.run(row);  stmts.trimSolo.run()  })
const saveMulti = db.transaction(row => { stmts.insertMulti.run(row); stmts.trimMulti.run() })

// --- Express ----------------------------------------------------------------
const app    = express()
const server = http.createServer(app)
const io     = new Server(server, { cors: { origin: '*' } })

app.use(cors())
app.use(express.json())

app.get('/api/health', (_req, res) => res.json({ ok: true }))

app.post('/api/results', (req, res) => {
  const { mode, player, opponent, result, difficulty, accuracy, shots } = req.body
  if (!player || !opponent || !result || accuracy == null || shots == null)
    return res.status(400).json({ error: 'Missing required fields' })
  if (!['W', 'L'].includes(result))
    return res.status(400).json({ error: 'result must be W or L' })
  try {
    if (mode === 'solo') {
      if (!difficulty) return res.status(400).json({ error: 'difficulty required for solo' })
      saveSolo({ player, opponent, result, difficulty, accuracy: Number(accuracy), shots: Number(shots) })
    } else {
      saveMulti({ player, opponent, result, accuracy: Number(accuracy), shots: Number(shots) })
    }
    res.status(201).json({ ok: true })
  } catch (err) {
    console.error('DB error:', err)
    res.status(500).json({ error: 'Database error' })
  }
})

app.get('/api/results/solo', (_req, res) => {
  try { res.json(stmts.getSolo.all()) }
  catch (err) { console.error('DB error:', err); res.status(500).json({ error: 'Database error' }) }
})

app.get('/api/results/multiplayer', (_req, res) => {
  try { res.json(stmts.getMulti.all()) }
  catch (err) { console.error('DB error:', err); res.status(500).json({ error: 'Database error' }) }
})

// --- Socket.io rooms --------------------------------------------------------
const rooms = new Map()

function generateCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  return Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

io.on('connection', socket => {
  socket.on('create-room', ({ name }) => {
    let code
    do { code = generateCode() } while (rooms.has(code))
    rooms.set(code, {
      code,
      players: [{ id: socket.id, name, ready: false }],
      status: 'waiting',
      turn: 0,
    })
    socket.join(code)
    socket.data.code = code
    socket.data.index = 0
    socket.emit('room-created', { code })
    console.log(`Room ${code} created by ${name}`)
  })

  socket.on('join-room', ({ code, name }) => {
    const key = code?.toUpperCase?.()
    const room = rooms.get(key)
    if (!room) {
      socket.emit('room-error', { message: 'Nie znaleziono pokoju o tym kodzie.' })
      return
    }
    // Reconnect: existing player with same name reconnects
    const existing = room.players.find(p => p.name === name && !p.id)
    if (existing) {
      existing.id = socket.id
      socket.join(key)
      socket.data.code = key
      socket.data.index = room.players.indexOf(existing)
      const opponent = room.players[1 - socket.data.index]
      socket.emit('rejoined', {
        status: room.status,
        turn: room.turn,
        yourIndex: socket.data.index,
        opponentName: opponent?.name ?? '',
      })
      if (opponent?.id) io.to(opponent.id).emit('opponent-reconnected')
      return
    }
    if (room.status !== 'waiting') {
      socket.emit('room-error', { message: 'Gra już trwa lub pokój jest pełny.' })
      return
    }
    if (room.players.length >= 2) {
      socket.emit('room-error', { message: 'Pokój jest pełny.' })
      return
    }
    room.players.push({ id: socket.id, name, ready: false })
    room.status = 'setup'
    socket.join(key)
    socket.data.code = key
    socket.data.index = 1
    socket.emit('room-joined', { opponentName: room.players[0].name, yourIndex: 1 })
    io.to(room.players[0].id).emit('opponent-joined', { opponentName: name })
    console.log(`${name} joined room ${key}`)
  })

  socket.on('fleet-ready', ({ code }) => {
    const room = rooms.get(code)
    if (!room) return
    const idx = room.players.findIndex(p => p.id === socket.id)
    if (idx === -1) return
    room.players[idx].ready = true
    if (room.players.length === 2 && room.players.every(p => p.ready)) {
      room.status = 'playing'
      room.turn = 0
      io.to(code).emit('game-start', { firstTurn: 0 })
      console.log(`Game started in room ${code}`)
    }
  })

  socket.on('fire', ({ code, row, col }) => {
    const room = rooms.get(code)
    if (!room || room.status !== 'playing') return
    const attackerIdx = room.players.findIndex(p => p.id === socket.id)
    if (attackerIdx !== room.turn) return
    const defender = room.players[1 - attackerIdx]
    if (defender?.id) io.to(defender.id).emit('incoming-fire', { row, col })
  })

  socket.on('fire-result', ({ code, row, col, result, updatedShots, gameOver }) => {
    const room = rooms.get(code)
    if (!room || room.status !== 'playing') return
    const defenderIdx = room.players.findIndex(p => p.id === socket.id)
    if (defenderIdx === -1) return
    const attackerIdx = 1 - defenderIdx
    const attacker = room.players[attackerIdx]

    if (result === 'miss') room.turn = defenderIdx

    if (gameOver) {
      room.status = 'finished'
      io.to(code).emit('game-over', { winnerIndex: attackerIdx })
      console.log(`Game over in room ${code}, winner: player ${attackerIdx}`)
    } else {
      if (attacker?.id) {
        io.to(attacker.id).emit('fire-confirmed', {
          row, col, result, updatedShots, yourTurn: result !== 'miss',
        })
      }
      if (result === 'miss') {
        socket.emit('your-turn')
      }
    }
  })

  socket.on('disconnect', () => {
    const code = socket.data?.code
    if (!code) return
    const room = rooms.get(code)
    if (!room) return
    const idx = room.players.findIndex(p => p.id === socket.id)
    if (idx === -1) return
    room.players[idx].id = null
    const opponent = room.players[1 - idx]
    if (opponent?.id) io.to(opponent.id).emit('opponent-disconnected')
    console.log(`Player ${room.players[idx].name} disconnected from room ${code}`)
    // Clean up finished/empty rooms after a delay
    setTimeout(() => {
      if (rooms.has(code) && room.players.every(p => !p.id)) {
        rooms.delete(code)
        console.log(`Room ${code} cleaned up`)
      }
    }, 60000)
  })
})

server.listen(PORT, () => console.log(`Backend running on port ${PORT}`))
