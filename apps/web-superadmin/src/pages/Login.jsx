import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';

// Red neuronal — coordenadas del logo Antológico
const EDGES = [
  [256,108,392,128],[256,108,184,190],[256,108,315,198],[184,190,315,198],
  [315,198,392,128],[392,128,522,190],[522,190,656,158],[184,190,140,238],
  [315,198,268,240],[392,128,400,235],[522,190,548,238],[656,158,712,244],
  [213,413,150,345],[213,413,365,445],[365,445,322,348],[365,445,446,392],
  [446,392,430,348],[446,392,561,428],[561,428,598,350],[561,428,692,390],
  [692,390,740,345],
];
const NODES_CORAL = [[392,128],[184,190],[656,158],[365,445],[692,390]];
const NODES_OCRE  = [[315,198],[522,190],[213,413],[561,428]];
const HUBS        = [[256,108],[446,392]];

// Logo SVG completo — tema Carbón
function LogoCarbonSVG({ width = 280 }) {
  const h = Math.round(width * 497 / 816);
  return (
    <svg width={width} height={h} viewBox="0 0 816 497" xmlns="http://www.w3.org/2000/svg" aria-label="Antológico">
      <g stroke="#A8907E" strokeWidth="2.8" strokeLinecap="round" strokeDasharray="0.1 6.5" fill="none" opacity="0.65">
        {EDGES.map(([x1,y1,x2,y2],i) => <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}/>)}
      </g>
      <text x="78" y="335" fill="#F4ECE1" fontFamily="'Playfair Display', Georgia, serif" fontWeight="600" fontSize="134" textLength="672" lengthAdjust="spacing">Antológico</text>
      {HUBS.map(([cx,cy],i)         => <circle key={i} cx={cx} cy={cy} r="6"  fill="#B8923A"/>)}
      {NODES_CORAL.map(([cx,cy],i)  => <circle key={i} cx={cx} cy={cy} r="29" fill="#E35D4A"/>)}
      {NODES_OCRE.map(([cx,cy],i)   => <circle key={i} cx={cx} cy={cy} r="29" fill="#B8923A"/>)}
      <g fill="none" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <g transform="translate(378 114) scale(1.1667)">
          <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.9 0 1.7-.8 1.7-1.7 0-.4-.2-.8-.4-1.1-.3-.3-.4-.7-.4-1.1 0-.9.8-1.7 1.7-1.7h2c3.1 0 5.6-2.5 5.6-5.6C22 6 17.5 2 12 2z"/>
          <g fill="#FFF" stroke="none"><circle cx="13.5" cy="6.5" r="1.4"/><circle cx="17.5" cy="10.5" r="1.4"/><circle cx="8.5" cy="7.5" r="1.4"/><circle cx="6.5" cy="12.5" r="1.4"/></g>
        </g>
        <g transform="translate(170 176) scale(1.1667)">
          <rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7l2-3h4l2 3"/><circle cx="12" cy="13.5" r="3.5"/>
        </g>
        <g transform="translate(301 184) scale(1.1667)">
          <g transform="rotate(12 15 10)"><path d="M10 4.5c3-1.2 7-1.2 10 0 .4 4.8-.6 9.6-5 11.5-4.4-1.9-5.4-6.7-5-11.5z"/></g>
          <g transform="rotate(-12 9 13.5)"><path d="M4 8c3-1.2 7-1.2 10 0 .4 4.8-.6 9.6-5 11.5C4.6 17.6 3.6 12.8 4 8z" fill="#FFF"/></g>
        </g>
        <g transform="translate(508 176) scale(1.1667)">
          <path d="M9 18V5l11-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="17" cy="16" r="3"/>
        </g>
        <g transform="translate(642 144) scale(1.1667)">
          <path d="M17 21a1 1 0 0 0 1-1v-5.35c0-.457.316-.844.727-1.041a4 4 0 0 0-2.134-7.589 5 5 0 0 0-9.186 0 4 4 0 0 0-2.134 7.588c.411.198.727.585.727 1.041V20a1 1 0 0 0 1 1z"/><path d="M6 17h12"/>
        </g>
        <g transform="translate(199 399) scale(1.1667)">
          <g fill="#FFF" stroke="none">
            <circle cx="12" cy="4.2" r="2.3"/>
            <path d="M9.6 7.2c-1 .2-1.6 1-1.9 2L6 14.2c-.2.6.2 1.2.8 1.3.5.1 1-.2 1.2-.7L9.6 10.6 10 13.6h4l.4-3 1.6 4.2c.2.5.7.8 1.2.7.6-.1 1-.7.8-1.3l-1.7-5c-.3-1-.9-1.8-1.9-2z"/>
            <path d="M3 17.6c0-2 4-3.4 9-3.4s9 1.4 9 3.4-4 2.6-9 2.6-9-.6-9-2.6z"/>
          </g>
        </g>
        <g transform="translate(351 431) scale(1.1667)">
          <g fill="#FFF" stroke="none">
            <circle cx="13" cy="3.5" r="2.1"/>
            <path d="M12.2 6.3c-.9.2-1.4 1-1.3 1.9l.4 3.3-4.3 6.2c-.3.5 0 1.1.6 1.1h8.9c.6 0 .9-.6.6-1.1L13.9 11.4l.1-3.2c0-1-.7-1.9-1.8-1.9z"/>
          </g>
          <path d="M11.6 7.8L7 4.4M13.9 8l4.4 1.8M10.6 18.8l-1.4 3M14.2 18.8l3.6 2.4" strokeWidth="1.9"/>
        </g>
        <g transform="translate(547 414) scale(1.1667)">
          <path d="M15.7 3.3l5 5L18 11l-5-5z M13 6L6.5 7.6 3 21l13.4-3.5L18 11 M3 21l6.6-6.6"/>
          <circle cx="11" cy="13" r="2"/>
        </g>
        <text x="692" y="396" textAnchor="middle" fontFamily="'Playfair Display', Georgia, serif" fontStyle="italic" fontWeight="500" fontSize="15" fill="#FFF" stroke="none">∫cos(x)</text>
      </g>
    </svg>
  );
}

// ─── Estilos reutilizables ────────────────────────────────────────────────────
const LAYER = {
  position: 'absolute',
  inset: 0,
  pointerEvents: 'none',
  willChange: 'transform',
};
// La SVG de fondo es 120% del contenedor para poder mover ±10% sin mostrar bordes
const BG_SVG = {
  position: 'absolute',
  top: '-10%', left: '-10%',
  width: '120%', height: '120%',
};

export default function Login() {
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);
  const [gLoading, setGLoading] = useState(false);
  const navigate  = useNavigate();
  const { admin, denied } = useAuth();

  const edgesRef = useRef(null);
  const nodesRef = useRef(null);
  const hubsRef  = useRef(null);

  useEffect(() => {
    if (admin) navigate('/tenants', { replace: true });
  }, [admin, navigate]);

  useEffect(() => {
    const root = document.documentElement;
    const prev = root.getAttribute('data-theme');
    root.setAttribute('data-theme', 'light');
    return () => { if (prev) root.setAttribute('data-theme', prev); };
  }, []);

  // Parallax directo al DOM — sin re-renders React
  function handleMouseMove(e) {
    const { width, height, left, top } = e.currentTarget.getBoundingClientRect();
    const dx = (e.clientX - left - width  / 2) / (width  / 2); // -1 → 1
    const dy = (e.clientY - top  - height / 2) / (height / 2);
    // Aristas: movimiento suave (capa más lejana)
    if (edgesRef.current) edgesRef.current.style.transform = `translate(${dx * -14}px, ${dy * -14}px)`;
    // Nodos medianos
    if (nodesRef.current) nodesRef.current.style.transform = `translate(${dx * -28}px, ${dy * -28}px)`;
    // Hubs cercanos (más rápido = sensación de profundidad)
    if (hubsRef.current)  hubsRef.current.style.transform  = `translate(${dx * -48}px, ${dy * -48}px)`;
  }

  async function handleGoogleLogin() {
    setError('');
    setGLoading(true);
    try {
      const gp = new GoogleAuthProvider();
      gp.setCustomParameters({ prompt: 'select_account' });
      await signInWithPopup(auth, gp);
    } catch (err) {
      if (err.code !== 'auth/popup-closed-by-user') {
        setError('No se pudo iniciar sesión con Google.');
      }
    } finally {
      setGLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email || !password) { setError('Completá todos los campos'); return; }
    setError('');
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      const msg =
        err.code === 'auth/wrong-password'   ||
        err.code === 'auth/user-not-found'   ||
        err.code === 'auth/invalid-credential'
          ? 'Credenciales incorrectas'
          : err.code === 'auth/invalid-email'
          ? 'Email inválido'
          : 'Error al ingresar. Intentá de nuevo.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden"
      style={{ backgroundColor: '#1A1611' }}
      onMouseMove={handleMouseMove}
    >
      {/* ── Parallax: aristas (capa más lejana) ───────────────────────────── */}
      <div ref={edgesRef} aria-hidden="true"
        style={{ ...LAYER, transition: 'transform 0.9s cubic-bezier(0.25,0.46,0.45,0.94)' }}>
        <svg viewBox="0 0 816 497" fill="none" style={BG_SVG}>
          <g stroke="#A8907E" strokeWidth="2.8" strokeLinecap="round" strokeDasharray="0.1 6.5" opacity="0.28">
            {EDGES.map(([x1,y1,x2,y2],i) => <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}/>)}
          </g>
          {/* Gradiente ocre bajo para dar profundidad */}
          <defs>
            <radialGradient id="gOcre" cx="35%" cy="30%" r="50%">
              <stop offset="0%"  stopColor="#B98527" stopOpacity="0.18"/>
              <stop offset="100%" stopColor="#B98527" stopOpacity="0"/>
            </radialGradient>
            <radialGradient id="gOcre2" cx="70%" cy="75%" r="40%">
              <stop offset="0%"  stopColor="#B98527" stopOpacity="0.12"/>
              <stop offset="100%" stopColor="#B98527" stopOpacity="0"/>
            </radialGradient>
          </defs>
          <rect width="816" height="497" fill="url(#gOcre)"/>
          <rect width="816" height="497" fill="url(#gOcre2)"/>
        </svg>
      </div>

      {/* ── Parallax: nodos (capa media) ──────────────────────────────────── */}
      <div ref={nodesRef} aria-hidden="true"
        style={{ ...LAYER, transition: 'transform 0.6s cubic-bezier(0.25,0.46,0.45,0.94)' }}>
        <svg viewBox="0 0 816 497" fill="none" style={BG_SVG}>
          {NODES_CORAL.map(([cx,cy],i) => <circle key={i} cx={cx} cy={cy} r="29" fill="#E35D4A" opacity="0.20"/>)}
          {NODES_OCRE.map(([cx,cy],i)  => <circle key={i} cx={cx} cy={cy} r="29" fill="#B98527" opacity="0.20"/>)}
        </svg>
      </div>

      {/* ── Parallax: hubs y anillos (capa más cercana) ───────────────────── */}
      <div ref={hubsRef} aria-hidden="true"
        style={{ ...LAYER, transition: 'transform 0.35s cubic-bezier(0.25,0.46,0.45,0.94)' }}>
        <svg viewBox="0 0 816 497" fill="none" style={BG_SVG}>
          {HUBS.map(([cx,cy],i) => (
            <g key={i}>
              <circle cx={cx} cy={cy} r="28" fill="none" stroke="#B98527" strokeWidth="1" opacity="0.25"/>
              <circle cx={cx} cy={cy} r="6"  fill="#B98527" opacity="0.55"/>
            </g>
          ))}
          {/* Anillos ghost en las esquinas */}
          <circle cx="140" cy="238" r="18" fill="none" stroke="#E35D4A" strokeWidth="1.2" opacity="0.18"/>
          <circle cx="712" cy="244" r="18" fill="none" stroke="#E35D4A" strokeWidth="1.2" opacity="0.18"/>
          <circle cx="150" cy="345" r="18" fill="none" stroke="#B98527" strokeWidth="1.2" opacity="0.18"/>
          <circle cx="740" cy="345" r="18" fill="none" stroke="#B98527" strokeWidth="1.2" opacity="0.18"/>
        </svg>
      </div>

      {/* ── Contenido fijo ────────────────────────────────────────────────── */}
      <div className="relative z-10 w-full max-w-sm flex flex-col items-center gap-5">

        {/* Logo + badge */}
        <div className="flex flex-col items-center gap-2.5">
          <LogoCarbonSVG width={288} />
          <div
            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold tracking-widest uppercase"
            style={{ backgroundColor: 'rgba(185,133,39,0.18)', color: '#D4A83A', border: '1px solid rgba(185,133,39,0.35)' }}
          >
            Super Admin
          </div>
        </div>

        {/* Tarjeta dark glass */}
        <div
          className="w-full rounded-2xl p-8"
          style={{
            background: 'rgba(20,17,12,0.72)',
            border: '1px solid rgba(185,133,39,0.18)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            boxShadow: '0 0 0 1px rgba(185,133,39,0.06), 0 32px 80px rgba(0,0,0,0.55)',
          }}
        >
          {denied && (
            <div className="mb-4 text-xs rounded px-3 py-2" style={{ color: '#F87171', background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)' }}>
              Tu cuenta no tiene permisos de administrador.
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'rgba(239,231,216,0.5)' }}>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                placeholder="admin@ejemplo.com"
                autoFocus
                style={{
                  width: '100%', padding: '0.5rem 0.75rem', fontSize: '0.875rem',
                  background: 'rgba(239,231,216,0.06)', border: '1px solid rgba(239,231,216,0.14)',
                  borderRadius: '6px', color: '#F4ECE1', outline: 'none', boxSizing: 'border-box',
                }}
                onFocus={e => { e.target.style.border = '1px solid rgba(185,133,39,0.55)'; e.target.style.boxShadow = '0 0 0 3px rgba(185,133,39,0.12)'; }}
                onBlur={e  => { e.target.style.border = '1px solid rgba(239,231,216,0.14)'; e.target.style.boxShadow = 'none'; }}
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'rgba(239,231,216,0.5)' }}>Contraseña</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(''); }}
                  placeholder="••••••••"
                  style={{
                    width: '100%', padding: '0.5rem 2.5rem 0.5rem 0.75rem', fontSize: '0.875rem',
                    background: 'rgba(239,231,216,0.06)', border: '1px solid rgba(239,231,216,0.14)',
                    borderRadius: '6px', color: '#F4ECE1', outline: 'none', boxSizing: 'border-box',
                  }}
                  onFocus={e => { e.target.style.border = '1px solid rgba(185,133,39,0.55)'; e.target.style.boxShadow = '0 0 0 3px rgba(185,133,39,0.12)'; }}
                  onBlur={e  => { e.target.style.border = '1px solid rgba(239,231,216,0.14)'; e.target.style.boxShadow = 'none'; }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(v => !v)}
                  tabIndex={-1}
                  style={{
                    position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                    color: 'rgba(239,231,216,0.4)', transition: 'color 0.15s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.color = 'rgba(239,231,216,0.7)'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = 'rgba(239,231,216,0.4)'; }}
                >
                  {showPass
                    ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/><path d="M14.12 14.12a3 3 0 1 1-4.24-4.24"/></svg>
                    : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-xs rounded px-3 py-2" style={{ color: '#F87171', background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)' }}>
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg text-sm font-semibold transition-all disabled:opacity-40"
              style={{ backgroundColor: '#B98527', color: '#1A1611' }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.backgroundColor = '#D4A83A'; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#B98527'; }}
            >
              {loading ? 'Ingresando…' : 'Ingresar al panel →'}
            </button>

            <div className="flex items-center gap-3 my-1">
              <div className="flex-1 h-px" style={{ background: 'rgba(239,231,216,0.12)' }} />
              <span className="text-xs" style={{ color: 'rgba(239,231,216,0.3)' }}>o</span>
              <div className="flex-1 h-px" style={{ background: 'rgba(239,231,216,0.12)' }} />
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={gLoading}
              className="w-full py-2.5 rounded-lg text-sm font-medium transition-all disabled:opacity-40 flex items-center justify-center gap-2.5"
              style={{
                background: 'rgba(239,231,216,0.06)',
                border: '1px solid rgba(239,231,216,0.14)',
                color: '#F4ECE1',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,231,216,0.10)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,231,216,0.06)'; }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              {gLoading ? 'Ingresando…' : 'Ingresar con Google'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
