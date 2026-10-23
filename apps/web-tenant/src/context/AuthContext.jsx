import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { upsertProfesional } from '../dataconnect-generated';
import {
  DEMO_MODE, DEMO_EMAIL, DEMO_PASSWORD,
  getDemoSession, getDemoUser, saveDemoSession, clearDemoSession,
} from '../lib/demo';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // undefined = loading, null = signed out, user object = signed in
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    if (DEMO_MODE) {
      const demoUser = getDemoSession();
      if (demoUser) setUser(demoUser);
    }
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
        if (!DEMO_MODE) setUser(null);
      }
    });
  }, []);

  async function loginDemo(email, password) {
    if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
      saveDemoSession();
      setUser(getDemoUser());
    } else {
      throw new Error('Credenciales inválidas. Usá las que aparecen en pantalla.');
    }
  }

  async function logout() {
    if (DEMO_MODE) { clearDemoSession(); setUser(null); return; }
    await signOut(auth);
  }

  return (
    <AuthContext.Provider value={{ user, loading: user === undefined, logout, loginDemo }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
