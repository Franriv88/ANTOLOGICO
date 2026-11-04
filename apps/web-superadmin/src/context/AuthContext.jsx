import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { httpsCallable } from 'firebase/functions';
import { auth, functions } from '../lib/firebase';
import { admins } from '../services/adminApi';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin,  setAdmin]  = useState(undefined);
  const [denied, setDenied] = useState(false);

  useEffect(() => {
    return onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setAdmin(null);
        return;
      }
      const isAdmin = await admins.check(firebaseUser.uid, firebaseUser.email);
      if (isAdmin) {
        try {
          const { data } = await httpsCallable(functions, 'ensureAdminClaim')();
          if (!data.alreadySet) {
            await firebaseUser.getIdToken(true);
          }
        } catch (err) {
          console.error('ensureAdminClaim failed:', err);
        }
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
