import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { signInWithCustomToken } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { upsertProfesional, listMyEspacios, createEspacio } from '../dataconnect-generated';
import { FullScreenLoader } from '../components/AntologicoLoader';

export default function AuthHandoff() {
  const [params] = useSearchParams();
  const token = params.get('token');
  const [status, setStatus] = useState('loading');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setErrorMsg('No vino ningún token en el link.');
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        await signInWithCustomToken(auth, token);
        if (cancelled) return;

        const user = auth.currentUser;
        try {
          await upsertProfesional({
            nombre: user.displayName || user.email,
            email: user.email,
          });
        } catch {
          // Already exists — fine
        }

        try {
          const { data } = await listMyEspacios();
          if ((data.espacios ?? []).length === 0) {
            await createEspacio({ nombre: user.displayName || 'Mi Espacio' });
          }
        } catch (e) {
          console.warn('[AuthHandoff] espacio check/create failed:', e);
        }

        if (cancelled) return;
        try { sessionStorage.setItem('__handoff', '1'); } catch {}
        window.location.replace('/workshops');
      } catch (err) {
        if (cancelled) return;
        setStatus('error');
        setErrorMsg(err?.message || 'No se pudo iniciar sesión con el token.');
      }
    })();
    return () => { cancelled = true; };
  }, [token]);

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
          <p className="text-sm text-ink-muted mb-5">{errorMsg}</p>
          <button
            onClick={() => { window.location.href = '/login'; }}
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
