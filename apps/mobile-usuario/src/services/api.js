import {
  getPublicEspacio,
  getPublicEspacios,
  listPublicWorkshopsByEspacio,
  listPublicWorkshops,
  createReservaConUsuario,
  listMyReservas,
  cancelarReserva,
  listPlanes,
  upsertProfesional,
  getEspacioBySlug,
} from '../dataconnect-generated';

export const espacios = {
  getPublic: async (id) => {
    const { data } = await getPublicEspacio({ id });
    return data?.espacio ?? null;
  },
  getPublicBatch: async (ids) => {
    if (!ids?.length) return [];
    const { data } = await getPublicEspacios({ ids });
    return data?.espacios ?? [];
  },
  getBySlug: async (slug) => {
    const { data } = await getEspacioBySlug({ slug });
    return data?.espacios?.[0] ?? null;
  },
};

export const workshops = {
  listByEspacio: async (espacioId) => {
    const { data } = await listPublicWorkshopsByEspacio({ espacioId });
    return data?.workshops ?? [];
  },
  listAll: async () => {
    const { data } = await listPublicWorkshops();
    return data?.workshops ?? [];
  },
};

export const reservas = {
  create: async (payload) => {
    const { data } = await createReservaConUsuario(payload);
    return data;
  },
  listMine: async () => {
    const { data } = await listMyReservas();
    return data?.reservas ?? [];
  },
  cancel: async (id) => {
    await cancelarReserva({ id });
  },
};

export const planes = {
  list: async () => {
    const { data } = await listPlanes();
    return data?.planes ?? [];
  },
};

export const profesionales = {
  upsert: async ({ nombre, email }) => {
    await upsertProfesional({ nombre, email });
  },
};
