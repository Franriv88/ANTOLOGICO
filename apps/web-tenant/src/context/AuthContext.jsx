import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { upsertProfesional } from '../dataconnect-generated';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    return onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Solo creamos el documento del profesional cuando el email está
        // verificado. Si el usuario no completa la verificación, no queda
        // ningún registro en nuestra base más allá de la cuenta Firebase Auth
        // (que luego se purga).
        if (firebaseUser.emailVerified) {
          try {
            await upsertProfesional({
              nombre: firebaseUser.displayName || firebaseUser.email,
              email:  firebaseUser.email,
            });
          } catch (e) {
            // upsertProfesional puede fallar con ALREADY_EXISTS en dos casos:
            // 1) el profesional ya existe (login repetido) — completamente normal
            // 2) onAuthStateChanged dispara dos veces seguidas (Google sign-in /
            //    React StrictMode): la primera INSERT tiene éxito, la segunda
            //    falla porque el email ya existe. Ambos casos son inocuos.
            const errStr = (() => { try { return JSON.stringify(e); } catch { return String(e); } })();
            const isAlreadyExists =
              errStr.includes('ALREADY_EXISTS') ||
              errStr.includes('profesionales_email_uidx') ||
              e?.graphQLErrors?.some?.(err =>
                err?.extensions?.code === 'ALREADY_EXISTS' ||
                err?.message?.includes('profesionales_email_uidx')
              );
            if (!isAlreadyExists) {
              console.error('upsertProfesional:', e);
            }
          }
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
    <AuthContext.Provider value={{ user, loading: user === undefined, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
