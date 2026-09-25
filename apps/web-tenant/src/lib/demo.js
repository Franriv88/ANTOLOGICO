export const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === 'true';

export const DEMO_EMAIL    = 'demo@antologico.app';
export const DEMO_PASSWORD = 'Demo2024!';

const DEMO_USER = {
  uid:         'demo-uid-001',
  email:       DEMO_EMAIL,
  displayName: 'Demo Tenant',
};

const SESSION_KEY = 'ant_demo_session';
const DATA_KEY    = 'ant_demo_data';

export function getDemoUser()    { return DEMO_USER; }
export function getDemoSession() {
  try { return JSON.parse(localStorage.getItem(SESSION_KEY)); } catch { return null; }
}
export function saveDemoSession() {
  localStorage.setItem(SESSION_KEY, JSON.stringify(DEMO_USER));
}
export function clearDemoSession() {
  localStorage.removeItem(SESSION_KEY);
}

// ─── Initial demo data ────────────────────────────────────────────────────────

function future(days) {
  return new Date(Date.now() + days * 86_400_000).toISOString();
}

const BASE_ESPACIO = {
  id:                  'demo-espacio-001',
  nombre:              'Estudio de Yoga Zen',
  estado:              'ACTIVO',
  cancelacionPendiente: false,
  rubroPersonalizado:  'Yoga y bienestar',
  rubro:               null,
  plan:                null,
  dominio_on_espacio:  null,
  logoUrl:             null,
  logoShape:           'round',
  brandColors:         ['#E85D4A'],
  brandFont:           'IBM Plex Sans',
  createdAt:           new Date().toISOString(),
};

const BASE_WORKSHOPS = [
  {
    id: 'demo-ws-001', espacioId: 'demo-espacio-001',
    nombre: 'Yoga Restaurativo para principiantes',
    tipo: 'TALLER',
    descripcion: 'Una sesión tranquila enfocada en la relajación y restauración del cuerpo.',
    cuposTotales: 12, cuposDisponibles: 8,
    precio: 3500,
    fecha: future(7), duracionHoras: 1, duracionMinutos: 30,
    experienciaPrevia: false, scheduleData: null,
    headerType: 'COLOR', headerValue: '#E85D4A',
    estado: 'PUBLICADO',
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },
  {
    id: 'demo-ws-002', espacioId: 'demo-espacio-001',
    nombre: 'Meditación Mindfulness — 4 semanas',
    tipo: 'CURSO',
    descripcion: 'Programa de 4 semanas para desarrollar una práctica diaria de meditación.',
    cuposTotales: 8, cuposDisponibles: 2,
    precio: 12000,
    fecha: future(14), duracionHoras: 1, duracionMinutos: 0,
    experienciaPrevia: false, scheduleData: null,
    headerType: 'COLOR', headerValue: '#3B82F6',
    estado: 'PUBLICADO',
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },
  {
    id: 'demo-ws-003', espacioId: 'demo-espacio-001',
    nombre: 'Retiro de Yin Yoga',
    tipo: 'WORKSHOP',
    descripcion: 'Jornada intensiva de Yin Yoga para trabajar la flexibilidad y la relajación profunda.',
    cuposTotales: 10, cuposDisponibles: 0,
    precio: 8500,
    fecha: future(21), duracionHoras: 4, duracionMinutos: 0,
    experienciaPrevia: false, scheduleData: null,
    headerType: 'COLOR', headerValue: '#10B981',
    estado: 'PUBLICADO',
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },
  {
    id: 'demo-ws-004', espacioId: 'demo-espacio-001',
    nombre: 'Clase de Respiración Pranayama',
    tipo: 'CLASE',
    descripcion: 'Técnicas de respiración para reducir el estrés y mejorar la concentración.',
    cuposTotales: 15, cuposDisponibles: 15,
    precio: 2000,
    fecha: future(3), duracionHoras: 1, duracionMinutos: 0,
    experienciaPrevia: false, scheduleData: null,
    headerType: 'COLOR', headerValue: '#F59E0B',
    estado: 'BORRADOR',
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },
];

export function getOrInitDemoData() {
  try {
    const raw = localStorage.getItem(DATA_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (!parsed.reservas) parsed.reservas = [];
      return parsed;
    }
  } catch {}
  const initial = { espacios: [BASE_ESPACIO], workshops: BASE_WORKSHOPS, reservas: [] };
  localStorage.setItem(DATA_KEY, JSON.stringify(initial));
  return initial;
}

export function saveDemoData(d) {
  localStorage.setItem(DATA_KEY, JSON.stringify(d));
}
