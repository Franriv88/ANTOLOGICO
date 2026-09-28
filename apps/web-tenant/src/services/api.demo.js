import {
  collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc,
  query, where, writeBatch,
} from 'firebase/firestore';
import { firestore } from '../lib/firebase';
import { BASE_ESPACIO, BASE_WORKSHOPS, BASE_RESERVAS } from '../lib/demo';

// ─── Colecciones Firestore (prefijo demo_ para aislar del futuro real) ────────
const C_ESPACIOS  = 'demo_espacios';
const C_WORKSHOPS = 'demo_workshops';
const C_RESERVAS  = 'demo_reservas';
const C_META      = 'demo_meta';

// ─── Siembra inicial — corre una sola vez; refresca fechas si están vencidas ──
let _seedPromise = null;

function future(days) {
  return new Date(Date.now() + days * 86_400_000).toISOString();
}

// Offsets de días para cada workshop semilla (mismo orden que BASE_WORKSHOPS)
const SEED_WS_OFFSETS = [7, 14, 21, 3];

async function ensureSeeded() {
  if (_seedPromise) return _seedPromise;
  _seedPromise = (async () => {
    const metaRef  = doc(firestore, C_META, 'seed');
    const metaSnap = await getDoc(metaRef);

    if (!metaSnap.exists()) {
      // Primera siembra
      const batch = writeBatch(firestore);
      const { id: _id, ...espacioData } = BASE_ESPACIO;
      batch.set(doc(firestore, C_ESPACIOS, BASE_ESPACIO.id), espacioData);
      BASE_WORKSHOPS.forEach((ws, i) => {
        const { id: _wsId, ...wsData } = ws;
        batch.set(doc(firestore, C_WORKSHOPS, ws.id), { ...wsData, fecha: future(SEED_WS_OFFSETS[i]) });
      });
      for (const r of BASE_RESERVAS) {
        const { id: _rId, ...rData } = r;
        batch.set(doc(firestore, C_RESERVAS, r.id), rData);
      }
      batch.set(metaRef, { seeded: true, seededAt: new Date().toISOString() });
      await batch.commit();
      return;
    }

    // Ya sembrado: actualizar fechas de seed workshops si están en el pasado
    const now = Date.now();
    const batch = writeBatch(firestore);
    let needsUpdate = false;
    for (let i = 0; i < BASE_WORKSHOPS.length; i++) {
      const ws = BASE_WORKSHOPS[i];
      const snap = await getDoc(doc(firestore, C_WORKSHOPS, ws.id));
      if (!snap.exists()) continue;
      const stored = snap.data();
      if (!stored.fecha || new Date(stored.fecha).getTime() < now) {
        batch.update(doc(firestore, C_WORKSHOPS, ws.id), { fecha: future(SEED_WS_OFFSETS[i]) });
        needsUpdate = true;
      }
    }
    if (needsUpdate) await batch.commit();
  })();
  return _seedPromise;
}

// Firestore tiene límite de 1MB por documento — solo eliminar base64 si supera ~800KB
const MAX_B64 = 800_000;
function stripBase64(obj) {
  const out = { ...obj };
  if (out.headerValue?.startsWith('data:') && out.headerValue.length > MAX_B64) out.headerValue = null;
  if (out.logoUrl?.startsWith('data:')     && out.logoUrl.length     > MAX_B64) out.logoUrl      = null;
  return out;
}

function uid() {
  return crypto.randomUUID
    ? crypto.randomUUID()
    : Date.now().toString(36) + Math.random().toString(36).slice(2);
}

function docToObj(snap) {
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

function snapToList(snap) {
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

// ─── API ──────────────────────────────────────────────────────────────────────

export const profesionales = {
  upsert: async () => {},
};

export const espacios = {
  list: async () => {
    await ensureSeeded();
    const snap = await getDocs(collection(firestore, C_ESPACIOS));
    return snapToList(snap);
  },

  get: async (id) => {
    await ensureSeeded();
    const snap = await getDoc(doc(firestore, C_ESPACIOS, id));
    return docToObj(snap);
  },

  create: async (payload) => {
    await ensureSeeded();
    const id      = uid();
    const espacio = {
      estado: 'ACTIVO', cancelacionPendiente: false,
      logoUrl: null, logoShape: 'round', brandColors: null, brandFont: null,
      rubro: null, plan: null, dominio_on_espacio: null,
      createdAt: new Date().toISOString(),
      ...payload,
    };
    await setDoc(doc(firestore, C_ESPACIOS, id), espacio);
    return { id, ...espacio };
  },

  update: async (id, payload) => {
    await ensureSeeded();
    const ref = doc(firestore, C_ESPACIOS, id);
    await updateDoc(ref, stripBase64(payload));
    const snap = await getDoc(ref);
    return docToObj(snap);
  },

  updateIdentidad:      async (id, payload) => espacios.update(id, payload),
  updatePlan:           async (id, planId)  => espacios.update(id, { planId }),
  solicitarCancelacion: async (id)          => espacios.update(id, { cancelacionPendiente: true }),
  reactivarSuscripcion: async (id)          => espacios.update(id, { cancelacionPendiente: false }),
};

export const rubros = {
  list: async () => [],
};

export const workshops = {
  list: async (espacioId, params = {}) => {
    await ensureSeeded();
    const q    = query(collection(firestore, C_WORKSHOPS), where('espacioId', '==', espacioId));
    const snap = await getDocs(q);
    let list   = snapToList(snap);
    if (params.estado) list = list.filter(w => w.estado === params.estado);
    if (params.q)      list = list.filter(w => w.nombre.toLowerCase().includes(params.q.toLowerCase()));
    return list;
  },

  get: async (id) => {
    await ensureSeeded();
    const snap = await getDoc(doc(firestore, C_WORKSHOPS, id));
    return docToObj(snap);
  },

  create: async (espacioId, payload) => {
    await ensureSeeded();
    const id = uid();
    const ws = stripBase64({
      espacioId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...payload,
    });
    await setDoc(doc(firestore, C_WORKSHOPS, id), ws);
    return { id, ...ws };
  },

  update: async (id, _espacioId, payload) => {
    await ensureSeeded();
    const ref = doc(firestore, C_WORKSHOPS, id);
    await updateDoc(ref, { ...stripBase64(payload), updatedAt: new Date().toISOString() });
    const snap = await getDoc(ref);
    return docToObj(snap);
  },

  quickStatus: async (id, _espacioId, estado, cuposDisponibles) => {
    await ensureSeeded();
    const ref = doc(firestore, C_WORKSHOPS, id);
    await updateDoc(ref, { estado, cuposDisponibles, updatedAt: new Date().toISOString() });
    const snap = await getDoc(ref);
    return docToObj(snap);
  },

  remove: async (id) => {
    await ensureSeeded();
    await deleteDoc(doc(firestore, C_WORKSHOPS, id));
    return null;
  },
};

export const reservas = {
  list: async (workshopId) => {
    await ensureSeeded();
    const q    = query(collection(firestore, C_RESERVAS), where('workshopId', '==', workshopId));
    const snap = await getDocs(q);
    return snapToList(snap);
  },

  listByEspacio: async (espacioId) => {
    await ensureSeeded();
    const wsSnap = await getDocs(
      query(collection(firestore, C_WORKSHOPS), where('espacioId', '==', espacioId)),
    );
    const wsIds  = new Set(wsSnap.docs.map(d => d.id));
    const rSnap  = await getDocs(collection(firestore, C_RESERVAS));
    return snapToList(rSnap).filter(r => wsIds.has(r.workshopId));
  },

  create: async (workshopId, { nombre, email, telefono, metodoPago = 'MERCADO_PAGO' }) => {
    await ensureSeeded();
    const id     = uid();
    const reserva = {
      workshopId, nombre, email, telefono: telefono ?? '',
      fecha_reserva: new Date().toISOString(),
      estado:     'CONFIRMADA',
      metodoPago,
      estadoPago: metodoPago === 'MERCADO_PAGO' ? 'PAGADO' : 'PENDIENTE',
    };
    const batch   = writeBatch(firestore);
    batch.set(doc(firestore, C_RESERVAS, id), reserva);
    // Descuenta cupo
    const wsRef   = doc(firestore, C_WORKSHOPS, workshopId);
    const wsSnap  = await getDoc(wsRef);
    if (wsSnap.exists() && (wsSnap.data().cuposDisponibles ?? 0) > 0) {
      batch.update(wsRef, { cuposDisponibles: wsSnap.data().cuposDisponibles - 1 });
    }
    await batch.commit();
    return { id, ...reserva };
  },

  markPaid: async (id) => {
    await ensureSeeded();
    const ref = doc(firestore, C_RESERVAS, id);
    await updateDoc(ref, { estadoPago: 'PAGADO' });
    const snap = await getDoc(ref);
    return docToObj(snap);
  },

  cancel: async (id) => {
    await ensureSeeded();
    const ref    = doc(firestore, C_RESERVAS, id);
    const snap   = await getDoc(ref);
    if (!snap.exists() || snap.data().estado === 'CANCELADA') return docToObj(snap);

    const batch  = writeBatch(firestore);
    batch.update(ref, { estado: 'CANCELADA' });
    // Restaura cupo
    const wsRef  = doc(firestore, C_WORKSHOPS, snap.data().workshopId);
    const wsSnap = await getDoc(wsRef);
    if (wsSnap.exists()) {
      batch.update(wsRef, { cuposDisponibles: (wsSnap.data().cuposDisponibles ?? 0) + 1 });
    }
    await batch.commit();
    const updated = await getDoc(ref);
    return docToObj(updated);
  },

  listByEmail: async (email) => {
    await ensureSeeded();
    const q    = query(collection(firestore, C_RESERVAS), where('email', '==', email));
    const snap = await getDocs(q);
    return snapToList(snap).sort((a, b) => new Date(b.fecha_reserva) - new Date(a.fecha_reserva));
  },
};
