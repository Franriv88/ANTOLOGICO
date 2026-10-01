import { useCallback, useEffect, useRef, useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import Swal from 'sweetalert2';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { useEspacio } from '../context/EspacioContext';
import { espacios as espacioApi, rubros as rubrosApi } from '../services/api';
import { SOCIAL_NETWORKS, SocialIcon } from '../components/SocialIcons';
import { IconAntologico } from '../components/LogoAntologico';
import { usePlanes } from '../hooks/usePlanes';

// ── Helpers ───────────────────────────────────────────────────────────────────

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

const INPUT_CLS = 'w-full px-3 py-2 bg-white border border-border rounded-md text-sm text-ink focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary';
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
  { key: 'suscripcion', label: 'Suscripción' },
];

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

// ── Modal: eliminar espacio adicional ────────────────────────────────────────

function DeleteEspacioModal({ espacio, loading, error, onConfirm, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => !loading && onClose()}>
      <div className="absolute inset-0 bg-ink/20 backdrop-blur-[2px]" />
      <div className="relative bg-surface-0 border border-border rounded-xl shadow-2xl p-6 max-w-md w-full" onClick={e => e.stopPropagation()}>
        <h3 className="font-display text-lg text-ink mb-2">¿Eliminar el espacio <em>{espacio?.nombre}</em>?</h3>
        <p className="text-sm text-ink-muted mb-1.5">
          Se darán de baja todos los talleres y reservas asociados a este espacio. Esta acción no se puede deshacer.
        </p>
        <p className="text-sm text-ink-muted mb-5">
          Tu facturación volverá al <strong className="text-ink">100% del plan Estudio</strong> a partir del <strong className="text-ink">{firstDayOfNextMonth()}</strong>.
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

function AgregarEspacioModal({ userId, plan, onSuccess, onClose }) {
  const [nombre,  setNombre]  = useState('');
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');
  const precioAdicional = Math.round((plan?.precioMensual ?? 0) * 0.5);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!nombre.trim()) return;
    setLoading(true); setError('');
    try {
      await espacioApi.create({
        userId,
        nombre: nombre.trim(),
        plan,
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
          Se facturará al <strong className="text-ink">50% del plan Estudio</strong> — ${precioAdicional.toLocaleString('es-AR')}/mes adicionales.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-medium text-ink mb-1.5 block">Nombre del espacio</label>
            <input
              value={nombre}
              onChange={e => setNombre(e.target.value)}
              placeholder="Ej: Studio Norte, Espacio Palermo…"
              className="w-full px-3 py-2 border border-border rounded-md text-sm text-ink bg-white focus:outline-none focus:border-primary"
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

function CompartirEspacio({ espacio }) {
  const [copied, setCopied] = useState(false);
  const [useLogo, setUseLogo] = useState(true);
  const qrRef = useRef(null);

  const publicUrl = `${window.location.origin}/p/${espacio.id}`;
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

  return (
    <div>
      <h3 className="text-sm font-semibold text-ink mb-0.5">Compartir tu espacio</h3>
      <p className="text-xs text-ink-muted mb-5">Esta es la URL pública que podés compartir con tus clientes para que vean y reserven tus talleres.</p>

      {/* URL */}
      <div className="flex items-center gap-2 mb-6">
        <div className="flex-1 px-3 py-2 bg-surface-100 border border-border rounded-md text-sm text-ink font-mono truncate">
          {publicUrl}
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="shrink-0 px-4 py-2 text-sm font-medium border border-border rounded-md bg-white hover:bg-surface-200 transition-colors"
        >
          {copied ? '¡Copiado!' : 'Copiar'}
        </button>
        <a
          href={publicUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 px-4 py-2 text-sm font-medium border border-border rounded-md bg-white hover:bg-surface-200 transition-colors"
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

function RedesSocialesSection({ espacio, links, setLinks, style, setStyle, minimalColor, setMinimalColor, visible, setVisible }) {
  // Paleta de la identidad del espacio
  const palette = (() => {
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
                : 'border-border text-ink-muted hover:border-primary/40 bg-white'
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
        {SOCIAL_NETWORKS.map(net => (
          <div key={net.key} className="flex items-center gap-3">
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
              type="url"
              value={links[net.key] ?? ''}
              onChange={e => setLinks(p => ({ ...p, [net.key]: e.target.value }))}
              placeholder={net.placeholder}
              className={INPUT_CLS + ' text-xs'}
            />
          </div>
        ))}
      </div>

    </div>
  );
}

function TabEspacio({ espacio, refresh }) {
  const [nombre, setNombre]                = useState(espacio.nombre ?? '');
  const [rubroId, setRubroId]              = useState(espacio.rubro?.id ?? '');
  const [rubroPersonalizado, setRubroPers] = useState(espacio.rubroPersonalizado ?? '');
  const [rubros, setRubros]                = useState([]);
  const [saving, setSaving]                = useState(false);
  const [saved, setSaved]                  = useState(false);
  const [error, setError]                  = useState('');

  // ── Direcciones ──────────────────────────────────────────────────────────────
  const [direcciones, setDirecciones] = useState(espacio.direcciones ?? []);
  const [showAddDir,  setShowAddDir]  = useState(false);
  const [newDir,      setNewDir]      = useState(EMPTY_DIR);
  const [dirError,    setDirError]    = useState('');
  const [dirSaving,   setDirSaving]   = useState(false);
  // Paso 2: asignar nombre
  const [pendingDir,  setPendingDir]  = useState(null); // dirección validada esperando nombre
  const [dirNombre,   setDirNombre]   = useState('');

  useEffect(() => { rubrosApi.list().then(setRubros).catch(() => {}); }, []);

  async function handleSave(e) {
    e.preventDefault();
    if (!nombre.trim()) { setError('El nombre es requerido.'); return; }
    setSaving(true); setError(''); setSaved(false);
    try {
      await espacioApi.update(espacio.id, {
        nombre: nombre.trim(),
        rubroId: rubroId || null,
        rubroPersonalizado: (!rubroId && rubroPersonalizado.trim()) ? rubroPersonalizado.trim() : null,
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
            <select value={rubroId} onChange={e => { setRubroId(e.target.value); setRubroPers(''); }} className={INPUT_CLS}>
              <option value="">Otro / Sin categoría</option>
              {rubros.map(r => <option key={r.id} value={r.id}>{r.nombre}</option>)}
            </select>
            {!rubroId && (
              <input type="text" value={rubroPersonalizado} onChange={e => setRubroPers(e.target.value)}
                placeholder="Describí el rubro de tu espacio" className={INPUT_CLS + ' mt-2'} />
            )}
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
        <CompartirEspacio espacio={espacio} />
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

    </div>
  );
}

// ── Tab: Identidad ────────────────────────────────────────────────────────────

function TabIdentidad({ espacio, refresh }) {
  const planNombre = espacio.plan?.nombre ?? '';
  const isEstudio  = planNombre === 'Estudio';

  const parseRedes = () => {
    const rs = espacio.redesSociales;
    if (!rs) return { style: 'brand', minimalColor: '', links: {}, visible: {} };
    return { style: rs.style ?? 'brand', minimalColor: rs.minimalColor ?? '', links: rs.links ?? {}, visible: rs.visible ?? {} };
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
                        className={`px-3 py-1.5 text-xs font-medium rounded-md border transition-colors ${logoShape === s.key ? 'border-primary bg-primary/5 text-primary' : 'border-border text-ink-muted hover:border-primary/40 bg-white'}`}>
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
                    className="px-3 py-1.5 text-xs font-medium border border-border rounded-md bg-white text-ink hover:bg-surface-200 transition-colors">
                    {logoData ? 'Cambiar' : 'Subir logo'}
                  </button>
                  {logoData && !removingBg && (
                    <button type="button" onClick={handleRemoveBg}
                      className="px-3 py-1.5 text-xs font-medium border border-border rounded-md bg-white text-ink hover:bg-surface-200 transition-colors">
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
                      className="px-3 py-1.5 text-xs font-medium border border-danger/30 rounded-md bg-white text-danger hover:bg-danger/5 transition-colors">
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
              <div className="flex flex-col divide-y divide-[#E8DFD0] border border-[#D2C4A8] rounded-xl overflow-hidden bg-[#FBF8F2]">
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
                    className={`relative text-left px-4 py-3 rounded-xl border-2 transition-all ${locked ? 'border-border bg-surface-100 cursor-not-allowed opacity-55' : selected ? 'bg-white' : 'border-border bg-white hover:border-primary/40'}`}
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

  const pendiente      = espacio.cancelacionPendiente;
  const isEstudio      = espacio.planId === 'estudio';

  async function handleActivarPlan(plan) {
    setLoading(true); setError('');
    try {
      await espacioApi.updatePlan(espacio.id, plan.id, plan);
      await refresh();
    } catch (e) { setError(e.message || 'Ocurrió un error.'); }
    finally { setLoading(false); }
  }
  const otrosEspacios  = espacios.filter(e => e.id !== espacio.id);
  const precioBase     = espacio.plan?.precioMensual ?? 0;
  const precioAdicional = Math.round(precioBase * 0.5);
  const totalMensual   = precioBase + otrosEspacios.length * precioAdicional;

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

      {/* ── Selector de plan (cuando no hay plan activo) ── */}
      {!espacio.plan && (
        <div className="bg-surface-100 border border-border rounded-xl p-5">
          <p className="text-xs text-ink-muted mb-0.5">Plan actual</p>
          <p className="text-xl font-display text-ink mb-1">Sin plan (modo prueba)</p>
          <p className="text-sm text-ink-muted mb-4">Elegí un plan para activar tu suscripción.</p>
          <div className="flex flex-col gap-3">
            {(planesDB ?? []).map(plan => (
              <div key={plan.id} className={`flex items-center gap-4 p-4 rounded-lg border transition-colors ${plan.id === 'estudio' ? 'border-primary/40 bg-primary/5' : 'border-border bg-white'}`}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-sm font-semibold text-ink">{plan.nombre}</p>
                    {plan.id === 'estudio' && <span className="text-xs px-1.5 py-0.5 bg-primary/10 text-primary rounded font-medium">Multi-espacio</span>}
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
                  <p className="font-mono text-sm font-semibold text-ink">${plan.precioMensual?.toLocaleString('es-AR')}</p>
                  <p className="text-xs text-ink-muted">/mes</p>
                </div>
                <button
                  onClick={() => handleActivarPlan(plan)}
                  disabled={loading}
                  className="shrink-0 px-3 py-1.5 text-xs font-semibold bg-primary text-white rounded-md hover:bg-primary/90 disabled:opacity-50"
                >
                  Activar
                </button>
              </div>
            ))}
          </div>
          {error && <p className="mt-3 text-xs text-danger">{error}</p>}
        </div>
      )}

      {/* ── Resumen de facturación (cuando hay plan activo) ── */}
      {espacio.plan && (
      <div className="bg-surface-100 border border-border rounded-xl p-5">
        <p className="text-xs text-ink-muted mb-0.5">Plan actual</p>
        <p className="text-xl font-display text-ink">{espacio.plan?.nombre ?? 'Sin plan (modo prueba)'}</p>

        {espacio.plan && otrosEspacios.length > 0 ? (
          <div className="mt-4 flex flex-col gap-2">
            {/* Espacio principal */}
            <div className="flex items-center gap-3">
              <EspacioLogoThumb esp={espacio} />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-ink truncate">{espacio.nombre}</p>
                <p className="text-xs text-ink-muted">Plan Estudio · 100%</p>
              </div>
              <span className="font-mono text-sm text-ink shrink-0">${precioBase.toLocaleString('es-AR')}/mes</span>
            </div>
            {/* Espacios adicionales */}
            {otrosEspacios.map(esp => (
              <div key={esp.id} className="flex items-center gap-3">
                <EspacioLogoThumb esp={esp} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-ink truncate">{esp.nombre}</p>
                  <p className="text-xs text-ink-muted">Plan Estudio · 50%</p>
                </div>
                <span className="font-mono text-sm text-ink shrink-0">${precioAdicional.toLocaleString('es-AR')}/mes</span>
              </div>
            ))}
            <div className="border-t border-border pt-3 flex items-center justify-between">
              <span className="text-sm font-semibold text-ink">Total mensual</span>
              <span className="font-mono text-base font-semibold text-ink">${totalMensual.toLocaleString('es-AR')}/mes</span>
            </div>
          </div>
        ) : espacio.plan ? (
          <p className="text-xs text-ink-muted mt-1 font-mono">
            ${precioBase.toLocaleString('es-AR')} / mes
          </p>
        ) : null}
      </div>
      )}

      {/* ── Espacios adicionales (solo plan Estudio) ── */}
      {isEstudio && (
        <div className="bg-surface-100 border border-border rounded-xl p-5">
          <h2 className="font-semibold text-sm text-ink mb-3">Espacios adicionales</h2>
          {otrosEspacios.length > 0 ? (
            <div className="flex flex-col gap-3">
              {otrosEspacios.map(esp => (
                <div key={esp.id} className="flex items-center gap-3 p-3 bg-white border border-border rounded-lg">
                  <EspacioLogoThumb esp={esp} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-ink truncate">{esp.nombre}</p>
                    <p className="text-xs font-mono text-ink-muted">${precioAdicional.toLocaleString('es-AR')}/mes · 50% del plan</p>
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
          ) : (
            <div className="flex flex-col gap-3">
              <p className="text-sm text-ink-muted">
                Podés agregar un espacio adicional por el 50% del plan Estudio — ${precioAdicional.toLocaleString('es-AR')}/mes.
              </p>
              <button
                onClick={() => setAgregarOpen(true)}
                className="self-start px-4 py-2 text-sm font-semibold bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
              >
                + Agregar espacio
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── Estado de la suscripción (solo con plan activo) ── */}
      {espacio.plan && <div className="bg-surface-100 border border-border rounded-xl p-5">
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
          loading={loading}
          error={error}
          onConfirm={handleEliminarEspacio}
          onClose={() => { setDeleteTarget(null); setError(''); }}
        />
      )}
      {agregarOpen && (
        <AgregarEspacioModal
          userId={user?.uid}
          plan={espacio.plan}
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
  const [tab, setTab] = useState(() => sessionStorage.getItem('config_tab') || 'espacio');

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
        {tab === 'suscripcion' && <TabSuscripcion espacio={activeEspacio} espacios={espacios} refresh={refresh} />}
      </div>
    </Layout>
  );
}
