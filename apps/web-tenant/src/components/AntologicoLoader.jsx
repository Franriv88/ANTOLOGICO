import React from 'react';
import { IconPaths } from './AntologicoLoaderCream';

/**
 * Loader principal de Antológico — versión para pantallas con fondo CORAL.
 * Comparte el mismo layout horizontal (816×497) y los mismos íconos y
 * conexiones que AntologicoLoaderCream, pero con los colores invertidos
 * para que luzca bien sobre coral:
 *   - Palabra "Antológico" en blanco
 *   - Red punteada blanca semitransparente
 *   - Nodos grandes alternando blanco y salmón, con íconos en coral oscuro
 *   - Dos puntos blancos pulsantes
 *
 * Props:
 *   size — ancho en px (default 420). El alto se calcula del aspect 816:497.
 *   speed — multiplicador de velocidad del latido (default 1).
 *   pulseIntensity — amplitud del pulso (default 1.2).
 *   bgColor — fondo del tarjetón (default coral #DF5B49).
 *   bare — true desactiva fondo/sombra/radio (útil para pantalla completa).
 *   className — classes extra en el wrapper.
 */
export function AntologicoSpinner({
  size = 420,
  speed = 1,
  pulseIntensity = 1.2,
  bgColor = '#DF5B49',
  bare = false,
  className = '',
}) {
  const BG_WHITE   = '#FFFFFF';
  const BG_SALMON  = '#F5C6BD';
  const ICON_DARK  = '#C84B39';
  const ICON_MED   = '#A93827';

  // Mismo layout que el cream, pero alternando blanco/salmón en lugar de coral/ocre.
  // El color del ícono depende del color del fondo del nodo para mantener contraste.
  const bigNodes = [
    { id: 'palette',    cx: 392, cy: 128, fill: BG_WHITE,  iconColor: ICON_DARK, delay: '1.1s', dur: 2.1, icon: 'palette' },
    { id: 'camera',     cx: 184, cy: 190, fill: BG_WHITE,  iconColor: ICON_DARK, delay: '0s',   dur: 2.3, icon: 'camera' },
    { id: 'theater',    cx: 315, cy: 198, fill: BG_SALMON, iconColor: ICON_MED,  delay: '0.6s', dur: 2.7, icon: 'theater' },
    { id: 'music',      cx: 522, cy: 190, fill: BG_SALMON, iconColor: ICON_MED,  delay: '0.3s', dur: 2.5, icon: 'music' },
    { id: 'chef',       cx: 656, cy: 158, fill: BG_WHITE,  iconColor: ICON_DARK, delay: '1.4s', dur: 2.4, icon: 'chef' },
    { id: 'zen',        cx: 213, cy: 413, fill: BG_SALMON, iconColor: ICON_MED,  delay: '0.8s', dur: 2.6, icon: 'zen' },
    { id: 'nib',        cx: 365, cy: 445, fill: BG_WHITE,  iconColor: ICON_DARK, delay: '1.3s', dur: 2.8, icon: 'nib' },
    { id: 'skateboard', cx: 561, cy: 428, fill: BG_SALMON, iconColor: ICON_MED,  delay: '0.2s', dur: 2.2, icon: 'skateboard' },
    { id: 'math',       cx: 692, cy: 390, fill: BG_WHITE,  iconColor: ICON_DARK, delay: '0.5s', dur: 2.3, icon: 'math' },
  ];

  const smallDots = [
    { id: 'dot-tl', cx: 256, cy: 108, delay: '0.4s', dur: 1.9 },
    { id: 'dot-br', cx: 446, cy: 392, delay: '0.9s', dur: 2.0 },
  ];

  const ICON_WRAPPER_TRANSFORM = 'translate(-14 -14) scale(1.1667)';

  const height = Math.round((typeof size === 'number' ? size : 420) * (497 / 816));

  const cardStyle = bare
    ? { backgroundColor: 'transparent' }
    : {
        backgroundColor: bgColor,
        borderRadius: '1.25rem',
        boxShadow: '0 22px 40px -12px rgba(0, 0, 0, 0.35)',
        padding: '12px 20px',
      };

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${className}`}
      style={{
        width: typeof size === 'number' ? `${size}px` : size,
        height: typeof size === 'number' ? `${height + (bare ? 0 : 24)}px` : 'auto',
        maxWidth: '100%',
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
          50% { transform: scale(${pulseIntensity * 1.3}); opacity: 1; }
        }
        .antologico-node-beat {
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
        {/* Red punteada blanca semitransparente */}
        <g stroke="#FFFFFF" strokeOpacity="0.85" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="0.1 6.5" fill="none">
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

        {/* Palabra "Antológico" en blanco */}
        <text
          x="78" y="335"
          fill="#FFFFFF"
          fontFamily="'Fraunces', 'Playfair Display', Georgia, serif"
          fontWeight="600"
          fontSize="134"
          textLength="672"
          lengthAdjust="spacing"
        >
          Antológico
        </text>

        {/* Dos puntos blancos pulsantes */}
        {smallDots.map(dot => {
          const animDur = (dot.dur / speed).toFixed(2);
          return (
            <g key={dot.id} transform={`translate(${dot.cx} ${dot.cy})`}>
              <g
                className="antologico-node-beat"
                style={{
                  animation: `antologicoDotPulse ${animDur}s ease-in-out infinite`,
                  animationDelay: dot.delay,
                }}
              >
                <circle cx="0" cy="0" r="6" fill="#FFFFFF" />
              </g>
            </g>
          );
        })}

        {/* Nodos grandes + íconos */}
        {bigNodes.map(node => {
          const animDur = (node.dur / speed).toFixed(2);
          return (
            <g key={node.id} transform={`translate(${node.cx} ${node.cy})`}>
              <g
                className="antologico-node-beat"
                style={{
                  animation: `antologicoNodeHeartbeat ${animDur}s ease-in-out infinite`,
                  animationDelay: node.delay,
                }}
              >
                <circle cx="0" cy="0" r="29" fill={node.fill} />
                {node.icon === 'math' ? (
                  <text
                    x="0" y="6" textAnchor="middle"
                    fontFamily="'Fraunces', 'Playfair Display', Georgia, serif"
                    fontStyle="italic" fontWeight="500" fontSize="15"
                    fill={node.iconColor} stroke="none"
                  >
                    ∫cos(x)
                  </text>
                ) : (
                  <g transform={ICON_WRAPPER_TRANSFORM}>
                    <IconPaths
                      type={node.icon}
                      strokeColor={node.iconColor}
                      fillColor={node.iconColor}
                      accentColor={node.iconColor}
                    />
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

export const AntologicoLoader = AntologicoSpinner;

/**
 * Loader de pantalla completa: fondo coral gradient que cubre todo el viewport
 * y el spinner "Antológico" centrado. Opcionalmente muestra un mensaje debajo.
 */
export function FullScreenLoader({ message, size = 540 }) {
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
