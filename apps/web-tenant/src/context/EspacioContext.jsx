import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { listMyEspacios } from '../dataconnect-generated';

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
    listMyEspacios()
      .then(({ data }) => {
        const list = data.espacios ?? [];
        setEspacios(list);
        setActive((prev) => {
          // Mantener el espacio activo si sigue en la lista; si no, usar el primero
          if (prev && list.some((e) => e.id === prev.id)) return prev;
          return list[0] ?? null;
        });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user]);

  function refresh() {
    if (!user) return;
    listMyEspacios()
      .then(({ data }) => {
        const list = data.espacios ?? [];
        setEspacios(list);
        setActive((prev) => (prev && list.some((e) => e.id === prev.id) ? prev : list[0] ?? null));
      })
      .catch(console.error);
  }

  return (
    <EspacioContext.Provider value={{ espacios, activeEspacio, setActive, loading, refresh }}>
      {children}
    </EspacioContext.Provider>
  );
}

export const useEspacio = () => useContext(EspacioContext);
