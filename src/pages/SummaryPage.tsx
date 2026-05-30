import { useNavigate } from 'react-router-dom'

export default function SummaryPage() {
  const navigate = useNavigate()

  return (
    <div className="summary-page">
      <h2>Podsumowanie — w budowie</h2>
      <button onClick={() => navigate('/')}>Menu główne</button>
    </div>
  )
}
