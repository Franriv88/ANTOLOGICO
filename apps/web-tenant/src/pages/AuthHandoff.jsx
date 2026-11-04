import { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { signInWithCustomToken } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { upsertProfesional, listMyEspacios, createEspacio } from '../dataconnect-generated';

function wait(ms) { return new Promise(r => setTimeout(r, ms)); }

export default function AuthHandoff() {
  const [params] = useSearchParams();
  const token = params.get('token');
  const [logs, setLogs] = useState([]);
  const [done, setDone] = useState(false);
  const [ok, setOk] = useState(false);
  const ran = useRef(false);

  function log(msg, type = 'info') {
    setLogs(prev => [...prev, { msg, type, t: Date.now() }]);
  }

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    if (!token) {
      log('No hay token en la URL', 'error');
      setDone(true);
      return;
    }
    log(`Token recibido: ${token.slice(0, 20)}…`);

    (async () => {
      // 1. sessionStorage
      try { sessionStorage.setItem('__handoff', '1'); log('sessionStorage.__handoff = 1 ✓'); }
      catch (e) { log(`sessionStorage falló: ${e.message}`, 'error'); }

      // 2. signInWithCustomToken
      try {
        log('Llamando signInWithCustomToken…');
        const cred = await signInWithCustomToken(auth, token);
        log(`signIn OK — UID: ${cred.user.uid}, email: ${cred.user.email}`);
      } catch (e) {
        log(`signInWithCustomToken FALLÓ: ${e.code} — ${e.message}`, 'error');
        setDone(true);
        return;
      }

      const user = auth.currentUser;
      if (!user) { log('auth.currentUser es null', 'error'); setDone(true); return; }
      log(`currentUser: ${user.email}, emailVerified: ${user.emailVerified}`);

      // 3. getIdTokenResult
      try {
        const tr = await user.getIdTokenResult();
        log(`admin claim: ${tr.claims.admin}, signInProvider: ${tr.signInProvider}`);
      } catch (e) { log(`getIdTokenResult falló: ${e.message}`, 'warn'); }

      // 4. Forzar refresh del ID token para que Data Connect lo reconozca
      try {
        log('Forzando refresh del ID token…');
        const freshToken = await user.getIdToken(true);
        log(`Token refreshed OK (${freshToken.slice(0, 20)}…)`);
      } catch (e) {
        log(`getIdToken(true) falló: ${e.message}`, 'warn');
      }

      // 5. Esperar para que el SDK de Data Connect actualice su listener
      log('Esperando 1s para que DC SDK actualice auth…');
      await wait(1000);

      // 6. upsertProfesional
      try {
        log('Llamando upsertProfesional…');
        await upsertProfesional({ nombre: user.displayName || user.email, email: user.email });
        log('upsertProfesional OK ✓');
      } catch (e) {
        const msg = e?.message || JSON.stringify(e);
        log(`upsertProfesional: ${msg}`, msg.includes('ALREADY_EXISTS') ? 'warn' : 'error');
      }

      // 7. listMyEspacios con retry
      let espacioCount = -1;
      for (let attempt = 1; attempt <= 3; attempt++) {
        try {
          log(`Llamando listMyEspacios (intento ${attempt}/3)…`);
          const { data } = await listMyEspacios();
          espacioCount = (data.espacios ?? []).length;
          log(`listMyEspacios: ${espacioCount} espacio(s)`);
          if (espacioCount > 0) {
            log(`  → ${data.espacios[0].nombre} (${data.espacios[0].id})`);
          }
          break;
        } catch (e) {
          const msg = e?.message || JSON.stringify(e);
          log(`listMyEspacios intento ${attempt} FALLÓ: ${msg}`, attempt < 3 ? 'warn' : 'error');
          if (attempt < 3) {
            log(`Esperando ${attempt}s antes de reintentar…`);
            await wait(attempt * 1000);
          }
        }
      }

      // 8. createEspacio si necesario
      if (espacioCount === 0) {
        try {
          log('No hay espacios — creando uno…');
          await createEspacio({ nombre: user.displayName || 'Mi Espacio' });
          log('createEspacio OK ✓');
        } catch (e) {
          log(`createEspacio FALLÓ: ${e?.message || JSON.stringify(e)}`, 'error');
        }
      }

      // 9. Listo
      try { sessionStorage.setItem('__handoff', '1'); } catch {}
      log('Diagnóstico completo.');
      setOk(true);
      setDone(true);
    })();
  }, [token]);

  const colors = { info: '#94a3b8', warn: '#eab308', error: '#ef4444' };

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', color: '#e2e8f0', padding: 24, fontFamily: 'monospace', fontSize: 13 }}>
      <h1 style={{ fontSize: 18, marginBottom: 16, color: '#f8fafc' }}>🔧 Handoff Diagnóstico</h1>
      <div style={{ maxWidth: 700, lineHeight: 1.7 }}>
        {logs.map((l, i) => (
          <div key={i} style={{ color: colors[l.type] || colors.info }}>
            <span style={{ color: '#475569', marginRight: 8 }}>[{new Date(l.t).toLocaleTimeString()}]</span>
            {l.type === 'error' ? '❌ ' : l.type === 'warn' ? '⚠️ ' : ''}
            {l.msg}
          </div>
        ))}
        {!done && <div style={{ color: '#38bdf8', marginTop: 8 }}>⏳ Procesando…</div>}
      </div>
      {done && (
        <div style={{ marginTop: 24, display: 'flex', gap: 12 }}>
          {ok && (
            <button
              onClick={() => window.location.replace('/workshops')}
              style={{ padding: '10px 24px', background: '#22c55e', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}
            >
              Continuar al Panel →
            </button>
          )}
          <button
            onClick={() => window.location.href = '/login'}
            style={{ padding: '10px 24px', background: '#334155', color: '#e2e8f0', border: '1px solid #475569', borderRadius: 8, cursor: 'pointer' }}
          >
            Ir al login manual
          </button>
        </div>
      )}
    </div>
  );
}
