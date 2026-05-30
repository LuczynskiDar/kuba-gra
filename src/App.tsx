import { Routes, Route } from 'react-router-dom'
import MenuPage from './pages/MenuPage'
import ModePage from './pages/ModePage'
import GamePage from './pages/GamePage'
import SummaryPage from './pages/SummaryPage'
import './App.css'

function App() {
  return (
    <Routes>
      <Route path="/" element={<MenuPage />} />
      <Route path="/mode" element={<ModePage />} />
      <Route path="/game" element={<GamePage />} />
      <Route path="/summary" element={<SummaryPage />} />
    </Routes>
  )
}

export default App
