import {
  collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc,
  query, orderBy, where, writeBatch,
} from 'firebase/firestore';
import { sendPasswordResetEmail } from 'firebase/auth';

const C_PROMO       = 'demo_promo';
const C_PROMO_CODES = 'demo_promo_codes';
import { firestore, auth } from '../lib/firebase';

const C_ADMINS    = 'sa_admins';
const C_PLANES    = 'demo_planes';
const C_ESPACIOS  = 'demo_espacios';
const C_WORKSHOPS = 'demo_workshops';
const C_RESERVAS  = 'demo_reservas';
const C_USUARIOS  = 'demo_usuarios';

// Emails que pueden ser super admin (se auto-registran en sa_admins)
const SEED_ADMIN_EMAILS = ['superadmin@antologico.app'];

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

// ─── Planes iniciales (siembra automática si demo_planes está vacío) ──────────
const SEED_PLANES = [
  {
    id: 'esencial',
    nombre: 'Esencial',
    precioMensual: 5900,
    descuentoTrimestral: 10,
    descuentoAnual: 20,
    maxWorkshops: 5,
    highlight: false,
    order: 1,
    features: ['Hasta 5 talleres activos', 'Dominio personalizado', 'Encabezado de color'],
  },
  {
    id: 'profesional',
    nombre: 'Profesional',
    precioMensual: 12900,
    descuentoTrimestral: 10,
    descuentoAnual: 20,
    maxWorkshops: null,
    highlight: true,
    order: 2,
    features: ['Talleres ilimitados', 'Dominio personalizado', 'Encabezado con imagen', 'Reportes'],
  },
  {
    id: 'estudio',
    nombre: 'Estudio',
    precioMensual: 24900,
    descuentoTrimestral: 10,
    descuentoAnual: 20,
    maxWorkshops: null,
    highlight: false,
    order: 3,
    features: ['Talleres ilimitados', 'Múltiples espacios', 'Encabezado con imagen', 'Reportes', 'Auditoría'],
  },
];

let _planesSeeded = false;
async function ensurePlanesSeeded() {
  if (_planesSeeded) return;
  const snap = await getDocs(collection(firestore, C_PLANES));
  if (snap.empty) {
    const batch = writeBatch(firestore);
    SEED_PLANES.forEach(({ id, ...data }) => {
      batch.set(doc(firestore, C_PLANES, id), { ...data, createdAt: new Date().toISOString() });
    });
    await batch.commit();
  } else {
    // Parchar planes existentes que no tengan order ni campos de descuento
    const batch = writeBatch(firestore);
    let changed = false;
    snap.docs.forEach((d, i) => {
      const data = d.data();
      const seed = SEED_PLANES.find(p => p.id === d.id);
      const patch = {};
      // Patch order si falta (causa del orderBy vacío)
      if (data.order == null) patch.order = seed?.order ?? (i + 1);
      if (data.descuentoTrimestral == null && seed?.descuentoTrimestral != null)
        patch.descuentoTrimestral = seed.descuentoTrimestral;
      if (data.descuentoAnual == null && seed?.descuentoAnual != null)
        patch.descuentoAnual = seed.descuentoAnual;
      if (Object.keys(patch).length > 0) {
        batch.update(doc(firestore, C_PLANES, d.id), patch);
        changed = true;
      }
    });
    if (changed) await batch.commit();
  }
  _planesSeeded = true;
}

// ─── Admins ───────────────────────────────────────────────────────────────────
export const admins = {
  check: async (uid, email) => {
    const snap = await getDoc(doc(firestore, C_ADMINS, uid));
    if (snap.exists()) return true;
    // Auto-seed si el email está en la lista blanca
    if (SEED_ADMIN_EMAILS.includes(email)) {
      await setDoc(doc(firestore, C_ADMINS, uid), { email, createdAt: new Date().toISOString() });
      return true;
    }
    return false;
  },
};

// ─── Planes ───────────────────────────────────────────────────────────────────
export const planes = {
  list: async () => {
    await ensurePlanesSeeded();
    const snap = await getDocs(collection(firestore, C_PLANES));
    return snapToList(snap).sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  },

  create: async (payload) => {
    await ensurePlanesSeeded();
    const id   = uid();
    const snap = await getDocs(collection(firestore, C_PLANES));
    const plan = { ...payload, order: snap.size + 1, createdAt: new Date().toISOString() };
    await setDoc(doc(firestore, C_PLANES, id), plan);
    return { id, ...plan };
  },

  update: async (id, payload) => {
    const ref = doc(firestore, C_PLANES, id);
    await updateDoc(ref, payload);
    const snap = await getDoc(ref);
    return docToObj(snap);
  },

  remove: async (id) => {
    await deleteDoc(doc(firestore, C_PLANES, id));
  },
};

// ─── Promoción global ─────────────────────────────────────────────────────────
export const promoApi = {
  get: async () => {
    const snap = await getDoc(doc(firestore, C_PROMO, 'current'));
    return snap.exists() ? snap.data() : null;
  },
  save: async (payload) => {
    await setDoc(doc(firestore, C_PROMO, 'current'), {
      ...payload,
      updatedAt: new Date().toISOString(),
    });
    const snap = await getDoc(doc(firestore, C_PROMO, 'current'));
    return snap.exists() ? snap.data() : null;
  },
  toggle: async (activo) => {
    const ref = doc(firestore, C_PROMO, 'current');
    const snap = await getDoc(ref);
    if (snap.exists()) {
      await updateDoc(ref, { activo, updatedAt: new Date().toISOString() });
    } else {
      await setDoc(ref, { activo, descuento: 10, tipo: 'manual', inicio: null, fin: null, label: 'Promoción', updatedAt: new Date().toISOString() });
    }
    const updated = await getDoc(ref);
    return updated.exists() ? updated.data() : null;
  },
};

// ─── Códigos de descuento ─────────────────────────────────────────────────────
export const promoCodes = {
  list: async () => {
    const snap = await getDocs(query(collection(firestore, C_PROMO_CODES), orderBy('createdAt', 'desc')));
    return snapToList(snap);
  },
  create: async ({ code, descuento, maxUsos }) => {
    const id   = uid();
    const data = {
      code:     code.trim().toUpperCase(),
      descuento: Number(descuento),
      activo:   true,
      usos:     0,
      maxUsos:  maxUsos ? Number(maxUsos) : null,
      createdAt: new Date().toISOString(),
    };
    await setDoc(doc(firestore, C_PROMO_CODES, id), data);
    return { id, ...data };
  },
  toggle: async (id, activo) => {
    await updateDoc(doc(firestore, C_PROMO_CODES, id), { activo });
    const snap = await getDoc(doc(firestore, C_PROMO_CODES, id));
    return docToObj(snap);
  },
  remove: async (id) => {
    await deleteDoc(doc(firestore, C_PROMO_CODES, id));
  },
};

// ─── Configuración de plataforma ─────────────────────────────────────────────
const C_CONFIG = 'demo_config';
export const configApi = {
  getTrial: async () => {
    const snap = await getDoc(doc(firestore, C_CONFIG, 'trial'));
    return snap.exists() ? snap.data() : { diasPrueba: 14 };
  },
  saveTrial: async (diasPrueba) => {
    await setDoc(doc(firestore, C_CONFIG, 'trial'), {
      diasPrueba: Number(diasPrueba),
      updatedAt: new Date().toISOString(),
    });
    return { diasPrueba: Number(diasPrueba) };
  },
};

// ─── User management ─────────────────────────────────────────────────────────
export const userManagement = {
  sendPasswordReset: (email) => sendPasswordResetEmail(auth, email),
};

// ─── Usuarios finales (reservantes) ──────────────────────────────────────────
export const usuarios = {
  count: async () => {
    const snap = await getDocs(collection(firestore, C_USUARIOS));
    return snap.size;
  },
};

// ─── Tenants (espacios) ───────────────────────────────────────────────────────
export const tenants = {
  list: async () => {
    const [espaciosSnap, usuariosSnap] = await Promise.all([
      getDocs(collection(firestore, C_ESPACIOS)),
      getDocs(collection(firestore, C_USUARIOS)),
    ]);

    const usuariosByUid = {};
    usuariosSnap.docs.forEach(d => { usuariosByUid[d.id] = d.data(); });

    return espaciosSnap.docs.map(d => {
      const espacio = { id: d.id, ...d.data() };
      const usuario = espacio.userId ? usuariosByUid[espacio.userId] : null;
      return { ...espacio, usuario };
    });
  },

  update: async (id, payload) => {
    const ref = doc(firestore, C_ESPACIOS, id);
    await updateDoc(ref, payload);
    const snap = await getDoc(ref);
    return docToObj(snap);
  },

  // Elimina todos los espacios del tenant + sus workshops y reservas en cascada
  remove: async (espacioIds, userId) => {
    const batch = writeBatch(firestore);

    for (const espacioId of espacioIds) {
      // Workshops de este espacio
      const wsSnap = await getDocs(query(collection(firestore, C_WORKSHOPS), where('espacioId', '==', espacioId)));
      for (const wsDoc of wsSnap.docs) {
        // Reservas de cada workshop
        const resSnap = await getDocs(query(collection(firestore, C_RESERVAS), where('workshopId', '==', wsDoc.id)));
        resSnap.docs.forEach(r => batch.delete(r.ref));
        batch.delete(wsDoc.ref);
      }
      batch.delete(doc(firestore, C_ESPACIOS, espacioId));
    }

    // Perfil de usuario
    if (userId) batch.delete(doc(firestore, C_USUARIOS, userId));

    await batch.commit();
  },
};
