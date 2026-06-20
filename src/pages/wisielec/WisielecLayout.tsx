import { Outlet } from 'react-router-dom'
import CinemaBackground from '../../components/wisielec/CinemaBackground'
import '../../components/wisielec/CinemaBackground.css'

export default function WisielecLayout() {
  return (
    <>
      <CinemaBackground />
      <div className="app-content">
        <Outlet />
      </div>
    </>
  )
}
