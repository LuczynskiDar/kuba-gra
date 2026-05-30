export type GameMode = '1player' | '2players'

export type Category = 'zwierzęta' | 'owoce' | 'szkoła' | 'sport'

export interface Word {
  word: string
  category: Category
}

export interface RoundResult {
  player: 1 | 2
  word: string
  won: boolean
  mistakes: number
}

export interface GameState {
  mode: GameMode
  currentRound: number
  totalRounds: number
  currentPlayer: 1 | 2
  word: string
  category: Category
  guessedLetters: string[]
  mistakes: number
  maxMistakes: number
  roundResults: RoundResult[]
}
