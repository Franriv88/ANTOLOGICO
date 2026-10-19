import { useState } from 'react';

// ── Colores del sistema ────────────────────────────────────────────────────────
const C  = '#E85D4A'; // coral
const B  = '#FAF8F4'; // bg cream
const S  = '#F2EDE3'; // surface
const S2 = '#EAE3D5'; // surface-2
const BR = '#D2C4A8'; // border
const I2 = '#5A4F42'; // ink-2
const I3 = '#9B8F80'; // ink-3
const GN = '#10B981'; // green

// ── Ilustraciones ─────────────────────────────────────────────────────────────

function IlluPanel() {
  return (
    <svg viewBox="0 0 460 200" width="100%" style={{ display: 'block' }}>
      {/* fondo */}
      <rect width="460" height="200" fill={C} />
      {/* app frame */}
      <rect x="18" y="12" width="424" height="176" rx="8" fill={B} />
      {/* sidebar */}
      <rect x="18" y="12" width="90" height="176" rx="8" fill={S} />
      {/* logo */}
      <rect x="26" y="20" width="74" height="26" rx="4" fill={S2} />
      <rect x="30" y="26" width="18" height="14" rx="3" fill={C} opacity="0.5" />
      <rect x="54" y="30" width="38" height="6" rx="3" fill={I3} opacity="0.5" />
      {/* nav activo */}
      <rect x="18" y="60" width="3" height="20" rx="1.5" fill={C} />
      <rect x="24" y="60" width="76" height="20" rx="4" fill={C} opacity="0.12" />
      <rect x="32" y="66" width="46" height="8" rx="3" fill={C} opacity="0.7" />
      {/* nav items */}
      {[90,116,142,168].map((y, i) => (
        <rect key={i} x="32" y={y} width={[40,44,40,48][i]} height="8" rx="3" fill={I3} opacity="0.35" />
      ))}
      {/* header */}
      <rect x="108" y="12" width="334" height="22" rx="0" fill={B} />
      <rect x="108" y="34" width="334" height="0.5" fill={BR} />
      {/* content title */}
      <rect x="120" y="48" width="80" height="10" rx="3" fill={I2} opacity="0.3" />
      {/* cards */}
      {[0,1,2].map(i => (
        <g key={i}>
          <rect x={120+i*105} y="68" width="100" height="110" rx="8" fill={S} />
          <rect x={120+i*105} y="68" width="100" height="44" rx="8" fill={[C,'#B98527','#4F7BB5'][i]} opacity="0.3" />
          <rect x={128+i*105} y="120" width={[64,52,58][i]} height="8" rx="3" fill={I2} opacity="0.4" />
          <rect x={128+i*105} y="134" width={[44,38,48][i]} height="6" rx="3" fill={I3} opacity="0.3" />
          <rect x={128+i*105} y="152" width="70" height="18" rx="9" fill={C} opacity="0.7" />
        </g>
      ))}
    </svg>
  );
}

function IlluEspacio() {
  return (
    <svg viewBox="0 0 460 200" width="100%" style={{ display: 'block' }}>
      <rect width="460" height="200" fill={C} />
      <rect x="18" y="12" width="424" height="176" rx="8" fill={B} />
      {/* tabs */}
      {['Mi Espacio','Identidad','Cobros','Suscripción'].map((t, i) => (
        <g key={t}>
          <rect x={26+i*90} y="20" width="84" height="22" rx="4"
                fill={i === 0 ? C : 'transparent'} opacity={i === 0 ? 0.12 : 1} />
          {i === 0 && <rect x={26} y="42" width="84" height="2" rx="1" fill={C} />}
          <rect x={30+i*90} y="27" width={[52,46,40,60][i]} height="8" rx="3"
                fill={i === 0 ? C : I3} opacity={i === 0 ? 0.7 : 0.35} />
        </g>
      ))}
      <rect x="18" y="44" width="424" height="0.5" fill={BR} />
      {/* form */}
      <rect x="26" y="54" width="60" height="7" rx="3" fill={I3} opacity="0.4" />
      <rect x="26" y="66" width="280" height="22" rx="4" fill="#fff" stroke={BR} strokeWidth="0.8" />
      <rect x="26" y="96" width="60" height="7" rx="3" fill={I3} opacity="0.4" />
      <rect x="26" y="108" width="200" height="22" rx="4" fill="#fff" stroke={BR} strokeWidth="0.8" />
      {/* ubicación */}
      <rect x="26" y="138" width="80" height="7" rx="3" fill={I3} opacity="0.4" />
      <rect x="26" y="150" width="240" height="22" rx="5" fill={S} stroke={BR} strokeWidth="0.8" />
      <rect x="34" y="157" width="10" height="8" rx="2" fill={C} opacity="0.5" />
      <rect x="50" y="159" width="80" height="5" rx="2.5" fill={I2} opacity="0.35" />
      {/* QR right */}
      <rect x="340" y="60" width="80" height="80" rx="8" fill={S} stroke={BR} strokeWidth="0.5" />
      {[0,1,2,3].map(r => [0,1,2,3].map(cc => (
        <rect key={`${r}${cc}`} x={348+cc*16} y={68+r*16} width="12" height="12" rx="2"
              fill={I2} opacity={Math.random() > 0.4 ? 0.4 : 0.08} />
      )))}
      <rect x="344" y="152" width="88" height="8" rx="3" fill={I3} opacity="0.3" />
      {/* save button */}
      <rect x="26" y="178" width="80" height="20" rx="5" fill={C} opacity="0.8" />
    </svg>
  );
}

function IlluIdentidad() {
  return (
    <svg viewBox="0 0 460 200" width="100%" style={{ display: 'block' }}>
      <rect width="460" height="200" fill={C} />
      <rect x="18" y="12" width="424" height="176" rx="8" fill={B} />
      {/* logo section */}
      <rect x="26" y="22" width="120" height="7" rx="3" fill={I2} opacity="0.35" />
      {/* logo circle */}
      <circle cx="78" cy="76" r="34" fill={S} stroke={BR} strokeWidth="0.8" />
      <circle cx="78" cy="76" r="22" fill={C} opacity="0.2" />
      <rect x="64" y="70" width="28" height="12" rx="3" fill={C} opacity="0.5" />
      {/* shapes */}
      {[0,1,2].map(i => (
        <g key={i}>
          <rect x={138+i*36} y="58" width="28" height="28" rx={[14,5,0][i]}
                fill={S} stroke={i===0?C:BR} strokeWidth={i===0?1.5:0.8} />
          <rect x={142+i*36} y="91" width={[20,20,28][i]} height="6" rx="3" fill={I3} opacity="0.35" />
        </g>
      ))}
      {/* colores */}
      <rect x="26" y="122" width="80" height="7" rx="3" fill={I2} opacity="0.35" />
      {['#E85D4A','#B98527','#4B3F2F','#F2EDE3','#10B981','#4F7BB5'].map((col,i) => (
        <circle key={i} cx={30+i*28} cy="146" r="12"
                fill={col} stroke="#fff" strokeWidth="2" />
      ))}
      {/* fuentes */}
      <rect x="250" y="22" width="170" height="7" rx="3" fill={I2} opacity="0.35" />
      {[['Bebas Neue','Montserrat'],['Playfair','Lato'],['Poppins','Inter']].map(([d,b],i) => (
        <g key={i}>
          <rect x="250" y={36+i*46} width="180" height="38" rx="6" fill={S} stroke={i===0?C:BR} strokeWidth={i===0?1.5:0.5} />
          <rect x="260" y={44+i*46} width={[70,80,55][i]} height="10" rx="3" fill={I2} opacity="0.45" />
          <rect x="260" y={58+i*46} width={[50,55,40][i]} height="7" rx="3" fill={I3} opacity="0.3" />
        </g>
      ))}
    </svg>
  );
}

function IlluCobros() {
  return (
    <svg viewBox="0 0 460 200" width="100%" style={{ display: 'block' }}>
      <rect width="460" height="200" fill={C} />
      <rect x="18" y="12" width="424" height="176" rx="8" fill={B} />
      {/* Efectivo card */}
      <rect x="26" y="22" width="200" height="58" rx="8" fill={S} stroke={BR} strokeWidth="0.5" />
      <rect x="38" y="34" width="36" height="7" rx="3" fill={I2} opacity="0.4" />
      <rect x="38" y="46" width="100" height="6" rx="3" fill={I3} opacity="0.3" />
      {/* toggle on */}
      <rect x="202" y="38" width="16" height="9" rx="4.5" fill={GN} opacity="0.8" />
      <circle cx="212" cy="42.5" r="3.5" fill="#fff" />
      {/* MP card */}
      <rect x="26" y="88" width="200" height="58" rx="8" fill={S} stroke={BR} strokeWidth="0.5" />
      <rect x="38" y="100" width="50" height="7" rx="3" fill={I2} opacity="0.4" />
      <rect x="38" y="112" width="110" height="6" rx="3" fill={I3} opacity="0.3" />
      {/* toggle off */}
      <rect x="202" y="104" width="16" height="9" rx="4.5" fill={BR} />
      <circle cx="207" cy="108.5" r="3.5" fill="#fff" />
      {/* Cancel policy */}
      <rect x="240" y="22" width="192" height="70" rx="8" fill={S} stroke={BR} strokeWidth="0.5" />
      <rect x="252" y="32" width="80" height="7" rx="3" fill={I2} opacity="0.4" />
      <rect x="252" y="44" width="150" height="6" rx="3" fill={I3} opacity="0.28" />
      <rect x="252" y="54" width="130" height="6" rx="3" fill={I3} opacity="0.22" />
      {/* hours input */}
      <rect x="252" y="66" width="40" height="18" rx="4" fill="#fff" stroke={C} strokeWidth="1.2" />
      <rect x="258" y="71" width="14" height="8" rx="2" fill={C} opacity="0.5" />
      <rect x="300" y="71" width="80" height="7" rx="3" fill={I3} opacity="0.35" />
      {/* links */}
      <rect x="240" y="100" width="192" height="46" rx="8" fill={S} stroke={BR} strokeWidth="0.5" />
      <rect x="252" y="110" width="70" height="7" rx="3" fill={I2} opacity="0.4" />
      <rect x="252" y="122" width="120" height="6" rx="3" fill={I3} opacity="0.28" />
      <rect x="252" y="134" width="60" height="7" rx="3" fill={C} opacity="0.5" />
    </svg>
  );
}

function IlluTalleres() {
  return (
    <svg viewBox="0 0 460 200" width="100%" style={{ display: 'block' }}>
      <rect width="460" height="200" fill={C} />
      <rect x="18" y="12" width="424" height="176" rx="8" fill={B} />
      {/* header */}
      <rect x="26" y="22" width="80" height="10" rx="4" fill={I2} opacity="0.3" />
      <rect x="340" y="18" width="90" height="22" rx="6" fill={C} opacity="0.85" />
      <rect x="352" y="25" width="66" height="8" rx="3" fill="#fff" opacity="0.85" />
      {/* workshop cards */}
      {[0,1,2].map(i => (
        <g key={i}>
          <rect x={26+i*136} y="46" width="128" height="136" rx="10" fill={S} />
          {/* header color band */}
          <rect x={26+i*136} y="46" width="128" height="50" rx="10"
                fill={[C,'#B98527','#4F7BB5'][i]} opacity="0.35" />
          {/* price tag */}
          <rect x={34+i*136} y="54" width="40" height="16" rx="8"
                fill="rgba(0,0,0,0.4)" />
          <rect x={38+i*136} y="58" width="30" height="8" rx="3" fill="#fff" opacity="0.85" />
          {/* disponible badge */}
          <rect x={102+i*136} y="54" width="42" height="14" rx="7"
                fill={GN} opacity="0.85" />
          <rect x={106+i*136} y="58" width="30" height="6" rx="3" fill="#fff" opacity="0.9" />
          {/* body */}
          <rect x={34+i*136} y="104" width={[84,72,78][i]} height="9" rx="3" fill={I2} opacity="0.5" />
          <rect x={34+i*136} y="118" width={[60,52,56][i]} height="7" rx="3" fill={I3} opacity="0.35" />
          {/* botón */}
          <rect x={34+i*136} y="160" width="80" height="16" rx="8" fill={C} opacity="0.75" />
          <rect x={38+i*136} y="164" width="56" height="8" rx="3" fill="#fff" opacity="0.9" />
        </g>
      ))}
    </svg>
  );
}

function IlluFormTaller() {
  return (
    <svg viewBox="0 0 460 200" width="100%" style={{ display: 'block' }}>
      <rect width="460" height="200" fill={C} />
      <rect x="18" y="12" width="424" height="176" rx="8" fill={B} />
      {/* col izquierda */}
      <rect x="26" y="22" width="60" height="7" rx="3" fill={I3} opacity="0.4" />
      <rect x="26" y="34" width="190" height="20" rx="4" fill="#fff" stroke={BR} strokeWidth="0.8" />
      <rect x="26" y="62" width="60" height="7" rx="3" fill={I3} opacity="0.4" />
      <rect x="26" y="74" width="190" height="42" rx="4" fill="#fff" stroke={BR} strokeWidth="0.8" />
      <rect x="26" y="122" width="40" height="7" rx="3" fill={I3} opacity="0.4" />
      {/* date + time inputs */}
      <rect x="26" y="134" width="90" height="20" rx="4" fill="#fff" stroke={BR} strokeWidth="0.8" />
      <rect x="126" y="134" width="44" height="20" rx="4" fill="#fff" stroke={BR} strokeWidth="0.8" />
      <rect x="178" y="134" width="38" height="20" rx="4" fill="#fff" stroke={BR} strokeWidth="0.8" />
      {/* col derecha */}
      <rect x="234" y="22" width="55" height="7" rx="3" fill={I3} opacity="0.4" />
      <rect x="234" y="34" width="60" height="20" rx="4" fill="#fff" stroke={BR} strokeWidth="0.8" />
      <rect x="302" y="22" width="55" height="7" rx="3" fill={I3} opacity="0.4" />
      <rect x="302" y="34" width="120" height="20" rx="4" fill="#fff" stroke={BR} strokeWidth="0.8" />
      {/* header type */}
      <rect x="234" y="68" width="90" height="7" rx="3" fill={I3} opacity="0.4" />
      <rect x="234" y="80" width="188" height="80" rx="8" fill={S2} />
      {/* color option */}
      <rect x="244" y="90" width="80" height="26" rx="5" fill={S} stroke={C} strokeWidth="1.2" />
      <circle cx="262" cy="103" r="8" fill={C} opacity="0.5" />
      <rect x="276" y="100" width="38" height="6" rx="3" fill={I2} opacity="0.4" />
      {/* image option */}
      <rect x="244" y="124" width="80" height="26" rx="5" fill={S} stroke={BR} strokeWidth="0.5" />
      <rect x="252" y="132" width="16" height="10" rx="2" fill={I3} opacity="0.3" />
      <rect x="274" y="135" width="42" height="6" rx="3" fill={I3} opacity="0.3" />
      {/* save */}
      <rect x="234" y="170" width="100" height="20" rx="5" fill={C} opacity="0.85" />
      <rect x="246" y="176" width="70" height="8" rx="3" fill="#fff" opacity="0.9" />
    </svg>
  );
}

function IlluReservas() {
  return (
    <svg viewBox="0 0 460 200" width="100%" style={{ display: 'block' }}>
      <rect width="460" height="200" fill={C} />
      <rect x="18" y="12" width="424" height="176" rx="8" fill={B} />
      {/* stat cards */}
      {[0,1,2,3].map(i => (
        <g key={i}>
          <rect x={26+i*102} y="18" width="96" height="40" rx="6" fill={S} stroke={BR} strokeWidth="0.5" />
          <rect x={34+i*102} y="25" width={[44,52,48,38][i]} height="6" rx="3" fill={I3} opacity="0.35" />
          <rect x={34+i*102} y="36" width={[28,34,22,30][i]} height="10" rx="3"
                fill={[I2,GN,C,'#B98527'][i]} opacity="0.6" />
        </g>
      ))}
      {/* table header */}
      <rect x="26" y="66" width="406" height="18" rx="4" fill={S2} />
      {[0,1,2,3,4].map(i => (
        <rect key={i} x={34+i*80} y="72" width={[64,52,48,44,52][i]} height="6" rx="3" fill={I3} opacity="0.4" />
      ))}
      {/* rows */}
      {[0,1,2,3,4].map(r => (
        <g key={r}>
          <rect x="26" y={86+r*20} width="406" height="1" fill={BR} opacity="0.5" />
          <rect x="34" y={91+r*20} width="60" height="7" rx="3" fill={I2} opacity={0.4-r*0.04} />
          <rect x="114" y={91+r*20} width="48" height="7" rx="3" fill={I3} opacity={0.3-r*0.03} />
          {/* estado badge */}
          <rect x={194} y={89+r*20} width="54" height="11" rx="5.5"
                fill={r < 3 ? GN : '#DC2626'} opacity="0.12" />
          <rect x={200} y={93+r*20} width={r < 3 ? 36 : 36} height="5" rx="2.5"
                fill={r < 3 ? GN : '#DC2626'} opacity="0.7" />
          <rect x="256" y={91+r*20} width="44" height="7" rx="3" fill={I3} opacity="0.25" />
        </g>
      ))}
    </svg>
  );
}

function IlluPaginaPublica() {
  return (
    <svg viewBox="0 0 460 200" width="100%" style={{ display: 'block' }}>
      <rect width="460" height="200" fill={C} />
      {/* phone frame */}
      <rect x="140" y="8" width="180" height="184" rx="16" fill="#1A1611" />
      <rect x="144" y="12" width="172" height="176" rx="12" fill="#FAF8F4" />
      {/* notch */}
      <rect x="195" y="12" width="70" height="6" rx="3" fill="#1A1611" />
      {/* hero */}
      <rect x="144" y="18" width="172" height="50" rx="8" fill={C} opacity="0.85" />
      <rect x="154" y="28" width="80" height="10" rx="4" fill="#fff" opacity="0.9" />
      <rect x="154" y="42" width="60" height="7" rx="3" fill="rgba(255,255,255,0.6)" />
      {/* hamburger */}
      {[0,1,2].map(i => (
        <rect key={i} x="292" y={26+i*5} width="16" height="2.5" rx="1.25" fill="#fff" opacity="0.8" />
      ))}
      {/* cards */}
      {[0,1].map(i => (
        <g key={i}>
          <rect x={152+i*82} y="76" width="76" height="86" rx="8" fill={S} />
          <rect x={152+i*82} y="76" width="76" height="32" rx="8"
                fill={i===0 ? '#B98527' : C} opacity="0.4" />
          <rect x={158+i*82} y="116" width={i===0?50:44} height="6" rx="3" fill={I2} opacity="0.4" />
          <rect x={158+i*82} y="126" width={i===0?36:40} height="5" rx="2.5" fill={I3} opacity="0.3" />
          <rect x={158+i*82} y="148" width="56" height="10" rx="5" fill={C} opacity="0.75" />
        </g>
      ))}
      {/* footer */}
      <rect x="144" y="168" width="172" height="20" rx="0" fill={C} opacity="0.85" />
      <rect x="190" y="174" width="80" height="7" rx="3" fill="rgba(255,255,255,0.65)" />
    </svg>
  );
}

// ── Contenido de los pasos ─────────────────────────────────────────────────────

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
    paras: [
      'Aquí configurás el nombre de tu espacio, el rubro y las ubicaciones donde dictás tus talleres.',
    ],
    bullets: [
      '<b>Nombre:</b> el que verán tus alumnos en la página pública y en los comprobantes.',
      '<b>Rubro:</b> elegí de la lista o escribí uno personalizado con la opción "Otro".',
      '<b>Ubicaciones:</b> agregá las direcciones y dales un nombre corto (ej. "Estudio central"). Luego podés asignar una a cada taller.',
      'Al final de esta sección encontrás el <b>QR y el link directo</b> a tu página pública.',
    ],
  },
  {
    label: 'Paso 3 de 7',
    Illustration: IlluIdentidad,
    title: 'Configuración → Identidad',
    paras: [
      'Personalizá cómo se ve tu espacio: logo, colores y tipografías.',
    ],
    bullets: [
      '<b>Logo:</b> subí tu imagen y elegí la forma (círculo, cuadrado o libre). El slider ajusta el zoom.',
      '<b>Colores:</b> subí el logo y Antológico sugiere tu paleta automáticamente. Asignás cada color a un rol: principal, botones, fondo, cards, etc.',
      '<b>Tipografías:</b> elegí el par de fuentes que mejor represente tu estilo. Las marcadas como Pro o Estudio requieren esos planes.',
    ],
  },
  {
    label: 'Paso 4 de 7',
    Illustration: IlluCobros,
    title: 'Configuración → Mis Cobros',
    paras: [
      'Definí cómo cobran tus alumnos y cuánto tiempo tienen para cancelar.',
    ],
    bullets: [
      '<b>Efectivo:</b> el alumno reserva online y paga al llegar. Activo por defecto.',
      '<b>Mercado Pago:</b> conectá tu cuenta para cobrar online al momento de la reserva.',
      '<b>Links de pago:</b> agregá links externos (Cafecito, etc.) que aparecen como botones al reservar.',
      '<b>Política de cancelación:</b> indicá cuántas horas antes el alumno puede cancelar. Poné 0 para no permitir cancelaciones.',
    ],
  },
  {
    label: 'Paso 5 de 7',
    Illustration: IlluTalleres,
    title: 'Talleres — tu oferta',
    paras: [
      'Desde <b>Talleres</b> gestionás toda tu agenda. Cada taller tiene un estado que controla su visibilidad.',
    ],
    bullets: [
      '<b>Borrador:</b> solo vos lo ves. Usalo para preparar el taller antes de anunciarlo.',
      '<b>Publicado:</b> visible en tu página pública. Los alumnos pueden reservar.',
      '<b>Agotado:</b> se asigna automáticamente cuando los cupos llegan a 0. También podés cerrarlo manualmente.',
      'Hacé clic en <b>+ Nuevo taller</b> para crear uno nuevo.',
    ],
  },
  {
    label: 'Paso 6 de 7',
    Illustration: IlluFormTaller,
    title: 'Crear o editar un taller',
    paras: [
      'El formulario te pide los datos del taller. Cada campo es clave para que el alumno tenga toda la información.',
    ],
    bullets: [
      '<b>Nombre y descripción:</b> lo que el alumno verá en la card.',
      '<b>Fecha y hora:</b> date picker más dos selectores (hora y minutos en pasos de 15 min).',
      '<b>Cupos:</b> cada persona que se inscriba consume un cupo. Al llegar a 0 el taller se marca agotado.',
      '<b>Encabezado:</b> con el plan Esencial elegís un color; con Profesional o Estudio podés subir una imagen y ajustar el punto focal.',
    ],
  },
  {
    label: 'Paso 7 de 7',
    Illustration: IlluReservas,
    title: 'Reservas y página pública',
    paras: [
      'En <b>Reservas</b> ves todas las inscripciones: nombre, contacto, taller, método de pago y estado.',
    ],
    bullets: [
      'Las reservas en efectivo tienen estado <em>Pendiente</em> hasta que las marcás como pagadas desde la tabla.',
      'Podés <b>bloquear un usuario</b> desde la tabla si es necesario. Desbloquearlo se hace desde Mi Espacio.',
      'Tu <b>página pública</b> muestra las cards de los talleres publicados. Tus alumnos reservan desde ahí, crean una cuenta y gestionan sus reservas en la sección <em>Mis reservas</em>.',
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
            className="w-7 h-7 flex items-center justify-center rounded-full text-[#9B8F80] hover:bg-[#EDE8DE] hover:text-[#2B241A] transition-colors"
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
          <p className="text-xs text-[#9B8F80] font-mono mb-1">{step.label}</p>
          <h2 className="text-xl font-bold text-[#1A1611] mb-3 leading-snug">{step.title}</h2>
          <div className="text-sm text-[#2B241A] leading-relaxed space-y-2">
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
        <div className="flex items-center justify-between px-6 py-4 border-t border-[#EDE8DE] shrink-0">
          <button
            onClick={() => setIdx(i => i - 1)}
            disabled={isFirst}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[#D2C4A8] text-sm font-medium text-[#6B5F4C] hover:bg-[#EDE8DE] disabled:opacity-30 disabled:cursor-default transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
            Anterior
          </button>

          {/* Dots */}
          <div className="flex items-center gap-1.5">
            {STEPS.map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                className="rounded-full transition-all"
                style={{
                  width:  i === idx ? 20 : 8,
                  height: 8,
                  background: i === idx ? '#E85D4A' : '#D2C4A8',
                }}
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

// ── Botón flotante + export ────────────────────────────────────────────────────

export default function Instructivo() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-[100] flex items-center gap-2 bg-[#FAF8F4] border border-[#D2C4A8] shadow-lg rounded-full pl-3.5 pr-4 py-2.5 text-sm font-medium text-[#2B241A] hover:shadow-xl hover:bg-white transition-all"
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
