import { useEffect, useLayoutEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
  sendPasswordResetEmail,
  GoogleAuthProvider,
} from 'firebase/auth';
import { auth } from '../lib/firebase';
import { DEMO_MODE, DEMO_EMAIL, DEMO_PASSWORD, createNewDemoSession } from '../lib/demo';
import { useAuth } from '../context/AuthContext';
import { authErrorMsg } from '../services/userAuth';

const provider = new GoogleAuthProvider();
const isDev    = import.meta.env.DEV;

const DEV_EMAIL    = 'dev@antologico.app';
const DEV_PASSWORD = 'dev123456';
const DEV_NAME     = 'Dev User';

const INPUT_CLS =
  'w-full px-3 py-2 bg-surface-100 border border-border rounded-md text-sm text-ink ' +
  'focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary';

// ─── Google SVG ──────────────────────────────────────────────────────────────
function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
      <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
  );
}

export default function Login({ mode = 'login' }) {
  useLayoutEffect(() => {
    const root = document.documentElement;
    const prev = root.getAttribute('data-theme');
    root.removeAttribute('data-theme');
    return () => { if (prev) root.setAttribute('data-theme', prev); };
  }, []);
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);
  const navigate  = useNavigate();
  const { loginDemo } = useAuth();

  // ─── Modo Demo ───────────────────────────────────────────────────────────────
  const [demoEmail, setDemoEmail]       = useState(DEMO_EMAIL);
  const [demoPassword, setDemoPassword] = useState(DEMO_PASSWORD);

  useEffect(() => {
    if (mode === 'register') return;
    if (DEMO_MODE) return;
    if (isDev) handleDevLogin();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  if (DEMO_MODE && mode !== 'register') {
    async function handleDemoLogin(e) {
      e.preventDefault();
      setError('');
      setLoading(true);
      try {
        await loginDemo(demoEmail, demoPassword);
        navigate('/workshops');
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    function handleNewUser() {
      localStorage.removeItem('ant_demo_data');
      createNewDemoSession();
      window.location.href = '/onboarding';
    }

    return (
      <div className="min-h-screen bg-surface-0 flex items-center justify-center px-4">
        <div className="bg-surface-100 border border-border rounded-xl p-8 w-full max-w-sm">
          <div className="mb-6">
            <h1 className="font-display text-2xl text-ink mb-1">Antológico</h1>
            <span className="inline-block text-xs font-medium bg-amber-100 text-amber-700 border border-amber-300 rounded px-2 py-0.5">
              Demo
            </span>
          </div>

          <div className="bg-surface-200 border border-border rounded-lg px-3 py-2.5 mb-5 text-xs text-ink-muted space-y-0.5">
            <p className="font-medium text-ink">Credenciales de acceso:</p>
            <p>Email: <span className="font-mono text-ink">{DEMO_EMAIL}</span></p>
            <p>Contraseña: <span className="font-mono text-ink">{DEMO_PASSWORD}</span></p>
          </div>

          <form onSubmit={handleDemoLogin} className="flex flex-col gap-3">
            <input
              type="email"
              value={demoEmail}
              onChange={(e) => setDemoEmail(e.target.value)}
              placeholder="Email"
              className={INPUT_CLS}
            />
            <input
              type="password"
              value={demoPassword}
              onChange={(e) => setDemoPassword(e.target.value)}
              placeholder="Contraseña"
              className={INPUT_CLS}
            />
            {error && (
              <p className="text-xs text-danger bg-danger/5 border border-danger/20 rounded px-3 py-2">
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-primary text-white rounded-md text-sm font-semibold hover:bg-primary-strong transition-colors disabled:opacity-50"
            >
              {loading ? 'Ingresando…' : 'Ingresar'}
            </button>
          </form>

          <div className="mt-4 pt-4 border-t border-border text-center">
            <p className="text-xs text-ink-muted">
              ¿No tenés cuenta?{' '}
              <Link to="/registro" className="text-primary hover:underline font-medium">
                Crear cuenta →
              </Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ─── Dev auto-login ──────────────────────────────────────────────────────────
  async function handleDevLogin() {
    setError('');
    setLoading(true);
    try {
      try {
        await signInWithEmailAndPassword(auth, DEV_EMAIL, DEV_PASSWORD);
      } catch (signInErr) {
        if (signInErr.code === 'auth/email-already-in-use') throw signInErr;
        try {
          const cred = await createUserWithEmailAndPassword(auth, DEV_EMAIL, DEV_PASSWORD);
          await updateProfile(cred.user, { displayName: DEV_NAME });
        } catch (createErr) {
          if (createErr.code === 'auth/email-already-in-use') throw signInErr;
          throw createErr;
        }
      }
      navigate('/workshops');
    } catch (err) {
      setError(`${err.message}${err.code ? ` [${err.code}]` : ''}`);
    } finally {
      setLoading(false);
    }
  }

  if (isDev && mode !== 'register') {
    return (
      <div className="min-h-screen bg-surface-0 flex items-center justify-center">
        <div className="bg-surface-100 border border-border rounded-lg p-8 w-full max-w-sm text-center">
          <h1 className="font-display text-2xl text-ink mb-4">Antológico</h1>
          {error ? (
            <>
              <p className="text-xs text-danger bg-danger/5 border border-danger/20 rounded px-3 py-2 mb-4 font-mono break-all text-left">
                {error}
              </p>
              <button
                onClick={handleDevLogin}
                disabled={loading}
                className="w-full py-2.5 bg-amber-500/10 border border-amber-400/40 rounded-md text-sm font-medium text-amber-700 hover:bg-amber-500/20 transition-colors disabled:opacity-50"
              >
                {loading ? 'Ingresando…' : 'Reintentar'}
              </button>
            </>
          ) : (
            <p className="text-sm text-ink-muted">Conectando al emulador…</p>
          )}
        </div>
      </div>
    );
  }

  // ─── Producción — login/registro formal ─────────────────────────────────────
  return <TenantLoginPage initialTab={mode === 'register' ? 'register' : 'login'} />;
}

// ─── Componente de login/registro de producción ──────────────────────────────
function TenantLoginPage({ initialTab = 'login' }) {
  const navigate = useNavigate();
  const { user }  = useAuth();

  // Navegar en cuanto onAuthStateChanged confirme el usuario
  useEffect(() => {
    if (user) navigate('/workshops', { replace: true });
  }, [user, navigate]);

  // Tabs: 'login' | 'register'
  const [tab, setTab] = useState(initialTab);

  // Login
  const [loginEmail, setLoginEmail]       = useState('');
  const [loginPass,  setLoginPass]        = useState('');

  // Register
  const [regNombre,   setRegNombre]   = useState('');
  const [regEmail,    setRegEmail]    = useState('');
  const [regPass,     setRegPass]     = useState('');
  const [regConfirm,  setRegConfirm]  = useState('');

  // Reset password
  const [resetMode,  setResetMode]   = useState(false);
  const [resetEmail, setResetEmail]  = useState('');
  const [resetDone,  setResetDone]   = useState(false);

  // After register
  const [verifyMode,   setVerifyMode]   = useState(false);
  const [verifyEmail,  setVerifyEmail]  = useState('');

  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);

  function clearErr() { setError(''); }

  // ── Google ──────────────────────────────────────────────────────────────────
  async function handleGoogle() {
    setError('');
    setLoading(true);
    try {
      await signInWithPopup(auth, provider);
      // La navegación la maneja el useEffect que observa `user`
    } catch (err) {
      if (err.code !== 'auth/popup-closed-by-user') setError(authErrorMsg(err.code));
      setLoading(false);
    }
  }

  // ── Login con email ──────────────────────────────────────────────────────────
  async function handleLogin(e) {
    e.preventDefault();
    if (!loginEmail || !loginPass) { setError('Completá todos los campos'); return; }
    setError('');
    setLoading(true);
    try {
      const cred = await signInWithEmailAndPassword(auth, loginEmail, loginPass);
      if (!cred.user.emailVerified) {
        try { await sendEmailVerification(cred.user); } catch (_) {}
        setVerifyEmail(loginEmail);
        setVerifyMode(true);
        setLoading(false);
        return;
      }
    } catch (err) {
      setError(authErrorMsg(err.code));
      setLoading(false);
    }
  }

  // ── Registro ─────────────────────────────────────────────────────────────────
  function validatePassword(pass) {
    if (pass.length < 8) return 'Mínimo 8 caracteres';
    if (!/[a-zA-Z]/.test(pass)) return 'Debe contener al menos una letra';
    if (!/[0-9]/.test(pass)) return 'Debe contener al menos un número';
    if (!/[.#*$@!%&_\-+=?]/.test(pass)) return 'Debe contener un símbolo (. # * $ @ ! % &)';
    return null;
  }

  const passError = regPass ? validatePassword(regPass) : null;
  const passMatch = regConfirm && regPass !== regConfirm;

  async function handleRegister(e) {
    e.preventDefault();
    if (!regNombre.trim()) { setError('El nombre es requerido'); return; }
    if (!regEmail)         { setError('El email es requerido'); return; }
    const pErr = validatePassword(regPass);
    if (pErr) { setError(pErr); return; }
    if (regPass !== regConfirm) { setError('Las contraseñas no coinciden'); return; }
    setError('');
    setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, regEmail, regPass);
      await updateProfile(cred.user, { displayName: regNombre.trim() });
      await sendEmailVerification(cred.user);
      setVerifyEmail(regEmail);
      setVerifyMode(true);
    } catch (err) {
      setError(authErrorMsg(err.code));
    } finally {
      setLoading(false);
    }
  }

  // ── Reset password ────────────────────────────────────────────────────────────
  async function handleReset(e) {
    e.preventDefault();
    if (!resetEmail) { setError('Ingresá tu email'); return; }
    setError('');
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, resetEmail);
      setResetDone(true);
    } catch (err) {
      setError(authErrorMsg(err.code));
    } finally {
      setLoading(false);
    }
  }

  // ── Verificación de email (post-registro) ────────────────────────────────────
  if (verifyMode) {
    return (
      <VerifyEmailScreen
        email={verifyEmail}
        onVerified={() => navigate('/workshops')}
      />
    );
  }

  // ── Recuperar contraseña ─────────────────────────────────────────────────────
  if (resetMode) {
    return (
      <PageShell>
        <div className="flex flex-col gap-5">
          <div>
            <h2 className="font-display text-xl text-ink mb-1">Recuperar contraseña</h2>
            <p className="text-sm text-ink-muted">
              Ingresá tu email y te enviamos instrucciones para restablecer tu contraseña.
            </p>
          </div>

          {resetDone ? (
            <div className="text-center py-4 flex flex-col gap-3">
              <p className="text-sm text-ink">
                Enviamos el enlace a <span className="font-medium">{resetEmail}</span>.
              </p>
              <button
                type="button"
                onClick={() => { setResetMode(false); setResetDone(false); setResetEmail(''); }}
                className="text-sm text-primary hover:underline"
              >
                ← Volver al inicio de sesión
              </button>
            </div>
          ) : (
            <form onSubmit={handleReset} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-medium text-ink-muted mb-1">Email</label>
                <input
                  type="email"
                  value={resetEmail}
                  onChange={(e) => { setResetEmail(e.target.value); clearErr(); }}
                  placeholder="tu@email.com"
                  autoFocus
                  className={INPUT_CLS}
                />
              </div>
              {error && (
                <p className="text-xs text-danger bg-danger/5 border border-danger/20 rounded px-3 py-2">
                  {error}
                </p>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-primary text-white rounded-md text-sm font-semibold hover:bg-primary-strong transition-colors disabled:opacity-50"
              >
                {loading ? 'Enviando…' : 'Enviar instrucciones'}
              </button>
              <button
                type="button"
                onClick={() => { setResetMode(false); setError(''); }}
                className="text-xs text-ink-muted hover:text-ink transition-colors text-center"
              >
                ← Volver al inicio de sesión
              </button>
            </form>
          )}
        </div>
      </PageShell>
    );
  }

  // ── Login / Registro ─────────────────────────────────────────────────────────
  return (
    <PageShell>
      <div className="flex flex-col gap-5">
        <div>
          <h2 className="font-display text-xl text-ink mb-1">
            {tab === 'login' ? 'Bienvenido de vuelta' : 'Creá tu cuenta'}
          </h2>
          <p className="text-sm text-ink-muted">
            {tab === 'login'
              ? 'Ingresá para gestionar tus talleres'
              : 'Configurá tu espacio en minutos'}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex rounded-md border border-border overflow-hidden">
          {[['login', 'Ingresar'], ['register', 'Crear cuenta']].map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => { setTab(key); setError(''); }}
              className={`flex-1 py-2 text-sm font-medium transition-colors ${
                tab === key
                  ? 'bg-primary text-white'
                  : 'bg-surface-100 text-ink-muted hover:text-ink hover:bg-surface-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Google */}
        <button
          type="button"
          onClick={handleGoogle}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 py-2.5 border border-border rounded-md text-sm font-medium text-ink hover:bg-surface-100 transition-colors disabled:opacity-50"
        >
          <GoogleIcon />
          {loading ? 'Redirigiendo…' : `Continuar con Google`}
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-border" />
          <span className="text-xs text-ink-muted">o con email</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* Login con email */}
        {tab === 'login' && (
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-medium text-ink-muted mb-1">Email</label>
              <input
                type="email"
                value={loginEmail}
                onChange={(e) => { setLoginEmail(e.target.value); clearErr(); }}
                placeholder="tu@email.com"
                autoFocus
                className={INPUT_CLS}
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium text-ink-muted">Contraseña</label>
                <button
                  type="button"
                  onClick={() => { setResetMode(true); setResetEmail(loginEmail); setError(''); }}
                  className="text-xs text-primary hover:underline"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
              <input
                type="password"
                value={loginPass}
                onChange={(e) => { setLoginPass(e.target.value); clearErr(); }}
                placeholder="••••••••"
                className={INPUT_CLS}
              />
            </div>
            {error && (
              <p className="text-xs text-danger bg-danger/5 border border-danger/20 rounded px-3 py-2">
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-primary text-white rounded-md text-sm font-semibold hover:bg-primary-strong transition-colors disabled:opacity-50"
            >
              {loading ? 'Ingresando…' : 'Ingresar →'}
            </button>
            <p className="text-xs text-ink-muted text-center">
              ¿No tenés cuenta?{' '}
              <button type="button" onClick={() => { setTab('register'); setError(''); }} className="text-primary hover:underline font-medium">
                Crear cuenta →
              </button>
            </p>
          </form>
        )}

        {/* Registro con email */}
        {tab === 'register' && (
          <form onSubmit={handleRegister} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-medium text-ink-muted mb-1">Nombre completo</label>
              <input
                type="text"
                value={regNombre}
                onChange={(e) => { setRegNombre(e.target.value); clearErr(); }}
                placeholder="Ej: María González"
                autoFocus
                className={INPUT_CLS}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-ink-muted mb-1">Email</label>
              <input
                type="email"
                value={regEmail}
                onChange={(e) => { setRegEmail(e.target.value); clearErr(); }}
                placeholder="tu@email.com"
                className={INPUT_CLS}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-ink-muted mb-1">Contraseña</label>
              <input
                type="password"
                value={regPass}
                onChange={(e) => { setRegPass(e.target.value); clearErr(); }}
                placeholder="Mínimo 8 caracteres"
                className={INPUT_CLS}
              />
              {regPass && (
                <div className="mt-1.5 flex flex-col gap-1">
                  {[
                    [regPass.length >= 8, '8+ caracteres'],
                    [/[a-zA-Z]/.test(regPass), 'Una letra'],
                    [/[0-9]/.test(regPass), 'Un número'],
                    [/[.#*$@!%&_\-+=?]/.test(regPass), 'Un símbolo (. # * $ @ !)'],
                  ].map(([ok, label]) => (
                    <span key={label} className={`text-[11px] flex items-center gap-1.5 ${ok ? 'text-emerald-600' : 'text-ink-muted'}`}>
                      <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] ${ok ? 'bg-emerald-100 text-emerald-700' : 'bg-surface-200 text-ink-muted'}`}>
                        {ok ? '✓' : '·'}
                      </span>
                      {label}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div>
              <label className="block text-xs font-medium text-ink-muted mb-1">Confirmar contraseña</label>
              <input
                type="password"
                value={regConfirm}
                onChange={(e) => { setRegConfirm(e.target.value); clearErr(); }}
                placeholder="Repetí tu contraseña"
                className={`${INPUT_CLS} ${passMatch ? 'border-danger focus:border-danger focus:ring-danger' : ''}`}
              />
              {passMatch && (
                <p className="mt-1 text-[11px] text-danger">Las contraseñas no coinciden</p>
              )}
            </div>
            {error && (
              <p className="text-xs text-danger bg-danger/5 border border-danger/20 rounded px-3 py-2">
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={loading || !!passError || passMatch}
              className="w-full py-2.5 bg-primary text-white rounded-md text-sm font-semibold hover:bg-primary-strong transition-colors disabled:opacity-50"
            >
              {loading ? 'Creando cuenta…' : 'Crear cuenta →'}
            </button>
            <p className="text-xs text-ink-muted text-center">
              Al crear tu cuenta aceptás nuestros{' '}
              <span className="text-ink">Términos de uso</span> y{' '}
              <span className="text-ink">Política de privacidad</span>.
            </p>
            <p className="text-xs text-ink-muted text-center">
              ¿Ya tenés cuenta?{' '}
              <button type="button" onClick={() => { setTab('login'); setError(''); }} className="text-primary hover:underline font-medium">
                Ingresar →
              </button>
            </p>
          </form>
        )}
      </div>
    </PageShell>
  );
}

// ─── Pantalla de verificación obligatoria ─────────────────────────────────────
function VerifyEmailScreen({ email, onVerified }) {
  const [checking, setChecking]   = useState(false);
  const [resent, setResent]       = useState(false);
  const [verified, setVerified]   = useState(false);

  useEffect(() => {
    const interval = setInterval(async () => {
      const u = auth.currentUser;
      if (!u) return;
      await u.reload();
      if (u.emailVerified) {
        setVerified(true);
        clearInterval(interval);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  async function handleResend() {
    setChecking(true);
    try {
      const u = auth.currentUser;
      if (u) await sendEmailVerification(u);
      setResent(true);
      setTimeout(() => setResent(false), 5000);
    } catch (_) {}
    setChecking(false);
  }

  async function handleCheck() {
    setChecking(true);
    const u = auth.currentUser;
    if (u) {
      await u.reload();
      if (u.emailVerified) setVerified(true);
    }
    setChecking(false);
  }

  return (
    <PageShell>
      <div className="flex flex-col items-center text-center gap-4">
        <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
          {verified ? (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          ) : (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
              <rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="22,7 12,13 2,7"/>
            </svg>
          )}
        </div>

        {verified ? (
          <>
            <div>
              <h2 className="font-display text-xl text-ink mb-1">Email verificado</h2>
              <p className="text-sm text-ink-muted">Tu cuenta está activa. Ya podés empezar.</p>
            </div>
            <button
              onClick={onVerified}
              className="w-full py-2.5 bg-primary text-white rounded-md text-sm font-semibold hover:bg-primary-strong transition-colors"
            >
              Continuar al panel →
            </button>
          </>
        ) : (
          <>
            <div>
              <h2 className="font-display text-xl text-ink mb-1">Verificá tu email</h2>
              <p className="text-sm text-ink-muted">
                Te enviamos un enlace a <span className="font-medium text-ink">{email}</span>.
                Hacé clic en el enlace para activar tu cuenta.
              </p>
            </div>

            <div className="w-full flex flex-col gap-2">
              <button
                onClick={handleCheck}
                disabled={checking}
                className="w-full py-2.5 bg-primary text-white rounded-md text-sm font-semibold hover:bg-primary-strong transition-colors disabled:opacity-50"
              >
                {checking ? 'Verificando…' : 'Ya verifiqué mi email'}
              </button>
              <button
                onClick={handleResend}
                disabled={checking || resent}
                className="w-full py-2 border border-border rounded-md text-sm text-ink-muted hover:bg-surface-100 transition-colors disabled:opacity-50"
              >
                {resent ? 'Email reenviado ✓' : 'Reenviar email'}
              </button>
            </div>

            <p className="text-xs text-ink-muted">
              ¿No lo ves? Revisá la carpeta de spam o correo no deseado.
            </p>

            <div className="flex items-center gap-2 text-xs text-ink-muted">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              Esperando verificación…
            </div>
          </>
        )}
      </div>
    </PageShell>
  );
}

// ─── Wrapper de layout ────────────────────────────────────────────────────────
function PageShell({ children }) {
  return (
    <div className="min-h-screen bg-surface-0 flex flex-col items-center justify-center px-4 py-12">
      <div className="mb-8 text-center">
        <span className="font-display text-2xl text-ink">Antológico</span>
      </div>
      <div className="w-full max-w-sm bg-surface-100 border border-border rounded-xl p-8">
        {children}
      </div>
    </div>
  );
}
