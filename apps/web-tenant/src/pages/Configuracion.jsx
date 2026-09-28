import { useEffect, useRef, useState } from 'react';
import Layout from '../components/Layout';
import { useEspacio } from '../context/EspacioContext';
import { espacios as espacioApi, rubros as rubrosApi } from '../services/api';

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

// ── Tab: Mi espacio ───────────────────────────────────────────────────────────

function TabEspacio({ espacio, refresh }) {
  const [nombre, setNombre]                = useState(espacio.nombre ?? '');
  const [rubroId, setRubroId]              = useState(espacio.rubro?.id ?? '');
  const [rubroPersonalizado, setRubroPers] = useState(espacio.rubroPersonalizado ?? '');
  const [rubros, setRubros]                = useState([]);
  const [saving, setSaving]                = useState(false);
  const [saved, setSaved]                  = useState(false);
  const [error, setError]                  = useState('');

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

  return (
    <form onSubmit={handleSave} className="flex flex-col gap-5 max-w-lg">
      <div>
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
  );
}

// ── Tab: Identidad ────────────────────────────────────────────────────────────

function TabIdentidad({ espacio, refresh }) {
  const planNombre = espacio.plan?.nombre ?? '';
  const isEstudio  = planNombre === 'Estudio';

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
  useEffect(() => {
    const el = addColorInputRef.current;
    if (!el) return;
    function onPickerClose(e) { setColors(p => p.length < 8 ? [...p, e.target.value] : p); }
    el.addEventListener('change', onPickerClose);
    return () => el.removeEventListener('change', onPickerClose);
  }, []);

  function addColor()       { if (colors.length < 8) addColorInputRef.current?.click(); }
  function removeColor(i)   { setColors(p => p.filter((_, idx) => idx !== i)); }
  function updateColor(i,v) { setColors(p => p.map((c, idx) => idx === i ? v : c)); }


  // ── Save ──────────────────────────────────────────────────────────────────
  async function handleSave(e) {
    e.preventDefault();
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
    <form onSubmit={handleSave} className="flex flex-col gap-6">
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
                    ref={addColorInputRef}
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
                <p className="text-xs text-ink-muted">Asigná cada color de tu paleta a un rol en tu página pública. La preview se actualiza en tiempo real.</p>
              </div>
              <div className="flex flex-col gap-3 bg-surface-100 border border-border rounded-xl p-4" style={{ backgroundColor: '#FBF8F2', borderColor: '#D2C4A8', color: '#2B241A' }}>
                {COLOR_ROLES.map(role => (
                  <div key={role.key}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        {isValidColor(roles[role.key]) && (
                          <span className="w-3 h-3 rounded-full inline-block border border-white shadow-sm" style={{ backgroundColor: roles[role.key] }} />
                        )}
                        <span className="text-xs font-medium text-ink">{role.label}</span>
                        <span className="text-xs text-ink-muted">— {role.hint}</span>
                      </div>
                      {roles[role.key] && (
                        <button type="button" onClick={() => setRoles(r => ({ ...r, [role.key]: '' }))}
                          className="text-xs text-ink-muted hover:text-danger transition-colors">quitar</button>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {validPalette.map((c, i) => (
                        <button key={i} type="button"
                          onClick={() => setRoles(r => ({ ...r, [role.key]: c }))}
                          title={c}
                          className={`w-7 h-7 rounded-md border-2 ${roles[role.key] === c ? 'border-ink scale-110 shadow-md' : 'border-transparent'}`}
                          style={{
                            backgroundColor: c,
                            transition: 'transform 0.18s ease, box-shadow 0.18s ease',
                          }}
                          onMouseEnter={e => { if (roles[role.key] !== c) e.currentTarget.style.transform = 'translateY(-5px) rotate(-6deg) scale(1.12)'; }}
                          onMouseLeave={e => { if (roles[role.key] !== c) e.currentTarget.style.transform = ''; }}
                        />
                      ))}
                    </div>
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

      {error && <p className="text-xs text-danger">{error}</p>}

      <div className="flex items-center gap-3 pb-4">
        <button type="submit" disabled={saving || removingBg}
          className="px-5 py-2 bg-primary text-white rounded-md text-sm font-semibold hover:bg-primary-strong transition-colors disabled:opacity-50">
          {saving ? 'Guardando…' : 'Guardar identidad'}
        </button>
        {saved && <span className="text-xs text-green-600 font-medium">¡Guardado!</span>}
      </div>
    </form>
  );
}

// ── Tab: Suscripción ──────────────────────────────────────────────────────────

function TabSuscripcion({ espacio, refresh }) {
  const [loading,     setLoading]     = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [error,       setError]       = useState('');
  const pendiente = espacio.cancelacionPendiente;

  async function handleCancelar() {
    setLoading(true); setError('');
    try {
      await espacioApi.solicitarCancelacion(espacio.id);
      await refresh();
      setConfirmOpen(false);
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

  return (
    <div className="max-w-lg flex flex-col gap-6">
      <div className="bg-surface-100 border border-border rounded-xl p-5">
        <p className="text-xs text-ink-muted mb-0.5">Plan actual</p>
        <p className="text-xl font-display text-ink">{espacio.plan?.nombre ?? 'Sin plan (modo prueba)'}</p>
        {espacio.plan && (
          <p className="text-xs text-ink-muted mt-1 font-mono">
            ${espacio.plan.precioMensual?.toLocaleString('es-AR')} / mes
          </p>
        )}
      </div>
      <div className="bg-surface-100 border border-border rounded-xl p-5">
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
            <button onClick={() => setConfirmOpen(true)}
              className="self-start px-4 py-2 text-sm font-medium text-danger border border-danger/30 rounded-md hover:bg-danger/5 transition-colors">
              Cancelar suscripción
            </button>
          </div>
        )}
        {error && <p className="mt-3 text-xs text-danger">{error}</p>}
      </div>
      {confirmOpen && (
        <CancelSubscriptionModal
          nombre={espacio.nombre}
          loading={loading}
          error={error}
          onConfirm={handleCancelar}
          onClose={() => { setConfirmOpen(false); setError(''); }}
        />
      )}
    </div>
  );
}

// ── Root ──────────────────────────────────────────────────────────────────────

export default function Configuracion() {
  const { activeEspacio, refresh } = useEspacio();
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
        {tab === 'suscripcion' && <TabSuscripcion espacio={activeEspacio} refresh={refresh} />}
      </div>
    </Layout>
  );
}
