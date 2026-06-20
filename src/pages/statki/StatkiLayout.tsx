import { Outlet } from 'react-router-dom'
import './StatkiLayout.css'

export default function StatkiLayout() {
  return (
    <div className="statki-layout">
      <div className="statki-bg" aria-hidden="true" />
      <div className="statki-content">
        <Outlet />
      </div>
    </div>
  )
}
