export default function CinemaBackground() {
  return (
    <div className="cinema-bg" aria-hidden="true">
      <svg
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
      >
        <defs>
          {/* Gradient tła — sufit do podłogi */}
          <linearGradient id="bgGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#080818" />
            <stop offset="60%" stopColor="#0d0d22" />
            <stop offset="100%" stopColor="#060610" />
          </linearGradient>

          {/* Poświata kinkietów */}
          <radialGradient id="sconceGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffe4a0" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#ffe4a0" stopOpacity="0" />
          </radialGradient>

          {/* Cień zasłon */}
          <linearGradient id="curtainLeft" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#3a0810" />
            <stop offset="100%" stopColor="#5c0f1e" />
          </linearGradient>
          <linearGradient id="curtainRight" x1="1" y1="0" x2="0" y2="0">
            <stop offset="0%" stopColor="#3a0810" />
            <stop offset="100%" stopColor="#5c0f1e" />
          </linearGradient>

          {/* Perspektywiczny gradient podłogi */}
          <linearGradient id="floorGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0a0a18" />
            <stop offset="100%" stopColor="#050510" />
          </linearGradient>
        </defs>

        {/* === Tło === */}
        <rect width="1440" height="900" fill="url(#bgGrad)" />

        {/* === Sufit === */}
        <rect x="0" y="0" width="1440" height="80" fill="#060614" />
        {/* Listwa sufitowa */}
        <rect x="0" y="76" width="1440" height="6" fill="#1a1a35" rx="2" />

        {/* === Kinkiety na ścianach (lewo) === */}
        {[160, 280].map((y, i) => (
          <g key={`sl${i}`}>
            <ellipse cx="90" cy={y} rx="55" ry="45" fill="url(#sconceGlow)" />
            <rect x="78" y={y - 14} width="24" height="18" rx="4" fill="#c8972a" />
            <rect x="84" y={y - 20} width="12" height="8" rx="2" fill="#e8b840" />
          </g>
        ))}

        {/* === Kinkiety na ścianach (prawo) === */}
        {[160, 280].map((y, i) => (
          <g key={`sr${i}`}>
            <ellipse cx="1350" cy={y} rx="55" ry="45" fill="url(#sconceGlow)" />
            <rect x="1338" y={y - 14} width="24" height="18" rx="4" fill="#c8972a" />
            <rect x="1344" y={y - 20} width="12" height="8" rx="2" fill="#e8b840" />
          </g>
        ))}

        {/* === Lewa zasłona === */}
        <path
          d="M 0 0
             C 60 50, 40 150, 70 250
             C 50 350, 80 420, 60 520
             C 45 600, 75 680, 55 780
             L 55 900 L 0 900 Z"
          fill="url(#curtainLeft)"
        />
        {/* Fałdy lewej zasłony */}
        <path
          d="M 55 0
             C 100 60, 75 160, 105 260
             C 85 360, 115 440, 90 540
             C 75 620, 100 700, 85 800
             L 85 900 L 55 900
             C 75 680, 45 600, 60 520
             C 80 420, 50 350, 70 250
             C 40 150, 60 50, 0 0 Z"
          fill="#7a1520"
          opacity="0.6"
        />
        {/* Złota listwa zasłony */}
        <rect x="52" y="0" width="6" height="900" fill="#c8972a" opacity="0.7" rx="3" />

        {/* === Prawa zasłona === */}
        <path
          d="M 1440 0
             C 1380 50, 1400 150, 1370 250
             C 1390 350, 1360 420, 1380 520
             C 1395 600, 1365 680, 1385 780
             L 1385 900 L 1440 900 Z"
          fill="url(#curtainRight)"
        />
        {/* Fałdy prawej zasłony */}
        <path
          d="M 1385 0
             C 1340 60, 1365 160, 1335 260
             C 1355 360, 1325 440, 1350 540
             C 1365 620, 1340 700, 1355 800
             L 1355 900 L 1385 900
             C 1365 680, 1395 600, 1380 520
             C 1360 420, 1390 350, 1370 250
             C 1400 150, 1380 50, 1440 0 Z"
          fill="#7a1520"
          opacity="0.6"
        />
        {/* Złota listwa prawej zasłony */}
        <rect x="1382" y="0" width="6" height="900" fill="#c8972a" opacity="0.7" rx="3" />

        {/* === Podłoga / strefa foteli === */}
        <rect x="0" y="600" width="1440" height="300" fill="url(#floorGrad)" />

        {/* === Fotele — 3 rzędy === */}
        {/* Rząd 3 (najdalej, najmniejszy) */}
        {Array.from({ length: 18 }, (_, i) => (
          <g key={`s3${i}`} transform={`translate(${200 + i * 62}, 618)`}>
            <rect x="0" y="0" width="46" height="28" rx="5" fill="#16163a" />
            <rect x="4" y="2" width="38" height="16" rx="4" fill="#1e1e48" />
            <rect x="-4" y="6" width="6" height="14" rx="3" fill="#16163a" />
            <rect x="44" y="6" width="6" height="14" rx="3" fill="#16163a" />
          </g>
        ))}

        {/* Rząd 2 (środkowy) */}
        {Array.from({ length: 16 }, (_, i) => (
          <g key={`s2${i}`} transform={`translate(${230 + i * 66}, 672)`}>
            <rect x="0" y="0" width="50" height="32" rx="6" fill="#14143a" />
            <rect x="4" y="2" width="42" height="18" rx="5" fill="#1c1c46" />
            <rect x="-5" y="7" width="7" height="16" rx="3" fill="#14143a" />
            <rect x="48" y="7" width="7" height="16" rx="3" fill="#14143a" />
          </g>
        ))}

        {/* Rząd 1 (najbliżej, największy) */}
        {Array.from({ length: 14 }, (_, i) => (
          <g key={`s1${i}`} transform={`translate(${265 + i * 70}, 736)`}>
            <rect x="0" y="0" width="54" height="38" rx="7" fill="#12122e" />
            <rect x="5" y="3" width="44" height="22" rx="6" fill="#1a1a40" />
            <rect x="-6" y="8" width="8" height="20" rx="3" fill="#12122e" />
            <rect x="52" y="8" width="8" height="20" rx="3" fill="#12122e" />
          </g>
        ))}

        {/* === Górna ramka ekranu (łuk prosce­niowy) === */}
        <path
          d="M 140 0 Q 720 90 1300 0"
          stroke="#1e1e40"
          strokeWidth="3"
          fill="none"
        />
      </svg>
    </div>
  )
}
