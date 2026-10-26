import { collection, getDocs } from 'firebase/firestore';
import { firestore } from './firebase';

const FALLBACK = [
  'Arte y pintura', 'Baile y danza', 'Cocina y gastronomía',
  'Diseño y creatividad', 'Fitness y deporte', 'Fotografía',
  'Idiomas', 'Manualidades y DIY', 'Marketing y negocios',
  'Meditación y mindfulness', 'Música', 'Teatro y actuación',
  'Tecnología y programación', 'Yoga y bienestar',
];

let _cached = null;

export async function fetchRubros() {
  if (_cached) return _cached;
  try {
    const snap = await getDocs(collection(firestore, 'demo_rubros'));
    if (!snap.empty) {
      const list = snap.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .filter(r => r.activo !== false)
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
        .map(r => r.nombre);
      if (list.length > 0) { _cached = list; return list; }
    }
  } catch { /* fallback */ }
  _cached = FALLBACK;
  return FALLBACK;
}

export const RUBROS = FALLBACK;
