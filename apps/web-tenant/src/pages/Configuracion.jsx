import { useCallback, useEffect, useRef, useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import Swal from 'sweetalert2';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { useEspacio } from '../context/EspacioContext';
import { espacios as espacioApi, reservas as reservasApi } from '../services/api';
import { RUBROS, fetchRubros } from '../lib/rubros';
import { httpsCallable } from 'firebase/functions';
import { doc, getDoc, updateDoc, increment } from 'firebase/firestore';
import { functions, firestore } from '../lib/firebase';
import { SOCIAL_NETWORKS, SocialIcon } from '../components/SocialIcons';
import { IconAntologico } from '../components/LogoAntologico';
import { usePlanes, precioConPeriodo, proximaRenovacion, formatFechaLarga } from '../hooks/usePlanes';

// ── Helpers ───────────────────────────────────────────────────────────────────

function phoneToWaLink(phone) {
  const digits = phone.replace(/[^\d]/g, '');
  return digits ? `https://wa.me/${digits}` : '';
}

function looksLikePhone(value) {
  const v = value.trim();
  return /^[+\d][\d\s\-().]{4,}$/.test(v) && !/^https?:\/\//i.test(v);
}

function isValidColor(str) {
  if (!str?.trim()) return false;
  const s = new Option().style;
  s.color = str;
  return s.color !== '';
}

function hexToRgb(hex) {
  if (!hex?.startsWith('#')) return null;
  const h = hex.replace('#', '');
  const full = h.length === 3 ? h.split('').map(c => c + c).join('') : h;
  if (full.length !== 6) return null;
  return {
    r: parseInt(full.slice(0, 2), 16),
    g: parseInt(full.slice(2, 4), 16),
    b: parseInt(full.slice(4, 6), 16),
  };
}

function contrastOnColor(hex) {
  const rgb = hexToRgb(hex);
  if (!rgb) return 'white';
  const lum = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
  return lum > 0.55 ? 'dark' : 'light';
}

function lastDayOfCurrentMonth() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() + 1, 0)
    .toLocaleDateString('es-AR', { day: '2-digit', month: 'long', year: 'numeric' });
}

function firstDayOfNextMonth() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() + 1, 1)
    .toLocaleDateString('es-AR', { day: '2-digit', month: 'long', year: 'numeric' });
}

function compressImage(file, maxPx = 480) {
  return new Promise(resolve => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const scale = Math.min(1, maxPx / Math.max(img.width, img.height));
      const canvas = document.createElement('canvas');
      canvas.width  = Math.round(img.width  * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL('image/png'));
    };
    img.src = url;
  });
}

function extractDominantColors(imgEl, count = 6) {
  const size = 100;
  const canvas = document.createElement('canvas');
  canvas.width = size; canvas.height = size;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(imgEl, 0, 0, size, size);
  const { data } = ctx.getImageData(0, 0, size, size);
  const map = {};
  for (let i = 0; i < data.length; i += 4) {
    const [r, g, b, a] = [data[i], data[i+1], data[i+2], data[i+3]];
    if (a < 80) continue;
    const brightness = (r + g + b) / 3;
    if (brightness > 235 || brightness < 20) continue;
    const q = 20;
    const key = `${Math.round(r/q)*q},${Math.round(g/q)*q},${Math.round(b/q)*q}`;
    map[key] = (map[key] || 0) + 1;
  }
  return Object.entries(map)
    .sort((a, b) => b[1] - a[1])
    .slice(0, count)
    .map(([key]) => {
      const [r, g, b] = key.split(',').map(Number);
      return `#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}`;
    });
}

function contrastText(hex) {
  if (!hex?.startsWith('#') || hex.length < 7) return '#ffffff';
  const r = parseInt(hex.slice(1,3), 16);
  const g = parseInt(hex.slice(3,5), 16);
  const b = parseInt(hex.slice(5,7), 16);
  return (0.299*r + 0.587*g + 0.114*b) / 255 > 0.5 ? '#1A1611' : '#ffffff';
}

function complementaryColor(hex) {
  if (!hex?.startsWith('#') || hex.length < 7) return '#E85D4A';
  const r = parseInt(hex.slice(1,3), 16) / 255;
  const g = parseInt(hex.slice(3,5), 16) / 255;
  const b = parseInt(hex.slice(5,7), 16) / 255;
  const max = Math.max(r,g,b), min = Math.min(r,g,b), d = max - min;
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (d !== 0) {
    s = d / (l > 0.5 ? 2 - max - min : max + min);
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
    else if (max === g) h = ((b - r) / d + 2) / 6;
    else h = ((r - g) / d + 4) / 6;
  }
  const ch = (h * 360 + 180) % 360;
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const hue2rgb = (t) => {
    if (t < 0) t += 1; if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
  };
  const hN = ch / 360;
  const toHex = (x) => Math.round(x * 255).toString(16).padStart(2, '0');
  return '#' + toHex(hue2rgb(hN + 1/3)) + toHex(hue2rgb(hN)) + toHex(hue2rgb(hN - 1/3));
}

const INPUT_CLS = 'w-full px-3 py-2 bg-surface-100 border border-border rounded-md text-sm text-ink focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary';
const LABEL_CLS = 'block text-xs font-medium text-ink-muted mb-1';

// ── Catalogue ─────────────────────────────────────────────────────────────────

const FONT_PAIRS = [
  { key: 'Bebas Neue|Montserrat',        display: 'Bebas Neue',        body: 'Montserrat',    desc: 'Moderno · Posters · Redes sociales',      pro: false },
  { key: 'Playfair Display|Lato',        display: 'Playfair Display',  body: 'Lato',          desc: 'Lujo · Editorial · Moda',                 pro: false },
  { key: 'Oswald|Open Sans',             display: 'Oswald',            body: 'Open Sans',     desc: 'Corporativo · UI/UX · Negocios',          pro: false },
  { key: 'Poppins|Inter',                display: 'Poppins',           body: 'Inter',         desc: 'Tech · Startups · Apps',                  pro: false },
  { key: 'DM Serif Display|Raleway',     display: 'DM Serif Display',  body: 'Raleway',       desc: 'Premium · Revistas · Lifestyle',          pro: false },
  { key: 'Anton|Roboto',                 display: 'Anton',             body: 'Roboto',        desc: 'Negrita · Deportes · Publicidades',       pro: true  },
  { key: 'League Spartan|Manrope',       display: 'League Spartan',    body: 'Manrope',       desc: 'Moderno · Minimal · Agencia',             pro: true  },
  { key: 'Righteous|Nunito',             display: 'Righteous',         body: 'Nunito',        desc: 'Creativo · Startups · Marcas amigables',  pro: true  },
  { key: 'Merriweather|Source Sans 3',   display: 'Merriweather',      body: 'Source Sans 3', desc: 'Editorial · Blogs · Noticias',            pro: true  },
  { key: 'Exo 2|Work Sans',             display: 'Exo 2',             body: 'Work Sans',     desc: 'Futurista · Tecnología · Ciencia',        pro: true  },
];

const GOOGLE_FONTS_URL =
  'https://fonts.googleapis.com/css2?' +
  'family=Bebas+Neue' +
  '&family=Montserrat:wght@400;500;600' +
  '&family=Playfair+Display:wght@400;600' +
  '&family=Lato:wght@400;700' +
  '&family=Oswald:wght@400;500;600' +
  '&family=Open+Sans:wght@400;500' +
  '&family=Poppins:wght@400;600;800' +
  '&family=Inter:wght@400;500' +
  '&family=DM+Serif+Display' +
  '&family=Raleway:wght@400;500' +
  '&family=Anton' +
  '&family=Roboto:wght@400;500' +
  '&family=League+Spartan:wght@400;700' +
  '&family=Manrope:wght@400;500' +
  '&family=Righteous' +
  '&family=Nunito:wght@400;600' +
  '&family=Merriweather:wght@400;700' +
  '&family=Source+Sans+3:wght@400;600' +
  '&family=Exo+2:wght@400;600' +
  '&family=Work+Sans:wght@400;500' +
  '&display=swap';

const SHAPES = [
  { key: 'round',   label: 'Círculo',   cls: 'rounded-full' },
  { key: 'rounded', label: 'Cuadrado',  cls: 'rounded-2xl' },
  { key: 'square',  label: 'Sin borde', cls: 'rounded-none' },
];

const COLOR_ROLES = [
  { key: 'primary',      label: 'Principal',          hint: 'Hero y encabezados de tu página' },
  { key: 'secondary',    label: 'Secundario',         hint: 'Badges, categorías, etiquetas' },
  { key: 'button',       label: 'Botones',            hint: 'Botón "Reservar" y CTAs' },
  { key: 'bg',           label: 'Fondo',              hint: 'Fondo general de tu página pública' },
  { key: 'card',         label: 'Fondo de cards',     hint: 'Color de fondo de las tarjetas de talleres' },
  { key: 'textHeading',  label: 'Fuente encabezado',  hint: 'Color de títulos y nombre del espacio' },
  { key: 'textCard',     label: 'Fuente en cards',    hint: 'Texto del nombre y descripción de talleres' },
];

const TABS = [
  { key: 'espacio',     label: 'Mi espacio' },
  { key: 'identidad',   label: 'Identidad' },
  { key: 'tyc',         label: 'Términos y condiciones' },
  { key: 'cobros',      label: 'Mis Cobros' },
  { key: 'suscripcion', label: 'Suscripción' },
];

const MP_WORKER_URL = 'https://antologico-mp.franriv2388.workers.dev';

// ── Brand Preview ─────────────────────────────────────────────────────────────

function BrandPreview({ palette, roles, fontPair, logoData, logoShape, logoScale, espacioName }) {
  const primary      = isValidColor(roles.primary)      ? roles.primary      : (palette[0] || '#E85D4A');
  const secondary    = isValidColor(roles.secondary)    ? roles.secondary    : (palette[1] || '#B98527');
  const button       = isValidColor(roles.button)       ? roles.button       : primary;
  const bg           = isValidColor(roles.bg)           ? roles.bg           : '#F5F0EB';
  const card         = isValidColor(roles.card)         ? roles.card         : '#ffffff';
  const textHeading  = isValidColor(roles.textHeading)  ? roles.textHeading  : contrastText(primary);
  const textCard     = isValidColor(roles.textCard)     ? roles.textCard     : (contrastText(card) === '#ffffff' ? '#f0f0f0' : '#2B241A');

  const displayFont = fontPair ? `'${fontPair.display}', serif` : 'Georgia, serif';
  const bodyFont    = fontPair ? `'${fontPair.body}', sans-serif` : 'system-ui, sans-serif';
  const shapeCls    = SHAPES.find(s => s.key === logoShape)?.cls ?? 'rounded-2xl';

  return (
    <div className="rounded-xl overflow-hidden border border-border shadow-sm text-[13px]" style={{ backgroundColor: bg, fontFamily: bodyFont }}>
      {/* Hero */}
      <div className="px-5 py-5" style={{ backgroundColor: primary }}>
        <div className="flex items-center gap-3 mb-1">
          {logoData && (
            <div className={`w-9 h-9 overflow-hidden shrink-0 ${shapeCls}`} style={shapeCls !== 'rounded-none' ? { background: 'rgba(255,255,255,0.15)' } : {}}>
              <img src={logoData} alt="" className="w-full h-full object-contain"
                style={logoScale && logoScale !== 1 ? { transform: `scale(${logoScale})`, transformOrigin: 'center' } : undefined} />
            </div>
          )}
          <div>
            <p style={{ fontFamily: displayFont, color: textHeading }} className="font-bold text-base leading-tight">
              {espacioName || 'Mi espacio'}
            </p>
            <p style={{ color: textHeading, opacity: 0.7, fontSize: '0.7rem' }}>Talleres y workshops</p>
          </div>
        </div>
      </div>

      {/* Workshop card */}
      <div className="p-3">
        <div className="rounded-lg shadow-sm overflow-hidden" style={{ backgroundColor: card }}>
          <div className="h-10 w-full" style={{ backgroundColor: primary, opacity: 0.65 }} />
          <div className="px-3 py-2.5">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] px-1.5 py-0.5 rounded-full font-semibold" style={{ backgroundColor: secondary, color: contrastText(secondary) }}>Arte</span>
              <span style={{ color: '#888', fontSize: '10px' }}>8 cupos</span>
            </div>
            <p style={{ fontFamily: displayFont, color: textCard }} className="font-bold text-sm leading-tight mb-0.5">
              Taller de acuarela
            </p>
            <p style={{ color: textCard, opacity: 0.65, fontSize: '10px' }} className="mb-2">
              Aprende técnicas de acuarela para principiantes.
            </p>
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold" style={{ color: textCard }}>$3.500</p>
              <button className="px-2.5 py-1 text-[11px] font-semibold rounded-md"
                style={{ backgroundColor: button, color: contrastText(button) }}>
                Reservar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Modal cancelación ─────────────────────────────────────────────────────────

function CancelSubscriptionModal({ nombre, loading, error, onConfirm, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => !loading && onClose()}>
      <div className="absolute inset-0 bg-ink/20 backdrop-blur-[2px]" />
      <div className="relative bg-surface-0 border border-border rounded-xl shadow-2xl p-6 max-w-md w-full" onClick={e => e.stopPropagation()}>
        <h3 className="font-display text-lg text-ink mb-2">¿Cancelar suscripción de <em>{nombre}</em>?</h3>
        <p className="text-sm text-ink-muted mb-1.5">Tu espacio seguirá activo hasta el <strong className="text-ink">{lastDayOfCurrentMonth()}</strong>.</p>
        <p className="text-sm text-ink-muted mb-5">A partir del <strong className="text-ink">{firstDayOfNextMonth()}</strong> no se realizarán más cobros.</p>
        {error && <p className="mb-4 text-xs text-danger">{error}</p>}
        <div className="flex justify-end gap-3">
          <button onClick={onClose} disabled={loading} className="px-4 py-2 text-sm font-medium text-ink hover:bg-surface-200 rounded-md border border-border disabled:opacity-50">Volver</button>
          <button onClick={onConfirm} disabled={loading} className="px-4 py-2 text-sm font-semibold text-white bg-danger hover:bg-danger/90 rounded-md disabled:opacity-50">
            {loading ? 'Procesando…' : 'Confirmar cancelación'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Modal: eliminar espacio (general, con aviso de reservas activas) ─────────

function EliminarEspacioModal({ espacio, reservasActivas, phase, loading, error, onContinuar, onConfirm, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => !loading && onClose()}>
      <div className="absolute inset-0 bg-ink/30 backdrop-blur-[2px]" />
      <div className="relative bg-surface-0 border border-border rounded-xl shadow-2xl p-6 max-w-md w-full" onClick={e => e.stopPropagation()}>

        {phase === 'warn' ? (
          <>
            {/* Ícono de advertencia */}
            <div className="w-11 h-11 rounded-full bg-amber-100 flex items-center justify-center mb-4">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#B45309" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
            </div>
            <h3 className="font-display text-lg text-ink mb-2">
              Este espacio tiene reservas activas
            </h3>
            <p className="text-sm text-ink-muted mb-1.5">
              <strong className="text-ink">{reservasActivas} {reservasActivas === 1 ? 'reserva activa' : 'reservas activas'}</strong> se perderán al eliminar el espacio <em>{espacio?.nombre}</em>.
            </p>
            <p className="text-sm text-ink-muted mb-5">
              Los usuarios con reservas confirmadas no recibirán aviso automático. Considerá cancelarlas y notificarlos antes de continuar.
            </p>
            <div className="flex justify-end gap-3">
              <button onClick={onClose} disabled={loading}
                className="px-4 py-2 text-sm font-medium text-ink hover:bg-surface-200 rounded-md border border-border disabled:opacity-50">
                Volver
              </button>
              <button onClick={onContinuar} disabled={loading}
                className="px-4 py-2 text-sm font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-md disabled:opacity-50">
                Entiendo, continuar
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Ícono de eliminar */}
            <div className="w-11 h-11 rounded-full bg-danger/10 flex items-center justify-center mb-4">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                <path d="M10 11v6"/><path d="M14 11v6"/>
                <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
              </svg>
            </div>
            <h3 className="font-display text-lg text-ink mb-2">
              ¿Eliminar <em>{espacio?.nombre}</em>?
            </h3>
            <p className="text-sm text-ink-muted mb-5">
              Se eliminarán permanentemente todos los talleres, reservas y la configuración de este espacio.
              <strong className="text-ink block mt-1.5">Esta acción no se puede deshacer.</strong>
            </p>
            {error && <p className="mb-4 text-xs text-danger bg-danger/5 border border-danger/20 rounded-lg px-3 py-2">{error}</p>}
            <div className="flex justify-end gap-3">
              <button onClick={onClose} disabled={loading}
                className="px-4 py-2 text-sm font-medium text-ink hover:bg-surface-200 rounded-md border border-border disabled:opacity-50">
                Cancelar
              </button>
              <button onClick={onConfirm} disabled={loading}
                className="px-4 py-2 text-sm font-semibold text-white bg-danger hover:bg-danger/90 rounded-md disabled:opacity-50">
                {loading ? 'Eliminando…' : 'Sí, eliminar espacio'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ── Modal: eliminar espacio adicional ────────────────────────────────────────

function DeleteEspacioModal({ espacio, espacioQueQueda, loading, error, onConfirm, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => !loading && onClose()}>
      <div className="absolute inset-0 bg-ink/20 backdrop-blur-[2px]" />
      <div className="relative bg-surface-0 border border-border rounded-xl shadow-2xl p-6 max-w-md w-full" onClick={e => e.stopPropagation()}>
        <h3 className="font-display text-lg text-ink mb-2">¿Eliminar el espacio <em>{espacio?.nombre}</em>?</h3>
        <p className="text-sm text-ink-muted mb-1.5">
          Se darán de baja todos los talleres y reservas asociados a este espacio. Esta acción no se puede deshacer.
        </p>
        <p className="text-sm text-ink-muted mb-5">
          Tu facturación volverá al <strong className="text-ink">100% del plan Estudio</strong> para tu espacio <strong className="text-ink">{espacioQueQueda?.nombre}</strong> a partir del <strong className="text-ink">{firstDayOfNextMonth()}</strong>.
        </p>
        {error && <p className="mb-4 text-xs text-danger">{error}</p>}
        <div className="flex justify-end gap-3">
          <button onClick={onClose} disabled={loading} className="px-4 py-2 text-sm font-medium text-ink hover:bg-surface-200 rounded-md border border-border disabled:opacity-50">Cancelar</button>
          <button onClick={onConfirm} disabled={loading} className="px-4 py-2 text-sm font-semibold text-white bg-danger hover:bg-danger/90 rounded-md disabled:opacity-50">
            {loading ? 'Eliminando…' : 'Eliminar espacio'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Modal: agregar espacio adicional ─────────────────────────────────────────

function AgregarEspacioModal({ userId, onSuccess, onClose }) {
  const [nombre,  setNombre]  = useState('');
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    if (!nombre.trim()) return;
    setLoading(true); setError('');
    try {
      await espacioApi.create({
        userId,
        nombre: nombre.trim(),
        estado: 'ACTIVO',
        cancelacionPendiente: false,
      });
      onSuccess();
    } catch (err) { setError(err.message || 'Ocurrió un error.'); }
    finally { setLoading(false); }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => !loading && onClose()}>
      <div className="absolute inset-0 bg-ink/20 backdrop-blur-[2px]" />
      <div className="relative bg-surface-0 border border-border rounded-xl shadow-2xl p-6 max-w-md w-full" onClick={e => e.stopPropagation()}>
        <h3 className="font-display text-lg text-ink mb-2">Agregar espacio adicional</h3>
        <p className="text-sm text-ink-muted mb-5">
          Incluido en tu plan Estudio sin costo adicional.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-medium text-ink mb-1.5 block">Nombre del espacio</label>
            <input
              value={nombre}
              onChange={e => setNombre(e.target.value)}
              placeholder="Ej: Studio Norte, Espacio Palermo…"
              className="w-full px-3 py-2 border border-border rounded-md text-sm text-ink bg-surface-100 focus:outline-none focus:border-primary"
              required
              autoFocus
            />
          </div>
          {error && <p className="text-xs text-danger">{error}</p>}
          <div className="flex justify-end gap-3 mt-1">
            <button type="button" onClick={onClose} disabled={loading} className="px-4 py-2 text-sm font-medium text-ink hover:bg-surface-200 rounded-md border border-border disabled:opacity-50">Cancelar</button>
            <button type="submit" disabled={loading || !nombre.trim()} className="px-4 py-2 text-sm font-semibold bg-primary text-white rounded-md hover:bg-primary/90 disabled:opacity-50">
              {loading ? 'Creando…' : 'Crear espacio'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Compartir espacio ────────────────────────────────────────────────────────

function CompartirEspacio({ espacio, refresh }) {
  const [copied, setCopied] = useState(false);
  const [useLogo, setUseLogo] = useState(true);
  const qrRef = useRef(null);

  const [slug, setSlug]             = useState(espacio.slug ?? '');
  const [slugDraft, setSlugDraft]   = useState(espacio.slug ?? '');
  const [slugSaving, setSlugSaving] = useState(false);
  const [slugError, setSlugError]   = useState('');
  const [slugSaved, setSlugSaved]   = useState(false);
  const [slugEditing, setSlugEditing] = useState(false);

  const subdomainUrl = slug ? `https://${slug}.antologico.app` : null;
  const publicUrl = subdomainUrl || `${window.location.origin}/p/${espacio.id}`;
  const logoUrl   = espacio.logoUrl ?? null;
  const QR_SIZE   = 200;
  const LOGO_SIZE = Math.round(QR_SIZE * 0.22);

  function handleCopy() {
    navigator.clipboard.writeText(publicUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function handleDownload() {
    const canvas = qrRef.current?.querySelector('canvas');
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `qr-${espacio.nombre?.toLowerCase().replace(/\s+/g, '-') ?? 'espacio'}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  }

  async function handleSlugSave() {
    const normalized = slugDraft.toLowerCase().replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-').replace(/^-|-$/g, '');
    if (!normalized) { setSlugError('Ingresá un subdominio.'); return; }
    setSlugSaving(true); setSlugError(''); setSlugSaved(false);
    try {
      const oldSlug = slug;
      await espacioApi.updateSlug(espacio.id, normalized);
      httpsCallable(functions, 'registerSubdomain')({ slug: normalized, oldSlug }).catch(() => {});
      setSlug(normalized);
      setSlugDraft(normalized);
      setSlugEditing(false);
      setSlugSaved(true);
      if (refresh) await refresh();
      setTimeout(() => setSlugSaved(false), 3000);
    } catch (err) {
      setSlugError(err.message || 'Error al guardar.');
    } finally {
      setSlugSaving(false);
    }
  }

  return (
    <div>
      <h3 className="text-sm font-semibold text-ink mb-0.5">Compartir tu espacio</h3>
      <p className="text-xs text-ink-muted mb-5">Esta es la URL pública que podés compartir con tus clientes para que vean y reserven tus talleres.</p>

      {/* Subdominio */}
      <div className="mb-5">
        <label className="block text-xs font-medium text-ink-muted mb-1.5">Subdominio personalizado</label>
        {slug && !slugEditing ? (
          <div className="flex items-center gap-2">
            <div className="flex-1 flex items-center bg-surface-100 border border-border rounded-md overflow-hidden">
              <span className="px-3 py-2 text-sm font-mono text-primary font-medium">{slug}</span>
              <span className="text-sm text-ink-muted">.antologico.app</span>
            </div>
            <button type="button" onClick={() => { setSlugEditing(true); setSlugDraft(slug); }}
              className="shrink-0 px-3 py-2 text-xs font-medium border border-border rounded-md bg-surface-100 hover:bg-surface-200 transition-colors text-ink-muted">
              Editar
            </button>
            {slugSaved && <span className="text-xs text-green-600 font-medium">¡Guardado!</span>}
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="flex-1 flex items-center bg-surface-100 border border-border rounded-md overflow-hidden focus-within:border-primary focus-within:ring-1 focus-within:ring-primary">
                <input
                  type="text"
                  value={slugDraft}
                  onChange={e => { setSlugDraft(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '')); setSlugError(''); }}
                  placeholder="mi-espacio"
                  className="flex-1 px-3 py-2 text-sm font-mono bg-transparent text-ink focus:outline-none"
                  autoFocus={slugEditing}
                />
                <span className="pr-3 text-sm text-ink-muted whitespace-nowrap">.antologico.app</span>
              </div>
              <button type="button" onClick={handleSlugSave} disabled={slugSaving || !slugDraft.trim()}
                className="shrink-0 px-4 py-2 text-sm font-semibold bg-primary text-white rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50">
                {slugSaving ? '…' : 'Guardar'}
              </button>
              {slug && slugEditing && (
                <button type="button" onClick={() => { setSlugEditing(false); setSlugDraft(slug); setSlugError(''); }}
                  className="shrink-0 px-3 py-2 text-xs text-ink-muted border border-border rounded-md hover:bg-surface-200 transition-colors">
                  Cancelar
                </button>
              )}
            </div>
            {slugError && <p className="text-xs text-danger">{slugError}</p>}
            <p className="text-[11px] text-ink-muted">Solo letras minúsculas, números y guiones. Mínimo 3 caracteres.</p>
          </div>
        )}
      </div>

      {/* URL */}
      <div className="flex items-center gap-2 mb-6">
        <div className="flex-1 px-3 py-2 bg-surface-100 border border-border rounded-md text-sm text-ink font-mono truncate">
          {publicUrl}
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="shrink-0 px-4 py-2 text-sm font-medium border border-border rounded-md bg-surface-100 hover:bg-surface-200 transition-colors"
        >
          {copied ? '¡Copiado!' : 'Copiar'}
        </button>
        <a
          href={publicUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 px-4 py-2 text-sm font-medium border border-border rounded-md bg-surface-100 hover:bg-surface-200 transition-colors"
        >
          Abrir →
        </a>
      </div>

      {/* QR */}
      <div className="flex items-start gap-6">
        <div ref={qrRef} className="shrink-0">
          <QRCodeCanvas
            value={publicUrl}
            size={QR_SIZE}
            bgColor="#ffffff"
            fgColor="#1A1611"
            level="H"
            imageSettings={logoUrl && useLogo ? {
              src:    logoUrl,
              width:  LOGO_SIZE,
              height: LOGO_SIZE,
              excavate: true,
            } : undefined}
          />
        </div>

        <div className="flex flex-col gap-3 pt-1">
          <p className="text-xs text-ink-muted">Imprimí o compartí este QR. Tus clientes llegan directo a tu página de talleres.</p>

          {logoUrl && (
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={useLogo}
                onChange={e => setUseLogo(e.target.checked)}
                className="w-4 h-4 accent-primary"
              />
              <span className="text-xs text-ink">Mostrar logo en el centro</span>
            </label>
          )}

          <button
            type="button"
            onClick={handleDownload}
            className="self-start px-4 py-2 text-sm font-medium bg-primary text-white rounded-md hover:bg-primary-strong transition-colors"
          >
            Descargar QR
          </button>

          {!logoUrl && (
            <p className="text-xs text-ink-muted">
              Subí tu logo en la pestaña <strong>Identidad</strong> para centrarlo en el QR.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Tab: Mi espacio ───────────────────────────────────────────────────────────

const EMPTY_DIR = { barrio: '', calle: '', altura: '', piso: '', apto: '' };

function normalize(s) { return (s ?? '').toLowerCase().trim().replace(/\s+/g, ' '); }

// ── Redes Sociales ────────────────────────────────────────────────────────────

function RedesSocialesSection({ espacio, livePalette, links, setLinks, style, setStyle, minimalColor, setMinimalColor, visible, setVisible }) {
  // Preferir la paleta live (estado del formulario) sobre la guardada en DB
  const palette = (() => {
    if (livePalette && livePalette.length > 0) return livePalette.filter(c => isValidColor(c));
    const bc = espacio.brandColors;
    if (!bc) return [];
    const arr = Array.isArray(bc) ? bc : (bc.palette ?? []);
    return arr.filter(c => isValidColor(c));
  })();

  // Si el color minimal no está elegido, usamos el primero de la paleta o primary
  const effectiveMinimalColor = minimalColor || palette[0] || '#E85D4A';

  const iconColor = (net) => style === 'brand' ? net.color : effectiveMinimalColor;

  return (
    <div className="border-t border-border pt-6">
      <h3 className="text-sm font-semibold text-ink mb-0.5">Redes Sociales</h3>
      <p className="text-xs text-ink-muted mb-5">Aparecen en el footer de tu página pública. Marcá las que querés mostrar (deben tener URL).</p>

      {/* Selector de estilo */}
      <div className="flex gap-2 mb-5">
        {[
          { v: 'brand',   label: 'Colores de la red' },
          { v: 'minimal', label: 'Minimalista'       },
        ].map(({ v, label }) => (
          <button
            key={v} type="button"
            onClick={() => setStyle(v)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md border transition-colors ${
              style === v
                ? 'border-primary bg-primary/8 text-primary'
                : 'border-border text-ink-muted hover:border-primary/40 bg-surface-100'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Picker de color para modo minimal */}
      {style === 'minimal' && (
        <div className="mb-5">
          <p className="text-xs text-ink-muted mb-2">Color de los íconos</p>
          {palette.length > 0 ? (
            <div className="flex flex-wrap gap-2 items-center">
              {palette.map((c, i) => (
                <button
                  key={i} type="button"
                  onClick={() => setMinimalColor(c)}
                  title={c}
                  className="w-7 h-7 rounded-md border-2 transition-all"
                  style={{
                    backgroundColor: c,
                    borderColor: effectiveMinimalColor === c ? '#1A1611' : 'transparent',
                    transform: effectiveMinimalColor === c ? 'scale(1.15)' : 'none',
                  }}
                />
              ))}
              <span className="text-xs font-mono text-ink-muted ml-1">{effectiveMinimalColor}</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={effectiveMinimalColor}
                onChange={e => setMinimalColor(e.target.value)}
                className="w-8 h-8 rounded cursor-pointer border border-border"
              />
              <span className="text-xs text-ink-muted">
                Definí tu paleta en <strong>Identidad</strong> para elegir desde ahí.
              </span>
            </div>
          )}
        </div>
      )}

      {/* Inputs por red social */}
      <div className="flex flex-col gap-3 mb-5">
        {SOCIAL_NETWORKS.map(net => {
          const isWa = net.key === 'whatsapp';
          const val  = links[net.key] ?? '';
          return (
            <div key={net.key} className="flex flex-col gap-1">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={visible[net.key] !== false}
                  onChange={e => setVisible(p => ({ ...p, [net.key]: e.target.checked }))}
                  className="w-4 h-4 accent-primary cursor-pointer shrink-0"
                  title="Mostrar en footer"
                />
                <div className="w-7 flex justify-center shrink-0">
                  <SocialIcon id={net.key} color={iconColor(net)} size={20} />
                </div>
                <span className="w-20 text-xs font-medium text-ink shrink-0">{net.label}</span>
                <input
                  type={isWa ? 'text' : 'url'}
                  value={val}
                  onChange={e => setLinks(p => ({ ...p, [net.key]: e.target.value }))}
                  onBlur={isWa ? () => {
                    if (val && looksLikePhone(val)) {
                      setLinks(p => ({ ...p, whatsapp: phoneToWaLink(val) }));
                    }
                  } : undefined}
                  placeholder={isWa ? '+54 9 11 1234-5678 o wa.me/549...' : net.placeholder}
                  className={INPUT_CLS + ' text-xs'}
                />
              </div>
              {isWa && val && looksLikePhone(val) && (
                <p className="text-[10px] text-ink-muted pl-[calc(1rem+1.75rem+5rem+0.75rem)]">
                  Se convertirá en <span className="font-mono text-primary">wa.me/{val.replace(/[^\d]/g, '')}</span> al guardar
                </p>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
}

function TabEspacio({ espacio, refresh }) {
  const [nombre, setNombre]                = useState(espacio.nombre ?? '');
  const [selectedRubro, setSelectedRubro]  = useState(espacio.rubroPersonalizado ?? '');
  const [saving, setSaving]                = useState(false);
  const [saved, setSaved]                  = useState(false);
  const [error, setError]                  = useState('');
  const [rubros, setRubros]                = useState(RUBROS);

  useEffect(() => { fetchRubros().then(setRubros); }, []);

  // ── Eliminar espacio ─────────────────────────────────────────────────────────
  const [delPhase,    setDelPhase]    = useState(null); // null | 'warn' | 'confirm'
  const [delReservas, setDelReservas] = useState(0);
  const [delLoading,  setDelLoading]  = useState(false);
  const [delError,    setDelError]    = useState('');

  async function handleOpenDelete() {
    setDelError(''); setDelLoading(true);
    try {
      const todas = await reservasApi.listByEspacio(espacio.id);
      const activas = todas.filter(r => r.estado !== 'CANCELADA').length;
      setDelReservas(activas);
      setDelPhase(activas > 0 ? 'warn' : 'confirm');
    } catch { setDelPhase('confirm'); }
    finally { setDelLoading(false); }
  }

  async function handleConfirmDelete() {
    setDelLoading(true); setDelError('');
    try {
      await espacioApi.eliminar(espacio.id);
      await refresh();
    } catch (e) { setDelError(e.message || 'Ocurrió un error.'); setDelLoading(false); }
  }

  // ── Direcciones ──────────────────────────────────────────────────────────────
  const [direcciones, setDirecciones] = useState(espacio.direcciones ?? []);
  const [showAddDir,  setShowAddDir]  = useState(false);
  const [newDir,      setNewDir]      = useState(EMPTY_DIR);
  const [dirError,    setDirError]    = useState('');
  const [dirSaving,   setDirSaving]   = useState(false);
  // Paso 2: asignar nombre
  const [pendingDir,  setPendingDir]  = useState(null); // dirección validada esperando nombre
  const [dirNombre,   setDirNombre]   = useState('');

  async function handleSave(e) {
    e.preventDefault();
    if (!nombre.trim()) { setError('El nombre es requerido.'); return; }
    setSaving(true); setError(''); setSaved(false);
    try {
      await espacioApi.update(espacio.id, {
        nombre: nombre.trim(),
        rubroId: null,
        rubroPersonalizado: selectedRubro || null,
      });
      await refresh();
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (e) {
      setError(e.message || 'Error al guardar.');
    } finally {
      setSaving(false);
    }
  }

  function setDir(field, val) { setNewDir(p => ({ ...p, [field]: val })); setDirError(''); }

  async function handleValidateDir() {
    const { barrio, calle, altura } = newDir;
    if (!barrio.trim() || !calle.trim() || !altura.trim()) {
      setDirError('Barrio, calle y altura son obligatorios');
      return;
    }
    const isDuplicate = direcciones.some(d =>
      normalize(d.barrio) === normalize(barrio) &&
      normalize(d.calle)  === normalize(calle)  &&
      normalize(d.altura) === normalize(altura)
    );
    if (isDuplicate) {
      await Swal.fire({
        toast: true, position: 'center', icon: 'warning',
        title: 'Esta dirección ya fue registrada',
        timer: 2500, showConfirmButton: false, width: '22rem',
      });
      return;
    }
    // Pasa al paso 2: pedir nombre
    setPendingDir({ ...newDir });
    setDirNombre(`Dirección ${direcciones.length + 1}`);
  }

  async function handleConfirmDir() {
    const entry = {
      id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).slice(2),
      nombre: dirNombre.trim() || `Dirección ${direcciones.length + 1}`,
      barrio: pendingDir.barrio.trim(), calle: pendingDir.calle.trim(), altura: pendingDir.altura.trim(),
      piso: pendingDir.piso.trim(), apto: pendingDir.apto.trim(),
    };
    const updated = [...direcciones, entry];
    setDirSaving(true);
    try {
      await espacioApi.update(espacio.id, { direcciones: updated });
      setDirecciones(updated);
      setNewDir(EMPTY_DIR);
      setPendingDir(null);
      setDirNombre('');
      setShowAddDir(false);
      await refresh();
    } catch(e) {
      setDirError(e.message || 'Error al guardar la dirección.');
    } finally { setDirSaving(false); }
  }

  function cancelAddDir() {
    setShowAddDir(false); setNewDir(EMPTY_DIR);
    setPendingDir(null); setDirNombre(''); setDirError('');
  }

  async function handleRemoveDir(id) {
    const updated = direcciones.filter(d => d.id !== id);
    setDirecciones(updated);
    await espacioApi.update(espacio.id, { direcciones: updated });
    await refresh();
  }

  return (
    <div className="flex flex-col gap-8 max-w-3xl">
      {/* ── Fila superior: QR + Datos ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        {/* Columna izquierda: Datos del espacio */}
        <form onSubmit={handleSave} className="flex flex-col gap-5">
          <div>
            <h3 className="text-sm font-semibold text-ink mb-3">Datos del espacio</h3>
            <label className={LABEL_CLS}>Nombre del espacio *</label>
            <input type="text" value={nombre} onChange={e => setNombre(e.target.value)} className={INPUT_CLS} placeholder="Ej: Estudio Coral" />
          </div>
          <div>
            <label className={LABEL_CLS}>Rubro</label>
            <select value={selectedRubro} onChange={e => setSelectedRubro(e.target.value)} className={INPUT_CLS}>
              <option value="">Seleccioná un rubro…</option>
              {rubros.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          {error && <p className="text-xs text-danger">{error}</p>}
          <div className="flex items-center gap-3">
            <button type="submit" disabled={saving}
              className="px-5 py-2 bg-primary text-white rounded-md text-sm font-semibold hover:bg-primary-strong transition-colors disabled:opacity-50">
              {saving ? 'Guardando…' : 'Guardar cambios'}
            </button>
            {saved && <span className="text-xs text-green-600 font-medium">¡Guardado!</span>}
          </div>
        </form>

        {/* Columna derecha: Compartir */}
        <CompartirEspacio espacio={espacio} refresh={refresh} />
      </div>

      {/* ── Direcciones ── */}
      <div>
        <div className="border-t border-border pt-6">
          <h3 className="text-sm font-semibold text-ink mb-1">Direcciones</h3>
          <p className="text-xs text-ink-muted mb-4">Agregá las ubicaciones donde se realizan tus talleres.</p>

          {/* Lista de direcciones guardadas */}
          {direcciones.length > 0 && (
            <div className="flex flex-col gap-2 mb-4">
              {direcciones.map(d => (
                <div key={d.id} className="flex items-start justify-between gap-3 bg-surface-1 border border-border rounded-lg px-4 py-3">
                  <div>
                    <p className="text-xs font-semibold text-ink">{d.nombre}</p>
                    <p className="text-xs text-ink-muted mt-0.5">
                      {d.calle} {d.altura}{d.piso ? `, Piso ${d.piso}` : ''}{d.apto ? `, Apto ${d.apto}` : ''} — {d.barrio}
                    </p>
                  </div>
                  <button type="button" onClick={() => handleRemoveDir(d.id)}
                    className="text-ink-muted hover:text-danger transition-colors shrink-0 mt-0.5">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Formulario de nueva dirección */}
          {showAddDir ? (
            pendingDir ? (
              /* ── Paso 2: nombre identificador ── */
              <div className="border border-border rounded-xl p-4 flex flex-col gap-3 bg-surface-1">
                <div className="flex items-start gap-2 bg-[#F0EAE0] rounded-lg px-3 py-2.5">
                  <svg width="13" height="13" className="mt-0.5 shrink-0 text-ink-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                  </svg>
                  <p className="text-xs text-ink-muted">
                    {pendingDir.calle} {pendingDir.altura}{pendingDir.piso ? `, Piso ${pendingDir.piso}` : ''}{pendingDir.apto ? `, Apto ${pendingDir.apto}` : ''} — {pendingDir.barrio}
                  </p>
                </div>
                <div>
                  <label className={LABEL_CLS}>Usá un identificador para recordar esta dirección</label>
                  <input
                    type="text"
                    autoFocus
                    value={dirNombre}
                    onChange={e => setDirNombre(e.target.value)}
                    placeholder="Ej: Salón principal, Sede Norte, Estudio 2…"
                    className={INPUT_CLS}
                  />
                </div>
                {dirError && <p className="text-xs text-danger">{dirError}</p>}
                <div className="flex gap-2 pt-1">
                  <button type="button" onClick={handleConfirmDir} disabled={dirSaving}
                    className="px-4 py-2 bg-primary text-white rounded-md text-sm font-semibold hover:bg-primary-strong transition-colors disabled:opacity-50">
                    {dirSaving ? 'Guardando…' : 'Confirmar y guardar'}
                  </button>
                  <button type="button" onClick={cancelAddDir}
                    className="px-4 py-2 border border-border text-ink-muted rounded-md text-sm hover:text-ink transition-colors">
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              /* ── Paso 1: datos de la dirección ── */
              <div className="border border-border rounded-xl p-4 flex flex-col gap-3 bg-surface-1">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={LABEL_CLS}>Barrio *</label>
                    <input type="text" autoFocus value={newDir.barrio} onChange={e => setDir('barrio', e.target.value)}
                      placeholder="Palermo" className={INPUT_CLS} />
                  </div>
                  <div>
                    <label className={LABEL_CLS}>Calle *</label>
                    <input type="text" value={newDir.calle} onChange={e => setDir('calle', e.target.value)}
                      placeholder="Thames" className={INPUT_CLS} />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className={LABEL_CLS}>Altura *</label>
                    <input type="text" value={newDir.altura} onChange={e => setDir('altura', e.target.value)}
                      placeholder="1234" className={INPUT_CLS} />
                  </div>
                  <div>
                    <label className={LABEL_CLS}>Piso</label>
                    <input type="text" value={newDir.piso} onChange={e => setDir('piso', e.target.value)}
                      placeholder="3" className={INPUT_CLS} />
                  </div>
                  <div>
                    <label className={LABEL_CLS}>Apto</label>
                    <input type="text" value={newDir.apto} onChange={e => setDir('apto', e.target.value)}
                      placeholder="B" className={INPUT_CLS} />
                  </div>
                </div>
                {dirError && <p className="text-xs text-danger">{dirError}</p>}
                <div className="flex gap-2 pt-1">
                  <button type="button" onClick={handleValidateDir}
                    className="px-4 py-2 bg-primary text-white rounded-md text-sm font-semibold hover:bg-primary-strong transition-colors">
                    Guardar Dirección
                  </button>
                  <button type="button" onClick={cancelAddDir}
                    className="px-4 py-2 border border-border text-ink-muted rounded-md text-sm hover:text-ink transition-colors">
                    Cancelar
                  </button>
                </div>
              </div>
            )
          ) : (
            <button type="button" onClick={() => setShowAddDir(true)}
              className="flex items-center gap-2 text-sm text-primary font-semibold hover:text-primary-strong transition-colors">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Agregar Dirección
            </button>
          )}
        </div>
      </div>

      {/* ── Zona de peligro ── */}
      <div className="border border-danger/20 rounded-xl p-5 bg-danger/[0.03]">
        <h3 className="text-sm font-semibold text-danger mb-1">Zona de peligro</h3>
        <p className="text-xs text-ink-muted mb-4">
          Al eliminar este espacio se borrarán permanentemente todos sus talleres, reservas y configuración.
          Esta acción no se puede deshacer.
        </p>
        <button
          type="button"
          onClick={handleOpenDelete}
          disabled={delLoading}
          className="px-4 py-2 text-sm font-semibold text-danger border border-danger/30 rounded-lg hover:bg-danger hover:text-white transition-colors disabled:opacity-40"
        >
          {delLoading ? 'Verificando…' : 'Eliminar espacio'}
        </button>
      </div>

      {/* Modal eliminación */}
      {delPhase && (
        <EliminarEspacioModal
          espacio={espacio}
          reservasActivas={delReservas}
          phase={delPhase}
          loading={delLoading}
          error={delError}
          onContinuar={() => setDelPhase('confirm')}
          onConfirm={handleConfirmDelete}
          onClose={() => { setDelPhase(null); setDelError(''); }}
        />
      )}

    </div>
  );
}

// ── Tab: Identidad ────────────────────────────────────────────────────────────

function TabIdentidad({ espacio, refresh }) {
  const planNombre = espacio.plan?.nombre ?? '';
  const isEstudio  = planNombre === 'Estudio';

  const parseRedes = () => {
    const rs = espacio.redesSociales;
    const base = !rs
      ? { style: 'brand', minimalColor: '', links: {}, visible: {} }
      : { style: rs.style ?? 'brand', minimalColor: rs.minimalColor ?? '', links: rs.links ?? {}, visible: rs.visible ?? {} };
    // Auto-populate WhatsApp from espacio.telefono if the field is empty
    if (!base.links.whatsapp && espacio.telefono) {
      base.links = { ...base.links, whatsapp: phoneToWaLink(espacio.telefono) };
    }
    return base;
  };
  const initRedes = parseRedes();
  const [redesLinks,        setRedesLinks]        = useState(initRedes.links);
  const [redesStyle,        setRedesStyle]        = useState(initRedes.style);
  const [redesMinimalColor, setRedesMinimalColor] = useState(initRedes.minimalColor);
  const [redesVisible,      setRedesVisible]      = useState(initRedes.visible);

  const parseBrandColors = () => {
    const raw = espacio.brandColors;
    const emptyRoles = { primary: '', secondary: '', button: '', bg: '', card: '', textHeading: '', textCard: '' };
    if (!raw) return { palette: ['#E85D4A'], roles: emptyRoles };
    if (Array.isArray(raw)) return { palette: raw, roles: emptyRoles };
    return {
      palette: raw.palette ?? ['#E85D4A'],
      roles:   { ...emptyRoles, ...(raw.roles ?? {}) },
    };
  };

  const parsed = parseBrandColors();

  // Logo
  const [logoData,   setLogoData]  = useState(espacio.logoUrl   ?? '');
  const [logoShape,  setLogoShape] = useState(espacio.logoShape  ?? 'rounded');
  const [logoScale,  setLogoScale] = useState(espacio.logoScale  ?? 1);
  const [removingBg, setRemovingBg] = useState(false);
  const [bgError,    setBgError]   = useState('');
  const logoInputRef    = useRef(null);
  const logoImgRef      = useRef(null);
  const addColorInputRef = useRef(null);

  // Palette
  const [colors,    setColors]    = useState(parsed.palette);
  const [hoveredChip, setHoveredChip] = useState(null);
  const swatchRefs = useRef({});

  // Roles
  const [roles, setRoles] = useState(parsed.roles);

  // Font pair
  const [fontPair, setFontPair] = useState(() =>
    FONT_PAIRS.find(p => p.key === espacio.brandFont) ?? null
  );

  // Save state
  const [saving, setSaving] = useState(false);
  const [saved,  setSaved]  = useState(false);
  const [error,  setError]  = useState('');

  const validPalette = colors.filter(c => isValidColor(c));

  // Inject Google Fonts once
  useEffect(() => {
    if (document.querySelector('#gf-identidad')) return;
    const link = document.createElement('link');
    link.id  = 'gf-identidad';
    link.rel = 'stylesheet';
    link.href = GOOGLE_FONTS_URL;
    document.head.appendChild(link);
  }, []);

  // ── Logo ──────────────────────────────────────────────────────────────────
  const extractOnLoad = useRef(false);

  function triggerExtract() {
    const img = logoImgRef.current;
    if (!img) return;
    const extracted = extractDominantColors(img, 6);
    if (extracted.length) setColors(extracted);
  }

  async function handleLogoFile(file) {
    if (!file?.type.startsWith('image/')) return;
    extractOnLoad.current = true;
    setLogoData(await compressImage(file, 480));
    setBgError('');
  }

  async function handleRemoveBg() {
    if (!logoData) return;
    setRemovingBg(true); setBgError('');
    try {
      const { removeBackground } = await import('@imgly/background-removal');
      const blob   = await (await fetch(logoData)).blob();
      const result = await removeBackground(blob);
      const base64 = await new Promise(res => {
        const reader = new FileReader();
        reader.onload = e => res(e.target.result);
        reader.readAsDataURL(result);
      });
      extractOnLoad.current = true;
      setLogoData(base64);
    } catch (e) {
      setBgError('No se pudo quitar el fondo. Probá con otra imagen.');
      console.error(e);
    } finally {
      setRemovingBg(false);
    }
  }

  // ── Colors ────────────────────────────────────────────────────────────────
  const addColorRef = useCallback((el) => {
    addColorInputRef.current = el;
    if (!el) return;
    el.addEventListener('change', (e) => {
      setColors(p => p.length < 8 ? [...p, e.target.value] : p);
    });
  }, []);

  function addColor()       { if (colors.length < 8) addColorInputRef.current?.click(); }
  function removeColor(i)   { setColors(p => p.filter((_, idx) => idx !== i)); }
  function updateColor(i,v) { setColors(p => p.map((c, idx) => idx === i ? v : c)); }


  // ── Save ──────────────────────────────────────────────────────────────────
  async function handleSave(e) {
    e?.preventDefault();
    setSaving(true); setError(''); setSaved(false);
    const validColors = colors.filter(c => isValidColor(c));
    try {
      await espacioApi.updateIdentidad(espacio.id, {
        logoUrl:     logoData || null,
        logoShape,
        logoScale,
        brandColors: { palette: validColors, roles },
        brandFont:   fontPair?.key ?? null,
      });
      const cleanLinks = Object.fromEntries(
        Object.entries(redesLinks).filter(([, v]) => v?.trim())
      );
      const effectiveMinColor = redesMinimalColor || validColors[0] || '#E85D4A';
      await espacioApi.updateRedes(espacio.id, {
        style: redesStyle,
        minimalColor: redesStyle === 'minimal' ? effectiveMinColor : null,
        links: cleanLinks,
        visible: redesVisible,
      });
      await refresh();
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setError(err.message || 'Error al guardar.');
    } finally {
      setSaving(false);
    }
  }

  const shapeCls       = SHAPES.find(s => s.key === logoShape)?.cls ?? 'rounded-2xl';
  const effectivePrimary  = isValidColor(roles.primary) ? roles.primary : validPalette[0] ?? '#E85D4A';
  const selectedFontColor = complementaryColor(effectivePrimary);

  return (
    <>
    <form onSubmit={handleSave} className="flex flex-col gap-6" id="form-identidad">
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_280px] gap-8 items-start">

        {/* ── Left: config ────────────────────────────────────────────── */}
        <div className="flex flex-col gap-7 max-w-lg">

          {/* Logo */}
          <section className="flex flex-col gap-4">
            <div>
              <h3 className="text-sm font-semibold text-ink mb-0.5">Logo</h3>
              <p className="text-xs text-ink-muted">Se comprime automáticamente al subir.</p>
            </div>
            <div className="flex items-start gap-5">
              <button type="button" onClick={() => logoInputRef.current?.click()}
                className={`w-24 h-24 flex items-center justify-center overflow-hidden shrink-0 transition-colors cursor-pointer ${shapeCls} ${
                  logoShape === 'square' && logoData
                    ? 'bg-transparent'
                    : 'bg-surface-200 border-2 border-dashed border-border hover:border-primary/50'
                }`}>
                {logoData
                  ? <img ref={logoImgRef} src={logoData} alt="Logo" className="w-full h-full object-contain" crossOrigin="anonymous"
                      style={{ transform: `scale(${logoScale})`, transformOrigin: 'center', transition: 'transform 0.1s' }}
                      onLoad={() => { if (extractOnLoad.current) { extractOnLoad.current = false; triggerExtract(); } }} />
                  : <span className="font-display text-3xl text-ink-muted/40 select-none">A</span>}
              </button>
              <div className="flex flex-col gap-2 flex-1">
                <div>
                  <p className="text-xs text-ink-muted mb-1.5">Marco</p>
                  <div className="flex gap-2">
                    {SHAPES.map(s => (
                      <button key={s.key} type="button" onClick={() => setLogoShape(s.key)}
                        className={`px-3 py-1.5 text-xs font-medium rounded-md border transition-colors ${logoShape === s.key ? 'border-primary bg-primary/5 text-primary' : 'border-border text-ink-muted hover:border-primary/40 bg-surface-100'}`}>
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>
                {logoData && (
                  <div>
                    <p className="text-xs text-ink-muted mb-1.5">Tamaño <span className="font-mono text-ink ml-1">{Math.round(logoScale * 100)}%</span></p>
                    <input
                      type="range" min="0.4" max="2" step="0.05"
                      value={logoScale}
                      onChange={e => setLogoScale(parseFloat(e.target.value))}
                      className="w-full accent-primary"
                    />
                  </div>
                )}
                <div className="flex flex-wrap gap-2 mt-1">
                  <button type="button" onClick={() => logoInputRef.current?.click()}
                    className="px-3 py-1.5 text-xs font-medium border border-border rounded-md bg-surface-100 text-ink hover:bg-surface-200 transition-colors">
                    {logoData ? 'Cambiar' : 'Subir logo'}
                  </button>
                  {logoData && !removingBg && (
                    <button type="button" onClick={handleRemoveBg}
                      className="px-3 py-1.5 text-xs font-medium border border-border rounded-md bg-surface-100 text-ink hover:bg-surface-200 transition-colors">
                      ✨ Quitar fondo
                    </button>
                  )}
                  {removingBg && (
                    <span className="px-3 py-1.5 text-xs text-ink-muted border border-border rounded-md bg-surface-100 flex items-center gap-1.5">
                      <span className="inline-block w-3 h-3 border-2 border-ink-muted/30 border-t-ink-muted rounded-full animate-spin" />
                      Procesando IA…
                    </span>
                  )}
                  {logoData && (
                    <button type="button" onClick={() => { setLogoData(''); setBgError(''); }}
                      className="px-3 py-1.5 text-xs font-medium border border-danger/30 rounded-md bg-surface-100 text-danger hover:bg-danger/5 transition-colors">
                      Quitar logo
                    </button>
                  )}
                </div>
                {bgError && <p className="text-xs text-danger">{bgError}</p>}
              </div>
            </div>
            <input ref={logoInputRef} type="file" accept="image/*" className="hidden"
              onChange={e => { const f = e.target.files?.[0]; if (f) handleLogoFile(f); e.target.value = ''; }} />
          </section>

          {/* Paleta de marca */}
          <section className="flex flex-col gap-3">
            <div className="flex items-end justify-between">
              <div>
                <h3 className="text-sm font-semibold text-ink mb-0.5">Paleta de marca</h3>
                <p className="text-xs text-ink-muted">Aparecen primero al elegir color de encabezado de talleres.</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))' }}>
              {colors.map((color, i) => {
                const valid   = isValidColor(color) ? color : '#cccccc';
                const rgb     = hexToRgb(valid);
                const on      = contrastOnColor(valid);
                const text    = on === 'dark' ? 'rgba(26,22,17,0.95)' : 'rgba(255,255,255,0.95)';
                const muted   = on === 'dark' ? 'rgba(26,22,17,0.50)' : 'rgba(255,255,255,0.55)';
                const btnBg   = on === 'dark' ? 'rgba(0,0,0,0.10)' : 'rgba(255,255,255,0.18)';
                return (
                  <div key={i} className="relative rounded-xl overflow-hidden" style={{ backgroundColor: valid }}>
                    {colors.length > 1 && (
                      <button type="button" onClick={() => removeColor(i)}
                        className="absolute top-1.5 right-1.5 w-5 h-5 flex items-center justify-center rounded-full transition-colors"
                        style={{ backgroundColor: btnBg }}
                        title="Eliminar">
                        <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke={text} strokeWidth="3" strokeLinecap="round">
                          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                      </button>
                    )}
                    <button type="button" onClick={() => swatchRefs.current[i]?.click()}
                      className="w-full p-3 pt-4 text-left">
                      <p className="text-[10px] font-semibold uppercase tracking-widest mb-0.5" style={{ color: muted }}>HEX</p>
                      <p className="text-sm font-mono font-bold mb-2.5 leading-none" style={{ color: text }}>{valid}</p>
                      <p className="text-[10px] font-semibold uppercase tracking-widest mb-0.5" style={{ color: muted }}>CSS</p>
                      <p className="text-xs font-mono leading-tight" style={{ color: text }}>
                        {rgb ? `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` : '—'}
                      </p>
                    </button>
                    <input ref={el => swatchRefs.current[i] = el} type="color"
                      value={valid} onChange={e => updateColor(i, e.target.value)} className="sr-only" />
                  </div>
                );
              })}
              {colors.length < 8 && (
                <>
                  <input
                    ref={addColorRef}
                    type="color"
                    defaultValue="#E85D4A"
                    className="sr-only"
                  />
                  <button type="button" onClick={addColor}
                    className="rounded-xl border-2 border-dashed border-border text-ink-muted hover:border-primary/40 hover:text-primary transition-colors flex flex-col items-center justify-center gap-1 min-h-[100px]">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                    </svg>
                    <span className="text-[11px] font-medium">Agregar</span>
                  </button>
                </>
              )}
            </div>
          </section>

          {/* Roles de color */}
          {validPalette.length > 0 && (
            <section className="flex flex-col gap-3">
              <div>
                <h3 className="text-sm font-semibold text-ink mb-0.5">Roles de color</h3>
                <p className="text-xs text-ink-muted">¿Qué hace cada color de tu paleta? Asignalo a cada función.</p>
              </div>
              <div className="flex flex-col divide-y divide-border border border-border rounded-xl overflow-hidden bg-surface-100">
                {COLOR_ROLES.map((role) => (
                  <div key={role.key} className="flex items-center gap-3 px-4 py-2.5">
                    <span className="w-[7.5rem] shrink-0 text-xs font-medium text-ink" title={role.hint}>{role.label}</span>
                    <div className="flex items-center gap-1.5 flex-1 flex-wrap">
                      {validPalette.map((c, i) => {
                        const chipId   = `${role.key}-${i}`;
                        const selected = roles[role.key] === c;
                        const hovered  = hoveredChip === chipId && !selected;
                        return (
                          <button key={i} type="button"
                            onClick={() => setRoles(r => ({ ...r, [role.key]: c }))}
                            title={c}
                            className="w-6 h-6 rounded-full border-2 transition-all"
                            style={{
                              backgroundColor: c,
                              borderColor: selected ? '#1A1611' : 'rgba(0,0,0,0.18)',
                              transform: selected ? 'scale(1.18)' : hovered ? 'scale(1.12)' : 'scale(1)',
                              boxShadow: selected ? '0 0 0 2px rgba(0,0,0,0.12)' : 'none',
                            }}
                            onMouseEnter={() => { if (!selected) setHoveredChip(chipId); }}
                            onMouseLeave={() => setHoveredChip(null)}
                          />
                        );
                      })}
                      {!roles[role.key] && (
                        <span className="text-xs text-ink-muted italic opacity-50">sin asignar</span>
                      )}
                    </div>
                    {roles[role.key] && (
                      <button type="button" onClick={() => setRoles(r => ({ ...r, [role.key]: '' }))}
                        className="text-ink-muted hover:text-danger transition-colors shrink-0 leading-none" title="Quitar">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Tipografía */}
          <section className="flex flex-col gap-3">
            <div>
              <h3 className="text-sm font-semibold text-ink mb-0.5">Tipografía</h3>
              <p className="text-xs text-ink-muted">Par de fuentes (display + cuerpo) para tu página pública.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {FONT_PAIRS.map(pair => {
                const locked   = pair.pro && !isEstudio;
                const selected = fontPair?.key === pair.key;
                return (
                  <button key={pair.key} type="button" disabled={locked}
                    onClick={() => !locked && setFontPair(pair)}
                    className={`relative text-left px-4 py-3 rounded-xl border-2 transition-all ${locked ? 'border-border bg-surface-100 cursor-not-allowed opacity-55' : selected ? 'bg-surface-100' : 'border-border bg-surface-100 hover:border-primary/40'}`}
                    style={selected && !locked ? { borderColor: selectedFontColor } : {}}>
                    <p className="font-bold leading-tight" style={{ fontFamily: `'${pair.display}', serif`, fontSize: '1.1rem', color: selected ? selectedFontColor : '#2B241A' }}>
                      {pair.display}
                    </p>
                    <p className="text-xs mt-0.5 mb-1" style={{ fontFamily: `'${pair.body}', sans-serif`, color: selected ? selectedFontColor + 'bb' : '#6B5F4C' }}>
                      + {pair.body} · {pair.desc}
                    </p>
                    {locked && (
                      <span className="absolute top-2 right-2 text-[10px] bg-amber-100 text-amber-700 border border-amber-200 px-1.5 py-0.5 rounded font-medium">
                        Plan Estudio
                      </span>
                    )}
                    {selected && !locked && (
                      <span className="absolute top-2 right-2 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                        <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            {!isEstudio && (
              <p className="text-xs text-ink-muted bg-surface-100 border border-border rounded-lg px-3 py-2">
                Las fuentes marcadas con <strong>Plan Estudio</strong> se desbloquean al cambiar de plan en la pestaña Suscripción.
              </p>
            )}
          </section>
        </div>

        {/* ── Right: preview — sticky, desktop only ───────────────────── */}
        <div className="hidden xl:flex flex-col gap-3 sticky top-14 self-start">
          <p className="text-[11px] font-semibold text-ink-muted uppercase tracking-wide">Vista previa · Página pública</p>
          <BrandPreview
            palette={validPalette}
            roles={roles}
            fontPair={fontPair}
            logoData={logoData}
            logoShape={logoShape}
            logoScale={logoScale}
            espacioName={espacio.nombre}
          />

        </div>
      </div>

    </form>

    <div className="mt-2">
      <RedesSocialesSection
        espacio={espacio}
        livePalette={colors}
        links={redesLinks}        setLinks={setRedesLinks}
        style={redesStyle}        setStyle={setRedesStyle}
        minimalColor={redesMinimalColor} setMinimalColor={setRedesMinimalColor}
        visible={redesVisible}    setVisible={setRedesVisible}
      />
    </div>

    {error && <p className="text-xs text-danger mt-4">{error}</p>}

    <div className="flex items-center gap-3 py-6">
      <button
        type="submit"
        form="form-identidad"
        disabled={saving || removingBg}
        className="px-5 py-2 bg-primary text-white rounded-md text-sm font-semibold hover:bg-primary-strong transition-colors disabled:opacity-50"
      >
        {saving ? 'Guardando…' : 'Guardar identidad'}
      </button>
      {saved && <span className="text-xs text-green-600 font-medium">¡Guardado!</span>}
    </div>
    </>
  );
}

// ── Tab: Términos y condiciones ───────────────────────────────────────────────

function TabTerminos({ espacio, refresh }) {
  const [tycHtml, setTycHtml]       = useState(espacio.terminosCondiciones ?? '');
  const [tycEnabled, setTycEnabled] = useState(espacio.tycEnabled ?? false);
  const [saving, setSaving]         = useState(false);
  const [saved, setSaved]           = useState(false);
  const [RichEditor, setRichEditor] = useState(null);

  useEffect(() => {
    import('../components/RichTextEditor').then(m => setRichEditor(() => m.default));
  }, []);

  async function handleSave() {
    setSaving(true); setSaved(false);
    try {
      await espacioApi.update(espacio.id, {
        terminosCondiciones: tycHtml || null,
        tycEnabled,
      });
      await refresh();
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      // silently fail
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="bg-surface-0 rounded-2xl border border-border p-6 space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-ink mb-1">Tus términos y condiciones</h3>
        <p className="text-xs text-ink-muted mb-4">
          Redactá los términos y condiciones que aplican a tus talleres. Podés incluir políticas de cancelación, reembolsos, requisitos, etc.
        </p>

        {RichEditor ? (
          <RichEditor
            content={tycHtml}
            onChange={setTycHtml}
            placeholder="Escribí tus términos y condiciones..."
          />
        ) : (
          <div className="border border-border rounded-xl p-8 flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

      {/* Toggle para activar */}
      <div className="flex items-start gap-3 p-4 bg-surface-50 rounded-xl border border-border">
        <button
          type="button"
          role="switch"
          aria-checked={tycEnabled}
          onClick={() => setTycEnabled(!tycEnabled)}
          className={`relative flex-shrink-0 mt-0.5 w-10 h-6 rounded-full transition-colors ${tycEnabled ? 'bg-primary' : 'bg-border'}`}
        >
          <span className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${tycEnabled ? 'translate-x-4' : ''}`} />
        </button>
        <div>
          <p className="text-sm font-medium text-ink">
            {tycEnabled ? 'Tus clientes deberán leer y aceptar antes de reservar' : 'Tus T&C no se muestran al reservar'}
          </p>
          <p className="text-xs text-ink-muted mt-0.5">
            {tycEnabled
              ? 'Tus términos y condiciones aparecerán como un checkbox obligatorio en todos tus talleres.'
              : 'Activá esta opción para que tus clientes lean y acepten tus términos antes de confirmar una reserva.'}
          </p>
        </div>
      </div>

      {/* Guardar */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="px-5 py-2 bg-primary text-white rounded-md text-sm font-semibold hover:bg-primary-strong transition-colors disabled:opacity-50"
        >
          {saving ? 'Guardando...' : 'Guardar'}
        </button>
        {saved && <span className="text-xs text-green-600 font-medium">Guardado</span>}
      </div>
    </div>
  );
}

// ── Tab: Mis Cobros ───────────────────────────────────────────────────────────

function Toggle({ checked, onChange, disabled }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => !disabled && onChange(!checked)}
      disabled={disabled}
      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 transition-colors duration-200 focus:outline-none disabled:opacity-40 ${
        checked ? 'bg-primary border-primary' : 'bg-surface-200 border-surface-200'
      }`}
    >
      <span className={`pointer-events-none inline-block h-4 w-4 rounded-full bg-surface-100 shadow-sm transform transition-transform duration-200 ${
        checked ? 'translate-x-4' : 'translate-x-0'
      }`} />
    </button>
  );
}

function TabCobros({ espacio, refresh }) {
  const parseCobros = () => {
    const c = espacio.cobros;
    if (!c) return { efectivo: true, mercadoPago: false, linksDePago: false, links: [], horasCancelacion: 24 };
    return {
      efectivo:         c.efectivo         ?? true,
      mercadoPago:      c.mercadoPago      ?? false,
      linksDePago:      c.linksDePago      ?? false,
      links:            c.links            ?? [],
      horasCancelacion: c.horasCancelacion ?? 24,
    };
  };

  const init = parseCobros();
  const [efectivo,    setEfectivo]    = useState(init.efectivo);
  const [mercadoPago, setMercadoPago] = useState(init.mercadoPago);
  const [linksDePago, setLinksDePago] = useState(init.linksDePago);
  const [links,              setLinks]              = useState(init.links);
  const [horasCancelacion,   setHorasCancelacion]   = useState(init.horasCancelacion);
  const [saving,             setSaving]             = useState(false);
  const [saved,       setSaved]       = useState(false);
  const [saveError,   setSaveError]   = useState('');

  // MP connection state
  const [mpConnected,     setMpConnected]     = useState(null);
  const [mpDisconnecting, setMpDisconnecting] = useState(false);

  // New link form
  const [showAddLink, setShowAddLink] = useState(false);
  const [newLinkNombre, setNewLinkNombre] = useState('');
  const [newLinkUrl,    setNewLinkUrl]    = useState('');
  const [linkError,     setLinkError]     = useState('');

  useEffect(() => {
    // Handle OAuth redirect params
    const params = new URLSearchParams(window.location.search);
    const mpStatus = params.get('mp');
    if (mpStatus) {
      const url = new URL(window.location);
      url.searchParams.delete('mp');
      window.history.replaceState({}, '', url);
      if (mpStatus === 'connected') {
        setMpConnected(true);
        Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Mercado Pago conectado', timer: 3000, showConfirmButton: false });
      } else if (mpStatus === 'error') {
        const detail = params.get('detail');
        url.searchParams.delete('detail');
        window.history.replaceState({}, '', url);
        Swal.fire({ toast: true, position: 'top-end', icon: 'error', title: 'Error al conectar Mercado Pago', text: detail ? decodeURIComponent(detail) : 'Intentá de nuevo.', timer: 6000, showConfirmButton: false });
      }
    }
    fetch(`${MP_WORKER_URL}/tenant-mp-config?tenantId=${espacio.id}`)
      .then(r => r.json())
      .then(d => {
        setMpConnected(d.connected);
        if (!d.connected) setMercadoPago(false);
      })
      .catch(() => setMpConnected(false));
  }, [espacio.id]);

  async function handleSave(e) {
    e?.preventDefault();
    setSaving(true); setSaveError(''); setSaved(false);
    try {
      await espacioApi.updateCobros(espacio.id, { efectivo, mercadoPago, linksDePago, links, horasCancelacion });
      await refresh();
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setSaveError(err.message || 'Error al guardar.');
    } finally {
      setSaving(false);
    }
  }

  async function handleAddLink() {
    if (!newLinkNombre.trim()) { setLinkError('El nombre es obligatorio.'); return; }
    if (!newLinkUrl.trim())    { setLinkError('La URL es obligatoria.'); return; }
    let rawUrl = newLinkUrl.trim();
    if (!/^https?:\/\//i.test(rawUrl)) rawUrl = 'https://' + rawUrl;
    try { new URL(rawUrl); } catch { setLinkError('La URL no es válida.'); return; }
    setLinkError('');
    const entry = { id: crypto.randomUUID(), nombre: newLinkNombre.trim(), url: rawUrl };
    const updated = [...links, entry];
    setLinks(updated);
    setNewLinkNombre(''); setNewLinkUrl(''); setShowAddLink(false);
    await espacioApi.updateCobros(espacio.id, { efectivo, mercadoPago, linksDePago, links: updated, horasCancelacion });
    await refresh();
  }

  async function handleRemoveLink(id) {
    const updated = links.filter(l => l.id !== id);
    setLinks(updated);
    await espacioApi.updateCobros(espacio.id, { efectivo, mercadoPago, linksDePago, links: updated, horasCancelacion });
    await refresh();
  }

  async function handleMpDisconnect() {
    const result = await Swal.fire({
      title: '¿Desconectar Mercado Pago?',
      text: 'Los talleres que usen este método ya no podrán procesar pagos online hasta que vuelvas a conectar.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Desconectar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#DC2626',
    });
    if (!result.isConfirmed) return;
    setMpDisconnecting(true);
    try {
      await fetch(`${MP_WORKER_URL}/tenant-mp-disconnect`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tenantId: espacio.id }),
      });
      setMpConnected(false);
      setMercadoPago(false);
    } catch {
      Swal.fire({ toast: true, position: 'top-end', icon: 'error', title: 'Error al desconectar', timer: 3000, showConfirmButton: false });
    } finally {
      setMpDisconnecting(false);
    }
  }

  function handleMpToggle(val) {
    if (val && !mpConnected) {
      Swal.fire({
        title: 'Conectá tu cuenta de Mercado Pago',
        html: '<p style="color:#6B5F4C;font-size:14px;margin:0">Para habilitar cobros con Mercado Pago, primero necesitás conectar tu cuenta.</p>',
        iconHtml: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#E85D4A" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>',
        showCancelButton: true,
        confirmButtonText: 'Conectar ahora',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#E85D4A',
        cancelButtonColor: '#D2C4A8',
        customClass: {
          popup: 'swal-antologico',
          icon: 'swal-antologico-icon',
        },
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = `${MP_WORKER_URL}/oauth/connect?tenantId=${espacio.id}`;
        }
      });
      return;
    }
    setMercadoPago(val);
  }

  return (
    <div className="max-w-lg flex flex-col gap-5">
      <div>
        <p className="text-sm text-ink-muted">
          Habilitá los métodos de cobro que querés ofrecer a tus clientes. Podrás elegir cuáles aplican a cada taller al crearlo o editarlo.
        </p>
      </div>

      {/* ── Efectivo ── */}
      <div className={`border rounded-xl p-5 transition-colors ${efectivo ? 'border-primary/30 bg-primary/3' : 'border-border bg-surface-100'}`}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="text-ink-muted shrink-0">
                <rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2.5"/><path d="M6 12h.01M18 12h.01"/>
              </svg>
              <p className="text-sm font-semibold text-ink">Efectivo</p>
            </div>
            <p className="text-xs text-ink-muted">Los clientes reservan online y pagan al llegar al taller.</p>
          </div>
          <Toggle checked={efectivo} onChange={setEfectivo} />
        </div>
      </div>

      {/* ── Mercado Pago ── */}
      <div className={`border rounded-xl p-5 transition-colors ${mercadoPago ? 'border-primary/30 bg-primary/3' : 'border-border bg-surface-100'}`}>
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="text-ink-muted shrink-0">
                <rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/>
              </svg>
              <p className="text-sm font-semibold text-ink">Mercado Pago</p>
            </div>
            <p className="text-xs text-ink-muted">Cobros con tarjeta online. Requiere conectar tu cuenta de Mercado Pago.</p>
          </div>
          <Toggle checked={mercadoPago} onChange={handleMpToggle} />
        </div>

        <div className="border-t border-border/60 pt-4 mt-1">
            {mpConnected === null && <p className="text-xs text-ink-muted">Verificando conexión…</p>}
            {mpConnected === true && (
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
                <span className="text-xs text-green-700 font-medium">Cuenta conectada</span>
              </div>
            )}
            {mpConnected === false && (
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
                <span className="text-xs text-ink-muted">No conectado — los talleres con este método no aceptarán pagos online hasta que conectes tu cuenta</span>
              </div>
            )}
            <div className="flex flex-wrap gap-2">
              <a
                href={`${MP_WORKER_URL}/oauth/connect?tenantId=${espacio.id}`}
                className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold bg-[#009EE3] text-white rounded-md hover:bg-[#008CC9] transition-colors"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                </svg>
                {mpConnected ? 'Reconectar cuenta' : 'Conectar con Mercado Pago'}
              </a>
              {mpConnected && (
                <button
                  onClick={handleMpDisconnect}
                  disabled={mpDisconnecting}
                  className="px-3 py-1.5 text-xs font-medium text-danger border border-danger/30 rounded-md hover:bg-danger/5 transition-colors disabled:opacity-50"
                >
                  {mpDisconnecting ? 'Desconectando…' : 'Desconectar'}
                </button>
              )}
            </div>
        </div>
      </div>

      {/* ── Links de pago ── */}
      <div className={`border rounded-xl p-5 transition-colors ${linksDePago ? 'border-primary/30 bg-primary/3' : 'border-border bg-surface-100'}`}>
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="text-ink-muted shrink-0">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
              </svg>
              <p className="text-sm font-semibold text-ink">Links de pago</p>
            </div>
            <p className="text-xs text-ink-muted">Agregá links de pago de Mercado Pago, Cafecito, Uala u otros. Tus clientes son redirigidos al link al reservar.</p>
          </div>
          <Toggle checked={linksDePago} onChange={setLinksDePago} />
        </div>

        {linksDePago && (
          <div className="border-t border-border/60 pt-4 mt-1 flex flex-col gap-3">
            {links.length > 0 && (
              <div className="flex flex-col gap-2">
                {links.map(link => (
                  <div key={link.id} className="flex items-center gap-3 bg-surface-100 border border-border rounded-lg px-3 py-2.5">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-ink truncate">{link.nombre}</p>
                      <p className="text-[10px] text-ink-muted font-mono truncate">{link.url}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveLink(link.id)}
                      className="text-ink-muted hover:text-danger transition-colors shrink-0"
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}

            {showAddLink ? (
              <div className="bg-surface-100 border border-border rounded-xl p-4 flex flex-col gap-3">
                <div>
                  <label className={LABEL_CLS}>Nombre del link *</label>
                  <input
                    type="text"
                    autoFocus
                    value={newLinkNombre}
                    onChange={e => { setNewLinkNombre(e.target.value); setLinkError(''); }}
                    placeholder="Ej: Pago básico, Cuota mensual…"
                    className={INPUT_CLS}
                  />
                </div>
                <div>
                  <label className={LABEL_CLS}>URL del link *</label>
                  <input
                    type="url"
                    value={newLinkUrl}
                    onChange={e => { setNewLinkUrl(e.target.value); setLinkError(''); }}
                    placeholder="https://mpago.la/xxx"
                    className={INPUT_CLS}
                  />
                </div>
                {linkError && <p className="text-xs text-danger">{linkError}</p>}
                <div className="flex gap-2">
                  <button type="button" onClick={handleAddLink}
                    className="px-4 py-1.5 bg-primary text-white text-xs font-semibold rounded-md hover:bg-primary-strong transition-colors">
                    Agregar
                  </button>
                  <button type="button" onClick={() => { setShowAddLink(false); setNewLinkNombre(''); setNewLinkUrl(''); setLinkError(''); }}
                    className="px-4 py-1.5 border border-border text-ink-muted text-xs rounded-md hover:text-ink transition-colors">
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowAddLink(true)}
                className="flex items-center gap-2 text-sm text-primary font-semibold hover:text-primary-strong transition-colors self-start"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                Agregar link
              </button>
            )}
          </div>
        )}
      </div>

      {/* ── Política de cancelación ── */}
      <div className="border border-border rounded-xl p-5">
        <div className="flex items-center gap-2 mb-1">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="text-ink-muted shrink-0">
            <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
          </svg>
          <p className="text-sm font-semibold text-ink">Política de cancelación</p>
        </div>
        <p className="text-xs text-ink-muted mb-4">
          Cuántas horas antes del inicio del taller un usuario puede cancelar su reserva. Poné 0 para no permitir cancelaciones.
        </p>
        <div className="flex items-center gap-3">
          <input
            type="number"
            min="0"
            max="720"
            value={horasCancelacion}
            onChange={e => setHorasCancelacion(Math.max(0, parseInt(e.target.value) || 0))}
            className={INPUT_CLS + ' w-24 text-center font-mono'}
          />
          <span className="text-sm text-ink-muted">horas antes del inicio</span>
        </div>
        {horasCancelacion === 0 && (
          <p className="text-xs text-amber-600 mt-2 font-medium">Los usuarios no podrán cancelar sus reservas.</p>
        )}
      </div>

      {saveError && <p className="text-xs text-danger">{saveError}</p>}
      <div className="flex items-center gap-3 pt-2">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="px-5 py-2 bg-primary text-white rounded-md text-sm font-semibold hover:bg-primary-strong transition-colors disabled:opacity-50"
        >
          {saving ? 'Guardando…' : 'Guardar cambios'}
        </button>
        {saved && <span className="text-xs text-green-600 font-medium">¡Guardado!</span>}
      </div>
    </div>
  );
}

// ── Tab: Suscripción ──────────────────────────────────────────────────────────

function EspacioLogoThumb({ esp }) {
  if (esp.logoUrl) {
    return (
      <div className={`w-8 h-8 overflow-hidden shrink-0 ${
        esp.logoShape === 'round' ? 'rounded-full' : esp.logoShape === 'square' ? 'rounded-none' : 'rounded-lg'
      }`}>
        <img src={esp.logoUrl} alt={esp.nombre} className="w-full h-full object-contain" />
      </div>
    );
  }
  return (
    <div className="w-8 h-8 shrink-0 rounded-lg bg-surface-200 flex items-center justify-center">
      <IconAntologico size={20} />
    </div>
  );
}

function TabSuscripcion({ espacio, espacios, refresh }) {
  const { user } = useAuth();
  const planesDB = usePlanes();
  const [loading,      setLoading]      = useState(false);
  const [cancelOpen,   setCancelOpen]   = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [agregarOpen,  setAgregarOpen]  = useState(false);
  const [error,        setError]        = useState('');
  const [periodo,      setPeriodo]      = useState('mensual'); // para el selector de activación
  const [cuponInput,   setCuponInput]   = useState('');
  const [cuponValido,  setCuponValido]  = useState(null); // objeto cupón validado
  const [cuponError,   setCuponError]   = useState('');
  const [cuponLoading, setCuponLoading] = useState(false);

  const isSuperAdmin   = !!espacio.isSuperAdmin;
  const pendiente      = espacio.cancelacionPendiente;
  const isEstudio      = espacio.planId === 'estudio';

  // Trial activo: menos de 14 días desde trialStartedAt (o createdAt como fallback)
  const trialRef    = espacio.trialStartedAt ?? espacio.createdAt;
  const trialActivo = trialRef
    ? Math.floor((Date.now() - new Date(trialRef)) / 86_400_000) < 14
    : false;

  // Precio siempre desde demo_planes (fuente de verdad), con fallback al objeto guardado
  const planActivo      = planesDB?.find(p => p.id === espacio.planId) ?? espacio.plan ?? null;
  const periodoActivo   = espacio.periodoFacturacion ?? 'mensual';
  const otrosEspacios   = espacios.filter(e => e.id !== espacio.id);

  // Precio plano: espacios adicionales incluidos en el plan Estudio, sin recargo
  const precioBase   = precioConPeriodo(planActivo, periodoActivo);
  const totalMensual = precioBase;

  // Detecta cambio de precio por modificación del Super Admin
  const precioActualGuardado  = espacio.precioActual ?? precioBase;
  const nuevoPrecioCalculado  = precioConPeriodo(planActivo, periodoActivo);
  const hayCambioPrecio       = planActivo && precioActualGuardado !== nuevoPrecioCalculado;
  const fechaRenovacion       = espacio.proximaRenovacion
    ? new Date(espacio.proximaRenovacion)
    : proximaRenovacion(periodoActivo);

  async function handleValidarCupon() {
    const code = cuponInput.trim().toUpperCase();
    if (!code) return;
    setCuponLoading(true); setCuponError(''); setCuponValido(null);
    try {
      const snap = await getDoc(doc(firestore, 'demo_cupones', code));
      if (!snap.exists()) { setCuponError('Código inválido.'); return; }
      const c = snap.data();
      if (!c.activo) { setCuponError('Este cupón ya no está activo.'); return; }
      if (c.maxUsos && c.usosActuales >= c.maxUsos) { setCuponError('Este cupón alcanzó el límite de usos.'); return; }
      setCuponValido({ id: code, ...c });
    } catch { setCuponError('No se pudo validar el cupón.'); }
    finally { setCuponLoading(false); }
  }

  async function handleActivarPlan(plan) {
    setLoading(true); setError('');
    try {
      await espacioApi.updatePlan(espacio.id, plan.id, plan, periodo);
      if (cuponValido) {
        const vence = new Date();
        vence.setMonth(vence.getMonth() + cuponValido.duracionMeses);
        await espacioApi.update(espacio.id, {
          cuponAplicado: {
            codigo: cuponValido.codigo,
            descuento: cuponValido.descuento,
            duracionMeses: cuponValido.duracionMeses,
            venceCupon: vence.toISOString(),
          },
        });
        await updateDoc(doc(firestore, 'demo_cupones', cuponValido.id), { usosActuales: increment(1) });
        setCuponValido(null); setCuponInput('');
      }
      await refresh();
    } catch (e) { setError(e.message || 'Ocurrió un error.'); }
    finally { setLoading(false); }
  }

  async function handleCancelar() {
    setLoading(true); setError('');
    try {
      await espacioApi.solicitarCancelacion(espacio.id);
      await refresh();
      setCancelOpen(false);
    } catch (e) { setError(e.message || 'Ocurrió un error.'); }
    finally { setLoading(false); }
  }

  async function handleReactivar() {
    setLoading(true); setError('');
    try {
      await espacioApi.reactivarSuscripcion(espacio.id);
      await refresh();
    } catch (e) { setError(e.message || 'Ocurrió un error.'); }
    finally { setLoading(false); }
  }

  async function handleEliminarEspacio() {
    setLoading(true); setError('');
    try {
      await espacioApi.eliminar(deleteTarget.id);
      await refresh();
      setDeleteTarget(null);
    } catch (e) { setError(e.message || 'Ocurrió un error.'); }
    finally { setLoading(false); }
  }

  return (
    <div className="max-w-lg flex flex-col gap-6">

      {/* ── Banner Super Admin (sin cobro) ── */}
      {isSuperAdmin && (
        <div className="flex items-start gap-4 bg-[#B98527]/5 border border-[#B98527]/25 rounded-xl p-5">
          <div className="w-10 h-10 rounded-lg bg-[#B98527]/10 flex items-center justify-center shrink-0">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#B98527" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-ink mb-0.5">Espacio Super Admin</p>
            <p className="text-xs text-ink-muted leading-relaxed">
              Este espacio tiene el plan <strong className="text-ink">Estudio</strong> activado sin costo ni vencimiento.
              No requiere suscripción.
            </p>
          </div>
        </div>
      )}

      {/* ── Selector de plan (cuando no hay plan activo) ── */}
      {!isSuperAdmin && !planActivo && (
        <div className="bg-surface-100 border border-border rounded-xl p-5">
          <p className="text-xs text-ink-muted mb-0.5">Plan actual</p>
          <p className="text-xl font-display text-ink mb-1">Sin plan (modo prueba)</p>
          <p className="text-sm text-ink-muted mb-4">Elegí un plan y período de facturación.</p>

          {/* Toggle de período */}
          <div className="flex flex-col gap-2 mb-4">
            <div className="flex gap-1 p-1 bg-surface-200 rounded-lg w-fit">
              {[
                { id: 'mensual',    label: 'Mensual' },
                { id: 'trimestral', label: 'Trimestral' },
                { id: 'anual',      label: 'Anual' },
              ].map(op => (
                <button key={op.id} onClick={() => setPeriodo(op.id)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${periodo === op.id ? 'bg-surface-100 shadow-sm text-ink' : 'text-ink-muted hover:text-ink'}`}>
                  {op.label}
                  {op.id !== 'mensual' && (planesDB ?? [])[0] && (
                    <span className="ml-1 text-success font-semibold">
                      −{op.id === 'trimestral' ? ((planesDB ?? [])[0].descuentoTrimestral ?? 0) : ((planesDB ?? [])[0].descuentoAnual ?? 0)}%
                    </span>
                  )}
                </button>
              ))}
            </div>
            {periodo !== 'mensual' && (planesDB ?? []).length > 0 && (() => {
              const meses     = periodo === 'trimestral' ? 3 : 12;
              const maxAhorro = Math.max(...(planesDB ?? []).map(p => (p.precioMensual - precioConPeriodo(p, periodo)) * meses));
              const label     = periodo === 'trimestral' ? 'cada 3 meses' : 'por año';
              return (
                <p className="text-xs text-success font-medium">
                  ✓ Ahorrás hasta ${maxAhorro.toLocaleString('es-AR')} {label} comparado con el plan mensual
                </p>
              );
            })()}
          </div>

          <div className="flex flex-col gap-3">
            {(planesDB ?? []).map(plan => {
              const precioPlan = precioConPeriodo(plan, periodo);
              const dto    = periodo === 'trimestral' ? (plan.descuentoTrimestral ?? 0) : periodo === 'anual' ? (plan.descuentoAnual ?? 0) : 0;
              const meses  = periodo === 'trimestral' ? 3 : periodo === 'anual' ? 12 : 0;
              const ahorro = dto > 0 ? (plan.precioMensual - precioPlan) * meses : 0;
              return (
                <div key={plan.id} className={`flex items-center gap-4 p-4 rounded-lg border transition-colors ${plan.id === 'estudio' ? 'border-primary/40 bg-primary/5' : 'border-border bg-surface-100'}`}>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                      <p className="text-sm font-semibold text-ink">{plan.nombre}</p>
                      {plan.id === 'estudio' && <span className="text-xs px-1.5 py-0.5 bg-primary/10 text-primary rounded font-medium">Multi-espacio</span>}
                      {dto > 0 && <span className="text-xs px-1.5 py-0.5 bg-success/10 text-success rounded font-medium">−{dto}%</span>}
                    </div>
                    <ul className="flex flex-col gap-0.5 mt-1">
                      {(plan.features ?? []).slice(0, 3).map((f, i) => (
                        <li key={i} className="text-xs text-ink-muted flex items-center gap-1">
                          <span className="text-primary">✓</span> {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="shrink-0 text-right">
                    {cuponValido ? (
                      <>
                        <p className="font-mono text-xs line-through text-ink-muted">${precioPlan.toLocaleString('es-AR')}/mes</p>
                        <p className="font-mono text-sm font-semibold text-success">${Math.round(precioPlan * (1 - cuponValido.descuento / 100)).toLocaleString('es-AR')}/mes</p>
                        <p className="text-[10px] text-success">por {cuponValido.duracionMeses} {cuponValido.duracionMeses === 1 ? 'mes' : 'meses'}</p>
                      </>
                    ) : (
                      <>
                        <p className="font-mono text-sm font-semibold text-ink">${precioPlan.toLocaleString('es-AR')}/mes</p>
                        {ahorro > 0 && <p className="text-xs text-success font-medium">Ahorrás ${ahorro.toLocaleString('es-AR')}</p>}
                        {meses > 0 && <p className="text-xs text-ink-muted">${(precioPlan * meses).toLocaleString('es-AR')} c/{meses === 3 ? '3m' : 'año'}</p>}
                      </>
                    )}
                  </div>
                  <button
                    onClick={() => handleActivarPlan(plan)}
                    disabled={loading}
                    className="shrink-0 px-3 py-1.5 text-xs font-semibold bg-primary text-white rounded-md hover:bg-primary/90 disabled:opacity-50"
                  >
                    Activar
                  </button>
                </div>
              );
            })}
          </div>
          {error && <p className="mt-3 text-xs text-danger">{error}</p>}

          {/* Cupón */}
          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-xs font-medium text-ink-muted mb-2">¿Tenés un cupón de descuento?</p>
            <div className="flex gap-2">
              <input
                value={cuponInput}
                onChange={e => { setCuponInput(e.target.value.toUpperCase()); setCuponValido(null); setCuponError(''); }}
                onKeyDown={e => e.key === 'Enter' && handleValidarCupon()}
                placeholder="Ej: PROMO20"
                className="flex-1 px-3 py-2 bg-surface-100 border border-border rounded-md text-sm font-mono text-ink focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
              <button
                type="button"
                onClick={handleValidarCupon}
                disabled={!cuponInput.trim() || cuponLoading}
                className="px-3 py-2 text-xs font-semibold border border-border rounded-md hover:bg-surface-200 transition-colors disabled:opacity-40"
              >
                {cuponLoading ? '…' : 'Aplicar'}
              </button>
            </div>
            {cuponError && <p className="text-xs text-danger mt-1.5">{cuponError}</p>}
            {cuponValido && (
              <div className="flex items-center gap-2 mt-2 px-3 py-2 bg-success/5 border border-success/25 rounded-lg">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                <p className="text-xs text-success font-medium">
                  Cupón válido — {cuponValido.descuento}% de descuento por {cuponValido.duracionMeses} {cuponValido.duracionMeses === 1 ? 'mes' : 'meses'}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Resumen de facturación (cuando hay plan activo) ── */}
      {!isSuperAdmin && planActivo && (
      <div className="bg-surface-100 border border-border rounded-xl p-5">
        <div className="flex items-baseline justify-between gap-3 mb-1">
          <div>
            <p className="text-xs text-ink-muted mb-0.5">Plan actual</p>
            <p className="text-xl font-display text-ink">{planActivo.nombre}</p>
          </div>
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
            periodoActivo === 'anual'      ? 'bg-success/10 text-success' :
            periodoActivo === 'trimestral' ? 'bg-primary/10 text-primary' :
            'bg-surface-200 text-ink-muted'
          }`}>
            {periodoActivo === 'mensual' ? 'Mensual' : periodoActivo === 'trimestral' ? 'Trimestral' : 'Anual'}
          </span>
        </div>

        {/* Aviso de cambio de precio por Super Admin */}
        {hayCambioPrecio && (
          <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mt-3 mb-3">
            <span className="text-amber-600 shrink-0 text-sm">ℹ</span>
            <p className="text-xs text-amber-700">
              Tu tarifa actual es <strong>${precioActualGuardado.toLocaleString('es-AR')}/mes</strong> hasta el <strong>{formatFechaLarga(fechaRenovacion)}</strong>. A partir de esa fecha pasará a <strong>${nuevoPrecioCalculado.toLocaleString('es-AR')}/mes</strong>.
            </p>
          </div>
        )}

        {(() => {
          const cupon = espacio.cuponAplicado;
          const cuponActivo = cupon && new Date(cupon.venceCupon) > new Date();
          const precioConCupon = cuponActivo ? Math.round(precioBase * (1 - cupon.descuento / 100)) : null;
          return (
            <>
              {cuponActivo && (
                <div className="flex items-center gap-2 mt-3 mb-1 px-3 py-2 bg-success/5 border border-success/25 rounded-lg">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  <p className="text-xs text-success font-medium">
                    Cupón <span className="font-mono">{cupon.codigo}</span> — {cupon.descuento}% off hasta {formatFechaLarga(new Date(cupon.venceCupon))}
                  </p>
                </div>
              )}
              <div className="mt-2">
                <p className="text-xs text-ink-muted font-mono">
                  {cuponActivo
                    ? <><span className="line-through opacity-50">${precioBase.toLocaleString('es-AR')}/mes</span> → <span className="text-success font-semibold">${precioConCupon.toLocaleString('es-AR')}/mes</span></>
                    : <>${precioBase.toLocaleString('es-AR')}/mes equiv.{periodoActivo !== 'mensual' && <span className="ml-2">· ${(precioBase * (periodoActivo === 'trimestral' ? 3 : 12)).toLocaleString('es-AR')} cada {periodoActivo === 'trimestral' ? '3 meses' : 'año'}</span>}</>
                  }
                </p>
                <p className="text-xs text-ink-muted mt-0.5">Próxima renovación: {formatFechaLarga(fechaRenovacion)}</p>
              </div>
            </>
          );
        })()}
      </div>
      )}

      {/* ── Espacios adicionales (solo plan Estudio, fuera del trial) ── */}
      {isEstudio && !trialActivo && (
        <div className="bg-surface-100 border border-border rounded-xl p-5">
          <h2 className="font-semibold text-sm text-ink mb-1">Espacios adicionales</h2>
          <p className="text-xs text-ink-muted mb-3">
            El plan Estudio incluye hasta 2 espacios adicionales sin costo extra.
          </p>
          {otrosEspacios.length > 0 && (
            <div className="flex flex-col gap-3 mb-3">
              {otrosEspacios.map(esp => (
                <div key={esp.id} className="flex items-center gap-3 p-3 bg-surface-100 border border-border rounded-lg">
                  <EspacioLogoThumb esp={esp} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-ink truncate">{esp.nombre}</p>
                    <p className="text-xs text-ink-muted">Incluido en el plan Estudio</p>
                  </div>
                  <button
                    onClick={() => { setDeleteTarget(esp); setError(''); }}
                    className="shrink-0 text-xs text-danger hover:underline"
                  >
                    Eliminar
                  </button>
                </div>
              ))}
            </div>
          )}
          {otrosEspacios.length < 2 ? (
            <button
              onClick={() => setAgregarOpen(true)}
              className="self-start px-4 py-2 text-sm font-semibold bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
            >
              + Agregar espacio
            </button>
          ) : (
            <p className="text-xs text-ink-muted italic">Alcanzaste el máximo de espacios adicionales del plan Estudio.</p>
          )}
        </div>
      )}

      {/* ── DEV: reset plan (quitar antes de producción) ── */}
      {!isSuperAdmin && planActivo && (
        <button
          onClick={async () => {
            await espacioApi.update(espacio.id, { planId: null, plan: null, periodoFacturacion: null, precioActual: null, proximaRenovacion: null });
            await refresh();
          }}
          className="self-start text-xs text-ink-muted underline opacity-40 hover:opacity-100"
        >
          [DEV] Resetear plan
        </button>
      )}

      {/* ── Estado de la suscripción (solo con plan activo, no admin) ── */}
      {!isSuperAdmin && planActivo && <div className="bg-surface-100 border border-border rounded-xl p-5">
        <h2 className="font-semibold text-sm text-ink mb-3">Estado de la suscripción</h2>
        {pendiente ? (
          <div className="flex flex-col gap-4">
            <div className="flex items-start gap-3 bg-danger/5 border border-danger/20 rounded-lg px-4 py-3">
              <span className="text-danger mt-0.5 shrink-0">⚠</span>
              <div>
                <p className="text-sm font-medium text-danger">Cancelación solicitada</p>
                <p className="text-xs text-ink-muted mt-0.5">
                  Activo hasta el <strong>{lastDayOfCurrentMonth()}</strong>. Sin cobros desde el <strong>{firstDayOfNextMonth()}</strong>.
                </p>
              </div>
            </div>
            <button onClick={handleReactivar} disabled={loading}
              className="self-start px-4 py-2 text-sm font-medium border border-border rounded-md hover:bg-surface-200 transition-colors disabled:opacity-50">
              {loading ? 'Procesando…' : 'Revertir cancelación'}
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <p className="text-sm text-ink-muted">Tu suscripción está activa. Podés cancelarla en cualquier momento.</p>
            <button onClick={() => setCancelOpen(true)}
              className="self-start px-4 py-2 text-sm font-medium text-danger border border-danger/30 rounded-md hover:bg-danger/5 transition-colors">
              Cancelar suscripción
            </button>
          </div>
        )}
        {error && <p className="mt-3 text-xs text-danger">{error}</p>}
      </div>}

      {cancelOpen && (
        <CancelSubscriptionModal
          nombre={espacio.nombre}
          loading={loading}
          error={error}
          onConfirm={handleCancelar}
          onClose={() => { setCancelOpen(false); setError(''); }}
        />
      )}
      {deleteTarget && (
        <DeleteEspacioModal
          espacio={deleteTarget}
          espacioQueQueda={espacio}
          loading={loading}
          error={error}
          onConfirm={handleEliminarEspacio}
          onClose={() => { setDeleteTarget(null); setError(''); }}
        />
      )}
      {agregarOpen && (
        <AgregarEspacioModal
          userId={user?.uid}
          onSuccess={async () => { await refresh(); setAgregarOpen(false); }}
          onClose={() => setAgregarOpen(false)}
        />
      )}
    </div>
  );
}

// ── Root ──────────────────────────────────────────────────────────────────────

export default function Configuracion() {
  const { activeEspacio, espacios, refresh } = useEspacio();
  const [tab, setTab] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('mp')) return 'cobros';
    return sessionStorage.getItem('config_tab') || 'espacio';
  });

  function handleSetTab(t) {
    setTab(t);
    sessionStorage.setItem('config_tab', t);
  }

  if (!activeEspacio) return null;

  return (
    <Layout>
      {/* Mobile block — panel solo disponible en computadora */}
      <div className="xl:hidden flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
        <p className="text-4xl mb-4">🖥️</p>
        <h2 className="font-display text-xl text-ink mb-2">Solo disponible en computadora</h2>
        <p className="text-sm text-ink-muted max-w-xs">
          El panel de Configuración está diseñado para pantallas grandes.
          Accedé desde tu computadora para personalizar la identidad de tu espacio.
        </p>
      </div>

      <div className="hidden xl:block w-full max-w-4xl">
        <h1 className="font-display text-3xl text-ink mb-1">Configuración</h1>
        <p className="text-sm text-ink-muted mb-6">{activeEspacio.nombre}</p>

        <div className="flex gap-1 mb-7 border-b border-border">
          {TABS.map(t => (
            <button key={t.key} onClick={() => handleSetTab(t.key)}
              className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${tab === t.key ? 'border-primary text-primary' : 'border-transparent text-ink-muted hover:text-ink'}`}>
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'espacio'     && <TabEspacio     espacio={activeEspacio} refresh={refresh} />}
        {tab === 'identidad'   && <TabIdentidad   espacio={activeEspacio} refresh={refresh} />}
        {tab === 'tyc'         && <TabTerminos    espacio={activeEspacio} refresh={refresh} />}
        {tab === 'cobros'      && <TabCobros      espacio={activeEspacio} refresh={refresh} />}
        {tab === 'suscripcion' && <TabSuscripcion espacio={activeEspacio} espacios={espacios} refresh={refresh} />}
      </div>
    </Layout>
  );
}
