import { useState } from 'react';

const PROVINCES = [
  { id: 'Buenos Aires', cx: 310, cy: 310, label: 'Buenos Aires' },
  { id: 'Ciudad Autónoma de Buenos Aires', cx: 330, cy: 285, label: 'CABA' },
  { id: 'Catamarca', cx: 200, cy: 155, label: 'Catamarca' },
  { id: 'Chaco', cx: 310, cy: 135, label: 'Chaco' },
  { id: 'Chubut', cx: 195, cy: 445, label: 'Chubut' },
  { id: 'Córdoba', cx: 250, cy: 235, label: 'Córdoba' },
  { id: 'Corrientes', cx: 355, cy: 160, label: 'Corrientes' },
  { id: 'Entre Ríos', cx: 315, cy: 230, label: 'Entre Ríos' },
  { id: 'Formosa', cx: 310, cy: 100, label: 'Formosa' },
  { id: 'Jujuy', cx: 195, cy: 70, label: 'Jujuy' },
  { id: 'La Pampa', cx: 230, cy: 320, label: 'La Pampa' },
  { id: 'La Rioja', cx: 195, cy: 195, label: 'La Rioja' },
  { id: 'Mendoza', cx: 175, cy: 270, label: 'Mendoza' },
  { id: 'Misiones', cx: 385, cy: 130, label: 'Misiones' },
  { id: 'Neuquén', cx: 175, cy: 365, label: 'Neuquén' },
  { id: 'Río Negro', cx: 200, cy: 395, label: 'Río Negro' },
  { id: 'Salta', cx: 210, cy: 90, label: 'Salta' },
  { id: 'San Juan', cx: 170, cy: 215, label: 'San Juan' },
  { id: 'San Luis', cx: 215, cy: 265, label: 'San Luis' },
  { id: 'Santa Cruz', cx: 190, cy: 510, label: 'Santa Cruz' },
  { id: 'Santa Fe', cx: 290, cy: 210, label: 'Santa Fe' },
  { id: 'Santiago del Estero', cx: 255, cy: 155, label: 'Sgo. del Estero' },
  { id: 'Tierra del Fuego', cx: 210, cy: 580, label: 'T. del Fuego' },
  { id: 'Tucumán', cx: 225, cy: 130, label: 'Tucumán' },
];

const OUTLINE = `M195,40 L215,55 L230,50 L240,70 L220,85 L210,100 L200,90 L185,75 L175,65 L195,40Z
  M240,70 L260,65 L290,72 L320,80 L340,90 L360,85 L380,95 L400,110 L395,135 L385,150 L370,165 L360,175
  L345,185 L335,200 L325,215 L335,230 L340,250 L345,275 L350,295 L340,310 L330,325 L310,340
  L290,350 L270,345 L255,340 L240,335 L225,345 L215,360 L200,370 L185,385 L175,400 L165,420
  L160,445 L165,465 L175,480 L185,500 L195,520 L205,545 L215,560 L225,575 L230,590 L220,600
  L200,595 L185,580 L175,565 L160,555 L150,540 L145,520 L140,500 L135,475 L130,450 L135,425
  L140,400 L145,375 L150,350 L155,330 L160,310 L160,290 L155,270 L150,250 L155,230 L160,210
  L165,195 L170,175 L175,155 L180,135 L185,115 L190,100 L195,80 L195,55 L195,40Z`;

function normalize(name) {
  return (name || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
}

export default function ArgentinaMap({ data = [] }) {
  const [hovered, setHovered] = useState(null);

  const countByProv = {};
  data.forEach(d => {
    const prov = d.geo?.provincia;
    if (!prov) return;
    const norm = normalize(prov);
    const match = PROVINCES.find(p => normalize(p.id) === norm || normalize(p.label) === norm);
    const key = match?.id ?? prov;
    countByProv[key] = (countByProv[key] || 0) + 1;
  });

  const maxCount = Math.max(1, ...Object.values(countByProv));
  const totalGeo = Object.values(countByProv).reduce((s, v) => s + v, 0);
  const sinGeo = data.length - totalGeo;

  return (
    <div className="flex flex-col gap-4">
      <div className="relative mx-auto" style={{ width: 440, height: 620 }}>
        <svg viewBox="100 30 340 590" width="440" height="620" className="block">
          {/* Outline */}
          <path d={OUTLINE} fill="rgb(var(--color-surface-200))" stroke="rgb(var(--color-border))" strokeWidth="1.5" />

          {/* Province bubbles */}
          {PROVINCES.map(prov => {
            const count = countByProv[prov.id] || 0;
            if (count === 0) return null;
            const r = 8 + (count / maxCount) * 28;
            const opacity = 0.3 + (count / maxCount) * 0.6;
            const isHovered = hovered === prov.id;
            return (
              <g key={prov.id}
                onMouseEnter={() => setHovered(prov.id)}
                onMouseLeave={() => setHovered(null)}
                className="cursor-pointer"
              >
                <circle cx={prov.cx} cy={prov.cy} r={r}
                  fill="#5B6FA8" fillOpacity={opacity}
                  stroke={isHovered ? '#fff' : '#5B6FA8'} strokeWidth={isHovered ? 2 : 1} strokeOpacity={0.6}
                />
                {(isHovered || count / maxCount > 0.5) && (
                  <text x={prov.cx} y={prov.cy + 1} textAnchor="middle" dominantBaseline="central"
                    fill="#fff" fontSize="10" fontWeight="600" className="pointer-events-none">
                    {count}
                  </text>
                )}
              </g>
            );
          })}

          {/* Province labels for small/no bubbles */}
          {PROVINCES.map(prov => {
            const count = countByProv[prov.id] || 0;
            if (count > 0) return null;
            return (
              <text key={prov.id} x={prov.cx} y={prov.cy} textAnchor="middle" dominantBaseline="central"
                fill="rgb(var(--color-ink-muted))" fontSize="7" className="pointer-events-none" opacity="0.5">
                {prov.label}
              </text>
            );
          })}
        </svg>

        {/* Tooltip */}
        {hovered && countByProv[hovered] && (
          <div className="absolute top-2 right-2 bg-[#1A1611] border border-white/10 rounded-lg px-3 py-2 text-xs text-white shadow-lg pointer-events-none">
            <p className="font-medium">{hovered}</p>
            <p className="text-[#5B9FD8] mt-0.5">{countByProv[hovered]} tenant{countByProv[hovered] !== 1 ? 's' : ''}</p>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 text-xs text-ink-muted">
        <span>{totalGeo} con ubicación</span>
        {sinGeo > 0 && <span>· {sinGeo} sin datos</span>}
      </div>

      {/* Province ranking */}
      {Object.keys(countByProv).length > 0 && (
        <div className="flex flex-col gap-1.5 mt-2">
          {Object.entries(countByProv)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 8)
            .map(([prov, count]) => (
              <div key={prov} className="flex items-center gap-2">
                <span className="text-xs text-ink flex-1 truncate">{prov}</span>
                <div className="w-20 h-1.5 bg-surface-200 rounded-full overflow-hidden shrink-0">
                  <div className="h-full rounded-full bg-[#5B6FA8]" style={{ width: `${Math.round(count / maxCount * 100)}%` }} />
                </div>
                <span className="font-mono text-xs text-ink-muted w-6 text-right shrink-0">{count}</span>
              </div>
            ))
          }
        </div>
      )}
    </div>
  );
}
