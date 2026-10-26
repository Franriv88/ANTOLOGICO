import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import jsQR from 'jsqr';
import { reservas as reservasApi, workshops as workshopsApi, espacios as espaciosApi } from '../services/api';
import { loginGoogle, loginEmail, register, logout, subscribeAuth, authErrorMsg, sendPasswordReset, checkRedirectResult, getAuthCurrentUser, followEspacio, unfollowEspacio, getEspaciosSeguidos, syncFollowedToFirestore } from '../services/userAuth';
import MobileAppShell from '../components/MobileAppShell';

// ── Espacios seguidos (localStorage) ─────────────────────────────────────────
const LS_KEY = 'ant_espacios_seguidos';
function getFollowed() {
  try { return JSON.parse(localStorage.getItem(LS_KEY) ?? '[]'); } catch { return []; }
}
function addFollowed(id) {
  const prev = getFollowed();
  if (!prev.includes(id)) localStorage.setItem(LS_KEY, JSON.stringify([...prev, id]));
}
function removeFollowed(id) {
  localStorage.setItem(LS_KEY, JSON.stringify(getFollowed().filter(x => x !== id)));
}

function contrastText(hex) {
  if (!hex?.startsWith('#') || hex.length < 7) return '#ffffff';
  const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
  return (0.299*r + 0.587*g + 0.114*b)/255 > 0.5 ? '#1A1611' : '#ffffff';
}

function formatFecha(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('es-AR', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
}
function formatHora(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
}
function isPast(iso) {
  return iso ? new Date(iso).getTime() < Date.now() : false;
}

// ── AuthPanel ─────────────────────────────────────────────────────────────────

function AuthPanel({ onSuccess }) {
  const [tab,      setTab]      = useState('login');
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [nombre,   setNombre]   = useState('');
  const [telefono, setTelefono] = useState('');
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');
  const [resetMode, setResetMode] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetDone, setResetDone]   = useState(false);

  const INPUT = 'w-full px-3 py-2 bg-white border border-[#D2C4A8] rounded-lg text-sm text-[#2B241A] focus:outline-none focus:ring-2 focus:ring-[#E85D4A] focus:ring-offset-1';
  const LABEL = 'block text-xs font-medium text-[#6B5F4C] mb-1';

  async function handleGoogle() {
    setLoading('google'); setError('');
    try   { onSuccess(await loginGoogle()); }
    catch (e) { setError(authErrorMsg(e.code)); setLoading(false); }
  }

  async function handleSubmit(e) {
    e.preventDefault(); setLoading('form'); setError('');
    try {
      if (tab === 'login') {
        onSuccess(await loginEmail(email, password));
      } else {
        if (!nombre.trim()) { setError('El nombre es requerido'); setLoading(false); return; }
        onSuccess(await register(email, password, nombre.trim(), telefono.trim()));
      }
    } catch (e) { setError(authErrorMsg(e.code)); setLoading(false); }
  }

  async function handleReset(e) {
    e.preventDefault(); setLoading('reset');
    try { await sendPasswordReset(resetEmail); setResetDone(true); }
    catch { setError('No pudimos enviar el email. Intentá de nuevo.'); }
    finally { setLoading(false); }
  }

  if (resetMode) return (
    <div className="bg-[#FAF8F4] border border-[#D2C4A8] rounded-2xl p-6 w-full max-w-sm mx-auto">
      <h3 className="font-display text-lg text-[#1A1611] mb-1">Recuperar contraseña</h3>
      {resetDone ? (
        <>
          <p className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 mb-4">¡Listo! Revisá tu email.</p>
          <button onClick={() => { setResetMode(false); setResetDone(false); }} className="text-sm text-[#E85D4A] hover:underline">← Volver</button>
        </>
      ) : (
        <form onSubmit={handleReset} className="flex flex-col gap-3 mt-4">
          <div>
            <label className={LABEL}>Email</label>
            <input type="email" value={resetEmail} onChange={e => setResetEmail(e.target.value)} autoFocus className={INPUT} />
          </div>
          {error && <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>}
          <button type="submit" disabled={!!loading} className="w-full py-2.5 rounded-xl text-sm font-bold bg-[#E85D4A] text-white disabled:opacity-50">
            {loading === 'reset' ? 'Enviando…' : 'Enviar enlace'}
          </button>
          <button type="button" onClick={() => setResetMode(false)} className="text-xs text-[#6B5F4C] hover:text-[#1A1611] text-center">← Volver</button>
        </form>
      )}
    </div>
  );

  return (
    <div className="bg-[#FAF8F4] border border-[#D2C4A8] rounded-2xl p-6 w-full max-w-sm mx-auto">
      <h2 className="font-display text-xl text-[#1A1611] mb-1">Mis reservas</h2>
      <p className="text-sm text-[#6B5F4C] mb-5">Ingresá para ver y gestionar tus reservas.</p>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-[#F0EAE0] rounded-xl mb-4">
        {['login', 'register'].map(t => (
          <button key={t} type="button" onClick={() => { setTab(t); setError(''); }}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-colors ${tab === t ? 'bg-white shadow-sm text-[#1A1611]' : 'text-[#6B5F4C] hover:text-[#1A1611]'}`}>
            {t === 'login' ? 'Ingresar' : 'Crear cuenta'}
          </button>
        ))}
      </div>

      {/* Google */}
      <button type="button" onClick={handleGoogle} disabled={!!loading}
        className="w-full flex items-center justify-center gap-3 py-2.5 px-4 border border-[#D2C4A8] rounded-xl bg-white hover:bg-[#F8F5F0] transition-colors text-sm font-medium text-[#1A1611] mb-4 disabled:opacity-60">
        <svg width="18" height="18" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        {loading === 'google' ? 'Conectando…' : 'Continuar con Google'}
      </button>

      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 h-px bg-[#D2C4A8]" /><span className="text-xs text-[#9B9083]">o</span><div className="flex-1 h-px bg-[#D2C4A8]" />
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        {tab === 'register' && (
          <>
            <div>
              <label className={LABEL}>Nombre completo *</label>
              <input type="text" value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Tu nombre" autoFocus className={INPUT} />
            </div>
            <div>
              <label className={LABEL}>Teléfono</label>
              <input type="tel" value={telefono} onChange={e => setTelefono(e.target.value)} placeholder="+54 9 11 1234-5678" className={INPUT} />
            </div>
          </>
        )}
        <div>
          <label className={LABEL}>Email *</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="tu@email.com" autoFocus={tab === 'login'} className={INPUT} />
        </div>
        <div>
          <label className={LABEL}>Contraseña *</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder={tab === 'register' ? 'Mínimo 6 caracteres' : '••••••••'} className={INPUT} />
          {tab === 'login' && (
            <button type="button" onClick={() => { setResetEmail(email); setResetMode(true); }}
              className="text-xs text-[#9B9083] hover:text-[#6B5F4C] mt-1.5 float-right transition-colors">
              ¿Olvidaste tu contraseña?
            </button>
          )}
        </div>
        {error && <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 clear-both">{error}</p>}
        <button type="submit" disabled={!!loading}
          className="w-full py-2.5 rounded-xl text-sm font-bold bg-[#E85D4A] text-white disabled:opacity-50 mt-1 clear-both">
          {loading === 'form' ? (tab === 'login' ? 'Ingresando…' : 'Creando cuenta…') : (tab === 'login' ? 'Ingresar' : 'Crear cuenta')}
        </button>
      </form>
    </div>
  );
}

// ── QRScannerModal ────────────────────────────────────────────────────────────

function QRScannerModal({ onClose, userId }) {
  const navigate    = useNavigate();
  const videoRef    = useRef(null);
  const canvasRef   = useRef(null);
  const streamRef   = useRef(null);
  const rafRef      = useRef(null);
  const [phase,     setPhase]     = useState('starting'); // 'starting'|'scanning'|'found'|'error'
  const [errMsg,    setErrMsg]    = useState('');
  const [found,     setFound]     = useState(null);       // { url, espacioId, nombre }
  const [followed,  setFollowed]  = useState(false);

  function stopCamera() {
    cancelAnimationFrame(rafRef.current);
    streamRef.current?.getTracks().forEach(t => t.stop());
  }

  function handleClose() { stopCamera(); onClose(); }

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: { ideal: 'environment' } } })
      .then(stream => {
        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
        setPhase('scanning');
      })
      .catch(() => { setErrMsg('No se pudo acceder a la cámara. Revisá los permisos.'); setPhase('error'); });
    return stopCamera;
  }, []);

  const tick = useCallback(() => {
    const video  = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || video.readyState < video.HAVE_ENOUGH_DATA) {
      rafRef.current = requestAnimationFrame(tick);
      return;
    }
    canvas.width  = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    ctx.drawImage(video, 0, 0);
    const img  = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(img.data, img.width, img.height, { inversionAttempts: 'dontInvert' });
    if (code?.data) {
      handleQRData(code.data);
      return;
    }
    rafRef.current = requestAnimationFrame(tick);
  }, []); // eslint-disable-line

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
      const alreadyFollowed = userId
        ? (await getEspaciosSeguidos(userId).catch(() => getFollowed())).includes(espacioId)
        : getFollowed().includes(espacioId);
      let nombre = '';
      try {
        const esp = await espaciosApi.get(espacioId);
        nombre = esp?.nombre ?? '';
      } catch { /* silent */ }

      // Seguir automáticamente si todavía no lo sigue
      if (!alreadyFollowed) {
        if (userId) await followEspacio(userId, espacioId).catch(() => {});
        else addFollowed(espacioId);
      }

      setFound({ url: raw, espacioId, nombre });
      setFollowed(true);
      setPhase('found');
    } catch {
      setErrMsg('El QR escaneado no contiene una URL válida.'); setPhase('error');
    }
  }

  function handleGo() {
    if (!found) return;
    handleClose();
    navigate(`/p/${found.espacioId}`);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/70" onClick={handleClose} />
      <div className="relative bg-[#FAF8F4] rounded-t-3xl sm:rounded-2xl w-full sm:max-w-sm overflow-hidden">
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 rounded-full bg-[#D2C4A8]" />
        </div>

        <div className="px-5 pb-6 pt-2 sm:pt-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-lg text-[#1A1611]">Escanear QR</h3>
            <button onClick={handleClose} className="p-1 rounded-lg text-[#9B9083] hover:text-[#1A1611] hover:bg-[#F0EAE0] transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          {phase === 'starting' && (
            <div className="flex flex-col items-center justify-center py-10 gap-3">
              <div className="w-8 h-8 rounded-full border-2 border-[#E85D4A] border-t-transparent animate-spin" />
              <p className="text-sm text-[#6B5F4C]">Activando cámara…</p>
            </div>
          )}

          {phase === 'error' && (
            <div className="py-6 text-center">
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-4">{errMsg}</p>
              <button onClick={handleClose}
                className="px-4 py-2 rounded-xl text-sm font-semibold bg-[#E85D4A] text-white hover:bg-[#c94a38] transition-colors">
                Cerrar
              </button>
            </div>
          )}

          {(phase === 'scanning' || phase === 'starting') && (
            <div className="relative rounded-2xl overflow-hidden bg-black aspect-square">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              {/* Viewfinder */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-48 h-48 relative">
                  {['tl','tr','bl','br'].map(corner => (
                    <div key={corner} className={`absolute w-8 h-8 border-white/80 border-2
                      ${corner === 'tl' ? 'top-0 left-0 border-r-0 border-b-0 rounded-tl-lg' : ''}
                      ${corner === 'tr' ? 'top-0 right-0 border-l-0 border-b-0 rounded-tr-lg' : ''}
                      ${corner === 'bl' ? 'bottom-0 left-0 border-r-0 border-t-0 rounded-bl-lg' : ''}
                      ${corner === 'br' ? 'bottom-0 right-0 border-l-0 border-t-0 rounded-br-lg' : ''}
                    `} />
                  ))}
                </div>
              </div>
            </div>
          )}

          {phase === 'found' && found && (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col items-center py-4 gap-2">
                <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <p className="text-sm font-semibold text-[#1A1611]">¡Ahora seguís este espacio!</p>
                {found.nombre && (
                  <p className="text-base font-display font-semibold text-[#E85D4A]">{found.nombre}</p>
                )}
              </div>

              <button
                onClick={handleGo}
                className="w-full py-2.5 rounded-xl text-sm font-bold bg-[#E85D4A] text-white hover:bg-[#c94a38] transition-colors">
                Ver espacio
              </button>

              <button
                onClick={handleClose}
                className="w-full py-2.5 rounded-xl text-sm font-semibold border border-[#D2C4A8] text-[#2B241A] hover:bg-[#F0EAE0] transition-colors">
                Listo
              </button>
            </div>
          )}

          <canvas ref={canvasRef} className="hidden" />
          <p className="text-center text-xs text-[#9B9083] mt-4">
            {phase === 'scanning' ? 'Apuntá la cámara al código QR del espacio' : ''}
          </p>
        </div>
      </div>
    </div>
  );
}

// ── EspaciosSeguidos ──────────────────────────────────────────────────────────

function EspaciosSeguidos({ userId, onUnfollow }) {
  const [items,   setItems]   = useState(null);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    async function load() {
      const ids = userId
        ? await getEspaciosSeguidos(userId).catch(() => getFollowed())
        : getFollowed();
      if (ids.length === 0) { setItems([]); return; }
      const list = await Promise.all(ids.map(id => espaciosApi.get(id).catch(() => null)));
      setItems(list.filter(Boolean));
    }
    load();
  }, [userId, refresh]);

  async function handleUnfollow(id) {
    if (userId) {
      await unfollowEspacio(userId, id).catch(() => {});
    } else {
      removeFollowed(id);
    }
    onUnfollow?.();
    setRefresh(r => r + 1);
  }

  if (items === null || items.length === 0) return null;

  return (
    <section className="mb-8">
      <h2 className="text-xs font-semibold text-[#9B9083] uppercase tracking-wide mb-3">Espacios seguidos</h2>
      <div className="flex flex-col gap-2">
        {items.map(esp => (
          <div key={esp.id} className="flex items-center justify-between gap-3 bg-white border border-[#EDE8DE] rounded-xl px-4 py-3">
            <Link to={`/p/${esp.id}`} className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[#E85D4A] hover:underline truncate">{esp.nombre}</p>
              {esp.rubro?.nombre && <p className="text-xs text-[#9B9083] truncate">{esp.rubro.nombre}</p>}
            </Link>
            <button
              onClick={() => handleUnfollow(esp.id)}
              title="Dejar de seguir"
              className="shrink-0 text-xs text-[#9B9083] hover:text-red-500 border border-[#D2C4A8] hover:border-red-300 rounded-lg px-2.5 py-1 transition-colors">
              Dejar
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── ReservaCard ───────────────────────────────────────────────────────────────

function ReservaCard({ reserva, onCancel }) {
  const ws = reserva.workshop;
  const espacio = reserva.espacio;
  const isCancelada = reserva.estado === 'CANCELADA';
  const isVencida   = !isCancelada && isPast(ws?.fecha);

  const accentColor = espacio?.brandColors?.roles?.primary
    || (Array.isArray(espacio?.brandColors) ? espacio.brandColors[0] : null)
    || '#E85D4A';

  const headerBg = ws?.headerType === 'COLOR' && ws?.headerValue ? ws.headerValue : accentColor;

  return (
    <div className={`rounded-2xl overflow-hidden border bg-[#FAF8F4] flex flex-col shadow-sm ${isCancelada || isVencida ? 'opacity-60' : ''}`} style={{ borderColor: '#D2C4A8' }}>
      {/* Color strip from workshop header */}
      <div className="h-1.5 shrink-0" style={{ backgroundColor: headerBg }} />

      <div className="p-4 flex flex-col gap-2">
        {/* Space name */}
        {espacio?.nombre && (
          <Link to={`/p/${espacio.id}`} className="text-xs font-semibold text-[#E85D4A] hover:underline self-start">
            {espacio.nombre}
          </Link>
        )}

        {/* Workshop name */}
        <h3 className="font-bold text-[#1A1611] text-sm leading-snug">{ws?.nombre ?? '—'}</h3>

        {/* Date + time */}
        {ws?.fecha && (
          <p className="text-xs font-mono text-[#6B5F4C] capitalize">
            {formatFecha(ws.fecha)} · {formatHora(ws.fecha)}
          </p>
        )}

        {/* Price */}
        {ws?.precio != null && (
          <p className="text-xs font-mono font-bold text-[#2B241A]">
            {new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(ws.precio)}
          </p>
        )}

        {/* Booking ID */}
        <p className="text-xs font-mono text-[#9B9083]">#{reserva.id.slice(-8).toUpperCase()}</p>

        <div className="flex items-center justify-between gap-2 mt-1 pt-2 border-t border-[#EDE8DE]">
          {/* Status badge */}
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
            isCancelada ? 'bg-[#F2EDE3] text-[#9B9083]' :
            isVencida   ? 'bg-[#EDE8DE] text-[#9B9083]' :
                          'bg-emerald-100 text-emerald-700'
          }`}>
            {isCancelada ? 'Cancelada' : isVencida ? 'Finalizada' : 'Confirmada'}
          </span>

          {!isCancelada && !isVencida && (
            <button
              onClick={() => onCancel(reserva.id)}
              className="text-xs text-[#9B9083] hover:text-red-500 transition-colors border border-[#D2C4A8] rounded-lg px-2.5 py-1 hover:border-red-300">
              Cancelar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── MisReservas ───────────────────────────────────────────────────────────────

export default function MisReservas() {
  useLayoutEffect(() => {
    const root = document.documentElement;
    const prev = root.getAttribute('data-theme');
    root.removeAttribute('data-theme');
    return () => { if (prev) root.setAttribute('data-theme', prev); };
  }, []);
  const [currentUser,  setCurrentUser]  = useState(() => {
    const u = getAuthCurrentUser();
    return u ? { user: u, profile: {} } : undefined;
  });
  const [reservas,     setReservas]     = useState([]);
  const [loadingR,     setLoadingR]     = useState(false);
  const [showScanner,  setShowScanner]  = useState(false);

  useEffect(() => {
    checkRedirectResult().then(result => {
      if (result) {
        setCurrentUser({ user: result.user, profile: result.profile ?? {} });
        loadReservas(result.user.email ?? result.profile?.email ?? '');
      }
    }).catch(() => {});
  }, []);

  useEffect(() => {
    return subscribeAuth((user, profile) => {
      if (!user) { setCurrentUser(null); setReservas([]); return; }
      setCurrentUser({ user, profile: profile ?? {} });
      loadReservas(user.email ?? profile?.email ?? '');
    });
  }, []);

  async function loadReservas(email) {
    if (!email) return;
    setLoadingR(true);
    try {
      const list = await reservasApi.listByEmail(email);
      // Enrich with workshop + espacio data
      const wsIds  = [...new Set(list.map(r => r.workshopId))];
      const wsMap  = {};
      await Promise.all(wsIds.map(async id => {
        const ws = await workshopsApi.get(id);
        if (ws) wsMap[id] = ws;
      }));

      const espIds = [...new Set(Object.values(wsMap).map(w => w?.espacioId).filter(Boolean))];
      const espMap = {};
      await Promise.all(espIds.map(async id => {
        const esp = await espaciosApi.get(id);
        if (esp) espMap[id] = esp;
      }));

      setReservas(list.map(r => ({
        ...r,
        workshop: wsMap[r.workshopId] ?? null,
        espacio:  espMap[wsMap[r.workshopId]?.espacioId] ?? null,
      })));
    } finally {
      setLoadingR(false);
    }
  }

  async function handleCancel(reservaId) {
    await reservasApi.cancel(reservaId);
    setReservas(prev => prev.map(r => r.id === reservaId ? { ...r, estado: 'CANCELADA' } : r));
  }

  function handleLogout() {
    logout();
    setCurrentUser(null);
    setReservas([]);
  }

  // Sort: upcoming first, then past, then cancelled
  const sorted = [...reservas].sort((a, b) => {
    const score = r => r.estado === 'CANCELADA' ? 2 : isPast(r.workshop?.fecha) ? 1 : 0;
    const diff  = score(a) - score(b);
    if (diff !== 0) return diff;
    const da = a.workshop?.fecha ? new Date(a.workshop.fecha).getTime() : Infinity;
    const db = b.workshop?.fecha ? new Date(b.workshop.fecha).getTime() : Infinity;
    return da - db;
  });

  const upcoming  = sorted.filter(r => r.estado !== 'CANCELADA' && !isPast(r.workshop?.fecha));
  const past      = sorted.filter(r => r.estado !== 'CANCELADA' && isPast(r.workshop?.fecha));
  const cancelled = sorted.filter(r => r.estado === 'CANCELADA');

  return (
    <MobileAppShell
      title="Antológico"
      subtitle="Mis reservas"
      isAuthed={!!currentUser}
      onLogout={handleLogout}
      showQR
      onShowQR={() => setShowScanner(true)}
    >
      {showScanner && <QRScannerModal onClose={() => setShowScanner(false)} userId={currentUser?.user?.uid} />}

      <div className="max-w-lg mx-auto px-4 py-8 w-full">
        {/* Not authenticated */}
        {currentUser === null && (
          <>
            <EspaciosSeguidos />
            <AuthPanel onSuccess={({ user, profile }) => {
              setCurrentUser({ user, profile: profile ?? {} });
              loadReservas(user.email ?? profile?.email ?? '');
              syncFollowedToFirestore(user.uid).catch(() => {});
            }} />
          </>
        )}

        {/* Loading auth */}
        {currentUser === undefined && (
          <div className="flex items-center justify-center py-16">
            <div className="w-7 h-7 rounded-full border-2 border-[#E85D4A] border-t-transparent animate-spin" />
          </div>
        )}

        {/* Authenticated */}
        {currentUser && (
          <>
            <p className="text-sm text-[#6B5F4C] mb-6">
              Hola, <span className="font-semibold text-[#2B241A]">{currentUser.profile?.nombre?.split(' ')[0] ?? currentUser.user?.email}</span>
            </p>

            <EspaciosSeguidos userId={currentUser.user?.uid} />

            {loadingR && (
              <div className="flex items-center justify-center py-12">
                <div className="w-6 h-6 rounded-full border-2 border-[#E85D4A] border-t-transparent animate-spin" />
              </div>
            )}

            {!loadingR && reservas.length === 0 && (
              <div className="text-center py-16">
                <div className="w-14 h-14 rounded-full bg-[#F0EAE0] flex items-center justify-center mx-auto mb-4">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9B9083" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                </div>
                <p className="text-sm text-[#6B5F4C] mb-1">No tenés reservas todavía.</p>
                <p className="text-xs text-[#9B9083]">Cuando reserves un taller, lo vas a ver acá.</p>
              </div>
            )}

            {!loadingR && upcoming.length > 0 && (
              <section className="mb-8">
                <h2 className="text-xs font-semibold text-[#9B9083] uppercase tracking-wide mb-3">Próximos</h2>
                <div className="flex flex-col gap-3">
                  {upcoming.map(r => <ReservaCard key={r.id} reserva={r} onCancel={handleCancel} />)}
                </div>
              </section>
            )}

            {!loadingR && past.length > 0 && (
              <section className="mb-8">
                <h2 className="text-xs font-semibold text-[#9B9083] uppercase tracking-wide mb-3">Finalizados</h2>
                <div className="flex flex-col gap-3">
                  {past.map(r => <ReservaCard key={r.id} reserva={r} onCancel={handleCancel} />)}
                </div>
              </section>
            )}

            {!loadingR && cancelled.length > 0 && (
              <section className="mb-8">
                <h2 className="text-xs font-semibold text-[#9B9083] uppercase tracking-wide mb-3">Canceladas</h2>
                <div className="flex flex-col gap-3">
                  {cancelled.map(r => <ReservaCard key={r.id} reserva={r} onCancel={handleCancel} />)}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </MobileAppShell>
  );
}
