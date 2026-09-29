import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { admins } from '../services/adminApi';

// undefined = cargando, null = no auth, object = admin autenticado
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin,  setAdmin]  = useState(undefined);
  const [denied, setDenied] = useState(false);

  useEffect(() => {
    return onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setAdmin(null);
        setDenied(false);
        return;
      }
      const isAdmin = await admins.check(firebaseUser.uid, firebaseUser.email);
      if (isAdmin) {
        setAdmin(firebaseUser);
        setDenied(false);
      } else {
        setDenied(true);
        setAdmin(null);
        await signOut(auth);
      }
    });
  }, []);

  async function logout() {
    await signOut(auth);
  }

  return (
    <AuthContext.Provider value={{ admin, loading: admin === undefined, denied, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
