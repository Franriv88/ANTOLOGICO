import { getOrInitDemoData, saveDemoData } from '../lib/demo';

function uid() {
  return crypto.randomUUID
    ? crypto.randomUUID()
    : Date.now().toString(36) + Math.random().toString(36).slice(2);
}

function db()     { return getOrInitDemoData(); }
function save(d)  { saveDemoData(d); }

export const profesionales = {
  upsert: async () => {},
};

export const reservas = {
  list: async (workshopId) =>
    (db().reservas ?? []).filter(r => r.workshopId === workshopId),

  listByEspacio: async (espacioId) => {
    const d = db();
    const wsIds = new Set(d.workshops.filter(w => w.espacioId === espacioId).map(w => w.id));
    return (d.reservas ?? []).filter(r => wsIds.has(r.workshopId));
  },

  create: async (workshopId, { nombre, email, telefono }) => {
    const d = db();
    if (!d.reservas) d.reservas = [];
    const reserva = {
      id: uid(), workshopId, nombre, email, telefono: telefono ?? '',
      fecha_reserva: new Date().toISOString(),
      estado: 'CONFIRMADA',
    };
    d.reservas.push(reserva);
    const wi = d.workshops.findIndex(w => w.id === workshopId);
    if (wi >= 0 && d.workshops[wi].cuposDisponibles > 0) d.workshops[wi].cuposDisponibles--;
    save(d);
    return reserva;
  },

  cancel: async (id) => {
    const d = db();
    const i = d.reservas.findIndex(r => r.id === id);
    if (i >= 0 && d.reservas[i].estado !== 'CANCELADA') {
      const workshopId = d.reservas[i].workshopId;
      d.reservas[i] = { ...d.reservas[i], estado: 'CANCELADA' };
      const wi = d.workshops.findIndex(w => w.id === workshopId);
      if (wi >= 0) d.workshops[wi].cuposDisponibles++;
      save(d);
    }
    return d.reservas[i] ?? null;
  },
};

export const espacios = {
  list: async () => db().espacios,

  get: async (id) => db().espacios.find((e) => e.id === id) ?? null,

  create: async (payload) => {
    const d = db();
    const espacio = {
      id: uid(), estado: 'ACTIVO', cancelacionPendiente: false,
      logoUrl: null, logoShape: 'round', brandColors: null, brandFont: null,
      rubro: null, plan: null, dominio_on_espacio: null,
      createdAt: new Date().toISOString(),
      ...payload,
    };
    d.espacios.push(espacio);
    save(d);
    return espacio;
  },

  update: async (id, payload) => {
    const d = db();
    const i = d.espacios.findIndex((e) => e.id === id);
    if (i >= 0) { d.espacios[i] = { ...d.espacios[i], ...payload }; save(d); }
    return d.espacios[i] ?? null;
  },

  updateIdentidad:      async (id, payload)  => espacios.update(id, payload),
  updatePlan:           async (id, planId)   => espacios.update(id, { planId }),
  solicitarCancelacion: async (id)           => espacios.update(id, { cancelacionPendiente: true }),
  reactivarSuscripcion: async (id)           => espacios.update(id, { cancelacionPendiente: false }),
};

export const rubros = {
  list: async () => [],
};

export const workshops = {
  list: async (espacioId, params = {}) => {
    let ws = db().workshops.filter((w) => w.espacioId === espacioId);
    if (params.estado) ws = ws.filter((w) => w.estado === params.estado);
    if (params.q)      ws = ws.filter((w) => w.nombre.toLowerCase().includes(params.q.toLowerCase()));
    return ws;
  },

  get: async (id) => db().workshops.find((w) => w.id === id) ?? null,

  create: async (espacioId, payload) => {
    const d = db();
    const ws = {
      id: uid(), espacioId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...payload,
    };
    d.workshops.push(ws);
    save(d);
    return ws;
  },

  update: async (id, _espacioId, payload) => {
    const d = db();
    const i = d.workshops.findIndex((w) => w.id === id);
    if (i >= 0) {
      d.workshops[i] = { ...d.workshops[i], ...payload, updatedAt: new Date().toISOString() };
      save(d);
    }
    return d.workshops[i] ?? null;
  },

  quickStatus: async (id, _espacioId, estado, cuposDisponibles) => {
    const d = db();
    const i = d.workshops.findIndex((w) => w.id === id);
    if (i >= 0) { d.workshops[i] = { ...d.workshops[i], estado, cuposDisponibles }; save(d); }
    return d.workshops[i] ?? null;
  },

  remove: async (id, _espacioId) => {
    const d = db();
    d.workshops = d.workshops.filter((w) => w.id !== id);
    save(d);
    return null;
  },
};
