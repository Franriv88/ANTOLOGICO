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

const F = { fontFamily: "'IBM Plex Sans', sans-serif" };

// ── Ilustración 1: Panel de control ───────────────────────────────────────────
function IlluPanel() {
  return (
    <svg viewBox="0 0 460 200" width="100%" style={{ display: 'block', ...F }}>
      <rect width="460" height="200" fill={C} />
      {/* frame */}
      <rect x="14" y="10" width="432" height="180" rx="8" fill={B} />
      {/* sidebar */}
      <rect x="14" y="10" width="92" height="180" rx="8" fill={S} />
      {/* logo row */}
      <rect x="20" y="18" width="80" height="22" rx="3" fill={S2} />
      <rect x="24" y="22" width="14" height="14" rx="3" fill={C} opacity="0.6" />
      <text x="42" y="32" fontSize="8.5" fill={INK} fontWeight="600">Antológico</text>
      {/* space name */}
      <text x="22" y="55" fontSize="8" fill={INK} fontWeight="500">Studio Mabel</text>
      <text x="22" y="65" fontSize="7" fill={I3}>Arte & Cerámica</text>
      <line x1="20" y1="71" x2="98" y2="71" stroke={BR} strokeWidth="0.5" />
      {/* nav active */}
      <rect x="14" y="77" width="3" height="18" rx="1.5" fill={C} />
      <rect x="20" y="77" width="80" height="18" rx="4" fill={C} opacity="0.12" />
      <text x="27" y="89" fontSize="8.5" fill={C} fontWeight="600">Talleres</text>
      {/* nav items */}
      <text x="27" y="110" fontSize="8.5" fill={I3}>Reservas</text>
      <text x="27" y="128" fontSize="8.5" fill={I3}>Reportes</text>
      <text x="27" y="146" fontSize="8.5" fill={I3}>Configuración</text>
      {/* link público */}
      <text x="20" y="172" fontSize="7" fill={I3}>↗ Ver página pública</text>
      {/* top bar */}
      <rect x="106" y="10" width="340" height="22" fill={B} />
      <line x1="106" y1="32" x2="446" y2="32" stroke={BR} strokeWidth="0.5" />
      <text x="350" y="23" fontSize="7.5" fill={I3}>mabel@estudio.com</text>
      <rect x="414" y="15" width="32" height="12" rx="3" fill={S2} />
      <text x="419" y="24" fontSize="7" fill={I2}>Salir</text>
      {/* trial banner */}
      <rect x="106" y="32" width="340" height="14" fill="#FEF3C7" />
      <text x="240" y="41" fontSize="7" fill="#92400E" textAnchor="middle">Prueba gratuita · Te quedan 12 días</text>
      {/* page title */}
      <text x="118" y="62" fontSize="11" fill={INK} fontWeight="700">Talleres</text>
      <rect x="358" y="52" width="78" height="16" rx="5" fill={C} />
      <text x="370" y="63" fontSize="7.5" fill="#fff" fontWeight="600">+ Nuevo taller</text>
      {/* cards */}
      {[
        { x: 118, color: C,        nombre: 'Yoga Restaurativo', fecha: 'Sáb 15 nov · 10:00', precio: '$3.500', badge: 'Disponible', bc: GN },
        { x: 222, color: '#B98527', nombre: 'Cerámica básica',  fecha: 'Dom 16 nov · 14:00', precio: '$5.200', badge: 'Disponible', bc: GN },
        { x: 326, color: '#607D8B', nombre: 'Acuarela express', fecha: 'Sáb 22 nov · 11:00', precio: '$4.000', badge: 'Agotado',    bc: '#DC2626' },
      ].map(({ x, color, nombre, fecha, precio, badge, bc }) => (
        <g key={x}>
          <rect x={x} y="70" width="96" height="112" rx="7" fill={S} />
          <rect x={x} y="70" width="96" height="38" rx="7" fill={color} opacity="0.35" />
          <rect x={x+4} y="75" width="34" height="12" rx="6" fill="rgba(0,0,0,0.45)" />
          <text x={x+8} y="84" fontSize="7.5" fill="#fff" fontWeight="600">{precio}</text>
          <rect x={x+55} y="75" width={badge === 'Agotado' ? 34 : 34} height="11" rx="5.5" fill={bc} opacity="0.9" />
          <text x={x+72} y="83" fontSize="6.5" fill="#fff" fontWeight="600" textAnchor="middle">{badge}</text>
          <text x={x+6} y="121" fontSize="8" fill={INK} fontWeight="600">{nombre}</text>
          <text x={x+6} y="133" fontSize="7" fill={I3}>{fecha}</text>
          <rect x={x+6} y="164" width="76" height="13" rx="6.5" fill={C} opacity="0.8" />
          <text x={x+44} y="173" fontSize="7.5" fill="#fff" fontWeight="500" textAnchor="middle">Reservar</text>
        </g>
      ))}
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
        { label: 'Mi Espacio', active: true },
        { label: 'Identidad',  active: false },
        { label: 'Cobros',     active: false },
        { label: 'Suscripción',active: false },
      ].map(({ label, active }, i) => (
        <g key={label}>
          <text x={22 + i*96} y="28" fontSize="8.5" fill={active ? C : I3} fontWeight={active ? '600' : '400'}>{label}</text>
          {active && <rect x={22} y="32" width="57" height="2" rx="1" fill={C} />}
        </g>
      ))}
      <line x1="14" y1="34" x2="446" y2="34" stroke={BR} strokeWidth="0.5" />
      {/* col izq */}
      <text x="22" y="50" fontSize="7.5" fill={I3}>Nombre del espacio</text>
      <rect x="22" y="54" width="180" height="18" rx="4" fill="#fff" stroke={BR} strokeWidth="0.7" />
      <text x="28" y="66" fontSize="8" fill={INK}>Studio Mabel</text>
      <text x="22" y="84" fontSize="7.5" fill={I3}>Rubro</text>
      <rect x="22" y="88" width="180" height="18" rx="4" fill="#fff" stroke={BR} strokeWidth="0.7" />
      <text x="28" y="100" fontSize="8" fill={I2}>Arte & Manualidades</text>
      <text x="22" y="118" fontSize="7.5" fill={I3}>Descripción</text>
      <rect x="22" y="122" width="180" height="32" rx="4" fill="#fff" stroke={BR} strokeWidth="0.7" />
      <text x="28" y="134" fontSize="7.5" fill={I2}>Talleres de cerámica y acuarela</text>
      <text x="28" y="144" fontSize="7.5" fill={I2}>para todos los niveles.</text>
      {/* ubicacion */}
      <text x="22" y="167" fontSize="7.5" fill={I3}>Ubicaciones</text>
      <rect x="22" y="171" width="180" height="16" rx="4" fill={S} stroke={BR} strokeWidth="0.5" />
      <text x="28" y="182" fontSize="7.5" fill={I2}>📍 Estudio central — Palermo</text>
      {/* col der: QR */}
      <rect x="220" y="42" width="96" height="96" rx="8" fill={S} stroke={BR} strokeWidth="0.5" />
      <text x="268" y="60" fontSize="7.5" fill={I3} textAnchor="middle">QR tu espacio</text>
      {/* mini QR visual */}
      {[0,1,2,3,4].map(r => [0,1,2,3,4].map(cc => {
        const on = [[1,1,1,0,1],[1,0,1,1,0],[1,1,0,1,1],[0,1,1,0,1],[1,0,1,1,1]][r][cc];
        return <rect key={`${r}${cc}`} x={236+cc*14} y={68+r*14} width="11" height="11" rx="2" fill={on ? I2 : S} opacity="0.5" />;
      }))}
      <text x="268" y="152" fontSize="7" fill={I3} textAnchor="middle">antologico.app/p/mabel</text>
      {/* links */}
      <text x="220" y="168" fontSize="7.5" fill={I3}>Links</text>
      <rect x="220" y="172" width="94" height="14" rx="4" fill={S} stroke={BR} strokeWidth="0.5" />
      <text x="225" y="182" fontSize="7.5" fill={I2}>☞ Instagram · Cafecito</text>
      {/* save */}
      <rect x="340" y="170" width="88" height="18" rx="5" fill={C} opacity="0.9" />
      <text x="384" y="182" fontSize="8" fill="#fff" fontWeight="600" textAnchor="middle">Guardar cambios</text>
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
      <text x="22" y="28" fontSize="8.5" fill={I3}>Mi Espacio</text>
      <text x="88" y="28" fontSize="8.5" fill={C} fontWeight="600">Identidad</text>
      <rect x="88" y="32" width="47" height="2" rx="1" fill={C} />
      <text x="150" y="28" fontSize="8.5" fill={I3}>Cobros</text>
      <text x="200" y="28" fontSize="8.5" fill={I3}>Suscripción</text>
      <line x1="14" y1="34" x2="446" y2="34" stroke={BR} strokeWidth="0.5" />
      {/* Logo */}
      <text x="22" y="50" fontSize="8" fill={I2} fontWeight="600">Logo</text>
      <circle cx="58" cy="82" r="26" fill={S2} stroke={BR} strokeWidth="0.7" />
      <circle cx="58" cy="82" r="18" fill={C} opacity="0.25" />
      <text x="58" y="86" fontSize="9" fill={C} textAnchor="middle" fontWeight="700">M</text>
      {/* shape options */}
      {[{ r: 'round', lbl: 'Círculo' }, { r: 'rounded', lbl: 'Cuadrado' }, { r: 'none', lbl: 'Libre' }].map(({ r, lbl }, i) => (
        <g key={r}>
          <rect x={96+i*44} y="66" width="34" height="32" rx={r === 'round' ? 17 : r === 'rounded' ? 6 : 0}
                fill={i === 0 ? S2 : S} stroke={i === 0 ? C : BR} strokeWidth={i === 0 ? 1.5 : 0.7} />
          <text x={113+i*44} y="108" fontSize="6.5" fill={I3} textAnchor="middle">{lbl}</text>
        </g>
      ))}
      {/* Colores */}
      <text x="22" y="126" fontSize="8" fill={I2} fontWeight="600">Colores de marca</text>
      {['#E85D4A','#B98527','#2B241A','#F2EDE3','#10B981','#607D8B'].map((col, i) => (
        <g key={i}>
          <circle cx={30+i*28} cy="144" r="11" fill={col} stroke="#fff" strokeWidth="2" />
        </g>
      ))}
      <text x="22" y="168" fontSize="7.5" fill={I3}>Roles: Principal · Secundario · Botones · Fondo · Cards</text>
      {/* Tipografías */}
      <text x="240" y="50" fontSize="8" fill={I2} fontWeight="600">Tipografías</text>
      {[
        { d: 'Playfair Display', b: 'Lato', active: false },
        { d: 'Poppins',          b: 'Inter', active: true  },
        { d: 'Bebas Neue',       b: 'Montserrat', active: false },
      ].map(({ d, b, active }, i) => (
        <g key={d}>
          <rect x="240" y={56+i*44} width="196" height="38" rx="6" fill={S}
                stroke={active ? C : BR} strokeWidth={active ? 1.5 : 0.5} />
          {active && <circle cx="428" cy={75+i*44} r="6" fill={C} opacity="0.9" />}
          <text x="252" y={72+i*44} fontSize="10" fill={INK} fontWeight="700"
                fontFamily={d + ', serif'}>{d}</text>
          <text x="252" y={84+i*44} fontSize="7.5" fill={I3}>{b} · Textos y UI</text>
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
      <text x="22" y="28" fontSize="8.5" fill={I3}>Mi Espacio</text>
      <text x="88" y="28" fontSize="8.5" fill={I3}>Identidad</text>
      <text x="145" y="28" fontSize="8.5" fill={C} fontWeight="600">Cobros</text>
      <rect x="145" y="32" width="38" height="2" rx="1" fill={C} />
      <text x="196" y="28" fontSize="8.5" fill={I3}>Suscripción</text>
      <line x1="14" y1="34" x2="446" y2="34" stroke={BR} strokeWidth="0.5" />
      {/* Efectivo */}
      <rect x="20" y="42" width="200" height="44" rx="7" fill={S} stroke={`${C}30`} strokeWidth="1" />
      <text x="30" y="56" fontSize="8.5" fill={INK} fontWeight="600">Efectivo</text>
      <text x="30" y="67" fontSize="7.5" fill={I3}>Reserva online, pago al llegar.</text>
      {/* toggle ON */}
      <rect x="196" y="53" width="18" height="10" rx="5" fill={GN} />
      <circle cx="208" cy="58" r="4" fill="#fff" />
      {/* Mercado Pago */}
      <rect x="20" y="94" width="200" height="44" rx="7" fill={S} stroke={BR} strokeWidth="0.5" />
      <text x="30" y="108" fontSize="8.5" fill={INK} fontWeight="600">Mercado Pago</text>
      <text x="30" y="119" fontSize="7.5" fill={I3}>Cobro online al momento de reservar.</text>
      <rect x="196" y="105" width="18" height="10" rx="5" fill={BR} />
      <circle cx="202" cy="110" r="4" fill="#fff" />
      {/* Links de pago */}
      <rect x="20" y="146" width="200" height="34" rx="7" fill={S} stroke={BR} strokeWidth="0.5" />
      <text x="30" y="160" fontSize="8.5" fill={INK} fontWeight="600">Links de pago</text>
      <text x="30" y="171" fontSize="7.5" fill={I3}>Cafecito, MercadoShops, etc.</text>
      {/* Política de cancelación */}
      <rect x="234" y="42" width="208" height="80" rx="7" fill={S} stroke={BR} strokeWidth="0.5" />
      <text x="244" y="57" fontSize="8.5" fill={INK} fontWeight="600">Política de cancelación</text>
      <text x="244" y="69" fontSize="7.5" fill={I3}>Horas antes que el alumno</text>
      <text x="244" y="79" fontSize="7.5" fill={I3}>puede cancelar su reserva.</text>
      {/* input horas */}
      <rect x="244" y="86" width="36" height="18" rx="4" fill="#fff" stroke={C} strokeWidth="1.2" />
      <text x="262" y="98" fontSize="10" fill={C} fontWeight="700" textAnchor="middle">24</text>
      <text x="286" y="98" fontSize="7.5" fill={I3}>horas antes</text>
      {/* ejemplo */}
      <text x="244" y="114" fontSize="7" fill="#059669">✓ Pueden cancelar hasta el día anterior</text>
      {/* guardar */}
      <rect x="234" y="150" width="100" height="18" rx="5" fill={C} opacity="0.9" />
      <text x="284" y="162" fontSize="8" fill="#fff" fontWeight="600" textAnchor="middle">Guardar cambios</text>
    </svg>
  );
}

// ── Ilustración 5: Talleres - lista ───────────────────────────────────────────
function IlluTalleres() {
  const talleres = [
    { nombre: 'Yoga Restaurativo',  fecha: 'Sáb 15 nov · 10:00', precio: '$3.500', estado: 'PUBLICADO', res: 8,  cupos: 12 },
    { nombre: 'Cerámica para todos',fecha: 'Dom 16 nov · 14:00', precio: '$5.200', estado: 'PUBLICADO', res: 12, cupos: 12 },
    { nombre: 'Intro a la acuarela',fecha: 'Sáb 22 nov · 11:00', precio: '$4.000', estado: 'BORRADOR',  res: 0,  cupos: 8  },
    { nombre: 'Taller de collage',  fecha: 'Dom 23 nov · 16:00', precio: '$2.800', estado: 'PUBLICADO', res: 3,  cupos: 10 },
  ];
  return (
    <svg viewBox="0 0 460 200" width="100%" style={{ display: 'block', ...F }}>
      <rect width="460" height="200" fill={C} />
      <rect x="14" y="10" width="432" height="180" rx="8" fill={B} />
      {/* title + btn */}
      <text x="22" y="30" fontSize="12" fill={INK} fontWeight="700">Talleres</text>
      <rect x="354" y="18" width="82" height="18" rx="5" fill={C} />
      <text x="395" y="30" fontSize="7.5" fill="#fff" fontWeight="600" textAnchor="middle">+ Nuevo taller</text>
      {/* search + filter */}
      <rect x="22" y="38" width="130" height="15" rx="4" fill={S} stroke={BR} strokeWidth="0.5" />
      <text x="30" y="48" fontSize="7.5" fill={I3}>Buscar taller…</text>
      <rect x="160" y="38" width="64" height="15" rx="4" fill={S} stroke={BR} strokeWidth="0.5" />
      <text x="174" y="48" fontSize="7.5" fill={I3}>▾ Estado</text>
      {/* table header */}
      <rect x="22" y="58" width="420" height="14" rx="3" fill={S2} />
      <text x="28" y="68" fontSize="7" fill={I3} fontWeight="600" letterSpacing="0.05em">NOMBRE</text>
      <text x="190" y="68" fontSize="7" fill={I3} fontWeight="600" letterSpacing="0.05em">FECHA</text>
      <text x="295" y="68" fontSize="7" fill={I3} fontWeight="600" letterSpacing="0.05em">RESERVAS</text>
      <text x="360" y="68" fontSize="7" fill={I3} fontWeight="600" letterSpacing="0.05em">ESTADO</text>
      {/* rows */}
      {talleres.map(({ nombre, fecha, precio, estado, res, cupos }, i) => (
        <g key={i}>
          <line x1="22" y1={75+i*28} x2="442" y2={75+i*28} stroke={BR} strokeWidth="0.4" />
          <text x="28" y={88+i*28} fontSize="8.5" fill={INK} fontWeight="500">{nombre}</text>
          <text x="28" y={97+i*28} fontSize="7" fill={I3}>{precio}</text>
          <text x="190" y={89+i*28} fontSize="7.5" fill={I2}>{fecha}</text>
          {/* reservas bar */}
          <rect x="295" y={80+i*28} width="50" height="7" rx="3" fill={S2} />
          <rect x="295" y={80+i*28} width={Math.round(50 * res / cupos)} height="7" rx="3" fill={C} opacity="0.7" />
          <text x="352" y={89+i*28} fontSize="7.5" fill={I3}>{res}/{cupos}</text>
          {/* estado badge */}
          <rect x="360" y={82+i*28} width={estado === 'PUBLICADO' ? 52 : 46} height="12" rx="6"
                fill={estado === 'PUBLICADO' ? GN : estado === 'BORRADOR' ? S2 : '#DC2626'} opacity="0.15" />
          <text x={estado === 'PUBLICADO' ? 386 : 383} y={91+i*28} fontSize="7" textAnchor="middle"
                fill={estado === 'PUBLICADO' ? '#059669' : estado === 'BORRADOR' ? I2 : '#DC2626'} fontWeight="500">
            {estado === 'PUBLICADO' ? 'Publicado' : estado === 'BORRADOR' ? 'Borrador' : 'Agotado'}
          </text>
          {/* actions */}
          <text x="420" y={89+i*28} fontSize="9" fill={I3}>✏ 🗑</text>
        </g>
      ))}
    </svg>
  );
}

// ── Ilustración 6: Crear taller ───────────────────────────────────────────────
function IlluFormTaller() {
  return (
    <svg viewBox="0 0 460 200" width="100%" style={{ display: 'block', ...F }}>
      <rect width="460" height="200" fill={C} />
      <rect x="14" y="10" width="432" height="180" rx="8" fill={B} />
      <text x="22" y="28" fontSize="11" fill={INK} fontWeight="700">Nuevo taller</text>
      {/* col izq */}
      <text x="22" y="44" fontSize="7.5" fill={I3}>Nombre del taller *</text>
      <rect x="22" y="47" width="198" height="17" rx="4" fill="#fff" stroke={C} strokeWidth="1" />
      <text x="28" y="59" fontSize="8" fill={INK}>Yoga Restaurativo</text>
      <text x="22" y="74" fontSize="7.5" fill={I3}>Descripción</text>
      <rect x="22" y="77" width="198" height="28" rx="4" fill="#fff" stroke={BR} strokeWidth="0.7" />
      <text x="28" y="89" fontSize="7.5" fill={I2}>Clase de yoga de bajo impacto</text>
      <text x="28" y="99" fontSize="7.5" fill={I2}>ideal para principiantes.</text>
      {/* fecha y hora */}
      <text x="22" y="116" fontSize="7.5" fill={I3}>Fecha *</text>
      <rect x="22" y="119" width="80" height="16" rx="4" fill="#fff" stroke={BR} strokeWidth="0.7" />
      <text x="28" y="130" fontSize="8" fill={INK}>15/11/2025</text>
      <text x="110" y="116" fontSize="7.5" fill={I3}>Hora</text>
      <rect x="110" y="119" width="44" height="16" rx="4" fill="#fff" stroke={BR} strokeWidth="0.7" />
      <text x="123" y="130" fontSize="8" fill={INK} textAnchor="middle">10</text>
      <text x="158" y="130" fontSize="9" fill={I3}>:</text>
      <rect x="162" y="119" width="36" height="16" rx="4" fill="#fff" stroke={BR} strokeWidth="0.7" />
      <text x="180" y="130" fontSize="8" fill={INK} textAnchor="middle">00</text>
      {/* cupos + precio */}
      <text x="22" y="147" fontSize="7.5" fill={I3}>Cupos totales</text>
      <rect x="22" y="150" width="56" height="16" rx="4" fill="#fff" stroke={BR} strokeWidth="0.7" />
      <text x="50" y="161" fontSize="8" fill={INK} textAnchor="middle">12</text>
      <text x="86" y="147" fontSize="7.5" fill={I3}>Precio por persona</text>
      <rect x="86" y="150" width="76" height="16" rx="4" fill="#fff" stroke={BR} strokeWidth="0.7" />
      <text x="124" y="161" fontSize="8" fill={INK} textAnchor="middle">$ 3.500</text>
      {/* col der: header */}
      <text x="236" y="44" fontSize="7.5" fill={I3}>Encabezado visual</text>
      <rect x="236" y="47" width="200" height="56" rx="7" fill={S2} />
      {/* color option selected */}
      <rect x="244" y="54" width="84" height="40" rx="5" fill={S} stroke={C} strokeWidth="1.5" />
      <circle cx="268" cy="74" r="10" fill={C} opacity="0.6" />
      <text x="284" y="71" fontSize="7.5" fill={INK} fontWeight="500">Color sólido</text>
      <text x="284" y="81" fontSize="6.5" fill={I3}>Elegís el color</text>
      {/* image option */}
      <rect x="344" y="54" width="84" height="40" rx="5" fill={S} stroke={BR} strokeWidth="0.5" />
      <rect x="356" y="66" width="18" height="14" rx="3" fill={I3} opacity="0.3" />
      <text x="380" y="71" fontSize="7.5" fill={I3}>Imagen</text>
      <text x="380" y="81" fontSize="6.5" fill={I3}>Pro / Estudio</text>
      {/* color picker */}
      <text x="236" y="116" fontSize="7.5" fill={I3}>Color del encabezado</text>
      {['#E85D4A','#B98527','#607D8B','#10B981','#7C3AED','#2B241A'].map((col, i) => (
        <circle key={i} cx={244+i*22} cy="128" r="8" fill={col} stroke={i===0?'#fff':S} strokeWidth="2" />
      ))}
      {/* ubicación */}
      <text x="236" y="148" fontSize="7.5" fill={I3}>Ubicación</text>
      <rect x="236" y="151" width="196" height="16" rx="4" fill="#fff" stroke={BR} strokeWidth="0.7" />
      <text x="242" y="162" fontSize="8" fill={I2}>📍 Estudio central — Palermo</text>
      {/* save */}
      <rect x="236" y="175" width="96" height="16" rx="5" fill={C} opacity="0.9" />
      <text x="284" y="186" fontSize="8" fill="#fff" fontWeight="600" textAnchor="middle">Publicar taller</text>
      <rect x="340" y="175" width="88" height="16" rx="5" fill={S} stroke={BR} strokeWidth="0.5" />
      <text x="384" y="186" fontSize="8" fill={I2} textAnchor="middle">Guardar borrador</text>
    </svg>
  );
}

// ── Ilustración 7: Reservas ────────────────────────────────────────────────────
function IlluReservas() {
  const rows = [
    { nombre: 'Laura Gómez',   taller: 'Yoga Restaurativo',  fecha: '10 nov', pago: 'MP',       estado: 'CONFIRMADA' },
    { nombre: 'Martín R.',     taller: 'Cerámica básica',    fecha: '11 nov', pago: 'Efectivo', estado: 'CONFIRMADA' },
    { nombre: 'Ana Torres',    taller: 'Yoga Restaurativo',  fecha: '11 nov', pago: 'MP',       estado: 'CONFIRMADA' },
    { nombre: 'Carlos M.',     taller: 'Cerámica básica',    fecha: '12 nov', pago: 'Efectivo', estado: 'CANCELADA'  },
    { nombre: 'Sofía Paz',     taller: 'Yoga Restaurativo',  fecha: '13 nov', pago: 'MP',       estado: 'CONFIRMADA' },
  ];
  return (
    <svg viewBox="0 0 460 200" width="100%" style={{ display: 'block', ...F }}>
      <rect width="460" height="200" fill={C} />
      <rect x="14" y="10" width="432" height="180" rx="8" fill={B} />
      <text x="22" y="28" fontSize="12" fill={INK} fontWeight="700">Reservas</text>
      {/* stats */}
      {[
        { lbl: 'Confirmadas', val: '24', color: GN },
        { lbl: 'Cupos vendidos', val: '24/36', color: C },
        { lbl: 'Efectivo pend.', val: '$ 8.400', color: '#B98527' },
        { lbl: 'Online cobrado', val: '$ 36.400', color: '#4F7BB5' },
      ].map(({ lbl, val, color }, i) => (
        <g key={i}>
          <rect x={22+i*105} y="34" width="98" height="26" rx="5" fill={S} stroke={BR} strokeWidth="0.4" />
          <text x={28+i*105} y="45" fontSize="6.5" fill={I3}>{lbl}</text>
          <text x={28+i*105} y="55" fontSize="9" fill={color} fontWeight="700" fontFamily="'IBM Plex Mono', monospace">{val}</text>
        </g>
      ))}
      {/* table */}
      <rect x="22" y="66" width="418" height="13" rx="3" fill={S2} />
      {['ALUMNO','TALLER','FECHA','PAGO','ESTADO',''].map((h, i) => (
        <text key={i} x={[28,118,228,278,320,400][i]} y="75" fontSize="6.5" fill={I3} fontWeight="600" letterSpacing="0.04em">{h}</text>
      ))}
      {rows.map(({ nombre, taller, fecha, pago, estado }, i) => (
        <g key={i}>
          <line x1="22" y1={80+i*22} x2="440" y2={80+i*22} stroke={BR} strokeWidth="0.3" />
          <text x="28" y={93+i*22} fontSize="8" fill={INK} fontWeight="500">{nombre}</text>
          <text x="118" y={93+i*22} fontSize="7.5" fill={I2}>{taller}</text>
          <text x="228" y={93+i*22} fontSize="7.5" fill={I3}>{fecha}</text>
          {/* pago badge */}
          <rect x="272" y={84+i*22} width={pago === 'MP' ? 48 : 48} height="11" rx="5.5"
                fill={pago === 'MP' ? '#EFF6FF' : '#FEF9EE'} stroke={pago === 'MP' ? '#BFDBFE' : '#FDE68A'} strokeWidth="0.5" />
          <text x={272 + (pago === 'MP' ? 24 : 24)} y={93+i*22} fontSize="6.5" textAnchor="middle"
                fill={pago === 'MP' ? '#2563EB' : '#B45309'} fontWeight="500">
            {pago === 'MP' ? 'Mercado Pago' : 'Efectivo'}
          </text>
          {/* estado badge */}
          <rect x="316" y={84+i*22} width={estado === 'CONFIRMADA' ? 56 : 50} height="11" rx="5.5"
                fill={estado === 'CONFIRMADA' ? '#ECFDF5' : '#FEF2F2'} stroke={estado === 'CONFIRMADA' ? '#A7F3D0' : '#FECACA'} strokeWidth="0.5" />
          <text x={316 + (estado === 'CONFIRMADA' ? 28 : 25)} y={93+i*22} fontSize="6.5" textAnchor="middle"
                fill={estado === 'CONFIRMADA' ? '#059669' : '#DC2626'} fontWeight="500">
            {estado === 'CONFIRMADA' ? 'Confirmada' : 'Cancelada'}
          </text>
          {/* actions */}
          {estado === 'CONFIRMADA' && (
            <rect x="384" y={84+i*22} width="46" height="11" rx="5" fill={S2} stroke={BR} strokeWidth="0.5" />
          )}
          {estado === 'CONFIRMADA' && (
            <text x="407" y={93+i*22} fontSize="6.5" textAnchor="middle" fill={I2}>Bloquear</text>
          )}
        </g>
      ))}
    </svg>
  );
}

// ── Steps ──────────────────────────────────────────────────────────────────────

const STEPS = [
  {
    label: 'Paso 1 de 7',
    Illustration: IlluPanel,
    title: 'Tu panel de control',
    paras: [
      'Desde el <b>sidebar izquierdo</b> navegás entre las cuatro secciones principales: <b>Talleres</b>, <b>Reservas</b>, <b>Reportes</b> y <b>Configuración</b>.',
      'En la parte inferior del sidebar aparece tu plan activo. El enlace <em>Ver página pública</em> abre cómo te ven tus alumnos.',
    ],
    bullets: null,
  },
  {
    label: 'Paso 2 de 7',
    Illustration: IlluEspacio,
    title: 'Configuración → Mi Espacio',
    paras: ['Aquí configurás el nombre de tu espacio, el rubro y las ubicaciones donde dictás tus talleres.'],
    bullets: [
      '<b>Nombre:</b> el que verán tus alumnos en la página pública y en los comprobantes.',
      '<b>Rubro:</b> elegí de la lista o escribí uno personalizado con la opción "Otro".',
      '<b>Ubicaciones:</b> agregá las direcciones con un nombre corto. Luego las asignás a cada taller.',
      'Al final encontrás el <b>QR y el link directo</b> a tu página pública.',
    ],
  },
  {
    label: 'Paso 3 de 7',
    Illustration: IlluIdentidad,
    title: 'Configuración → Identidad',
    paras: ['Personalizá cómo se ve tu espacio: logo, colores y tipografías.'],
    bullets: [
      '<b>Logo:</b> subí tu imagen y elegí la forma (círculo, cuadrado o libre).',
      '<b>Colores:</b> subí el logo y Antológico sugiere tu paleta automáticamente. Asignás cada color a un rol.',
      '<b>Tipografías:</b> elegí el par de fuentes que mejor represente tu estilo.',
    ],
  },
  {
    label: 'Paso 4 de 7',
    Illustration: IlluCobros,
    title: 'Configuración → Mis Cobros',
    paras: ['Definí cómo cobran tus alumnos y cuánto tiempo tienen para cancelar.'],
    bullets: [
      '<b>Efectivo:</b> el alumno reserva online y paga al llegar. Activo por defecto.',
      '<b>Mercado Pago:</b> conectá tu cuenta para cobrar online al momento de la reserva.',
      '<b>Política de cancelación:</b> cuántas horas antes puede cancelar el alumno. Poné 0 para no permitirlo.',
    ],
  },
  {
    label: 'Paso 5 de 7',
    Illustration: IlluTalleres,
    title: 'Talleres — tu agenda',
    paras: ['Desde <b>Talleres</b> gestionás toda tu oferta. Cada taller tiene un estado que controla su visibilidad.'],
    bullets: [
      '<b>Borrador:</b> solo vos lo ves. Usalo para preparar el taller antes de anunciarlo.',
      '<b>Publicado:</b> visible en tu página pública. Los alumnos pueden reservar.',
      '<b>Agotado:</b> se asigna automáticamente cuando los cupos llegan a 0.',
    ],
  },
  {
    label: 'Paso 6 de 7',
    Illustration: IlluFormTaller,
    title: 'Crear o editar un taller',
    paras: ['El formulario te pide todos los datos del taller.'],
    bullets: [
      '<b>Nombre, descripción y fecha:</b> lo que el alumno verá en la card.',
      '<b>Cupos:</b> cada persona consume un cupo. Al llegar a 0 el taller se marca agotado automáticamente.',
      '<b>Encabezado:</b> color con el plan Esencial; imagen con Profesional o Estudio.',
      'Podés guardar como <b>Borrador</b> o publicar directamente.',
    ],
  },
  {
    label: 'Paso 7 de 7',
    Illustration: IlluReservas,
    title: 'Reservas y tu página pública',
    paras: ['En <b>Reservas</b> ves todas las inscripciones con detalle de pago y estado.'],
    bullets: [
      'Las reservas en efectivo aparecen como <em>Pendiente</em> hasta que las marcás como pagadas.',
      'Podés <b>bloquear un usuario</b> desde la tabla si es necesario.',
      'Tus alumnos gestionan sus reservas desde tu página pública en la sección <em>Mis reservas</em>.',
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
