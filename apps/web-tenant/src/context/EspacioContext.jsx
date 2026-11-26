import { createContext, useContext, useEffect, useState } from 'react';
import { flushSync } from 'react-dom';
import { useAuth } from './AuthContext';
import { espacios as espacioApi } from '../services/api';
import { createEspacio } from '../dataconnect-generated';

const EspacioContext = createContext(null);

export function EspacioProvider({ children }) {
  const { user, loading: authLoading } = useAuth();
  const [espacios, setEspacios]       = useState([]);
  const [activeEspacio, setActive]    = useState(null);
  const [loading, setLoading]         = useState(true);
  const [loadedUid, setLoadedUid]     = useState(null);

  const effectiveLoading = authLoading || loading || (!!user && loadedUid !== user.uid);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setEspacios([]);
      setActive(null);
      setLoadedUid(null);
      setLoading(false);
      return;
    }
    if (loadedUid && loadedUid !== user.uid) {
      setEspacios([]);
      setActive(null);
    }
    setLoading(true);
    (async () => {
      try {
        await user.getIdToken(true);
        console.log('[Espacio] Loading for uid=%s email=%s', user.uid, user.email);
        let list = await espacioApi.list();
        list = list.filter(e => e.estado !== 'INACTIVO' && e.estado !== 'SUSPENDIDO');
        console.log('[Espacio] Got %d space(s): %s', list.length, list.map(e => `${e.nombre}(${e.id})`).join(', '));
        // Admin sin espacio en PostgreSQL — crearlo automáticamente
        if (list.length === 0) {
          let isAdmin = false;
          try {
            const tokenResult = await user.getIdTokenResult();
            isAdmin = !!tokenResult.claims.admin;
          } catch {}
          let isHandoff = false;
          try { isHandoff = !!sessionStorage.getItem('__handoff'); } catch {}
          if (isAdmin || isHandoff) {
            try {
              await createEspacio({ nombre: user.displayName || 'Mi Espacio' });
              list = await espacioApi.list(user.uid);
            } catch (he) { console.warn('[Espacio] auto-create failed:', he); }
          }
          try { sessionStorage.removeItem('__handoff'); } catch {}
        }
        setEspacios(list);
        setActive((prev) => {
          const match = prev ? list.find((e) => e.id === prev.id) : null;
          return match ?? list[0] ?? null;
        });
      } catch (e) {
        console.error(e);
      } finally {
        setLoadedUid(user.uid);
        setLoading(false);
      }
    })();
  }, [user, authLoading]);

  async function refresh(fallback = null) {
    if (!user) return [];
    setLoading(true);
    try {
      let list = await espacioApi.list();
      list = list.filter(e => e.estado !== 'INACTIVO' && e.estado !== 'SUSPENDIDO');
      if (list.length === 0 && fallback) {
        list = [fallback];
      }
      flushSync(() => {
        if (list.length > 0) {
          setEspacios(list);
          setActive((prev) => {
            const match = list.find((e) => e.id === prev?.id);
            return match ?? list[0] ?? null;
          });
        }
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
    <EspacioContext.Provider value={{ espacios, activeEspacio, setActive, loading: effectiveLoading, refresh }}>
      {children}
    </EspacioContext.Provider>
  );
}

export const useEspacio = () => useContext(EspacioContext);
