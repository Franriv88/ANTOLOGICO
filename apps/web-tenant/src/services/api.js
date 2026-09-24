import {
  listMyEspacios,
  getMyEspacio,
  createEspacio,
  updateEspacio,
  solicitarCancelacionEspacio,
  reactivarSuscripcionEspacio,
  listRubros,
  listMyWorkshops,
  listMyWorkshopsByEstado,
  searchMyWorkshops,
  getMyWorkshop,
  createWorkshop,
  updateWorkshop,
  deleteWorkshop,
} from '../dataconnect-generated';

export const espacios = {
  list: async () => {
    const { data } = await listMyEspacios();
    return data.espacios;
  },
  get: async (id) => {
    const { data } = await getMyEspacio({ id });
    return data.espacios[0] ?? null;
  },
  create: async (payload) => {
    const { data } = await createEspacio(payload);
    return data.espacio_insert;
  },
  update: async (id, payload) => {
    const { data } = await updateEspacio({ id, ...payload });
    return data.espacio_update;
  },
  solicitarCancelacion: async (id) => {
    const { data } = await solicitarCancelacionEspacio({ id });
    return data.espacio_update;
  },
  reactivarSuscripcion: async (id) => {
    const { data } = await reactivarSuscripcionEspacio({ id });
    return data.espacio_update;
  },
};

export const rubros = {
  list: async () => {
    const { data } = await listRubros();
    return data.rubros;
  },
};

export const workshops = {
  list: async (espacioId, params = {}) => {
    if (params.q) {
      const { data } = await searchMyWorkshops({ espacioId, q: params.q });
      return data.workshops;
    }
    if (params.estado) {
      const { data } = await listMyWorkshopsByEstado({ espacioId, estado: params.estado });
      return data.workshops;
    }
    const { data } = await listMyWorkshops({ espacioId });
    return data.workshops;
  },
  get: async (id) => {
    const { data } = await getMyWorkshop({ id });
    return data.workshops[0] ?? null;
  },
  create: async (espacioId, payload) => {
    const { data } = await createWorkshop({ espacioId, ...payload });
    return data.workshop_insert;
  },
  update: async (id, espacioId, payload) => {
    const { data } = await updateWorkshop({ id, espacioId, ...payload });
    return data.workshop_update;
  },
  remove: async (id, espacioId) => {
    const { data } = await deleteWorkshop({ id, espacioId });
    return data.workshop_delete;
  },
};
