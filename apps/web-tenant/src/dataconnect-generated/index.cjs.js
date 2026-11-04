const { queryRef, executeQuery, validateArgsWithOptions, mutationRef, executeMutation, validateArgs } = require('firebase/data-connect');

const EstadoEspacio = {
  ACTIVO: "ACTIVO",
  SUSPENDIDO: "SUSPENDIDO",
  INACTIVO: "INACTIVO",
}
exports.EstadoEspacio = EstadoEspacio;

const EstadoPago = {
  PENDIENTE: "PENDIENTE",
  PAGADO: "PAGADO",
}
exports.EstadoPago = EstadoPago;

const EstadoProfesional = {
  ACTIVO: "ACTIVO",
  SUSPENDIDO: "SUSPENDIDO",
  INACTIVO: "INACTIVO",
}
exports.EstadoProfesional = EstadoProfesional;

const EstadoReserva = {
  PENDIENTE: "PENDIENTE",
  CONFIRMADA: "CONFIRMADA",
  CANCELADA: "CANCELADA",
}
exports.EstadoReserva = EstadoReserva;

const EstadoWorkshop = {
  BORRADOR: "BORRADOR",
  PUBLICADO: "PUBLICADO",
  CANCELADO: "CANCELADO",
  FINALIZADO: "FINALIZADO",
}
exports.EstadoWorkshop = EstadoWorkshop;

const HeaderType = {
  COLOR: "COLOR",
  IMAGE: "IMAGE",
}
exports.HeaderType = HeaderType;

const MetodoPago = {
  EFECTIVO: "EFECTIVO",
  MERCADO_PAGO: "MERCADO_PAGO",
}
exports.MetodoPago = MetodoPago;

const TipoWorkshop = {
  WORKSHOP: "WORKSHOP",
  TALLER: "TALLER",
  CLASE: "CLASE",
  CURSO: "CURSO",
}
exports.TipoWorkshop = TipoWorkshop;

const connectorConfig = {
  connector: 'antologico',
  service: 'antologico',
  location: 'southamerica-east1'
};
exports.connectorConfig = connectorConfig;

const upsertProfesionalRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpsertProfesional', inputVars);
}
upsertProfesionalRef.operationName = 'UpsertProfesional';
exports.upsertProfesionalRef = upsertProfesionalRef;

exports.upsertProfesional = function upsertProfesional(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(upsertProfesionalRef(dcInstance, inputVars));
}
;

const reassignProfesionalUidRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'ReassignProfesionalUid', inputVars);
}
reassignProfesionalUidRef.operationName = 'ReassignProfesionalUid';
exports.reassignProfesionalUidRef = reassignProfesionalUidRef;

exports.reassignProfesionalUid = function reassignProfesionalUid(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(reassignProfesionalUidRef(dcInstance, inputVars));
}
;

const activarPlanRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'ActivarPlan', inputVars);
}
activarPlanRef.operationName = 'ActivarPlan';
exports.activarPlanRef = activarPlanRef;

exports.activarPlan = function activarPlan(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(activarPlanRef(dcInstance, inputVars));
}
;

const agendarDowngradeRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AgendarDowngrade', inputVars);
}
agendarDowngradeRef.operationName = 'AgendarDowngrade';
exports.agendarDowngradeRef = agendarDowngradeRef;

exports.agendarDowngrade = function agendarDowngrade(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(agendarDowngradeRef(dcInstance, inputVars));
}
;

const cancelarDowngradeRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CancelarDowngrade', inputVars);
}
cancelarDowngradeRef.operationName = 'CancelarDowngrade';
exports.cancelarDowngradeRef = cancelarDowngradeRef;

exports.cancelarDowngrade = function cancelarDowngrade(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(cancelarDowngradeRef(dcInstance, inputVars));
}
;

const updateCuponAplicadoRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateCuponAplicado', inputVars);
}
updateCuponAplicadoRef.operationName = 'UpdateCuponAplicado';
exports.updateCuponAplicadoRef = updateCuponAplicadoRef;

exports.updateCuponAplicado = function updateCuponAplicado(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updateCuponAplicadoRef(dcInstance, inputVars));
}
;

const createEspacioRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateEspacio', inputVars);
}
createEspacioRef.operationName = 'CreateEspacio';
exports.createEspacioRef = createEspacioRef;

exports.createEspacio = function createEspacio(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createEspacioRef(dcInstance, inputVars));
}
;

const updateEspacioIdentidadRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateEspacioIdentidad', inputVars);
}
updateEspacioIdentidadRef.operationName = 'UpdateEspacioIdentidad';
exports.updateEspacioIdentidadRef = updateEspacioIdentidadRef;

exports.updateEspacioIdentidad = function updateEspacioIdentidad(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updateEspacioIdentidadRef(dcInstance, inputVars));
}
;

const updateEspacioCobrosRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateEspacioCobros', inputVars);
}
updateEspacioCobrosRef.operationName = 'UpdateEspacioCobros';
exports.updateEspacioCobrosRef = updateEspacioCobrosRef;

exports.updateEspacioCobros = function updateEspacioCobros(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updateEspacioCobrosRef(dcInstance, inputVars));
}
;

const updateEspacioRedesRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateEspacioRedes', inputVars);
}
updateEspacioRedesRef.operationName = 'UpdateEspacioRedes';
exports.updateEspacioRedesRef = updateEspacioRedesRef;

exports.updateEspacioRedes = function updateEspacioRedes(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updateEspacioRedesRef(dcInstance, inputVars));
}
;

const updateEspacioRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateEspacio', inputVars);
}
updateEspacioRef.operationName = 'UpdateEspacio';
exports.updateEspacioRef = updateEspacioRef;

exports.updateEspacio = function updateEspacio(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updateEspacioRef(dcInstance, inputVars));
}
;

const updateEspacioDireccionesRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateEspacioDirecciones', inputVars);
}
updateEspacioDireccionesRef.operationName = 'UpdateEspacioDirecciones';
exports.updateEspacioDireccionesRef = updateEspacioDireccionesRef;

exports.updateEspacioDirecciones = function updateEspacioDirecciones(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updateEspacioDireccionesRef(dcInstance, inputVars));
}
;

const updateEspacioTyCRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateEspacioTyC', inputVars);
}
updateEspacioTyCRef.operationName = 'UpdateEspacioTyC';
exports.updateEspacioTyCRef = updateEspacioTyCRef;

exports.updateEspacioTyC = function updateEspacioTyC(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updateEspacioTyCRef(dcInstance, inputVars));
}
;

const updateEspacioSlugRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateEspacioSlug', inputVars);
}
updateEspacioSlugRef.operationName = 'UpdateEspacioSlug';
exports.updateEspacioSlugRef = updateEspacioSlugRef;

exports.updateEspacioSlug = function updateEspacioSlug(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updateEspacioSlugRef(dcInstance, inputVars));
}
;

const createWorkshopRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateWorkshop', inputVars);
}
createWorkshopRef.operationName = 'CreateWorkshop';
exports.createWorkshopRef = createWorkshopRef;

exports.createWorkshop = function createWorkshop(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createWorkshopRef(dcInstance, inputVars));
}
;

const updateWorkshopRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateWorkshop', inputVars);
}
updateWorkshopRef.operationName = 'UpdateWorkshop';
exports.updateWorkshopRef = updateWorkshopRef;

exports.updateWorkshop = function updateWorkshop(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updateWorkshopRef(dcInstance, inputVars));
}
;

const updateWorkshopEstadoRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateWorkshopEstado', inputVars);
}
updateWorkshopEstadoRef.operationName = 'UpdateWorkshopEstado';
exports.updateWorkshopEstadoRef = updateWorkshopEstadoRef;

exports.updateWorkshopEstado = function updateWorkshopEstado(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updateWorkshopEstadoRef(dcInstance, inputVars));
}
;

const deleteWorkshopRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteWorkshop', inputVars);
}
deleteWorkshopRef.operationName = 'DeleteWorkshop';
exports.deleteWorkshopRef = deleteWorkshopRef;

exports.deleteWorkshop = function deleteWorkshop(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(deleteWorkshopRef(dcInstance, inputVars));
}
;

const solicitarCancelacionEspacioRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'SolicitarCancelacionEspacio', inputVars);
}
solicitarCancelacionEspacioRef.operationName = 'SolicitarCancelacionEspacio';
exports.solicitarCancelacionEspacioRef = solicitarCancelacionEspacioRef;

exports.solicitarCancelacionEspacio = function solicitarCancelacionEspacio(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(solicitarCancelacionEspacioRef(dcInstance, inputVars));
}
;

const reactivarSuscripcionEspacioRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'ReactivarSuscripcionEspacio', inputVars);
}
reactivarSuscripcionEspacioRef.operationName = 'ReactivarSuscripcionEspacio';
exports.reactivarSuscripcionEspacioRef = reactivarSuscripcionEspacioRef;

exports.reactivarSuscripcionEspacio = function reactivarSuscripcionEspacio(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(reactivarSuscripcionEspacioRef(dcInstance, inputVars));
}
;

const cancelarReservaRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CancelarReserva', inputVars);
}
cancelarReservaRef.operationName = 'CancelarReserva';
exports.cancelarReservaRef = cancelarReservaRef;

exports.cancelarReserva = function cancelarReserva(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(cancelarReservaRef(dcInstance, inputVars));
}
;

const cancelarWorkshopConReservasRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CancelarWorkshopConReservas', inputVars);
}
cancelarWorkshopConReservasRef.operationName = 'CancelarWorkshopConReservas';
exports.cancelarWorkshopConReservasRef = cancelarWorkshopConReservasRef;

exports.cancelarWorkshopConReservas = function cancelarWorkshopConReservas(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(cancelarWorkshopConReservasRef(dcInstance, inputVars));
}
;

const adminUpdateEspacioRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AdminUpdateEspacio', inputVars);
}
adminUpdateEspacioRef.operationName = 'AdminUpdateEspacio';
exports.adminUpdateEspacioRef = adminUpdateEspacioRef;

exports.adminUpdateEspacio = function adminUpdateEspacio(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(adminUpdateEspacioRef(dcInstance, inputVars));
}
;

const adminDeleteEspacioRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AdminDeleteEspacio', inputVars);
}
adminDeleteEspacioRef.operationName = 'AdminDeleteEspacio';
exports.adminDeleteEspacioRef = adminDeleteEspacioRef;

exports.adminDeleteEspacio = function adminDeleteEspacio(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(adminDeleteEspacioRef(dcInstance, inputVars));
}
;

const adminDeleteProfesionalRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AdminDeleteProfesional', inputVars);
}
adminDeleteProfesionalRef.operationName = 'AdminDeleteProfesional';
exports.adminDeleteProfesionalRef = adminDeleteProfesionalRef;

exports.adminDeleteProfesional = function adminDeleteProfesional(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(adminDeleteProfesionalRef(dcInstance, inputVars));
}
;

const adminUpsertProfesionalRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AdminUpsertProfesional', inputVars);
}
adminUpsertProfesionalRef.operationName = 'AdminUpsertProfesional';
exports.adminUpsertProfesionalRef = adminUpsertProfesionalRef;

exports.adminUpsertProfesional = function adminUpsertProfesional(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(adminUpsertProfesionalRef(dcInstance, inputVars));
}
;

const adminEnsureProfesionalRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AdminEnsureProfesional', inputVars);
}
adminEnsureProfesionalRef.operationName = 'AdminEnsureProfesional';
exports.adminEnsureProfesionalRef = adminEnsureProfesionalRef;

exports.adminEnsureProfesional = function adminEnsureProfesional(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(adminEnsureProfesionalRef(dcInstance, inputVars));
}
;

const adminCreateEspacioMigrateRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AdminCreateEspacioMigrate', inputVars);
}
adminCreateEspacioMigrateRef.operationName = 'AdminCreateEspacioMigrate';
exports.adminCreateEspacioMigrateRef = adminCreateEspacioMigrateRef;

exports.adminCreateEspacioMigrate = function adminCreateEspacioMigrate(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(adminCreateEspacioMigrateRef(dcInstance, inputVars));
}
;

const adminCreateWorkshopMigrateRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AdminCreateWorkshopMigrate', inputVars);
}
adminCreateWorkshopMigrateRef.operationName = 'AdminCreateWorkshopMigrate';
exports.adminCreateWorkshopMigrateRef = adminCreateWorkshopMigrateRef;

exports.adminCreateWorkshopMigrate = function adminCreateWorkshopMigrate(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(adminCreateWorkshopMigrateRef(dcInstance, inputVars));
}
;

const decrementarCupoRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DecrementarCupo', inputVars);
}
decrementarCupoRef.operationName = 'DecrementarCupo';
exports.decrementarCupoRef = decrementarCupoRef;

exports.decrementarCupo = function decrementarCupo(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(decrementarCupoRef(dcInstance, inputVars));
}
;

const createReservaConUsuarioRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateReservaConUsuario', inputVars);
}
createReservaConUsuarioRef.operationName = 'CreateReservaConUsuario';
exports.createReservaConUsuarioRef = createReservaConUsuarioRef;

exports.createReservaConUsuario = function createReservaConUsuario(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createReservaConUsuarioRef(dcInstance, inputVars));
}
;

const markReservaPaidRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'MarkReservaPaid', inputVars);
}
markReservaPaidRef.operationName = 'MarkReservaPaid';
exports.markReservaPaidRef = markReservaPaidRef;

exports.markReservaPaid = function markReservaPaid(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(markReservaPaidRef(dcInstance, inputVars));
}
;

const markReservaUnpaidRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'MarkReservaUnpaid', inputVars);
}
markReservaUnpaidRef.operationName = 'MarkReservaUnpaid';
exports.markReservaUnpaidRef = markReservaUnpaidRef;

exports.markReservaUnpaid = function markReservaUnpaid(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(markReservaUnpaidRef(dcInstance, inputVars));
}
;

const listReservasByEspacioRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListReservasByEspacio', inputVars);
}
listReservasByEspacioRef.operationName = 'ListReservasByEspacio';
exports.listReservasByEspacioRef = listReservasByEspacioRef;

exports.listReservasByEspacio = function listReservasByEspacio(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(listReservasByEspacioRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const getMyProfileRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetMyProfile');
}
getMyProfileRef.operationName = 'GetMyProfile';
exports.getMyProfileRef = getMyProfileRef;

exports.getMyProfile = function getMyProfile(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(getMyProfileRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const listPlanesRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListPlanes');
}
listPlanesRef.operationName = 'ListPlanes';
exports.listPlanesRef = listPlanesRef;

exports.listPlanes = function listPlanes(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(listPlanesRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const listRubrosRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListRubros');
}
listRubrosRef.operationName = 'ListRubros';
exports.listRubrosRef = listRubrosRef;

exports.listRubros = function listRubros(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(listRubrosRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const listMyEspaciosRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListMyEspacios');
}
listMyEspaciosRef.operationName = 'ListMyEspacios';
exports.listMyEspaciosRef = listMyEspaciosRef;

exports.listMyEspacios = function listMyEspacios(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(listMyEspaciosRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const getMyEspacioRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetMyEspacio', inputVars);
}
getMyEspacioRef.operationName = 'GetMyEspacio';
exports.getMyEspacioRef = getMyEspacioRef;

exports.getMyEspacio = function getMyEspacio(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getMyEspacioRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const listMyWorkshopsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListMyWorkshops', inputVars);
}
listMyWorkshopsRef.operationName = 'ListMyWorkshops';
exports.listMyWorkshopsRef = listMyWorkshopsRef;

exports.listMyWorkshops = function listMyWorkshops(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(listMyWorkshopsRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const listMyWorkshopsByEstadoRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListMyWorkshopsByEstado', inputVars);
}
listMyWorkshopsByEstadoRef.operationName = 'ListMyWorkshopsByEstado';
exports.listMyWorkshopsByEstadoRef = listMyWorkshopsByEstadoRef;

exports.listMyWorkshopsByEstado = function listMyWorkshopsByEstado(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(listMyWorkshopsByEstadoRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const searchMyWorkshopsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'SearchMyWorkshops', inputVars);
}
searchMyWorkshopsRef.operationName = 'SearchMyWorkshops';
exports.searchMyWorkshopsRef = searchMyWorkshopsRef;

exports.searchMyWorkshops = function searchMyWorkshops(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(searchMyWorkshopsRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const getMyWorkshopRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetMyWorkshop', inputVars);
}
getMyWorkshopRef.operationName = 'GetMyWorkshop';
exports.getMyWorkshopRef = getMyWorkshopRef;

exports.getMyWorkshop = function getMyWorkshop(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getMyWorkshopRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const getEspacioBySlugRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetEspacioBySlug', inputVars);
}
getEspacioBySlugRef.operationName = 'GetEspacioBySlug';
exports.getEspacioBySlugRef = getEspacioBySlugRef;

exports.getEspacioBySlug = function getEspacioBySlug(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getEspacioBySlugRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const getPublicEspacioRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetPublicEspacio', inputVars);
}
getPublicEspacioRef.operationName = 'GetPublicEspacio';
exports.getPublicEspacioRef = getPublicEspacioRef;

exports.getPublicEspacio = function getPublicEspacio(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getPublicEspacioRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const getPublicEspaciosRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetPublicEspacios', inputVars);
}
getPublicEspaciosRef.operationName = 'GetPublicEspacios';
exports.getPublicEspaciosRef = getPublicEspaciosRef;

exports.getPublicEspacios = function getPublicEspacios(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getPublicEspaciosRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const listPublicWorkshopsByEspacioRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListPublicWorkshopsByEspacio', inputVars);
}
listPublicWorkshopsByEspacioRef.operationName = 'ListPublicWorkshopsByEspacio';
exports.listPublicWorkshopsByEspacioRef = listPublicWorkshopsByEspacioRef;

exports.listPublicWorkshopsByEspacio = function listPublicWorkshopsByEspacio(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(listPublicWorkshopsByEspacioRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const listMyReservasRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListMyReservas');
}
listMyReservasRef.operationName = 'ListMyReservas';
exports.listMyReservasRef = listMyReservasRef;

exports.listMyReservas = function listMyReservas(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(listMyReservasRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const listReservasByWorkshopRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListReservasByWorkshop', inputVars);
}
listReservasByWorkshopRef.operationName = 'ListReservasByWorkshop';
exports.listReservasByWorkshopRef = listReservasByWorkshopRef;

exports.listReservasByWorkshop = function listReservasByWorkshop(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(listReservasByWorkshopRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const adminListAllEspaciosRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'AdminListAllEspacios');
}
adminListAllEspaciosRef.operationName = 'AdminListAllEspacios';
exports.adminListAllEspaciosRef = adminListAllEspaciosRef;

exports.adminListAllEspacios = function adminListAllEspacios(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(adminListAllEspaciosRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const adminListAllWorkshopsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'AdminListAllWorkshops');
}
adminListAllWorkshopsRef.operationName = 'AdminListAllWorkshops';
exports.adminListAllWorkshopsRef = adminListAllWorkshopsRef;

exports.adminListAllWorkshops = function adminListAllWorkshops(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(adminListAllWorkshopsRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const adminListAllReservasRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'AdminListAllReservas');
}
adminListAllReservasRef.operationName = 'AdminListAllReservas';
exports.adminListAllReservasRef = adminListAllReservasRef;

exports.adminListAllReservas = function adminListAllReservas(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(adminListAllReservasRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const listPublicWorkshopsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListPublicWorkshops');
}
listPublicWorkshopsRef.operationName = 'ListPublicWorkshops';
exports.listPublicWorkshopsRef = listPublicWorkshopsRef;

exports.listPublicWorkshops = function listPublicWorkshops(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(listPublicWorkshopsRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;
