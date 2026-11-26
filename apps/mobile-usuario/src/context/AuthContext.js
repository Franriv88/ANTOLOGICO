import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { getAuth } from '../lib/firebase';

const AuthContext = createContext({ user: null, loading: true });

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);
  const resolved = useRef(false);

  useEffect(() => {
    let timer;
    try {
      const auth = getAuth();
      const unsub = onAuthStateChanged(auth, (u) => {
        resolved.current = true;
        clearTimeout(timer);
        setUser(u);
        setLoading(false);
      });

      timer = setTimeout(() => {
        if (!resolved.current) {
          setLoading(false);
        }
      }, 10000);

      return () => { unsub(); clearTimeout(timer); };
    } catch {
      setLoading(false);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
