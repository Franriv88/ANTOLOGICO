import React from 'react';

// Coordenadas exactas medidas sobre el lienzo original de 512×512 px.
const NODES = [
  { id: 'camera',  x: 128, y: 213, r: 17.5, bg: '#FFFFFF', iconColor: '#C84B39', type: 'camera',  delay: '0s',   dur: 2.3 },
  { id: 'theater', x: 206, y: 217, r: 17.5, bg: '#F5C6BD', iconColor: '#A93827', type: 'theater', delay: '0.6s', dur: 2.7 },
  { id: 'palette', x: 251, y: 173, r: 17.5, bg: '#FFFFFF', iconColor: '#C84B39', type: 'palette', delay: '1.1s', dur: 2.1 },
  { id: 'music',   x: 328, y: 214, r: 17.5, bg: '#F5C6BD', iconColor: '#A93827', type: 'music',   delay: '0.3s', dur: 2.5 },
  { id: 'chef',    x: 408, y: 192, r: 17.5, bg: '#FFFFFF', iconColor: '#C84B39', type: 'chef',    delay: '1.4s', dur: 2.4 },
  { id: 'zen',     x: 145, y: 353, r: 17.5, bg: '#F5C6BD', iconColor: '#A93827', type: 'zen',     delay: '0.8s', dur: 2.6 },
  { id: 'dance',   x: 235, y: 373, r: 17.5, bg: '#FFFFFF', iconColor: '#C84B39', type: 'dance',   delay: '0.2s', dur: 2.2 },
  { id: 'nib',     x: 351, y: 361, r: 17.5, bg: '#F5C6BD', iconColor: '#A93827', type: 'nib',     delay: '1.3s', dur: 2.8 },
  { id: 'math',    x: 429, y: 342, r: 17.5, bg: '#FFFFFF', iconColor: '#B53D2C', type: 'math',    delay: '0.5s', dur: 2.3 },
  { id: 'dot-top',    x: 170, y: 158, r: 3.8, bg: '#FFFFFF', type: 'dot', delay: '0.4s', dur: 1.9 },
  { id: 'dot-bottom', x: 283, y: 339, r: 3.8, bg: '#FFFFFF', type: 'dot', delay: '0.9s', dur: 2.0 },
];

const LINES = [
  { x1: 170, y1: 158, x2: 140, y2: 199 },
  { x1: 170, y1: 158, x2: 196, y2: 201 },
  { x1: 170, y1: 158, x2: 233, y2: 170 },
  { x1: 146, y1: 214, x2: 188, y2: 216 },
  { x1: 219, y1: 204, x2: 238, y2: 186 },
  { x1: 268, y1: 182, x2: 312, y2: 205 },
  { x1: 346, y1: 209, x2: 390, y2: 197 },
  { x1: 116, y1: 226, x2: 103, y2: 239 },
  { x1: 193, y1: 230, x2: 179, y2: 243 },
  { x1: 252, y1: 191, x2: 255, y2: 243 },
  { x1: 336, y1: 230, x2: 343, y2: 243 },
  { x1: 418, y1: 207, x2: 440, y2: 243 },
  { x1: 107, y1: 313, x2: 133, y2: 340 },
  { x1: 209, y1: 313, x2: 227, y2: 357 },
  { x1: 274, y1: 313, x2: 282, y2: 335 },
  { x1: 374, y1: 313, x2: 358, y2: 345 },
  { x1: 455, y1: 313, x2: 441, y2: 329 },
  { x1: 163, y1: 357, x2: 217, y2: 369 },
  { x1: 251, y1: 363, x2: 280, y2: 341 },
  { x1: 287, y1: 340, x2: 334, y2: 355 },
  { x1: 369, y1: 356, x2: 411, y2: 346 },
];

function ExactNodeIcon({ type, color }) {
  switch (type) {
    case 'camera':
      return (
        <g stroke={color} strokeWidth="1.25" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <rect x="-6.5" y="-4" width="13" height="9" rx="1.6" />
          <path d="M-2.8 -4 L-1.8 -5.8 H1.8 L2.8 -4" />
          <circle cx="0" cy="0.5" r="2.5" />
          <circle cx="4.2" cy="-1.8" r="0.5" fill={color} stroke="none" />
        </g>
      );
    case 'theater':
      return (
        <g stroke={color} strokeWidth="1.15" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d="M-5.8 -4.5 C-5.8 -4.5 -0.5 -5.2 -0.5 -4.5 C-0.5 0 -1.8 3.2 -3.2 4.2 C-4.6 3.2 -5.8 0 -5.8 -4.5 Z" fill="#F5C6BD" transform="rotate(-10 -3 0)" />
          <path d="M-4.8 -2.2 Q-4.2 -2.8 -3.6 -2.2" transform="rotate(-10 -3 0)" />
          <path d="M-2.6 -2.2 Q-2.0 -2.8 -1.4 -2.2" transform="rotate(-10 -3 0)" />
          <path d="M-4.3 0.5 Q-3.1 2.0 -1.9 0.5" transform="rotate(-10 -3 0)" />
          <path d="M0.2 -3.8 C0.2 -3.8 5.5 -4.5 5.5 -3.8 C5.5 0.7 4.2 3.9 2.8 4.9 C1.4 3.9 0.2 0.7 0.2 -3.8 Z" fill="#F5C6BD" transform="rotate(10 3 0)" />
          <path d="M1.2 -1.4 Q1.8 -2.0 2.4 -1.4" transform="rotate(10 3 0)" />
          <path d="M3.4 -1.4 Q4.0 -2.0 4.6 -1.4" transform="rotate(10 3 0)" />
          <path d="M1.7 2.2 Q2.9 0.8 4.1 2.2" transform="rotate(10 3 0)" />
        </g>
      );
    case 'palette':
      return (
        <g stroke={color} strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d="M0 -6.5 C-3.8 -6.5 -6.8 -3.6 -6.8 0 C-6.8 3.6 -3.8 6.5 0 6.5 C1.3 6.5 2.2 5.6 2.2 4.5 C2.2 3.8 1.7 3.3 1.7 2.6 C1.7 1.9 2.3 1.4 3.1 1.4 H4.2 C5.7 1.4 6.8 0.2 6.8 -1.3 C6.8 -4.2 3.7 -6.5 0 -6.5 Z" />
          <circle cx="-3.4" cy="-1.2" r="0.8" fill={color} stroke="none" />
          <circle cx="-1.5" cy="-3.6" r="0.8" fill={color} stroke="none" />
          <circle cx="1.6" cy="-3.4" r="0.8" fill={color} stroke="none" />
          <circle cx="3.6" cy="-1.2" r="0.8" fill={color} stroke="none" />
          <circle cx="-1.4" cy="3.2" r="1.05" />
        </g>
      );
    case 'music':
      return (
        <g stroke={color} strokeWidth="1.3" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <ellipse cx="-3.2" cy="3.5" rx="2.1" ry="1.5" transform="rotate(-18 -3.2 3.5)" />
          <ellipse cx="3.4" cy="2.2" rx="2.1" ry="1.5" transform="rotate(-18 3.4 2.2)" />
          <path d="M-1.3 3.1 V-4.2 L5.3 -5.5 V1.8" />
          <line x1="-1.3" y1="-2.1" x2="5.3" y2="-3.4" strokeWidth="1.1" />
        </g>
      );
    case 'chef':
      return (
        <g stroke={color} strokeWidth="1.25" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d="M-4.2 2.2 H4.2 V5.2 H-4.2 Z" />
          <path d="M-4.2 2.2 C-6.2 2.2 -7.0 0.2 -5.8 -1.4 C-6.2 -3.6 -4.0 -5.4 -1.8 -4.6 C-0.8 -6.2 1.2 -6.2 2.2 -4.6 C4.4 -5.4 6.2 -3.6 5.8 -1.4 C7.0 0.2 6.2 2.2 4.2 2.2" />
        </g>
      );
    case 'zen':
      return (
        <g fill={color} stroke="none">
          <circle cx="0" cy="-4.5" r="1.6" />
          <path d="M0 -2.3 C-2.2 -2.3 -3.8 -0.5 -4.6 1.8 L-2.8 2.3 L-1.8 0.2 L-1.8 2.4 H1.8 L1.8 0.2 L2.8 2.3 L4.6 1.8 C3.8 -0.5 2.2 -2.3 0 -2.3 Z" />
          <path d="M-5.2 3.2 C-5.2 2.4 -3.2 2.2 0 2.2 C3.2 2.2 5.2 2.4 5.2 3.2 C5.2 4.4 2.8 5.0 0 5.0 C-2.8 5.0 -5.2 4.4 -5.2 3.2 Z" />
        </g>
      );
    case 'dance':
      return (
        <g fill={color} stroke={color} strokeLinecap="round" strokeLinejoin="round">
          <circle cx="-0.3" cy="-5.2" r="1.4" stroke="none" />
          <path d="M-4.5 -3.8 Q-1.5 -2.2 0 -2.5 Q2.2 -3.0 4.2 -5.0" strokeWidth="1.25" fill="none" />
          <path d="M0 -2.2 Q2.4 -1.2 3.8 -0.2" strokeWidth="1.15" fill="none" />
          <path d="M-0.8 -2.8 L1.0 -2.8 L3.2 2.5 L-2.8 2.0 Z" stroke="none" />
          <path d="M-1.0 1.8 L-2.2 5.8" strokeWidth="1.25" fill="none" />
          <path d="M0.8 1.8 L2.6 5.2" strokeWidth="1.25" fill="none" />
        </g>
      );
    case 'nib':
      return (
        <g stroke={color} strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round" transform="rotate(42)">
          <path d="M0 -6.2 L-3.8 0.8 L-2.2 5.2 H2.2 L3.8 0.8 Z" />
          <line x1="0" y1="-6.2" x2="0" y2="-0.5" />
          <circle cx="0" cy="0.5" r="1.0" fill={color} stroke="none" />
          <line x1="-2.8" y1="5.2" x2="2.8" y2="5.2" />
        </g>
      );
    case 'math':
      return (
        <text x="0" y="0.5" textAnchor="middle" dominantBaseline="central" fill={color}
          fontFamily="'Times New Roman', Times, Georgia, serif" fontSize="7.6" fontStyle="italic" fontWeight="600">
          ∫cos(x)
        </text>
      );
    default:
      return null;
  }
}

/**
 * Loader principal "Antológico" (fidelidad 1:1 con el PNG original).
 * - size: ancho en px (default 420)
 * - speed: multiplicador de velocidad del latido (default 1)
 * - pulseIntensity: amplitud del pulso (default 1.25)
 * - bgColor: color de fondo del tarjetón (default coral #DF5B49)
 * - customImageSrc: opcional, si se pasa, se usa el PNG como base y los nódulos laten encima
 */
export function AntologicoSpinner({
  size = 420,
  speed = 1,
  pulseIntensity = 1.25,
  bgColor = '#DF5B49',
  customImageSrc = null,
  className = '',
  /** `true` desactiva la tarjeta (sin fondo, sin sombra, sin radio). Útil para pantalla completa. */
  bare = false,
}) {
  const cardStyle = bare
    ? { backgroundColor: 'transparent' }
    : {
        backgroundColor: bgColor,
        borderRadius: '1.25rem',
        boxShadow: '0 22px 40px -12px rgba(0, 0, 0, 0.35)',
      };
  return (
    <div
      className={`relative inline-flex items-center justify-center select-none overflow-hidden ${className}`}
      style={{
        width: typeof size === 'number' ? `${size}px` : size,
        maxWidth: '100%',
        aspectRatio: '1 / 1',
        ...cardStyle,
      }}
      role="status"
      aria-label="Cargando Antológico…"
    >
      <style>{`
        @keyframes antologicoNodeHeartbeat {
          0%, 100% { transform: scale(1); }
          18% { transform: scale(${pulseIntensity}); }
          34% { transform: scale(0.95); }
          52% { transform: scale(${1 + (pulseIntensity - 1) * 0.65}); }
          75% { transform: scale(1); }
        }
        @keyframes antologicoDotPulse {
          0%, 100% { transform: scale(1); opacity: 0.9; }
          50% { transform: scale(${pulseIntensity * 1.15}); opacity: 1; }
        }
        .antologico-node-beat {
          transform-box: fill-box;
          transform-origin: center;
          will-change: transform;
        }
      `}</style>

      {customImageSrc && (
        <img
          src={customImageSrc}
          alt=""
          className="absolute inset-0 w-full h-full object-contain pointer-events-none"
        />
      )}

      <svg viewBox="0 0 512 512" className="w-full h-full relative z-10" style={{ overflow: 'visible' }}>
        {!customImageSrc && (
          <g>
            {LINES.map((line, idx) => (
              <line
                key={`line-${idx}`}
                x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2}
                stroke="#FFFFFF" strokeWidth="1.5" strokeDasharray="1.8 3.2"
                strokeLinecap="round" opacity="0.92"
              />
            ))}
          </g>
        )}

        <g>
          {NODES.map(node => {
            const animDur = (node.dur / speed).toFixed(2);
            const isDot = node.type === 'dot';
            return (
              <g key={node.id} transform={`translate(${node.x}, ${node.y})`}>
                {customImageSrc && (
                  <circle cx="0" cy="0" r={node.r + 1.5} fill={bgColor} />
                )}
                <g
                  className="antologico-node-beat"
                  style={{
                    animation: `${isDot ? 'antologicoDotPulse' : 'antologicoNodeHeartbeat'} ${animDur}s ease-in-out infinite`,
                    animationDelay: node.delay,
                  }}
                >
                  <circle cx="0" cy="0" r={node.r} fill={node.bg} />
                  {!isDot && <ExactNodeIcon type={node.type} color={node.iconColor} />}
                </g>
              </g>
            );
          })}
        </g>

        {!customImageSrc && (
          <g>
            <text
              x="263" y="297" textAnchor="middle" fill="#FFFFFF"
              style={{
                fontFamily: "'Fraunces', 'Playfair Display', 'Times New Roman', Georgia, serif",
                fontSize: '74px', fontWeight: 700, letterSpacing: '0.005em',
              }}
            >
              Antológico
            </text>
          </g>
        )}
      </svg>
    </div>
  );
}

export const AntologicoLoader = AntologicoSpinner;

/**
 * Loader de pantalla completa: fondo coral que cubre todo el viewport
 * y el spinner "Antológico" centrado. Opcionalmente muestra un mensaje debajo.
 */
export function FullScreenLoader({ message, size = 360 }) {
  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center p-6"
      style={{ background: 'linear-gradient(148deg, #E85D4A 0%, #C4412F 48%, #8C2E1F 100%)' }}
    >
      <AntologicoSpinner size={size} bare />
      {message && (
        <p className="mt-6 text-white/90 text-sm font-medium text-center max-w-xs">
          {message}
        </p>
      )}
    </div>
  );
}

export default AntologicoSpinner;
