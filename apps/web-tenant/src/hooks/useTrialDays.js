import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '../lib/firebase';

const DEFAULT_TRIAL_DAYS = 14;

export function useTrialDays() {
  const [days, setDays] = useState(DEFAULT_TRIAL_DAYS);

  useEffect(() => {
    getDoc(doc(firestore, 'demo_config', 'trial'))
      .then(snap => {
        if (snap.exists()) setDays(snap.data().diasPrueba ?? DEFAULT_TRIAL_DAYS);
      })
      .catch(() => {});
  }, []);

  return days;
}
