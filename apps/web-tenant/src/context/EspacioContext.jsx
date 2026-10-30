import { createContext, useContext, useEffect, useState } from 'react';
import { flushSync } from 'react-dom';
import { useAuth } from './AuthContext';
import { espacios as espacioApi } from '../services/api';
import { reassignProfesionalUid } from '../dataconnect-generated';

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
    (async () => {
      try {
        let list = await espacioApi.list(user.uid);
        // Si no hay espacios, puede que el tenant se registró con email y ahora
        // usa Google (u otro provider) con el mismo email → UID cambió.
        // ReassignProfesionalUid actualiza el UID en SQL para que el espacio
        // vuelva a ser visible.
        if (list.length === 0 && user.displayName) {
          try {
            await reassignProfesionalUid({ nombre: user.displayName });
            list = await espacioApi.list(user.uid);
          } catch { /* email no existe en profesionales — usuario genuinamente nuevo */ }
        }
        setEspacios(list);
        setActive((prev) => {
          const match = prev ? list.find((e) => e.id === prev.id) : null;
          return match ?? list[0] ?? null;
        });
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [user, authLoading]);

  async function refresh(fallback = null) {
    if (!user) return [];
    setLoading(true);
    try {
      let list = await espacioApi.list(user.uid);
      if (list.length === 0 && user.displayName) {
        try {
          await reassignProfesionalUid({ nombre: user.displayName });
          list = await espacioApi.list(user.uid);
        } catch { /* usuario genuinamente nuevo */ }
      }
      if (list.length === 0 && fallback) {
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
