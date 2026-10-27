import {
  collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc,
  query, orderBy, where, writeBatch,
} from 'firebase/firestore';
import { sendPasswordResetEmail } from 'firebase/auth';
import { httpsCallable } from 'firebase/functions';

const C_PROMO       = 'demo_promo';
const C_PROMO_CODES = 'demo_promo_codes';
import { firestore, auth, functions } from '../lib/firebase';

const C_ADMINS    = 'sa_admins';
const C_PLANES    = 'demo_planes';
const C_ESPACIOS  = 'demo_espacios';
const C_WORKSHOPS = 'demo_workshops';
const C_RESERVAS  = 'demo_reservas';
const C_USUARIOS  = 'demo_usuarios';
const C_RUBROS    = 'demo_rubros';
const C_CUPONES   = 'demo_cupones';

// Emails que pueden ser super admin (se auto-registran en sa_admins al loguearse).
// Agregá acá cualquier email real que querés que sea super admin — basta con que
// Firebase Auth lo autentique (contraseña o Google) y queda habilitado.
const SEED_ADMIN_EMAILS = [
  'frivasv2388@gmail.com',
  'superadmin@antologico.app', // alias, lo dejamos por compatibilidad
];

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

// ─── Capabilities estandar (lo que el frontend REALMENTE valida) ─────────────
// Cada plan tiene estos flags en Firestore. El frontend los lee para habilitar
// o deshabilitar funcionalidad real (no son solo texto de marketing).
export const PLAN_CAPABILITIES = [
  { key: 'imagenEncabezado',   label: 'Imagen de encabezado en talleres', desc: 'Permite subir una imagen de portada. Si está apagado, solo color.' },
  { key: 'talleresIlimitados', label: 'Talleres ilimitados',              desc: 'Si está apagado, respeta "Máx. talleres".' },
  { key: 'multiplesEspacios',  label: 'Múltiples espacios',               desc: 'Permite al tenant tener más de un espacio.' },
  { key: 'dominioPersonalizado', label: 'Dominio personalizado',          desc: 'Puede configurar un dominio propio.' },
  { key: 'reportes',           label: 'Reportes avanzados',               desc: 'Acceso a estadísticas y métricas.' },
  { key: 'auditoria',          label: 'Auditoría de cambios',             desc: 'Historial de cambios del tenant.' },
];

export const EMPTY_CAPABILITIES = PLAN_CAPABILITIES.reduce((acc, c) => { acc[c.key] = false; return acc; }, {});

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
    capabilities: {
      imagenEncabezado: false,
      talleresIlimitados: false,
      multiplesEspacios: false,
      dominioPersonalizado: true,
      reportes: false,
      auditoria: false,
    },
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
    capabilities: {
      imagenEncabezado: true,
      talleresIlimitados: true,
      multiplesEspacios: false,
      dominioPersonalizado: true,
      reportes: true,
      auditoria: false,
    },
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
    capabilities: {
      imagenEncabezado: true,
      talleresIlimitados: true,
      multiplesEspacios: true,
      dominioPersonalizado: true,
      reportes: true,
      auditoria: true,
    },
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
    // Parchar planes existentes que no tengan order, descuentos o capabilities
    const batch = writeBatch(firestore);
    let changed = false;
    snap.docs.forEach((d, i) => {
      const data = d.data();
      const seed = SEED_PLANES.find(p => p.id === d.id);
      const patch = {};
      if (data.order == null) patch.order = seed?.order ?? (i + 1);
      if (data.descuentoTrimestral == null && seed?.descuentoTrimestral != null)
        patch.descuentoTrimestral = seed.descuentoTrimestral;
      if (data.descuentoAnual == null && seed?.descuentoAnual != null)
        patch.descuentoAnual = seed.descuentoAnual;
      // Migración de capabilities: si no existe el campo, inferimos del seed
      // (si matchea por id) o del nombre del plan (Profesional/Estudio => todo true).
      if (data.capabilities == null) {
        if (seed?.capabilities) {
          patch.capabilities = seed.capabilities;
        } else {
          const nombre = (data.nombre || '').toLowerCase();
          patch.capabilities = {
            ...EMPTY_CAPABILITIES,
            dominioPersonalizado: true,
            imagenEncabezado:   nombre.includes('profesional') || nombre.includes('estudio'),
            talleresIlimitados: nombre.includes('profesional') || nombre.includes('estudio'),
            multiplesEspacios:  nombre.includes('estudio'),
            reportes:           nombre.includes('profesional') || nombre.includes('estudio'),
            auditoria:          nombre.includes('estudio'),
          };
        }
      }
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

// ─── Métricas (workshops + reservas) ─────────────────────────────────────────
export const metricas = {
  workshops: async () => {
    const snap = await getDocs(collection(firestore, C_WORKSHOPS));
    return snapToList(snap);
  },
  reservas: async () => {
    const snap = await getDocs(collection(firestore, C_RESERVAS));
    return snapToList(snap);
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

  resetTrial: async (espacioIds) => {
    const now = new Date().toISOString();
    await Promise.all(
      espacioIds.map(id => updateDoc(doc(firestore, C_ESPACIOS, id), { trialStartedAt: now }))
    );
    return now;
  },

  // Elimina todos los espacios del tenant + sus workshops y reservas en cascada,
  // y además borra la cuenta de Firebase Auth (via Cloud Function con Admin SDK)
  // para que el email del tenant quede libre y pueda registrarse de nuevo.
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

    // Perfil de usuario (demo_usuarios)
    if (userId) batch.delete(doc(firestore, C_USUARIOS, userId));

    await batch.commit();

    // Finalmente, eliminar la cuenta de Firebase Auth para liberar el email.
    // Si falla acá no revertimos Firestore (el tenant ya quedó eliminado como
    // registro), pero avisamos al UI.
    if (userId) {
      try {
        await httpsCallable(functions, 'deleteTenantAuth')({ uid: userId });
      } catch (err) {
        console.error('deleteTenantAuth failed:', err);
        throw new Error('El tenant fue eliminado de la base de datos, pero no se pudo liberar su email de Firebase Auth. Contactá soporte técnico.');
      }
    }
  },
};

// ─── Espacio propio del Super Admin (para testeo) ────────────────────────────
export const adminEspacio = {
  get: async (adminUid) => {
    const q = query(
      collection(firestore, C_ESPACIOS),
      where('userId', '==', adminUid),
      where('isSuperAdmin', '==', true)
    );
    const snap = await getDocs(q);
    if (snap.empty) return null;
    const d = snap.docs[0];
    return { id: d.id, ...d.data() };
  },

  create: async (adminUid, email, nombre) => {
    await ensurePlanesSeeded();
    const planesSnap = await getDocs(collection(firestore, C_PLANES));
    const estudio = planesSnap.docs.find(d => d.id === 'estudio')?.data();

    const id = uid();
    const espacio = {
      userId: adminUid,
      nombre: nombre || 'Espacio Admin',
      estado: 'ACTIVO',
      cancelacionPendiente: false,
      isSuperAdmin: true,
      logoUrl: null,
      logoShape: 'round',
      brandColors: null,
      brandFont: null,
      rubroPersonalizado: null,
      plan: estudio ? { nombre: 'Estudio', ...estudio } : { nombre: 'Estudio' },
      planId: 'estudio',
      periodoFacturacion: 'mensual',
      precioActual: 0,
      proximaRenovacion: null,
      slug: null,
      createdAt: new Date().toISOString(),
      trialStartedAt: null,
    };
    await setDoc(doc(firestore, C_ESPACIOS, id), espacio);

    const userRef = doc(firestore, C_USUARIOS, adminUid);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) {
      await setDoc(userRef, {
        nombre: email.split('@')[0],
        email,
        onboardingComplete: true,
        createdAt: new Date().toISOString(),
      });
    }

    return { id, ...espacio };
  },

  update: async (id, payload) => {
    const ref = doc(firestore, C_ESPACIOS, id);
    await updateDoc(ref, payload);
    const snap = await getDoc(ref);
    return docToObj(snap);
  },
};

// ─── Rubros (categorías de talleres) ─────────────────────────────────────────
const SEED_RUBROS = [
  'Arte y pintura', 'Baile y danza', 'Cocina y gastronomía',
  'Diseño y creatividad', 'Fitness y deporte', 'Fotografía',
  'Idiomas', 'Manualidades y DIY', 'Marketing y negocios',
  'Meditación y mindfulness', 'Música', 'Teatro y actuación',
  'Tecnología y programación', 'Yoga y bienestar',
];

let _rubrosSeeded = false;
async function ensureRubrosSeeded() {
  if (_rubrosSeeded) return;
  const snap = await getDocs(collection(firestore, C_RUBROS));
  if (snap.empty) {
    const batch = writeBatch(firestore);
    SEED_RUBROS.forEach((nombre, i) => {
      const id = uid();
      batch.set(doc(firestore, C_RUBROS, id), {
        nombre,
        order: i + 1,
        activo: true,
        createdAt: new Date().toISOString(),
      });
    });
    await batch.commit();
  }
  _rubrosSeeded = true;
}

export const rubros = {
  list: async () => {
    await ensureRubrosSeeded();
    const snap = await getDocs(collection(firestore, C_RUBROS));
    return snapToList(snap).sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  },

  create: async (nombre) => {
    await ensureRubrosSeeded();
    const snap = await getDocs(collection(firestore, C_RUBROS));
    const id = uid();
    const data = {
      nombre: nombre.trim(),
      order: snap.size + 1,
      activo: true,
      createdAt: new Date().toISOString(),
    };
    await setDoc(doc(firestore, C_RUBROS, id), data);
    return { id, ...data };
  },

  update: async (id, payload) => {
    const ref = doc(firestore, C_RUBROS, id);
    await updateDoc(ref, payload);
    const snap = await getDoc(ref);
    return docToObj(snap);
  },

  remove: async (id) => {
    await deleteDoc(doc(firestore, C_RUBROS, id));
  },
};

export const cupones = {
  list: async () => {
    const snap = await getDocs(query(collection(firestore, C_CUPONES), orderBy('createdAt', 'desc')));
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  },

  create: async ({ codigo, descuento, duracionMeses, maxUsos }) => {
    const id = codigo.trim().toUpperCase().replace(/\s+/g, '');
    const exists = await getDoc(doc(firestore, C_CUPONES, id));
    if (exists.exists()) throw new Error('Ya existe un cupón con ese código.');
    const data = {
      codigo: id,
      descuento: Number(descuento),
      duracionMeses: Number(duracionMeses),
      maxUsos: maxUsos ? Number(maxUsos) : null,
      usosActuales: 0,
      activo: true,
      createdAt: new Date().toISOString(),
    };
    await setDoc(doc(firestore, C_CUPONES, id), data);
    return { id, ...data };
  },

  toggle: async (id, activo) => {
    await updateDoc(doc(firestore, C_CUPONES, id), { activo });
  },

  remove: async (id) => {
    await deleteDoc(doc(firestore, C_CUPONES, id));
  },
};
