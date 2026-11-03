import { useEffect, useLayoutEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  getAdditionalUserInfo,
  updateProfile,
  sendPasswordResetEmail,
  deleteUser,
  signOut,
  GoogleAuthProvider,
} from 'firebase/auth';
import { httpsCallable } from 'firebase/functions';
import { auth, functions } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import { useEspacio } from '../context/EspacioContext';
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

  useEffect(() => {
    if (mode === 'register') return;
    if (isDev) handleDevLogin();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

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
  const { user, adminBlocked }  = useAuth();
  const { activeEspacio, loading: espacioLoading } = useEspacio();

  const [tab, setTab] = useState(initialTab);

  // Auto-redirigir solo si ya tiene sesión + espacio configurado (onboarding completo)
  useEffect(() => {
    if (user && tab === 'login' && !espacioLoading && activeEspacio) {
      navigate('/workshops', { replace: true });
    }
  }, [user, navigate, tab, activeEspacio, espacioLoading]);

  // Login
  const [loginEmail, setLoginEmail]       = useState('');
  const [loginPass,  setLoginPass]        = useState('');
  const [showLoginPass, setShowLoginPass] = useState(false);

  // Register
  const [regNombre,   setRegNombre]   = useState('');
  const [regEmail,    setRegEmail]    = useState('');
  const [regPass,     setRegPass]     = useState('');
  const [regConfirm,  setRegConfirm]  = useState('');
  const [showRegPass, setShowRegPass]       = useState(false);
  const [showRegConfirm, setShowRegConfirm] = useState(false);

  // Reset password
  const [resetMode,  setResetMode]   = useState(false);
  const [resetEmail, setResetEmail]  = useState('');
  const [resetDone,  setResetDone]   = useState(false);

  // After register
  const [verifyMode,   setVerifyMode]   = useState(false);
  const [verifyEmail,  setVerifyEmail]  = useState('');

  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);
  const [noAccount, setNoAccount] = useState(null); // { email, method: 'email'|'google', googleUser }

  function clearErr() { setError(''); setNoAccount(null); }

  // ── Google ──────────────────────────────────────────────────────────────────
  async function handleGoogle() {
    setError('');
    setNoAccount(null);
    setLoading(true);
    try {
      const credential = await signInWithPopup(auth, provider);
      const isNew = getAdditionalUserInfo(credential)?.isNewUser ?? false;
      if (isNew) {
        setNoAccount({ email: credential.user.email, method: 'google', googleUser: credential.user });
        setLoading(false);
        return;
      }
      navigate('/workshops', { replace: true });
    } catch (err) {
      if (err.code !== 'auth/popup-closed-by-user') setError(authErrorMsg(err.code));
      setLoading(false);
    }
  }

  async function handleGoogleNoAccountAccept() {
    navigate('/onboarding', { replace: true });
  }

  async function handleGoogleNoAccountReject() {
    try {
      if (noAccount?.googleUser) await deleteUser(noAccount.googleUser);
      else if (auth.currentUser) await deleteUser(auth.currentUser);
    } catch { try { await signOut(auth); } catch {} }
    setNoAccount(null);
  }

  // ── Login con email ──────────────────────────────────────────────────────────
  async function handleLogin(e) {
    e.preventDefault();
    if (!loginEmail || !loginPass) { setError('Completá todos los campos'); return; }
    setError('');
    setNoAccount(null);
    setLoading(true);
    try {
      const cred = await signInWithEmailAndPassword(auth, loginEmail, loginPass);
      if (!cred.user.emailVerified) {
        try { await httpsCallable(functions, 'sendVerificationCode')(); } catch (_) {}
        setVerifyEmail(loginEmail);
        setVerifyMode(true);
        setLoading(false);
        return;
      }
      navigate('/workshops', { replace: true });
    } catch (err) {
      if (err.code === 'auth/user-not-found') {
        setNoAccount({ email: loginEmail, method: 'email' });
      } else {
        setError(authErrorMsg(err.code));
      }
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
    let createdUser = null;
    try {
      const cred = await createUserWithEmailAndPassword(auth, regEmail, regPass);
      createdUser = cred.user;
      await updateProfile(cred.user, { displayName: regNombre.trim() });
      await httpsCallable(functions, 'sendVerificationCode')();
      setVerifyEmail(regEmail);
      setVerifyMode(true);
    } catch (err) {
      // Si fallamos después de crear la cuenta (ej: envío del código),
      // eliminamos la cuenta recién creada para no dejar basura.
      if (createdUser) {
        try { await deleteUser(createdUser); } catch { /* ignore */ }
      }
      setError(authErrorMsg(err.code) || err?.message || 'Error al registrarse.');
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

  // ── Sin cuenta — prompt para crear ───────────────────────────────────────────
  if (noAccount) {
    return (
      <PageShell>
        <div className="flex flex-col items-center text-center gap-4">
          <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#b45309" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
              <line x1="12" y1="11" x2="12" y2="15"/>
            </svg>
          </div>
          <div>
            <h2 className="font-display text-xl text-ink mb-1">No encontramos tu cuenta</h2>
            <p className="text-sm text-ink-muted">
              No existe una cuenta asociada a <span className="font-medium text-ink">{noAccount.email}</span>.
              {noAccount.method === 'google' ? ' Se creó un acceso con Google, pero necesitás completar tu registro.' : ''}
            </p>
          </div>
          <p className="text-sm text-ink-muted">¿Querés crear una cuenta nueva?</p>
          <div className="w-full flex flex-col gap-2">
            {noAccount.method === 'google' ? (
              <>
                <button
                  onClick={handleGoogleNoAccountAccept}
                  className="w-full py-2.5 bg-primary text-white rounded-md text-sm font-semibold hover:bg-primary-strong transition-colors"
                >
                  Sí, crear mi cuenta →
                </button>
                <button
                  onClick={handleGoogleNoAccountReject}
                  className="w-full py-2.5 border border-border rounded-md text-sm text-ink-muted hover:bg-surface-100 transition-colors"
                >
                  No, volver
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => { setTab('register'); setRegEmail(noAccount.email); setNoAccount(null); setError(''); }}
                  className="w-full py-2.5 bg-primary text-white rounded-md text-sm font-semibold hover:bg-primary-strong transition-colors"
                >
                  Crear cuenta →
                </button>
                <button
                  onClick={() => setNoAccount(null)}
                  className="w-full py-2.5 border border-border rounded-md text-sm text-ink-muted hover:bg-surface-100 transition-colors"
                >
                  Volver al inicio de sesión
                </button>
              </>
            )}
          </div>
        </div>
      </PageShell>
    );
  }

  // ── Verificación de email (post-registro) ────────────────────────────────────
  if (verifyMode) {
    return (
      <VerifyEmailScreen
        email={verifyEmail}
        onVerified={() => navigate('/workshops')}
        onCancel={() => { setVerifyMode(false); setVerifyEmail(''); }}
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
              <div className="relative">
                <input
                  type={showLoginPass ? 'text' : 'password'}
                  value={loginPass}
                  onChange={(e) => { setLoginPass(e.target.value); clearErr(); }}
                  placeholder="••••••••"
                  className={`${INPUT_CLS} pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPass(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink transition-colors"
                  tabIndex={-1}
                >
                  {showLoginPass
                    ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/><path d="M14.12 14.12a3 3 0 1 1-4.24-4.24"/></svg>
                    : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>}
                </button>
              </div>
            </div>
            {adminBlocked && (
              <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded px-3 py-2">
                Esta cuenta es exclusiva de administración. Usá el panel de Super Admin.
              </p>
            )}
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
              <div className="relative">
                <input
                  type={showRegPass ? 'text' : 'password'}
                  value={regPass}
                  onChange={(e) => { setRegPass(e.target.value); clearErr(); }}
                  placeholder="Mínimo 8 caracteres"
                  className={`${INPUT_CLS} pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowRegPass(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink transition-colors"
                  tabIndex={-1}
                >
                  {showRegPass
                    ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/><path d="M14.12 14.12a3 3 0 1 1-4.24-4.24"/></svg>
                    : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>}
                </button>
              </div>
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
              <div className="relative">
                <input
                  type={showRegConfirm ? 'text' : 'password'}
                  value={regConfirm}
                  onChange={(e) => { setRegConfirm(e.target.value); clearErr(); }}
                  placeholder="Repetí tu contraseña"
                  className={`${INPUT_CLS} pr-10 ${passMatch ? 'border-danger focus:border-danger focus:ring-danger' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowRegConfirm(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink transition-colors"
                  tabIndex={-1}
                >
                  {showRegConfirm
                    ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/><path d="M14.12 14.12a3 3 0 1 1-4.24-4.24"/></svg>
                    : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>}
                </button>
              </div>
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

// ─── Pantalla de verificación con código de 6 dígitos ───────────────────────
function VerifyEmailScreen({ email, onVerified, onCancel }) {
  const [digits, setDigits]       = useState(['', '', '', '', '', '']);
  const [loading, setLoading]     = useState(false);
  const [resending, setResending] = useState(false);
  const [resent, setResent]       = useState(false);
  const [verified, setVerified]   = useState(false);
  const [error, setError]         = useState('');
  const [cooldown, setCooldown]   = useState(0);
  const [showConfirmCancel, setShowConfirmCancel] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  async function handleCancelRegistration() {
    setCancelling(true);
    const u = auth.currentUser;
    try {
      if (u && !u.emailVerified) await deleteUser(u);
      else if (u) await signOut(auth);
    } catch {
      // Si falla deleteUser (ej. requiere re-auth), cerramos sesión al menos.
      try { await signOut(auth); } catch { /* ignore */ }
    } finally {
      setCancelling(false);
      setShowConfirmCancel(false);
      onCancel?.();
    }
  }

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  function handleDigitChange(idx, value) {
    if (value && !/^\d$/.test(value)) return;
    const next = [...digits];
    next[idx] = value;
    setDigits(next);
    setError('');
    if (value && idx < 5) {
      document.getElementById(`otp-${idx + 1}`)?.focus();
    }
  }

  function handleKeyDown(idx, e) {
    if (e.key === 'Backspace' && !digits[idx] && idx > 0) {
      document.getElementById(`otp-${idx - 1}`)?.focus();
    }
  }

  function handlePaste(e) {
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!text) return;
    e.preventDefault();
    const next = ['', '', '', '', '', ''];
    for (let i = 0; i < text.length; i++) next[i] = text[i];
    setDigits(next);
    setError('');
    const focusIdx = Math.min(text.length, 5);
    document.getElementById(`otp-${focusIdx}`)?.focus();
  }

  async function handleVerify() {
    const code = digits.join('');
    if (code.length !== 6) { setError('Ingresá los 6 dígitos'); return; }
    setLoading(true);
    setError('');
    try {
      await httpsCallable(functions, 'verifyCode')({ code });
      setVerified(true);
      await auth.currentUser?.reload();
    } catch (err) {
      const msg = err?.message || '';
      if (msg.includes('expiró'))          setError('El código expiró. Solicitá uno nuevo.');
      else if (msg.includes('incorrecto')) setError('Código incorrecto. Intentá de nuevo.');
      else if (msg.includes('intentos'))   setError('Demasiados intentos. Solicitá un código nuevo.');
      else if (msg.includes('pendiente'))  setError('No hay código pendiente. Solicitá uno nuevo.');
      else                                 setError(msg || 'Error al verificar.');
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    setResending(true);
    setError('');
    try {
      await httpsCallable(functions, 'resendVerificationCode')();
      setResent(true);
      setCooldown(60);
      setDigits(['', '', '', '', '', '']);
      setTimeout(() => setResent(false), 4000);
    } catch (err) {
      const msg = err?.message || '';
      if (msg.includes('minuto')) setError('Esperá un minuto antes de solicitar otro código.');
      else setError(msg || 'Error al reenviar.');
    } finally {
      setResending(false);
    }
  }

  const code = digits.join('');

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
                Enviamos un código de 6 dígitos a <span className="font-medium text-ink">{email}</span>.
                Ingresalo a continuación.
              </p>
            </div>

            {/* 6 digit OTP inputs */}
            <div className="flex justify-center gap-2" onPaste={handlePaste}>
              {digits.map((d, i) => (
                <input
                  key={i}
                  id={`otp-${i}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={d}
                  onChange={e => handleDigitChange(i, e.target.value)}
                  onKeyDown={e => handleKeyDown(i, e)}
                  autoFocus={i === 0}
                  className={`w-11 h-13 text-center text-xl font-mono font-bold rounded-lg border-2 transition-colors outline-none ${
                    error
                      ? 'border-danger bg-danger/5 text-danger'
                      : d
                        ? 'border-primary bg-primary/5 text-ink'
                        : 'border-border bg-surface-100 text-ink'
                  } focus:border-primary focus:ring-2 focus:ring-primary/20`}
                />
              ))}
            </div>

            {error && (
              <p className="text-xs text-danger bg-danger/5 border border-danger/20 rounded px-3 py-2 w-full">
                {error}
              </p>
            )}

            <div className="w-full flex flex-col gap-2">
              <button
                onClick={handleVerify}
                disabled={loading || code.length !== 6}
                className="w-full py-2.5 bg-primary text-white rounded-md text-sm font-semibold hover:bg-primary-strong transition-colors disabled:opacity-50"
              >
                {loading ? 'Verificando…' : 'Verificar código'}
              </button>
              <button
                onClick={handleResend}
                disabled={resending || cooldown > 0}
                className="w-full py-2 border border-border rounded-md text-sm text-ink-muted hover:bg-surface-100 transition-colors disabled:opacity-50"
              >
                {resent ? 'Código reenviado ✓' : cooldown > 0 ? `Reenviar código (${cooldown}s)` : 'Reenviar código'}
              </button>
            </div>

            <div className="w-full bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 flex items-start gap-3">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#b45309" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
              <p className="text-xs text-amber-800 leading-relaxed">
                <span className="font-semibold">¿No lo ves?</span> Revisá tu carpeta de <span className="font-semibold">spam</span> o correo no deseado. El código expira en 10 minutos.
              </p>
            </div>

            {/* Cancelar registro */}
            <button
              onClick={() => setShowConfirmCancel(true)}
              className="w-full py-2 text-xs text-ink-muted hover:text-danger transition-colors underline"
            >
              Cancelar registro
            </button>
          </>
        )}
      </div>

      {/* Modal confirmar cancelación */}
      {showConfirmCancel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => !cancelling && setShowConfirmCancel(false)} />
          <div className="relative w-full max-w-sm bg-surface-0 border border-border rounded-xl p-6">
            <div className="w-12 h-12 rounded-full bg-danger/10 flex items-center justify-center mb-4 mx-auto">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
            </div>
            <h3 className="font-display text-lg text-ink text-center mb-2">¿Cancelar registro?</h3>
            <p className="text-sm text-ink-muted text-center mb-5">
              Vamos a eliminar tu cuenta pendiente. Si querés registrarte después, vas a tener que empezar de nuevo.
            </p>
            <div className="flex flex-col gap-2">
              <button
                onClick={handleCancelRegistration}
                disabled={cancelling}
                className="w-full py-2.5 bg-danger text-white rounded-md text-sm font-semibold hover:bg-danger/90 transition-colors disabled:opacity-50"
              >
                {cancelling ? 'Cancelando…' : 'Sí, cancelar y eliminar'}
              </button>
              <button
                onClick={() => setShowConfirmCancel(false)}
                disabled={cancelling}
                className="w-full py-2.5 border border-border rounded-md text-sm text-ink hover:bg-surface-100 transition-colors disabled:opacity-50"
              >
                Volver a verificar
              </button>
            </div>
          </div>
        </div>
      )}
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
