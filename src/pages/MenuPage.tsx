import { useNavigate } from 'react-router-dom'
import './MenuPage.css'

export default function MenuPage() {
  const navigate = useNavigate()

  return (
    <div className="menu-page">
      <h1>Wisielec</h1>
      <button onClick={() => navigate('/mode')}>Zagraj</button>
    </div>
  )
}
