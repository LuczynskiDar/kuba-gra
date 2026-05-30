import { useNavigate } from 'react-router-dom'

export default function MenuPage() {
  const navigate = useNavigate()

  return (
    <div className="menu-page">
      <h1>Wisielec</h1>
      <button onClick={() => navigate('/mode')}>Zagraj</button>
    </div>
  )
}
