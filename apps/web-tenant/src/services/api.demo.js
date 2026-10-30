import {
  collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc,
  query, where, writeBatch, increment,
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
  list: async (userId) => {
    await ensureSeeded();
    const q = userId
      ? query(collection(firestore, C_ESPACIOS), where('userId', '==', userId))
      : collection(firestore, C_ESPACIOS);
    const snap = await getDocs(q);
    const list = snapToList(snap);

    // Si no hay resultados, reclamar el espacio semilla que no tenga userId asignado
    if (list.length === 0 && userId) {
      const seedRef  = doc(firestore, C_ESPACIOS, BASE_ESPACIO.id);
      const seedSnap = await getDoc(seedRef);
      if (seedSnap.exists() && !seedSnap.data().userId) {
        await updateDoc(seedRef, { userId });
        return [{ id: BASE_ESPACIO.id, ...seedSnap.data(), userId }];
      }
    }

    return list.filter(e => e.estado !== 'BAJA');
  },

  get: async (id) => {
    await ensureSeeded();
    const snap = await getDoc(doc(firestore, C_ESPACIOS, id));
    return docToObj(snap);
  },

  getBySlug: async (slug) => {
    await ensureSeeded();
    const q = query(collection(firestore, C_ESPACIOS), where('slug', '==', slug.toLowerCase()));
    const snap = await getDocs(q);
    if (snap.empty) return null;
    const d = snap.docs[0];
    return { id: d.id, ...d.data() };
  },

  create: async (payload) => {
    await ensureSeeded();
    const id      = uid();
    const espacio = {
      estado: 'ACTIVO', cancelacionPendiente: false,
      logoUrl: null, logoShape: 'round', brandColors: null, brandFont: null,
      rubro: null, plan: null, dominio_on_espacio: null, slug: null,
      createdAt: new Date().toISOString(),
      trialStartedAt: new Date().toISOString(),
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

  checkSlug: async (slug, excludeEspacioId) => {
    await ensureSeeded();
    const q = query(collection(firestore, C_ESPACIOS), where('slug', '==', slug.toLowerCase()));
    const snap = await getDocs(q);
    if (snap.empty) return true;
    return snap.docs.every(d => d.id === excludeEspacioId);
  },

  updateSlug: async (id, slug) => {
    const normalized = slug.toLowerCase().replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-').replace(/^-|-$/g, '');
    if (normalized.length < 3) throw new Error('El subdominio debe tener al menos 3 caracteres.');
    if (normalized.length > 40) throw new Error('El subdominio no puede tener más de 40 caracteres.');
    const reserved = ['www', 'app', 'api', 'admin', 'panel', 'mail', 'ftp', 'smtp', 'imap', 'pop', 'dns', 'ns1', 'ns2', 'cdn', 'staging', 'dev', 'test', 'demo', 'blog', 'help', 'support', 'status'];
    if (reserved.includes(normalized)) throw new Error('Este subdominio está reservado.');
    const available = await espacios.checkSlug(normalized, id);
    if (!available) throw new Error('Este subdominio ya está en uso.');
    return espacios.update(id, { slug: normalized });
  },

  updateIdentidad:      async (id, payload)       => espacios.update(id, payload),
  updateRedes:          async (id, redesSociales) => espacios.update(id, { redesSociales }),
  updateCobros:         async (id, cobros)        => espacios.update(id, { cobros }),
  updateDirecciones:    async (id, direcciones)   => espacios.update(id, { direcciones }),
  updateTyC:            async (id, { terminosCondiciones, tycEnabled }) => espacios.update(id, { terminosCondiciones: terminosCondiciones || null, tycEnabled: !!tycEnabled }),
  activarPlan: async (id, { planId, periodoFacturacion, precioActual, proximaRenovacion }) => {
    return espacios.update(id, {
      planId,
      periodoFacturacion,
      precioActual,
      proximaRenovacion: proximaRenovacion.toISOString(),
      downgradePendiente: null,
      cancelacionPendiente: false,
    });
  },
  agendarDowngrade: async (id, downgradePendiente) => {
    return espacios.update(id, { downgradePendiente });
  },
  cancelarDowngrade: async (id) => {
    return espacios.update(id, { downgradePendiente: null });
  },
  updateCuponAplicado: async (id, cuponAplicado) => {
    return espacios.update(id, { cuponAplicado });
  },
  solicitarCancelacion: async (id)                => espacios.update(id, { cancelacionPendiente: true }),
  reactivarSuscripcion: async (id)                => espacios.update(id, { cancelacionPendiente: false }),
  eliminar: async (id) => {
    const batch = writeBatch(firestore);
    const wsSnap = await getDocs(query(collection(firestore, C_WORKSHOPS), where('espacioId', '==', id)));
    for (const wsDoc of wsSnap.docs) {
      const resSnap = await getDocs(query(collection(firestore, C_RESERVAS), where('workshopId', '==', wsDoc.id)));
      resSnap.docs.forEach(r => batch.delete(r.ref));
      batch.delete(wsDoc.ref);
    }
    batch.delete(doc(firestore, C_ESPACIOS, id));
    await batch.commit();
  },

  blockUser: async (espacioId, email) => {
    const ref  = doc(firestore, C_ESPACIOS, espacioId);
    const snap = await getDoc(ref);
    const prev = snap.data()?.usuariosBloqueados ?? [];
    const normalized = email.toLowerCase();
    if (!prev.includes(normalized)) {
      await updateDoc(ref, { usuariosBloqueados: [...prev, normalized] });
    }
  },

  unblockUser: async (espacioId, email) => {
    const ref  = doc(firestore, C_ESPACIOS, espacioId);
    const snap = await getDoc(ref);
    const prev = snap.data()?.usuariosBloqueados ?? [];
    await updateDoc(ref, { usuariosBloqueados: prev.filter(e => e !== email.toLowerCase()) });
  },

  getUsuariosBloqueados: async (espacioId) => {
    const snap = await getDoc(doc(firestore, C_ESPACIOS, espacioId));
    return snap.data()?.usuariosBloqueados ?? [];
  },
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

  create: async (workshopId, { nombre, email, telefono, metodoPago = 'MERCADO_PAGO', grupoId }) => {
    await ensureSeeded();

    // Verificar si el usuario está bloqueado en este espacio
    const wsCheckSnap = await getDoc(doc(firestore, C_WORKSHOPS, workshopId));
    if (wsCheckSnap.exists()) {
      const espCheckSnap = await getDoc(doc(firestore, C_ESPACIOS, wsCheckSnap.data().espacioId));
      if (espCheckSnap.exists()) {
        const bloqueados = espCheckSnap.data().usuariosBloqueados ?? [];
        if (bloqueados.includes(email.toLowerCase())) {
          throw new Error('No podés reservar en este espacio.');
        }
      }
    }

    const id     = uid();
    const reserva = {
      workshopId, nombre, email, telefono: telefono ?? '',
      fecha_reserva: new Date().toISOString(),
      estado:     'CONFIRMADA',
      metodoPago,
      estadoPago: metodoPago === 'MERCADO_PAGO' ? 'PAGADO' : 'PENDIENTE',
      ...(grupoId ? { grupoId } : {}),
    };
    const batch = writeBatch(firestore);
    batch.set(doc(firestore, C_RESERVAS, id), reserva);
    batch.update(doc(firestore, C_WORKSHOPS, workshopId), { cuposDisponibles: increment(-1) });
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
    // Restaura 1 cupo atómicamente
    batch.update(doc(firestore, C_WORKSHOPS, snap.data().workshopId), { cuposDisponibles: increment(1) });
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
