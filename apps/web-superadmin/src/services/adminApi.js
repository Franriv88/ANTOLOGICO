import {
  collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc,
  query, orderBy, writeBatch,
} from 'firebase/firestore';
import { sendPasswordResetEmail } from 'firebase/auth';

const C_PROMO = 'demo_promo';
import { firestore, auth } from '../lib/firebase';

const C_ADMINS   = 'sa_admins';
const C_PLANES   = 'demo_planes';
const C_ESPACIOS = 'demo_espacios';
const C_USUARIOS = 'demo_usuarios';

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
    // Parchar planes existentes que no tengan campos de descuento
    const batch = writeBatch(firestore);
    let changed = false;
    snap.docs.forEach(d => {
      const data = d.data();
      const seed = SEED_PLANES.find(p => p.id === d.id);
      const patch = {};
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
    const snap = await getDocs(query(collection(firestore, C_PLANES), orderBy('order')));
    return snapToList(snap);
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

// ─── User management ─────────────────────────────────────────────────────────
export const userManagement = {
  sendPasswordReset: (email) => sendPasswordResetEmail(auth, email),
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
};
