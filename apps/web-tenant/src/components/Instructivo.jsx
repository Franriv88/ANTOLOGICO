import { useState } from 'react';

// ── Paleta ─────────────────────────────────────────────────────────────────────
const C  = '#E85D4A';
const B  = '#FAF8F4';
const S  = '#F2EDE3';
const S2 = '#EAE3D5';
const BR = '#D2C4A8';
const INK = '#2B241A';
const I2 = '#5A4F42';
const I3 = '#9B8F80';
const GN = '#10B981';
const AM = '#F59E0B';
const RD = '#DC2626';
const WH = '#ffffff';
const OCRE = '#B98527';
const SIDE = '#F5F1E9';

const F = { fontFamily: "'IBM Plex Sans', sans-serif" };

// ── Helpers SVG ───────────────────────────────────────────────────────────────
function SidebarIcon({ x, y, type }) {
  const s = 9;
  const cx = x + s / 2;
  const cy = y + s / 2;
  if (type === 'talleres') return (
    <g>
      <rect x={x} y={y} width="4" height="4" rx="0.8" fill="currentColor" opacity="0.7" />
      <rect x={x+5} y={y} width="4" height="4" rx="0.8" fill="currentColor" opacity="0.7" />
      <rect x={x} y={y+5} width="4" height="4" rx="0.8" fill="currentColor" opacity="0.7" />
      <rect x={x+5} y={y+5} width="4" height="4" rx="0.8" fill="currentColor" opacity="0.7" />
    </g>
  );
  if (type === 'reservas') return (
    <g>
      <rect x={x+1} y={y+2} width="7" height="6" rx="1" fill="none" stroke="currentColor" strokeWidth="0.8" />
      <line x1={x+3} y1={y} x2={x+3} y2={y+3} stroke="currentColor" strokeWidth="0.8" />
      <line x1={x+6} y1={y} x2={x+6} y2={y+3} stroke="currentColor" strokeWidth="0.8" />
    </g>
  );
  if (type === 'reportes') return (
    <g>
      <rect x={x+1} y={y+5} width="2" height="4" rx="0.5" fill="currentColor" opacity="0.7" />
      <rect x={x+4} y={y+3} width="2" height="6" rx="0.5" fill="currentColor" opacity="0.7" />
      <rect x={x+7} y={y+1} width="2" height="8" rx="0.5" fill="currentColor" opacity="0.7" />
    </g>
  );
  if (type === 'config') return (
    <circle cx={cx} cy={cy} r="3.5" fill="none" stroke="currentColor" strokeWidth="0.9" />
  );
  return null;
}

// ── Card de taller (mini) ────────────────────────────────────────────────────
function MiniCard({ x, y, w, nombre, precio, cupos, total, color, isDraft }) {
  const headerH = isDraft ? 2 : 2;
  const bg = isDraft ? '#F5F4F2' : WH;
  const bdr = isDraft ? '#E0DEDA' : BR;
  const txtMain = isDraft ? '#9B9895' : INK;
  const txtMuted = isDraft ? '#B0ADAA' : I3;
  const headerColor = isDraft ? '#D1D0CE' : color;
  const pct = total > 0 ? cupos / total : 0;
  const slotColor = isDraft ? '#B0ADAA' : pct > 0.3 ? GN : pct > 0 ? AM : RD;
  const slotLabel = isDraft ? 'Borrador' : pct > 0.3 ? 'Disponible' : pct > 0 ? 'Últimos' : 'Agotado';

  return (
    <g>
      <rect x={x} y={y} width={w} height={isDraft ? 76 : 82} rx="5" fill={bg} stroke={bdr} strokeWidth="0.6" />
      <rect x={x} y={y} width={w} height={headerH} rx="5" fill={headerColor} />
      <rect x={x} y={y+headerH} width={w} height={2} fill={headerColor} />
      {/* price / draft badge */}
      <rect x={x+4} y={y+7} width={isDraft ? 38 : 30} height="10" rx="4" fill={isDraft ? '#9B9895' : headerColor} />
      <text x={x + (isDraft ? 23 : 19)} y={y+14.5} fontSize="6" fill={WH} fontWeight="600" textAnchor="middle">
        {isDraft ? 'Borrador' : precio}
      </text>
      {/* nombre */}
      <text x={x+5} y={y+28} fontSize="6.5" fill={txtMain} fontWeight="600">{nombre}</text>
      {/* cupos */}
      <text x={x+5} y={y+38} fontSize="5.5" fill={txtMuted} fontWeight="500">
        {isDraft ? '' : `${total - cupos}/${total} cupos`}
      </text>
      {/* slot badge */}
      <rect x={x+4} y={y + (isDraft ? 44 : 48)} width={w-8} height={isDraft ? 14 : 10} rx={isDraft ? 3 : 5}
            fill={isDraft ? '#F5F4F2' : `${slotColor}15`}
            stroke={isDraft ? '#B0ADAA' : slotColor} strokeWidth={isDraft ? '0.8' : '0.4'}
            strokeDasharray={isDraft ? '2 2' : 'none'} />
      <text x={x + w/2} y={y + (isDraft ? 54 : 55.5)} fontSize="5.5" fill={isDraft ? I2 : slotColor}
            fontWeight={isDraft ? '600' : '500'} textAnchor="middle">
        {isDraft ? 'Continuar configuración' : slotLabel}
      </text>
      {/* quick actions for non-draft */}
      {!isDraft && (
        <g>
          <rect x={x+4} y={y+62} width={(w-10)/2} height="10" rx="3" fill={S} stroke={BR} strokeWidth="0.3" />
          <text x={x+4+(w-10)/4} y={y+69} fontSize="5" fill={I2} textAnchor="middle">Ocultar</text>
          <rect x={x+4+(w-10)/2+2} y={y+62} width={(w-10)/2} height="10" rx="3" fill={S} stroke={BR} strokeWidth="0.3" />
          <text x={x+4+(w-10)*3/4+2} y={y+69} fontSize="5" fill={I2} textAnchor="middle">Mostrar</text>
        </g>
      )}
    </g>
  );
}

// ── Ilustración 1: Panel de control ───────────────────────────────────────────
function IlluPanel() {
  return (
    <svg viewBox="0 0 460 210" width="100%" style={{ display: 'block', ...F }}>
      <rect width="460" height="210" fill={C} />
      <rect x="12" y="8" width="436" height="194" rx="8" fill={B} />
      {/* sidebar */}
      <rect x="12" y="8" width="90" height="194" rx="8" fill={SIDE} />
      <rect x="102" y="8" width="2" height="194" fill={SIDE} />
      {/* logo */}
      <rect x="18" y="14" width="78" height="20" rx="3" fill={S2} />
      <rect x="22" y="17" width="14" height="14" rx="3" fill={C} opacity="0.5" />
      <text x="40" y="27" fontSize="7.5" fill={INK} fontWeight="600">Antológico</text>
      {/* espacio name */}
      <text x="20" y="48" fontSize="7" fill={INK} fontWeight="600">Studio Mabel</text>
      <text x="20" y="57" fontSize="6" fill={I3}>Arte & Cerámica</text>
      <line x1="18" y1="62" x2="96" y2="62" stroke={BR} strokeWidth="0.4" />
      {/* nav items with icons */}
      {/* active: Talleres */}
      <rect x="12" y="68" width="3" height="16" rx="1.5" fill={C} />
      <rect x="18" y="68" width="76" height="16" rx="4" fill={C} opacity="0.1" />
      <g color={C}><SidebarIcon x={22} y={71.5} type="talleres" /></g>
      <text x="34" y="79" fontSize="7" fill={C} fontWeight="600">Talleres</text>
      {/* Reservas */}
      <g color={I3}><SidebarIcon x={22} y={89.5} type="reservas" /></g>
      <text x="34" y="97" fontSize="7" fill={I3}>Reservas</text>
      {/* Reportes */}
      <g color={I3}><SidebarIcon x={22} y={107.5} type="reportes" /></g>
      <text x="34" y="115" fontSize="7" fill={I3}>Reportes</text>
      {/* Config */}
      <g color={I3}><SidebarIcon x={22} y={125.5} type="config" /></g>
      <text x="34" y="133" fontSize="7" fill={I3}>Configuración</text>
      {/* Mis datos */}
      <text x="34" y="150" fontSize="7" fill={I3}>Mis datos</text>
      {/* plan badge */}
      <rect x="18" y="160" width="76" height="14" rx="4" fill={S2} />
      <text x="56" y="170" fontSize="6" fill={OCRE} fontWeight="500" textAnchor="middle">Plan Profesional</text>
      {/* ver pública */}
      <text x="18" y="190" fontSize="6" fill={C}>↗ Ver página pública</text>

      {/* top bar */}
      <line x1="104" y1="28" x2="448" y2="28" stroke={BR} strokeWidth="0.4" />
      <text x="360" y="20" fontSize="6.5" fill={I3}>mabel@estudio.com</text>
      <rect x="416" y="12" width="30" height="12" rx="3" fill={S2} />
      <text x="431" y="21" fontSize="6" fill={I2} textAnchor="middle">Salir</text>
      {/* trial banner */}
      <rect x="104" y="28" width="344" height="13" fill="#FEF3C7" />
      <text x="276" y="37" fontSize="6" fill="#92400E" textAnchor="middle">Prueba gratuita · Te quedan 12 días</text>
      {/* page title */}
      <text x="116" y="55" fontSize="10" fill={INK} fontWeight="700">Talleres</text>
      <rect x="370" y="46" width="68" height="14" rx="5" fill={C} />
      <text x="404" y="55.5" fontSize="6.5" fill={WH} fontWeight="600" textAnchor="middle">+ Nuevo taller</text>
      {/* cards grid */}
      <MiniCard x={116} y={64} w={100} nombre="Yoga Restaurativo" precio="$3.500" cupos={4} total={12} color={C} />
      <MiniCard x={222} y={64} w={100} nombre="Cerámica básica" precio="$5.200" cupos={0} total={12} color={OCRE} />
      <MiniCard x={328} y={64} w={100} nombre="Intro acuarela" precio="$4.000" cupos={8} total={8} color="#607D8B" />
      {/* draft card */}
      <MiniCard x={116} y={152} w={100} nombre="Sin título" precio="" cupos={0} total={0} color="#D1D0CE" isDraft />
    </svg>
  );
}

// ── Ilustración 2: Mi Espacio ──────────────────────────────────────────────────
function IlluEspacio() {
  return (
    <svg viewBox="0 0 460 200" width="100%" style={{ display: 'block', ...F }}>
      <rect width="460" height="200" fill={C} />
      <rect x="14" y="10" width="432" height="180" rx="8" fill={B} />
      {/* tabs */}
      {[
        { label: 'Mi Espacio', active: true, x: 22 },
        { label: 'Identidad',  active: false, x: 96 },
        { label: 'Cobros',     active: false, x: 162 },
        { label: 'Suscripción',active: false, x: 210 },
      ].map(({ label, active, x }) => (
        <g key={label}>
          <text x={x} y="28" fontSize="8" fill={active ? C : I3} fontWeight={active ? '600' : '400'}>{label}</text>
          {active && <rect x={x} y="32" width={label.length * 6.5} height="2" rx="1" fill={C} />}
        </g>
      ))}
      <line x1="14" y1="34" x2="446" y2="34" stroke={BR} strokeWidth="0.4" />
      {/* col izq */}
      <text x="22" y="50" fontSize="7" fill={I3}>Nombre del espacio</text>
      <rect x="22" y="54" width="180" height="16" rx="4" fill={WH} stroke={BR} strokeWidth="0.6" />
      <text x="28" y="65" fontSize="7.5" fill={INK}>Studio Mabel</text>
      <text x="22" y="82" fontSize="7" fill={I3}>Rubro</text>
      <rect x="22" y="86" width="180" height="16" rx="4" fill={WH} stroke={BR} strokeWidth="0.6" />
      <text x="28" y="97" fontSize="7.5" fill={I2}>Arte & Manualidades</text>
      <text x="22" y="113" fontSize="7" fill={I3}>Descripción</text>
      <rect x="22" y="117" width="180" height="28" rx="4" fill={WH} stroke={BR} strokeWidth="0.6" />
      <text x="28" y="129" fontSize="7" fill={I2}>Talleres de cerámica y acuarela</text>
      <text x="28" y="139" fontSize="7" fill={I2}>para todos los niveles.</text>
      {/* ubicaciones */}
      <text x="22" y="157" fontSize="7" fill={I3}>Ubicaciones</text>
      <rect x="22" y="161" width="180" height="24" rx="4" fill={S} stroke={BR} strokeWidth="0.4" />
      <circle cx="32" cy="170" r="3" fill={C} opacity="0.3" />
      <text x="38" y="168" fontSize="6.5" fill={INK} fontWeight="500">Estudio central</text>
      <text x="38" y="177" fontSize="6" fill={I3}>Gurruchaga 1234, Palermo</text>
      {/* col der: QR */}
      <rect x="224" y="46" width="96" height="96" rx="8" fill={S} stroke={BR} strokeWidth="0.4" />
      <text x="272" y="60" fontSize="7" fill={I3} textAnchor="middle">Tu QR</text>
      {[0,1,2,3,4].map(r => [0,1,2,3,4].map(cc => {
        const on = [[1,1,1,0,1],[1,0,1,1,0],[1,1,0,1,1],[0,1,1,0,1],[1,0,1,1,1]][r][cc];
        return <rect key={`${r}${cc}`} x={240+cc*13} y={66+r*13} width="10" height="10" rx="2" fill={on ? I2 : S} opacity="0.4" />;
      }))}
      <text x="272" y="140" fontSize="6.5" fill={C} textAnchor="middle">antologico.app/p/mabel</text>
      {/* links sociales */}
      <text x="224" y="157" fontSize="7" fill={I3}>Links</text>
      <rect x="224" y="161" width="94" height="14" rx="4" fill={S} stroke={BR} strokeWidth="0.4" />
      <text x="230" y="171" fontSize="6.5" fill={I2}>Instagram · Cafecito</text>
      {/* guardar */}
      <rect x="340" y="170" width="92" height="16" rx="5" fill={C} />
      <text x="386" y="181" fontSize="7.5" fill={WH} fontWeight="600" textAnchor="middle">Guardar cambios</text>
    </svg>
  );
}

// ── Ilustración 3: Identidad ───────────────────────────────────────────────────
function IlluIdentidad() {
  return (
    <svg viewBox="0 0 460 200" width="100%" style={{ display: 'block', ...F }}>
      <rect width="460" height="200" fill={C} />
      <rect x="14" y="10" width="432" height="180" rx="8" fill={B} />
      {/* tabs */}
      <text x="22" y="28" fontSize="8" fill={I3}>Mi Espacio</text>
      <text x="88" y="28" fontSize="8" fill={C} fontWeight="600">Identidad</text>
      <rect x="88" y="32" width="48" height="2" rx="1" fill={C} />
      <text x="150" y="28" fontSize="8" fill={I3}>Cobros</text>
      <text x="196" y="28" fontSize="8" fill={I3}>Suscripción</text>
      <line x1="14" y1="34" x2="446" y2="34" stroke={BR} strokeWidth="0.4" />
      {/* Logo section */}
      <text x="22" y="50" fontSize="7.5" fill={I2} fontWeight="600">Logo</text>
      <circle cx="60" cy="80" r="24" fill={S2} stroke={BR} strokeWidth="0.6" />
      <circle cx="60" cy="80" r="16" fill={C} opacity="0.2" />
      <text x="60" y="84" fontSize="10" fill={C} textAnchor="middle" fontWeight="700">M</text>
      {/* shape options */}
      {[
        { lbl: 'Círculo', rx: 14 },
        { lbl: 'Cuadrado', rx: 4 },
        { lbl: 'Libre', rx: 0 },
      ].map(({ lbl, rx }, i) => (
        <g key={lbl}>
          <rect x={96+i*42} y="64" width="30" height="30" rx={rx}
                fill={i === 0 ? S2 : S} stroke={i === 0 ? C : BR} strokeWidth={i === 0 ? 1.2 : 0.5} />
          <text x={111+i*42} y="104" fontSize="6" fill={I3} textAnchor="middle">{lbl}</text>
        </g>
      ))}
      {/* Colores de marca */}
      <text x="22" y="120" fontSize="7.5" fill={I2} fontWeight="600">Colores de marca</text>
      {['#E85D4A','#B98527','#2B241A','#F2EDE3','#10B981','#607D8B'].map((col, i) => (
        <circle key={i} cx={30+i*26} cy="137" r="9" fill={col} stroke={WH} strokeWidth="1.5" />
      ))}
      <text x="22" y="158" fontSize="6.5" fill={I3}>Roles: Principal · Secundario · Botones · Fondo</text>
      {/* AI sugerido */}
      <rect x="22" y="164" width="180" height="14" rx="4" fill="#EFF6FF" stroke="#BFDBFE" strokeWidth="0.5" />
      <text x="30" y="174" fontSize="6.5" fill="#2563EB" fontWeight="500">✨ Paleta sugerida desde tu logo</text>
      {/* Tipografías */}
      <text x="240" y="50" fontSize="7.5" fill={I2} fontWeight="600">Tipografías</text>
      {[
        { d: 'Playfair Display', b: 'Lato', active: false },
        { d: 'Poppins',          b: 'Inter', active: true  },
        { d: 'Bebas Neue',       b: 'Montserrat', active: false },
      ].map(({ d, b, active }, i) => (
        <g key={d}>
          <rect x="240" y={56+i*42} width="196" height="36" rx="5" fill={S}
                stroke={active ? C : BR} strokeWidth={active ? 1.2 : 0.4} />
          {active && <circle cx="428" cy={74+i*42} r="5" fill={C} />}
          {active && <text x="428" y={77+i*42} fontSize="6" fill={WH} textAnchor="middle" fontWeight="700">✓</text>}
          <text x="252" y={71+i*42} fontSize="9" fill={INK} fontWeight="700">{d}</text>
          <text x="252" y={83+i*42} fontSize="7" fill={I3}>{b} · Textos y UI</text>
        </g>
      ))}
    </svg>
  );
}

// ── Ilustración 4: Mis Cobros ──────────────────────────────────────────────────
function IlluCobros() {
  return (
    <svg viewBox="0 0 460 200" width="100%" style={{ display: 'block', ...F }}>
      <rect width="460" height="200" fill={C} />
      <rect x="14" y="10" width="432" height="180" rx="8" fill={B} />
      {/* tabs */}
      <text x="22" y="28" fontSize="8" fill={I3}>Mi Espacio</text>
      <text x="88" y="28" fontSize="8" fill={I3}>Identidad</text>
      <text x="148" y="28" fontSize="8" fill={C} fontWeight="600">Cobros</text>
      <rect x="148" y="32" width="36" height="2" rx="1" fill={C} />
      <text x="198" y="28" fontSize="8" fill={I3}>Suscripción</text>
      <line x1="14" y1="34" x2="446" y2="34" stroke={BR} strokeWidth="0.4" />
      {/* Efectivo - ON */}
      <rect x="20" y="42" width="200" height="40" rx="6" fill={WH} stroke={`${GN}50`} strokeWidth="0.8" />
      <text x="30" y="56" fontSize="8" fill={INK} fontWeight="600">Efectivo</text>
      <text x="30" y="67" fontSize="6.5" fill={I3}>Reserva online, pago al llegar.</text>
      <rect x="196" y="52" width="16" height="9" rx="4.5" fill={GN} />
      <circle cx="207" cy="56.5" r="3.5" fill={WH} />
      {/* Mercado Pago - OFF */}
      <rect x="20" y="88" width="200" height="40" rx="6" fill={WH} stroke={BR} strokeWidth="0.4" />
      <text x="30" y="102" fontSize="8" fill={INK} fontWeight="600">Mercado Pago</text>
      <text x="30" y="113" fontSize="6.5" fill={I3}>Cobro online al reservar.</text>
      <rect x="196" y="98" width="16" height="9" rx="4.5" fill={BR} />
      <circle cx="201" cy="102.5" r="3.5" fill={WH} />
      {/* Links de pago */}
      <rect x="20" y="134" width="200" height="40" rx="6" fill={WH} stroke={BR} strokeWidth="0.4" />
      <text x="30" y="148" fontSize="8" fill={INK} fontWeight="600">Links de pago</text>
      <text x="30" y="159" fontSize="6.5" fill={I3}>Cafecito, MercadoShops, etc.</text>
      <rect x="140" y="162" width="68" height="10" rx="4" fill={S} stroke={BR} strokeWidth="0.4" />
      <text x="174" y="170" fontSize="5.5" fill={C} fontWeight="500" textAnchor="middle">+ Agregar link</text>
      {/* Política de cancelación */}
      <rect x="234" y="42" width="206" height="76" rx="6" fill={WH} stroke={BR} strokeWidth="0.4" />
      <text x="244" y="57" fontSize="8" fill={INK} fontWeight="600">Política de cancelación</text>
      <text x="244" y="69" fontSize="6.5" fill={I3}>Cuántas horas antes puede</text>
      <text x="244" y="79" fontSize="6.5" fill={I3}>cancelar el alumno su reserva.</text>
      <rect x="244" y="86" width="32" height="16" rx="4" fill={WH} stroke={C} strokeWidth="1" />
      <text x="260" y="97" fontSize="9" fill={C} fontWeight="700" textAnchor="middle">24</text>
      <text x="282" y="97" fontSize="7" fill={I3}>horas antes</text>
      <text x="244" y="114" fontSize="6.5" fill="#059669">✓ Pueden cancelar hasta el día anterior</text>
      {/* T&C */}
      <rect x="234" y="126" width="206" height="40" rx="6" fill={WH} stroke={BR} strokeWidth="0.4" />
      <text x="244" y="141" fontSize="8" fill={INK} fontWeight="600">Términos y Condiciones</text>
      <text x="244" y="153" fontSize="6.5" fill={I3}>Texto que el alumno acepta al reservar.</text>
      {/* guardar */}
      <rect x="234" y="172" width="92" height="16" rx="5" fill={C} />
      <text x="280" y="183" fontSize="7.5" fill={WH} fontWeight="600" textAnchor="middle">Guardar cambios</text>
    </svg>
  );
}

// ── Ilustración 5: Talleres cards ─────────────────────────────────────────────
function IlluTalleres() {
  return (
    <svg viewBox="0 0 460 200" width="100%" style={{ display: 'block', ...F }}>
      <rect width="460" height="200" fill={C} />
      <rect x="14" y="10" width="432" height="180" rx="8" fill={B} />
      <text x="22" y="28" fontSize="11" fill={INK} fontWeight="700">Talleres</text>
      <rect x="362" y="16" width="72" height="16" rx="5" fill={C} />
      <text x="398" y="27" fontSize="6.5" fill={WH} fontWeight="600" textAnchor="middle">+ Nuevo taller</text>
      {/* search + filter */}
      <rect x="22" y="36" width="140" height="14" rx="4" fill={WH} stroke={BR} strokeWidth="0.5" />
      <text x="30" y="45.5" fontSize="6.5" fill={I3}>Buscar taller…</text>
      <rect x="168" y="36" width="70" height="14" rx="4" fill={WH} stroke={BR} strokeWidth="0.5" />
      <text x="184" y="45.5" fontSize="6.5" fill={I3}>▾ Estado</text>
      {/* row 1: draft first */}
      <MiniCard x={22}  y={56} w={102} nombre="Sin título" precio="" cupos={0} total={0} color="#D1D0CE" isDraft />
      <MiniCard x={130} y={56} w={102} nombre="Yoga Restaurativo" precio="$3.500" cupos={4} total={12} color={C} />
      <MiniCard x={238} y={56} w={102} nombre="Cerámica básica" precio="$5.200" cupos={0} total={12} color={OCRE} />
      <MiniCard x={346} y={56} w={86}  nombre="Acuarela" precio="$4K" cupos={8} total={8} color="#607D8B" />
      {/* row 2 */}
      <MiniCard x={22}  y={148} w={102} nombre="Collage express" precio="$2.800" cupos={7} total={10} color="#7C3AED" />
      <MiniCard x={130} y={148} w={102} nombre="Mosaiquismo" precio="$6.000" cupos={2} total={8} color="#14B8A6" />
    </svg>
  );
}

// ── Ilustración 6: Crear taller ───────────────────────────────────────────────
function IlluFormTaller() {
  return (
    <svg viewBox="0 0 460 210" width="100%" style={{ display: 'block', ...F }}>
      <rect width="460" height="210" fill={C} />
      <rect x="14" y="8" width="432" height="194" rx="8" fill={B} />
      <text x="22" y="22" fontSize="6" fill={I3}>← Volver a talleres</text>
      <text x="22" y="36" fontSize="10" fill={INK} fontWeight="700">Nuevo taller</text>
      {/* col izq */}
      {/* nombre */}
      <text x="22" y="50" fontSize="6.5" fill={I3}>Nombre *</text>
      <rect x="22" y="53" width="188" height="14" rx="3" fill={WH} stroke={C} strokeWidth="0.8" />
      <text x="28" y="63" fontSize="7" fill={INK}>Yoga Restaurativo</text>
      {/* tipo */}
      <text x="22" y="78" fontSize="6.5" fill={I3}>Tipo de encuentro *</text>
      {[
        { t: 'Workshop', active: true },
        { t: 'Taller', active: false },
        { t: 'Clase', active: false },
        { t: 'Curso', active: false },
      ].map(({ t, active }, i) => (
        <g key={t}>
          <rect x={22+i*48} y={82} width={44} height={22} rx="3"
                fill={active ? `${C}0D` : S} stroke={active ? C : BR} strokeWidth={active ? 1.2 : 0.4} />
          <text x={44+i*48} y={94} fontSize="6" fill={active ? C : INK} fontWeight={active ? '600' : '400'} textAnchor="middle">{t}</text>
          <text x={44+i*48} y={101} fontSize="4.5" fill={I3} textAnchor="middle">{active ? '1 día' : i===1 ? 'Varios' : i===2 ? '1 clase' : 'Programa'}</text>
        </g>
      ))}
      {/* experiencia */}
      <text x="22" y="118" fontSize="6.5" fill={I3}>Experiencia *</text>
      <rect x="22" y="121" width="92" height="14" rx="3" fill={`${C}0D`} stroke={C} strokeWidth="0.8" />
      <text x="68" y="131" fontSize="6" fill={C} fontWeight="500" textAnchor="middle">No se requiere</text>
      <rect x="118" y="121" width="92" height="14" rx="3" fill={S} stroke={BR} strokeWidth="0.4" />
      <text x="164" y="131" fontSize="6" fill={I2} textAnchor="middle">Se requiere</text>
      {/* métodos de pago */}
      <text x="22" y="148" fontSize="6.5" fill={I3}>Métodos de pago *</text>
      {[
        { lbl: 'Efectivo', on: true },
        { lbl: 'Mercado Pago', on: false },
      ].map(({ lbl, on }, i) => (
        <g key={lbl}>
          <rect x={28} y={152+i*13} width="8" height="8" rx="1.5" fill={on ? C : WH} stroke={on ? C : BR} strokeWidth="0.8" />
          {on && <text x="32" y={159+i*13} fontSize="6" fill={WH} textAnchor="middle" fontWeight="700">✓</text>}
          <text x="40" y={159+i*13} fontSize="6.5" fill={INK}>{lbl}</text>
        </g>
      ))}
      {/* auto-save indicator */}
      <rect x="22" y="182" width="188" height="14" rx="4" fill="#F0FDF4" stroke="#BBF7D0" strokeWidth="0.4" />
      <text x="116" y="192" fontSize="6" fill="#059669" fontWeight="500" textAnchor="middle">↻ Borrador guardado automáticamente</text>

      {/* col der */}
      {/* fecha + hora */}
      <text x="224" y="50" fontSize="6.5" fill={I3}>Fecha *</text>
      <rect x="224" y="53" width="72" height="14" rx="3" fill={WH} stroke={BR} strokeWidth="0.5" />
      <text x="230" y="63" fontSize="7" fill={INK} fontFamily="'IBM Plex Mono', monospace">15/11/2025</text>
      <text x="302" y="50" fontSize="6.5" fill={I3}>Hora *</text>
      <rect x="302" y="53" width="30" height="14" rx="3" fill={WH} stroke={BR} strokeWidth="0.5" />
      <text x="317" y="63" fontSize="7" fill={INK} textAnchor="middle">10</text>
      <text x="334" y="63" fontSize="8" fill={I3}>:</text>
      <rect x="338" y="53" width="30" height="14" rx="3" fill={WH} stroke={BR} strokeWidth="0.5" />
      <text x="353" y="63" fontSize="7" fill={INK} textAnchor="middle">00</text>
      {/* cupos + precio */}
      <text x="224" y="78" fontSize="6.5" fill={I3}>Cupos *</text>
      <rect x="224" y="81" width="56" height="14" rx="3" fill={WH} stroke={BR} strokeWidth="0.5" />
      <text x="252" y="91" fontSize="7" fill={INK} textAnchor="middle" fontFamily="'IBM Plex Mono', monospace">12</text>
      <text x="286" y="78" fontSize="6.5" fill={I3}>Precio (ARS) *</text>
      <rect x="286" y="81" width="80" height="14" rx="3" fill={WH} stroke={BR} strokeWidth="0.5" />
      <text x="326" y="91" fontSize="7" fill={INK} textAnchor="middle" fontFamily="'IBM Plex Mono', monospace">3500</text>
      {/* duración */}
      <text x="224" y="106" fontSize="6.5" fill={I3}>Duración</text>
      <rect x="224" y="109" width="36" height="14" rx="3" fill={WH} stroke={BR} strokeWidth="0.5" />
      <text x="242" y="119" fontSize="7" fill={INK} textAnchor="middle">2</text>
      <text x="264" y="119" fontSize="6" fill={I3}>hs</text>
      <rect x="276" y="109" width="42" height="14" rx="3" fill={WH} stroke={BR} strokeWidth="0.5" />
      <text x="297" y="119" fontSize="7" fill={INK} textAnchor="middle">0 min</text>
      {/* encabezado color picker */}
      <text x="224" y="136" fontSize="6.5" fill={I3}>Encabezado de tarjeta</text>
      <rect x="224" y="139" width="142" height="10" rx="3" fill={C} />
      {['#E85D4A','#B98527','#607D8B','#10B981','#7C3AED','#1A1611'].map((col, i) => (
        <circle key={i} cx={232+i*18} cy="160" r="6" fill={col} stroke={i===0?WH:S} strokeWidth="1.2" />
      ))}
      {/* estado */}
      <text x="224" y="178" fontSize="6.5" fill={I3}>Estado</text>
      {[
        { lbl: 'Activo', active: true },
        { lbl: 'Ocultar', active: false },
        { lbl: 'Agotar', active: false },
      ].map(({ lbl, active }, i) => (
        <g key={lbl}>
          <rect x={224+i*48} y={181} width={44} height={14} rx="3"
                fill={active ? `${C}0D` : S} stroke={active ? C : BR} strokeWidth={active ? 1 : 0.4} />
          <text x={246+i*48} y={190.5} fontSize="6" fill={active ? C : I2} fontWeight={active ? '600' : '400'} textAnchor="middle">{lbl}</text>
        </g>
      ))}
    </svg>
  );
}

// ── Ilustración 7: Borradores ─────────────────────────────────────────────────
function IlluBorradores() {
  return (
    <svg viewBox="0 0 460 200" width="100%" style={{ display: 'block', ...F }}>
      <rect width="460" height="200" fill={C} />
      <rect x="14" y="10" width="432" height="180" rx="8" fill={B} />
      {/* timeline illustration */}
      <text x="230" y="26" fontSize="9" fill={INK} fontWeight="700" textAnchor="middle">Borradores automáticos</text>
      {/* step 1: editing */}
      <rect x="24" y="38" width="128" height="72" rx="6" fill={WH} stroke={BR} strokeWidth="0.5" />
      <rect x="32" y="44" width="112" height="12" rx="3" fill={S} />
      <text x="38" y="53" fontSize="6.5" fill={INK}>Yoga Restaurati...</text>
      <rect x="32" y="60" width="50" height="8" rx="2" fill={S} />
      <rect x="86" y="60" width="36" height="8" rx="2" fill={S} />
      <rect x="32" y="72" width="80" height="8" rx="2" fill={S} />
      <rect x="32" y="84" width="112" height="14" rx="4" fill="#F0FDF4" stroke="#BBF7D0" strokeWidth="0.4" />
      <text x="88" y="94" fontSize="5.5" fill="#059669" fontWeight="500" textAnchor="middle">↻ Guardado automático cada 3s</text>
      <text x="88" y="120" fontSize="7" fill={INK} fontWeight="600" textAnchor="middle">1. Empezás a crear</text>
      <text x="88" y="130" fontSize="6" fill={I3} textAnchor="middle">El formulario guarda solo</text>

      {/* arrow */}
      <line x1="158" y1="74" x2="172" y2="74" stroke={C} strokeWidth="1.5" />
      <polygon points="172,70 180,74 172,78" fill={C} />

      {/* step 2: navigate away */}
      <rect x="186" y="38" width="92" height="72" rx="6" fill={S} stroke={BR} strokeWidth="0.5" />
      <text x="232" y="56" fontSize="18" fill={I3} textAnchor="middle" opacity="0.5">↗</text>
      <text x="232" y="80" fontSize="6.5" fill={I2} textAnchor="middle">Salís de la pantalla</text>
      <text x="232" y="90" fontSize="6" fill={I3} textAnchor="middle">Cerrar sesión, navegar</text>
      <text x="232" y="100" fontSize="6" fill={I3} textAnchor="middle">a Mis Cobros, etc.</text>
      <text x="232" y="120" fontSize="7" fill={INK} fontWeight="600" textAnchor="middle">2. Te vas</text>
      <text x="232" y="130" fontSize="6" fill={I3} textAnchor="middle">No perdés nada</text>

      {/* arrow */}
      <line x1="284" y1="74" x2="298" y2="74" stroke={C} strokeWidth="1.5" />
      <polygon points="298,70 306,74 298,78" fill={C} />

      {/* step 3: draft in list */}
      <rect x="312" y="38" width="128" height="72" rx="6" fill={WH} stroke={BR} strokeWidth="0.5" />
      {/* mini draft card */}
      <rect x="322" y="44" width="108" height="50" rx="4" fill="#F5F4F2" stroke="#E0DEDA" strokeWidth="0.5" />
      <rect x="322" y="44" width="108" height="2" fill="#D1D0CE" />
      <rect x="328" y="50" width="34" height="9" rx="3" fill="#9B9895" />
      <text x="345" y="57" fontSize="5.5" fill={WH} fontWeight="600" textAnchor="middle">Borrador</text>
      <text x="328" y="68" fontSize="6" fill="#9B9895" fontWeight="600">Yoga Restaurativo</text>
      <rect x="328" y="76" width="96" height="12" rx="3" fill="#F5F4F2" stroke="#B0ADAA" strokeWidth="0.5" strokeDasharray="2 2" />
      <text x="376" y="85" fontSize="5.5" fill={I2} fontWeight="500" textAnchor="middle">Continuar configuración</text>
      <text x="376" y="120" fontSize="7" fill={INK} fontWeight="600" textAnchor="middle">3. Volvés cuando quieras</text>
      <text x="376" y="130" fontSize="6" fill={I3} textAnchor="middle">Aparece en gris en la lista</text>

      {/* bottom note */}
      <rect x="24" y="142" width="418" height="38" rx="6" fill="#FFF7ED" stroke="#FDBA7440" strokeWidth="0.5" />
      <text x="36" y="158" fontSize="7" fill="#9A3412" fontWeight="500">Podés eliminar un borrador en cualquier momento desde la lista de talleres.</text>
      <text x="36" y="170" fontSize="6.5" fill="#C2410C">Al hacer click en "Publicar" o "Crear", el borrador se convierte en un taller activo.</text>
    </svg>
  );
}

// ── Ilustración 8: Reservas ────────────────────────────────────────────────────
function IlluReservas() {
  const rows = [
    { nombre: 'Laura Gómez',   taller: 'Yoga Restaurativo',  fecha: '10 nov', pago: 'MP',       estado: 'CONFIRMADA' },
    { nombre: 'Martín R.',     taller: 'Cerámica básica',    fecha: '11 nov', pago: 'Efectivo', estado: 'CONFIRMADA' },
    { nombre: 'Ana Torres',    taller: 'Yoga Restaurativo',  fecha: '11 nov', pago: 'MP',       estado: 'CONFIRMADA' },
    { nombre: 'Carlos M.',     taller: 'Cerámica básica',    fecha: '12 nov', pago: 'Efectivo', estado: 'CANCELADA'  },
  ];
  return (
    <svg viewBox="0 0 460 200" width="100%" style={{ display: 'block', ...F }}>
      <rect width="460" height="200" fill={C} />
      <rect x="14" y="10" width="432" height="180" rx="8" fill={B} />
      <text x="22" y="28" fontSize="11" fill={INK} fontWeight="700">Reservas</text>
      {/* stats */}
      {[
        { lbl: 'Confirmadas', val: '24', color: GN },
        { lbl: 'Cupos vendidos', val: '24/36', color: C },
        { lbl: 'Efvo. pendiente', val: '$8.400', color: OCRE },
        { lbl: 'Online cobrado', val: '$36.400', color: '#4F7BB5' },
      ].map(({ lbl, val, color }, i) => (
        <g key={i}>
          <rect x={22+i*106} y="34" width="100" height="24" rx="5" fill={WH} stroke={BR} strokeWidth="0.4" />
          <text x={28+i*106} y="44" fontSize="6" fill={I3}>{lbl}</text>
          <text x={28+i*106} y="54" fontSize="8.5" fill={color} fontWeight="700" fontFamily="'IBM Plex Mono', monospace">{val}</text>
        </g>
      ))}
      {/* table header */}
      <rect x="22" y="64" width="418" height="12" rx="3" fill={S2} />
      {['ALUMNO','TALLER','FECHA','PAGO','ESTADO'].map((h, i) => (
        <text key={i} x={[28,120,220,278,346][i]} y="73" fontSize="6" fill={I3} fontWeight="600" letterSpacing="0.04em">{h}</text>
      ))}
      {/* rows */}
      {rows.map(({ nombre, taller, fecha, pago, estado }, i) => (
        <g key={i}>
          <line x1="22" y1={77+i*26} x2="440" y2={77+i*26} stroke={BR} strokeWidth="0.3" />
          <text x="28" y={92+i*26} fontSize="7.5" fill={INK} fontWeight="500">{nombre}</text>
          <text x="120" y={92+i*26} fontSize="7" fill={I2}>{taller}</text>
          <text x="220" y={92+i*26} fontSize="7" fill={I3}>{fecha}</text>
          {/* pago badge */}
          <rect x="272" y={84+i*26} width={pago === 'MP' ? 50 : 44} height="11" rx="5"
                fill={pago === 'MP' ? '#EFF6FF' : '#FFF7ED'} stroke={pago === 'MP' ? '#BFDBFE' : '#FED7AA'} strokeWidth="0.4" />
          <text x={pago === 'MP' ? 297 : 294} y={92+i*26} fontSize="6" textAnchor="middle"
                fill={pago === 'MP' ? '#2563EB' : '#C2410C'} fontWeight="500">
            {pago === 'MP' ? 'Mercado Pago' : 'Efectivo'}
          </text>
          {/* estado badge */}
          <rect x="340" y={84+i*26} width={estado === 'CONFIRMADA' ? 54 : 48} height="11" rx="5"
                fill={estado === 'CONFIRMADA' ? '#ECFDF5' : '#FEF2F2'} stroke={estado === 'CONFIRMADA' ? '#A7F3D0' : '#FECACA'} strokeWidth="0.4" />
          <text x={estado === 'CONFIRMADA' ? 367 : 364} y={92+i*26} fontSize="6" textAnchor="middle"
                fill={estado === 'CONFIRMADA' ? '#059669' : '#DC2626'} fontWeight="500">
            {estado === 'CONFIRMADA' ? 'Confirmada' : 'Cancelada'}
          </text>
          {/* action */}
          {estado === 'CONFIRMADA' && (
            <>
              <rect x="400" y={84+i*26} width="38" height="11" rx="4" fill={S} stroke={BR} strokeWidth="0.3" />
              <text x="419" y={92+i*26} fontSize="5.5" textAnchor="middle" fill={I2}>Bloquear</text>
            </>
          )}
        </g>
      ))}
    </svg>
  );
}

// ── Steps ──────────────────────────────────────────────────────────────────────

const STEPS = [
  {
    label: 'Paso 1 de 8',
    Illustration: IlluPanel,
    title: 'Tu panel de control',
    paras: [
      'El <b>sidebar izquierdo</b> te lleva a cada sección del panel: <b>Talleres</b>, <b>Reservas</b>, <b>Reportes</b>, <b>Configuración</b> y <b>Mis datos</b>.',
      'En la parte inferior ves tu plan activo y el enlace a tu <b>página pública</b> — donde tus alumnos ven y reservan tus talleres.',
    ],
    bullets: null,
  },
  {
    label: 'Paso 2 de 8',
    Illustration: IlluEspacio,
    title: 'Configuración → Mi Espacio',
    paras: ['Aquí configurás los datos principales de tu espacio profesional.'],
    bullets: [
      '<b>Nombre:</b> lo que ven tus alumnos en la página pública y en los comprobantes.',
      '<b>Rubro:</b> elegí de la lista o escribí uno personalizado con la opción "Otro".',
      '<b>Ubicaciones:</b> agregá las direcciones donde dictás. Luego las asignás a cada taller.',
      'Al costado encontrás tu <b>código QR</b> y el <b>link directo</b> para compartir.',
    ],
  },
  {
    label: 'Paso 3 de 8',
    Illustration: IlluIdentidad,
    title: 'Configuración → Identidad',
    paras: ['Personalizá cómo se ve tu espacio: logo, colores y tipografías.'],
    bullets: [
      '<b>Logo:</b> subí tu imagen y elegí la forma (círculo, cuadrado o libre).',
      '<b>Colores:</b> subí el logo y Antológico <em>sugiere tu paleta automáticamente</em>. Asignás cada color a un rol (principal, botones, fondo, etc).',
      '<b>Tipografías:</b> elegí el par de fuentes que mejor represente tu estilo. Se aplica en tu página pública.',
    ],
  },
  {
    label: 'Paso 4 de 8',
    Illustration: IlluCobros,
    title: 'Configuración → Mis Cobros',
    paras: ['Definí cómo cobran tus alumnos y cuánto tiempo tienen para cancelar.'],
    bullets: [
      '<b>Efectivo:</b> el alumno reserva online y paga al llegar.',
      '<b>Mercado Pago:</b> conectá tu cuenta para cobrar online al momento de la reserva.',
      '<b>Links de pago:</b> agregá links personalizados (Cafecito, MercadoShops, transferencia).',
      '<b>Política de cancelación:</b> cuántas horas antes puede cancelar. 0 = no puede.',
      '<b>Términos y Condiciones:</b> texto que el alumno acepta al reservar.',
    ],
  },
  {
    label: 'Paso 5 de 8',
    Illustration: IlluTalleres,
    title: 'Talleres — tu agenda en tarjetas',
    paras: ['Desde <b>Talleres</b> gestionás toda tu oferta. Cada taller se muestra como una tarjeta con su encabezado de color, precio, cupos y estado.'],
    bullets: [
      '<b>Publicado:</b> visible para tus alumnos. Pueden reservar.',
      '<b>Ocultar:</b> solo vos lo ves. Útil para preparar un taller antes de anunciarlo.',
      '<b>Agotar:</b> publicado pero sin cupos disponibles.',
      '<b>Borrador (gris):</b> un taller que empezaste a crear pero no terminaste. Aparece primero en la lista.',
      'Podés <b>buscar</b> por nombre y <b>filtrar</b> por estado.',
    ],
  },
  {
    label: 'Paso 6 de 8',
    Illustration: IlluFormTaller,
    title: 'Crear un taller',
    paras: ['El formulario tiene todo lo que necesitás para publicar un taller.'],
    bullets: [
      '<b>Tipo:</b> Workshop (1 día), Taller (varios encuentros), Clase o Curso. Los de varios encuentros permiten configurar frecuencia semanal o días específicos.',
      '<b>Cupos y precio:</b> al llegar a 0 cupos el taller se marca agotado automáticamente.',
      '<b>Métodos de pago:</b> elegí cuáles acepta este taller en particular (entre los que hayas activado en Mis Cobros).',
      '<b>Encabezado visual:</b> color con el plan Esencial; imagen con Profesional o Estudio.',
      '<b>Estado:</b> publicá directamente o elegí Ocultar para dejarlo invisible.',
    ],
  },
  {
    label: 'Paso 7 de 8',
    Illustration: IlluBorradores,
    title: 'Borradores automáticos',
    paras: ['Si estás creando un taller y salís de la pantalla — navegás a otra sección, cerrás sesión o cerrás el navegador — <b>el taller se guarda solo como borrador</b>.'],
    bullets: [
      'El formulario se auto-guarda cada pocos segundos mientras editás.',
      'El borrador aparece en tu lista de talleres <b>en gris</b>, al principio de todo.',
      'Hacé click en <b>"Continuar configuración"</b> para retomarlo donde lo dejaste.',
      'Podés <b>eliminar</b> un borrador si no lo necesitás.',
      'Al hacer click en <b>"Publicar"</b>, deja de ser borrador y se publica.',
    ],
  },
  {
    label: 'Paso 8 de 8',
    Illustration: IlluReservas,
    title: 'Reservas y seguimiento',
    paras: ['En <b>Reservas</b> ves todas las inscripciones con detalle de pago y estado. Los indicadores de arriba te dan un resumen rápido.'],
    bullets: [
      'Las reservas en efectivo aparecen como <em>Pendiente</em> hasta que las marcás como pagadas.',
      'Podés <b>bloquear un usuario</b> desde la tabla si es necesario.',
      'Si <b>cancelás un taller</b>, se notifica automáticamente por email a todos los inscriptos.',
      'Tus alumnos gestionan sus reservas desde tu página pública en <em>Mis reservas</em>.',
    ],
  },
];

// ── Modal ──────────────────────────────────────────────────────────────────────

function InstructivoModal({ onClose }) {
  const [idx, setIdx] = useState(0);
  const step = STEPS[idx];
  const isFirst = idx === 0;
  const isLast  = idx === STEPS.length - 1;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[#FAF8F4] rounded-2xl shadow-2xl w-full max-w-[520px] overflow-hidden flex flex-col max-h-[92vh]">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-[#EDE8DE] shrink-0">
          <div className="flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9B8F80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
            </svg>
            <span className="text-xs font-semibold tracking-widest uppercase text-[#9B8F80]">
              Cómo usar Antológico
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-full text-ink-muted hover:bg-surface-200 hover:text-ink transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        {/* Ilustración */}
        <div className="shrink-0 overflow-hidden" style={{ background: '#E85D4A' }}>
          <step.Illustration />
        </div>

        {/* Contenido */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          <p className="text-xs text-ink-muted font-mono mb-1">{step.label}</p>
          <h2 className="text-xl font-bold text-ink mb-3 leading-snug">{step.title}</h2>
          <div className="text-sm text-ink leading-relaxed space-y-2">
            {step.paras.map((p, i) => (
              <p key={i} dangerouslySetInnerHTML={{ __html: p }} />
            ))}
            {step.bullets && (
              <ul className="space-y-1.5 mt-2">
                {step.bullets.map((b, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="mt-[5px] w-4 h-4 rounded-full bg-[#E85D4A]/15 flex-shrink-0 flex items-center justify-center">
                      <svg width="6" height="6" viewBox="0 0 6 6"><circle cx="3" cy="3" r="2.5" fill="#E85D4A" /></svg>
                    </span>
                    <span dangerouslySetInnerHTML={{ __html: b }} />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Navegación */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-border shrink-0">
          <button
            onClick={() => setIdx(i => i - 1)}
            disabled={isFirst}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-border text-sm font-medium text-ink-muted hover:bg-surface-200 disabled:opacity-30 disabled:cursor-default transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
            Anterior
          </button>

          <div className="flex items-center gap-1.5">
            {STEPS.map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                className="rounded-full transition-all"
                style={{ width: i === idx ? 20 : 8, height: 8, background: i === idx ? '#E85D4A' : '#D2C4A8' }}
              />
            ))}
          </div>

          <button
            onClick={() => isLast ? onClose() : setIdx(i => i + 1)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-colors"
            style={{ background: '#E85D4A' }}
          >
            {isLast ? 'Finalizar' : 'Siguiente'}
            {!isLast && (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Botón flotante ─────────────────────────────────────────────────────────────

export default function Instructivo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-[100] flex items-center gap-2 bg-surface-100 border border-border shadow-lg rounded-full pl-3.5 pr-4 py-2.5 text-sm font-medium text-ink hover:shadow-xl hover:bg-surface-200 transition-all"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6B5F4C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
        </svg>
        Instructivo
      </button>
      {open && <InstructivoModal onClose={() => setOpen(false)} />}
    </>
  );
}

export { InstructivoModal };
