import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { upsertProfesional, reassignProfesionalUid } from '../dataconnect-generated';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    let gen = 0;

    return onAuthStateChanged(auth, async (firebaseUser) => {
      const myGen = ++gen;
      const stale = () => myGen !== gen;

      if (firebaseUser) {
        if (firebaseUser.emailVerified) {
          if (stale()) return;
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
    <AuthContext.Provider value={{ user, loading: user === undefined, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
