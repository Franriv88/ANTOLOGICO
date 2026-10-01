import { useEffect, useState } from 'react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { firestore } from '../lib/firebase';

export const PLANES_FALLBACK = [
  {
    id: 'esencial',
    nombre: 'Esencial',
    precioMensual: 5900,
    highlight: false,
    order: 1,
    features: ['Hasta 5 talleres activos', 'Dominio personalizado', 'Encabezado de color'],
  },
  {
    id: 'profesional',
    nombre: 'Profesional',
    precioMensual: 12900,
    highlight: true,
    order: 2,
    features: ['Talleres ilimitados', 'Dominio personalizado', 'Encabezado con imagen', 'Reportes'],
  },
  {
    id: 'estudio',
    nombre: 'Estudio',
    precioMensual: 24900,
    highlight: false,
    order: 3,
    features: ['Talleres ilimitados', 'Múltiples espacios', 'Encabezado con imagen', 'Reportes', 'Auditoría'],
  },
];

export function usePlanes() {
  const [planes, setPlanes] = useState(null);

  useEffect(() => {
    getDocs(query(collection(firestore, 'demo_planes'), orderBy('order')))
      .then(snap => {
        const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        setPlanes(list.length > 0 ? list : PLANES_FALLBACK);
      })
      .catch(() => setPlanes(PLANES_FALLBACK));
  }, []);

  return planes; // null mientras carga
}
