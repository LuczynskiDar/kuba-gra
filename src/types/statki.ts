export type Orientation = 'horizontal' | 'vertical'
export type GameMode = 'computer' | '2players-local' | '2players-online'
export type Difficulty = 'easy' | 'medium' | 'hard'

export interface ShipDef {
  id: string
  name: string
  size: number
  orientation: Orientation
  placed: boolean
  startRow: number | null
  startCol: number | null
}

export type BoardGrid = (string | null)[][]
