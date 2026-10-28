const { queryRef, executeQuery, validateArgsWithOptions, mutationRef, executeMutation, validateArgs } = require('firebase/data-connect');

const EstadoEspacio = {
  ACTIVO: "ACTIVO",
  SUSPENDIDO: "SUSPENDIDO",
  INACTIVO: "INACTIVO",
}
exports.EstadoEspacio = EstadoEspacio;

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

const updateEspacioPlanIdRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateEspacioPlanId', inputVars);
}
updateEspacioPlanIdRef.operationName = 'UpdateEspacioPlanId';
exports.updateEspacioPlanIdRef = updateEspacioPlanIdRef;

exports.updateEspacioPlanId = function updateEspacioPlanId(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updateEspacioPlanIdRef(dcInstance, inputVars));
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
