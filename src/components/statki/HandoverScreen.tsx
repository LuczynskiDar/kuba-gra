import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import './HandoverScreen.css'

interface HandoverScreenProps {
  playerName: string
  onReady: () => void
}

export default function HandoverScreen({ playerName, onReady }: HandoverScreenProps) {
  const [count, setCount] = useState(3)

  useEffect(() => {
    setCount(3)
  }, [playerName])

  useEffect(() => {
    if (count <= 0) return
    const t = setTimeout(() => setCount(c => c - 1), 1000)
    return () => clearTimeout(t)
  }, [count])

  return createPortal(
    <div className="handover">
      <div className="handover__box">
        <p className="handover__label">Przekaż urządzenie</p>
        <h2 className="handover__name">{playerName}</h2>
        {count > 0
          ? <div className="handover__countdown">{count}</div>
          : <button className="handover__btn" onClick={onReady}>Gotowy →</button>
        }
      </div>
    </div>,
    document.body
  )
}
