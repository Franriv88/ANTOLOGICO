import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { upsertProfesional, reassignProfesionalUid, listMyEspacios } from '../dataconnect-generated';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(undefined);
  const [adminBlocked, setAdminBlocked] = useState(false);

  useEffect(() => {
    return onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        if (firebaseUser.emailVerified) {
          const skipAdminCheck = (() => { try { return sessionStorage.getItem('__handoff') === '1'; } catch { return false; } })();
          if (skipAdminCheck) { try { sessionStorage.removeItem('__handoff'); } catch {} }

          let isAdmin = false;
          try {
            const tokenResult = await firebaseUser.getIdTokenResult();
            isAdmin = !!tokenResult.claims.admin;
          } catch (e) {
            console.warn('[Auth] getIdTokenResult failed:', e);
          }

          if (isAdmin && !skipAdminCheck) {
            try {
              const { data } = await listMyEspacios();
              if ((data.espacios ?? []).length === 0) {
                setAdminBlocked(true);
                setUser(null);
                await signOut(auth);
                return;
              }
            } catch (e) {
              console.warn('[Auth] Admin espacio check failed, letting through:', e);
            }
          }

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
        setUser(firebaseUser);
      } else {
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
