import { useNavigate } from 'react-router-dom'
import './MenuPage.css'

export default function MenuPage() {
  const navigate = useNavigate()

  return (
    <div className="menu-page">
      <h1>Wisielec</h1>
      <button onClick={() => navigate('/wisielec/mode')}>Zagraj</button>
      <button className="btn-back" onClick={() => navigate('/')}>← Menu główne</button>
      <p className="menu-authors">Gra Kuby i Darka</p>
    </div>
  )
}
