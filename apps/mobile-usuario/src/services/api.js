import { getDC } from '../lib/firebase';
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

const SERVER_ONLY = { fetchPolicy: 'SERVER_ONLY' };

export const espacios = {
  getPublic: async (id) => {
    const dc = getDC();
    const { data } = await getPublicEspacios(dc, { ids: [id] }, SERVER_ONLY);
    return data?.espacios?.[0] ?? null;
  },
  getPublicBatch: async (ids) => {
    if (!ids?.length) return [];
    const dc = getDC();
    const { data } = await getPublicEspacios(dc, { ids }, SERVER_ONLY);
    return data?.espacios ?? [];
  },
  getBySlug: async (slug) => {
    const dc = getDC();
    const { data } = await getEspacioBySlug(dc, { slug }, SERVER_ONLY);
    return data?.espacios?.[0] ?? null;
  },
};

export const workshops = {
  listByEspacio: async (espacioId) => {
    const dc = getDC();
    const { data } = await listPublicWorkshopsByEspacio(dc, { espacioId }, SERVER_ONLY);
    return data?.workshops ?? [];
  },
  listAll: async () => {
    const dc = getDC();
    const { data } = await listPublicWorkshops(dc, SERVER_ONLY);
    return data?.workshops ?? [];
  },
};

export const reservas = {
  create: async (payload) => {
    const dc = getDC();
    const { data } = await createReservaConUsuario(dc, payload);
    return data;
  },
  listMine: async () => {
    const dc = getDC();
    const { data } = await listMyReservas(dc, SERVER_ONLY);
    return data?.reservas ?? [];
  },
  cancel: async (id) => {
    const dc = getDC();
    await cancelarReserva(dc, { id });
  },
};

export const planes = {
  list: async () => {
    const dc = getDC();
    const { data } = await listPlanes(dc, SERVER_ONLY);
    return data?.planes ?? [];
  },
};

export const profesionales = {
  upsert: async ({ nombre, email }) => {
    const dc = getDC();
    await upsertProfesional(dc, { nombre, email });
  },
};
