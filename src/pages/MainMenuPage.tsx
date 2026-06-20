import GameCard from '../components/GameCard'
import './MainMenuPage.css'

function HangmanIcon() {
  return (
    <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Szubienica */}
      <line x1="20" y1="110" x2="100" y2="110" stroke="#c8a050" strokeWidth="4" strokeLinecap="round"/>
      <line x1="35" y1="110" x2="35" y2="10" stroke="#c8a050" strokeWidth="4" strokeLinecap="round"/>
      <line x1="35" y1="10" x2="70" y2="10" stroke="#c8a050" strokeWidth="4" strokeLinecap="round"/>
      <line x1="70" y1="10" x2="70" y2="22" stroke="#c8a050" strokeWidth="3" strokeLinecap="round"/>
      {/* Głowa */}
      <circle cx="70" cy="32" r="10" stroke="#fff" strokeWidth="3"/>
      {/* Tułów */}
      <line x1="70" y1="42" x2="70" y2="72" stroke="#fff" strokeWidth="3" strokeLinecap="round"/>
      {/* Ręce */}
      <line x1="70" y1="52" x2="52" y2="64" stroke="#fff" strokeWidth="3" strokeLinecap="round"/>
      <line x1="70" y1="52" x2="88" y2="64" stroke="#fff" strokeWidth="3" strokeLinecap="round"/>
      {/* Nogi */}
      <line x1="70" y1="72" x2="54" y2="90" stroke="#fff" strokeWidth="3" strokeLinecap="round"/>
      <line x1="70" y1="72" x2="86" y2="90" stroke="#fff" strokeWidth="3" strokeLinecap="round"/>
    </svg>
  )
}

function BattleshipIcon() {
  return (
    <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Woda */}
      <path d="M10 85 Q30 78 50 85 Q70 92 90 85 Q110 78 120 85 L120 110 L10 110 Z" fill="#1a6b9a" opacity="0.6"/>
      <path d="M0 90 Q20 83 40 90 Q60 97 80 90 Q100 83 120 90 L120 110 L0 110 Z" fill="#0d4f7a" opacity="0.8"/>
      {/* Kadłub */}
      <path d="M25 85 L20 70 L100 70 L95 85 Z" fill="#5a8fa0"/>
      <rect x="30" y="50" width="60" height="20" rx="3" fill="#4a7f90"/>
      {/* Wieżyczki */}
      <rect x="42" y="38" width="18" height="14" rx="2" fill="#3a6f80"/>
      <rect x="65" y="42" width="14" height="10" rx="2" fill="#3a6f80"/>
      {/* Lufy */}
      <line x1="51" y1="38" x2="51" y2="26" stroke="#2a5060" strokeWidth="4" strokeLinecap="round"/>
      <line x1="72" y1="42" x2="72" y2="32" stroke="#2a5060" strokeWidth="3" strokeLinecap="round"/>
      {/* Maszt */}
      <line x1="60" y1="50" x2="60" y2="20" stroke="#2a5060" strokeWidth="2"/>
      <polygon points="60,20 60,34 72,27" fill="#e05050" opacity="0.9"/>
    </svg>
  )
}

export default function MainMenuPage() {
  return (
    <div className="main-menu">
      <h1 className="main-menu__title">Nasze Gry</h1>
      <div className="main-menu__cards">
        <GameCard
          title="Wisielec"
          authors="Kuba i Darek"
          path="/wisielec"
          icon={<HangmanIcon />}
        />
        <GameCard
          title="Bitwa Statków"
          authors="Darek i Tomek"
          path="/statki"
          icon={<BattleshipIcon />}
        />
      </div>
    </div>
  )
}
