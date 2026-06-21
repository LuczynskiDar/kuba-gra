import { useNavigate } from 'react-router-dom'
import './MenuPage.css'

export default function StatkiMenuPage() {
  const navigate = useNavigate()

  return (
    <div className="statki-menu">
      <div className="statki-menu__ship" aria-hidden="true">
        <svg viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M40 95 L30 70 L170 70 L160 95 Z" fill="#5a8fa0"/>
          <rect x="50" y="42" width="100" height="30" rx="4" fill="#4a7f90"/>
          <rect x="65" y="24" width="30" height="20" rx="3" fill="#3a6f80"/>
          <rect x="105" y="30" width="24" height="14" rx="2" fill="#3a6f80"/>
          <line x1="80" y1="24" x2="80" y2="6"  stroke="#2a5060" strokeWidth="5" strokeLinecap="round"/>
          <line x1="117" y1="30" x2="117" y2="16" stroke="#2a5060" strokeWidth="4" strokeLinecap="round"/>
          <line x1="100" y1="42" x2="100" y2="10" stroke="#2a5060" strokeWidth="2"/>
          <polygon points="100,10 100,28 118,19" fill="#e05050" opacity="0.9"/>
          <ellipse cx="100" cy="108" rx="80" ry="12" fill="#0a6694" opacity="0.5"/>
        </svg>
      </div>

      <h1 className="statki-menu__title">Bitwa Statków</h1>
      <p className="statki-menu__authors">Darek i Tomek</p>

      <div className="statki-menu__actions">
        <button className="statki-btn-primary" onClick={() => navigate('/statki/mode')}>
          Zagraj
        </button>
        <button className="statki-btn-secondary" onClick={() => navigate('/statki/results')}>
          Tabela wyników
        </button>
        <button className="statki-btn-back" onClick={() => navigate('/')}>
          ← Menu główne
        </button>
      </div>
    </div>
  )
}
