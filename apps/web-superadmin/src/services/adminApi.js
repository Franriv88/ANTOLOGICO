import {
  collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc,
  query, orderBy, where, writeBatch, serverTimestamp,
} from 'firebase/firestore';
import { sendPasswordResetEmail } from 'firebase/auth';
import { httpsCallable } from 'firebase/functions';

const C_PROMO       = 'demo_promo';
const C_PROMO_CODES = 'demo_promo_codes';
import { firestore, auth, functions } from '../lib/firebase';

const C_ADMINS    = 'sa_admins';
const C_PLANES    = 'demo_planes';
const C_USUARIOS  = 'demo_usuarios';
const C_RUBROS    = 'demo_rubros';
const C_CUPONES   = 'demo_cupones';

// ─── Data Connect (fuente única de verdad para datos relacionales) ──────────
import {
  adminListAllEspacios,
  adminListAllWorkshops,
  adminListAllReservas,
  adminUpdateEspacio,
  adminDeleteEspacio,
  adminDeleteProfesional,
  adminUpsertProfesional,
  adminEnsureProfesional,
  adminCreateEspacioMigrate,
  adminCreateWorkshopMigrate,
} from '../dataconnect-generated';

// Emails que pueden ser super admin (se auto-registran en sa_admins al loguearse).
const SEED_ADMIN_EMAILS = [
  'frivasv2388@gmail.com',
  'francisco.rivas@davinci.edu.ar',
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

// ─── Capabilities estandar ─────────────────────────────────────────────────
export const PLAN_CAPABILITIES = [
  { key: 'imagenEncabezado',   label: 'Imagen de encabezado en talleres', desc: 'Permite subir una imagen de portada. Si está apagado, solo color.' },
  { key: 'talleresIlimitados', label: 'Talleres ilimitados',              desc: 'Si está apagado, respeta "Máx. talleres".' },
  { key: 'multiplesEspacios',  label: 'Múltiples espacios',               desc: 'Permite al tenant tener más de un espacio.' },
  { key: 'dominioPersonalizado', label: 'Dominio personalizado',          desc: 'Puede configurar un dominio propio.' },
  { key: 'reportes',           label: 'Reportes avanzados',               desc: 'Acceso a estadísticas y métricas.' },
  { key: 'auditoria',          label: 'Auditoría de cambios',             desc: 'Historial de cambios del tenant.' },
];

export const EMPTY_CAPABILITIES = PLAN_CAPABILITIES.reduce((acc, c) => { acc[c.key] = false; return acc; }, {});

// ─── Planes iniciales ──────────────────────────────────────────────────────
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

// ─── Usuarios (perfiles — sigue en Firestore) ───────────────────────────────
export const usuarios = {
  count: async () => {
    const snap = await getDocs(collection(firestore, C_USUARIOS));
    return snap.size;
  },

  list: async () => {
    // Perfiles de Firestore + cross-ref espacios de Data Connect
    const [usuariosSnap, dcResult] = await Promise.all([
      getDocs(collection(firestore, C_USUARIOS)),
      adminListAllEspacios({ fetchPolicy: 'SERVER_ONLY' }),
    ]);

    const dcEspacios = dcResult.data?.espacios ?? [];
    const espaciosByUid = {};
    dcEspacios.forEach(e => {
      const uid = e.profesional?.uid;
      if (uid) {
        if (!espaciosByUid[uid]) espaciosByUid[uid] = [];
        espaciosByUid[uid].push({ id: e.id, nombre: e.nombre, planId: e.plan?.id });
      }
    });

    return usuariosSnap.docs.map(d => {
      const data = d.data();
      const espacios = espaciosByUid[d.id] || [];
      return {
        uid: d.id,
        ...data,
        tipo: espacios.length > 0 ? 'tenant' : 'alumno',
        espacios,
      };
    });
  },

  anonymize: async (uid) => {
    const ref = doc(firestore, C_USUARIOS, uid);
    const snap = await getDoc(ref);
    if (!snap.exists()) throw new Error('Usuario no encontrado');

    const anon = {
      nombre: '[Datos eliminados]',
      apellido: '',
      email: `anon_${uid.slice(0, 8)}@deleted.antologico`,
      telefono: '',
      photoURL: '',
      fechaNac: null,
      genero: null,
      redesSociales: null,
      espaciosSeguidos: [],
      anonymizedAt: new Date().toISOString(),
      estado: 'ANONIMIZADO',
    };
    await updateDoc(ref, anon);

    try {
      await httpsCallable(functions, 'deleteTenantAuth')({ uid });
    } catch (err) {
      console.error('deleteTenantAuth (anonymize) failed:', err);
    }

    return anon;
  },

  deleteProfile: async (uid) => {
    await deleteDoc(doc(firestore, C_USUARIOS, uid));
  },
};

// ─── Métricas (Data Connect) ────────────────────────────────────────────────
export const metricas = {
  workshops: async () => {
    const { data } = await adminListAllWorkshops({ fetchPolicy: 'SERVER_ONLY' });
    return (data.workshops ?? []).map(w => ({
      id: w.id,
      nombre: w.nombre,
      tipo: w.tipo,
      estado: w.estado,
      cuposTotales: w.cuposTotales,
      cuposDisponibles: w.cuposDisponibles,
      precio: w.precio,
      fecha: w.fecha,
      createdAt: w.createdAt,
      espacioId: w.espacio?.id,
      espacioNombre: w.espacio?.nombre,
    }));
  },
  reservas: async () => {
    const { data } = await adminListAllReservas({ fetchPolicy: 'SERVER_ONLY' });
    return (data.reservas ?? []).map(r => ({
      id: r.id,
      estado: r.estado,
      fechaReserva: r.fechaReserva,
      pagoExternoId: r.pagoExternoId,
      createdAt: r.createdAt,
      usuarioNombre: r.usuario?.nombre,
      usuarioEmail: r.usuario?.email,
      workshopId: r.workshop?.id,
      workshopNombre: r.workshop?.nombre,
      espacioId: r.workshop?.espacio?.id,
      espacioNombre: r.workshop?.espacio?.nombre,
    }));
  },
};

// ─── Tenants (Data Connect + perfiles de Firestore) ─────────────────────────
export const tenants = {
  list: async () => {
    const [dcResult, usuariosSnap] = await Promise.all([
      adminListAllEspacios({ fetchPolicy: 'SERVER_ONLY' }),
      getDocs(collection(firestore, C_USUARIOS)),
    ]);

    const perfiles = {};
    usuariosSnap.docs.forEach(d => { perfiles[d.id] = d.data(); });

    const dcEspacios = dcResult.data?.espacios ?? [];

    return dcEspacios.map(e => {
      const profUid = e.profesional?.uid;
      const profile = profUid ? perfiles[profUid] : null;
      return {
        id:                   e.id,
        nombre:               e.nombre,
        estado:               e.estado,
        cancelacionPendiente: e.cancelacionPendiente,
        createdAt:            e.createdAt,
        updatedAt:            e.updatedAt,
        slug:                 e.slug,
        bloqueado:            e.bloqueado ?? false,
        trialStartedAt:       e.trialStartedAt ?? e.createdAt,
        isSuperAdmin:         e.isSuperAdmin ?? false,
        logoUrl:              e.logoUrl,
        logoShape:            e.logoShape,
        logoScale:            e.logoScale,
        brandColors:          e.brandColors,
        brandFont:            e.brandFont,
        redesSociales:        e.redesSociales,
        cobros:               e.cobros,
        userId:               profUid,
        rubro:                e.rubro,
        rubroPersonalizado:   e.rubroPersonalizado,
        planId:               e.plan?.id,
        selectedPlan:         e.plan?.id,
        plan:                 e.plan,
        usuario: profile ? {
          ...profile,
          nombre: profile.nombre || e.profesional?.nombre,
          email:  profile.email  || e.profesional?.email,
        } : e.profesional ? {
          nombre: e.profesional.nombre,
          email:  e.profesional.email,
        } : null,
      };
    });
  },

  update: async (id, payload) => {
    await adminUpdateEspacio({
      id,
      bloqueado:      payload.bloqueado,
      trialStartedAt: payload.trialStartedAt,
      slug:           payload.slug,
      estado:         payload.estado,
    });
  },

  resetTrial: async (espacioIds, trialStartedAt) => {
    const ts = trialStartedAt ?? new Date().toISOString();
    await Promise.all(
      espacioIds.map(id => adminUpdateEspacio({ id, trialStartedAt: ts }))
    );
    return ts;
  },

  remove: async (espacioIds, userId) => {
    for (const espacioId of espacioIds) {
      await adminDeleteEspacio({ id: espacioId });
    }

    if (userId) {
      try {
        await adminDeleteProfesional({ uid: userId });
      } catch (err) {
        console.warn('adminDeleteProfesional failed (may not exist):', err);
      }
    }

    if (userId) {
      await deleteDoc(doc(firestore, C_USUARIOS, userId)).catch(() => {});
    }

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
export async function revokeSession(uid) {
  if (!uid) return;
  await setDoc(doc(firestore, 'revoked_sessions', uid), {
    revokedAt: serverTimestamp(),
  });
}

export const adminEspacio = {
  get: async (adminUid) => {
    try {
      const { data } = await adminListAllEspacios({ fetchPolicy: 'SERVER_ONLY' });
      const list = data.espacios ?? [];
      return list.find(e => e.profesional?.uid === adminUid && e.isSuperAdmin) || null;
    } catch {
      return null;
    }
  },

  create: async (adminUid, email, nombre) => {
    await ensurePlanesSeeded();
    const planesSnap = await getDocs(collection(firestore, C_PLANES));
    const estudio = planesSnap.docs.find(d => d.id === 'estudio')?.data();

    const id = uid();
    const C_ESPACIOS = 'demo_espacios';
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
    const C_ESPACIOS = 'demo_espacios';
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

// ─── Migración Firestore → Data Connect (una sola vez) ─────────────────────
const C_FS_ESPACIOS  = 'demo_espacios';
const C_FS_WORKSHOPS = 'demo_workshops';

export const migration = {
  readFirestoreEspacios: async () => {
    const snap = await getDocs(collection(firestore, C_FS_ESPACIOS));
    return snap.docs.map(d => ({ firestoreId: d.id, ...d.data() }));
  },

  readFirestoreWorkshops: async (espacioFirestoreId) => {
    const snap = await getDocs(
      query(collection(firestore, C_FS_ESPACIOS, espacioFirestoreId, 'workshops'))
    );
    if (snap.empty) {
      const globalSnap = await getDocs(
        query(collection(firestore, C_FS_WORKSHOPS), where('espacioId', '==', espacioFirestoreId))
      );
      return globalSnap.docs.map(d => ({ firestoreId: d.id, ...d.data() }));
    }
    return snap.docs.map(d => ({ firestoreId: d.id, ...d.data() }));
  },

  migrateEspacio: async (fsEspacio) => {
    const userId = fsEspacio.userId;
    if (!userId) throw new Error('Espacio sin userId');

    const userSnap = await getDoc(doc(firestore, C_USUARIOS, userId));
    const profile = userSnap.exists() ? userSnap.data() : {};
    const profNombre = profile.nombre || fsEspacio.nombre || 'Sin nombre';
    const profEmail  = profile.email  || `${userId}@unknown.antologico`;

    await adminEnsureProfesional({ uid: userId, nombre: profNombre, email: profEmail });

    const result = await adminCreateEspacioMigrate({
      profesionalUid:    userId,
      nombre:            fsEspacio.nombre || 'Sin nombre',
      rubroPersonalizado: fsEspacio.rubroPersonalizado || fsEspacio.rubro || null,
      slug:              fsEspacio.slug || null,
      logoUrl:           fsEspacio.logoUrl || null,
      logoShape:         fsEspacio.logoShape || null,
      logoScale:         fsEspacio.logoScale || null,
      brandColors:       fsEspacio.brandColors || null,
      brandFont:         fsEspacio.brandFont || null,
      redesSociales:     fsEspacio.redesSociales || null,
      cobros:            fsEspacio.cobros || null,
      estado:            'ACTIVO',
    });

    return result;
  },

  migrateWorkshop: async (dcEspacioId, fsWorkshop) => {
    const parseFecha = (f) => {
      if (!f) return new Date().toISOString();
      if (f.toDate) return f.toDate().toISOString();
      if (typeof f === 'string') return f;
      return new Date(f).toISOString();
    };

    await adminCreateWorkshopMigrate({
      espacioId:         dcEspacioId,
      nombre:            fsWorkshop.nombre || 'Sin nombre',
      tipo:              fsWorkshop.tipo || null,
      descripcion:       fsWorkshop.descripcion || null,
      cuposTotales:      fsWorkshop.cuposTotales ?? 10,
      cuposDisponibles:  fsWorkshop.cuposDisponibles ?? fsWorkshop.cuposTotales ?? 10,
      precio:            fsWorkshop.precio ?? 0,
      fecha:             parseFecha(fsWorkshop.fecha),
      duracionHoras:     fsWorkshop.duracionHoras || null,
      duracionMinutos:   fsWorkshop.duracionMinutos || null,
      experienciaPrevia: fsWorkshop.experienciaPrevia || null,
      scheduleData:      fsWorkshop.scheduleData || null,
      headerType:        fsWorkshop.headerType || null,
      headerValue:       fsWorkshop.headerValue || null,
      metodosPago:       fsWorkshop.metodosPago || null,
      estado:            fsWorkshop.estado || 'BORRADOR',
    });
  },

  deleteEspacio8: async () => {
    const { data } = await adminListAllEspacios({ fetchPolicy: 'SERVER_ONLY' });
    const espacio8 = (data.espacios ?? []).find(e => e.nombre === '8');
    if (!espacio8) throw new Error('Espacio "8" no encontrado en Data Connect');
    await adminDeleteEspacio({ id: espacio8.id });
    if (espacio8.profesional?.uid) {
      try { await adminDeleteProfesional({ uid: espacio8.profesional.uid }); } catch { /* may be shared */ }
    }
    return espacio8.id;
  },
};
