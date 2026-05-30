import { useState, useCallback } from 'react'
import wordsData from '../data/words.json'
import type { GameMode, Word, RoundResult } from '../types'

const MAX_MISTAKES = 8
const TOTAL_ROUNDS = 3

function pickRandomWord(usedWords: string[]): Word {
  const words = wordsData.words as Word[]
  const available = words.filter(w => !usedWords.includes(w.word))
  const pool = available.length > 0 ? available : words
  return pool[Math.floor(Math.random() * pool.length)]
}

export type TurnStatus = 'playing' | 'won' | 'lost'
export type GamePhase = 'idle' | 'playing' | 'finished'

export interface GameTurnState {
  mode: GameMode
  currentRound: number       // 1–3
  currentPlayer: 1 | 2
  playerTurnInRound: 1 | 2  // w trybie 2 graczy: 1 = pierwsza połowa rundy, 2 = druga
  word: string
  category: string
  guessedLetters: string[]
  mistakes: number
  maxMistakes: number
  roundResults: RoundResult[]
  usedWords: string[]
}

export interface UseGameReturn {
  turnState: GameTurnState | null
  turnStatus: TurnStatus
  phase: GamePhase
  startGame: (mode: GameMode) => void
  guessLetter: (letter: string) => void
  nextTurn: () => void
}

export function useGame(): UseGameReturn {
  const [turnState, setTurnState] = useState<GameTurnState | null>(null)
  const [turnStatus, setTurnStatus] = useState<TurnStatus>('playing')
  const [phase, setPhase] = useState<GamePhase>('idle')

  const startGame = useCallback((mode: GameMode) => {
    const word = pickRandomWord([])
    setTurnState({
      mode,
      currentRound: 1,
      currentPlayer: 1,
      playerTurnInRound: 1,
      word: word.word,
      category: word.category,
      guessedLetters: [],
      mistakes: 0,
      maxMistakes: MAX_MISTAKES,
      roundResults: [],
      usedWords: [word.word],
    })
    setTurnStatus('playing')
    setPhase('playing')
  }, [])

  const guessLetter = useCallback((letter: string) => {
    if (!turnState || turnStatus !== 'playing') return

    const upper = letter.toUpperCase()
    if (turnState.guessedLetters.includes(upper)) return

    const newGuessed = [...turnState.guessedLetters, upper]
    const isCorrect = turnState.word.includes(upper)
    const newMistakes = isCorrect ? turnState.mistakes : turnState.mistakes + 1

    const uniqueWordLetters = [...new Set(turnState.word.split(''))]
    const wordComplete = uniqueWordLetters.every(l => newGuessed.includes(l))

    setTurnState(prev => prev ? { ...prev, guessedLetters: newGuessed, mistakes: newMistakes } : prev)

    if (wordComplete) {
      setTurnStatus('won')
    } else if (newMistakes >= MAX_MISTAKES) {
      setTurnStatus('lost')
    }
  }, [turnState, turnStatus])

  const nextTurn = useCallback(() => {
    if (!turnState || turnStatus === 'playing') return

    const result: RoundResult = {
      player: turnState.currentPlayer,
      word: turnState.word,
      won: turnStatus === 'won',
      mistakes: turnState.mistakes,
    }
    const newResults = [...turnState.roundResults, result]

    const isTwoPlayer = turnState.mode === '2players'
    // Runda kończy się gdy: tryb 1 gracza (zawsze) lub tryb 2 graczy i grał już gracz 2
    const roundComplete = !isTwoPlayer || turnState.playerTurnInRound === 2

    const totalTurns = isTwoPlayer ? TOTAL_ROUNDS * 2 : TOTAL_ROUNDS
    if (newResults.length >= totalTurns) {
      setTurnState(prev => prev ? { ...prev, roundResults: newResults } : prev)
      setPhase('finished')
      return
    }

    const nextRound = roundComplete ? turnState.currentRound + 1 : turnState.currentRound
    const nextPlayer: 1 | 2 = isTwoPlayer
      ? (turnState.playerTurnInRound === 1 ? 2 : 1)
      : 1
    const nextPlayerTurnInRound: 1 | 2 = isTwoPlayer
      ? (turnState.playerTurnInRound === 1 ? 2 : 1)
      : 1

    const nextWord = pickRandomWord(turnState.usedWords)

    setTurnState({
      ...turnState,
      currentRound: nextRound,
      currentPlayer: nextPlayer,
      playerTurnInRound: nextPlayerTurnInRound,
      word: nextWord.word,
      category: nextWord.category,
      guessedLetters: [],
      mistakes: 0,
      roundResults: newResults,
      usedWords: [...turnState.usedWords, nextWord.word],
    })
    setTurnStatus('playing')
  }, [turnState, turnStatus])

  return { turnState, turnStatus, phase, startGame, guessLetter, nextTurn }
}
