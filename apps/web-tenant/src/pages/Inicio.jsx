import { useEffect, useLayoutEffect, useState, useCallback, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import jsQR from 'jsqr';
import { espacios as espaciosApi, workshops as workshopsApi } from '../services/api';
import {
  loginGoogle, loginEmail, register, logout,
  subscribeAuth, authErrorMsg, sendPasswordReset,
  checkRedirectResult,
  followEspacio, unfollowEspacio, getEspaciosSeguidos, syncFollowedToFirestore,
} from '../services/userAuth';
import { getSlotStatus } from '../lib/slotStatus';
import { LogoAntologico, IconAntologico } from '../components/LogoAntologico';

// ── helpers ──────────────────────────────────────────────────────────────────

function formatFecha(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('es-AR', { weekday: 'short', day: 'numeric', month: 'short' });
}
function formatHora(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
}
function formatPrecio(n) {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(n);
}
function isPast(iso) {
  return iso ? new Date(iso).getTime() < Date.now() : false;
}
function parseBrand(espacio) {
  const bc = espacio?.brandColors;
  const palette = Array.isArray(bc) ? bc : (bc?.palette ?? []);
  const roles = (!bc || Array.isArray(bc)) ? {} : (bc.roles ?? {});
  return { primary: roles.primary || palette[0] || '#E85D4A' };
}

// ── localStorage follow helpers ──────────────────────────────────────────────

const LS_KEY = 'ant_espacios_seguidos';
function getLocalFollowed() { try { return JSON.parse(localStorage.getItem(LS_KEY) ?? '[]'); } catch { return []; } }
function addLocalFollowed(id) { const p = getLocalFollowed(); if (!p.includes(id)) localStorage.setItem(LS_KEY, JSON.stringify([...p, id])); }
function removeLocalFollowed(id) { localStorage.setItem(LS_KEY, JSON.stringify(getLocalFollowed().filter(x => x !== id))); }

// ── HeroNetwork (red neuronal como fondo) ────────────────────────────────────

const EDGES = [
  [256,108,392,128],[256,108,184,190],[256,108,315,198],[184,190,315,198],
  [315,198,392,128],[392,128,522,190],[522,190,656,158],[184,190,140,238],
  [315,198,268,240],[392,128,400,235],[522,190,548,238],[656,158,712,244],
  [213,413,150,345],[213,413,365,445],[365,445,322,348],[365,445,446,392],
  [446,392,430,348],[446,392,561,428],[561,428,598,350],[561,428,692,390],
  [692,390,740,345],
];
const NODES = [
  [256,108,6,true],[446,392,6,true],
  [392,128,29],[184,190,29],[315,198,29],[522,190,29],
  [656,158,29],[213,413,29],[365,445,29],[561,428,29],[692,390,29],
];

function HeroNetwork() {
  return (
    <div aria-hidden="true" className="absolute inset-[-10%] pointer-events-none">
      <svg viewBox="0 0 816 497" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
        <g stroke="rgba(255,255,255,0.15)" strokeWidth="2" strokeLinecap="round" strokeDasharray="0.1 7" fill="none">
          {EDGES.map(([x1,y1,x2,y2],i) => <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}/>)}
        </g>
        {NODES.map(([cx,cy,r,isHub],i) => (
          <circle key={i} cx={cx} cy={cy} r={r}
            fill={isHub ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.07)'}
            stroke="rgba(255,255,255,0.18)" strokeWidth={isHub ? 1 : 1.5}
          />
        ))}
      </svg>
    </div>
  );
}

// ── Floating features ────────────────────────────────────────────────────────

const STUDENT_FEATURES = [
  { icon: 'search',   title: 'Descubrí talleres', desc: 'Explorá espacios de arte, yoga, cocina, música y más.' },
  { icon: 'calendar', title: 'Reservá tu lugar',   desc: 'Elegí el taller que te guste y asegurá tu cupo al instante.' },
  { icon: 'qr',       title: 'Escaneá y seguí',    desc: 'Escaneá el QR de un espacio para empezar a seguirlo.' },
  { icon: 'heart',    title: 'Todo en un lugar',    desc: 'Tus espacios seguidos, reservas y perfil, siempre a mano.' },
];

const FEATURE_ICONS = {
  search: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  ),
  calendar: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  ),
  qr: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
      <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="3" height="3"/>
      <rect x="18" y="18" width="3" height="3"/><rect x="14" y="18" width="3" height="3"/><rect x="18" y="14" width="3" height="3"/>
    </svg>
  ),
  heart: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  ),
};

// ── AuthSheet (slide-down form) ──────────────────────────────────────────────

function AuthSheet({ mode, onClose, onSuccess }) {
  const [email,      setEmail]      = useState('');
  const [password,   setPassword]   = useState('');
  const [nombre,     setNombre]     = useState('');
  const [telefono,   setTelefono]   = useState('');
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState('');
  const [resetMode,  setResetMode]  = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetDone,  setResetDone]  = useState(false);
  const [visible,    setVisible]    = useState(false);
  const sheetRef = useRef(null);

  useEffect(() => { requestAnimationFrame(() => setVisible(true)); }, []);

  function animateClose() {
    setVisible(false);
    setTimeout(onClose, 350);
  }

  const INPUT = 'w-full px-3.5 py-2.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-sm text-white placeholder-white/50 focus:outline-none focus:border-white/50 focus:ring-1 focus:ring-white/30 transition-colors';
  const LABEL = 'block text-xs font-medium text-white/70 mb-1.5';

  async function handleGoogle() {
    setLoading('google'); setError('');
    try { onSuccess(await loginGoogle()); animateClose(); }
    catch (e) { setError(authErrorMsg(e.code)); setLoading(false); }
  }

  async function handleSubmit(e) {
    e.preventDefault(); setLoading('form'); setError('');
    try {
      if (mode === 'login') {
        onSuccess(await loginEmail(email, password));
      } else {
        if (!nombre.trim()) { setError('El nombre es requerido'); setLoading(false); return; }
        onSuccess(await register(email, password, nombre.trim(), telefono.trim()));
      }
      animateClose();
    } catch (e) { setError(authErrorMsg(e.code)); setLoading(false); }
  }

  async function handleReset(e) {
    e.preventDefault(); setLoading('reset');
    try { await sendPasswordReset(resetEmail); setResetDone(true); }
    catch { setError('No pudimos enviar el email.'); }
    finally { setLoading(false); }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center sm:justify-end sm:items-start">
      <div
        className="absolute inset-0 transition-opacity duration-300"
        style={{ backgroundColor: 'rgba(0,0,0,0.5)', opacity: visible ? 1 : 0 }}
        onClick={animateClose}
      />
      <div
        ref={sheetRef}
        className="relative w-full sm:w-[380px] sm:mr-4 sm:mt-16 transition-all duration-350 ease-out"
        style={{
          transform: visible ? 'translateY(0)' : 'translateY(-100%)',
          opacity: visible ? 1 : 0,
        }}
      >
        <div
          className="rounded-b-3xl sm:rounded-2xl overflow-hidden p-6 pt-8 sm:pt-6"
          style={{ background: 'linear-gradient(160deg, rgba(232,93,74,0.95) 0%, rgba(140,46,31,0.97) 100%)', backdropFilter: 'blur(20px)' }}
        >
          {/* Close */}
          <button onClick={animateClose} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>

          <h2 className="font-display text-xl text-white mb-1">
            {resetMode ? 'Recuperar contraseña' : mode === 'login' ? 'Bienvenido de vuelta' : 'Creá tu cuenta'}
          </h2>
          <p className="text-sm text-white/60 mb-5">
            {resetMode ? 'Te enviamos un link a tu email.' : mode === 'login' ? 'Ingresá para ver tus espacios y reservas.' : 'Es gratis y te toma 30 segundos.'}
          </p>

          {resetMode ? (
            resetDone ? (
              <div>
                <p className="text-sm text-emerald-200 bg-emerald-900/30 border border-emerald-400/30 rounded-xl px-4 py-3 mb-4">¡Listo! Revisá tu email.</p>
                <button onClick={() => { setResetMode(false); setResetDone(false); }} className="text-sm text-white/70 hover:text-white">← Volver</button>
              </div>
            ) : (
              <form onSubmit={handleReset} className="flex flex-col gap-3">
                <div><label className={LABEL}>Email</label><input type="email" value={resetEmail} onChange={e => setResetEmail(e.target.value)} autoFocus className={INPUT} placeholder="tu@email.com" /></div>
                {error && <p className="text-xs text-red-200 bg-red-900/30 rounded-lg px-3 py-2">{error}</p>}
                <button type="submit" disabled={!!loading} className="w-full py-2.5 rounded-xl text-sm font-bold bg-white text-[#C4412F] disabled:opacity-50 hover:bg-white/90 transition-colors">
                  {loading === 'reset' ? 'Enviando…' : 'Enviar enlace'}
                </button>
                <button type="button" onClick={() => setResetMode(false)} className="text-xs text-white/50 hover:text-white text-center">← Volver al login</button>
              </form>
            )
          ) : (
            <>
              {/* Google */}
              <button type="button" onClick={handleGoogle} disabled={!!loading}
                className="w-full flex items-center justify-center gap-3 py-2.5 px-4 border border-white/20 rounded-xl bg-white/10 hover:bg-white/20 transition-colors text-sm font-medium text-white mb-4 disabled:opacity-60 backdrop-blur-sm">
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path fill="#fff" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fillOpacity=".9"/>
                  <path fill="#fff" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fillOpacity=".7"/>
                  <path fill="#fff" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fillOpacity=".5"/>
                  <path fill="#fff" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fillOpacity=".8"/>
                </svg>
                {loading === 'google' ? 'Conectando…' : 'Continuar con Google'}
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1 h-px bg-white/15" /><span className="text-xs text-white/40">o</span><div className="flex-1 h-px bg-white/15" />
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                {mode === 'register' && (
                  <>
                    <div><label className={LABEL}>Nombre completo *</label><input type="text" value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Tu nombre" className={INPUT} /></div>
                    <div><label className={LABEL}>Teléfono</label><input type="tel" value={telefono} onChange={e => setTelefono(e.target.value)} placeholder="+54 9 11 1234-5678" className={INPUT} /></div>
                  </>
                )}
                <div><label className={LABEL}>Email *</label><input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="tu@email.com" autoFocus className={INPUT} /></div>
                <div>
                  <label className={LABEL}>Contraseña *</label>
                  <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder={mode === 'register' ? 'Mínimo 6 caracteres' : '••••••••'} className={INPUT} />
                  {mode === 'login' && (
                    <button type="button" onClick={() => { setResetEmail(email); setResetMode(true); }}
                      className="text-xs text-white/40 hover:text-white/70 mt-1.5 float-right transition-colors">
                      ¿Olvidaste tu contraseña?
                    </button>
                  )}
                </div>
                {error && <p className="text-xs text-red-200 bg-red-900/30 rounded-lg px-3 py-2 clear-both">{error}</p>}
                <button type="submit" disabled={!!loading}
                  className="w-full py-2.5 rounded-xl text-sm font-bold bg-white text-[#C4412F] disabled:opacity-50 hover:bg-white/90 transition-colors mt-1 clear-both shadow-lg">
                  {loading === 'form'
                    ? (mode === 'login' ? 'Ingresando…' : 'Creando cuenta…')
                    : (mode === 'login' ? 'Ingresar' : 'Crear cuenta')}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ── QRScannerModal ───────────────────────────────────────────────────────────

function QRScannerModal({ onClose, onFound, userId }) {
  const navigate    = useNavigate();
  const videoRef    = useRef(null);
  const canvasRef   = useRef(null);
  const streamRef   = useRef(null);
  const rafRef      = useRef(null);
  const [phase,     setPhase]     = useState('starting');
  const [errMsg,    setErrMsg]    = useState('');
  const [found,     setFound]     = useState(null);
  const [followed,  setFollowed]  = useState(false);

  function stopCamera() { cancelAnimationFrame(rafRef.current); streamRef.current?.getTracks().forEach(t => t.stop()); }
  function handleClose() { stopCamera(); onClose(); }

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: { ideal: 'environment' } } })
      .then(stream => { streamRef.current = stream; if (videoRef.current) videoRef.current.srcObject = stream; setPhase('scanning'); })
      .catch(() => { setErrMsg('No se pudo acceder a la cámara.'); setPhase('error'); });
    return stopCamera;
  }, []);

  const tick = useCallback(() => {
    const video = videoRef.current, canvas = canvasRef.current;
    if (!video || !canvas || video.readyState < video.HAVE_ENOUGH_DATA) { rafRef.current = requestAnimationFrame(tick); return; }
    canvas.width = video.videoWidth; canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    ctx.drawImage(video, 0, 0);
    const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(img.data, img.width, img.height, { inversionAttempts: 'dontInvert' });
    if (code?.data) { handleQRData(code.data); return; }
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  useEffect(() => {
    if (phase !== 'scanning') return;
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [phase, tick]);

  async function handleQRData(raw) {
    try {
      const url = new URL(raw);
      let espacioId = null;
      const pathMatch = url.pathname.match(/^\/p\/(.+)$/);
      if (pathMatch) {
        espacioId = pathMatch[1];
      } else {
        const host = url.hostname;
        const parts = host.split('.');
        if (parts.length >= 3 && parts.slice(-2).join('.') === 'antologico.app') {
          const slug = parts.slice(0, -2).join('.');
          if (slug && slug !== 'www' && slug !== 'admin') {
            const esp = await espaciosApi.getBySlug(slug);
            if (esp) espacioId = esp.id;
          }
        }
      }
      if (!espacioId) { setErrMsg('Este QR no corresponde a un espacio de Antológico.'); setPhase('error'); return; }
      stopCamera();
      let nombre = '';
      try { const esp = await espaciosApi.get(espacioId); nombre = esp?.nombre ?? ''; } catch {}
      setFound({ url: raw, espacioId, nombre });
      setFollowed(userId ? (await getEspaciosSeguidos(userId)).includes(espacioId) : getLocalFollowed().includes(espacioId));
      setPhase('found');
    } catch { setErrMsg('El QR escaneado no contiene una URL válida.'); setPhase('error'); }
  }

  async function handleFollow() {
    if (!found) return;
    if (userId) await followEspacio(userId, found.espacioId).catch(() => {});
    else addLocalFollowed(found.espacioId);
    setFollowed(true);
  }

  async function handleGo() {
    if (!found) return;
    if (!followed) {
      if (userId) await followEspacio(userId, found.espacioId).catch(() => {});
      else addLocalFollowed(found.espacioId);
    }
    handleClose();
    onFound?.(found.espacioId);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/70" onClick={handleClose} />
      <div className="relative bg-[#FAF8F4] rounded-t-3xl sm:rounded-2xl w-full sm:max-w-sm overflow-hidden">
        <div className="flex justify-center pt-3 pb-1 sm:hidden"><div className="w-10 h-1 rounded-full bg-[#D2C4A8]" /></div>
        <div className="px-5 pb-6 pt-2 sm:pt-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-lg text-[#1A1611]">Escanear QR</h3>
            <button onClick={handleClose} className="p-1 rounded-lg text-[#9B9083] hover:text-[#1A1611] hover:bg-[#F0EAE0] transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
          {phase === 'starting' && <div className="flex flex-col items-center justify-center py-10 gap-3"><div className="w-8 h-8 rounded-full border-2 border-[#E85D4A] border-t-transparent animate-spin" /><p className="text-sm text-[#6B5F4C]">Activando cámara…</p></div>}
          {phase === 'error' && <div className="py-6 text-center"><p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-4">{errMsg}</p><button onClick={handleClose} className="px-4 py-2 rounded-xl text-sm font-semibold bg-[#E85D4A] text-white">Cerrar</button></div>}
          {(phase === 'scanning' || phase === 'starting') && (
            <div className="relative rounded-2xl overflow-hidden bg-black aspect-square">
              <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-48 h-48 relative">
                  {['tl','tr','bl','br'].map(c => (
                    <div key={c} className={`absolute w-8 h-8 border-white/80 border-2 ${c==='tl'?'top-0 left-0 border-r-0 border-b-0 rounded-tl-lg':c==='tr'?'top-0 right-0 border-l-0 border-b-0 rounded-tr-lg':c==='bl'?'bottom-0 left-0 border-r-0 border-t-0 rounded-bl-lg':'bottom-0 right-0 border-l-0 border-t-0 rounded-br-lg'}`} />
                  ))}
                </div>
              </div>
            </div>
          )}
          {phase === 'found' && found && (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col items-center py-4 gap-2">
                <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <p className="text-sm font-semibold text-[#1A1611]">¡QR detectado!</p>
                {found.nombre && <p className="text-xs text-[#6B5F4C]">{found.nombre}</p>}
              </div>
              <button onClick={handleGo} className="w-full py-2.5 rounded-xl text-sm font-bold bg-[#E85D4A] text-white">Ver espacio</button>
              <button onClick={followed ? () => {} : handleFollow}
                className={`w-full py-2.5 rounded-xl text-sm font-semibold border transition-colors ${followed ? 'border-emerald-300 bg-emerald-50 text-emerald-700' : 'border-[#D2C4A8] text-[#2B241A] hover:bg-[#F0EAE0]'}`}>
                {followed ? '✓ Siguiendo' : '+ Seguir espacio'}
              </button>
            </div>
          )}
          <canvas ref={canvasRef} className="hidden" />
          {phase === 'scanning' && <p className="text-center text-xs text-[#9B9083] mt-4">Apuntá la cámara al código QR del espacio</p>}
        </div>
      </div>
    </div>
  );
}

// ── EspacioCard ──────────────────────────────────────────────────────────────

function EspacioCard({ espacio, onSelect }) {
  const { primary } = parseBrand(espacio);
  const isRound = espacio.logoShape !== 'square';

  return (
    <button
      onClick={() => onSelect(espacio.id)}
      className="flex flex-col items-center gap-2 p-3 rounded-2xl border border-[#EDE8DE] bg-white hover:border-[#D2C4A8] hover:shadow-sm transition-all active:scale-[0.97]"
    >
      <div
        className={`w-14 h-14 flex items-center justify-center overflow-hidden shrink-0 ${isRound ? 'rounded-full' : 'rounded-xl'}`}
        style={{ backgroundColor: espacio.logoUrl ? 'transparent' : primary + '18' }}
      >
        {espacio.logoUrl ? (
          <img src={espacio.logoUrl} alt="" className="w-full h-full object-cover" />
        ) : (
          <span className="text-xl font-bold" style={{ color: primary }}>{espacio.nombre?.charAt(0)?.toUpperCase() ?? '?'}</span>
        )}
      </div>
      <p className="text-xs font-semibold text-[#1A1611] text-center leading-tight line-clamp-2 w-full">{espacio.nombre}</p>
      {espacio.rubroPersonalizado && <p className="text-[10px] text-[#9B9083] truncate w-full text-center">{espacio.rubroPersonalizado}</p>}
    </button>
  );
}

// ── WorkshopCard ─────────────────────────────────────────────────────────────

function WorkshopCard({ ws, espacio }) {
  const { primary } = parseBrand(espacio);
  const status = getSlotStatus(ws.cuposDisponibles, ws.cuposTotales ?? ws.cupos_totales);
  const past = isPast(ws.fecha);
  const headerBg = ws.headerType === 'COLOR' && ws.headerValue ? ws.headerValue : primary;
  const headerImg = ws.headerType === 'IMAGE' && ws.headerValue ? ws.headerValue : null;

  return (
    <Link to={`/p/${espacio.id}`}
      className={`block rounded-xl overflow-hidden border border-[#EDE8DE] bg-white shadow-sm hover:shadow transition-shadow ${past ? 'opacity-60' : ''}`}>
      <div className="h-2 relative" style={{ backgroundColor: headerImg ? 'transparent' : headerBg }}>
        {headerImg && <img src={headerImg} alt="" className="w-full h-2 object-cover" />}
      </div>
      <div className="p-3.5 flex flex-col gap-1.5">
        <div className="flex items-start justify-between gap-2">
          <h4 className="text-sm font-bold text-[#1A1611] leading-snug line-clamp-2 flex-1">{ws.nombre}</h4>
          {!past && status.key !== 'AGOTADO' && <span className="shrink-0 inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-700">{status.key === 'ULTIMOS' ? 'Últimos cupos' : 'Disponible'}</span>}
          {!past && status.key === 'AGOTADO' && <span className="shrink-0 inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-red-100 text-red-700">Agotado</span>}
        </div>
        {ws.fecha && <p className="text-xs font-mono text-[#6B5F4C] capitalize">{formatFecha(ws.fecha)} · {formatHora(ws.fecha)}</p>}
        <div className="flex items-center justify-between mt-1">
          {ws.precio != null && <p className="text-xs font-mono font-bold text-[#2B241A]">{formatPrecio(ws.precio)}</p>}
          <span className="text-[10px] text-[#E85D4A] font-semibold">Ver detalle →</span>
        </div>
      </div>
    </Link>
  );
}

// ── EspacioDetail ────────────────────────────────────────────────────────────

function EspacioDetail({ espacio, userId, onBack, onUnfollow }) {
  const [wsList, setWsList] = useState(null);
  const [loading, setLoading] = useState(true);
  const [unfollowing, setUnfollowing] = useState(false);
  const { primary } = parseBrand(espacio);

  useEffect(() => {
    workshopsApi.list(espacio.id, { estado: 'PUBLICADO' })
      .then(list => {
        const now = Date.now();
        setWsList(list.sort((a, b) => {
          const da = a.fecha ? new Date(a.fecha).getTime() : Infinity;
          const db = b.fecha ? new Date(b.fecha).getTime() : Infinity;
          const pa = da < now ? 1 : 0, pb = db < now ? 1 : 0;
          if (pa !== pb) return pa - pb;
          return da - db;
        }));
      })
      .catch(() => setWsList([]))
      .finally(() => setLoading(false));
  }, [espacio.id]);

  async function handleUnfollow() {
    setUnfollowing(true);
    if (userId) await unfollowEspacio(userId, espacio.id).catch(() => {});
    else removeLocalFollowed(espacio.id);
    onUnfollow(espacio.id);
  }

  const upcoming = wsList?.filter(w => !isPast(w.fecha)) ?? [];
  const past = wsList?.filter(w => isPast(w.fecha)) ?? [];

  return (
    <div>
      <button onClick={onBack} className="flex items-center gap-1 text-sm text-[#E85D4A] hover:underline mb-4">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        Mis espacios
      </button>
      <div className="flex items-center gap-4 mb-5">
        <div className={`w-16 h-16 flex items-center justify-center overflow-hidden shrink-0 ${espacio.logoShape !== 'square' ? 'rounded-full' : 'rounded-xl'} border border-[#EDE8DE]`}
          style={{ backgroundColor: espacio.logoUrl ? 'transparent' : primary + '18' }}>
          {espacio.logoUrl ? <img src={espacio.logoUrl} alt="" className="w-full h-full object-cover" />
            : <span className="text-2xl font-bold" style={{ color: primary }}>{espacio.nombre?.charAt(0)?.toUpperCase()}</span>}
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="font-display text-lg text-[#1A1611] leading-tight">{espacio.nombre}</h2>
          {espacio.rubroPersonalizado && <p className="text-xs text-[#9B9083] mt-0.5">{espacio.rubroPersonalizado}</p>}
        </div>
      </div>
      <div className="flex gap-2 mb-6">
        <Link to={`/p/${espacio.id}`} className="flex-1 text-center py-2 rounded-xl text-xs font-semibold border border-[#D2C4A8] text-[#2B241A] hover:bg-[#F0EAE0] transition-colors">Ver página pública</Link>
        <button onClick={handleUnfollow} disabled={unfollowing} className="px-3 py-2 rounded-xl text-xs font-semibold border border-red-200 text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50">Dejar de seguir</button>
      </div>
      {loading && <div className="flex items-center justify-center py-12"><div className="w-6 h-6 rounded-full border-2 border-[#E85D4A] border-t-transparent animate-spin" /></div>}
      {!loading && wsList?.length === 0 && <div className="text-center py-10"><p className="text-sm text-[#6B5F4C]">Este espacio no tiene talleres publicados aún.</p></div>}
      {!loading && upcoming.length > 0 && (
        <section className="mb-6">
          <h3 className="text-xs font-semibold text-[#9B9083] uppercase tracking-wide mb-3">Próximos talleres</h3>
          <div className="flex flex-col gap-3">{upcoming.map(ws => <WorkshopCard key={ws.id} ws={ws} espacio={espacio} />)}</div>
        </section>
      )}
      {!loading && past.length > 0 && (
        <section>
          <h3 className="text-xs font-semibold text-[#9B9083] uppercase tracking-wide mb-3">Finalizados</h3>
          <div className="flex flex-col gap-3">{past.map(ws => <WorkshopCard key={ws.id} ws={ws} espacio={espacio} />)}</div>
        </section>
      )}
    </div>
  );
}

// ── MAIN: Inicio ─────────────────────────────────────────────────────────────

export default function Inicio() {
  useLayoutEffect(() => {
    const root = document.documentElement;
    const prev = root.getAttribute('data-theme');
    root.removeAttribute('data-theme');
    return () => { if (prev) root.setAttribute('data-theme', prev); };
  }, []);

  const [currentUser,  setCurrentUser]  = useState(undefined);
  const [espacios,     setEspacios]     = useState(null);
  const [selectedId,   setSelectedId]   = useState(null);
  const [showScanner,  setShowScanner]  = useState(false);
  const [authSheet,    setAuthSheet]    = useState(null); // 'login' | 'register' | null
  const [refreshKey,   setRefreshKey]   = useState(0);

  useEffect(() => { checkRedirectResult().then(r => { if (r) setCurrentUser({ user: r.user, profile: r.profile ?? {} }); }).catch(() => {}); }, []);
  useEffect(() => {
    return subscribeAuth((user, profile) => {
      if (!user) { setCurrentUser(null); setEspacios(null); return; }
      setCurrentUser({ user, profile: profile ?? {} });
    });
  }, []);

  useEffect(() => {
    async function load() {
      const ids = currentUser?.user?.uid
        ? await getEspaciosSeguidos(currentUser.user.uid).catch(() => getLocalFollowed())
        : getLocalFollowed();
      if (ids.length === 0) { setEspacios([]); return; }
      const list = await Promise.all(ids.map(id => espaciosApi.get(id).catch(() => null)));
      setEspacios(list.filter(Boolean));
    }
    if (currentUser !== undefined) load();
  }, [currentUser, refreshKey]);

  function handleUnfollow(espacioId) { setSelectedId(null); setEspacios(prev => prev?.filter(e => e.id !== espacioId) ?? []); }
  function handleAuthSuccess({ user, profile }) {
    setCurrentUser({ user, profile: profile ?? {} });
    syncFollowedToFirestore(user.uid).catch(() => {});
    setRefreshKey(r => r + 1);
  }
  function handleLogout() { logout(); setCurrentUser(null); setEspacios(null); setSelectedId(null); }
  function handleQRFound(espacioId) { setRefreshKey(r => r + 1); setSelectedId(espacioId); }

  const selectedEspacio = espacios?.find(e => e.id === selectedId) ?? null;
  const isAuthed = !!currentUser;

  // ── NOT AUTHENTICATED: Landing ──────────────────────────────────────────
  if (currentUser === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(148deg, #E85D4A 0%, #C4412F 48%, #8C2E1F 100%)' }}>
        <div className="w-8 h-8 rounded-full border-2 border-white border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!isAuthed) {
    return (
      <div className="min-h-screen overflow-hidden relative" style={{ background: 'linear-gradient(148deg, #E85D4A 0%, #C4412F 48%, #8C2E1F 100%)' }}>
        <HeroNetwork />

        {authSheet && <AuthSheet mode={authSheet} onClose={() => setAuthSheet(null)} onSuccess={handleAuthSuccess} />}

        {/* Nav */}
        <nav className="relative z-10 w-full max-w-6xl mx-auto px-5 pt-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <IconAntologico size={30} />
            <span className="text-base font-semibold text-white" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
              Antológico
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setAuthSheet('login')}
              className="px-4 py-2 border border-white/30 text-white text-sm font-medium rounded-lg hover:bg-white/10 transition-colors">
              Ingresar
            </button>
            <button onClick={() => setAuthSheet('register')}
              className="px-4 py-2 bg-white text-[#C4412F] text-sm font-semibold rounded-lg hover:bg-white/90 transition-colors shadow-lg">
              Registrarse
            </button>
          </div>
        </nav>

        {/* Hero content */}
        <div className="relative z-10 flex flex-col items-center justify-center px-6 pt-10 pb-16 text-center">
          <div className="w-full" style={{ maxWidth: 480 }}>
            <LogoAntologico theme="coral" width={480} />
          </div>

          <p className="mt-6 text-base sm:text-lg max-w-md leading-relaxed" style={{ color: 'rgba(255,255,255,0.78)' }}>
            Descubrí talleres de arte, yoga, cocina, música y mucho más.
            Reservá tu lugar y gestioná todo desde un solo lugar.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={() => setAuthSheet('register')}
              className="px-7 py-3.5 bg-white font-semibold text-sm rounded-lg hover:bg-white/90 transition-colors shadow-lg"
              style={{ color: '#C4412F' }}
            >
              Crear mi cuenta gratis →
            </button>
            <button
              onClick={() => setAuthSheet('login')}
              className="px-7 py-3.5 border border-white/35 text-white text-sm font-medium rounded-lg hover:bg-white/10 transition-colors"
            >
              Ya tengo cuenta
            </button>
          </div>
        </div>

        {/* Features */}
        <div className="relative z-10 px-5 pb-16">
          <div className="max-w-lg mx-auto grid grid-cols-2 gap-3">
            {STUDENT_FEATURES.map(({ icon, title, desc }) => (
              <div key={title}
                className="rounded-2xl p-4 border border-white/15 transition-colors"
                style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(8px)' }}
              >
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white/80 mb-3">
                  {FEATURE_ICONS[icon]}
                </div>
                <h3 className="text-sm font-semibold text-white mb-1">{title}</h3>
                <p className="text-xs text-white/60 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 text-center py-6 text-xs text-white/30 border-t border-white/10">
          Powered by <span className="font-semibold">Antológico</span>
        </div>
      </div>
    );
  }

  // ── AUTHENTICATED: Home ─────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#FAF8F4] flex flex-col">
      {showScanner && <QRScannerModal onClose={() => setShowScanner(false)} onFound={handleQRFound} userId={currentUser?.user?.uid} />}

      {/* Header */}
      <div className="w-full bg-[#E85D4A] px-4 pt-5 pb-7">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <IconAntologico size={28} />
            <span className="text-sm font-semibold text-white" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Antológico</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setShowScanner(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/30 hover:bg-white/10 transition-colors text-white text-xs font-semibold">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
                <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="3" height="3"/>
              </svg>
              QR
            </button>
            <button onClick={handleLogout}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-white/30 hover:bg-white/10 transition-colors text-white">
              Salir
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 max-w-lg mx-auto w-full px-4 py-6">
        <p className="text-sm text-[#6B5F4C] mb-5">
          Hola, <span className="font-semibold text-[#2B241A]">{currentUser.profile?.nombre?.split(' ')[0] ?? currentUser.user?.email}</span>
        </p>

        {espacios === null && (
          <div className="flex items-center justify-center py-12"><div className="w-6 h-6 rounded-full border-2 border-[#E85D4A] border-t-transparent animate-spin" /></div>
        )}

        {espacios && espacios.length === 0 && !selectedId && (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-[#F0EAE0] flex items-center justify-center mx-auto mb-4">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#9B9083" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </div>
            <h3 className="font-display text-lg text-[#1A1611] mb-2">No seguís ningún espacio</h3>
            <p className="text-sm text-[#6B5F4C] mb-6 max-w-xs mx-auto">Escaneá un código QR o visitá la página de un espacio para empezar a seguirlo.</p>
            <button onClick={() => setShowScanner(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-[#E85D4A] text-white hover:bg-[#c94a38] transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
                <rect x="3" y="14" width="7" height="7" rx="1"/>
              </svg>
              Escanear QR de un espacio
            </button>
          </div>
        )}

        {selectedEspacio && (
          <EspacioDetail espacio={selectedEspacio} userId={currentUser.user?.uid} onBack={() => setSelectedId(null)} onUnfollow={handleUnfollow} />
        )}

        {espacios && espacios.length > 0 && !selectedId && (
          <>
            <h2 className="text-xs font-semibold text-[#9B9083] uppercase tracking-wide mb-3">Mis espacios</h2>
            <div className="grid grid-cols-3 gap-3 mb-6">
              {espacios.map(esp => <EspacioCard key={esp.id} espacio={esp} onSelect={setSelectedId} />)}
              <button onClick={() => setShowScanner(true)}
                className="flex flex-col items-center justify-center gap-2 p-3 rounded-2xl border-2 border-dashed border-[#D2C4A8] hover:border-[#E85D4A] hover:bg-[#E85D4A]/5 transition-colors min-h-[120px]">
                <div className="w-10 h-10 rounded-full bg-[#F0EAE0] flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9B9083" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                </div>
                <p className="text-[10px] text-[#9B9083] font-medium">Agregar</p>
              </button>
            </div>
          </>
        )}
      </div>

      {/* Bottom nav — only when authenticated */}
      <nav className="sticky bottom-0 bg-white border-t border-[#EDE8DE] px-4 py-2 mt-auto">
        <div className="max-w-lg mx-auto flex justify-around">
          <Link to="/inicio" className="flex flex-col items-center gap-0.5 py-1 text-[#E85D4A]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            <span className="text-[10px] font-semibold">Inicio</span>
          </Link>
          <Link to="/mis-reservas" className="flex flex-col items-center gap-0.5 py-1 text-[#9B9083] hover:text-[#6B5F4C]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            <span className="text-[10px] font-semibold">Reservas</span>
          </Link>
          <Link to="/mis-datos" className="flex flex-col items-center gap-0.5 py-1 text-[#9B9083] hover:text-[#6B5F4C]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
            </svg>
            <span className="text-[10px] font-semibold">Perfil</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}
