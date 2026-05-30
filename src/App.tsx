import { Routes, Route } from 'react-router-dom'
import CinemaBackground from './components/CinemaBackground'
import MenuPage from './pages/MenuPage'
import ModePage from './pages/ModePage'
import GamePage from './pages/GamePage'
import SummaryPage from './pages/SummaryPage'
import './components/CinemaBackground.css'
import './App.css'

function App() {
  return (
    <>
      <CinemaBackground />
      <div className="app-content">
        <Routes>
          <Route path="/" element={<MenuPage />} />
          <Route path="/mode" element={<ModePage />} />
          <Route path="/game" element={<GamePage />} />
          <Route path="/summary" element={<SummaryPage />} />
        </Routes>
      </div>
    </>
  )
}

export default App
