interface HangmanSVGProps {
  mistakes: number // 0–8
}

const BODY_COLOR = '#4A90D9'
const GALLOWS_COLOR = '#6B4226'
const ROPE_COLOR = '#8B7355'
const STROKE_WIDTH = 4
const GALLOWS_STROKE = 8

export default function HangmanSVG({ mistakes }: HangmanSVGProps) {
  const show = (step: number) => mistakes > step

  return (
    <svg
      viewBox="0 0 240 300"
      width="100%"
      height="100%"
      style={{ maxWidth: 320, maxHeight: 400 }}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* === Szubienica (zawsze widoczna) === */}
      {/* Podstawa */}
      <line x1="10" y1="280" x2="170" y2="280" stroke={GALLOWS_COLOR} strokeWidth={GALLOWS_STROKE} />
      {/* Słup pionowy */}
      <line x1="60" y1="280" x2="60" y2="30" stroke={GALLOWS_COLOR} strokeWidth={GALLOWS_STROKE} />
      {/* Belka pozioma */}
      <line x1="60" y1="30" x2="165" y2="30" stroke={GALLOWS_COLOR} strokeWidth={GALLOWS_STROKE} />
      {/* Zastrzał ukośny */}
      <line x1="60" y1="95" x2="110" y2="30" stroke={GALLOWS_COLOR} strokeWidth={5} />
      {/* Lina */}
      <line x1="165" y1="30" x2="165" y2="62" stroke={ROPE_COLOR} strokeWidth={STROKE_WIDTH} />

      {/* === Ciało (pojawia się po kolei) === */}

      {/* 1. Głowa */}
      {show(0) && (
        <g style={{ animation: 'fadeIn 0.3s ease' }}>
          <circle
            cx="165" cy="78" r="16"
            stroke={BODY_COLOR} strokeWidth={STROKE_WIDTH} fill="none"
          />
          {/* Oczy */}
          <circle cx="159" cy="74" r="2.5" fill={BODY_COLOR} />
          <circle cx="171" cy="74" r="2.5" fill={BODY_COLOR} />
          {/* Usta (uśmiech → smutek gdy >= 6 błędów) */}
          {mistakes < 6 ? (
            <path
              d="M 159 83 Q 165 88 171 83"
              stroke={BODY_COLOR} strokeWidth={2} fill="none"
            />
          ) : (
            <path
              d="M 159 87 Q 165 82 171 87"
              stroke={BODY_COLOR} strokeWidth={2} fill="none"
            />
          )}
        </g>
      )}

      {/* 2. Tułów */}
      {show(1) && (
        <line
          x1="165" y1="94" x2="165" y2="158"
          stroke={BODY_COLOR} strokeWidth={STROKE_WIDTH}
          style={{ animation: 'fadeIn 0.3s ease' }}
        />
      )}

      {/* 3. Lewa ręka */}
      {show(2) && (
        <line
          x1="165" y1="110" x2="133" y2="142"
          stroke={BODY_COLOR} strokeWidth={STROKE_WIDTH}
          style={{ animation: 'fadeIn 0.3s ease' }}
        />
      )}

      {/* 4. Prawa ręka */}
      {show(3) && (
        <line
          x1="165" y1="110" x2="197" y2="142"
          stroke={BODY_COLOR} strokeWidth={STROKE_WIDTH}
          style={{ animation: 'fadeIn 0.3s ease' }}
        />
      )}

      {/* 5. Lewa noga */}
      {show(4) && (
        <line
          x1="165" y1="158" x2="136" y2="205"
          stroke={BODY_COLOR} strokeWidth={STROKE_WIDTH}
          style={{ animation: 'fadeIn 0.3s ease' }}
        />
      )}

      {/* 6. Prawa noga */}
      {show(5) && (
        <line
          x1="165" y1="158" x2="194" y2="205"
          stroke={BODY_COLOR} strokeWidth={STROKE_WIDTH}
          style={{ animation: 'fadeIn 0.3s ease' }}
        />
      )}

      {/* 7. Lewa stopa */}
      {show(6) && (
        <line
          x1="136" y1="205" x2="116" y2="205"
          stroke={BODY_COLOR} strokeWidth={STROKE_WIDTH}
          style={{ animation: 'fadeIn 0.3s ease' }}
        />
      )}

      {/* 8. Prawa stopa */}
      {show(7) && (
        <line
          x1="194" y1="205" x2="214" y2="205"
          stroke={BODY_COLOR} strokeWidth={STROKE_WIDTH}
          style={{ animation: 'fadeIn 0.3s ease' }}
        />
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>
    </svg>
  )
}
