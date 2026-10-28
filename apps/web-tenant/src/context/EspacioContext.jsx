import { createContext, useContext, useEffect, useState } from 'react';
import { flushSync } from 'react-dom';
import { useAuth } from './AuthContext';
import { espacios as espacioApi } from '../services/api';

const EspacioContext = createContext(null);

export function EspacioProvider({ children }) {
  const { user, loading: authLoading } = useAuth();
  const [espacios, setEspacios]       = useState([]);
  const [activeEspacio, setActive]    = useState(null);
  const [loading, setLoading]         = useState(true);

  useEffect(() => {
    // Wait until Firebase Auth has resolved — avoids a race where loading=false
    // before user rehydrates from IndexedDB (e.g. after an OAuth redirect).
    if (authLoading) return;
    if (!user) {
      setEspacios([]);
      setActive(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    console.log('[EspacioCtx] fetching espacios for uid:', user.uid);
    espacioApi.list(user.uid)
      .then((list) => {
        console.log('[EspacioCtx] listMyEspacios returned:', list?.length, 'espacios', list);
        setEspacios(list);
        setActive((prev) => {
          const match = prev ? list.find((e) => e.id === prev.id) : null;
          const chosen = match ?? list[0] ?? null;
          console.log('[EspacioCtx] activeEspacio set to:', chosen?.id, chosen?.nombre);
          return chosen;
        });
      })
      .catch((err) => { console.error('[EspacioCtx] listMyEspacios ERROR:', err); })
      .finally(() => setLoading(false));
  }, [user, authLoading]);

  async function refresh(fallback = null) {
    if (!user) return [];
    setLoading(true);
    try {
      let list = await espacioApi.list(user.uid);
      console.log('[EspacioCtx] refresh: listMyEspacios returned', list?.length, 'espacios', list);
      if (list.length === 0 && fallback) {
        console.warn('[EspacioCtx] refresh: using fallback:', fallback);
        list = [fallback];
      }
      flushSync(() => {
        setEspacios(list);
        setActive((prev) => {
          const match = list.find((e) => e.id === prev?.id);
          return match ?? list[0] ?? null;
        });
        setLoading(false);
      });
      return list;
    } catch (e) {
      console.error(e);
      setLoading(false);
      return [];
    }
  }

  return (
    <EspacioContext.Provider value={{ espacios, activeEspacio, setActive, loading, refresh }}>
      {children}
    </EspacioContext.Provider>
  );
}

export const useEspacio = () => useContext(EspacioContext);
