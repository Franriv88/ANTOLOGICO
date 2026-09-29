// Ícono de red (4 nodos) — para sidebar, favicons, contextos compactos
export function IconAntologico({ size = 32, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect width="48" height="48" rx="8" fill="#1A1611" />
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

// Logo completo con red de disciplinas + wordmark Playfair Display
// theme: 'light' | 'dark' | 'coral'
export function LogoAntologico({ theme = 'light', width = 580, className = '' }) {
  const c = {
    light: {
      edge: '#A88C74', text: '#221C18', hub: '#B8923A',
      n1: '#E35D4A', n2: '#B98527', istr: '#FFFFFF', ifil: '#FFFFFF', ocre: '#B8923A',
    },
    dark: {
      edge: '#A8907E', text: '#F4ECE1', hub: '#B8923A',
      n1: '#E35D4A', n2: '#B98527', istr: '#FFFFFF', ifil: '#FFFFFF', ocre: '#B8923A',
    },
    coral: {
      edge: '#FFFFFF', text: '#FFFFFF', hub: '#FFFFFF',
      n1: '#FFFFFF', n2: '#F8D3CB', istr: '#C4412F', ifil: '#C4412F', ocre: '#F8D3CB',
    },
  }[theme];

  const edgeOp = theme === 'coral' ? 0.9 : 0.65;

  const EDGES = [
    [256,108,392,128],[256,108,184,190],[256,108,315,198],[184,190,315,198],
    [315,198,392,128],[392,128,522,190],[522,190,656,158],[184,190,140,238],
    [315,198,268,240],[392,128,400,235],[522,190,548,238],[656,158,712,244],
    [213,413,150,345],[213,413,365,445],[365,445,322,348],[365,445,446,392],
    [446,392,430,348],[446,392,561,428],[561,428,598,350],[561,428,692,390],
    [692,390,740,345],
  ];

  return (
    <svg
      viewBox="0 0 816 497"
      width={width}
      style={{ height: 'auto', maxWidth: '100%' }}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* aristas punteadas */}
      <g stroke={c.edge} strokeWidth="2.8" strokeLinecap="round" strokeDasharray="0.1 6.5" fill="none" opacity={edgeOp}>
        {EDGES.map(([x1,y1,x2,y2], i) => <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}/>)}
      </g>

      {/* wordmark */}
      <text
        x="78" y="335"
        fill={c.text}
        fontFamily="'Playfair Display', Georgia, serif"
        fontWeight="600"
        fontSize="134"
        textLength="672"
        lengthAdjust="spacing"
      >Antológico</text>

      {/* hub dots */}
      <circle cx="256" cy="108" r="6" fill={c.hub}/>
      <circle cx="446" cy="392" r="6" fill={c.hub}/>

      {/* nodos */}
      {[[392,128,c.n1],[184,190,c.n1],[315,198,c.n2],[522,190,c.n2],[656,158,c.n1],
        [213,413,c.n2],[365,445,c.n1],[561,428,c.n2],[692,390,c.n1]
      ].map(([cx,cy,fill],i) => <circle key={i} cx={cx} cy={cy} r="29" fill={fill}/>)}

      {/* íconos de rubros */}
      <g fill="none" stroke={c.istr} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        {/* paleta */}
        <g transform="translate(378 114) scale(1.1667)">
          <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.9 0 1.7-.8 1.7-1.7 0-.4-.2-.8-.4-1.1-.3-.3-.4-.7-.4-1.1 0-.9.8-1.7 1.7-1.7h2c3.1 0 5.6-2.5 5.6-5.6C22 6 17.5 2 12 2z"/>
          <circle cx="13.5" cy="6.5"  r="1.4" fill={c.ifil} stroke="none"/>
          <circle cx="17.5" cy="10.5" r="1.4" fill={c.ifil} stroke="none"/>
          <circle cx="8.5"  cy="7.5"  r="1.4" fill={c.ifil} stroke="none"/>
          <circle cx="6.5"  cy="12.5" r="1.4" fill={c.ifil} stroke="none"/>
        </g>
        {/* cámara */}
        <g transform="translate(170 176) scale(1.1667)">
          <rect x="3" y="7" width="18" height="13" rx="2"/>
          <path d="M8 7l2-3h4l2 3"/>
          <circle cx="12" cy="13.5" r="3.5"/>
        </g>
        {/* botánica / creativo */}
        <g transform="translate(301 184) scale(1.1667)">
          <g transform="rotate(12 15 10)">
            <path d="M10 4.5c3-1.2 7-1.2 10 0 .4 4.8-.6 9.6-5 11.5-4.4-1.9-5.4-6.7-5-11.5z"/>
            <path d="M11.8 7.6c.8-.5 1.6-.5 2.2.2M16 7.8c.6-.7 1.4-.7 2.2-.2M12.8 12.6c1.3-1 3.1-1 4.4 0"/>
          </g>
          <g transform="rotate(-12 9 13.5)">
            <path d="M4 8c3-1.2 7-1.2 10 0 .4 4.8-.6 9.6-5 11.5C4.6 17.6 3.6 12.8 4 8z" fill={c.ifil}/>
            <path d="M5.6 11c.7-.7 1.5-.7 2.2 0M10.2 11c.7-.7 1.5-.7 2.2 0M6.3 14.2c1.4 1.6 3.4 1.6 4.8 0" stroke={c.ocre} strokeWidth="1.5"/>
          </g>
        </g>
        {/* música */}
        <g transform="translate(508 176) scale(1.1667)">
          <path d="M9 18V5l11-2v13"/>
          <circle cx="6" cy="18" r="3"/>
          <circle cx="17" cy="16" r="3"/>
        </g>
        {/* bombilla */}
        <g transform="translate(642 144) scale(1.1667)">
          <path d="M17 21a1 1 0 0 0 1-1v-5.35c0-.457.316-.844.727-1.041a4 4 0 0 0-2.134-7.589 5 5 0 0 0-9.186 0 4 4 0 0 0-2.134 7.588c.411.198.727.585.727 1.041V20a1 1 0 0 0 1 1z"/>
          <path d="M6 17h12"/>
        </g>
        {/* persona caminando */}
        <g transform="translate(199 399) scale(1.1667)">
          <circle cx="12" cy="4" r="2.5" fill={c.ifil} stroke="none"/>
          <path d="M9.5 8c-1 .3-1.6 1-1.9 2L6 16c-.2.6.2 1.2.8 1.3.5.1 1-.2 1.2-.7L9.6 12 10 15h4l.4-3 1.5 4.6c.2.5.7.8 1.2.7.6-.1 1-.7.8-1.3l-1.7-5c-.3-1-.9-1.7-1.9-2z" fill={c.ifil} stroke="none"/>
          <path d="M3 20.5c0-2 4-3.5 9-3.5s9 1.5 9 3.5-4 2.5-9 2.5-9-.5-9-2.5z" fill={c.ifil} stroke="none"/>
        </g>
        {/* persona saltando */}
        <g transform="translate(351 431) scale(1.1667)">
          <circle cx="12" cy="3.5" r="2.2" fill={c.ifil} stroke="none"/>
          <path d="M12 6c-1 .2-1.5 1-1.4 1.9l.4 3.2-4.3 6.4c-.3.5 0 1.1.6 1.1h9.1c.6 0 .9-.6.6-1.1L12.9 11 13 8c0-1-.7-2-1.9-2z" fill={c.ifil} stroke="none"/>
          <path d="M11.5 8L7 4.5M14 8.5l4.5 1.8M10.5 19l-1.5 3M14 19l3.5 2.5" strokeWidth="1.9"/>
        </g>
        {/* pincel / arte */}
        <g transform="translate(547 414) scale(1.1667)">
          <path d="M15.7 3.3l5 5L18 11l-5-5z"/>
          <path d="M13 6L6.5 7.6 3 21l13.4-3.5L18 11"/>
          <line x1="3" y1="21" x2="9.5" y2="14.5"/>
          <circle cx="11" cy="13" r="2"/>
        </g>
        {/* fórmula matemática */}
        <text
          x="692" y="396"
          textAnchor="middle"
          fontFamily="'Playfair Display', Georgia, serif"
          fontStyle="italic"
          fontWeight="500"
          fontSize="15"
          fill={c.ifil}
          stroke="none"
        >∫cos(x)</text>
      </g>
    </svg>
  );
}
