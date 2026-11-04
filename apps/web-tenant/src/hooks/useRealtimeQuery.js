import { useEffect, useRef, useState } from 'react';
import { subscribe } from 'firebase/data-connect';

export default function useRealtimeQuery(refFn, vars, enabled = true) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const unsubRef = useRef(null);
  const varsKey = JSON.stringify(vars);

  useEffect(() => {
    if (!enabled) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);

    const queryRef = vars ? refFn(vars) : refFn();

    unsubRef.current = subscribe(queryRef, {
      onNext: (result) => {
        setData(result.data);
        setLoading(false);
      },
      onErr: (err) => {
        setError(err);
        setLoading(false);
      },
    });

    return () => {
      if (unsubRef.current) {
        unsubRef.current();
        unsubRef.current = null;
      }
    };
  }, [varsKey, enabled]);

  return { data, loading, error };
}
