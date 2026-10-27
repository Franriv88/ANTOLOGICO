import React from 'react';

/**
 * Variante del loader para pantallas con fondo claro (crema).
 * Sin tarjeta ni sombra: se posa directo sobre el fondo.
 * - Texto "Antológico" en marrón oscuro
 * - Líneas punteadas en marrón claro
 * - Nodos grandes en coral y ocre alternados, con íconos blancos
 * - Dos puntos ocre pequeños que pulsan
 *
 * Props:
 *   size — ancho en px (default 420). El alto se deriva del aspect ratio 816:497.
 *   speed — multiplicador de velocidad del latido (default 1).
 *   pulseIntensity — amplitud del pulso (default 1.2).
 *   className — classes extra en el wrapper.
 */
export function AntologicoLoaderCream({
  size = 420,
  speed = 1,
  pulseIntensity = 1.2,
  className = '',
}) {
  // Datos de los nodos grandes (r=29). Delays y durations consistentes con el
  // loader coral: cada nodo late con un pulso asíncrono.
  const bigNodes = [
    { id: 'palette',    cx: 392, cy: 128, fill: '#E35D4A', delay: '1.1s', dur: 2.1, icon: 'palette' },
    { id: 'camera',     cx: 184, cy: 190, fill: '#E35D4A', delay: '0s',   dur: 2.3, icon: 'camera' },
    { id: 'theater',    cx: 315, cy: 198, fill: '#B8923A', delay: '0.6s', dur: 2.7, icon: 'theater' },
    { id: 'music',      cx: 522, cy: 190, fill: '#B8923A', delay: '0.3s', dur: 2.5, icon: 'music' },
    { id: 'chef',       cx: 656, cy: 158, fill: '#E35D4A', delay: '1.4s', dur: 2.4, icon: 'chef' },
    { id: 'zen',        cx: 213, cy: 413, fill: '#B8923A', delay: '0.8s', dur: 2.6, icon: 'zen' },
    { id: 'nib',        cx: 365, cy: 445, fill: '#E35D4A', delay: '1.3s', dur: 2.8, icon: 'nib' },
    { id: 'skateboard', cx: 561, cy: 428, fill: '#B8923A', delay: '0.2s', dur: 2.2, icon: 'skateboard' },
    { id: 'math',       cx: 692, cy: 390, fill: '#E35D4A', delay: '0.5s', dur: 2.3, icon: 'math' },
  ];

  const smallDots = [
    { id: 'dot-tl', cx: 256, cy: 108, delay: '0.4s', dur: 1.9 },
    { id: 'dot-br', cx: 446, cy: 392, delay: '0.9s', dur: 2.0 },
  ];

  // Todos los íconos están pensados en coord locales ~24×24 y van escalados
  // 1.1667 y desplazados -14,-14 para que su centro caiga sobre (0,0) relativo
  // al centro del nodo.
  const ICON_WRAPPER_TRANSFORM = 'translate(-14 -14) scale(1.1667)';

  const height = Math.round((typeof size === 'number' ? size : 420) * (497 / 816));

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${className}`}
      style={{
        width: typeof size === 'number' ? `${size}px` : size,
        height: typeof size === 'number' ? `${height}px` : 'auto',
        maxWidth: '100%',
      }}
      role="status"
      aria-label="Cargando Antológico…"
    >
      <style>{`
        @keyframes antoCreamHeartbeat {
          0%, 100% { transform: scale(1); }
          18% { transform: scale(${pulseIntensity}); }
          34% { transform: scale(0.95); }
          52% { transform: scale(${1 + (pulseIntensity - 1) * 0.65}); }
          75% { transform: scale(1); }
        }
        @keyframes antoCreamDotPulse {
          0%, 100% { transform: scale(1); opacity: 0.9; }
          50% { transform: scale(${pulseIntensity * 1.3}); opacity: 1; }
        }
        .anto-cream-beat {
          transform-box: fill-box;
          transform-origin: center;
          will-change: transform;
        }
      `}</style>

      <svg
        viewBox="0 0 816 497"
        width="100%"
        height="100%"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Antológico"
      >
        {/* Red punteada marrón claro */}
        <g stroke="#A88C74" strokeWidth="2.8" strokeLinecap="round" strokeDasharray="0.1 6.5" fill="none">
          <line x1="256" y1="108" x2="392" y2="128" />
          <line x1="256" y1="108" x2="184" y2="190" />
          <line x1="256" y1="108" x2="315" y2="198" />
          <line x1="184" y1="190" x2="315" y2="198" />
          <line x1="315" y1="198" x2="392" y2="128" />
          <line x1="392" y1="128" x2="522" y2="190" />
          <line x1="522" y1="190" x2="656" y2="158" />
          <line x1="184" y1="190" x2="140" y2="238" />
          <line x1="315" y1="198" x2="268" y2="240" />
          <line x1="392" y1="128" x2="400" y2="235" />
          <line x1="522" y1="190" x2="548" y2="238" />
          <line x1="656" y1="158" x2="712" y2="244" />
          <line x1="213" y1="413" x2="150" y2="345" />
          <line x1="213" y1="413" x2="365" y2="445" />
          <line x1="365" y1="445" x2="322" y2="348" />
          <line x1="365" y1="445" x2="446" y2="392" />
          <line x1="446" y1="392" x2="430" y2="348" />
          <line x1="446" y1="392" x2="561" y2="428" />
          <line x1="561" y1="428" x2="598" y2="350" />
          <line x1="561" y1="428" x2="692" y2="390" />
          <line x1="692" y1="390" x2="740" y2="345" />
        </g>

        {/* Palabra "Antológico" estática */}
        <text
          x="78" y="335"
          fill="#221C18"
          fontFamily="'Fraunces', 'Playfair Display', Georgia, serif"
          fontWeight="600"
          fontSize="134"
          textLength="672"
          lengthAdjust="spacing"
        >
          Antológico
        </text>

        {/* Dos puntos pequeños pulsantes */}
        {smallDots.map(dot => {
          const animDur = (dot.dur / speed).toFixed(2);
          return (
            <g key={dot.id} transform={`translate(${dot.cx} ${dot.cy})`}>
              <g
                className="anto-cream-beat"
                style={{
                  animation: `antoCreamDotPulse ${animDur}s ease-in-out infinite`,
                  animationDelay: dot.delay,
                }}
              >
                <circle cx="0" cy="0" r="6" fill="#B8923A" />
              </g>
            </g>
          );
        })}

        {/* Nodos grandes + íconos (laten en conjunto) */}
        {bigNodes.map(node => {
          const animDur = (node.dur / speed).toFixed(2);
          return (
            <g key={node.id} transform={`translate(${node.cx} ${node.cy})`}>
              <g
                className="anto-cream-beat"
                style={{
                  animation: `antoCreamHeartbeat ${animDur}s ease-in-out infinite`,
                  animationDelay: node.delay,
                }}
              >
                <circle cx="0" cy="0" r="29" fill={node.fill} />
                {node.icon === 'math' ? (
                  <text
                    x="0" y="6" textAnchor="middle"
                    fontFamily="'Fraunces', 'Playfair Display', Georgia, serif"
                    fontStyle="italic" fontWeight="500" fontSize="15"
                    fill="#FFFFFF" stroke="none"
                  >
                    ∫cos(x)
                  </text>
                ) : (
                  <g transform={ICON_WRAPPER_TRANSFORM}>
                    <IconPaths type={node.icon} />
                  </g>
                )}
              </g>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// Íconos tomados del SVG original (stroke blanco), ya centrados ~(12,12)
// en coord locales. El wrapper exterior los ubica sobre cada nodo.
function IconPaths({ type }) {
  const common = {
    fill: 'none', stroke: '#FFFFFF',
    strokeWidth: '1.8', strokeLinecap: 'round', strokeLinejoin: 'round',
  };
  switch (type) {
    case 'palette':
      return (
        <g {...common}>
          <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.9 0 1.7-.8 1.7-1.7 0-.4-.2-.8-.4-1.1-.3-.3-.4-.7-.4-1.1 0-.9.8-1.7 1.7-1.7h2c3.1 0 5.6-2.5 5.6-5.6C22 6 17.5 2 12 2z" />
          <g fill="#FFFFFF" stroke="none">
            <circle cx="13.5" cy="6.5" r="1.4" />
            <circle cx="17.5" cy="10.5" r="1.4" />
            <circle cx="8.5" cy="7.5" r="1.4" />
            <circle cx="6.5" cy="12.5" r="1.4" />
          </g>
        </g>
      );
    case 'camera':
      return (
        <g {...common}>
          <rect x="3" y="7" width="18" height="13" rx="2" />
          <path d="M8 7l2-3h4l2 3" />
          <circle cx="12" cy="13.5" r="3.5" />
        </g>
      );
    case 'theater':
      return (
        <g {...common}>
          <g transform="rotate(12 15 10)">
            <path d="M10 4.5c3-1.2 7-1.2 10 0 .4 4.8-.6 9.6-5 11.5-4.4-1.9-5.4-6.7-5-11.5z" />
            <path d="M11.8 7.6c.8-.5 1.6-.5 2.2.2M16 7.8c.6-.7 1.4-.7 2.2-.2M12.8 12.6c1.3-1 3.1-1 4.4 0" />
          </g>
          <g transform="rotate(-12 9 13.5)">
            <path d="M4 8c3-1.2 7-1.2 10 0 .4 4.8-.6 9.6-5 11.5C4.6 17.6 3.6 12.8 4 8z" fill="#FFFFFF" />
            <path d="M5.6 11c.7-.7 1.5-.7 2.2 0M10.2 11c.7-.7 1.5-.7 2.2 0M6.3 14.2c1.4 1.6 3.4 1.6 4.8 0" stroke="#B8923A" strokeWidth="1.5" />
          </g>
        </g>
      );
    case 'music':
      return (
        <g {...common}>
          <path d="M9 18V5l11-2v13" />
          <circle cx="6" cy="18" r="3" />
          <circle cx="17" cy="16" r="3" />
        </g>
      );
    case 'chef':
      return (
        <g {...common}>
          <path d="M17 21a1 1 0 0 0 1-1v-5.35c0-.457.316-.844.727-1.041a4 4 0 0 0-2.134-7.589 5 5 0 0 0-9.186 0 4 4 0 0 0-2.134 7.588c.411.198.727.585.727 1.041V20a1 1 0 0 0 1 1z" />
          <path d="M6 17h12" />
        </g>
      );
    case 'zen':
      return (
        <g {...common}>
          <g fill="#FFFFFF" stroke="none">
            <circle cx="12" cy="4.2" r="2.3" />
            <path d="M9.6 7.2c-1 .2-1.6 1-1.9 2L6 14.2c-.2.6.2 1.2.8 1.3.5.1 1-.2 1.2-.7L9.6 10.6 10 13.6h4l.4-3 1.6 4.2c.2.5.7.8 1.2.7.6-.1 1-.7.8-1.3l-1.7-5c-.3-1-.9-1.8-1.9-2z" />
            <path d="M3 17.6c0-2 4-3.4 9-3.4s9 1.4 9 3.4-4 2.6-9 2.6-9-.6-9-2.6z" />
          </g>
        </g>
      );
    case 'nib':
      return (
        <g {...common}>
          <g fill="#FFFFFF" stroke="none">
            <circle cx="13" cy="3.5" r="2.1" />
            <path d="M12.2 6.3c-.9.2-1.4 1-1.3 1.9l.4 3.3-4.3 6.2c-.3.5 0 1.1.6 1.1h8.9c.6 0 .9-.6.6-1.1L13.9 11.4l.1-3.2c0-1-.7-1.9-1.8-1.9z" />
          </g>
          <path d="M11.6 7.8L7 4.4M13.9 8l4.4 1.8M10.6 18.8l-1.4 3M14.2 18.8l3.6 2.4" strokeWidth="1.9" />
        </g>
      );
    case 'skateboard':
      return (
        <g {...common}>
          <path d="M15.7 3.3l5 5L18 11l-5-5z M13 6L6.5 7.6 3 21l13.4-3.5L18 11 M3 21l6.6-6.6" />
          <circle cx="11" cy="13" r="2" />
        </g>
      );
    default:
      return null;
  }
}

export default AntologicoLoaderCream;
