import './WordDisplay.css'

interface WordDisplayProps {
  word: string
  guessedLetters: string[]
  revealed: boolean // true = pokaż całe słowo (po przegranej)
  category: string
}

export default function WordDisplay({ word, guessedLetters, revealed, category }: WordDisplayProps) {
  return (
    <div className="word-display">
      <p className="word-category">Kategoria: <strong>{category}</strong></p>
      <div className="word-letters">
        {word.split('').map((letter, index) => {
          const isGuessed = guessedLetters.includes(letter)
          const show = isGuessed || revealed

          return (
            <div
              key={index}
              className={`letter-box ${show ? 'revealed' : ''} ${revealed && !isGuessed ? 'missed' : ''}`}
            >
              <span className="letter-char">{show ? letter : ''}</span>
              <span className="letter-line" />
            </div>
          )
        })}
      </div>
    </div>
  )
}
