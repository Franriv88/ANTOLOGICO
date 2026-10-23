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
        try {
          await upsertProfesional({
            nombre: firebaseUser.displayName || firebaseUser.email,
            email:  firebaseUser.email,
          });
        } catch (e) {
          console.error('upsertProfesional:', e);
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
