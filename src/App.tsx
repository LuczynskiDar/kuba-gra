import { Routes, Route } from 'react-router-dom'
import MainMenuPage from './pages/MainMenuPage'
import WisielecLayout from './pages/wisielec/WisielecLayout'
import WisielecMenuPage from './pages/wisielec/MenuPage'
import ModePage from './pages/wisielec/ModePage'
import GamePage from './pages/wisielec/GamePage'
import SummaryPage from './pages/wisielec/SummaryPage'
import './App.css'

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainMenuPage />} />

      <Route element={<WisielecLayout />}>
        <Route path="/wisielec" element={<WisielecMenuPage />} />
        <Route path="/wisielec/mode" element={<ModePage />} />
        <Route path="/wisielec/game" element={<GamePage />} />
        <Route path="/wisielec/summary" element={<SummaryPage />} />
      </Route>
    </Routes>
  )
}

export default App
