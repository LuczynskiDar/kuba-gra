import { useNavigate } from 'react-router-dom'

export default function StatkiSetupPage() {
  const navigate = useNavigate()
  return (
    <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:24, color:'#fff' }}>
      <h2>Ustawianie statków</h2>
      <p style={{ color:'rgba(255,255,255,0.5)' }}>Faza 3 — w budowie</p>
      <button onClick={() => navigate('/statki')} style={{ padding:'10px 28px', borderRadius:10, border:'2px solid rgba(255,255,255,0.2)', background:'transparent', color:'#fff', cursor:'pointer', fontSize:'0.9rem' }}>
        ← Wróć do menu
      </button>
    </div>
  )
}
