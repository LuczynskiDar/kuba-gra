import { useNavigate } from 'react-router-dom'
import './GameCard.css'

interface GameCardProps {
  title: string
  authors: string
  path: string
  icon: React.ReactNode
}

export default function GameCard({ title, authors, path, icon }: GameCardProps) {
  const navigate = useNavigate()

  return (
    <button className="game-card" onClick={() => navigate(path)}>
      <div className="game-card__icon">{icon}</div>
      <div className="game-card__info">
        <h2 className="game-card__title">{title}</h2>
        <p className="game-card__authors">{authors}</p>
      </div>
    </button>
  )
}
