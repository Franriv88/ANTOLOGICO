import { queryRef, executeQuery, validateArgsWithOptions, mutationRef, executeMutation, validateArgs } from 'firebase/data-connect';

export const EstadoEspacio = {
  ACTIVO: "ACTIVO",
  SUSPENDIDO: "SUSPENDIDO",
  INACTIVO: "INACTIVO",
}

export const EstadoPago = {
  PENDIENTE: "PENDIENTE",
  PAGADO: "PAGADO",
}

export const EstadoProfesional = {
  ACTIVO: "ACTIVO",
  SUSPENDIDO: "SUSPENDIDO",
  INACTIVO: "INACTIVO",
}

export const EstadoReserva = {
  PENDIENTE: "PENDIENTE",
  CONFIRMADA: "CONFIRMADA",
  CANCELADA: "CANCELADA",
}

export const EstadoWorkshop = {
  BORRADOR: "BORRADOR",
  PUBLICADO: "PUBLICADO",
  CANCELADO: "CANCELADO",
  FINALIZADO: "FINALIZADO",
}

export const HeaderType = {
  COLOR: "COLOR",
  IMAGE: "IMAGE",
}

export const MetodoPago = {
  EFECTIVO: "EFECTIVO",
  MERCADO_PAGO: "MERCADO_PAGO",
}

export const TipoWorkshop = {
  WORKSHOP: "WORKSHOP",
  TALLER: "TALLER",
  CLASE: "CLASE",
  CURSO: "CURSO",
}

export const connectorConfig = {
  connector: 'antologico',
  service: 'antologico',
  location: 'southamerica-east1'
};
export const upsertProfesionalRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpsertProfesional', inputVars);
}
upsertProfesionalRef.operationName = 'UpsertProfesional';

export function upsertProfesional(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(upsertProfesionalRef(dcInstance, inputVars));
}

export const reassignProfesionalUidRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'ReassignProfesionalUid', inputVars);
}
reassignProfesionalUidRef.operationName = 'ReassignProfesionalUid';

export function reassignProfesionalUid(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(reassignProfesionalUidRef(dcInstance, inputVars));
}

export const activarPlanRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'ActivarPlan', inputVars);
}
activarPlanRef.operationName = 'ActivarPlan';

export function activarPlan(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(activarPlanRef(dcInstance, inputVars));
}

export const agendarDowngradeRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AgendarDowngrade', inputVars);
}
agendarDowngradeRef.operationName = 'AgendarDowngrade';

export function agendarDowngrade(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(agendarDowngradeRef(dcInstance, inputVars));
}

export const cancelarDowngradeRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CancelarDowngrade', inputVars);
}
cancelarDowngradeRef.operationName = 'CancelarDowngrade';

export function cancelarDowngrade(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(cancelarDowngradeRef(dcInstance, inputVars));
}

export const updateCuponAplicadoRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateCuponAplicado', inputVars);
}
updateCuponAplicadoRef.operationName = 'UpdateCuponAplicado';

export function updateCuponAplicado(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updateCuponAplicadoRef(dcInstance, inputVars));
}

export const createEspacioRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateEspacio', inputVars);
}
createEspacioRef.operationName = 'CreateEspacio';

export function createEspacio(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createEspacioRef(dcInstance, inputVars));
}

export const updateEspacioIdentidadRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateEspacioIdentidad', inputVars);
}
updateEspacioIdentidadRef.operationName = 'UpdateEspacioIdentidad';

export function updateEspacioIdentidad(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updateEspacioIdentidadRef(dcInstance, inputVars));
}

export const updateEspacioCobrosRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateEspacioCobros', inputVars);
}
updateEspacioCobrosRef.operationName = 'UpdateEspacioCobros';

export function updateEspacioCobros(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updateEspacioCobrosRef(dcInstance, inputVars));
}

export const updateEspacioRedesRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateEspacioRedes', inputVars);
}
updateEspacioRedesRef.operationName = 'UpdateEspacioRedes';

export function updateEspacioRedes(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updateEspacioRedesRef(dcInstance, inputVars));
}

export const updateEspacioRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateEspacio', inputVars);
}
updateEspacioRef.operationName = 'UpdateEspacio';

export function updateEspacio(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updateEspacioRef(dcInstance, inputVars));
}

export const updateEspacioDireccionesRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateEspacioDirecciones', inputVars);
}
updateEspacioDireccionesRef.operationName = 'UpdateEspacioDirecciones';

export function updateEspacioDirecciones(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updateEspacioDireccionesRef(dcInstance, inputVars));
}

export const updateEspacioTyCRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateEspacioTyC', inputVars);
}
updateEspacioTyCRef.operationName = 'UpdateEspacioTyC';

export function updateEspacioTyC(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updateEspacioTyCRef(dcInstance, inputVars));
}

export const updateEspacioSlugRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateEspacioSlug', inputVars);
}
updateEspacioSlugRef.operationName = 'UpdateEspacioSlug';

export function updateEspacioSlug(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updateEspacioSlugRef(dcInstance, inputVars));
}

export const createWorkshopRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateWorkshop', inputVars);
}
createWorkshopRef.operationName = 'CreateWorkshop';

export function createWorkshop(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createWorkshopRef(dcInstance, inputVars));
}

export const updateWorkshopRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateWorkshop', inputVars);
}
updateWorkshopRef.operationName = 'UpdateWorkshop';

export function updateWorkshop(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updateWorkshopRef(dcInstance, inputVars));
}

export const updateWorkshopEstadoRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateWorkshopEstado', inputVars);
}
updateWorkshopEstadoRef.operationName = 'UpdateWorkshopEstado';

export function updateWorkshopEstado(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updateWorkshopEstadoRef(dcInstance, inputVars));
}

export const deleteWorkshopRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteWorkshop', inputVars);
}
deleteWorkshopRef.operationName = 'DeleteWorkshop';

export function deleteWorkshop(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(deleteWorkshopRef(dcInstance, inputVars));
}

export const solicitarCancelacionEspacioRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'SolicitarCancelacionEspacio', inputVars);
}
solicitarCancelacionEspacioRef.operationName = 'SolicitarCancelacionEspacio';

export function solicitarCancelacionEspacio(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(solicitarCancelacionEspacioRef(dcInstance, inputVars));
}

export const reactivarSuscripcionEspacioRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'ReactivarSuscripcionEspacio', inputVars);
}
reactivarSuscripcionEspacioRef.operationName = 'ReactivarSuscripcionEspacio';

export function reactivarSuscripcionEspacio(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(reactivarSuscripcionEspacioRef(dcInstance, inputVars));
}

export const cancelarReservaRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CancelarReserva', inputVars);
}
cancelarReservaRef.operationName = 'CancelarReserva';

export function cancelarReserva(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(cancelarReservaRef(dcInstance, inputVars));
}

export const adminUpdateEspacioRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AdminUpdateEspacio', inputVars);
}
adminUpdateEspacioRef.operationName = 'AdminUpdateEspacio';

export function adminUpdateEspacio(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(adminUpdateEspacioRef(dcInstance, inputVars));
}

export const adminDeleteEspacioRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AdminDeleteEspacio', inputVars);
}
adminDeleteEspacioRef.operationName = 'AdminDeleteEspacio';

export function adminDeleteEspacio(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(adminDeleteEspacioRef(dcInstance, inputVars));
}

export const adminDeleteProfesionalRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AdminDeleteProfesional', inputVars);
}
adminDeleteProfesionalRef.operationName = 'AdminDeleteProfesional';

export function adminDeleteProfesional(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(adminDeleteProfesionalRef(dcInstance, inputVars));
}

export const adminUpsertProfesionalRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AdminUpsertProfesional', inputVars);
}
adminUpsertProfesionalRef.operationName = 'AdminUpsertProfesional';

export function adminUpsertProfesional(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(adminUpsertProfesionalRef(dcInstance, inputVars));
}

export const adminEnsureProfesionalRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AdminEnsureProfesional', inputVars);
}
adminEnsureProfesionalRef.operationName = 'AdminEnsureProfesional';

export function adminEnsureProfesional(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(adminEnsureProfesionalRef(dcInstance, inputVars));
}

export const adminCreateEspacioMigrateRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AdminCreateEspacioMigrate', inputVars);
}
adminCreateEspacioMigrateRef.operationName = 'AdminCreateEspacioMigrate';

export function adminCreateEspacioMigrate(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(adminCreateEspacioMigrateRef(dcInstance, inputVars));
}

export const adminCreateWorkshopMigrateRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AdminCreateWorkshopMigrate', inputVars);
}
adminCreateWorkshopMigrateRef.operationName = 'AdminCreateWorkshopMigrate';

export function adminCreateWorkshopMigrate(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(adminCreateWorkshopMigrateRef(dcInstance, inputVars));
}

export const decrementarCupoRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DecrementarCupo', inputVars);
}
decrementarCupoRef.operationName = 'DecrementarCupo';

export function decrementarCupo(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(decrementarCupoRef(dcInstance, inputVars));
}

export const createReservaConUsuarioRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateReservaConUsuario', inputVars);
}
createReservaConUsuarioRef.operationName = 'CreateReservaConUsuario';

export function createReservaConUsuario(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createReservaConUsuarioRef(dcInstance, inputVars));
}

export const markReservaPaidRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'MarkReservaPaid', inputVars);
}
markReservaPaidRef.operationName = 'MarkReservaPaid';

export function markReservaPaid(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(markReservaPaidRef(dcInstance, inputVars));
}

export const markReservaUnpaidRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'MarkReservaUnpaid', inputVars);
}
markReservaUnpaidRef.operationName = 'MarkReservaUnpaid';

export function markReservaUnpaid(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(markReservaUnpaidRef(dcInstance, inputVars));
}

export const listReservasByEspacioRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListReservasByEspacio', inputVars);
}
listReservasByEspacioRef.operationName = 'ListReservasByEspacio';

export function listReservasByEspacio(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(listReservasByEspacioRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}

export const getMyProfileRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetMyProfile');
}
getMyProfileRef.operationName = 'GetMyProfile';

export function getMyProfile(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(getMyProfileRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}

export const listPlanesRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListPlanes');
}
listPlanesRef.operationName = 'ListPlanes';

export function listPlanes(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(listPlanesRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}

export const listRubrosRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListRubros');
}
listRubrosRef.operationName = 'ListRubros';

export function listRubros(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(listRubrosRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}

export const listMyEspaciosRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListMyEspacios');
}
listMyEspaciosRef.operationName = 'ListMyEspacios';

export function listMyEspacios(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(listMyEspaciosRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}

export const getMyEspacioRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetMyEspacio', inputVars);
}
getMyEspacioRef.operationName = 'GetMyEspacio';

export function getMyEspacio(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getMyEspacioRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}

export const listMyWorkshopsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListMyWorkshops', inputVars);
}
listMyWorkshopsRef.operationName = 'ListMyWorkshops';

export function listMyWorkshops(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(listMyWorkshopsRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}

export const listMyWorkshopsByEstadoRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListMyWorkshopsByEstado', inputVars);
}
listMyWorkshopsByEstadoRef.operationName = 'ListMyWorkshopsByEstado';

export function listMyWorkshopsByEstado(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(listMyWorkshopsByEstadoRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}

export const searchMyWorkshopsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'SearchMyWorkshops', inputVars);
}
searchMyWorkshopsRef.operationName = 'SearchMyWorkshops';

export function searchMyWorkshops(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(searchMyWorkshopsRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}

export const getMyWorkshopRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetMyWorkshop', inputVars);
}
getMyWorkshopRef.operationName = 'GetMyWorkshop';

export function getMyWorkshop(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getMyWorkshopRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}

export const getEspacioBySlugRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetEspacioBySlug', inputVars);
}
getEspacioBySlugRef.operationName = 'GetEspacioBySlug';

export function getEspacioBySlug(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getEspacioBySlugRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}

export const getPublicEspacioRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetPublicEspacio', inputVars);
}
getPublicEspacioRef.operationName = 'GetPublicEspacio';

export function getPublicEspacio(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getPublicEspacioRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}

export const getPublicEspaciosRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetPublicEspacios', inputVars);
}
getPublicEspaciosRef.operationName = 'GetPublicEspacios';

export function getPublicEspacios(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getPublicEspaciosRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}

export const listPublicWorkshopsByEspacioRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListPublicWorkshopsByEspacio', inputVars);
}
listPublicWorkshopsByEspacioRef.operationName = 'ListPublicWorkshopsByEspacio';

export function listPublicWorkshopsByEspacio(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(listPublicWorkshopsByEspacioRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}

export const listMyReservasRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListMyReservas');
}
listMyReservasRef.operationName = 'ListMyReservas';

export function listMyReservas(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(listMyReservasRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}

export const adminListAllEspaciosRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'AdminListAllEspacios');
}
adminListAllEspaciosRef.operationName = 'AdminListAllEspacios';

export function adminListAllEspacios(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(adminListAllEspaciosRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}

export const adminListAllWorkshopsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'AdminListAllWorkshops');
}
adminListAllWorkshopsRef.operationName = 'AdminListAllWorkshops';

export function adminListAllWorkshops(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(adminListAllWorkshopsRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}

export const adminListAllReservasRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'AdminListAllReservas');
}
adminListAllReservasRef.operationName = 'AdminListAllReservas';

export function adminListAllReservas(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(adminListAllReservasRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}

export const listPublicWorkshopsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListPublicWorkshops');
}
listPublicWorkshopsRef.operationName = 'ListPublicWorkshops';

export function listPublicWorkshops(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(listPublicWorkshopsRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}

