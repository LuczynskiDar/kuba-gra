import './Keyboard.css'

interface KeyboardProps {
  guessedLetters: string[]
  word: string
  onGuess: (letter: string) => void
  disabled: boolean
}

const POLISH_ALPHABET = [
  ['A', 'Ą', 'B', 'C', 'Ć', 'D', 'E', 'Ę', 'F'],
  ['G', 'H', 'I', 'J', 'K', 'L', 'Ł', 'M', 'N'],
  ['Ń', 'O', 'Ó', 'P', 'R', 'S', 'Ś', 'T', 'U'],
  ['W', 'Y', 'Z', 'Ź', 'Ż'],
]

export default function Keyboard({ guessedLetters, word, onGuess, disabled }: KeyboardProps) {
  const getStatus = (letter: string) => {
    if (!guessedLetters.includes(letter)) return 'idle'
    return word.includes(letter) ? 'correct' : 'wrong'
  }

  return (
    <div className="keyboard">
      {POLISH_ALPHABET.map((row, rowIndex) => (
        <div key={rowIndex} className="keyboard-row">
          {row.map(letter => {
            const status = getStatus(letter)
            const isUsed = status !== 'idle'

            return (
              <button
                key={letter}
                className={`key key--${status}`}
                onClick={() => onGuess(letter)}
                disabled={disabled || isUsed}
                aria-label={`Litera ${letter}`}
              >
                {letter}
              </button>
            )
          })}
        </div>
      ))}
    </div>
  )
}
