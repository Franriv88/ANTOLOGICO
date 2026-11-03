import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, ExecuteQueryOptions, MutationRef, MutationPromise } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;


export enum EstadoEspacio {
  ACTIVO = "ACTIVO",
  SUSPENDIDO = "SUSPENDIDO",
  INACTIVO = "INACTIVO",
};

export enum EstadoPago {
  PENDIENTE = "PENDIENTE",
  PAGADO = "PAGADO",
};

export enum EstadoProfesional {
  ACTIVO = "ACTIVO",
  SUSPENDIDO = "SUSPENDIDO",
  INACTIVO = "INACTIVO",
};

export enum EstadoReserva {
  PENDIENTE = "PENDIENTE",
  CONFIRMADA = "CONFIRMADA",
  CANCELADA = "CANCELADA",
};

export enum EstadoWorkshop {
  BORRADOR = "BORRADOR",
  PUBLICADO = "PUBLICADO",
  CANCELADO = "CANCELADO",
  FINALIZADO = "FINALIZADO",
};

export enum HeaderType {
  COLOR = "COLOR",
  IMAGE = "IMAGE",
};

export enum MetodoPago {
  EFECTIVO = "EFECTIVO",
  MERCADO_PAGO = "MERCADO_PAGO",
};

export enum TipoWorkshop {
  WORKSHOP = "WORKSHOP",
  TALLER = "TALLER",
  CLASE = "CLASE",
  CURSO = "CURSO",
};



export interface ActivarPlanData {
  espacio_update?: Espacio_Key | null;
}

export interface ActivarPlanVariables {
  id: UUIDString;
  planId: UUIDString;
  periodoFacturacion: string;
  precioActual: number;
  proximaRenovacion: TimestampString;
}

export interface AdminCreateEspacioMigrateData {
  espacio_insert: Espacio_Key;
}

export interface AdminCreateEspacioMigrateVariables {
  profesionalUid: string;
  nombre: string;
  rubroPersonalizado?: string | null;
  slug?: string | null;
  logoUrl?: string | null;
  logoShape?: string | null;
  logoScale?: number | null;
  brandColors?: unknown | null;
  brandFont?: string | null;
  redesSociales?: unknown | null;
  cobros?: unknown | null;
  estado?: EstadoEspacio | null;
}

export interface AdminCreateWorkshopMigrateData {
  workshop_insert: Workshop_Key;
}

export interface AdminCreateWorkshopMigrateVariables {
  espacioId: UUIDString;
  nombre: string;
  tipo?: TipoWorkshop | null;
  descripcion?: string | null;
  cuposTotales: number;
  cuposDisponibles: number;
  precio: number;
  fecha: TimestampString;
  duracionHoras?: number | null;
  duracionMinutos?: number | null;
  experienciaPrevia?: boolean | null;
  scheduleData?: unknown | null;
  headerType?: HeaderType | null;
  headerValue?: string | null;
  metodosPago?: unknown | null;
  estado?: EstadoWorkshop | null;
}

export interface AdminDeleteEspacioData {
  deletedData?: number | null;
}

export interface AdminDeleteEspacioVariables {
  id: UUIDString;
}

export interface AdminDeleteProfesionalData {
  profesional_delete?: Profesional_Key | null;
}

export interface AdminDeleteProfesionalVariables {
  uid: string;
}

export interface AdminEnsureProfesionalData {
  result?: number | null;
}

export interface AdminEnsureProfesionalVariables {
  uid: string;
  nombre: string;
  email: string;
}

export interface AdminListAllEspaciosData {
  espacios: ({
    id: UUIDString;
    nombre: string;
    estado: EstadoEspacio;
    cancelacionPendiente: boolean;
    createdAt: TimestampString;
    updatedAt: TimestampString;
    slug?: string | null;
    bloqueado: boolean;
    trialStartedAt?: TimestampString | null;
    isSuperAdmin: boolean;
    logoUrl?: string | null;
    logoShape?: string | null;
    logoScale?: number | null;
    brandColors?: unknown | null;
    brandFont?: string | null;
    redesSociales?: unknown | null;
    cobros?: unknown | null;
    direcciones?: unknown | null;
    periodoFacturacion?: string | null;
    precioActual?: number | null;
    proximaRenovacion?: TimestampString | null;
    downgradePendiente?: unknown | null;
    cuponAplicado?: unknown | null;
    profesional: {
      uid: string;
      nombre: string;
      email: string;
    } & Profesional_Key;
    rubro?: {
      id: UUIDString;
      nombre: string;
    } & Rubro_Key;
    rubroPersonalizado?: string | null;
    plan?: {
      id: UUIDString;
      nombre: string;
      precioMensual: number;
      precioAnual: number;
      features: unknown;
    } & Plan_Key;
  } & Espacio_Key)[];
}

export interface AdminListAllReservasData {
  reservas: ({
    id: UUIDString;
    estado: EstadoReserva;
    fechaReserva: TimestampString;
    pagoExternoId?: string | null;
    createdAt: TimestampString;
    usuario: {
      uid: string;
      nombre: string;
      email: string;
    } & Usuario_Key;
    workshop: {
      id: UUIDString;
      nombre: string;
      fecha: TimestampString;
      espacio: {
        id: UUIDString;
        nombre: string;
      } & Espacio_Key;
    } & Workshop_Key;
  } & Reserva_Key)[];
}

export interface AdminListAllWorkshopsData {
  workshops: ({
    id: UUIDString;
    nombre: string;
    tipo?: TipoWorkshop | null;
    estado: EstadoWorkshop;
    cuposTotales: number;
    cuposDisponibles: number;
    precio: number;
    fecha: TimestampString;
    createdAt: TimestampString;
    espacio: {
      id: UUIDString;
      nombre: string;
      profesional: {
        uid: string;
        nombre: string;
        email: string;
      } & Profesional_Key;
    } & Espacio_Key;
  } & Workshop_Key)[];
}

export interface AdminUpdateEspacioData {
  espacio_update?: Espacio_Key | null;
}

export interface AdminUpdateEspacioVariables {
  id: UUIDString;
  bloqueado?: boolean | null;
  trialStartedAt?: TimestampString | null;
  slug?: string | null;
  estado?: EstadoEspacio | null;
}

export interface AdminUpsertProfesionalData {
  profesional_upsert: Profesional_Key;
}

export interface AdminUpsertProfesionalVariables {
  uid: string;
  nombre: string;
  email: string;
}

export interface AgendarDowngradeData {
  espacio_update?: Espacio_Key | null;
}

export interface AgendarDowngradeVariables {
  id: UUIDString;
  downgradePendiente: unknown;
}

export interface CancelarDowngradeData {
  espacio_update?: Espacio_Key | null;
}

export interface CancelarDowngradeVariables {
  id: UUIDString;
}

export interface CancelarReservaData {
  reserva_update?: Reserva_Key | null;
  workshop_update?: Workshop_Key | null;
}

export interface CancelarReservaVariables {
  id: UUIDString;
  workshopId: UUIDString;
}

export interface CreateEspacioData {
  espacio_insert: Espacio_Key;
}

export interface CreateEspacioVariables {
  nombre: string;
  rubroId?: UUIDString | null;
  rubroPersonalizado?: string | null;
}

export interface CreateReservaConUsuarioData {
  usuario_upsert: Usuario_Key;
  reserva_insert: Reserva_Key;
  workshop_update?: Workshop_Key | null;
}

export interface CreateReservaConUsuarioVariables {
  nombre: string;
  email: string;
  workshopId: UUIDString;
  estado: EstadoReserva;
  metodoPago?: MetodoPago | null;
  estadoPago?: EstadoPago | null;
  pagoExternoId?: string | null;
}

export interface CreateWorkshopData {
  workshop_insert: Workshop_Key;
}

export interface CreateWorkshopVariables {
  espacioId: UUIDString;
  nombre: string;
  tipo?: TipoWorkshop | null;
  descripcion?: string | null;
  cuposTotales: number;
  cuposDisponibles: number;
  precio: number;
  fecha: TimestampString;
  duracionHoras?: number | null;
  duracionMinutos?: number | null;
  experienciaPrevia?: boolean | null;
  scheduleData?: unknown | null;
  headerType?: HeaderType | null;
  headerValue?: string | null;
  metodosPago?: unknown | null;
  estado?: EstadoWorkshop | null;
}

export interface DecrementarCupoData {
  workshop_update?: Workshop_Key | null;
}

export interface DecrementarCupoVariables {
  workshopId: UUIDString;
}

export interface DeleteWorkshopData {
  workshop_delete?: Workshop_Key | null;
}

export interface DeleteWorkshopVariables {
  id: UUIDString;
  espacioId: UUIDString;
}

export interface DevExpireTrialData {
  expired?: number | null;
}

export interface DevExpireTrialVariables {
  espacioId: UUIDString;
}

export interface Dominio_Key {
  id: UUIDString;
  __typename?: 'Dominio_Key';
}

export interface Espacio_Key {
  id: UUIDString;
  __typename?: 'Espacio_Key';
}

export interface GetEspacioBySlugData {
  espacios: ({
    id: UUIDString;
    nombre: string;
    slug?: string | null;
  } & Espacio_Key)[];
}

export interface GetEspacioBySlugVariables {
  slug: string;
}

export interface GetMyEspacioData {
  espacios: ({
    id: UUIDString;
    nombre: string;
    estado: EstadoEspacio;
    cancelacionPendiente: boolean;
    createdAt: TimestampString;
    updatedAt: TimestampString;
    trialStartedAt?: TimestampString | null;
    isSuperAdmin: boolean;
    slug?: string | null;
    bloqueado: boolean;
    logoUrl?: string | null;
    logoShape?: string | null;
    logoScale?: number | null;
    brandColors?: unknown | null;
    brandFont?: string | null;
    redesSociales?: unknown | null;
    cobros?: unknown | null;
    direcciones?: unknown | null;
    terminosCondiciones?: string | null;
    tycEnabled: boolean;
    periodoFacturacion?: string | null;
    precioActual?: number | null;
    proximaRenovacion?: TimestampString | null;
    downgradePendiente?: unknown | null;
    cuponAplicado?: unknown | null;
    rubro?: {
      id: UUIDString;
      nombre: string;
    } & Rubro_Key;
    rubroPersonalizado?: string | null;
    plan?: {
      id: UUIDString;
      nombre: string;
      precioMensual: number;
      precioAnual: number;
      features: unknown;
    } & Plan_Key;
    dominio_on_espacio?: {
      urlPersonalizada: string;
      estado: EstadoDominio;
      sslActivo: boolean;
    };
  } & Espacio_Key)[];
}

export interface GetMyEspacioVariables {
  id: UUIDString;
}

export interface GetMyProfileData {
  profesionales: ({
    uid: string;
    nombre: string;
    email: string;
    estado: EstadoProfesional;
    updatedAt: TimestampString;
  } & Profesional_Key)[];
}

export interface GetMyWorkshopData {
  workshops: ({
    id: UUIDString;
    nombre: string;
    tipo?: TipoWorkshop | null;
    descripcion?: string | null;
    cuposTotales: number;
    cuposDisponibles: number;
    precio: number;
    fecha: TimestampString;
    duracionHoras?: number | null;
    duracionMinutos?: number | null;
    experienciaPrevia?: boolean | null;
    scheduleData?: unknown | null;
    headerType: HeaderType;
    headerValue?: string | null;
    metodosPago?: unknown | null;
    estado: EstadoWorkshop;
    createdAt: TimestampString;
    updatedAt: TimestampString;
    espacio: {
      id: UUIDString;
      nombre: string;
    } & Espacio_Key;
  } & Workshop_Key)[];
}

export interface GetMyWorkshopVariables {
  id: UUIDString;
}

export interface GetPublicEspacioData {
  espacios: ({
    id: UUIDString;
    nombre: string;
    estado: EstadoEspacio;
    logoUrl?: string | null;
    logoShape?: string | null;
    logoScale?: number | null;
    brandColors?: unknown | null;
    brandFont?: string | null;
    redesSociales?: unknown | null;
    rubro?: {
      id: UUIDString;
      nombre: string;
    } & Rubro_Key;
    rubroPersonalizado?: string | null;
    profesional: {
      uid: string;
      nombre: string;
    } & Profesional_Key;
  } & Espacio_Key)[];
}

export interface GetPublicEspacioVariables {
  id: UUIDString;
}

export interface GetPublicEspaciosData {
  espacios: ({
    id: UUIDString;
    nombre: string;
    estado: EstadoEspacio;
    logoUrl?: string | null;
    logoShape?: string | null;
    logoScale?: number | null;
    brandColors?: unknown | null;
    brandFont?: string | null;
    redesSociales?: unknown | null;
    rubro?: {
      id: UUIDString;
      nombre: string;
    } & Rubro_Key;
    rubroPersonalizado?: string | null;
    profesional: {
      uid: string;
      nombre: string;
    } & Profesional_Key;
  } & Espacio_Key)[];
}

export interface GetPublicEspaciosVariables {
  ids: UUIDString[];
}

export interface ListMyEspaciosData {
  espacios: ({
    id: UUIDString;
    nombre: string;
    estado: EstadoEspacio;
    cancelacionPendiente: boolean;
    createdAt: TimestampString;
    trialStartedAt?: TimestampString | null;
    isSuperAdmin: boolean;
    slug?: string | null;
    bloqueado: boolean;
    logoUrl?: string | null;
    logoShape?: string | null;
    logoScale?: number | null;
    brandColors?: unknown | null;
    brandFont?: string | null;
    redesSociales?: unknown | null;
    cobros?: unknown | null;
    direcciones?: unknown | null;
    terminosCondiciones?: string | null;
    tycEnabled: boolean;
    periodoFacturacion?: string | null;
    precioActual?: number | null;
    proximaRenovacion?: TimestampString | null;
    downgradePendiente?: unknown | null;
    cuponAplicado?: unknown | null;
    rubro?: {
      id: UUIDString;
      nombre: string;
    } & Rubro_Key;
    rubroPersonalizado?: string | null;
    plan?: {
      id: UUIDString;
      nombre: string;
      precioMensual: number;
      precioAnual: number;
      features: unknown;
    } & Plan_Key;
    dominio_on_espacio?: {
      urlPersonalizada: string;
      estado: EstadoDominio;
      sslActivo: boolean;
    };
  } & Espacio_Key)[];
}

export interface ListMyReservasData {
  reservas: ({
    id: UUIDString;
    estado: EstadoReserva;
    fechaReserva: TimestampString;
    comprobanteUrl?: string | null;
    pagoExternoId?: string | null;
    createdAt: TimestampString;
    workshop: {
      id: UUIDString;
      nombre: string;
      fecha: TimestampString;
      cuposTotales: number;
      cuposDisponibles: number;
      espacioId: UUIDString;
      headerType: HeaderType;
      headerValue?: string | null;
      espacio: {
        id: UUIDString;
        nombre: string;
        logoUrl?: string | null;
        logoShape?: string | null;
        logoScale?: number | null;
        brandColors?: unknown | null;
        brandFont?: string | null;
        rubro?: {
          id: UUIDString;
          nombre: string;
        } & Rubro_Key;
      } & Espacio_Key;
    } & Workshop_Key;
  } & Reserva_Key)[];
}

export interface ListMyWorkshopsByEstadoData {
  workshops: ({
    id: UUIDString;
    nombre: string;
    tipo?: TipoWorkshop | null;
    descripcion?: string | null;
    cuposTotales: number;
    cuposDisponibles: number;
    precio: number;
    fecha: TimestampString;
    duracionHoras?: number | null;
    duracionMinutos?: number | null;
    experienciaPrevia?: boolean | null;
    scheduleData?: unknown | null;
    headerType: HeaderType;
    headerValue?: string | null;
    metodosPago?: unknown | null;
    estado: EstadoWorkshop;
    createdAt: TimestampString;
  } & Workshop_Key)[];
}

export interface ListMyWorkshopsByEstadoVariables {
  espacioId: UUIDString;
  estado: EstadoWorkshop;
}

export interface ListMyWorkshopsData {
  workshops: ({
    id: UUIDString;
    nombre: string;
    tipo?: TipoWorkshop | null;
    descripcion?: string | null;
    cuposTotales: number;
    cuposDisponibles: number;
    precio: number;
    fecha: TimestampString;
    duracionHoras?: number | null;
    duracionMinutos?: number | null;
    experienciaPrevia?: boolean | null;
    scheduleData?: unknown | null;
    headerType: HeaderType;
    headerValue?: string | null;
    metodosPago?: unknown | null;
    estado: EstadoWorkshop;
    createdAt: TimestampString;
  } & Workshop_Key)[];
}

export interface ListMyWorkshopsVariables {
  espacioId: UUIDString;
}

export interface ListPlanesData {
  planes: ({
    id: UUIDString;
    nombre: string;
    precioMensual: number;
    precioAnual: number;
    features: unknown;
  } & Plan_Key)[];
}

export interface ListPublicWorkshopsByEspacioData {
  workshops: ({
    id: UUIDString;
    nombre: string;
    tipo?: TipoWorkshop | null;
    descripcion?: string | null;
    cuposTotales: number;
    cuposDisponibles: number;
    precio: number;
    fecha: TimestampString;
    duracionHoras?: number | null;
    duracionMinutos?: number | null;
    experienciaPrevia?: boolean | null;
    scheduleData?: unknown | null;
    headerType: HeaderType;
    headerValue?: string | null;
    metodosPago?: unknown | null;
    estado: EstadoWorkshop;
    createdAt: TimestampString;
  } & Workshop_Key)[];
}

export interface ListPublicWorkshopsByEspacioVariables {
  espacioId: UUIDString;
}

export interface ListPublicWorkshopsData {
  workshops: ({
    id: UUIDString;
    nombre: string;
    tipo?: TipoWorkshop | null;
    descripcion?: string | null;
    cuposTotales: number;
    cuposDisponibles: number;
    precio: number;
    fecha: TimestampString;
    duracionHoras?: number | null;
    duracionMinutos?: number | null;
    experienciaPrevia?: boolean | null;
    scheduleData?: unknown | null;
    headerType: HeaderType;
    headerValue?: string | null;
    espacio: {
      id: UUIDString;
      nombre: string;
      profesional: {
        uid: string;
        nombre: string;
      } & Profesional_Key;
    } & Espacio_Key;
  } & Workshop_Key)[];
}

export interface ListReservasByEspacioData {
  reservas: ({
    id: UUIDString;
    estado: EstadoReserva;
    metodoPago?: MetodoPago | null;
    estadoPago?: EstadoPago | null;
    fechaReserva: TimestampString;
    comprobanteUrl?: string | null;
    pagoExternoId?: string | null;
    createdAt: TimestampString;
    usuario: {
      uid: string;
      nombre: string;
      email: string;
    } & Usuario_Key;
    workshop: {
      id: UUIDString;
      nombre: string;
      fecha: TimestampString;
      cuposTotales: number;
      cuposDisponibles: number;
      espacioId: UUIDString;
    } & Workshop_Key;
  } & Reserva_Key)[];
}

export interface ListReservasByEspacioVariables {
  espacioId: UUIDString;
}

export interface ListRubrosData {
  rubros: ({
    id: UUIDString;
    nombre: string;
  } & Rubro_Key)[];
}

export interface MarkReservaPaidData {
  reserva_update?: Reserva_Key | null;
}

export interface MarkReservaPaidVariables {
  id: UUIDString;
}

export interface Plan_Key {
  id: UUIDString;
  __typename?: 'Plan_Key';
}

export interface Profesional_Key {
  uid: string;
  __typename?: 'Profesional_Key';
}

export interface ReactivarSuscripcionEspacioData {
  espacio_update?: Espacio_Key | null;
}

export interface ReactivarSuscripcionEspacioVariables {
  id: UUIDString;
}

export interface ReassignProfesionalUidData {
  reassigned?: number | null;
}

export interface ReassignProfesionalUidVariables {
  nombre: string;
}

export interface Reserva_Key {
  id: UUIDString;
  __typename?: 'Reserva_Key';
}

export interface Rubro_Key {
  id: UUIDString;
  __typename?: 'Rubro_Key';
}

export interface SearchMyWorkshopsData {
  workshops: ({
    id: UUIDString;
    nombre: string;
    tipo?: TipoWorkshop | null;
    descripcion?: string | null;
    cuposTotales: number;
    cuposDisponibles: number;
    precio: number;
    fecha: TimestampString;
    duracionHoras?: number | null;
    duracionMinutos?: number | null;
    experienciaPrevia?: boolean | null;
    scheduleData?: unknown | null;
    headerType: HeaderType;
    headerValue?: string | null;
    metodosPago?: unknown | null;
    estado: EstadoWorkshop;
    createdAt: TimestampString;
  } & Workshop_Key)[];
}

export interface SearchMyWorkshopsVariables {
  espacioId: UUIDString;
  q: string;
}

export interface SolicitarCancelacionEspacioData {
  espacio_update?: Espacio_Key | null;
}

export interface SolicitarCancelacionEspacioVariables {
  id: UUIDString;
}

export interface SuperAdmin_Key {
  uid: string;
  __typename?: 'SuperAdmin_Key';
}

export interface UpdateCuponAplicadoData {
  espacio_update?: Espacio_Key | null;
}

export interface UpdateCuponAplicadoVariables {
  id: UUIDString;
  cuponAplicado?: unknown | null;
}

export interface UpdateEspacioCobrosData {
  espacio_update?: Espacio_Key | null;
}

export interface UpdateEspacioCobrosVariables {
  id: UUIDString;
  cobros?: unknown | null;
}

export interface UpdateEspacioData {
  espacio_update?: Espacio_Key | null;
}

export interface UpdateEspacioDireccionesData {
  espacio_update?: Espacio_Key | null;
}

export interface UpdateEspacioDireccionesVariables {
  id: UUIDString;
  direcciones?: unknown | null;
}

export interface UpdateEspacioIdentidadData {
  espacio_update?: Espacio_Key | null;
}

export interface UpdateEspacioIdentidadVariables {
  id: UUIDString;
  logoUrl?: string | null;
  logoShape?: string | null;
  logoScale?: number | null;
  brandColors?: unknown | null;
  brandFont?: string | null;
}

export interface UpdateEspacioRedesData {
  espacio_update?: Espacio_Key | null;
}

export interface UpdateEspacioRedesVariables {
  id: UUIDString;
  redesSociales?: unknown | null;
}

export interface UpdateEspacioSlugData {
  espacio_update?: Espacio_Key | null;
}

export interface UpdateEspacioSlugVariables {
  id: UUIDString;
  slug: string;
}

export interface UpdateEspacioTyCData {
  espacio_update?: Espacio_Key | null;
}

export interface UpdateEspacioTyCVariables {
  id: UUIDString;
  terminosCondiciones?: string | null;
  tycEnabled: boolean;
}

export interface UpdateEspacioVariables {
  id: UUIDString;
  nombre: string;
  rubroId?: UUIDString | null;
  rubroPersonalizado?: string | null;
}

export interface UpdateWorkshopData {
  workshop_update?: Workshop_Key | null;
}

export interface UpdateWorkshopEstadoData {
  workshop_update?: Workshop_Key | null;
}

export interface UpdateWorkshopEstadoVariables {
  id: UUIDString;
  espacioId: UUIDString;
  estado: EstadoWorkshop;
  cuposDisponibles: number;
}

export interface UpdateWorkshopVariables {
  id: UUIDString;
  espacioId: UUIDString;
  nombre: string;
  tipo?: TipoWorkshop | null;
  descripcion?: string | null;
  cuposTotales: number;
  cuposDisponibles: number;
  precio: number;
  fecha: TimestampString;
  duracionHoras?: number | null;
  duracionMinutos?: number | null;
  experienciaPrevia?: boolean | null;
  scheduleData?: unknown | null;
  headerType?: HeaderType | null;
  headerValue?: string | null;
  metodosPago?: unknown | null;
  estado?: EstadoWorkshop | null;
}

export interface UpsertProfesionalData {
  profesional_upsert: Profesional_Key;
}

export interface UpsertProfesionalVariables {
  nombre: string;
  email: string;
}

export interface Usuario_Key {
  uid: string;
  __typename?: 'Usuario_Key';
}

export interface Workshop_Key {
  id: UUIDString;
  __typename?: 'Workshop_Key';
}

interface UpsertProfesionalRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertProfesionalVariables): MutationRef<UpsertProfesionalData, UpsertProfesionalVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpsertProfesionalVariables): MutationRef<UpsertProfesionalData, UpsertProfesionalVariables>;
  operationName: string;
}
export const upsertProfesionalRef: UpsertProfesionalRef;

export function upsertProfesional(vars: UpsertProfesionalVariables): MutationPromise<UpsertProfesionalData, UpsertProfesionalVariables>;
export function upsertProfesional(dc: DataConnect, vars: UpsertProfesionalVariables): MutationPromise<UpsertProfesionalData, UpsertProfesionalVariables>;

interface ReassignProfesionalUidRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ReassignProfesionalUidVariables): MutationRef<ReassignProfesionalUidData, ReassignProfesionalUidVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ReassignProfesionalUidVariables): MutationRef<ReassignProfesionalUidData, ReassignProfesionalUidVariables>;
  operationName: string;
}
export const reassignProfesionalUidRef: ReassignProfesionalUidRef;

export function reassignProfesionalUid(vars: ReassignProfesionalUidVariables): MutationPromise<ReassignProfesionalUidData, ReassignProfesionalUidVariables>;
export function reassignProfesionalUid(dc: DataConnect, vars: ReassignProfesionalUidVariables): MutationPromise<ReassignProfesionalUidData, ReassignProfesionalUidVariables>;

interface ActivarPlanRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ActivarPlanVariables): MutationRef<ActivarPlanData, ActivarPlanVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ActivarPlanVariables): MutationRef<ActivarPlanData, ActivarPlanVariables>;
  operationName: string;
}
export const activarPlanRef: ActivarPlanRef;

export function activarPlan(vars: ActivarPlanVariables): MutationPromise<ActivarPlanData, ActivarPlanVariables>;
export function activarPlan(dc: DataConnect, vars: ActivarPlanVariables): MutationPromise<ActivarPlanData, ActivarPlanVariables>;

interface AgendarDowngradeRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: AgendarDowngradeVariables): MutationRef<AgendarDowngradeData, AgendarDowngradeVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: AgendarDowngradeVariables): MutationRef<AgendarDowngradeData, AgendarDowngradeVariables>;
  operationName: string;
}
export const agendarDowngradeRef: AgendarDowngradeRef;

export function agendarDowngrade(vars: AgendarDowngradeVariables): MutationPromise<AgendarDowngradeData, AgendarDowngradeVariables>;
export function agendarDowngrade(dc: DataConnect, vars: AgendarDowngradeVariables): MutationPromise<AgendarDowngradeData, AgendarDowngradeVariables>;

interface CancelarDowngradeRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CancelarDowngradeVariables): MutationRef<CancelarDowngradeData, CancelarDowngradeVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CancelarDowngradeVariables): MutationRef<CancelarDowngradeData, CancelarDowngradeVariables>;
  operationName: string;
}
export const cancelarDowngradeRef: CancelarDowngradeRef;

export function cancelarDowngrade(vars: CancelarDowngradeVariables): MutationPromise<CancelarDowngradeData, CancelarDowngradeVariables>;
export function cancelarDowngrade(dc: DataConnect, vars: CancelarDowngradeVariables): MutationPromise<CancelarDowngradeData, CancelarDowngradeVariables>;

interface UpdateCuponAplicadoRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateCuponAplicadoVariables): MutationRef<UpdateCuponAplicadoData, UpdateCuponAplicadoVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateCuponAplicadoVariables): MutationRef<UpdateCuponAplicadoData, UpdateCuponAplicadoVariables>;
  operationName: string;
}
export const updateCuponAplicadoRef: UpdateCuponAplicadoRef;

export function updateCuponAplicado(vars: UpdateCuponAplicadoVariables): MutationPromise<UpdateCuponAplicadoData, UpdateCuponAplicadoVariables>;
export function updateCuponAplicado(dc: DataConnect, vars: UpdateCuponAplicadoVariables): MutationPromise<UpdateCuponAplicadoData, UpdateCuponAplicadoVariables>;

interface CreateEspacioRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateEspacioVariables): MutationRef<CreateEspacioData, CreateEspacioVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateEspacioVariables): MutationRef<CreateEspacioData, CreateEspacioVariables>;
  operationName: string;
}
export const createEspacioRef: CreateEspacioRef;

export function createEspacio(vars: CreateEspacioVariables): MutationPromise<CreateEspacioData, CreateEspacioVariables>;
export function createEspacio(dc: DataConnect, vars: CreateEspacioVariables): MutationPromise<CreateEspacioData, CreateEspacioVariables>;

interface UpdateEspacioIdentidadRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateEspacioIdentidadVariables): MutationRef<UpdateEspacioIdentidadData, UpdateEspacioIdentidadVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateEspacioIdentidadVariables): MutationRef<UpdateEspacioIdentidadData, UpdateEspacioIdentidadVariables>;
  operationName: string;
}
export const updateEspacioIdentidadRef: UpdateEspacioIdentidadRef;

export function updateEspacioIdentidad(vars: UpdateEspacioIdentidadVariables): MutationPromise<UpdateEspacioIdentidadData, UpdateEspacioIdentidadVariables>;
export function updateEspacioIdentidad(dc: DataConnect, vars: UpdateEspacioIdentidadVariables): MutationPromise<UpdateEspacioIdentidadData, UpdateEspacioIdentidadVariables>;

interface UpdateEspacioCobrosRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateEspacioCobrosVariables): MutationRef<UpdateEspacioCobrosData, UpdateEspacioCobrosVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateEspacioCobrosVariables): MutationRef<UpdateEspacioCobrosData, UpdateEspacioCobrosVariables>;
  operationName: string;
}
export const updateEspacioCobrosRef: UpdateEspacioCobrosRef;

export function updateEspacioCobros(vars: UpdateEspacioCobrosVariables): MutationPromise<UpdateEspacioCobrosData, UpdateEspacioCobrosVariables>;
export function updateEspacioCobros(dc: DataConnect, vars: UpdateEspacioCobrosVariables): MutationPromise<UpdateEspacioCobrosData, UpdateEspacioCobrosVariables>;

interface UpdateEspacioRedesRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateEspacioRedesVariables): MutationRef<UpdateEspacioRedesData, UpdateEspacioRedesVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateEspacioRedesVariables): MutationRef<UpdateEspacioRedesData, UpdateEspacioRedesVariables>;
  operationName: string;
}
export const updateEspacioRedesRef: UpdateEspacioRedesRef;

export function updateEspacioRedes(vars: UpdateEspacioRedesVariables): MutationPromise<UpdateEspacioRedesData, UpdateEspacioRedesVariables>;
export function updateEspacioRedes(dc: DataConnect, vars: UpdateEspacioRedesVariables): MutationPromise<UpdateEspacioRedesData, UpdateEspacioRedesVariables>;

interface UpdateEspacioRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateEspacioVariables): MutationRef<UpdateEspacioData, UpdateEspacioVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateEspacioVariables): MutationRef<UpdateEspacioData, UpdateEspacioVariables>;
  operationName: string;
}
export const updateEspacioRef: UpdateEspacioRef;

export function updateEspacio(vars: UpdateEspacioVariables): MutationPromise<UpdateEspacioData, UpdateEspacioVariables>;
export function updateEspacio(dc: DataConnect, vars: UpdateEspacioVariables): MutationPromise<UpdateEspacioData, UpdateEspacioVariables>;

interface UpdateEspacioDireccionesRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateEspacioDireccionesVariables): MutationRef<UpdateEspacioDireccionesData, UpdateEspacioDireccionesVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateEspacioDireccionesVariables): MutationRef<UpdateEspacioDireccionesData, UpdateEspacioDireccionesVariables>;
  operationName: string;
}
export const updateEspacioDireccionesRef: UpdateEspacioDireccionesRef;

export function updateEspacioDirecciones(vars: UpdateEspacioDireccionesVariables): MutationPromise<UpdateEspacioDireccionesData, UpdateEspacioDireccionesVariables>;
export function updateEspacioDirecciones(dc: DataConnect, vars: UpdateEspacioDireccionesVariables): MutationPromise<UpdateEspacioDireccionesData, UpdateEspacioDireccionesVariables>;

interface UpdateEspacioTyCRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateEspacioTyCVariables): MutationRef<UpdateEspacioTyCData, UpdateEspacioTyCVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateEspacioTyCVariables): MutationRef<UpdateEspacioTyCData, UpdateEspacioTyCVariables>;
  operationName: string;
}
export const updateEspacioTyCRef: UpdateEspacioTyCRef;

export function updateEspacioTyC(vars: UpdateEspacioTyCVariables): MutationPromise<UpdateEspacioTyCData, UpdateEspacioTyCVariables>;
export function updateEspacioTyC(dc: DataConnect, vars: UpdateEspacioTyCVariables): MutationPromise<UpdateEspacioTyCData, UpdateEspacioTyCVariables>;

interface UpdateEspacioSlugRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateEspacioSlugVariables): MutationRef<UpdateEspacioSlugData, UpdateEspacioSlugVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateEspacioSlugVariables): MutationRef<UpdateEspacioSlugData, UpdateEspacioSlugVariables>;
  operationName: string;
}
export const updateEspacioSlugRef: UpdateEspacioSlugRef;

export function updateEspacioSlug(vars: UpdateEspacioSlugVariables): MutationPromise<UpdateEspacioSlugData, UpdateEspacioSlugVariables>;
export function updateEspacioSlug(dc: DataConnect, vars: UpdateEspacioSlugVariables): MutationPromise<UpdateEspacioSlugData, UpdateEspacioSlugVariables>;

interface CreateWorkshopRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateWorkshopVariables): MutationRef<CreateWorkshopData, CreateWorkshopVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateWorkshopVariables): MutationRef<CreateWorkshopData, CreateWorkshopVariables>;
  operationName: string;
}
export const createWorkshopRef: CreateWorkshopRef;

export function createWorkshop(vars: CreateWorkshopVariables): MutationPromise<CreateWorkshopData, CreateWorkshopVariables>;
export function createWorkshop(dc: DataConnect, vars: CreateWorkshopVariables): MutationPromise<CreateWorkshopData, CreateWorkshopVariables>;

interface UpdateWorkshopRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateWorkshopVariables): MutationRef<UpdateWorkshopData, UpdateWorkshopVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateWorkshopVariables): MutationRef<UpdateWorkshopData, UpdateWorkshopVariables>;
  operationName: string;
}
export const updateWorkshopRef: UpdateWorkshopRef;

export function updateWorkshop(vars: UpdateWorkshopVariables): MutationPromise<UpdateWorkshopData, UpdateWorkshopVariables>;
export function updateWorkshop(dc: DataConnect, vars: UpdateWorkshopVariables): MutationPromise<UpdateWorkshopData, UpdateWorkshopVariables>;

interface UpdateWorkshopEstadoRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateWorkshopEstadoVariables): MutationRef<UpdateWorkshopEstadoData, UpdateWorkshopEstadoVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateWorkshopEstadoVariables): MutationRef<UpdateWorkshopEstadoData, UpdateWorkshopEstadoVariables>;
  operationName: string;
}
export const updateWorkshopEstadoRef: UpdateWorkshopEstadoRef;

export function updateWorkshopEstado(vars: UpdateWorkshopEstadoVariables): MutationPromise<UpdateWorkshopEstadoData, UpdateWorkshopEstadoVariables>;
export function updateWorkshopEstado(dc: DataConnect, vars: UpdateWorkshopEstadoVariables): MutationPromise<UpdateWorkshopEstadoData, UpdateWorkshopEstadoVariables>;

interface DeleteWorkshopRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteWorkshopVariables): MutationRef<DeleteWorkshopData, DeleteWorkshopVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteWorkshopVariables): MutationRef<DeleteWorkshopData, DeleteWorkshopVariables>;
  operationName: string;
}
export const deleteWorkshopRef: DeleteWorkshopRef;

export function deleteWorkshop(vars: DeleteWorkshopVariables): MutationPromise<DeleteWorkshopData, DeleteWorkshopVariables>;
export function deleteWorkshop(dc: DataConnect, vars: DeleteWorkshopVariables): MutationPromise<DeleteWorkshopData, DeleteWorkshopVariables>;

interface SolicitarCancelacionEspacioRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: SolicitarCancelacionEspacioVariables): MutationRef<SolicitarCancelacionEspacioData, SolicitarCancelacionEspacioVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: SolicitarCancelacionEspacioVariables): MutationRef<SolicitarCancelacionEspacioData, SolicitarCancelacionEspacioVariables>;
  operationName: string;
}
export const solicitarCancelacionEspacioRef: SolicitarCancelacionEspacioRef;

export function solicitarCancelacionEspacio(vars: SolicitarCancelacionEspacioVariables): MutationPromise<SolicitarCancelacionEspacioData, SolicitarCancelacionEspacioVariables>;
export function solicitarCancelacionEspacio(dc: DataConnect, vars: SolicitarCancelacionEspacioVariables): MutationPromise<SolicitarCancelacionEspacioData, SolicitarCancelacionEspacioVariables>;

interface ReactivarSuscripcionEspacioRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ReactivarSuscripcionEspacioVariables): MutationRef<ReactivarSuscripcionEspacioData, ReactivarSuscripcionEspacioVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ReactivarSuscripcionEspacioVariables): MutationRef<ReactivarSuscripcionEspacioData, ReactivarSuscripcionEspacioVariables>;
  operationName: string;
}
export const reactivarSuscripcionEspacioRef: ReactivarSuscripcionEspacioRef;

export function reactivarSuscripcionEspacio(vars: ReactivarSuscripcionEspacioVariables): MutationPromise<ReactivarSuscripcionEspacioData, ReactivarSuscripcionEspacioVariables>;
export function reactivarSuscripcionEspacio(dc: DataConnect, vars: ReactivarSuscripcionEspacioVariables): MutationPromise<ReactivarSuscripcionEspacioData, ReactivarSuscripcionEspacioVariables>;

interface CancelarReservaRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CancelarReservaVariables): MutationRef<CancelarReservaData, CancelarReservaVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CancelarReservaVariables): MutationRef<CancelarReservaData, CancelarReservaVariables>;
  operationName: string;
}
export const cancelarReservaRef: CancelarReservaRef;

export function cancelarReserva(vars: CancelarReservaVariables): MutationPromise<CancelarReservaData, CancelarReservaVariables>;
export function cancelarReserva(dc: DataConnect, vars: CancelarReservaVariables): MutationPromise<CancelarReservaData, CancelarReservaVariables>;

interface AdminUpdateEspacioRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: AdminUpdateEspacioVariables): MutationRef<AdminUpdateEspacioData, AdminUpdateEspacioVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: AdminUpdateEspacioVariables): MutationRef<AdminUpdateEspacioData, AdminUpdateEspacioVariables>;
  operationName: string;
}
export const adminUpdateEspacioRef: AdminUpdateEspacioRef;

export function adminUpdateEspacio(vars: AdminUpdateEspacioVariables): MutationPromise<AdminUpdateEspacioData, AdminUpdateEspacioVariables>;
export function adminUpdateEspacio(dc: DataConnect, vars: AdminUpdateEspacioVariables): MutationPromise<AdminUpdateEspacioData, AdminUpdateEspacioVariables>;

interface AdminDeleteEspacioRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: AdminDeleteEspacioVariables): MutationRef<AdminDeleteEspacioData, AdminDeleteEspacioVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: AdminDeleteEspacioVariables): MutationRef<AdminDeleteEspacioData, AdminDeleteEspacioVariables>;
  operationName: string;
}
export const adminDeleteEspacioRef: AdminDeleteEspacioRef;

export function adminDeleteEspacio(vars: AdminDeleteEspacioVariables): MutationPromise<AdminDeleteEspacioData, AdminDeleteEspacioVariables>;
export function adminDeleteEspacio(dc: DataConnect, vars: AdminDeleteEspacioVariables): MutationPromise<AdminDeleteEspacioData, AdminDeleteEspacioVariables>;

interface AdminDeleteProfesionalRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: AdminDeleteProfesionalVariables): MutationRef<AdminDeleteProfesionalData, AdminDeleteProfesionalVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: AdminDeleteProfesionalVariables): MutationRef<AdminDeleteProfesionalData, AdminDeleteProfesionalVariables>;
  operationName: string;
}
export const adminDeleteProfesionalRef: AdminDeleteProfesionalRef;

export function adminDeleteProfesional(vars: AdminDeleteProfesionalVariables): MutationPromise<AdminDeleteProfesionalData, AdminDeleteProfesionalVariables>;
export function adminDeleteProfesional(dc: DataConnect, vars: AdminDeleteProfesionalVariables): MutationPromise<AdminDeleteProfesionalData, AdminDeleteProfesionalVariables>;

interface AdminUpsertProfesionalRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: AdminUpsertProfesionalVariables): MutationRef<AdminUpsertProfesionalData, AdminUpsertProfesionalVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: AdminUpsertProfesionalVariables): MutationRef<AdminUpsertProfesionalData, AdminUpsertProfesionalVariables>;
  operationName: string;
}
export const adminUpsertProfesionalRef: AdminUpsertProfesionalRef;

export function adminUpsertProfesional(vars: AdminUpsertProfesionalVariables): MutationPromise<AdminUpsertProfesionalData, AdminUpsertProfesionalVariables>;
export function adminUpsertProfesional(dc: DataConnect, vars: AdminUpsertProfesionalVariables): MutationPromise<AdminUpsertProfesionalData, AdminUpsertProfesionalVariables>;

interface AdminEnsureProfesionalRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: AdminEnsureProfesionalVariables): MutationRef<AdminEnsureProfesionalData, AdminEnsureProfesionalVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: AdminEnsureProfesionalVariables): MutationRef<AdminEnsureProfesionalData, AdminEnsureProfesionalVariables>;
  operationName: string;
}
export const adminEnsureProfesionalRef: AdminEnsureProfesionalRef;

export function adminEnsureProfesional(vars: AdminEnsureProfesionalVariables): MutationPromise<AdminEnsureProfesionalData, AdminEnsureProfesionalVariables>;
export function adminEnsureProfesional(dc: DataConnect, vars: AdminEnsureProfesionalVariables): MutationPromise<AdminEnsureProfesionalData, AdminEnsureProfesionalVariables>;

interface AdminCreateEspacioMigrateRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: AdminCreateEspacioMigrateVariables): MutationRef<AdminCreateEspacioMigrateData, AdminCreateEspacioMigrateVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: AdminCreateEspacioMigrateVariables): MutationRef<AdminCreateEspacioMigrateData, AdminCreateEspacioMigrateVariables>;
  operationName: string;
}
export const adminCreateEspacioMigrateRef: AdminCreateEspacioMigrateRef;

export function adminCreateEspacioMigrate(vars: AdminCreateEspacioMigrateVariables): MutationPromise<AdminCreateEspacioMigrateData, AdminCreateEspacioMigrateVariables>;
export function adminCreateEspacioMigrate(dc: DataConnect, vars: AdminCreateEspacioMigrateVariables): MutationPromise<AdminCreateEspacioMigrateData, AdminCreateEspacioMigrateVariables>;

interface AdminCreateWorkshopMigrateRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: AdminCreateWorkshopMigrateVariables): MutationRef<AdminCreateWorkshopMigrateData, AdminCreateWorkshopMigrateVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: AdminCreateWorkshopMigrateVariables): MutationRef<AdminCreateWorkshopMigrateData, AdminCreateWorkshopMigrateVariables>;
  operationName: string;
}
export const adminCreateWorkshopMigrateRef: AdminCreateWorkshopMigrateRef;

export function adminCreateWorkshopMigrate(vars: AdminCreateWorkshopMigrateVariables): MutationPromise<AdminCreateWorkshopMigrateData, AdminCreateWorkshopMigrateVariables>;
export function adminCreateWorkshopMigrate(dc: DataConnect, vars: AdminCreateWorkshopMigrateVariables): MutationPromise<AdminCreateWorkshopMigrateData, AdminCreateWorkshopMigrateVariables>;

interface DecrementarCupoRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DecrementarCupoVariables): MutationRef<DecrementarCupoData, DecrementarCupoVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DecrementarCupoVariables): MutationRef<DecrementarCupoData, DecrementarCupoVariables>;
  operationName: string;
}
export const decrementarCupoRef: DecrementarCupoRef;

export function decrementarCupo(vars: DecrementarCupoVariables): MutationPromise<DecrementarCupoData, DecrementarCupoVariables>;
export function decrementarCupo(dc: DataConnect, vars: DecrementarCupoVariables): MutationPromise<DecrementarCupoData, DecrementarCupoVariables>;

interface CreateReservaConUsuarioRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateReservaConUsuarioVariables): MutationRef<CreateReservaConUsuarioData, CreateReservaConUsuarioVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateReservaConUsuarioVariables): MutationRef<CreateReservaConUsuarioData, CreateReservaConUsuarioVariables>;
  operationName: string;
}
export const createReservaConUsuarioRef: CreateReservaConUsuarioRef;

export function createReservaConUsuario(vars: CreateReservaConUsuarioVariables): MutationPromise<CreateReservaConUsuarioData, CreateReservaConUsuarioVariables>;
export function createReservaConUsuario(dc: DataConnect, vars: CreateReservaConUsuarioVariables): MutationPromise<CreateReservaConUsuarioData, CreateReservaConUsuarioVariables>;

interface MarkReservaPaidRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: MarkReservaPaidVariables): MutationRef<MarkReservaPaidData, MarkReservaPaidVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: MarkReservaPaidVariables): MutationRef<MarkReservaPaidData, MarkReservaPaidVariables>;
  operationName: string;
}
export const markReservaPaidRef: MarkReservaPaidRef;

export function markReservaPaid(vars: MarkReservaPaidVariables): MutationPromise<MarkReservaPaidData, MarkReservaPaidVariables>;
export function markReservaPaid(dc: DataConnect, vars: MarkReservaPaidVariables): MutationPromise<MarkReservaPaidData, MarkReservaPaidVariables>;

interface DevExpireTrialRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DevExpireTrialVariables): MutationRef<DevExpireTrialData, DevExpireTrialVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DevExpireTrialVariables): MutationRef<DevExpireTrialData, DevExpireTrialVariables>;
  operationName: string;
}
export const devExpireTrialRef: DevExpireTrialRef;

export function devExpireTrial(vars: DevExpireTrialVariables): MutationPromise<DevExpireTrialData, DevExpireTrialVariables>;
export function devExpireTrial(dc: DataConnect, vars: DevExpireTrialVariables): MutationPromise<DevExpireTrialData, DevExpireTrialVariables>;

interface ListReservasByEspacioRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListReservasByEspacioVariables): QueryRef<ListReservasByEspacioData, ListReservasByEspacioVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListReservasByEspacioVariables): QueryRef<ListReservasByEspacioData, ListReservasByEspacioVariables>;
  operationName: string;
}
export const listReservasByEspacioRef: ListReservasByEspacioRef;

export function listReservasByEspacio(vars: ListReservasByEspacioVariables, options?: ExecuteQueryOptions): QueryPromise<ListReservasByEspacioData, ListReservasByEspacioVariables>;
export function listReservasByEspacio(dc: DataConnect, vars: ListReservasByEspacioVariables, options?: ExecuteQueryOptions): QueryPromise<ListReservasByEspacioData, ListReservasByEspacioVariables>;

interface GetMyProfileRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetMyProfileData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<GetMyProfileData, undefined>;
  operationName: string;
}
export const getMyProfileRef: GetMyProfileRef;

export function getMyProfile(options?: ExecuteQueryOptions): QueryPromise<GetMyProfileData, undefined>;
export function getMyProfile(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<GetMyProfileData, undefined>;

interface ListPlanesRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListPlanesData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListPlanesData, undefined>;
  operationName: string;
}
export const listPlanesRef: ListPlanesRef;

export function listPlanes(options?: ExecuteQueryOptions): QueryPromise<ListPlanesData, undefined>;
export function listPlanes(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListPlanesData, undefined>;

interface ListRubrosRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListRubrosData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListRubrosData, undefined>;
  operationName: string;
}
export const listRubrosRef: ListRubrosRef;

export function listRubros(options?: ExecuteQueryOptions): QueryPromise<ListRubrosData, undefined>;
export function listRubros(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListRubrosData, undefined>;

interface ListMyEspaciosRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListMyEspaciosData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListMyEspaciosData, undefined>;
  operationName: string;
}
export const listMyEspaciosRef: ListMyEspaciosRef;

export function listMyEspacios(options?: ExecuteQueryOptions): QueryPromise<ListMyEspaciosData, undefined>;
export function listMyEspacios(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListMyEspaciosData, undefined>;

interface GetMyEspacioRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetMyEspacioVariables): QueryRef<GetMyEspacioData, GetMyEspacioVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetMyEspacioVariables): QueryRef<GetMyEspacioData, GetMyEspacioVariables>;
  operationName: string;
}
export const getMyEspacioRef: GetMyEspacioRef;

export function getMyEspacio(vars: GetMyEspacioVariables, options?: ExecuteQueryOptions): QueryPromise<GetMyEspacioData, GetMyEspacioVariables>;
export function getMyEspacio(dc: DataConnect, vars: GetMyEspacioVariables, options?: ExecuteQueryOptions): QueryPromise<GetMyEspacioData, GetMyEspacioVariables>;

interface ListMyWorkshopsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListMyWorkshopsVariables): QueryRef<ListMyWorkshopsData, ListMyWorkshopsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListMyWorkshopsVariables): QueryRef<ListMyWorkshopsData, ListMyWorkshopsVariables>;
  operationName: string;
}
export const listMyWorkshopsRef: ListMyWorkshopsRef;

export function listMyWorkshops(vars: ListMyWorkshopsVariables, options?: ExecuteQueryOptions): QueryPromise<ListMyWorkshopsData, ListMyWorkshopsVariables>;
export function listMyWorkshops(dc: DataConnect, vars: ListMyWorkshopsVariables, options?: ExecuteQueryOptions): QueryPromise<ListMyWorkshopsData, ListMyWorkshopsVariables>;

interface ListMyWorkshopsByEstadoRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListMyWorkshopsByEstadoVariables): QueryRef<ListMyWorkshopsByEstadoData, ListMyWorkshopsByEstadoVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListMyWorkshopsByEstadoVariables): QueryRef<ListMyWorkshopsByEstadoData, ListMyWorkshopsByEstadoVariables>;
  operationName: string;
}
export const listMyWorkshopsByEstadoRef: ListMyWorkshopsByEstadoRef;

export function listMyWorkshopsByEstado(vars: ListMyWorkshopsByEstadoVariables, options?: ExecuteQueryOptions): QueryPromise<ListMyWorkshopsByEstadoData, ListMyWorkshopsByEstadoVariables>;
export function listMyWorkshopsByEstado(dc: DataConnect, vars: ListMyWorkshopsByEstadoVariables, options?: ExecuteQueryOptions): QueryPromise<ListMyWorkshopsByEstadoData, ListMyWorkshopsByEstadoVariables>;

interface SearchMyWorkshopsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: SearchMyWorkshopsVariables): QueryRef<SearchMyWorkshopsData, SearchMyWorkshopsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: SearchMyWorkshopsVariables): QueryRef<SearchMyWorkshopsData, SearchMyWorkshopsVariables>;
  operationName: string;
}
export const searchMyWorkshopsRef: SearchMyWorkshopsRef;

export function searchMyWorkshops(vars: SearchMyWorkshopsVariables, options?: ExecuteQueryOptions): QueryPromise<SearchMyWorkshopsData, SearchMyWorkshopsVariables>;
export function searchMyWorkshops(dc: DataConnect, vars: SearchMyWorkshopsVariables, options?: ExecuteQueryOptions): QueryPromise<SearchMyWorkshopsData, SearchMyWorkshopsVariables>;

interface GetMyWorkshopRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetMyWorkshopVariables): QueryRef<GetMyWorkshopData, GetMyWorkshopVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetMyWorkshopVariables): QueryRef<GetMyWorkshopData, GetMyWorkshopVariables>;
  operationName: string;
}
export const getMyWorkshopRef: GetMyWorkshopRef;

export function getMyWorkshop(vars: GetMyWorkshopVariables, options?: ExecuteQueryOptions): QueryPromise<GetMyWorkshopData, GetMyWorkshopVariables>;
export function getMyWorkshop(dc: DataConnect, vars: GetMyWorkshopVariables, options?: ExecuteQueryOptions): QueryPromise<GetMyWorkshopData, GetMyWorkshopVariables>;

interface GetEspacioBySlugRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetEspacioBySlugVariables): QueryRef<GetEspacioBySlugData, GetEspacioBySlugVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetEspacioBySlugVariables): QueryRef<GetEspacioBySlugData, GetEspacioBySlugVariables>;
  operationName: string;
}
export const getEspacioBySlugRef: GetEspacioBySlugRef;

export function getEspacioBySlug(vars: GetEspacioBySlugVariables, options?: ExecuteQueryOptions): QueryPromise<GetEspacioBySlugData, GetEspacioBySlugVariables>;
export function getEspacioBySlug(dc: DataConnect, vars: GetEspacioBySlugVariables, options?: ExecuteQueryOptions): QueryPromise<GetEspacioBySlugData, GetEspacioBySlugVariables>;

interface GetPublicEspacioRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetPublicEspacioVariables): QueryRef<GetPublicEspacioData, GetPublicEspacioVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetPublicEspacioVariables): QueryRef<GetPublicEspacioData, GetPublicEspacioVariables>;
  operationName: string;
}
export const getPublicEspacioRef: GetPublicEspacioRef;

export function getPublicEspacio(vars: GetPublicEspacioVariables, options?: ExecuteQueryOptions): QueryPromise<GetPublicEspacioData, GetPublicEspacioVariables>;
export function getPublicEspacio(dc: DataConnect, vars: GetPublicEspacioVariables, options?: ExecuteQueryOptions): QueryPromise<GetPublicEspacioData, GetPublicEspacioVariables>;

interface GetPublicEspaciosRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetPublicEspaciosVariables): QueryRef<GetPublicEspaciosData, GetPublicEspaciosVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetPublicEspaciosVariables): QueryRef<GetPublicEspaciosData, GetPublicEspaciosVariables>;
  operationName: string;
}
export const getPublicEspaciosRef: GetPublicEspaciosRef;

export function getPublicEspacios(vars: GetPublicEspaciosVariables, options?: ExecuteQueryOptions): QueryPromise<GetPublicEspaciosData, GetPublicEspaciosVariables>;
export function getPublicEspacios(dc: DataConnect, vars: GetPublicEspaciosVariables, options?: ExecuteQueryOptions): QueryPromise<GetPublicEspaciosData, GetPublicEspaciosVariables>;

interface ListPublicWorkshopsByEspacioRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListPublicWorkshopsByEspacioVariables): QueryRef<ListPublicWorkshopsByEspacioData, ListPublicWorkshopsByEspacioVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListPublicWorkshopsByEspacioVariables): QueryRef<ListPublicWorkshopsByEspacioData, ListPublicWorkshopsByEspacioVariables>;
  operationName: string;
}
export const listPublicWorkshopsByEspacioRef: ListPublicWorkshopsByEspacioRef;

export function listPublicWorkshopsByEspacio(vars: ListPublicWorkshopsByEspacioVariables, options?: ExecuteQueryOptions): QueryPromise<ListPublicWorkshopsByEspacioData, ListPublicWorkshopsByEspacioVariables>;
export function listPublicWorkshopsByEspacio(dc: DataConnect, vars: ListPublicWorkshopsByEspacioVariables, options?: ExecuteQueryOptions): QueryPromise<ListPublicWorkshopsByEspacioData, ListPublicWorkshopsByEspacioVariables>;

interface ListMyReservasRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListMyReservasData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListMyReservasData, undefined>;
  operationName: string;
}
export const listMyReservasRef: ListMyReservasRef;

export function listMyReservas(options?: ExecuteQueryOptions): QueryPromise<ListMyReservasData, undefined>;
export function listMyReservas(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListMyReservasData, undefined>;

interface AdminListAllEspaciosRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<AdminListAllEspaciosData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<AdminListAllEspaciosData, undefined>;
  operationName: string;
}
export const adminListAllEspaciosRef: AdminListAllEspaciosRef;

export function adminListAllEspacios(options?: ExecuteQueryOptions): QueryPromise<AdminListAllEspaciosData, undefined>;
export function adminListAllEspacios(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<AdminListAllEspaciosData, undefined>;

interface AdminListAllWorkshopsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<AdminListAllWorkshopsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<AdminListAllWorkshopsData, undefined>;
  operationName: string;
}
export const adminListAllWorkshopsRef: AdminListAllWorkshopsRef;

export function adminListAllWorkshops(options?: ExecuteQueryOptions): QueryPromise<AdminListAllWorkshopsData, undefined>;
export function adminListAllWorkshops(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<AdminListAllWorkshopsData, undefined>;

interface AdminListAllReservasRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<AdminListAllReservasData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<AdminListAllReservasData, undefined>;
  operationName: string;
}
export const adminListAllReservasRef: AdminListAllReservasRef;

export function adminListAllReservas(options?: ExecuteQueryOptions): QueryPromise<AdminListAllReservasData, undefined>;
export function adminListAllReservas(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<AdminListAllReservasData, undefined>;

interface ListPublicWorkshopsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListPublicWorkshopsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListPublicWorkshopsData, undefined>;
  operationName: string;
}
export const listPublicWorkshopsRef: ListPublicWorkshopsRef;

export function listPublicWorkshops(options?: ExecuteQueryOptions): QueryPromise<ListPublicWorkshopsData, undefined>;
export function listPublicWorkshops(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListPublicWorkshopsData, undefined>;

