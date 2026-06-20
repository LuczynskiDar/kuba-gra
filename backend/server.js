const express = require('express')
const cors    = require('cors')
const Database = require('better-sqlite3')
const path    = require('path')
const fs      = require('fs')

const PORT    = process.env.PORT || 3001
const DB_DIR  = process.env.DB_DIR || path.join(__dirname, 'data')
const DB_PATH = path.join(DB_DIR, 'results.db')
const MAX_ROWS = 30

// Ensure data directory exists
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

// Prepared statements
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

// Insert + trim wrapped in a transaction
const saveSolo = db.transaction((row) => {
  stmts.insertSolo.run(row)
  stmts.trimSolo.run()
})
const saveMulti = db.transaction((row) => {
  stmts.insertMulti.run(row)
  stmts.trimMulti.run()
})

// --- App --------------------------------------------------------------------
const app = express()
app.use(cors())
app.use(express.json())

// Health check
app.get('/api/health', (_req, res) => res.json({ ok: true }))

// POST /api/results
app.post('/api/results', (req, res) => {
  const { mode, player, opponent, result, difficulty, accuracy, shots } = req.body

  if (!player || !opponent || !result || accuracy == null || shots == null) {
    return res.status(400).json({ error: 'Missing required fields' })
  }
  if (!['W', 'L'].includes(result)) {
    return res.status(400).json({ error: 'result must be W or L' })
  }

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

// GET /api/results/solo
app.get('/api/results/solo', (_req, res) => {
  try {
    res.json(stmts.getSolo.all())
  } catch (err) {
    console.error('DB error:', err)
    res.status(500).json({ error: 'Database error' })
  }
})

// GET /api/results/multiplayer
app.get('/api/results/multiplayer', (_req, res) => {
  try {
    res.json(stmts.getMulti.all())
  } catch (err) {
    console.error('DB error:', err)
    res.status(500).json({ error: 'Database error' })
  }
})

app.listen(PORT, () => console.log(`Backend running on port ${PORT}`))
