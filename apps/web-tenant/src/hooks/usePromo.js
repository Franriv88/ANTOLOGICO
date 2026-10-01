import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '../lib/firebase';

export function usePromo() {
  const [promo, setPromo] = useState(undefined); // undefined = cargando, null = sin promo

  useEffect(() => {
    getDoc(doc(firestore, 'demo_promo', 'current'))
      .then(snap => setPromo(snap.exists() ? snap.data() : null))
      .catch(() => setPromo(null));
  }, []);

  return promo;
}

export function isPromoActiva(promo) {
  if (!promo || !promo.activo) return false;
  if (promo.tipo === 'programado') {
    const now = Date.now();
    const inicio = promo.inicio ? new Date(promo.inicio).getTime() : 0;
    const fin    = promo.fin    ? new Date(promo.fin).getTime()    : Infinity;
    return now >= inicio && now <= fin;
  }
  return true;
}

export function precioConPromoYPeriodo(plan, periodo, promo) {
  const base     = plan?.precioMensual ?? 0;
  const promoDto = isPromoActiva(promo) ? (promo.descuento ?? 0) : 0;
  const basePromo = Math.round(base * (1 - promoDto / 100));
  if (periodo === 'trimestral') return Math.round(basePromo * (1 - (plan.descuentoTrimestral ?? 0) / 100));
  if (periodo === 'anual')      return Math.round(basePromo * (1 - (plan.descuentoAnual      ?? 0) / 100));
  return basePromo;
}
