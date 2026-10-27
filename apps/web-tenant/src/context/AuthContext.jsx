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
            // El schema actual de Data Connect no hace upsert real: si ya existe
            // un profesional con ese email, dispara ALREADY_EXISTS. Es esperable
            // en cada login (el documento ya existía), así que lo silenciamos.
            // Cualquier otro error sí lo logueamos.
            const isAlreadyExists =
              e?.message?.includes('ALREADY_EXISTS') ||
              e?.message?.includes('profesionales_email_uidx') ||
              e?.errors?.some?.(err => err?.extensions?.code === 'ALREADY_EXISTS');
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
