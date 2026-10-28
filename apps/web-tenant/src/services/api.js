import {
  listMyEspacios,
  getMyEspacio,
  createEspacio,
  updateEspacio,
  updateEspacioPlanId,
  updateEspacioIdentidad,
  updateEspacioRedes,
  updateEspacioCobros,
  solicitarCancelacionEspacio,
  reactivarSuscripcionEspacio,
  listRubros,
  listMyWorkshops,
  listMyWorkshopsByEstado,
  searchMyWorkshops,
  getMyWorkshop,
  createWorkshop,
  updateWorkshop,
  updateWorkshopEstado,
  deleteWorkshop,
  upsertProfesional,
  listReservasByEspacio,
  cancelarReserva,
} from '../dataconnect-generated';

export const profesionales = {
  upsert: async ({ nombre, email }) => {
    const result = await upsertProfesional({ nombre, email });
    if (result.errors?.length) throw new Error(result.errors.map(e => e.message).join(' | '));
  },
};

export const reservas = {
  list: async () => [],
  listByEspacio: async (espacioId) => {
    const { data } = await listReservasByEspacio({ espacioId });
    return (data?.reservas ?? []).map(r => ({
      id:          r.id,
      workshopId:  r.workshop.id,
      nombre:      r.usuario.nombre,
      email:       r.usuario.email,
      usuarioUid:  r.usuario.uid,
      estado:      r.estado,
      fechaReserva: r.fechaReserva,
      metodoPago:  null,
      estadoPago:  null,
      grupoId:     null,
      workshop:    r.workshop,
    }));
  },
  create: async () => { throw new Error('Reservas aún no implementadas en Firebase'); },
  markPaid: async () => { throw new Error('Reservas aún no implementadas en Firebase'); },
  cancel: async (id, workshopId) => {
    const result = await cancelarReserva({ id, workshopId });
    if (result.errors?.length) throw new Error(result.errors.map(e => e.message).join(' | '));
  },
};


export const espacios = {
  list: async () => {
    const result = await listMyEspacios();
    console.log('[api] listMyEspacios raw result:', result);
    const { data } = result;
    return data.espacios;
  },
  get: async (id) => {
    const { data } = await getMyEspacio({ id });
    return data.espacios[0] ?? null;
  },
  create: async (payload) => {
    const result = await createEspacio(payload);
    if (result.errors?.length) throw new Error(result.errors.map(e => e.message).join(' | '));
    return result.data?.espacio_insert;
  },
  update: async (id, payload) => {
    const { data } = await updateEspacio({ id, ...payload });
    return data.espacio_update;
  },
  updateIdentidad: async (id, { logoUrl, logoShape, logoScale, brandColors, brandFont }) => {
    const { data } = await updateEspacioIdentidad({ id, logoUrl, logoShape, logoScale, brandColors, brandFont });
    return data.espacio_update;
  },
  updateRedes: async (id, redesSociales) => {
    const { data } = await updateEspacioRedes({ id, redesSociales });
    return data.espacio_update;
  },
  updateCobros: async (id, cobros) => {
    const { data } = await updateEspacioCobros({ id, cobros });
    return data.espacio_update;
  },
  updatePlan: async (id, planId) => {
    const { data } = await updateEspacioPlanId({ id, planId });
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
      return data.workshops ?? [];
    }
    if (params.estado) {
      const { data } = await listMyWorkshopsByEstado({ espacioId, estado: params.estado });
      return data.workshops ?? [];
    }
    const result = await listMyWorkshops({ espacioId });
    console.log('[api] listMyWorkshops raw result:', result);
    const { data } = result;
    return data.workshops ?? [];
  },
  get: async (id) => {
    const { data } = await getMyWorkshop({ id });
    return data.workshops[0] ?? null;
  },
  create: async (espacioId, payload) => {
    const result = await createWorkshop({ espacioId, ...payload });
    if (result.errors?.length) throw new Error(result.errors.map(e => e.message).join(' | '));
    return result.data?.workshop_insert;
  },
  update: async (id, espacioId, payload) => {
    const result = await updateWorkshop({ id, espacioId, ...payload });
    if (result.errors?.length) throw new Error(result.errors.map(e => e.message).join(' | '));
    return result.data?.workshop_update;
  },
  quickStatus: async (id, espacioId, estado, cuposDisponibles) => {
    const { data } = await updateWorkshopEstado({ id, espacioId, estado, cuposDisponibles });
    return data.workshop_update;
  },
  remove: async (id, espacioId) => {
    const { data } = await deleteWorkshop({ id, espacioId });
    return data.workshop_delete;
  },
};
