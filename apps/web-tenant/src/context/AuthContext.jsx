import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { upsertProfesional, reassignProfesionalUid, listMyEspacios } from '../dataconnect-generated';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(undefined);
  const [adminBlocked, setAdminBlocked] = useState(false);

  useEffect(() => {
    let gen = 0;

    return onAuthStateChanged(auth, async (firebaseUser) => {
      const myGen = ++gen;
      const stale = () => myGen !== gen;

      if (firebaseUser) {
        if (firebaseUser.emailVerified) {
          let isAdmin = false;
          try {
            const tokenResult = await firebaseUser.getIdTokenResult();
            isAdmin = !!tokenResult.claims.admin;
          } catch (e) {
            console.warn('[Auth] getIdTokenResult failed:', e);
          }
          if (stale()) return;

          if (isAdmin) {
            let fromHandoff = false;
            try { fromHandoff = !!sessionStorage.getItem('__handoff'); sessionStorage.removeItem('__handoff'); } catch {}
            if (!fromHandoff) {
              try {
                const { data } = await listMyEspacios();
                if (stale()) return;
                if ((data.espacios ?? []).length === 0) {
                  setAdminBlocked(true);
                  setUser(null);
                  await signOut(auth);
                  return;
                }
              } catch (e) {
                if (stale()) return;
                console.warn('[Auth] Admin espacio check failed, letting through:', e);
              }
            }
          }

          if (stale()) return;
          setAdminBlocked(false);
          upsertProfesional({
            nombre: firebaseUser.displayName || firebaseUser.email,
            email:  firebaseUser.email,
          }).catch((e) => {
            const errStr = (() => { try { return JSON.stringify(e); } catch { return String(e); } })();
            const isAlreadyExists =
              errStr.includes('ALREADY_EXISTS') ||
              errStr.includes('profesionales_email_uidx') ||
              e?.graphQLErrors?.some?.(err =>
                err?.extensions?.code === 'ALREADY_EXISTS' ||
                err?.message?.includes('profesionales_email_uidx')
              );
            if (isAlreadyExists) {
              reassignProfesionalUid({ nombre: firebaseUser.displayName || firebaseUser.email })
                .then(() => console.log('[Auth] reassignProfesionalUid OK — UID actualizado'))
                .catch((reassignErr) => console.error('[Auth] reassignProfesionalUid failed:', reassignErr));
            } else {
              console.error('upsertProfesional:', e);
            }
          });
        }
        if (stale()) return;
        setUser(firebaseUser);
      } else {
        if (stale()) return;
        setUser(null);
      }
    });
  }, []);

  async function logout() {
    await signOut(auth);
  }

  return (
    <AuthContext.Provider value={{ user, loading: user === undefined, logout, adminBlocked }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
