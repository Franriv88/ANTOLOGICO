// Ícono de red (4 nodos) — para sidebar, favicons, contextos compactos
// variant: 'filled' (fondo carbón) | 'bare' (sin fondo, para sidebar oscuro)
export function IconAntologico({ size = 32, variant = 'filled', className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {variant === 'filled' && <rect width="48" height="48" rx="8" fill="#1A1611" />}
      <g stroke="#E85D4A" strokeWidth="1.8" strokeLinecap="round">
        <line x1="13" y1="9"  x2="31" y2="18" />
        <line x1="13" y1="9"  x2="10" y2="31" />
        <line x1="31" y1="18" x2="30" y2="39" />
        <line x1="10" y1="31" x2="30" y2="39" />
      </g>
      <circle cx="13" cy="9"  r="7" fill="#E85D4A" />
      <circle cx="31" cy="18" r="9" fill="#B98527" />
      <circle cx="10" cy="31" r="7" fill="#E85D4A" />
      <circle cx="30" cy="39" r="5" fill="#E85D4A" />
    </svg>
  );
}
