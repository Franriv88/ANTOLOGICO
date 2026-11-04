import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { httpsCallable } from 'firebase/functions';
import { auth, functions } from '../lib/firebase';
import { FullScreenLoader } from '../components/AntologicoLoader';

export default function AuthHandoff() {
  const [params] = useSearchParams();
  const code = params.get('code');
  const [status, setStatus] = useState('loading');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!code) {
      setStatus('error');
      setErrorMsg('No vino ningún código en el link.');
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const redeem = httpsCallable(functions, 'redeemHandoffCode');
        const { data } = await redeem({ code });
        if (cancelled) return;

        if (!data?.email || !data?.password) {
          throw new Error('El servidor no devolvió credenciales válidas.');
        }

        await signInWithEmailAndPassword(auth, data.email, data.password);
        if (cancelled) return;

        window.location.replace('/workshops');
      } catch (err) {
        if (cancelled) return;
        const msg = err?.message || 'No se pudo iniciar sesión.';
        setStatus('error');
        setErrorMsg(
          msg.includes('not-found') || msg.includes('inválido')
            ? 'El código ya fue usado o es inválido.'
            : msg.includes('expiró')
              ? 'El código expiró. Volvé al panel de Super Admin e intentá de nuevo.'
              : msg
        );
      }
    })();
    return () => { cancelled = true; };
  }, [code]);

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
