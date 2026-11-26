import { useEffect, useState } from 'react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { firestore } from '../lib/firebase';

export const EMPTY_PLAN_CAPABILITIES = {
  imagenEncabezado:    false,
  talleresIlimitados:  false,
  multiplesEspacios:   false,
  dominioPersonalizado: false,
  reportes:            false,
  auditoria:           false,
};

// Si el plan guardado en Firestore no tiene el campo `capabilities` (planes
// legacy anteriores al rediseño del Super Admin), inferimos los permisos a
// partir del nombre histórico. Esto evita que un tenant con plan Esencial
// pueda subir imagen de encabezado solo porque el objeto plan no fue migrado.
export function normalizePlan(plan) {
  if (!plan) return null;
  if (plan.capabilities && typeof plan.capabilities === 'object') return plan;
  const nombre = (plan.nombre || '').toLowerCase();
  return {
    ...plan,
    capabilities: {
      ...EMPTY_PLAN_CAPABILITIES,
      dominioPersonalizado: true,
      imagenEncabezado:   nombre.includes('profesional') || nombre.includes('estudio'),
      talleresIlimitados: nombre.includes('profesional') || nombre.includes('estudio'),
      multiplesEspacios:  nombre.includes('estudio'),
      reportes:           nombre.includes('profesional') || nombre.includes('estudio'),
      auditoria:          nombre.includes('estudio'),
    },
  };
}

export const PLANES_FALLBACK = [
  {
    id: 'esencial',
    nombre: 'Esencial',
    precioMensual: 5900,
    descuentoTrimestral: 10,
    descuentoAnual: 20,
    highlight: false,
    order: 1,
    features: ['Hasta 5 talleres activos', 'Dominio personalizado', 'Encabezado de color'],
    capabilities: { ...EMPTY_PLAN_CAPABILITIES, dominioPersonalizado: true },
  },
  {
    id: 'profesional',
    nombre: 'Profesional',
    precioMensual: 12900,
    descuentoTrimestral: 10,
    descuentoAnual: 20,
    highlight: true,
    order: 2,
    features: ['Talleres ilimitados', 'Dominio personalizado', 'Encabezado con imagen', 'Reportes'],
    capabilities: {
      imagenEncabezado: true, talleresIlimitados: true, multiplesEspacios: false,
      dominioPersonalizado: true, reportes: true, auditoria: false,
    },
  },
  {
    id: 'estudio',
    nombre: 'Estudio',
    precioMensual: 24900,
    descuentoTrimestral: 10,
    descuentoAnual: 20,
    highlight: false,
    order: 3,
    features: ['Talleres ilimitados', 'Múltiples espacios', 'Encabezado con imagen', 'Reportes', 'Auditoría'],
    capabilities: {
      imagenEncabezado: true, talleresIlimitados: true, multiplesEspacios: true,
      dominioPersonalizado: true, reportes: true, auditoria: true,
    },
  },
];

// Calcula el precio mensual equivalente según el período
export function precioConPeriodo(plan, periodo) {
  if (!plan) return 0;
  const base = plan.precioMensual ?? 0;
  if (periodo === 'trimestral') return Math.round(base * (1 - (plan.descuentoTrimestral ?? 0) / 100));
  if (periodo === 'anual')      return Math.round(base * (1 - (plan.descuentoAnual      ?? 0) / 100));
  return base;
}

// Fecha de próxima renovación según período elegido
export function proximaRenovacion(periodo) {
  return proximaRenovacionDesde(periodo, new Date());
}

export function proximaRenovacionDesde(periodo, desde) {
  const d = desde instanceof Date ? desde : new Date(desde);
  if (periodo === 'trimestral') return new Date(d.getFullYear(), d.getMonth() + 3,  d.getDate());
  if (periodo === 'anual')      return new Date(d.getFullYear() + 1, d.getMonth(),  d.getDate());
  return new Date(d.getFullYear(), d.getMonth() + 1, d.getDate());
}

export function formatFechaLarga(date) {
  return date.toLocaleDateString('es-AR', { day: '2-digit', month: 'long', year: 'numeric' });
}

export function usePlanes() {
  const [planes, setPlanes] = useState(null);

  useEffect(() => {
    getDocs(query(collection(firestore, 'demo_planes'), orderBy('order')))
      .then(snap => {
        const list = snap.docs.map(d => normalizePlan({ id: d.id, ...d.data() }));
        setPlanes(list.length > 0 ? list : PLANES_FALLBACK);
      })
      .catch(() => setPlanes(PLANES_FALLBACK));
  }, []);

  return planes; // null mientras carga
}
