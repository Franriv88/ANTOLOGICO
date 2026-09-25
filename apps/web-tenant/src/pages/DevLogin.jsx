import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  GoogleAuthProvider,
} from 'firebase/auth';
import { auth } from '../lib/firebase';
import { DEMO_MODE, DEMO_EMAIL, DEMO_PASSWORD } from '../lib/demo';
import { useAuth } from '../context/AuthContext';

const provider = new GoogleAuthProvider();
const isDev = import.meta.env.DEV;

const DEV_EMAIL    = 'dev@antologico.app';
const DEV_PASSWORD = 'dev123456';
const DEV_NAME     = 'Dev User';

export default function Login() {
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);
  const navigate  = useNavigate();
  const { loginDemo } = useAuth();

  // ─── Modo Demo ───────────────────────────────────────────────────────────────
  const [demoEmail, setDemoEmail]       = useState(DEMO_EMAIL);
  const [demoPassword, setDemoPassword] = useState(DEMO_PASSWORD);

  // Hook siempre declarado antes de cualquier return condicional
  useEffect(() => {
    if (!DEMO_MODE && isDev) handleDevLogin();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (DEMO_MODE) {
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

    async function handleNewUser() {
      setError('');
      setLoading(true);
      try {
        localStorage.removeItem('ant_demo_data');
        await loginDemo(DEMO_EMAIL, DEMO_PASSWORD);
        navigate('/workshops');
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
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
              className="w-full px-3 py-2 bg-white border border-border rounded-md text-sm text-[#2B241A] focus:outline-none focus:border-primary"
            />
            <input
              type="password"
              value={demoPassword}
              onChange={(e) => setDemoPassword(e.target.value)}
              placeholder="Contraseña"
              className="w-full px-3 py-2 bg-white border border-border rounded-md text-sm text-[#2B241A] focus:outline-none focus:border-primary"
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

          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-xs text-ink-muted text-center mb-3">¿Querés ver el flujo de registro completo?</p>
            <button
              type="button"
              onClick={handleNewUser}
              disabled={loading}
              className="w-full py-2 border border-border rounded-md text-xs font-medium text-ink-muted hover:text-ink hover:bg-surface-200 transition-colors disabled:opacity-50"
            >
              Empezar como usuario nuevo →
            </button>
          </div>
        </div>
      </div>
    );
  }
  // ─────────────────────────────────────────────────────────────────────────────

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

  async function handleGoogle() {
    setError('');
    setLoading(true);
    try {
      await signInWithPopup(auth, provider);
      navigate('/workshops');
    } catch (err) {
      if (err.code !== 'auth/popup-closed-by-user') setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (isDev) {
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

  return (
    <div className="min-h-screen bg-surface-0 flex items-center justify-center">
      <div className="bg-surface-100 border border-border rounded-lg p-8 w-full max-w-sm">
        <h1 className="font-display text-2xl text-ink mb-1">Antológico</h1>
        <p className="text-sm text-ink-muted mb-8">
          Accedé con tu cuenta de Google para gestionar tus talleres
        </p>
        {error && (
          <p className="text-xs text-danger bg-danger/5 border border-danger/20 rounded px-3 py-2 mb-4 font-mono break-all">
            {error}
          </p>
        )}
        <button
          onClick={handleGoogle}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 py-2.5 border border-border rounded-md text-sm font-medium text-ink hover:bg-surface-200 transition-colors disabled:opacity-50"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
            <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
            <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
            <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
          </svg>
          {loading ? 'Redirigiendo…' : 'Continuar con Google'}
        </button>
      </div>
    </div>
  );
}
