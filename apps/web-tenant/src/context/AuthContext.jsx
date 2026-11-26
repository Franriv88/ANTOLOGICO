import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, onSnapshot, deleteDoc } from 'firebase/firestore';
import { auth, firestore } from '../lib/firebase';
import { upsertProfesional } from '../dataconnect-generated';

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
            console.warn('[Auth] upsertProfesional failed (non-fatal):', e);
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

  useEffect(() => {
    if (!user?.uid) return;
    const ref = doc(firestore, 'revoked_sessions', user.uid);
    return onSnapshot(
      ref,
      (snap) => {
        if (snap.exists()) {
          deleteDoc(ref).catch(() => {});
          signOut(auth);
        }
      },
      () => {},
    );
  }, [user?.uid]);

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
