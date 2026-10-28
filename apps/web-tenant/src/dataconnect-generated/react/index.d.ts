import { UpsertProfesionalData, UpsertProfesionalVariables, ReassignProfesionalUidData, ReassignProfesionalUidVariables, UpdateEspacioPlanIdData, UpdateEspacioPlanIdVariables, CreateEspacioData, CreateEspacioVariables, UpdateEspacioIdentidadData, UpdateEspacioIdentidadVariables, UpdateEspacioCobrosData, UpdateEspacioCobrosVariables, UpdateEspacioRedesData, UpdateEspacioRedesVariables, UpdateEspacioData, UpdateEspacioVariables, CreateWorkshopData, CreateWorkshopVariables, UpdateWorkshopData, UpdateWorkshopVariables, UpdateWorkshopEstadoData, UpdateWorkshopEstadoVariables, DeleteWorkshopData, DeleteWorkshopVariables, SolicitarCancelacionEspacioData, SolicitarCancelacionEspacioVariables, ReactivarSuscripcionEspacioData, ReactivarSuscripcionEspacioVariables, CancelarReservaData, CancelarReservaVariables, DecrementarCupoData, DecrementarCupoVariables, ListReservasByEspacioData, ListReservasByEspacioVariables, GetMyProfileData, ListPlanesData, ListRubrosData, ListMyEspaciosData, GetMyEspacioData, GetMyEspacioVariables, ListMyWorkshopsData, ListMyWorkshopsVariables, ListMyWorkshopsByEstadoData, ListMyWorkshopsByEstadoVariables, SearchMyWorkshopsData, SearchMyWorkshopsVariables, GetMyWorkshopData, GetMyWorkshopVariables, GetPublicEspacioData, GetPublicEspacioVariables, GetPublicEspaciosData, GetPublicEspaciosVariables, ListPublicWorkshopsByEspacioData, ListPublicWorkshopsByEspacioVariables, ListPublicWorkshopsData } from '../';
import { UseDataConnectQueryResult, useDataConnectQueryOptions, UseDataConnectMutationResult, useDataConnectMutationOptions} from '@tanstack-query-firebase/react/data-connect';
import { UseQueryResult, UseMutationResult} from '@tanstack/react-query';
import { DataConnect } from 'firebase/data-connect';
import { FirebaseError } from 'firebase/app';


export function useUpsertProfesional(options?: useDataConnectMutationOptions<UpsertProfesionalData, FirebaseError, UpsertProfesionalVariables>): UseDataConnectMutationResult<UpsertProfesionalData, UpsertProfesionalVariables>;
export function useUpsertProfesional(dc: DataConnect, options?: useDataConnectMutationOptions<UpsertProfesionalData, FirebaseError, UpsertProfesionalVariables>): UseDataConnectMutationResult<UpsertProfesionalData, UpsertProfesionalVariables>;

export function useReassignProfesionalUid(options?: useDataConnectMutationOptions<ReassignProfesionalUidData, FirebaseError, ReassignProfesionalUidVariables>): UseDataConnectMutationResult<ReassignProfesionalUidData, ReassignProfesionalUidVariables>;
export function useReassignProfesionalUid(dc: DataConnect, options?: useDataConnectMutationOptions<ReassignProfesionalUidData, FirebaseError, ReassignProfesionalUidVariables>): UseDataConnectMutationResult<ReassignProfesionalUidData, ReassignProfesionalUidVariables>;

export function useUpdateEspacioPlanId(options?: useDataConnectMutationOptions<UpdateEspacioPlanIdData, FirebaseError, UpdateEspacioPlanIdVariables>): UseDataConnectMutationResult<UpdateEspacioPlanIdData, UpdateEspacioPlanIdVariables>;
export function useUpdateEspacioPlanId(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateEspacioPlanIdData, FirebaseError, UpdateEspacioPlanIdVariables>): UseDataConnectMutationResult<UpdateEspacioPlanIdData, UpdateEspacioPlanIdVariables>;

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

export function useDecrementarCupo(options?: useDataConnectMutationOptions<DecrementarCupoData, FirebaseError, DecrementarCupoVariables>): UseDataConnectMutationResult<DecrementarCupoData, DecrementarCupoVariables>;
export function useDecrementarCupo(dc: DataConnect, options?: useDataConnectMutationOptions<DecrementarCupoData, FirebaseError, DecrementarCupoVariables>): UseDataConnectMutationResult<DecrementarCupoData, DecrementarCupoVariables>;

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

export function useGetPublicEspacio(vars: GetPublicEspacioVariables, options?: useDataConnectQueryOptions<GetPublicEspacioData>): UseDataConnectQueryResult<GetPublicEspacioData, GetPublicEspacioVariables>;
export function useGetPublicEspacio(dc: DataConnect, vars: GetPublicEspacioVariables, options?: useDataConnectQueryOptions<GetPublicEspacioData>): UseDataConnectQueryResult<GetPublicEspacioData, GetPublicEspacioVariables>;

export function useGetPublicEspacios(vars: GetPublicEspaciosVariables, options?: useDataConnectQueryOptions<GetPublicEspaciosData>): UseDataConnectQueryResult<GetPublicEspaciosData, GetPublicEspaciosVariables>;
export function useGetPublicEspacios(dc: DataConnect, vars: GetPublicEspaciosVariables, options?: useDataConnectQueryOptions<GetPublicEspaciosData>): UseDataConnectQueryResult<GetPublicEspaciosData, GetPublicEspaciosVariables>;

export function useListPublicWorkshopsByEspacio(vars: ListPublicWorkshopsByEspacioVariables, options?: useDataConnectQueryOptions<ListPublicWorkshopsByEspacioData>): UseDataConnectQueryResult<ListPublicWorkshopsByEspacioData, ListPublicWorkshopsByEspacioVariables>;
export function useListPublicWorkshopsByEspacio(dc: DataConnect, vars: ListPublicWorkshopsByEspacioVariables, options?: useDataConnectQueryOptions<ListPublicWorkshopsByEspacioData>): UseDataConnectQueryResult<ListPublicWorkshopsByEspacioData, ListPublicWorkshopsByEspacioVariables>;

export function useListPublicWorkshops(options?: useDataConnectQueryOptions<ListPublicWorkshopsData>): UseDataConnectQueryResult<ListPublicWorkshopsData, undefined>;
export function useListPublicWorkshops(dc: DataConnect, options?: useDataConnectQueryOptions<ListPublicWorkshopsData>): UseDataConnectQueryResult<ListPublicWorkshopsData, undefined>;
