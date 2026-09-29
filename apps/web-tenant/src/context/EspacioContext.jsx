import { createContext, useContext, useEffect, useState } from 'react';
import { flushSync } from 'react-dom';
import { useAuth } from './AuthContext';
import { espacios as espacioApi } from '../services/api';

const EspacioContext = createContext(null);

export function EspacioProvider({ children }) {
  const { user } = useAuth();
  const [espacios, setEspacios]       = useState([]);
  const [activeEspacio, setActive]    = useState(null);
  const [loading, setLoading]         = useState(true);

  useEffect(() => {
    if (!user) {
      setEspacios([]);
      setActive(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    espacioApi.list(user.uid)
      .then((list) => {
        setEspacios(list);
        setActive((prev) => {
          const match = prev ? list.find((e) => e.id === prev.id) : null;
          return match ?? list[0] ?? null;
        });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user]);

  async function refresh(fallback = null) {
    if (!user) return [];
    setLoading(true);
    try {
      let list = await espacioApi.list(user.uid);
      // Si la query devuelve vacío pero tenemos un espacio recién creado, lo usamos
      // como fallback para evitar la redirección al onboarding (posible cache o timing)
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
