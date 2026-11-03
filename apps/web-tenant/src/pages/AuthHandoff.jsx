import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { signInWithCustomToken, signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import { useEspacio } from '../context/EspacioContext';
import { FullScreenLoader } from '../components/AntologicoLoader';

export default function AuthHandoff() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const token = params.get('token');
  const { user } = useAuth();
  const { activeEspacio, loading: espacioLoading } = useEspacio();
  const [status, setStatus] = useState('loading');
  const [errorMsg, setErrorMsg] = useState('');
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    if (!token || signedIn) return;
    let cancelled = false;
    (async () => {
      try {
        try { await signOut(auth); } catch { /* ignore */ }
        await signInWithCustomToken(auth, token);
        if (!cancelled) setSignedIn(true);
      } catch (err) {
        if (cancelled) return;
        setStatus('error');
        setErrorMsg(err?.message || 'No se pudo iniciar sesión con el token.');
      }
    })();
    return () => { cancelled = true; };
  }, [token, signedIn]);

  useEffect(() => {
    if (!signedIn || !user) return;
    if (espacioLoading) return;
    navigate(activeEspacio ? '/workshops' : '/onboarding', { replace: true });
  }, [signedIn, user, activeEspacio, espacioLoading, navigate]);

  useEffect(() => {
    if (!signedIn) return;
    const id = setTimeout(() => {
      setStatus('error');
      setErrorMsg('La sesión tardó demasiado en cargarse. Volvé al Panel de Super Admin y probá otra vez.');
    }, 15000);
    return () => clearTimeout(id);
  }, [signedIn]);

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-surface-0 flex items-center justify-center p-6">
        <div className="max-w-sm w-full bg-surface-100 border border-danger/20 rounded-xl p-6 text-center">
          <div className="w-12 h-12 rounded-full bg-danger/10 flex items-center justify-center mx-auto mb-4">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          </div>
          <h1 className="font-display text-lg text-ink mb-2">No pudimos abrir tu sesión</h1>
          <p className="text-sm text-ink-muted mb-5">
            {errorMsg} El link puede haber expirado. Volvé al Panel de Super Admin y probá otra vez.
          </p>
          <button
            onClick={() => navigate('/login', { replace: true })}
            className="px-5 py-2 bg-primary text-white rounded-md text-sm font-semibold hover:bg-primary-strong transition-colors"
          >
            Ir al login manual
          </button>
        </div>
      </div>
    );
  }

  return <FullScreenLoader message="Abriendo tu Panel de Tenant…" />;
}
