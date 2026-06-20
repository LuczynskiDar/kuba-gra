import { Routes, Route } from 'react-router-dom'
import MainMenuPage from './pages/MainMenuPage'
import WisielecLayout from './pages/wisielec/WisielecLayout'
import WisielecMenuPage from './pages/wisielec/MenuPage'
import ModePage from './pages/wisielec/ModePage'
import GamePage from './pages/wisielec/GamePage'
import SummaryPage from './pages/wisielec/SummaryPage'
import StatkiLayout from './pages/statki/StatkiLayout'
import StatkiMenuPage from './pages/statki/MenuPage'
import StatkiModePage from './pages/statki/ModePage'
import StatkiSetupPage from './pages/statki/SetupPage'
import StatkiGamePage from './pages/statki/GamePage'
import StatkiSummaryPage from './pages/statki/SummaryPage'
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

      <Route element={<StatkiLayout />}>
        <Route path="/statki" element={<StatkiMenuPage />} />
        <Route path="/statki/mode" element={<StatkiModePage />} />
        <Route path="/statki/setup" element={<StatkiSetupPage />} />
        <Route path="/statki/game" element={<StatkiGamePage />} />
        <Route path="/statki/summary" element={<StatkiSummaryPage />} />
      </Route>
    </Routes>
  )
}

export default App
