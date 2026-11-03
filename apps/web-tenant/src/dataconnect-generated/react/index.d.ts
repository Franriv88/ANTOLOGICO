import { UpsertProfesionalData, UpsertProfesionalVariables, ReassignProfesionalUidData, ReassignProfesionalUidVariables, ActivarPlanData, ActivarPlanVariables, AgendarDowngradeData, AgendarDowngradeVariables, CancelarDowngradeData, CancelarDowngradeVariables, UpdateCuponAplicadoData, UpdateCuponAplicadoVariables, CreateEspacioData, CreateEspacioVariables, UpdateEspacioIdentidadData, UpdateEspacioIdentidadVariables, UpdateEspacioCobrosData, UpdateEspacioCobrosVariables, UpdateEspacioRedesData, UpdateEspacioRedesVariables, UpdateEspacioData, UpdateEspacioVariables, UpdateEspacioDireccionesData, UpdateEspacioDireccionesVariables, UpdateEspacioTyCData, UpdateEspacioTyCVariables, UpdateEspacioSlugData, UpdateEspacioSlugVariables, CreateWorkshopData, CreateWorkshopVariables, UpdateWorkshopData, UpdateWorkshopVariables, UpdateWorkshopEstadoData, UpdateWorkshopEstadoVariables, DeleteWorkshopData, DeleteWorkshopVariables, SolicitarCancelacionEspacioData, SolicitarCancelacionEspacioVariables, ReactivarSuscripcionEspacioData, ReactivarSuscripcionEspacioVariables, CancelarReservaData, CancelarReservaVariables, AdminUpdateEspacioData, AdminUpdateEspacioVariables, AdminDeleteEspacioData, AdminDeleteEspacioVariables, AdminDeleteProfesionalData, AdminDeleteProfesionalVariables, AdminUpsertProfesionalData, AdminUpsertProfesionalVariables, AdminEnsureProfesionalData, AdminEnsureProfesionalVariables, AdminCreateEspacioMigrateData, AdminCreateEspacioMigrateVariables, AdminCreateWorkshopMigrateData, AdminCreateWorkshopMigrateVariables, DecrementarCupoData, DecrementarCupoVariables, CreateReservaConUsuarioData, CreateReservaConUsuarioVariables, MarkReservaPaidData, MarkReservaPaidVariables, MarkReservaUnpaidData, MarkReservaUnpaidVariables, DevExpireTrialData, DevExpireTrialVariables, ListReservasByEspacioData, ListReservasByEspacioVariables, GetMyProfileData, ListPlanesData, ListRubrosData, ListMyEspaciosData, GetMyEspacioData, GetMyEspacioVariables, ListMyWorkshopsData, ListMyWorkshopsVariables, ListMyWorkshopsByEstadoData, ListMyWorkshopsByEstadoVariables, SearchMyWorkshopsData, SearchMyWorkshopsVariables, GetMyWorkshopData, GetMyWorkshopVariables, GetEspacioBySlugData, GetEspacioBySlugVariables, GetPublicEspacioData, GetPublicEspacioVariables, GetPublicEspaciosData, GetPublicEspaciosVariables, ListPublicWorkshopsByEspacioData, ListPublicWorkshopsByEspacioVariables, ListMyReservasData, AdminListAllEspaciosData, AdminListAllWorkshopsData, AdminListAllReservasData, ListPublicWorkshopsData } from '../';
import { UseDataConnectQueryResult, useDataConnectQueryOptions, UseDataConnectMutationResult, useDataConnectMutationOptions} from '@tanstack-query-firebase/react/data-connect';
import { UseQueryResult, UseMutationResult} from '@tanstack/react-query';
import { DataConnect } from 'firebase/data-connect';
import { FirebaseError } from 'firebase/app';


export function useUpsertProfesional(options?: useDataConnectMutationOptions<UpsertProfesionalData, FirebaseError, UpsertProfesionalVariables>): UseDataConnectMutationResult<UpsertProfesionalData, UpsertProfesionalVariables>;
export function useUpsertProfesional(dc: DataConnect, options?: useDataConnectMutationOptions<UpsertProfesionalData, FirebaseError, UpsertProfesionalVariables>): UseDataConnectMutationResult<UpsertProfesionalData, UpsertProfesionalVariables>;

export function useReassignProfesionalUid(options?: useDataConnectMutationOptions<ReassignProfesionalUidData, FirebaseError, ReassignProfesionalUidVariables>): UseDataConnectMutationResult<ReassignProfesionalUidData, ReassignProfesionalUidVariables>;
export function useReassignProfesionalUid(dc: DataConnect, options?: useDataConnectMutationOptions<ReassignProfesionalUidData, FirebaseError, ReassignProfesionalUidVariables>): UseDataConnectMutationResult<ReassignProfesionalUidData, ReassignProfesionalUidVariables>;

export function useActivarPlan(options?: useDataConnectMutationOptions<ActivarPlanData, FirebaseError, ActivarPlanVariables>): UseDataConnectMutationResult<ActivarPlanData, ActivarPlanVariables>;
export function useActivarPlan(dc: DataConnect, options?: useDataConnectMutationOptions<ActivarPlanData, FirebaseError, ActivarPlanVariables>): UseDataConnectMutationResult<ActivarPlanData, ActivarPlanVariables>;

export function useAgendarDowngrade(options?: useDataConnectMutationOptions<AgendarDowngradeData, FirebaseError, AgendarDowngradeVariables>): UseDataConnectMutationResult<AgendarDowngradeData, AgendarDowngradeVariables>;
export function useAgendarDowngrade(dc: DataConnect, options?: useDataConnectMutationOptions<AgendarDowngradeData, FirebaseError, AgendarDowngradeVariables>): UseDataConnectMutationResult<AgendarDowngradeData, AgendarDowngradeVariables>;

export function useCancelarDowngrade(options?: useDataConnectMutationOptions<CancelarDowngradeData, FirebaseError, CancelarDowngradeVariables>): UseDataConnectMutationResult<CancelarDowngradeData, CancelarDowngradeVariables>;
export function useCancelarDowngrade(dc: DataConnect, options?: useDataConnectMutationOptions<CancelarDowngradeData, FirebaseError, CancelarDowngradeVariables>): UseDataConnectMutationResult<CancelarDowngradeData, CancelarDowngradeVariables>;

export function useUpdateCuponAplicado(options?: useDataConnectMutationOptions<UpdateCuponAplicadoData, FirebaseError, UpdateCuponAplicadoVariables>): UseDataConnectMutationResult<UpdateCuponAplicadoData, UpdateCuponAplicadoVariables>;
export function useUpdateCuponAplicado(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateCuponAplicadoData, FirebaseError, UpdateCuponAplicadoVariables>): UseDataConnectMutationResult<UpdateCuponAplicadoData, UpdateCuponAplicadoVariables>;

export function useCreateEspacio(options?: useDataConnectMutationOptions<CreateEspacioData, FirebaseError, CreateEspacioVariables>): UseDataConnectMutationResult<CreateEspacioData, CreateEspacioVariables>;
export function useCreateEspacio(dc: DataConnect, options?: useDataConnectMutationOptions<CreateEspacioData, FirebaseError, CreateEspacioVariables>): UseDataConnectMutationResult<CreateEspacioData, CreateEspacioVariables>;

export function useUpdateEspacioIdentidad(options?: useDataConnectMutationOptions<UpdateEspacioIdentidadData, FirebaseError, UpdateEspacioIdentidadVariables>): UseDataConnectMutationResult<UpdateEspacioIdentidadData, UpdateEspacioIdentidadVariables>;
export function useUpdateEspacioIdentidad(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateEspacioIdentidadData, FirebaseError, UpdateEspacioIdentidadVariables>): UseDataConnectMutationResult<UpdateEspacioIdentidadData, UpdateEspacioIdentidadVariables>;

export function useUpdateEspacioCobros(options?: useDataConnectMutationOptions<UpdateEspacioCobrosData, FirebaseError, UpdateEspacioCobrosVariables>): UseDataConnectMutationResult<UpdateEspacioCobrosData, UpdateEspacioCobrosVariables>;
export function useUpdateEspacioCobros(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateEspacioCobrosData, FirebaseError, UpdateEspacioCobrosVariables>): UseDataConnectMutationResult<UpdateEspacioCobrosData, UpdateEspacioCobrosVariables>;

export function useUpdateEspacioRedes(options?: useDataConnectMutationOptions<UpdateEspacioRedesData, FirebaseError, UpdateEspacioRedesVariables>): UseDataConnectMutationResult<UpdateEspacioRedesData, UpdateEspacioRedesVariables>;
export function useUpdateEspacioRedes(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateEspacioRedesData, FirebaseError, UpdateEspacioRedesVariables>): UseDataConnectMutationResult<UpdateEspacioRedesData, UpdateEspacioRedesVariables>;

export function useUpdateEspacio(options?: useDataConnectMutationOptions<UpdateEspacioData, FirebaseError, UpdateEspacioVariables>): UseDataConnectMutationResult<UpdateEspacioData, UpdateEspacioVariables>;
export function useUpdateEspacio(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateEspacioData, FirebaseError, UpdateEspacioVariables>): UseDataConnectMutationResult<UpdateEspacioData, UpdateEspacioVariables>;

export function useUpdateEspacioDirecciones(options?: useDataConnectMutationOptions<UpdateEspacioDireccionesData, FirebaseError, UpdateEspacioDireccionesVariables>): UseDataConnectMutationResult<UpdateEspacioDireccionesData, UpdateEspacioDireccionesVariables>;
export function useUpdateEspacioDirecciones(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateEspacioDireccionesData, FirebaseError, UpdateEspacioDireccionesVariables>): UseDataConnectMutationResult<UpdateEspacioDireccionesData, UpdateEspacioDireccionesVariables>;

export function useUpdateEspacioTyC(options?: useDataConnectMutationOptions<UpdateEspacioTyCData, FirebaseError, UpdateEspacioTyCVariables>): UseDataConnectMutationResult<UpdateEspacioTyCData, UpdateEspacioTyCVariables>;
export function useUpdateEspacioTyC(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateEspacioTyCData, FirebaseError, UpdateEspacioTyCVariables>): UseDataConnectMutationResult<UpdateEspacioTyCData, UpdateEspacioTyCVariables>;

export function useUpdateEspacioSlug(options?: useDataConnectMutationOptions<UpdateEspacioSlugData, FirebaseError, UpdateEspacioSlugVariables>): UseDataConnectMutationResult<UpdateEspacioSlugData, UpdateEspacioSlugVariables>;
export function useUpdateEspacioSlug(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateEspacioSlugData, FirebaseError, UpdateEspacioSlugVariables>): UseDataConnectMutationResult<UpdateEspacioSlugData, UpdateEspacioSlugVariables>;

export function useCreateWorkshop(options?: useDataConnectMutationOptions<CreateWorkshopData, FirebaseError, CreateWorkshopVariables>): UseDataConnectMutationResult<CreateWorkshopData, CreateWorkshopVariables>;
export function useCreateWorkshop(dc: DataConnect, options?: useDataConnectMutationOptions<CreateWorkshopData, FirebaseError, CreateWorkshopVariables>): UseDataConnectMutationResult<CreateWorkshopData, CreateWorkshopVariables>;

export function useUpdateWorkshop(options?: useDataConnectMutationOptions<UpdateWorkshopData, FirebaseError, UpdateWorkshopVariables>): UseDataConnectMutationResult<UpdateWorkshopData, UpdateWorkshopVariables>;
export function useUpdateWorkshop(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateWorkshopData, FirebaseError, UpdateWorkshopVariables>): UseDataConnectMutationResult<UpdateWorkshopData, UpdateWorkshopVariables>;

export function useUpdateWorkshopEstado(options?: useDataConnectMutationOptions<UpdateWorkshopEstadoData, FirebaseError, UpdateWorkshopEstadoVariables>): UseDataConnectMutationResult<UpdateWorkshopEstadoData, UpdateWorkshopEstadoVariables>;
export function useUpdateWorkshopEstado(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateWorkshopEstadoData, FirebaseError, UpdateWorkshopEstadoVariables>): UseDataConnectMutationResult<UpdateWorkshopEstadoData, UpdateWorkshopEstadoVariables>;

export function useDeleteWorkshop(options?: useDataConnectMutationOptions<DeleteWorkshopData, FirebaseError, DeleteWorkshopVariables>): UseDataConnectMutationResult<DeleteWorkshopData, DeleteWorkshopVariables>;
export function useDeleteWorkshop(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteWorkshopData, FirebaseError, DeleteWorkshopVariables>): UseDataConnectMutationResult<DeleteWorkshopData, DeleteWorkshopVariables>;

export function useSolicitarCancelacionEspacio(options?: useDataConnectMutationOptions<SolicitarCancelacionEspacioData, FirebaseError, SolicitarCancelacionEspacioVariables>): UseDataConnectMutationResult<SolicitarCancelacionEspacioData, SolicitarCancelacionEspacioVariables>;
export function useSolicitarCancelacionEspacio(dc: DataConnect, options?: useDataConnectMutationOptions<SolicitarCancelacionEspacioData, FirebaseError, SolicitarCancelacionEspacioVariables>): UseDataConnectMutationResult<SolicitarCancelacionEspacioData, SolicitarCancelacionEspacioVariables>;

export function useReactivarSuscripcionEspacio(options?: useDataConnectMutationOptions<ReactivarSuscripcionEspacioData, FirebaseError, ReactivarSuscripcionEspacioVariables>): UseDataConnectMutationResult<ReactivarSuscripcionEspacioData, ReactivarSuscripcionEspacioVariables>;
export function useReactivarSuscripcionEspacio(dc: DataConnect, options?: useDataConnectMutationOptions<ReactivarSuscripcionEspacioData, FirebaseError, ReactivarSuscripcionEspacioVariables>): UseDataConnectMutationResult<ReactivarSuscripcionEspacioData, ReactivarSuscripcionEspacioVariables>;

export function useCancelarReserva(options?: useDataConnectMutationOptions<CancelarReservaData, FirebaseError, CancelarReservaVariables>): UseDataConnectMutationResult<CancelarReservaData, CancelarReservaVariables>;
export function useCancelarReserva(dc: DataConnect, options?: useDataConnectMutationOptions<CancelarReservaData, FirebaseError, CancelarReservaVariables>): UseDataConnectMutationResult<CancelarReservaData, CancelarReservaVariables>;

export function useAdminUpdateEspacio(options?: useDataConnectMutationOptions<AdminUpdateEspacioData, FirebaseError, AdminUpdateEspacioVariables>): UseDataConnectMutationResult<AdminUpdateEspacioData, AdminUpdateEspacioVariables>;
export function useAdminUpdateEspacio(dc: DataConnect, options?: useDataConnectMutationOptions<AdminUpdateEspacioData, FirebaseError, AdminUpdateEspacioVariables>): UseDataConnectMutationResult<AdminUpdateEspacioData, AdminUpdateEspacioVariables>;

export function useAdminDeleteEspacio(options?: useDataConnectMutationOptions<AdminDeleteEspacioData, FirebaseError, AdminDeleteEspacioVariables>): UseDataConnectMutationResult<AdminDeleteEspacioData, AdminDeleteEspacioVariables>;
export function useAdminDeleteEspacio(dc: DataConnect, options?: useDataConnectMutationOptions<AdminDeleteEspacioData, FirebaseError, AdminDeleteEspacioVariables>): UseDataConnectMutationResult<AdminDeleteEspacioData, AdminDeleteEspacioVariables>;

export function useAdminDeleteProfesional(options?: useDataConnectMutationOptions<AdminDeleteProfesionalData, FirebaseError, AdminDeleteProfesionalVariables>): UseDataConnectMutationResult<AdminDeleteProfesionalData, AdminDeleteProfesionalVariables>;
export function useAdminDeleteProfesional(dc: DataConnect, options?: useDataConnectMutationOptions<AdminDeleteProfesionalData, FirebaseError, AdminDeleteProfesionalVariables>): UseDataConnectMutationResult<AdminDeleteProfesionalData, AdminDeleteProfesionalVariables>;

export function useAdminUpsertProfesional(options?: useDataConnectMutationOptions<AdminUpsertProfesionalData, FirebaseError, AdminUpsertProfesionalVariables>): UseDataConnectMutationResult<AdminUpsertProfesionalData, AdminUpsertProfesionalVariables>;
export function useAdminUpsertProfesional(dc: DataConnect, options?: useDataConnectMutationOptions<AdminUpsertProfesionalData, FirebaseError, AdminUpsertProfesionalVariables>): UseDataConnectMutationResult<AdminUpsertProfesionalData, AdminUpsertProfesionalVariables>;

export function useAdminEnsureProfesional(options?: useDataConnectMutationOptions<AdminEnsureProfesionalData, FirebaseError, AdminEnsureProfesionalVariables>): UseDataConnectMutationResult<AdminEnsureProfesionalData, AdminEnsureProfesionalVariables>;
export function useAdminEnsureProfesional(dc: DataConnect, options?: useDataConnectMutationOptions<AdminEnsureProfesionalData, FirebaseError, AdminEnsureProfesionalVariables>): UseDataConnectMutationResult<AdminEnsureProfesionalData, AdminEnsureProfesionalVariables>;

export function useAdminCreateEspacioMigrate(options?: useDataConnectMutationOptions<AdminCreateEspacioMigrateData, FirebaseError, AdminCreateEspacioMigrateVariables>): UseDataConnectMutationResult<AdminCreateEspacioMigrateData, AdminCreateEspacioMigrateVariables>;
export function useAdminCreateEspacioMigrate(dc: DataConnect, options?: useDataConnectMutationOptions<AdminCreateEspacioMigrateData, FirebaseError, AdminCreateEspacioMigrateVariables>): UseDataConnectMutationResult<AdminCreateEspacioMigrateData, AdminCreateEspacioMigrateVariables>;

export function useAdminCreateWorkshopMigrate(options?: useDataConnectMutationOptions<AdminCreateWorkshopMigrateData, FirebaseError, AdminCreateWorkshopMigrateVariables>): UseDataConnectMutationResult<AdminCreateWorkshopMigrateData, AdminCreateWorkshopMigrateVariables>;
export function useAdminCreateWorkshopMigrate(dc: DataConnect, options?: useDataConnectMutationOptions<AdminCreateWorkshopMigrateData, FirebaseError, AdminCreateWorkshopMigrateVariables>): UseDataConnectMutationResult<AdminCreateWorkshopMigrateData, AdminCreateWorkshopMigrateVariables>;

export function useDecrementarCupo(options?: useDataConnectMutationOptions<DecrementarCupoData, FirebaseError, DecrementarCupoVariables>): UseDataConnectMutationResult<DecrementarCupoData, DecrementarCupoVariables>;
export function useDecrementarCupo(dc: DataConnect, options?: useDataConnectMutationOptions<DecrementarCupoData, FirebaseError, DecrementarCupoVariables>): UseDataConnectMutationResult<DecrementarCupoData, DecrementarCupoVariables>;

export function useCreateReservaConUsuario(options?: useDataConnectMutationOptions<CreateReservaConUsuarioData, FirebaseError, CreateReservaConUsuarioVariables>): UseDataConnectMutationResult<CreateReservaConUsuarioData, CreateReservaConUsuarioVariables>;
export function useCreateReservaConUsuario(dc: DataConnect, options?: useDataConnectMutationOptions<CreateReservaConUsuarioData, FirebaseError, CreateReservaConUsuarioVariables>): UseDataConnectMutationResult<CreateReservaConUsuarioData, CreateReservaConUsuarioVariables>;

export function useMarkReservaPaid(options?: useDataConnectMutationOptions<MarkReservaPaidData, FirebaseError, MarkReservaPaidVariables>): UseDataConnectMutationResult<MarkReservaPaidData, MarkReservaPaidVariables>;
export function useMarkReservaPaid(dc: DataConnect, options?: useDataConnectMutationOptions<MarkReservaPaidData, FirebaseError, MarkReservaPaidVariables>): UseDataConnectMutationResult<MarkReservaPaidData, MarkReservaPaidVariables>;

export function useMarkReservaUnpaid(options?: useDataConnectMutationOptions<MarkReservaUnpaidData, FirebaseError, MarkReservaUnpaidVariables>): UseDataConnectMutationResult<MarkReservaUnpaidData, MarkReservaUnpaidVariables>;
export function useMarkReservaUnpaid(dc: DataConnect, options?: useDataConnectMutationOptions<MarkReservaUnpaidData, FirebaseError, MarkReservaUnpaidVariables>): UseDataConnectMutationResult<MarkReservaUnpaidData, MarkReservaUnpaidVariables>;

export function useDevExpireTrial(options?: useDataConnectMutationOptions<DevExpireTrialData, FirebaseError, DevExpireTrialVariables>): UseDataConnectMutationResult<DevExpireTrialData, DevExpireTrialVariables>;
export function useDevExpireTrial(dc: DataConnect, options?: useDataConnectMutationOptions<DevExpireTrialData, FirebaseError, DevExpireTrialVariables>): UseDataConnectMutationResult<DevExpireTrialData, DevExpireTrialVariables>;

export function useListReservasByEspacio(vars: ListReservasByEspacioVariables, options?: useDataConnectQueryOptions<ListReservasByEspacioData>): UseDataConnectQueryResult<ListReservasByEspacioData, ListReservasByEspacioVariables>;
export function useListReservasByEspacio(dc: DataConnect, vars: ListReservasByEspacioVariables, options?: useDataConnectQueryOptions<ListReservasByEspacioData>): UseDataConnectQueryResult<ListReservasByEspacioData, ListReservasByEspacioVariables>;

export function useGetMyProfile(options?: useDataConnectQueryOptions<GetMyProfileData>): UseDataConnectQueryResult<GetMyProfileData, undefined>;
export function useGetMyProfile(dc: DataConnect, options?: useDataConnectQueryOptions<GetMyProfileData>): UseDataConnectQueryResult<GetMyProfileData, undefined>;

export function useListPlanes(options?: useDataConnectQueryOptions<ListPlanesData>): UseDataConnectQueryResult<ListPlanesData, undefined>;
export function useListPlanes(dc: DataConnect, options?: useDataConnectQueryOptions<ListPlanesData>): UseDataConnectQueryResult<ListPlanesData, undefined>;

export function useListRubros(options?: useDataConnectQueryOptions<ListRubrosData>): UseDataConnectQueryResult<ListRubrosData, undefined>;
export function useListRubros(dc: DataConnect, options?: useDataConnectQueryOptions<ListRubrosData>): UseDataConnectQueryResult<ListRubrosData, undefined>;

export function useListMyEspacios(options?: useDataConnectQueryOptions<ListMyEspaciosData>): UseDataConnectQueryResult<ListMyEspaciosData, undefined>;
export function useListMyEspacios(dc: DataConnect, options?: useDataConnectQueryOptions<ListMyEspaciosData>): UseDataConnectQueryResult<ListMyEspaciosData, undefined>;

export function useGetMyEspacio(vars: GetMyEspacioVariables, options?: useDataConnectQueryOptions<GetMyEspacioData>): UseDataConnectQueryResult<GetMyEspacioData, GetMyEspacioVariables>;
export function useGetMyEspacio(dc: DataConnect, vars: GetMyEspacioVariables, options?: useDataConnectQueryOptions<GetMyEspacioData>): UseDataConnectQueryResult<GetMyEspacioData, GetMyEspacioVariables>;

export function useListMyWorkshops(vars: ListMyWorkshopsVariables, options?: useDataConnectQueryOptions<ListMyWorkshopsData>): UseDataConnectQueryResult<ListMyWorkshopsData, ListMyWorkshopsVariables>;
export function useListMyWorkshops(dc: DataConnect, vars: ListMyWorkshopsVariables, options?: useDataConnectQueryOptions<ListMyWorkshopsData>): UseDataConnectQueryResult<ListMyWorkshopsData, ListMyWorkshopsVariables>;

export function useListMyWorkshopsByEstado(vars: ListMyWorkshopsByEstadoVariables, options?: useDataConnectQueryOptions<ListMyWorkshopsByEstadoData>): UseDataConnectQueryResult<ListMyWorkshopsByEstadoData, ListMyWorkshopsByEstadoVariables>;
export function useListMyWorkshopsByEstado(dc: DataConnect, vars: ListMyWorkshopsByEstadoVariables, options?: useDataConnectQueryOptions<ListMyWorkshopsByEstadoData>): UseDataConnectQueryResult<ListMyWorkshopsByEstadoData, ListMyWorkshopsByEstadoVariables>;

export function useSearchMyWorkshops(vars: SearchMyWorkshopsVariables, options?: useDataConnectQueryOptions<SearchMyWorkshopsData>): UseDataConnectQueryResult<SearchMyWorkshopsData, SearchMyWorkshopsVariables>;
export function useSearchMyWorkshops(dc: DataConnect, vars: SearchMyWorkshopsVariables, options?: useDataConnectQueryOptions<SearchMyWorkshopsData>): UseDataConnectQueryResult<SearchMyWorkshopsData, SearchMyWorkshopsVariables>;

export function useGetMyWorkshop(vars: GetMyWorkshopVariables, options?: useDataConnectQueryOptions<GetMyWorkshopData>): UseDataConnectQueryResult<GetMyWorkshopData, GetMyWorkshopVariables>;
export function useGetMyWorkshop(dc: DataConnect, vars: GetMyWorkshopVariables, options?: useDataConnectQueryOptions<GetMyWorkshopData>): UseDataConnectQueryResult<GetMyWorkshopData, GetMyWorkshopVariables>;

export function useGetEspacioBySlug(vars: GetEspacioBySlugVariables, options?: useDataConnectQueryOptions<GetEspacioBySlugData>): UseDataConnectQueryResult<GetEspacioBySlugData, GetEspacioBySlugVariables>;
export function useGetEspacioBySlug(dc: DataConnect, vars: GetEspacioBySlugVariables, options?: useDataConnectQueryOptions<GetEspacioBySlugData>): UseDataConnectQueryResult<GetEspacioBySlugData, GetEspacioBySlugVariables>;

export function useGetPublicEspacio(vars: GetPublicEspacioVariables, options?: useDataConnectQueryOptions<GetPublicEspacioData>): UseDataConnectQueryResult<GetPublicEspacioData, GetPublicEspacioVariables>;
export function useGetPublicEspacio(dc: DataConnect, vars: GetPublicEspacioVariables, options?: useDataConnectQueryOptions<GetPublicEspacioData>): UseDataConnectQueryResult<GetPublicEspacioData, GetPublicEspacioVariables>;

export function useGetPublicEspacios(vars: GetPublicEspaciosVariables, options?: useDataConnectQueryOptions<GetPublicEspaciosData>): UseDataConnectQueryResult<GetPublicEspaciosData, GetPublicEspaciosVariables>;
export function useGetPublicEspacios(dc: DataConnect, vars: GetPublicEspaciosVariables, options?: useDataConnectQueryOptions<GetPublicEspaciosData>): UseDataConnectQueryResult<GetPublicEspaciosData, GetPublicEspaciosVariables>;

export function useListPublicWorkshopsByEspacio(vars: ListPublicWorkshopsByEspacioVariables, options?: useDataConnectQueryOptions<ListPublicWorkshopsByEspacioData>): UseDataConnectQueryResult<ListPublicWorkshopsByEspacioData, ListPublicWorkshopsByEspacioVariables>;
export function useListPublicWorkshopsByEspacio(dc: DataConnect, vars: ListPublicWorkshopsByEspacioVariables, options?: useDataConnectQueryOptions<ListPublicWorkshopsByEspacioData>): UseDataConnectQueryResult<ListPublicWorkshopsByEspacioData, ListPublicWorkshopsByEspacioVariables>;

export function useListMyReservas(options?: useDataConnectQueryOptions<ListMyReservasData>): UseDataConnectQueryResult<ListMyReservasData, undefined>;
export function useListMyReservas(dc: DataConnect, options?: useDataConnectQueryOptions<ListMyReservasData>): UseDataConnectQueryResult<ListMyReservasData, undefined>;

export function useAdminListAllEspacios(options?: useDataConnectQueryOptions<AdminListAllEspaciosData>): UseDataConnectQueryResult<AdminListAllEspaciosData, undefined>;
export function useAdminListAllEspacios(dc: DataConnect, options?: useDataConnectQueryOptions<AdminListAllEspaciosData>): UseDataConnectQueryResult<AdminListAllEspaciosData, undefined>;

export function useAdminListAllWorkshops(options?: useDataConnectQueryOptions<AdminListAllWorkshopsData>): UseDataConnectQueryResult<AdminListAllWorkshopsData, undefined>;
export function useAdminListAllWorkshops(dc: DataConnect, options?: useDataConnectQueryOptions<AdminListAllWorkshopsData>): UseDataConnectQueryResult<AdminListAllWorkshopsData, undefined>;

export function useAdminListAllReservas(options?: useDataConnectQueryOptions<AdminListAllReservasData>): UseDataConnectQueryResult<AdminListAllReservasData, undefined>;
export function useAdminListAllReservas(dc: DataConnect, options?: useDataConnectQueryOptions<AdminListAllReservasData>): UseDataConnectQueryResult<AdminListAllReservasData, undefined>;

export function useListPublicWorkshops(options?: useDataConnectQueryOptions<ListPublicWorkshopsData>): UseDataConnectQueryResult<ListPublicWorkshopsData, undefined>;
export function useListPublicWorkshops(dc: DataConnect, options?: useDataConnectQueryOptions<ListPublicWorkshopsData>): UseDataConnectQueryResult<ListPublicWorkshopsData, undefined>;
