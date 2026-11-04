# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `antologico`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

# Table of Contents
- [**Overview**](#generated-javascript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*ListReservasByEspacio*](#listreservasbyespacio)
  - [*GetMyProfile*](#getmyprofile)
  - [*ListPlanes*](#listplanes)
  - [*ListRubros*](#listrubros)
  - [*ListMyEspacios*](#listmyespacios)
  - [*GetMyEspacio*](#getmyespacio)
  - [*ListMyWorkshops*](#listmyworkshops)
  - [*ListMyWorkshopsByEstado*](#listmyworkshopsbyestado)
  - [*SearchMyWorkshops*](#searchmyworkshops)
  - [*GetMyWorkshop*](#getmyworkshop)
  - [*GetEspacioBySlug*](#getespaciobyslug)
  - [*GetPublicEspacio*](#getpublicespacio)
  - [*GetPublicEspacios*](#getpublicespacios)
  - [*ListPublicWorkshopsByEspacio*](#listpublicworkshopsbyespacio)
  - [*ListMyReservas*](#listmyreservas)
  - [*ListReservasByWorkshop*](#listreservasbyworkshop)
  - [*AdminListAllEspacios*](#adminlistallespacios)
  - [*AdminListAllWorkshops*](#adminlistallworkshops)
  - [*AdminListAllReservas*](#adminlistallreservas)
  - [*ListPublicWorkshops*](#listpublicworkshops)
- [**Mutations**](#mutations)
  - [*UpsertProfesional*](#upsertprofesional)
  - [*ReassignProfesionalUid*](#reassignprofesionaluid)
  - [*ActivarPlan*](#activarplan)
  - [*AgendarDowngrade*](#agendardowngrade)
  - [*CancelarDowngrade*](#cancelardowngrade)
  - [*UpdateCuponAplicado*](#updatecuponaplicado)
  - [*CreateEspacio*](#createespacio)
  - [*UpdateEspacioIdentidad*](#updateespacioidentidad)
  - [*UpdateEspacioCobros*](#updateespaciocobros)
  - [*UpdateEspacioRedes*](#updateespacioredes)
  - [*UpdateEspacio*](#updateespacio)
  - [*UpdateEspacioDirecciones*](#updateespaciodirecciones)
  - [*UpdateEspacioTyC*](#updateespaciotyc)
  - [*UpdateEspacioSlug*](#updateespacioslug)
  - [*CreateWorkshop*](#createworkshop)
  - [*UpdateWorkshop*](#updateworkshop)
  - [*UpdateWorkshopEstado*](#updateworkshopestado)
  - [*DeleteWorkshop*](#deleteworkshop)
  - [*SolicitarCancelacionEspacio*](#solicitarcancelacionespacio)
  - [*ReactivarSuscripcionEspacio*](#reactivarsuscripcionespacio)
  - [*CancelarReserva*](#cancelarreserva)
  - [*CancelarWorkshopConReservas*](#cancelarworkshopconreservas)
  - [*AdminUpdateEspacio*](#adminupdateespacio)
  - [*AdminDeleteEspacio*](#admindeleteespacio)
  - [*AdminDeleteProfesional*](#admindeleteprofesional)
  - [*AdminUpsertProfesional*](#adminupsertprofesional)
  - [*AdminEnsureProfesional*](#adminensureprofesional)
  - [*AdminCreateEspacioMigrate*](#admincreateespaciomigrate)
  - [*AdminCreateWorkshopMigrate*](#admincreateworkshopmigrate)
  - [*DecrementarCupo*](#decrementarcupo)
  - [*CreateReservaConUsuario*](#createreservaconusuario)
  - [*MarkReservaPaid*](#markreservapaid)
  - [*MarkReservaUnpaid*](#markreservaunpaid)

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `antologico`. You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

You can use this generated SDK by importing from the package `@antologico/dataconnect` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@antologico/dataconnect';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```typescript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@antologico/dataconnect';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) from your generated SDK.

# Queries

There are two ways to execute a Data Connect Query using the generated Web SDK:
- Using a Query Reference function, which returns a `QueryRef`
  - The `QueryRef` can be used as an argument to `executeQuery()`, which will execute the Query and return a `QueryPromise`
- Using an action shortcut function, which returns a `QueryPromise`
  - Calling the action shortcut function will execute the Query and return a `QueryPromise`

The following is true for both the action shortcut function and the `QueryRef` function:
- The `QueryPromise` returned will resolve to the result of the Query once it has finished executing
- If the Query accepts arguments, both the action shortcut function and the `QueryRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Query
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `antologico` connector's generated functions to execute each query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-queries).

## ListReservasByEspacio
You can execute the `ListReservasByEspacio` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listReservasByEspacio(vars: ListReservasByEspacioVariables, options?: ExecuteQueryOptions): QueryPromise<ListReservasByEspacioData, ListReservasByEspacioVariables>;

interface ListReservasByEspacioRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListReservasByEspacioVariables): QueryRef<ListReservasByEspacioData, ListReservasByEspacioVariables>;
}
export const listReservasByEspacioRef: ListReservasByEspacioRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listReservasByEspacio(dc: DataConnect, vars: ListReservasByEspacioVariables, options?: ExecuteQueryOptions): QueryPromise<ListReservasByEspacioData, ListReservasByEspacioVariables>;

interface ListReservasByEspacioRef {
  ...
  (dc: DataConnect, vars: ListReservasByEspacioVariables): QueryRef<ListReservasByEspacioData, ListReservasByEspacioVariables>;
}
export const listReservasByEspacioRef: ListReservasByEspacioRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listReservasByEspacioRef:
```typescript
const name = listReservasByEspacioRef.operationName;
console.log(name);
```

### Variables
The `ListReservasByEspacio` query requires an argument of type `ListReservasByEspacioVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListReservasByEspacioVariables {
  espacioId: UUIDString;
}
```
### Return Type
Recall that executing the `ListReservasByEspacio` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListReservasByEspacioData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `ListReservasByEspacio`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listReservasByEspacio, ListReservasByEspacioVariables } from '@antologico/dataconnect';

// The `ListReservasByEspacio` query requires an argument of type `ListReservasByEspacioVariables`:
const listReservasByEspacioVars: ListReservasByEspacioVariables = {
  espacioId: ..., 
};

// Call the `listReservasByEspacio()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listReservasByEspacio(listReservasByEspacioVars);
// Variables can be defined inline as well.
const { data } = await listReservasByEspacio({ espacioId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listReservasByEspacio(dataConnect, listReservasByEspacioVars);

console.log(data.reservas);

// Or, you can use the `Promise` API.
listReservasByEspacio(listReservasByEspacioVars).then((response) => {
  const data = response.data;
  console.log(data.reservas);
});
```

### Using `ListReservasByEspacio`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listReservasByEspacioRef, ListReservasByEspacioVariables } from '@antologico/dataconnect';

// The `ListReservasByEspacio` query requires an argument of type `ListReservasByEspacioVariables`:
const listReservasByEspacioVars: ListReservasByEspacioVariables = {
  espacioId: ..., 
};

// Call the `listReservasByEspacioRef()` function to get a reference to the query.
const ref = listReservasByEspacioRef(listReservasByEspacioVars);
// Variables can be defined inline as well.
const ref = listReservasByEspacioRef({ espacioId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listReservasByEspacioRef(dataConnect, listReservasByEspacioVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.reservas);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.reservas);
});
```

## GetMyProfile
You can execute the `GetMyProfile` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getMyProfile(options?: ExecuteQueryOptions): QueryPromise<GetMyProfileData, undefined>;

interface GetMyProfileRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetMyProfileData, undefined>;
}
export const getMyProfileRef: GetMyProfileRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getMyProfile(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<GetMyProfileData, undefined>;

interface GetMyProfileRef {
  ...
  (dc: DataConnect): QueryRef<GetMyProfileData, undefined>;
}
export const getMyProfileRef: GetMyProfileRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getMyProfileRef:
```typescript
const name = getMyProfileRef.operationName;
console.log(name);
```

### Variables
The `GetMyProfile` query has no variables.
### Return Type
Recall that executing the `GetMyProfile` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetMyProfileData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetMyProfileData {
  profesionales: ({
    uid: string;
    nombre: string;
    email: string;
    estado: EstadoProfesional;
    updatedAt: TimestampString;
  } & Profesional_Key)[];
}
```
### Using `GetMyProfile`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getMyProfile } from '@antologico/dataconnect';


// Call the `getMyProfile()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getMyProfile();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getMyProfile(dataConnect);

console.log(data.profesionales);

// Or, you can use the `Promise` API.
getMyProfile().then((response) => {
  const data = response.data;
  console.log(data.profesionales);
});
```

### Using `GetMyProfile`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getMyProfileRef } from '@antologico/dataconnect';


// Call the `getMyProfileRef()` function to get a reference to the query.
const ref = getMyProfileRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getMyProfileRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.profesionales);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.profesionales);
});
```

## ListPlanes
You can execute the `ListPlanes` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listPlanes(options?: ExecuteQueryOptions): QueryPromise<ListPlanesData, undefined>;

interface ListPlanesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListPlanesData, undefined>;
}
export const listPlanesRef: ListPlanesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listPlanes(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListPlanesData, undefined>;

interface ListPlanesRef {
  ...
  (dc: DataConnect): QueryRef<ListPlanesData, undefined>;
}
export const listPlanesRef: ListPlanesRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listPlanesRef:
```typescript
const name = listPlanesRef.operationName;
console.log(name);
```

### Variables
The `ListPlanes` query has no variables.
### Return Type
Recall that executing the `ListPlanes` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListPlanesData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListPlanesData {
  planes: ({
    id: UUIDString;
    nombre: string;
    precioMensual: number;
    precioAnual: number;
    features: unknown;
  } & Plan_Key)[];
}
```
### Using `ListPlanes`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listPlanes } from '@antologico/dataconnect';


// Call the `listPlanes()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listPlanes();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listPlanes(dataConnect);

console.log(data.planes);

// Or, you can use the `Promise` API.
listPlanes().then((response) => {
  const data = response.data;
  console.log(data.planes);
});
```

### Using `ListPlanes`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listPlanesRef } from '@antologico/dataconnect';


// Call the `listPlanesRef()` function to get a reference to the query.
const ref = listPlanesRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listPlanesRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.planes);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.planes);
});
```

## ListRubros
You can execute the `ListRubros` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listRubros(options?: ExecuteQueryOptions): QueryPromise<ListRubrosData, undefined>;

interface ListRubrosRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListRubrosData, undefined>;
}
export const listRubrosRef: ListRubrosRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listRubros(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListRubrosData, undefined>;

interface ListRubrosRef {
  ...
  (dc: DataConnect): QueryRef<ListRubrosData, undefined>;
}
export const listRubrosRef: ListRubrosRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listRubrosRef:
```typescript
const name = listRubrosRef.operationName;
console.log(name);
```

### Variables
The `ListRubros` query has no variables.
### Return Type
Recall that executing the `ListRubros` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListRubrosData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListRubrosData {
  rubros: ({
    id: UUIDString;
    nombre: string;
  } & Rubro_Key)[];
}
```
### Using `ListRubros`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listRubros } from '@antologico/dataconnect';


// Call the `listRubros()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listRubros();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listRubros(dataConnect);

console.log(data.rubros);

// Or, you can use the `Promise` API.
listRubros().then((response) => {
  const data = response.data;
  console.log(data.rubros);
});
```

### Using `ListRubros`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listRubrosRef } from '@antologico/dataconnect';


// Call the `listRubrosRef()` function to get a reference to the query.
const ref = listRubrosRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listRubrosRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.rubros);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.rubros);
});
```

## ListMyEspacios
You can execute the `ListMyEspacios` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listMyEspacios(options?: ExecuteQueryOptions): QueryPromise<ListMyEspaciosData, undefined>;

interface ListMyEspaciosRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListMyEspaciosData, undefined>;
}
export const listMyEspaciosRef: ListMyEspaciosRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listMyEspacios(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListMyEspaciosData, undefined>;

interface ListMyEspaciosRef {
  ...
  (dc: DataConnect): QueryRef<ListMyEspaciosData, undefined>;
}
export const listMyEspaciosRef: ListMyEspaciosRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listMyEspaciosRef:
```typescript
const name = listMyEspaciosRef.operationName;
console.log(name);
```

### Variables
The `ListMyEspacios` query has no variables.
### Return Type
Recall that executing the `ListMyEspacios` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListMyEspaciosData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `ListMyEspacios`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listMyEspacios } from '@antologico/dataconnect';


// Call the `listMyEspacios()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listMyEspacios();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listMyEspacios(dataConnect);

console.log(data.espacios);

// Or, you can use the `Promise` API.
listMyEspacios().then((response) => {
  const data = response.data;
  console.log(data.espacios);
});
```

### Using `ListMyEspacios`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listMyEspaciosRef } from '@antologico/dataconnect';


// Call the `listMyEspaciosRef()` function to get a reference to the query.
const ref = listMyEspaciosRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listMyEspaciosRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.espacios);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.espacios);
});
```

## GetMyEspacio
You can execute the `GetMyEspacio` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getMyEspacio(vars: GetMyEspacioVariables, options?: ExecuteQueryOptions): QueryPromise<GetMyEspacioData, GetMyEspacioVariables>;

interface GetMyEspacioRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetMyEspacioVariables): QueryRef<GetMyEspacioData, GetMyEspacioVariables>;
}
export const getMyEspacioRef: GetMyEspacioRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getMyEspacio(dc: DataConnect, vars: GetMyEspacioVariables, options?: ExecuteQueryOptions): QueryPromise<GetMyEspacioData, GetMyEspacioVariables>;

interface GetMyEspacioRef {
  ...
  (dc: DataConnect, vars: GetMyEspacioVariables): QueryRef<GetMyEspacioData, GetMyEspacioVariables>;
}
export const getMyEspacioRef: GetMyEspacioRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getMyEspacioRef:
```typescript
const name = getMyEspacioRef.operationName;
console.log(name);
```

### Variables
The `GetMyEspacio` query requires an argument of type `GetMyEspacioVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetMyEspacioVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `GetMyEspacio` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetMyEspacioData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `GetMyEspacio`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getMyEspacio, GetMyEspacioVariables } from '@antologico/dataconnect';

// The `GetMyEspacio` query requires an argument of type `GetMyEspacioVariables`:
const getMyEspacioVars: GetMyEspacioVariables = {
  id: ..., 
};

// Call the `getMyEspacio()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getMyEspacio(getMyEspacioVars);
// Variables can be defined inline as well.
const { data } = await getMyEspacio({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getMyEspacio(dataConnect, getMyEspacioVars);

console.log(data.espacios);

// Or, you can use the `Promise` API.
getMyEspacio(getMyEspacioVars).then((response) => {
  const data = response.data;
  console.log(data.espacios);
});
```

### Using `GetMyEspacio`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getMyEspacioRef, GetMyEspacioVariables } from '@antologico/dataconnect';

// The `GetMyEspacio` query requires an argument of type `GetMyEspacioVariables`:
const getMyEspacioVars: GetMyEspacioVariables = {
  id: ..., 
};

// Call the `getMyEspacioRef()` function to get a reference to the query.
const ref = getMyEspacioRef(getMyEspacioVars);
// Variables can be defined inline as well.
const ref = getMyEspacioRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getMyEspacioRef(dataConnect, getMyEspacioVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.espacios);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.espacios);
});
```

## ListMyWorkshops
You can execute the `ListMyWorkshops` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listMyWorkshops(vars: ListMyWorkshopsVariables, options?: ExecuteQueryOptions): QueryPromise<ListMyWorkshopsData, ListMyWorkshopsVariables>;

interface ListMyWorkshopsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListMyWorkshopsVariables): QueryRef<ListMyWorkshopsData, ListMyWorkshopsVariables>;
}
export const listMyWorkshopsRef: ListMyWorkshopsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listMyWorkshops(dc: DataConnect, vars: ListMyWorkshopsVariables, options?: ExecuteQueryOptions): QueryPromise<ListMyWorkshopsData, ListMyWorkshopsVariables>;

interface ListMyWorkshopsRef {
  ...
  (dc: DataConnect, vars: ListMyWorkshopsVariables): QueryRef<ListMyWorkshopsData, ListMyWorkshopsVariables>;
}
export const listMyWorkshopsRef: ListMyWorkshopsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listMyWorkshopsRef:
```typescript
const name = listMyWorkshopsRef.operationName;
console.log(name);
```

### Variables
The `ListMyWorkshops` query requires an argument of type `ListMyWorkshopsVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListMyWorkshopsVariables {
  espacioId: UUIDString;
}
```
### Return Type
Recall that executing the `ListMyWorkshops` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListMyWorkshopsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
    esBorrador: boolean;
    createdAt: TimestampString;
  } & Workshop_Key)[];
}
```
### Using `ListMyWorkshops`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listMyWorkshops, ListMyWorkshopsVariables } from '@antologico/dataconnect';

// The `ListMyWorkshops` query requires an argument of type `ListMyWorkshopsVariables`:
const listMyWorkshopsVars: ListMyWorkshopsVariables = {
  espacioId: ..., 
};

// Call the `listMyWorkshops()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listMyWorkshops(listMyWorkshopsVars);
// Variables can be defined inline as well.
const { data } = await listMyWorkshops({ espacioId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listMyWorkshops(dataConnect, listMyWorkshopsVars);

console.log(data.workshops);

// Or, you can use the `Promise` API.
listMyWorkshops(listMyWorkshopsVars).then((response) => {
  const data = response.data;
  console.log(data.workshops);
});
```

### Using `ListMyWorkshops`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listMyWorkshopsRef, ListMyWorkshopsVariables } from '@antologico/dataconnect';

// The `ListMyWorkshops` query requires an argument of type `ListMyWorkshopsVariables`:
const listMyWorkshopsVars: ListMyWorkshopsVariables = {
  espacioId: ..., 
};

// Call the `listMyWorkshopsRef()` function to get a reference to the query.
const ref = listMyWorkshopsRef(listMyWorkshopsVars);
// Variables can be defined inline as well.
const ref = listMyWorkshopsRef({ espacioId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listMyWorkshopsRef(dataConnect, listMyWorkshopsVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.workshops);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.workshops);
});
```

## ListMyWorkshopsByEstado
You can execute the `ListMyWorkshopsByEstado` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listMyWorkshopsByEstado(vars: ListMyWorkshopsByEstadoVariables, options?: ExecuteQueryOptions): QueryPromise<ListMyWorkshopsByEstadoData, ListMyWorkshopsByEstadoVariables>;

interface ListMyWorkshopsByEstadoRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListMyWorkshopsByEstadoVariables): QueryRef<ListMyWorkshopsByEstadoData, ListMyWorkshopsByEstadoVariables>;
}
export const listMyWorkshopsByEstadoRef: ListMyWorkshopsByEstadoRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listMyWorkshopsByEstado(dc: DataConnect, vars: ListMyWorkshopsByEstadoVariables, options?: ExecuteQueryOptions): QueryPromise<ListMyWorkshopsByEstadoData, ListMyWorkshopsByEstadoVariables>;

interface ListMyWorkshopsByEstadoRef {
  ...
  (dc: DataConnect, vars: ListMyWorkshopsByEstadoVariables): QueryRef<ListMyWorkshopsByEstadoData, ListMyWorkshopsByEstadoVariables>;
}
export const listMyWorkshopsByEstadoRef: ListMyWorkshopsByEstadoRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listMyWorkshopsByEstadoRef:
```typescript
const name = listMyWorkshopsByEstadoRef.operationName;
console.log(name);
```

### Variables
The `ListMyWorkshopsByEstado` query requires an argument of type `ListMyWorkshopsByEstadoVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListMyWorkshopsByEstadoVariables {
  espacioId: UUIDString;
  estado: EstadoWorkshop;
}
```
### Return Type
Recall that executing the `ListMyWorkshopsByEstado` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListMyWorkshopsByEstadoData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
    esBorrador: boolean;
    createdAt: TimestampString;
  } & Workshop_Key)[];
}
```
### Using `ListMyWorkshopsByEstado`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listMyWorkshopsByEstado, ListMyWorkshopsByEstadoVariables } from '@antologico/dataconnect';

// The `ListMyWorkshopsByEstado` query requires an argument of type `ListMyWorkshopsByEstadoVariables`:
const listMyWorkshopsByEstadoVars: ListMyWorkshopsByEstadoVariables = {
  espacioId: ..., 
  estado: ..., 
};

// Call the `listMyWorkshopsByEstado()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listMyWorkshopsByEstado(listMyWorkshopsByEstadoVars);
// Variables can be defined inline as well.
const { data } = await listMyWorkshopsByEstado({ espacioId: ..., estado: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listMyWorkshopsByEstado(dataConnect, listMyWorkshopsByEstadoVars);

console.log(data.workshops);

// Or, you can use the `Promise` API.
listMyWorkshopsByEstado(listMyWorkshopsByEstadoVars).then((response) => {
  const data = response.data;
  console.log(data.workshops);
});
```

### Using `ListMyWorkshopsByEstado`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listMyWorkshopsByEstadoRef, ListMyWorkshopsByEstadoVariables } from '@antologico/dataconnect';

// The `ListMyWorkshopsByEstado` query requires an argument of type `ListMyWorkshopsByEstadoVariables`:
const listMyWorkshopsByEstadoVars: ListMyWorkshopsByEstadoVariables = {
  espacioId: ..., 
  estado: ..., 
};

// Call the `listMyWorkshopsByEstadoRef()` function to get a reference to the query.
const ref = listMyWorkshopsByEstadoRef(listMyWorkshopsByEstadoVars);
// Variables can be defined inline as well.
const ref = listMyWorkshopsByEstadoRef({ espacioId: ..., estado: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listMyWorkshopsByEstadoRef(dataConnect, listMyWorkshopsByEstadoVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.workshops);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.workshops);
});
```

## SearchMyWorkshops
You can execute the `SearchMyWorkshops` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
searchMyWorkshops(vars: SearchMyWorkshopsVariables, options?: ExecuteQueryOptions): QueryPromise<SearchMyWorkshopsData, SearchMyWorkshopsVariables>;

interface SearchMyWorkshopsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: SearchMyWorkshopsVariables): QueryRef<SearchMyWorkshopsData, SearchMyWorkshopsVariables>;
}
export const searchMyWorkshopsRef: SearchMyWorkshopsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
searchMyWorkshops(dc: DataConnect, vars: SearchMyWorkshopsVariables, options?: ExecuteQueryOptions): QueryPromise<SearchMyWorkshopsData, SearchMyWorkshopsVariables>;

interface SearchMyWorkshopsRef {
  ...
  (dc: DataConnect, vars: SearchMyWorkshopsVariables): QueryRef<SearchMyWorkshopsData, SearchMyWorkshopsVariables>;
}
export const searchMyWorkshopsRef: SearchMyWorkshopsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the searchMyWorkshopsRef:
```typescript
const name = searchMyWorkshopsRef.operationName;
console.log(name);
```

### Variables
The `SearchMyWorkshops` query requires an argument of type `SearchMyWorkshopsVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface SearchMyWorkshopsVariables {
  espacioId: UUIDString;
  q: string;
}
```
### Return Type
Recall that executing the `SearchMyWorkshops` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `SearchMyWorkshopsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
    esBorrador: boolean;
    createdAt: TimestampString;
  } & Workshop_Key)[];
}
```
### Using `SearchMyWorkshops`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, searchMyWorkshops, SearchMyWorkshopsVariables } from '@antologico/dataconnect';

// The `SearchMyWorkshops` query requires an argument of type `SearchMyWorkshopsVariables`:
const searchMyWorkshopsVars: SearchMyWorkshopsVariables = {
  espacioId: ..., 
  q: ..., 
};

// Call the `searchMyWorkshops()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await searchMyWorkshops(searchMyWorkshopsVars);
// Variables can be defined inline as well.
const { data } = await searchMyWorkshops({ espacioId: ..., q: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await searchMyWorkshops(dataConnect, searchMyWorkshopsVars);

console.log(data.workshops);

// Or, you can use the `Promise` API.
searchMyWorkshops(searchMyWorkshopsVars).then((response) => {
  const data = response.data;
  console.log(data.workshops);
});
```

### Using `SearchMyWorkshops`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, searchMyWorkshopsRef, SearchMyWorkshopsVariables } from '@antologico/dataconnect';

// The `SearchMyWorkshops` query requires an argument of type `SearchMyWorkshopsVariables`:
const searchMyWorkshopsVars: SearchMyWorkshopsVariables = {
  espacioId: ..., 
  q: ..., 
};

// Call the `searchMyWorkshopsRef()` function to get a reference to the query.
const ref = searchMyWorkshopsRef(searchMyWorkshopsVars);
// Variables can be defined inline as well.
const ref = searchMyWorkshopsRef({ espacioId: ..., q: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = searchMyWorkshopsRef(dataConnect, searchMyWorkshopsVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.workshops);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.workshops);
});
```

## GetMyWorkshop
You can execute the `GetMyWorkshop` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getMyWorkshop(vars: GetMyWorkshopVariables, options?: ExecuteQueryOptions): QueryPromise<GetMyWorkshopData, GetMyWorkshopVariables>;

interface GetMyWorkshopRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetMyWorkshopVariables): QueryRef<GetMyWorkshopData, GetMyWorkshopVariables>;
}
export const getMyWorkshopRef: GetMyWorkshopRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getMyWorkshop(dc: DataConnect, vars: GetMyWorkshopVariables, options?: ExecuteQueryOptions): QueryPromise<GetMyWorkshopData, GetMyWorkshopVariables>;

interface GetMyWorkshopRef {
  ...
  (dc: DataConnect, vars: GetMyWorkshopVariables): QueryRef<GetMyWorkshopData, GetMyWorkshopVariables>;
}
export const getMyWorkshopRef: GetMyWorkshopRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getMyWorkshopRef:
```typescript
const name = getMyWorkshopRef.operationName;
console.log(name);
```

### Variables
The `GetMyWorkshop` query requires an argument of type `GetMyWorkshopVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetMyWorkshopVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `GetMyWorkshop` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetMyWorkshopData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
    esBorrador: boolean;
    createdAt: TimestampString;
    updatedAt: TimestampString;
    espacio: {
      id: UUIDString;
      nombre: string;
    } & Espacio_Key;
  } & Workshop_Key)[];
}
```
### Using `GetMyWorkshop`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getMyWorkshop, GetMyWorkshopVariables } from '@antologico/dataconnect';

// The `GetMyWorkshop` query requires an argument of type `GetMyWorkshopVariables`:
const getMyWorkshopVars: GetMyWorkshopVariables = {
  id: ..., 
};

// Call the `getMyWorkshop()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getMyWorkshop(getMyWorkshopVars);
// Variables can be defined inline as well.
const { data } = await getMyWorkshop({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getMyWorkshop(dataConnect, getMyWorkshopVars);

console.log(data.workshops);

// Or, you can use the `Promise` API.
getMyWorkshop(getMyWorkshopVars).then((response) => {
  const data = response.data;
  console.log(data.workshops);
});
```

### Using `GetMyWorkshop`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getMyWorkshopRef, GetMyWorkshopVariables } from '@antologico/dataconnect';

// The `GetMyWorkshop` query requires an argument of type `GetMyWorkshopVariables`:
const getMyWorkshopVars: GetMyWorkshopVariables = {
  id: ..., 
};

// Call the `getMyWorkshopRef()` function to get a reference to the query.
const ref = getMyWorkshopRef(getMyWorkshopVars);
// Variables can be defined inline as well.
const ref = getMyWorkshopRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getMyWorkshopRef(dataConnect, getMyWorkshopVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.workshops);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.workshops);
});
```

## GetEspacioBySlug
You can execute the `GetEspacioBySlug` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getEspacioBySlug(vars: GetEspacioBySlugVariables, options?: ExecuteQueryOptions): QueryPromise<GetEspacioBySlugData, GetEspacioBySlugVariables>;

interface GetEspacioBySlugRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetEspacioBySlugVariables): QueryRef<GetEspacioBySlugData, GetEspacioBySlugVariables>;
}
export const getEspacioBySlugRef: GetEspacioBySlugRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getEspacioBySlug(dc: DataConnect, vars: GetEspacioBySlugVariables, options?: ExecuteQueryOptions): QueryPromise<GetEspacioBySlugData, GetEspacioBySlugVariables>;

interface GetEspacioBySlugRef {
  ...
  (dc: DataConnect, vars: GetEspacioBySlugVariables): QueryRef<GetEspacioBySlugData, GetEspacioBySlugVariables>;
}
export const getEspacioBySlugRef: GetEspacioBySlugRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getEspacioBySlugRef:
```typescript
const name = getEspacioBySlugRef.operationName;
console.log(name);
```

### Variables
The `GetEspacioBySlug` query requires an argument of type `GetEspacioBySlugVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetEspacioBySlugVariables {
  slug: string;
}
```
### Return Type
Recall that executing the `GetEspacioBySlug` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetEspacioBySlugData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetEspacioBySlugData {
  espacios: ({
    id: UUIDString;
    nombre: string;
    slug?: string | null;
  } & Espacio_Key)[];
}
```
### Using `GetEspacioBySlug`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getEspacioBySlug, GetEspacioBySlugVariables } from '@antologico/dataconnect';

// The `GetEspacioBySlug` query requires an argument of type `GetEspacioBySlugVariables`:
const getEspacioBySlugVars: GetEspacioBySlugVariables = {
  slug: ..., 
};

// Call the `getEspacioBySlug()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getEspacioBySlug(getEspacioBySlugVars);
// Variables can be defined inline as well.
const { data } = await getEspacioBySlug({ slug: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getEspacioBySlug(dataConnect, getEspacioBySlugVars);

console.log(data.espacios);

// Or, you can use the `Promise` API.
getEspacioBySlug(getEspacioBySlugVars).then((response) => {
  const data = response.data;
  console.log(data.espacios);
});
```

### Using `GetEspacioBySlug`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getEspacioBySlugRef, GetEspacioBySlugVariables } from '@antologico/dataconnect';

// The `GetEspacioBySlug` query requires an argument of type `GetEspacioBySlugVariables`:
const getEspacioBySlugVars: GetEspacioBySlugVariables = {
  slug: ..., 
};

// Call the `getEspacioBySlugRef()` function to get a reference to the query.
const ref = getEspacioBySlugRef(getEspacioBySlugVars);
// Variables can be defined inline as well.
const ref = getEspacioBySlugRef({ slug: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getEspacioBySlugRef(dataConnect, getEspacioBySlugVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.espacios);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.espacios);
});
```

## GetPublicEspacio
You can execute the `GetPublicEspacio` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getPublicEspacio(vars: GetPublicEspacioVariables, options?: ExecuteQueryOptions): QueryPromise<GetPublicEspacioData, GetPublicEspacioVariables>;

interface GetPublicEspacioRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetPublicEspacioVariables): QueryRef<GetPublicEspacioData, GetPublicEspacioVariables>;
}
export const getPublicEspacioRef: GetPublicEspacioRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getPublicEspacio(dc: DataConnect, vars: GetPublicEspacioVariables, options?: ExecuteQueryOptions): QueryPromise<GetPublicEspacioData, GetPublicEspacioVariables>;

interface GetPublicEspacioRef {
  ...
  (dc: DataConnect, vars: GetPublicEspacioVariables): QueryRef<GetPublicEspacioData, GetPublicEspacioVariables>;
}
export const getPublicEspacioRef: GetPublicEspacioRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getPublicEspacioRef:
```typescript
const name = getPublicEspacioRef.operationName;
console.log(name);
```

### Variables
The `GetPublicEspacio` query requires an argument of type `GetPublicEspacioVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetPublicEspacioVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `GetPublicEspacio` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetPublicEspacioData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `GetPublicEspacio`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getPublicEspacio, GetPublicEspacioVariables } from '@antologico/dataconnect';

// The `GetPublicEspacio` query requires an argument of type `GetPublicEspacioVariables`:
const getPublicEspacioVars: GetPublicEspacioVariables = {
  id: ..., 
};

// Call the `getPublicEspacio()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getPublicEspacio(getPublicEspacioVars);
// Variables can be defined inline as well.
const { data } = await getPublicEspacio({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getPublicEspacio(dataConnect, getPublicEspacioVars);

console.log(data.espacios);

// Or, you can use the `Promise` API.
getPublicEspacio(getPublicEspacioVars).then((response) => {
  const data = response.data;
  console.log(data.espacios);
});
```

### Using `GetPublicEspacio`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getPublicEspacioRef, GetPublicEspacioVariables } from '@antologico/dataconnect';

// The `GetPublicEspacio` query requires an argument of type `GetPublicEspacioVariables`:
const getPublicEspacioVars: GetPublicEspacioVariables = {
  id: ..., 
};

// Call the `getPublicEspacioRef()` function to get a reference to the query.
const ref = getPublicEspacioRef(getPublicEspacioVars);
// Variables can be defined inline as well.
const ref = getPublicEspacioRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getPublicEspacioRef(dataConnect, getPublicEspacioVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.espacios);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.espacios);
});
```

## GetPublicEspacios
You can execute the `GetPublicEspacios` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getPublicEspacios(vars: GetPublicEspaciosVariables, options?: ExecuteQueryOptions): QueryPromise<GetPublicEspaciosData, GetPublicEspaciosVariables>;

interface GetPublicEspaciosRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetPublicEspaciosVariables): QueryRef<GetPublicEspaciosData, GetPublicEspaciosVariables>;
}
export const getPublicEspaciosRef: GetPublicEspaciosRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getPublicEspacios(dc: DataConnect, vars: GetPublicEspaciosVariables, options?: ExecuteQueryOptions): QueryPromise<GetPublicEspaciosData, GetPublicEspaciosVariables>;

interface GetPublicEspaciosRef {
  ...
  (dc: DataConnect, vars: GetPublicEspaciosVariables): QueryRef<GetPublicEspaciosData, GetPublicEspaciosVariables>;
}
export const getPublicEspaciosRef: GetPublicEspaciosRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getPublicEspaciosRef:
```typescript
const name = getPublicEspaciosRef.operationName;
console.log(name);
```

### Variables
The `GetPublicEspacios` query requires an argument of type `GetPublicEspaciosVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetPublicEspaciosVariables {
  ids: UUIDString[];
}
```
### Return Type
Recall that executing the `GetPublicEspacios` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetPublicEspaciosData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `GetPublicEspacios`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getPublicEspacios, GetPublicEspaciosVariables } from '@antologico/dataconnect';

// The `GetPublicEspacios` query requires an argument of type `GetPublicEspaciosVariables`:
const getPublicEspaciosVars: GetPublicEspaciosVariables = {
  ids: ..., 
};

// Call the `getPublicEspacios()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getPublicEspacios(getPublicEspaciosVars);
// Variables can be defined inline as well.
const { data } = await getPublicEspacios({ ids: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getPublicEspacios(dataConnect, getPublicEspaciosVars);

console.log(data.espacios);

// Or, you can use the `Promise` API.
getPublicEspacios(getPublicEspaciosVars).then((response) => {
  const data = response.data;
  console.log(data.espacios);
});
```

### Using `GetPublicEspacios`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getPublicEspaciosRef, GetPublicEspaciosVariables } from '@antologico/dataconnect';

// The `GetPublicEspacios` query requires an argument of type `GetPublicEspaciosVariables`:
const getPublicEspaciosVars: GetPublicEspaciosVariables = {
  ids: ..., 
};

// Call the `getPublicEspaciosRef()` function to get a reference to the query.
const ref = getPublicEspaciosRef(getPublicEspaciosVars);
// Variables can be defined inline as well.
const ref = getPublicEspaciosRef({ ids: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getPublicEspaciosRef(dataConnect, getPublicEspaciosVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.espacios);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.espacios);
});
```

## ListPublicWorkshopsByEspacio
You can execute the `ListPublicWorkshopsByEspacio` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listPublicWorkshopsByEspacio(vars: ListPublicWorkshopsByEspacioVariables, options?: ExecuteQueryOptions): QueryPromise<ListPublicWorkshopsByEspacioData, ListPublicWorkshopsByEspacioVariables>;

interface ListPublicWorkshopsByEspacioRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListPublicWorkshopsByEspacioVariables): QueryRef<ListPublicWorkshopsByEspacioData, ListPublicWorkshopsByEspacioVariables>;
}
export const listPublicWorkshopsByEspacioRef: ListPublicWorkshopsByEspacioRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listPublicWorkshopsByEspacio(dc: DataConnect, vars: ListPublicWorkshopsByEspacioVariables, options?: ExecuteQueryOptions): QueryPromise<ListPublicWorkshopsByEspacioData, ListPublicWorkshopsByEspacioVariables>;

interface ListPublicWorkshopsByEspacioRef {
  ...
  (dc: DataConnect, vars: ListPublicWorkshopsByEspacioVariables): QueryRef<ListPublicWorkshopsByEspacioData, ListPublicWorkshopsByEspacioVariables>;
}
export const listPublicWorkshopsByEspacioRef: ListPublicWorkshopsByEspacioRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listPublicWorkshopsByEspacioRef:
```typescript
const name = listPublicWorkshopsByEspacioRef.operationName;
console.log(name);
```

### Variables
The `ListPublicWorkshopsByEspacio` query requires an argument of type `ListPublicWorkshopsByEspacioVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListPublicWorkshopsByEspacioVariables {
  espacioId: UUIDString;
}
```
### Return Type
Recall that executing the `ListPublicWorkshopsByEspacio` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListPublicWorkshopsByEspacioData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `ListPublicWorkshopsByEspacio`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listPublicWorkshopsByEspacio, ListPublicWorkshopsByEspacioVariables } from '@antologico/dataconnect';

// The `ListPublicWorkshopsByEspacio` query requires an argument of type `ListPublicWorkshopsByEspacioVariables`:
const listPublicWorkshopsByEspacioVars: ListPublicWorkshopsByEspacioVariables = {
  espacioId: ..., 
};

// Call the `listPublicWorkshopsByEspacio()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listPublicWorkshopsByEspacio(listPublicWorkshopsByEspacioVars);
// Variables can be defined inline as well.
const { data } = await listPublicWorkshopsByEspacio({ espacioId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listPublicWorkshopsByEspacio(dataConnect, listPublicWorkshopsByEspacioVars);

console.log(data.workshops);

// Or, you can use the `Promise` API.
listPublicWorkshopsByEspacio(listPublicWorkshopsByEspacioVars).then((response) => {
  const data = response.data;
  console.log(data.workshops);
});
```

### Using `ListPublicWorkshopsByEspacio`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listPublicWorkshopsByEspacioRef, ListPublicWorkshopsByEspacioVariables } from '@antologico/dataconnect';

// The `ListPublicWorkshopsByEspacio` query requires an argument of type `ListPublicWorkshopsByEspacioVariables`:
const listPublicWorkshopsByEspacioVars: ListPublicWorkshopsByEspacioVariables = {
  espacioId: ..., 
};

// Call the `listPublicWorkshopsByEspacioRef()` function to get a reference to the query.
const ref = listPublicWorkshopsByEspacioRef(listPublicWorkshopsByEspacioVars);
// Variables can be defined inline as well.
const ref = listPublicWorkshopsByEspacioRef({ espacioId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listPublicWorkshopsByEspacioRef(dataConnect, listPublicWorkshopsByEspacioVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.workshops);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.workshops);
});
```

## ListMyReservas
You can execute the `ListMyReservas` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listMyReservas(options?: ExecuteQueryOptions): QueryPromise<ListMyReservasData, undefined>;

interface ListMyReservasRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListMyReservasData, undefined>;
}
export const listMyReservasRef: ListMyReservasRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listMyReservas(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListMyReservasData, undefined>;

interface ListMyReservasRef {
  ...
  (dc: DataConnect): QueryRef<ListMyReservasData, undefined>;
}
export const listMyReservasRef: ListMyReservasRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listMyReservasRef:
```typescript
const name = listMyReservasRef.operationName;
console.log(name);
```

### Variables
The `ListMyReservas` query has no variables.
### Return Type
Recall that executing the `ListMyReservas` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListMyReservasData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `ListMyReservas`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listMyReservas } from '@antologico/dataconnect';


// Call the `listMyReservas()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listMyReservas();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listMyReservas(dataConnect);

console.log(data.reservas);

// Or, you can use the `Promise` API.
listMyReservas().then((response) => {
  const data = response.data;
  console.log(data.reservas);
});
```

### Using `ListMyReservas`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listMyReservasRef } from '@antologico/dataconnect';


// Call the `listMyReservasRef()` function to get a reference to the query.
const ref = listMyReservasRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listMyReservasRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.reservas);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.reservas);
});
```

## ListReservasByWorkshop
You can execute the `ListReservasByWorkshop` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listReservasByWorkshop(vars: ListReservasByWorkshopVariables, options?: ExecuteQueryOptions): QueryPromise<ListReservasByWorkshopData, ListReservasByWorkshopVariables>;

interface ListReservasByWorkshopRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListReservasByWorkshopVariables): QueryRef<ListReservasByWorkshopData, ListReservasByWorkshopVariables>;
}
export const listReservasByWorkshopRef: ListReservasByWorkshopRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listReservasByWorkshop(dc: DataConnect, vars: ListReservasByWorkshopVariables, options?: ExecuteQueryOptions): QueryPromise<ListReservasByWorkshopData, ListReservasByWorkshopVariables>;

interface ListReservasByWorkshopRef {
  ...
  (dc: DataConnect, vars: ListReservasByWorkshopVariables): QueryRef<ListReservasByWorkshopData, ListReservasByWorkshopVariables>;
}
export const listReservasByWorkshopRef: ListReservasByWorkshopRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listReservasByWorkshopRef:
```typescript
const name = listReservasByWorkshopRef.operationName;
console.log(name);
```

### Variables
The `ListReservasByWorkshop` query requires an argument of type `ListReservasByWorkshopVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListReservasByWorkshopVariables {
  workshopId: UUIDString;
}
```
### Return Type
Recall that executing the `ListReservasByWorkshop` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListReservasByWorkshopData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListReservasByWorkshopData {
  reservas: ({
    id: UUIDString;
    estado: EstadoReserva;
    metodoPago?: MetodoPago | null;
    estadoPago?: EstadoPago | null;
    pagoExternoId?: string | null;
    fechaReserva: TimestampString;
    usuario: {
      uid: string;
      nombre: string;
      email: string;
    } & Usuario_Key;
    workshop: {
      id: UUIDString;
      nombre: string;
      fecha: TimestampString;
    } & Workshop_Key;
  } & Reserva_Key)[];
}
```
### Using `ListReservasByWorkshop`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listReservasByWorkshop, ListReservasByWorkshopVariables } from '@antologico/dataconnect';

// The `ListReservasByWorkshop` query requires an argument of type `ListReservasByWorkshopVariables`:
const listReservasByWorkshopVars: ListReservasByWorkshopVariables = {
  workshopId: ..., 
};

// Call the `listReservasByWorkshop()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listReservasByWorkshop(listReservasByWorkshopVars);
// Variables can be defined inline as well.
const { data } = await listReservasByWorkshop({ workshopId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listReservasByWorkshop(dataConnect, listReservasByWorkshopVars);

console.log(data.reservas);

// Or, you can use the `Promise` API.
listReservasByWorkshop(listReservasByWorkshopVars).then((response) => {
  const data = response.data;
  console.log(data.reservas);
});
```

### Using `ListReservasByWorkshop`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listReservasByWorkshopRef, ListReservasByWorkshopVariables } from '@antologico/dataconnect';

// The `ListReservasByWorkshop` query requires an argument of type `ListReservasByWorkshopVariables`:
const listReservasByWorkshopVars: ListReservasByWorkshopVariables = {
  workshopId: ..., 
};

// Call the `listReservasByWorkshopRef()` function to get a reference to the query.
const ref = listReservasByWorkshopRef(listReservasByWorkshopVars);
// Variables can be defined inline as well.
const ref = listReservasByWorkshopRef({ workshopId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listReservasByWorkshopRef(dataConnect, listReservasByWorkshopVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.reservas);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.reservas);
});
```

## AdminListAllEspacios
You can execute the `AdminListAllEspacios` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
adminListAllEspacios(options?: ExecuteQueryOptions): QueryPromise<AdminListAllEspaciosData, undefined>;

interface AdminListAllEspaciosRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<AdminListAllEspaciosData, undefined>;
}
export const adminListAllEspaciosRef: AdminListAllEspaciosRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
adminListAllEspacios(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<AdminListAllEspaciosData, undefined>;

interface AdminListAllEspaciosRef {
  ...
  (dc: DataConnect): QueryRef<AdminListAllEspaciosData, undefined>;
}
export const adminListAllEspaciosRef: AdminListAllEspaciosRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the adminListAllEspaciosRef:
```typescript
const name = adminListAllEspaciosRef.operationName;
console.log(name);
```

### Variables
The `AdminListAllEspacios` query has no variables.
### Return Type
Recall that executing the `AdminListAllEspacios` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AdminListAllEspaciosData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `AdminListAllEspacios`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, adminListAllEspacios } from '@antologico/dataconnect';


// Call the `adminListAllEspacios()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await adminListAllEspacios();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await adminListAllEspacios(dataConnect);

console.log(data.espacios);

// Or, you can use the `Promise` API.
adminListAllEspacios().then((response) => {
  const data = response.data;
  console.log(data.espacios);
});
```

### Using `AdminListAllEspacios`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, adminListAllEspaciosRef } from '@antologico/dataconnect';


// Call the `adminListAllEspaciosRef()` function to get a reference to the query.
const ref = adminListAllEspaciosRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = adminListAllEspaciosRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.espacios);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.espacios);
});
```

## AdminListAllWorkshops
You can execute the `AdminListAllWorkshops` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
adminListAllWorkshops(options?: ExecuteQueryOptions): QueryPromise<AdminListAllWorkshopsData, undefined>;

interface AdminListAllWorkshopsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<AdminListAllWorkshopsData, undefined>;
}
export const adminListAllWorkshopsRef: AdminListAllWorkshopsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
adminListAllWorkshops(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<AdminListAllWorkshopsData, undefined>;

interface AdminListAllWorkshopsRef {
  ...
  (dc: DataConnect): QueryRef<AdminListAllWorkshopsData, undefined>;
}
export const adminListAllWorkshopsRef: AdminListAllWorkshopsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the adminListAllWorkshopsRef:
```typescript
const name = adminListAllWorkshopsRef.operationName;
console.log(name);
```

### Variables
The `AdminListAllWorkshops` query has no variables.
### Return Type
Recall that executing the `AdminListAllWorkshops` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AdminListAllWorkshopsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `AdminListAllWorkshops`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, adminListAllWorkshops } from '@antologico/dataconnect';


// Call the `adminListAllWorkshops()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await adminListAllWorkshops();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await adminListAllWorkshops(dataConnect);

console.log(data.workshops);

// Or, you can use the `Promise` API.
adminListAllWorkshops().then((response) => {
  const data = response.data;
  console.log(data.workshops);
});
```

### Using `AdminListAllWorkshops`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, adminListAllWorkshopsRef } from '@antologico/dataconnect';


// Call the `adminListAllWorkshopsRef()` function to get a reference to the query.
const ref = adminListAllWorkshopsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = adminListAllWorkshopsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.workshops);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.workshops);
});
```

## AdminListAllReservas
You can execute the `AdminListAllReservas` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
adminListAllReservas(options?: ExecuteQueryOptions): QueryPromise<AdminListAllReservasData, undefined>;

interface AdminListAllReservasRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<AdminListAllReservasData, undefined>;
}
export const adminListAllReservasRef: AdminListAllReservasRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
adminListAllReservas(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<AdminListAllReservasData, undefined>;

interface AdminListAllReservasRef {
  ...
  (dc: DataConnect): QueryRef<AdminListAllReservasData, undefined>;
}
export const adminListAllReservasRef: AdminListAllReservasRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the adminListAllReservasRef:
```typescript
const name = adminListAllReservasRef.operationName;
console.log(name);
```

### Variables
The `AdminListAllReservas` query has no variables.
### Return Type
Recall that executing the `AdminListAllReservas` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AdminListAllReservasData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `AdminListAllReservas`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, adminListAllReservas } from '@antologico/dataconnect';


// Call the `adminListAllReservas()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await adminListAllReservas();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await adminListAllReservas(dataConnect);

console.log(data.reservas);

// Or, you can use the `Promise` API.
adminListAllReservas().then((response) => {
  const data = response.data;
  console.log(data.reservas);
});
```

### Using `AdminListAllReservas`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, adminListAllReservasRef } from '@antologico/dataconnect';


// Call the `adminListAllReservasRef()` function to get a reference to the query.
const ref = adminListAllReservasRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = adminListAllReservasRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.reservas);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.reservas);
});
```

## ListPublicWorkshops
You can execute the `ListPublicWorkshops` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listPublicWorkshops(options?: ExecuteQueryOptions): QueryPromise<ListPublicWorkshopsData, undefined>;

interface ListPublicWorkshopsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListPublicWorkshopsData, undefined>;
}
export const listPublicWorkshopsRef: ListPublicWorkshopsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listPublicWorkshops(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListPublicWorkshopsData, undefined>;

interface ListPublicWorkshopsRef {
  ...
  (dc: DataConnect): QueryRef<ListPublicWorkshopsData, undefined>;
}
export const listPublicWorkshopsRef: ListPublicWorkshopsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listPublicWorkshopsRef:
```typescript
const name = listPublicWorkshopsRef.operationName;
console.log(name);
```

### Variables
The `ListPublicWorkshops` query has no variables.
### Return Type
Recall that executing the `ListPublicWorkshops` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListPublicWorkshopsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `ListPublicWorkshops`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listPublicWorkshops } from '@antologico/dataconnect';


// Call the `listPublicWorkshops()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listPublicWorkshops();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listPublicWorkshops(dataConnect);

console.log(data.workshops);

// Or, you can use the `Promise` API.
listPublicWorkshops().then((response) => {
  const data = response.data;
  console.log(data.workshops);
});
```

### Using `ListPublicWorkshops`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listPublicWorkshopsRef } from '@antologico/dataconnect';


// Call the `listPublicWorkshopsRef()` function to get a reference to the query.
const ref = listPublicWorkshopsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listPublicWorkshopsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.workshops);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.workshops);
});
```

# Mutations

There are two ways to execute a Data Connect Mutation using the generated Web SDK:
- Using a Mutation Reference function, which returns a `MutationRef`
  - The `MutationRef` can be used as an argument to `executeMutation()`, which will execute the Mutation and return a `MutationPromise`
- Using an action shortcut function, which returns a `MutationPromise`
  - Calling the action shortcut function will execute the Mutation and return a `MutationPromise`

The following is true for both the action shortcut function and the `MutationRef` function:
- The `MutationPromise` returned will resolve to the result of the Mutation once it has finished executing
- If the Mutation accepts arguments, both the action shortcut function and the `MutationRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Mutation
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `antologico` connector's generated functions to execute each mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-mutations).

## UpsertProfesional
You can execute the `UpsertProfesional` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
upsertProfesional(vars: UpsertProfesionalVariables): MutationPromise<UpsertProfesionalData, UpsertProfesionalVariables>;

interface UpsertProfesionalRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertProfesionalVariables): MutationRef<UpsertProfesionalData, UpsertProfesionalVariables>;
}
export const upsertProfesionalRef: UpsertProfesionalRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
upsertProfesional(dc: DataConnect, vars: UpsertProfesionalVariables): MutationPromise<UpsertProfesionalData, UpsertProfesionalVariables>;

interface UpsertProfesionalRef {
  ...
  (dc: DataConnect, vars: UpsertProfesionalVariables): MutationRef<UpsertProfesionalData, UpsertProfesionalVariables>;
}
export const upsertProfesionalRef: UpsertProfesionalRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the upsertProfesionalRef:
```typescript
const name = upsertProfesionalRef.operationName;
console.log(name);
```

### Variables
The `UpsertProfesional` mutation requires an argument of type `UpsertProfesionalVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpsertProfesionalVariables {
  nombre: string;
  email: string;
}
```
### Return Type
Recall that executing the `UpsertProfesional` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpsertProfesionalData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpsertProfesionalData {
  profesional_upsert: Profesional_Key;
}
```
### Using `UpsertProfesional`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, upsertProfesional, UpsertProfesionalVariables } from '@antologico/dataconnect';

// The `UpsertProfesional` mutation requires an argument of type `UpsertProfesionalVariables`:
const upsertProfesionalVars: UpsertProfesionalVariables = {
  nombre: ..., 
  email: ..., 
};

// Call the `upsertProfesional()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await upsertProfesional(upsertProfesionalVars);
// Variables can be defined inline as well.
const { data } = await upsertProfesional({ nombre: ..., email: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await upsertProfesional(dataConnect, upsertProfesionalVars);

console.log(data.profesional_upsert);

// Or, you can use the `Promise` API.
upsertProfesional(upsertProfesionalVars).then((response) => {
  const data = response.data;
  console.log(data.profesional_upsert);
});
```

### Using `UpsertProfesional`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, upsertProfesionalRef, UpsertProfesionalVariables } from '@antologico/dataconnect';

// The `UpsertProfesional` mutation requires an argument of type `UpsertProfesionalVariables`:
const upsertProfesionalVars: UpsertProfesionalVariables = {
  nombre: ..., 
  email: ..., 
};

// Call the `upsertProfesionalRef()` function to get a reference to the mutation.
const ref = upsertProfesionalRef(upsertProfesionalVars);
// Variables can be defined inline as well.
const ref = upsertProfesionalRef({ nombre: ..., email: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = upsertProfesionalRef(dataConnect, upsertProfesionalVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.profesional_upsert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.profesional_upsert);
});
```

## ReassignProfesionalUid
You can execute the `ReassignProfesionalUid` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
reassignProfesionalUid(vars: ReassignProfesionalUidVariables): MutationPromise<ReassignProfesionalUidData, ReassignProfesionalUidVariables>;

interface ReassignProfesionalUidRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ReassignProfesionalUidVariables): MutationRef<ReassignProfesionalUidData, ReassignProfesionalUidVariables>;
}
export const reassignProfesionalUidRef: ReassignProfesionalUidRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
reassignProfesionalUid(dc: DataConnect, vars: ReassignProfesionalUidVariables): MutationPromise<ReassignProfesionalUidData, ReassignProfesionalUidVariables>;

interface ReassignProfesionalUidRef {
  ...
  (dc: DataConnect, vars: ReassignProfesionalUidVariables): MutationRef<ReassignProfesionalUidData, ReassignProfesionalUidVariables>;
}
export const reassignProfesionalUidRef: ReassignProfesionalUidRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the reassignProfesionalUidRef:
```typescript
const name = reassignProfesionalUidRef.operationName;
console.log(name);
```

### Variables
The `ReassignProfesionalUid` mutation requires an argument of type `ReassignProfesionalUidVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ReassignProfesionalUidVariables {
  nombre: string;
}
```
### Return Type
Recall that executing the `ReassignProfesionalUid` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ReassignProfesionalUidData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ReassignProfesionalUidData {
  reassigned?: number | null;
}
```
### Using `ReassignProfesionalUid`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, reassignProfesionalUid, ReassignProfesionalUidVariables } from '@antologico/dataconnect';

// The `ReassignProfesionalUid` mutation requires an argument of type `ReassignProfesionalUidVariables`:
const reassignProfesionalUidVars: ReassignProfesionalUidVariables = {
  nombre: ..., 
};

// Call the `reassignProfesionalUid()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await reassignProfesionalUid(reassignProfesionalUidVars);
// Variables can be defined inline as well.
const { data } = await reassignProfesionalUid({ nombre: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await reassignProfesionalUid(dataConnect, reassignProfesionalUidVars);

console.log(data.reassigned);

// Or, you can use the `Promise` API.
reassignProfesionalUid(reassignProfesionalUidVars).then((response) => {
  const data = response.data;
  console.log(data.reassigned);
});
```

### Using `ReassignProfesionalUid`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, reassignProfesionalUidRef, ReassignProfesionalUidVariables } from '@antologico/dataconnect';

// The `ReassignProfesionalUid` mutation requires an argument of type `ReassignProfesionalUidVariables`:
const reassignProfesionalUidVars: ReassignProfesionalUidVariables = {
  nombre: ..., 
};

// Call the `reassignProfesionalUidRef()` function to get a reference to the mutation.
const ref = reassignProfesionalUidRef(reassignProfesionalUidVars);
// Variables can be defined inline as well.
const ref = reassignProfesionalUidRef({ nombre: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = reassignProfesionalUidRef(dataConnect, reassignProfesionalUidVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.reassigned);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.reassigned);
});
```

## ActivarPlan
You can execute the `ActivarPlan` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
activarPlan(vars: ActivarPlanVariables): MutationPromise<ActivarPlanData, ActivarPlanVariables>;

interface ActivarPlanRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ActivarPlanVariables): MutationRef<ActivarPlanData, ActivarPlanVariables>;
}
export const activarPlanRef: ActivarPlanRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
activarPlan(dc: DataConnect, vars: ActivarPlanVariables): MutationPromise<ActivarPlanData, ActivarPlanVariables>;

interface ActivarPlanRef {
  ...
  (dc: DataConnect, vars: ActivarPlanVariables): MutationRef<ActivarPlanData, ActivarPlanVariables>;
}
export const activarPlanRef: ActivarPlanRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the activarPlanRef:
```typescript
const name = activarPlanRef.operationName;
console.log(name);
```

### Variables
The `ActivarPlan` mutation requires an argument of type `ActivarPlanVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ActivarPlanVariables {
  id: UUIDString;
  planId: UUIDString;
  periodoFacturacion: string;
  precioActual: number;
  proximaRenovacion: TimestampString;
}
```
### Return Type
Recall that executing the `ActivarPlan` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ActivarPlanData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ActivarPlanData {
  espacio_update?: Espacio_Key | null;
}
```
### Using `ActivarPlan`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, activarPlan, ActivarPlanVariables } from '@antologico/dataconnect';

// The `ActivarPlan` mutation requires an argument of type `ActivarPlanVariables`:
const activarPlanVars: ActivarPlanVariables = {
  id: ..., 
  planId: ..., 
  periodoFacturacion: ..., 
  precioActual: ..., 
  proximaRenovacion: ..., 
};

// Call the `activarPlan()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await activarPlan(activarPlanVars);
// Variables can be defined inline as well.
const { data } = await activarPlan({ id: ..., planId: ..., periodoFacturacion: ..., precioActual: ..., proximaRenovacion: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await activarPlan(dataConnect, activarPlanVars);

console.log(data.espacio_update);

// Or, you can use the `Promise` API.
activarPlan(activarPlanVars).then((response) => {
  const data = response.data;
  console.log(data.espacio_update);
});
```

### Using `ActivarPlan`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, activarPlanRef, ActivarPlanVariables } from '@antologico/dataconnect';

// The `ActivarPlan` mutation requires an argument of type `ActivarPlanVariables`:
const activarPlanVars: ActivarPlanVariables = {
  id: ..., 
  planId: ..., 
  periodoFacturacion: ..., 
  precioActual: ..., 
  proximaRenovacion: ..., 
};

// Call the `activarPlanRef()` function to get a reference to the mutation.
const ref = activarPlanRef(activarPlanVars);
// Variables can be defined inline as well.
const ref = activarPlanRef({ id: ..., planId: ..., periodoFacturacion: ..., precioActual: ..., proximaRenovacion: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = activarPlanRef(dataConnect, activarPlanVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.espacio_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.espacio_update);
});
```

## AgendarDowngrade
You can execute the `AgendarDowngrade` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
agendarDowngrade(vars: AgendarDowngradeVariables): MutationPromise<AgendarDowngradeData, AgendarDowngradeVariables>;

interface AgendarDowngradeRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: AgendarDowngradeVariables): MutationRef<AgendarDowngradeData, AgendarDowngradeVariables>;
}
export const agendarDowngradeRef: AgendarDowngradeRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
agendarDowngrade(dc: DataConnect, vars: AgendarDowngradeVariables): MutationPromise<AgendarDowngradeData, AgendarDowngradeVariables>;

interface AgendarDowngradeRef {
  ...
  (dc: DataConnect, vars: AgendarDowngradeVariables): MutationRef<AgendarDowngradeData, AgendarDowngradeVariables>;
}
export const agendarDowngradeRef: AgendarDowngradeRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the agendarDowngradeRef:
```typescript
const name = agendarDowngradeRef.operationName;
console.log(name);
```

### Variables
The `AgendarDowngrade` mutation requires an argument of type `AgendarDowngradeVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface AgendarDowngradeVariables {
  id: UUIDString;
  downgradePendiente: unknown;
}
```
### Return Type
Recall that executing the `AgendarDowngrade` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AgendarDowngradeData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface AgendarDowngradeData {
  espacio_update?: Espacio_Key | null;
}
```
### Using `AgendarDowngrade`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, agendarDowngrade, AgendarDowngradeVariables } from '@antologico/dataconnect';

// The `AgendarDowngrade` mutation requires an argument of type `AgendarDowngradeVariables`:
const agendarDowngradeVars: AgendarDowngradeVariables = {
  id: ..., 
  downgradePendiente: ..., 
};

// Call the `agendarDowngrade()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await agendarDowngrade(agendarDowngradeVars);
// Variables can be defined inline as well.
const { data } = await agendarDowngrade({ id: ..., downgradePendiente: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await agendarDowngrade(dataConnect, agendarDowngradeVars);

console.log(data.espacio_update);

// Or, you can use the `Promise` API.
agendarDowngrade(agendarDowngradeVars).then((response) => {
  const data = response.data;
  console.log(data.espacio_update);
});
```

### Using `AgendarDowngrade`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, agendarDowngradeRef, AgendarDowngradeVariables } from '@antologico/dataconnect';

// The `AgendarDowngrade` mutation requires an argument of type `AgendarDowngradeVariables`:
const agendarDowngradeVars: AgendarDowngradeVariables = {
  id: ..., 
  downgradePendiente: ..., 
};

// Call the `agendarDowngradeRef()` function to get a reference to the mutation.
const ref = agendarDowngradeRef(agendarDowngradeVars);
// Variables can be defined inline as well.
const ref = agendarDowngradeRef({ id: ..., downgradePendiente: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = agendarDowngradeRef(dataConnect, agendarDowngradeVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.espacio_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.espacio_update);
});
```

## CancelarDowngrade
You can execute the `CancelarDowngrade` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
cancelarDowngrade(vars: CancelarDowngradeVariables): MutationPromise<CancelarDowngradeData, CancelarDowngradeVariables>;

interface CancelarDowngradeRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CancelarDowngradeVariables): MutationRef<CancelarDowngradeData, CancelarDowngradeVariables>;
}
export const cancelarDowngradeRef: CancelarDowngradeRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
cancelarDowngrade(dc: DataConnect, vars: CancelarDowngradeVariables): MutationPromise<CancelarDowngradeData, CancelarDowngradeVariables>;

interface CancelarDowngradeRef {
  ...
  (dc: DataConnect, vars: CancelarDowngradeVariables): MutationRef<CancelarDowngradeData, CancelarDowngradeVariables>;
}
export const cancelarDowngradeRef: CancelarDowngradeRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the cancelarDowngradeRef:
```typescript
const name = cancelarDowngradeRef.operationName;
console.log(name);
```

### Variables
The `CancelarDowngrade` mutation requires an argument of type `CancelarDowngradeVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CancelarDowngradeVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `CancelarDowngrade` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CancelarDowngradeData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CancelarDowngradeData {
  espacio_update?: Espacio_Key | null;
}
```
### Using `CancelarDowngrade`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, cancelarDowngrade, CancelarDowngradeVariables } from '@antologico/dataconnect';

// The `CancelarDowngrade` mutation requires an argument of type `CancelarDowngradeVariables`:
const cancelarDowngradeVars: CancelarDowngradeVariables = {
  id: ..., 
};

// Call the `cancelarDowngrade()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await cancelarDowngrade(cancelarDowngradeVars);
// Variables can be defined inline as well.
const { data } = await cancelarDowngrade({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await cancelarDowngrade(dataConnect, cancelarDowngradeVars);

console.log(data.espacio_update);

// Or, you can use the `Promise` API.
cancelarDowngrade(cancelarDowngradeVars).then((response) => {
  const data = response.data;
  console.log(data.espacio_update);
});
```

### Using `CancelarDowngrade`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, cancelarDowngradeRef, CancelarDowngradeVariables } from '@antologico/dataconnect';

// The `CancelarDowngrade` mutation requires an argument of type `CancelarDowngradeVariables`:
const cancelarDowngradeVars: CancelarDowngradeVariables = {
  id: ..., 
};

// Call the `cancelarDowngradeRef()` function to get a reference to the mutation.
const ref = cancelarDowngradeRef(cancelarDowngradeVars);
// Variables can be defined inline as well.
const ref = cancelarDowngradeRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = cancelarDowngradeRef(dataConnect, cancelarDowngradeVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.espacio_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.espacio_update);
});
```

## UpdateCuponAplicado
You can execute the `UpdateCuponAplicado` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateCuponAplicado(vars: UpdateCuponAplicadoVariables): MutationPromise<UpdateCuponAplicadoData, UpdateCuponAplicadoVariables>;

interface UpdateCuponAplicadoRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateCuponAplicadoVariables): MutationRef<UpdateCuponAplicadoData, UpdateCuponAplicadoVariables>;
}
export const updateCuponAplicadoRef: UpdateCuponAplicadoRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateCuponAplicado(dc: DataConnect, vars: UpdateCuponAplicadoVariables): MutationPromise<UpdateCuponAplicadoData, UpdateCuponAplicadoVariables>;

interface UpdateCuponAplicadoRef {
  ...
  (dc: DataConnect, vars: UpdateCuponAplicadoVariables): MutationRef<UpdateCuponAplicadoData, UpdateCuponAplicadoVariables>;
}
export const updateCuponAplicadoRef: UpdateCuponAplicadoRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateCuponAplicadoRef:
```typescript
const name = updateCuponAplicadoRef.operationName;
console.log(name);
```

### Variables
The `UpdateCuponAplicado` mutation requires an argument of type `UpdateCuponAplicadoVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateCuponAplicadoVariables {
  id: UUIDString;
  cuponAplicado?: unknown | null;
}
```
### Return Type
Recall that executing the `UpdateCuponAplicado` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateCuponAplicadoData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateCuponAplicadoData {
  espacio_update?: Espacio_Key | null;
}
```
### Using `UpdateCuponAplicado`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateCuponAplicado, UpdateCuponAplicadoVariables } from '@antologico/dataconnect';

// The `UpdateCuponAplicado` mutation requires an argument of type `UpdateCuponAplicadoVariables`:
const updateCuponAplicadoVars: UpdateCuponAplicadoVariables = {
  id: ..., 
  cuponAplicado: ..., // optional
};

// Call the `updateCuponAplicado()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateCuponAplicado(updateCuponAplicadoVars);
// Variables can be defined inline as well.
const { data } = await updateCuponAplicado({ id: ..., cuponAplicado: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateCuponAplicado(dataConnect, updateCuponAplicadoVars);

console.log(data.espacio_update);

// Or, you can use the `Promise` API.
updateCuponAplicado(updateCuponAplicadoVars).then((response) => {
  const data = response.data;
  console.log(data.espacio_update);
});
```

### Using `UpdateCuponAplicado`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateCuponAplicadoRef, UpdateCuponAplicadoVariables } from '@antologico/dataconnect';

// The `UpdateCuponAplicado` mutation requires an argument of type `UpdateCuponAplicadoVariables`:
const updateCuponAplicadoVars: UpdateCuponAplicadoVariables = {
  id: ..., 
  cuponAplicado: ..., // optional
};

// Call the `updateCuponAplicadoRef()` function to get a reference to the mutation.
const ref = updateCuponAplicadoRef(updateCuponAplicadoVars);
// Variables can be defined inline as well.
const ref = updateCuponAplicadoRef({ id: ..., cuponAplicado: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateCuponAplicadoRef(dataConnect, updateCuponAplicadoVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.espacio_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.espacio_update);
});
```

## CreateEspacio
You can execute the `CreateEspacio` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createEspacio(vars: CreateEspacioVariables): MutationPromise<CreateEspacioData, CreateEspacioVariables>;

interface CreateEspacioRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateEspacioVariables): MutationRef<CreateEspacioData, CreateEspacioVariables>;
}
export const createEspacioRef: CreateEspacioRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createEspacio(dc: DataConnect, vars: CreateEspacioVariables): MutationPromise<CreateEspacioData, CreateEspacioVariables>;

interface CreateEspacioRef {
  ...
  (dc: DataConnect, vars: CreateEspacioVariables): MutationRef<CreateEspacioData, CreateEspacioVariables>;
}
export const createEspacioRef: CreateEspacioRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createEspacioRef:
```typescript
const name = createEspacioRef.operationName;
console.log(name);
```

### Variables
The `CreateEspacio` mutation requires an argument of type `CreateEspacioVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateEspacioVariables {
  nombre: string;
  rubroId?: UUIDString | null;
  rubroPersonalizado?: string | null;
}
```
### Return Type
Recall that executing the `CreateEspacio` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateEspacioData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateEspacioData {
  espacio_insert: Espacio_Key;
}
```
### Using `CreateEspacio`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createEspacio, CreateEspacioVariables } from '@antologico/dataconnect';

// The `CreateEspacio` mutation requires an argument of type `CreateEspacioVariables`:
const createEspacioVars: CreateEspacioVariables = {
  nombre: ..., 
  rubroId: ..., // optional
  rubroPersonalizado: ..., // optional
};

// Call the `createEspacio()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createEspacio(createEspacioVars);
// Variables can be defined inline as well.
const { data } = await createEspacio({ nombre: ..., rubroId: ..., rubroPersonalizado: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createEspacio(dataConnect, createEspacioVars);

console.log(data.espacio_insert);

// Or, you can use the `Promise` API.
createEspacio(createEspacioVars).then((response) => {
  const data = response.data;
  console.log(data.espacio_insert);
});
```

### Using `CreateEspacio`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createEspacioRef, CreateEspacioVariables } from '@antologico/dataconnect';

// The `CreateEspacio` mutation requires an argument of type `CreateEspacioVariables`:
const createEspacioVars: CreateEspacioVariables = {
  nombre: ..., 
  rubroId: ..., // optional
  rubroPersonalizado: ..., // optional
};

// Call the `createEspacioRef()` function to get a reference to the mutation.
const ref = createEspacioRef(createEspacioVars);
// Variables can be defined inline as well.
const ref = createEspacioRef({ nombre: ..., rubroId: ..., rubroPersonalizado: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createEspacioRef(dataConnect, createEspacioVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.espacio_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.espacio_insert);
});
```

## UpdateEspacioIdentidad
You can execute the `UpdateEspacioIdentidad` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateEspacioIdentidad(vars: UpdateEspacioIdentidadVariables): MutationPromise<UpdateEspacioIdentidadData, UpdateEspacioIdentidadVariables>;

interface UpdateEspacioIdentidadRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateEspacioIdentidadVariables): MutationRef<UpdateEspacioIdentidadData, UpdateEspacioIdentidadVariables>;
}
export const updateEspacioIdentidadRef: UpdateEspacioIdentidadRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateEspacioIdentidad(dc: DataConnect, vars: UpdateEspacioIdentidadVariables): MutationPromise<UpdateEspacioIdentidadData, UpdateEspacioIdentidadVariables>;

interface UpdateEspacioIdentidadRef {
  ...
  (dc: DataConnect, vars: UpdateEspacioIdentidadVariables): MutationRef<UpdateEspacioIdentidadData, UpdateEspacioIdentidadVariables>;
}
export const updateEspacioIdentidadRef: UpdateEspacioIdentidadRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateEspacioIdentidadRef:
```typescript
const name = updateEspacioIdentidadRef.operationName;
console.log(name);
```

### Variables
The `UpdateEspacioIdentidad` mutation requires an argument of type `UpdateEspacioIdentidadVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateEspacioIdentidadVariables {
  id: UUIDString;
  logoUrl?: string | null;
  logoShape?: string | null;
  logoScale?: number | null;
  brandColors?: unknown | null;
  brandFont?: string | null;
}
```
### Return Type
Recall that executing the `UpdateEspacioIdentidad` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateEspacioIdentidadData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateEspacioIdentidadData {
  espacio_update?: Espacio_Key | null;
}
```
### Using `UpdateEspacioIdentidad`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateEspacioIdentidad, UpdateEspacioIdentidadVariables } from '@antologico/dataconnect';

// The `UpdateEspacioIdentidad` mutation requires an argument of type `UpdateEspacioIdentidadVariables`:
const updateEspacioIdentidadVars: UpdateEspacioIdentidadVariables = {
  id: ..., 
  logoUrl: ..., // optional
  logoShape: ..., // optional
  logoScale: ..., // optional
  brandColors: ..., // optional
  brandFont: ..., // optional
};

// Call the `updateEspacioIdentidad()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateEspacioIdentidad(updateEspacioIdentidadVars);
// Variables can be defined inline as well.
const { data } = await updateEspacioIdentidad({ id: ..., logoUrl: ..., logoShape: ..., logoScale: ..., brandColors: ..., brandFont: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateEspacioIdentidad(dataConnect, updateEspacioIdentidadVars);

console.log(data.espacio_update);

// Or, you can use the `Promise` API.
updateEspacioIdentidad(updateEspacioIdentidadVars).then((response) => {
  const data = response.data;
  console.log(data.espacio_update);
});
```

### Using `UpdateEspacioIdentidad`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateEspacioIdentidadRef, UpdateEspacioIdentidadVariables } from '@antologico/dataconnect';

// The `UpdateEspacioIdentidad` mutation requires an argument of type `UpdateEspacioIdentidadVariables`:
const updateEspacioIdentidadVars: UpdateEspacioIdentidadVariables = {
  id: ..., 
  logoUrl: ..., // optional
  logoShape: ..., // optional
  logoScale: ..., // optional
  brandColors: ..., // optional
  brandFont: ..., // optional
};

// Call the `updateEspacioIdentidadRef()` function to get a reference to the mutation.
const ref = updateEspacioIdentidadRef(updateEspacioIdentidadVars);
// Variables can be defined inline as well.
const ref = updateEspacioIdentidadRef({ id: ..., logoUrl: ..., logoShape: ..., logoScale: ..., brandColors: ..., brandFont: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateEspacioIdentidadRef(dataConnect, updateEspacioIdentidadVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.espacio_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.espacio_update);
});
```

## UpdateEspacioCobros
You can execute the `UpdateEspacioCobros` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateEspacioCobros(vars: UpdateEspacioCobrosVariables): MutationPromise<UpdateEspacioCobrosData, UpdateEspacioCobrosVariables>;

interface UpdateEspacioCobrosRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateEspacioCobrosVariables): MutationRef<UpdateEspacioCobrosData, UpdateEspacioCobrosVariables>;
}
export const updateEspacioCobrosRef: UpdateEspacioCobrosRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateEspacioCobros(dc: DataConnect, vars: UpdateEspacioCobrosVariables): MutationPromise<UpdateEspacioCobrosData, UpdateEspacioCobrosVariables>;

interface UpdateEspacioCobrosRef {
  ...
  (dc: DataConnect, vars: UpdateEspacioCobrosVariables): MutationRef<UpdateEspacioCobrosData, UpdateEspacioCobrosVariables>;
}
export const updateEspacioCobrosRef: UpdateEspacioCobrosRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateEspacioCobrosRef:
```typescript
const name = updateEspacioCobrosRef.operationName;
console.log(name);
```

### Variables
The `UpdateEspacioCobros` mutation requires an argument of type `UpdateEspacioCobrosVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateEspacioCobrosVariables {
  id: UUIDString;
  cobros?: unknown | null;
}
```
### Return Type
Recall that executing the `UpdateEspacioCobros` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateEspacioCobrosData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateEspacioCobrosData {
  espacio_update?: Espacio_Key | null;
}
```
### Using `UpdateEspacioCobros`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateEspacioCobros, UpdateEspacioCobrosVariables } from '@antologico/dataconnect';

// The `UpdateEspacioCobros` mutation requires an argument of type `UpdateEspacioCobrosVariables`:
const updateEspacioCobrosVars: UpdateEspacioCobrosVariables = {
  id: ..., 
  cobros: ..., // optional
};

// Call the `updateEspacioCobros()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateEspacioCobros(updateEspacioCobrosVars);
// Variables can be defined inline as well.
const { data } = await updateEspacioCobros({ id: ..., cobros: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateEspacioCobros(dataConnect, updateEspacioCobrosVars);

console.log(data.espacio_update);

// Or, you can use the `Promise` API.
updateEspacioCobros(updateEspacioCobrosVars).then((response) => {
  const data = response.data;
  console.log(data.espacio_update);
});
```

### Using `UpdateEspacioCobros`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateEspacioCobrosRef, UpdateEspacioCobrosVariables } from '@antologico/dataconnect';

// The `UpdateEspacioCobros` mutation requires an argument of type `UpdateEspacioCobrosVariables`:
const updateEspacioCobrosVars: UpdateEspacioCobrosVariables = {
  id: ..., 
  cobros: ..., // optional
};

// Call the `updateEspacioCobrosRef()` function to get a reference to the mutation.
const ref = updateEspacioCobrosRef(updateEspacioCobrosVars);
// Variables can be defined inline as well.
const ref = updateEspacioCobrosRef({ id: ..., cobros: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateEspacioCobrosRef(dataConnect, updateEspacioCobrosVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.espacio_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.espacio_update);
});
```

## UpdateEspacioRedes
You can execute the `UpdateEspacioRedes` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateEspacioRedes(vars: UpdateEspacioRedesVariables): MutationPromise<UpdateEspacioRedesData, UpdateEspacioRedesVariables>;

interface UpdateEspacioRedesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateEspacioRedesVariables): MutationRef<UpdateEspacioRedesData, UpdateEspacioRedesVariables>;
}
export const updateEspacioRedesRef: UpdateEspacioRedesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateEspacioRedes(dc: DataConnect, vars: UpdateEspacioRedesVariables): MutationPromise<UpdateEspacioRedesData, UpdateEspacioRedesVariables>;

interface UpdateEspacioRedesRef {
  ...
  (dc: DataConnect, vars: UpdateEspacioRedesVariables): MutationRef<UpdateEspacioRedesData, UpdateEspacioRedesVariables>;
}
export const updateEspacioRedesRef: UpdateEspacioRedesRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateEspacioRedesRef:
```typescript
const name = updateEspacioRedesRef.operationName;
console.log(name);
```

### Variables
The `UpdateEspacioRedes` mutation requires an argument of type `UpdateEspacioRedesVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateEspacioRedesVariables {
  id: UUIDString;
  redesSociales?: unknown | null;
}
```
### Return Type
Recall that executing the `UpdateEspacioRedes` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateEspacioRedesData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateEspacioRedesData {
  espacio_update?: Espacio_Key | null;
}
```
### Using `UpdateEspacioRedes`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateEspacioRedes, UpdateEspacioRedesVariables } from '@antologico/dataconnect';

// The `UpdateEspacioRedes` mutation requires an argument of type `UpdateEspacioRedesVariables`:
const updateEspacioRedesVars: UpdateEspacioRedesVariables = {
  id: ..., 
  redesSociales: ..., // optional
};

// Call the `updateEspacioRedes()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateEspacioRedes(updateEspacioRedesVars);
// Variables can be defined inline as well.
const { data } = await updateEspacioRedes({ id: ..., redesSociales: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateEspacioRedes(dataConnect, updateEspacioRedesVars);

console.log(data.espacio_update);

// Or, you can use the `Promise` API.
updateEspacioRedes(updateEspacioRedesVars).then((response) => {
  const data = response.data;
  console.log(data.espacio_update);
});
```

### Using `UpdateEspacioRedes`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateEspacioRedesRef, UpdateEspacioRedesVariables } from '@antologico/dataconnect';

// The `UpdateEspacioRedes` mutation requires an argument of type `UpdateEspacioRedesVariables`:
const updateEspacioRedesVars: UpdateEspacioRedesVariables = {
  id: ..., 
  redesSociales: ..., // optional
};

// Call the `updateEspacioRedesRef()` function to get a reference to the mutation.
const ref = updateEspacioRedesRef(updateEspacioRedesVars);
// Variables can be defined inline as well.
const ref = updateEspacioRedesRef({ id: ..., redesSociales: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateEspacioRedesRef(dataConnect, updateEspacioRedesVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.espacio_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.espacio_update);
});
```

## UpdateEspacio
You can execute the `UpdateEspacio` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateEspacio(vars: UpdateEspacioVariables): MutationPromise<UpdateEspacioData, UpdateEspacioVariables>;

interface UpdateEspacioRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateEspacioVariables): MutationRef<UpdateEspacioData, UpdateEspacioVariables>;
}
export const updateEspacioRef: UpdateEspacioRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateEspacio(dc: DataConnect, vars: UpdateEspacioVariables): MutationPromise<UpdateEspacioData, UpdateEspacioVariables>;

interface UpdateEspacioRef {
  ...
  (dc: DataConnect, vars: UpdateEspacioVariables): MutationRef<UpdateEspacioData, UpdateEspacioVariables>;
}
export const updateEspacioRef: UpdateEspacioRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateEspacioRef:
```typescript
const name = updateEspacioRef.operationName;
console.log(name);
```

### Variables
The `UpdateEspacio` mutation requires an argument of type `UpdateEspacioVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateEspacioVariables {
  id: UUIDString;
  nombre: string;
  rubroId?: UUIDString | null;
  rubroPersonalizado?: string | null;
}
```
### Return Type
Recall that executing the `UpdateEspacio` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateEspacioData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateEspacioData {
  espacio_update?: Espacio_Key | null;
}
```
### Using `UpdateEspacio`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateEspacio, UpdateEspacioVariables } from '@antologico/dataconnect';

// The `UpdateEspacio` mutation requires an argument of type `UpdateEspacioVariables`:
const updateEspacioVars: UpdateEspacioVariables = {
  id: ..., 
  nombre: ..., 
  rubroId: ..., // optional
  rubroPersonalizado: ..., // optional
};

// Call the `updateEspacio()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateEspacio(updateEspacioVars);
// Variables can be defined inline as well.
const { data } = await updateEspacio({ id: ..., nombre: ..., rubroId: ..., rubroPersonalizado: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateEspacio(dataConnect, updateEspacioVars);

console.log(data.espacio_update);

// Or, you can use the `Promise` API.
updateEspacio(updateEspacioVars).then((response) => {
  const data = response.data;
  console.log(data.espacio_update);
});
```

### Using `UpdateEspacio`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateEspacioRef, UpdateEspacioVariables } from '@antologico/dataconnect';

// The `UpdateEspacio` mutation requires an argument of type `UpdateEspacioVariables`:
const updateEspacioVars: UpdateEspacioVariables = {
  id: ..., 
  nombre: ..., 
  rubroId: ..., // optional
  rubroPersonalizado: ..., // optional
};

// Call the `updateEspacioRef()` function to get a reference to the mutation.
const ref = updateEspacioRef(updateEspacioVars);
// Variables can be defined inline as well.
const ref = updateEspacioRef({ id: ..., nombre: ..., rubroId: ..., rubroPersonalizado: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateEspacioRef(dataConnect, updateEspacioVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.espacio_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.espacio_update);
});
```

## UpdateEspacioDirecciones
You can execute the `UpdateEspacioDirecciones` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateEspacioDirecciones(vars: UpdateEspacioDireccionesVariables): MutationPromise<UpdateEspacioDireccionesData, UpdateEspacioDireccionesVariables>;

interface UpdateEspacioDireccionesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateEspacioDireccionesVariables): MutationRef<UpdateEspacioDireccionesData, UpdateEspacioDireccionesVariables>;
}
export const updateEspacioDireccionesRef: UpdateEspacioDireccionesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateEspacioDirecciones(dc: DataConnect, vars: UpdateEspacioDireccionesVariables): MutationPromise<UpdateEspacioDireccionesData, UpdateEspacioDireccionesVariables>;

interface UpdateEspacioDireccionesRef {
  ...
  (dc: DataConnect, vars: UpdateEspacioDireccionesVariables): MutationRef<UpdateEspacioDireccionesData, UpdateEspacioDireccionesVariables>;
}
export const updateEspacioDireccionesRef: UpdateEspacioDireccionesRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateEspacioDireccionesRef:
```typescript
const name = updateEspacioDireccionesRef.operationName;
console.log(name);
```

### Variables
The `UpdateEspacioDirecciones` mutation requires an argument of type `UpdateEspacioDireccionesVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateEspacioDireccionesVariables {
  id: UUIDString;
  direcciones?: unknown | null;
}
```
### Return Type
Recall that executing the `UpdateEspacioDirecciones` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateEspacioDireccionesData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateEspacioDireccionesData {
  espacio_update?: Espacio_Key | null;
}
```
### Using `UpdateEspacioDirecciones`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateEspacioDirecciones, UpdateEspacioDireccionesVariables } from '@antologico/dataconnect';

// The `UpdateEspacioDirecciones` mutation requires an argument of type `UpdateEspacioDireccionesVariables`:
const updateEspacioDireccionesVars: UpdateEspacioDireccionesVariables = {
  id: ..., 
  direcciones: ..., // optional
};

// Call the `updateEspacioDirecciones()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateEspacioDirecciones(updateEspacioDireccionesVars);
// Variables can be defined inline as well.
const { data } = await updateEspacioDirecciones({ id: ..., direcciones: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateEspacioDirecciones(dataConnect, updateEspacioDireccionesVars);

console.log(data.espacio_update);

// Or, you can use the `Promise` API.
updateEspacioDirecciones(updateEspacioDireccionesVars).then((response) => {
  const data = response.data;
  console.log(data.espacio_update);
});
```

### Using `UpdateEspacioDirecciones`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateEspacioDireccionesRef, UpdateEspacioDireccionesVariables } from '@antologico/dataconnect';

// The `UpdateEspacioDirecciones` mutation requires an argument of type `UpdateEspacioDireccionesVariables`:
const updateEspacioDireccionesVars: UpdateEspacioDireccionesVariables = {
  id: ..., 
  direcciones: ..., // optional
};

// Call the `updateEspacioDireccionesRef()` function to get a reference to the mutation.
const ref = updateEspacioDireccionesRef(updateEspacioDireccionesVars);
// Variables can be defined inline as well.
const ref = updateEspacioDireccionesRef({ id: ..., direcciones: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateEspacioDireccionesRef(dataConnect, updateEspacioDireccionesVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.espacio_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.espacio_update);
});
```

## UpdateEspacioTyC
You can execute the `UpdateEspacioTyC` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateEspacioTyC(vars: UpdateEspacioTyCVariables): MutationPromise<UpdateEspacioTyCData, UpdateEspacioTyCVariables>;

interface UpdateEspacioTyCRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateEspacioTyCVariables): MutationRef<UpdateEspacioTyCData, UpdateEspacioTyCVariables>;
}
export const updateEspacioTyCRef: UpdateEspacioTyCRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateEspacioTyC(dc: DataConnect, vars: UpdateEspacioTyCVariables): MutationPromise<UpdateEspacioTyCData, UpdateEspacioTyCVariables>;

interface UpdateEspacioTyCRef {
  ...
  (dc: DataConnect, vars: UpdateEspacioTyCVariables): MutationRef<UpdateEspacioTyCData, UpdateEspacioTyCVariables>;
}
export const updateEspacioTyCRef: UpdateEspacioTyCRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateEspacioTyCRef:
```typescript
const name = updateEspacioTyCRef.operationName;
console.log(name);
```

### Variables
The `UpdateEspacioTyC` mutation requires an argument of type `UpdateEspacioTyCVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateEspacioTyCVariables {
  id: UUIDString;
  terminosCondiciones?: string | null;
  tycEnabled: boolean;
}
```
### Return Type
Recall that executing the `UpdateEspacioTyC` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateEspacioTyCData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateEspacioTyCData {
  espacio_update?: Espacio_Key | null;
}
```
### Using `UpdateEspacioTyC`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateEspacioTyC, UpdateEspacioTyCVariables } from '@antologico/dataconnect';

// The `UpdateEspacioTyC` mutation requires an argument of type `UpdateEspacioTyCVariables`:
const updateEspacioTyCVars: UpdateEspacioTyCVariables = {
  id: ..., 
  terminosCondiciones: ..., // optional
  tycEnabled: ..., 
};

// Call the `updateEspacioTyC()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateEspacioTyC(updateEspacioTyCVars);
// Variables can be defined inline as well.
const { data } = await updateEspacioTyC({ id: ..., terminosCondiciones: ..., tycEnabled: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateEspacioTyC(dataConnect, updateEspacioTyCVars);

console.log(data.espacio_update);

// Or, you can use the `Promise` API.
updateEspacioTyC(updateEspacioTyCVars).then((response) => {
  const data = response.data;
  console.log(data.espacio_update);
});
```

### Using `UpdateEspacioTyC`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateEspacioTyCRef, UpdateEspacioTyCVariables } from '@antologico/dataconnect';

// The `UpdateEspacioTyC` mutation requires an argument of type `UpdateEspacioTyCVariables`:
const updateEspacioTyCVars: UpdateEspacioTyCVariables = {
  id: ..., 
  terminosCondiciones: ..., // optional
  tycEnabled: ..., 
};

// Call the `updateEspacioTyCRef()` function to get a reference to the mutation.
const ref = updateEspacioTyCRef(updateEspacioTyCVars);
// Variables can be defined inline as well.
const ref = updateEspacioTyCRef({ id: ..., terminosCondiciones: ..., tycEnabled: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateEspacioTyCRef(dataConnect, updateEspacioTyCVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.espacio_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.espacio_update);
});
```

## UpdateEspacioSlug
You can execute the `UpdateEspacioSlug` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateEspacioSlug(vars: UpdateEspacioSlugVariables): MutationPromise<UpdateEspacioSlugData, UpdateEspacioSlugVariables>;

interface UpdateEspacioSlugRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateEspacioSlugVariables): MutationRef<UpdateEspacioSlugData, UpdateEspacioSlugVariables>;
}
export const updateEspacioSlugRef: UpdateEspacioSlugRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateEspacioSlug(dc: DataConnect, vars: UpdateEspacioSlugVariables): MutationPromise<UpdateEspacioSlugData, UpdateEspacioSlugVariables>;

interface UpdateEspacioSlugRef {
  ...
  (dc: DataConnect, vars: UpdateEspacioSlugVariables): MutationRef<UpdateEspacioSlugData, UpdateEspacioSlugVariables>;
}
export const updateEspacioSlugRef: UpdateEspacioSlugRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateEspacioSlugRef:
```typescript
const name = updateEspacioSlugRef.operationName;
console.log(name);
```

### Variables
The `UpdateEspacioSlug` mutation requires an argument of type `UpdateEspacioSlugVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateEspacioSlugVariables {
  id: UUIDString;
  slug: string;
}
```
### Return Type
Recall that executing the `UpdateEspacioSlug` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateEspacioSlugData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateEspacioSlugData {
  espacio_update?: Espacio_Key | null;
}
```
### Using `UpdateEspacioSlug`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateEspacioSlug, UpdateEspacioSlugVariables } from '@antologico/dataconnect';

// The `UpdateEspacioSlug` mutation requires an argument of type `UpdateEspacioSlugVariables`:
const updateEspacioSlugVars: UpdateEspacioSlugVariables = {
  id: ..., 
  slug: ..., 
};

// Call the `updateEspacioSlug()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateEspacioSlug(updateEspacioSlugVars);
// Variables can be defined inline as well.
const { data } = await updateEspacioSlug({ id: ..., slug: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateEspacioSlug(dataConnect, updateEspacioSlugVars);

console.log(data.espacio_update);

// Or, you can use the `Promise` API.
updateEspacioSlug(updateEspacioSlugVars).then((response) => {
  const data = response.data;
  console.log(data.espacio_update);
});
```

### Using `UpdateEspacioSlug`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateEspacioSlugRef, UpdateEspacioSlugVariables } from '@antologico/dataconnect';

// The `UpdateEspacioSlug` mutation requires an argument of type `UpdateEspacioSlugVariables`:
const updateEspacioSlugVars: UpdateEspacioSlugVariables = {
  id: ..., 
  slug: ..., 
};

// Call the `updateEspacioSlugRef()` function to get a reference to the mutation.
const ref = updateEspacioSlugRef(updateEspacioSlugVars);
// Variables can be defined inline as well.
const ref = updateEspacioSlugRef({ id: ..., slug: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateEspacioSlugRef(dataConnect, updateEspacioSlugVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.espacio_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.espacio_update);
});
```

## CreateWorkshop
You can execute the `CreateWorkshop` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createWorkshop(vars: CreateWorkshopVariables): MutationPromise<CreateWorkshopData, CreateWorkshopVariables>;

interface CreateWorkshopRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateWorkshopVariables): MutationRef<CreateWorkshopData, CreateWorkshopVariables>;
}
export const createWorkshopRef: CreateWorkshopRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createWorkshop(dc: DataConnect, vars: CreateWorkshopVariables): MutationPromise<CreateWorkshopData, CreateWorkshopVariables>;

interface CreateWorkshopRef {
  ...
  (dc: DataConnect, vars: CreateWorkshopVariables): MutationRef<CreateWorkshopData, CreateWorkshopVariables>;
}
export const createWorkshopRef: CreateWorkshopRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createWorkshopRef:
```typescript
const name = createWorkshopRef.operationName;
console.log(name);
```

### Variables
The `CreateWorkshop` mutation requires an argument of type `CreateWorkshopVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
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
  esBorrador?: boolean | null;
}
```
### Return Type
Recall that executing the `CreateWorkshop` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateWorkshopData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateWorkshopData {
  workshop_insert: Workshop_Key;
}
```
### Using `CreateWorkshop`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createWorkshop, CreateWorkshopVariables } from '@antologico/dataconnect';

// The `CreateWorkshop` mutation requires an argument of type `CreateWorkshopVariables`:
const createWorkshopVars: CreateWorkshopVariables = {
  espacioId: ..., 
  nombre: ..., 
  tipo: ..., // optional
  descripcion: ..., // optional
  cuposTotales: ..., 
  cuposDisponibles: ..., 
  precio: ..., 
  fecha: ..., 
  duracionHoras: ..., // optional
  duracionMinutos: ..., // optional
  experienciaPrevia: ..., // optional
  scheduleData: ..., // optional
  headerType: ..., // optional
  headerValue: ..., // optional
  metodosPago: ..., // optional
  estado: ..., // optional
  esBorrador: ..., // optional
};

// Call the `createWorkshop()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createWorkshop(createWorkshopVars);
// Variables can be defined inline as well.
const { data } = await createWorkshop({ espacioId: ..., nombre: ..., tipo: ..., descripcion: ..., cuposTotales: ..., cuposDisponibles: ..., precio: ..., fecha: ..., duracionHoras: ..., duracionMinutos: ..., experienciaPrevia: ..., scheduleData: ..., headerType: ..., headerValue: ..., metodosPago: ..., estado: ..., esBorrador: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createWorkshop(dataConnect, createWorkshopVars);

console.log(data.workshop_insert);

// Or, you can use the `Promise` API.
createWorkshop(createWorkshopVars).then((response) => {
  const data = response.data;
  console.log(data.workshop_insert);
});
```

### Using `CreateWorkshop`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createWorkshopRef, CreateWorkshopVariables } from '@antologico/dataconnect';

// The `CreateWorkshop` mutation requires an argument of type `CreateWorkshopVariables`:
const createWorkshopVars: CreateWorkshopVariables = {
  espacioId: ..., 
  nombre: ..., 
  tipo: ..., // optional
  descripcion: ..., // optional
  cuposTotales: ..., 
  cuposDisponibles: ..., 
  precio: ..., 
  fecha: ..., 
  duracionHoras: ..., // optional
  duracionMinutos: ..., // optional
  experienciaPrevia: ..., // optional
  scheduleData: ..., // optional
  headerType: ..., // optional
  headerValue: ..., // optional
  metodosPago: ..., // optional
  estado: ..., // optional
  esBorrador: ..., // optional
};

// Call the `createWorkshopRef()` function to get a reference to the mutation.
const ref = createWorkshopRef(createWorkshopVars);
// Variables can be defined inline as well.
const ref = createWorkshopRef({ espacioId: ..., nombre: ..., tipo: ..., descripcion: ..., cuposTotales: ..., cuposDisponibles: ..., precio: ..., fecha: ..., duracionHoras: ..., duracionMinutos: ..., experienciaPrevia: ..., scheduleData: ..., headerType: ..., headerValue: ..., metodosPago: ..., estado: ..., esBorrador: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createWorkshopRef(dataConnect, createWorkshopVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.workshop_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.workshop_insert);
});
```

## UpdateWorkshop
You can execute the `UpdateWorkshop` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateWorkshop(vars: UpdateWorkshopVariables): MutationPromise<UpdateWorkshopData, UpdateWorkshopVariables>;

interface UpdateWorkshopRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateWorkshopVariables): MutationRef<UpdateWorkshopData, UpdateWorkshopVariables>;
}
export const updateWorkshopRef: UpdateWorkshopRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateWorkshop(dc: DataConnect, vars: UpdateWorkshopVariables): MutationPromise<UpdateWorkshopData, UpdateWorkshopVariables>;

interface UpdateWorkshopRef {
  ...
  (dc: DataConnect, vars: UpdateWorkshopVariables): MutationRef<UpdateWorkshopData, UpdateWorkshopVariables>;
}
export const updateWorkshopRef: UpdateWorkshopRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateWorkshopRef:
```typescript
const name = updateWorkshopRef.operationName;
console.log(name);
```

### Variables
The `UpdateWorkshop` mutation requires an argument of type `UpdateWorkshopVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
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
  esBorrador?: boolean | null;
}
```
### Return Type
Recall that executing the `UpdateWorkshop` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateWorkshopData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateWorkshopData {
  workshop_update?: Workshop_Key | null;
}
```
### Using `UpdateWorkshop`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateWorkshop, UpdateWorkshopVariables } from '@antologico/dataconnect';

// The `UpdateWorkshop` mutation requires an argument of type `UpdateWorkshopVariables`:
const updateWorkshopVars: UpdateWorkshopVariables = {
  id: ..., 
  espacioId: ..., 
  nombre: ..., 
  tipo: ..., // optional
  descripcion: ..., // optional
  cuposTotales: ..., 
  cuposDisponibles: ..., 
  precio: ..., 
  fecha: ..., 
  duracionHoras: ..., // optional
  duracionMinutos: ..., // optional
  experienciaPrevia: ..., // optional
  scheduleData: ..., // optional
  headerType: ..., // optional
  headerValue: ..., // optional
  metodosPago: ..., // optional
  estado: ..., // optional
  esBorrador: ..., // optional
};

// Call the `updateWorkshop()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateWorkshop(updateWorkshopVars);
// Variables can be defined inline as well.
const { data } = await updateWorkshop({ id: ..., espacioId: ..., nombre: ..., tipo: ..., descripcion: ..., cuposTotales: ..., cuposDisponibles: ..., precio: ..., fecha: ..., duracionHoras: ..., duracionMinutos: ..., experienciaPrevia: ..., scheduleData: ..., headerType: ..., headerValue: ..., metodosPago: ..., estado: ..., esBorrador: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateWorkshop(dataConnect, updateWorkshopVars);

console.log(data.workshop_update);

// Or, you can use the `Promise` API.
updateWorkshop(updateWorkshopVars).then((response) => {
  const data = response.data;
  console.log(data.workshop_update);
});
```

### Using `UpdateWorkshop`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateWorkshopRef, UpdateWorkshopVariables } from '@antologico/dataconnect';

// The `UpdateWorkshop` mutation requires an argument of type `UpdateWorkshopVariables`:
const updateWorkshopVars: UpdateWorkshopVariables = {
  id: ..., 
  espacioId: ..., 
  nombre: ..., 
  tipo: ..., // optional
  descripcion: ..., // optional
  cuposTotales: ..., 
  cuposDisponibles: ..., 
  precio: ..., 
  fecha: ..., 
  duracionHoras: ..., // optional
  duracionMinutos: ..., // optional
  experienciaPrevia: ..., // optional
  scheduleData: ..., // optional
  headerType: ..., // optional
  headerValue: ..., // optional
  metodosPago: ..., // optional
  estado: ..., // optional
  esBorrador: ..., // optional
};

// Call the `updateWorkshopRef()` function to get a reference to the mutation.
const ref = updateWorkshopRef(updateWorkshopVars);
// Variables can be defined inline as well.
const ref = updateWorkshopRef({ id: ..., espacioId: ..., nombre: ..., tipo: ..., descripcion: ..., cuposTotales: ..., cuposDisponibles: ..., precio: ..., fecha: ..., duracionHoras: ..., duracionMinutos: ..., experienciaPrevia: ..., scheduleData: ..., headerType: ..., headerValue: ..., metodosPago: ..., estado: ..., esBorrador: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateWorkshopRef(dataConnect, updateWorkshopVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.workshop_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.workshop_update);
});
```

## UpdateWorkshopEstado
You can execute the `UpdateWorkshopEstado` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateWorkshopEstado(vars: UpdateWorkshopEstadoVariables): MutationPromise<UpdateWorkshopEstadoData, UpdateWorkshopEstadoVariables>;

interface UpdateWorkshopEstadoRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateWorkshopEstadoVariables): MutationRef<UpdateWorkshopEstadoData, UpdateWorkshopEstadoVariables>;
}
export const updateWorkshopEstadoRef: UpdateWorkshopEstadoRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateWorkshopEstado(dc: DataConnect, vars: UpdateWorkshopEstadoVariables): MutationPromise<UpdateWorkshopEstadoData, UpdateWorkshopEstadoVariables>;

interface UpdateWorkshopEstadoRef {
  ...
  (dc: DataConnect, vars: UpdateWorkshopEstadoVariables): MutationRef<UpdateWorkshopEstadoData, UpdateWorkshopEstadoVariables>;
}
export const updateWorkshopEstadoRef: UpdateWorkshopEstadoRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateWorkshopEstadoRef:
```typescript
const name = updateWorkshopEstadoRef.operationName;
console.log(name);
```

### Variables
The `UpdateWorkshopEstado` mutation requires an argument of type `UpdateWorkshopEstadoVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateWorkshopEstadoVariables {
  id: UUIDString;
  espacioId: UUIDString;
  estado: EstadoWorkshop;
  cuposDisponibles: number;
}
```
### Return Type
Recall that executing the `UpdateWorkshopEstado` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateWorkshopEstadoData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateWorkshopEstadoData {
  workshop_update?: Workshop_Key | null;
}
```
### Using `UpdateWorkshopEstado`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateWorkshopEstado, UpdateWorkshopEstadoVariables } from '@antologico/dataconnect';

// The `UpdateWorkshopEstado` mutation requires an argument of type `UpdateWorkshopEstadoVariables`:
const updateWorkshopEstadoVars: UpdateWorkshopEstadoVariables = {
  id: ..., 
  espacioId: ..., 
  estado: ..., 
  cuposDisponibles: ..., 
};

// Call the `updateWorkshopEstado()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateWorkshopEstado(updateWorkshopEstadoVars);
// Variables can be defined inline as well.
const { data } = await updateWorkshopEstado({ id: ..., espacioId: ..., estado: ..., cuposDisponibles: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateWorkshopEstado(dataConnect, updateWorkshopEstadoVars);

console.log(data.workshop_update);

// Or, you can use the `Promise` API.
updateWorkshopEstado(updateWorkshopEstadoVars).then((response) => {
  const data = response.data;
  console.log(data.workshop_update);
});
```

### Using `UpdateWorkshopEstado`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateWorkshopEstadoRef, UpdateWorkshopEstadoVariables } from '@antologico/dataconnect';

// The `UpdateWorkshopEstado` mutation requires an argument of type `UpdateWorkshopEstadoVariables`:
const updateWorkshopEstadoVars: UpdateWorkshopEstadoVariables = {
  id: ..., 
  espacioId: ..., 
  estado: ..., 
  cuposDisponibles: ..., 
};

// Call the `updateWorkshopEstadoRef()` function to get a reference to the mutation.
const ref = updateWorkshopEstadoRef(updateWorkshopEstadoVars);
// Variables can be defined inline as well.
const ref = updateWorkshopEstadoRef({ id: ..., espacioId: ..., estado: ..., cuposDisponibles: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateWorkshopEstadoRef(dataConnect, updateWorkshopEstadoVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.workshop_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.workshop_update);
});
```

## DeleteWorkshop
You can execute the `DeleteWorkshop` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deleteWorkshop(vars: DeleteWorkshopVariables): MutationPromise<DeleteWorkshopData, DeleteWorkshopVariables>;

interface DeleteWorkshopRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteWorkshopVariables): MutationRef<DeleteWorkshopData, DeleteWorkshopVariables>;
}
export const deleteWorkshopRef: DeleteWorkshopRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteWorkshop(dc: DataConnect, vars: DeleteWorkshopVariables): MutationPromise<DeleteWorkshopData, DeleteWorkshopVariables>;

interface DeleteWorkshopRef {
  ...
  (dc: DataConnect, vars: DeleteWorkshopVariables): MutationRef<DeleteWorkshopData, DeleteWorkshopVariables>;
}
export const deleteWorkshopRef: DeleteWorkshopRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteWorkshopRef:
```typescript
const name = deleteWorkshopRef.operationName;
console.log(name);
```

### Variables
The `DeleteWorkshop` mutation requires an argument of type `DeleteWorkshopVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteWorkshopVariables {
  id: UUIDString;
  espacioId: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteWorkshop` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteWorkshopData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteWorkshopData {
  workshop_delete?: Workshop_Key | null;
}
```
### Using `DeleteWorkshop`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteWorkshop, DeleteWorkshopVariables } from '@antologico/dataconnect';

// The `DeleteWorkshop` mutation requires an argument of type `DeleteWorkshopVariables`:
const deleteWorkshopVars: DeleteWorkshopVariables = {
  id: ..., 
  espacioId: ..., 
};

// Call the `deleteWorkshop()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteWorkshop(deleteWorkshopVars);
// Variables can be defined inline as well.
const { data } = await deleteWorkshop({ id: ..., espacioId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteWorkshop(dataConnect, deleteWorkshopVars);

console.log(data.workshop_delete);

// Or, you can use the `Promise` API.
deleteWorkshop(deleteWorkshopVars).then((response) => {
  const data = response.data;
  console.log(data.workshop_delete);
});
```

### Using `DeleteWorkshop`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteWorkshopRef, DeleteWorkshopVariables } from '@antologico/dataconnect';

// The `DeleteWorkshop` mutation requires an argument of type `DeleteWorkshopVariables`:
const deleteWorkshopVars: DeleteWorkshopVariables = {
  id: ..., 
  espacioId: ..., 
};

// Call the `deleteWorkshopRef()` function to get a reference to the mutation.
const ref = deleteWorkshopRef(deleteWorkshopVars);
// Variables can be defined inline as well.
const ref = deleteWorkshopRef({ id: ..., espacioId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteWorkshopRef(dataConnect, deleteWorkshopVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.workshop_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.workshop_delete);
});
```

## SolicitarCancelacionEspacio
You can execute the `SolicitarCancelacionEspacio` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
solicitarCancelacionEspacio(vars: SolicitarCancelacionEspacioVariables): MutationPromise<SolicitarCancelacionEspacioData, SolicitarCancelacionEspacioVariables>;

interface SolicitarCancelacionEspacioRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: SolicitarCancelacionEspacioVariables): MutationRef<SolicitarCancelacionEspacioData, SolicitarCancelacionEspacioVariables>;
}
export const solicitarCancelacionEspacioRef: SolicitarCancelacionEspacioRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
solicitarCancelacionEspacio(dc: DataConnect, vars: SolicitarCancelacionEspacioVariables): MutationPromise<SolicitarCancelacionEspacioData, SolicitarCancelacionEspacioVariables>;

interface SolicitarCancelacionEspacioRef {
  ...
  (dc: DataConnect, vars: SolicitarCancelacionEspacioVariables): MutationRef<SolicitarCancelacionEspacioData, SolicitarCancelacionEspacioVariables>;
}
export const solicitarCancelacionEspacioRef: SolicitarCancelacionEspacioRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the solicitarCancelacionEspacioRef:
```typescript
const name = solicitarCancelacionEspacioRef.operationName;
console.log(name);
```

### Variables
The `SolicitarCancelacionEspacio` mutation requires an argument of type `SolicitarCancelacionEspacioVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface SolicitarCancelacionEspacioVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `SolicitarCancelacionEspacio` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `SolicitarCancelacionEspacioData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface SolicitarCancelacionEspacioData {
  espacio_update?: Espacio_Key | null;
}
```
### Using `SolicitarCancelacionEspacio`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, solicitarCancelacionEspacio, SolicitarCancelacionEspacioVariables } from '@antologico/dataconnect';

// The `SolicitarCancelacionEspacio` mutation requires an argument of type `SolicitarCancelacionEspacioVariables`:
const solicitarCancelacionEspacioVars: SolicitarCancelacionEspacioVariables = {
  id: ..., 
};

// Call the `solicitarCancelacionEspacio()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await solicitarCancelacionEspacio(solicitarCancelacionEspacioVars);
// Variables can be defined inline as well.
const { data } = await solicitarCancelacionEspacio({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await solicitarCancelacionEspacio(dataConnect, solicitarCancelacionEspacioVars);

console.log(data.espacio_update);

// Or, you can use the `Promise` API.
solicitarCancelacionEspacio(solicitarCancelacionEspacioVars).then((response) => {
  const data = response.data;
  console.log(data.espacio_update);
});
```

### Using `SolicitarCancelacionEspacio`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, solicitarCancelacionEspacioRef, SolicitarCancelacionEspacioVariables } from '@antologico/dataconnect';

// The `SolicitarCancelacionEspacio` mutation requires an argument of type `SolicitarCancelacionEspacioVariables`:
const solicitarCancelacionEspacioVars: SolicitarCancelacionEspacioVariables = {
  id: ..., 
};

// Call the `solicitarCancelacionEspacioRef()` function to get a reference to the mutation.
const ref = solicitarCancelacionEspacioRef(solicitarCancelacionEspacioVars);
// Variables can be defined inline as well.
const ref = solicitarCancelacionEspacioRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = solicitarCancelacionEspacioRef(dataConnect, solicitarCancelacionEspacioVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.espacio_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.espacio_update);
});
```

## ReactivarSuscripcionEspacio
You can execute the `ReactivarSuscripcionEspacio` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
reactivarSuscripcionEspacio(vars: ReactivarSuscripcionEspacioVariables): MutationPromise<ReactivarSuscripcionEspacioData, ReactivarSuscripcionEspacioVariables>;

interface ReactivarSuscripcionEspacioRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ReactivarSuscripcionEspacioVariables): MutationRef<ReactivarSuscripcionEspacioData, ReactivarSuscripcionEspacioVariables>;
}
export const reactivarSuscripcionEspacioRef: ReactivarSuscripcionEspacioRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
reactivarSuscripcionEspacio(dc: DataConnect, vars: ReactivarSuscripcionEspacioVariables): MutationPromise<ReactivarSuscripcionEspacioData, ReactivarSuscripcionEspacioVariables>;

interface ReactivarSuscripcionEspacioRef {
  ...
  (dc: DataConnect, vars: ReactivarSuscripcionEspacioVariables): MutationRef<ReactivarSuscripcionEspacioData, ReactivarSuscripcionEspacioVariables>;
}
export const reactivarSuscripcionEspacioRef: ReactivarSuscripcionEspacioRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the reactivarSuscripcionEspacioRef:
```typescript
const name = reactivarSuscripcionEspacioRef.operationName;
console.log(name);
```

### Variables
The `ReactivarSuscripcionEspacio` mutation requires an argument of type `ReactivarSuscripcionEspacioVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ReactivarSuscripcionEspacioVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `ReactivarSuscripcionEspacio` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ReactivarSuscripcionEspacioData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ReactivarSuscripcionEspacioData {
  espacio_update?: Espacio_Key | null;
}
```
### Using `ReactivarSuscripcionEspacio`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, reactivarSuscripcionEspacio, ReactivarSuscripcionEspacioVariables } from '@antologico/dataconnect';

// The `ReactivarSuscripcionEspacio` mutation requires an argument of type `ReactivarSuscripcionEspacioVariables`:
const reactivarSuscripcionEspacioVars: ReactivarSuscripcionEspacioVariables = {
  id: ..., 
};

// Call the `reactivarSuscripcionEspacio()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await reactivarSuscripcionEspacio(reactivarSuscripcionEspacioVars);
// Variables can be defined inline as well.
const { data } = await reactivarSuscripcionEspacio({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await reactivarSuscripcionEspacio(dataConnect, reactivarSuscripcionEspacioVars);

console.log(data.espacio_update);

// Or, you can use the `Promise` API.
reactivarSuscripcionEspacio(reactivarSuscripcionEspacioVars).then((response) => {
  const data = response.data;
  console.log(data.espacio_update);
});
```

### Using `ReactivarSuscripcionEspacio`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, reactivarSuscripcionEspacioRef, ReactivarSuscripcionEspacioVariables } from '@antologico/dataconnect';

// The `ReactivarSuscripcionEspacio` mutation requires an argument of type `ReactivarSuscripcionEspacioVariables`:
const reactivarSuscripcionEspacioVars: ReactivarSuscripcionEspacioVariables = {
  id: ..., 
};

// Call the `reactivarSuscripcionEspacioRef()` function to get a reference to the mutation.
const ref = reactivarSuscripcionEspacioRef(reactivarSuscripcionEspacioVars);
// Variables can be defined inline as well.
const ref = reactivarSuscripcionEspacioRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = reactivarSuscripcionEspacioRef(dataConnect, reactivarSuscripcionEspacioVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.espacio_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.espacio_update);
});
```

## CancelarReserva
You can execute the `CancelarReserva` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
cancelarReserva(vars: CancelarReservaVariables): MutationPromise<CancelarReservaData, CancelarReservaVariables>;

interface CancelarReservaRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CancelarReservaVariables): MutationRef<CancelarReservaData, CancelarReservaVariables>;
}
export const cancelarReservaRef: CancelarReservaRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
cancelarReserva(dc: DataConnect, vars: CancelarReservaVariables): MutationPromise<CancelarReservaData, CancelarReservaVariables>;

interface CancelarReservaRef {
  ...
  (dc: DataConnect, vars: CancelarReservaVariables): MutationRef<CancelarReservaData, CancelarReservaVariables>;
}
export const cancelarReservaRef: CancelarReservaRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the cancelarReservaRef:
```typescript
const name = cancelarReservaRef.operationName;
console.log(name);
```

### Variables
The `CancelarReserva` mutation requires an argument of type `CancelarReservaVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CancelarReservaVariables {
  id: UUIDString;
  workshopId: UUIDString;
}
```
### Return Type
Recall that executing the `CancelarReserva` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CancelarReservaData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CancelarReservaData {
  reserva_update?: Reserva_Key | null;
  workshop_update?: Workshop_Key | null;
}
```
### Using `CancelarReserva`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, cancelarReserva, CancelarReservaVariables } from '@antologico/dataconnect';

// The `CancelarReserva` mutation requires an argument of type `CancelarReservaVariables`:
const cancelarReservaVars: CancelarReservaVariables = {
  id: ..., 
  workshopId: ..., 
};

// Call the `cancelarReserva()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await cancelarReserva(cancelarReservaVars);
// Variables can be defined inline as well.
const { data } = await cancelarReserva({ id: ..., workshopId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await cancelarReserva(dataConnect, cancelarReservaVars);

console.log(data.reserva_update);
console.log(data.workshop_update);

// Or, you can use the `Promise` API.
cancelarReserva(cancelarReservaVars).then((response) => {
  const data = response.data;
  console.log(data.reserva_update);
  console.log(data.workshop_update);
});
```

### Using `CancelarReserva`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, cancelarReservaRef, CancelarReservaVariables } from '@antologico/dataconnect';

// The `CancelarReserva` mutation requires an argument of type `CancelarReservaVariables`:
const cancelarReservaVars: CancelarReservaVariables = {
  id: ..., 
  workshopId: ..., 
};

// Call the `cancelarReservaRef()` function to get a reference to the mutation.
const ref = cancelarReservaRef(cancelarReservaVars);
// Variables can be defined inline as well.
const ref = cancelarReservaRef({ id: ..., workshopId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = cancelarReservaRef(dataConnect, cancelarReservaVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.reserva_update);
console.log(data.workshop_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.reserva_update);
  console.log(data.workshop_update);
});
```

## CancelarWorkshopConReservas
You can execute the `CancelarWorkshopConReservas` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
cancelarWorkshopConReservas(vars: CancelarWorkshopConReservasVariables): MutationPromise<CancelarWorkshopConReservasData, CancelarWorkshopConReservasVariables>;

interface CancelarWorkshopConReservasRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CancelarWorkshopConReservasVariables): MutationRef<CancelarWorkshopConReservasData, CancelarWorkshopConReservasVariables>;
}
export const cancelarWorkshopConReservasRef: CancelarWorkshopConReservasRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
cancelarWorkshopConReservas(dc: DataConnect, vars: CancelarWorkshopConReservasVariables): MutationPromise<CancelarWorkshopConReservasData, CancelarWorkshopConReservasVariables>;

interface CancelarWorkshopConReservasRef {
  ...
  (dc: DataConnect, vars: CancelarWorkshopConReservasVariables): MutationRef<CancelarWorkshopConReservasData, CancelarWorkshopConReservasVariables>;
}
export const cancelarWorkshopConReservasRef: CancelarWorkshopConReservasRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the cancelarWorkshopConReservasRef:
```typescript
const name = cancelarWorkshopConReservasRef.operationName;
console.log(name);
```

### Variables
The `CancelarWorkshopConReservas` mutation requires an argument of type `CancelarWorkshopConReservasVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CancelarWorkshopConReservasVariables {
  id: UUIDString;
  espacioId: UUIDString;
}
```
### Return Type
Recall that executing the `CancelarWorkshopConReservas` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CancelarWorkshopConReservasData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CancelarWorkshopConReservasData {
  canceladas?: number | null;
}
```
### Using `CancelarWorkshopConReservas`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, cancelarWorkshopConReservas, CancelarWorkshopConReservasVariables } from '@antologico/dataconnect';

// The `CancelarWorkshopConReservas` mutation requires an argument of type `CancelarWorkshopConReservasVariables`:
const cancelarWorkshopConReservasVars: CancelarWorkshopConReservasVariables = {
  id: ..., 
  espacioId: ..., 
};

// Call the `cancelarWorkshopConReservas()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await cancelarWorkshopConReservas(cancelarWorkshopConReservasVars);
// Variables can be defined inline as well.
const { data } = await cancelarWorkshopConReservas({ id: ..., espacioId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await cancelarWorkshopConReservas(dataConnect, cancelarWorkshopConReservasVars);

console.log(data.canceladas);

// Or, you can use the `Promise` API.
cancelarWorkshopConReservas(cancelarWorkshopConReservasVars).then((response) => {
  const data = response.data;
  console.log(data.canceladas);
});
```

### Using `CancelarWorkshopConReservas`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, cancelarWorkshopConReservasRef, CancelarWorkshopConReservasVariables } from '@antologico/dataconnect';

// The `CancelarWorkshopConReservas` mutation requires an argument of type `CancelarWorkshopConReservasVariables`:
const cancelarWorkshopConReservasVars: CancelarWorkshopConReservasVariables = {
  id: ..., 
  espacioId: ..., 
};

// Call the `cancelarWorkshopConReservasRef()` function to get a reference to the mutation.
const ref = cancelarWorkshopConReservasRef(cancelarWorkshopConReservasVars);
// Variables can be defined inline as well.
const ref = cancelarWorkshopConReservasRef({ id: ..., espacioId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = cancelarWorkshopConReservasRef(dataConnect, cancelarWorkshopConReservasVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.canceladas);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.canceladas);
});
```

## AdminUpdateEspacio
You can execute the `AdminUpdateEspacio` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
adminUpdateEspacio(vars: AdminUpdateEspacioVariables): MutationPromise<AdminUpdateEspacioData, AdminUpdateEspacioVariables>;

interface AdminUpdateEspacioRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: AdminUpdateEspacioVariables): MutationRef<AdminUpdateEspacioData, AdminUpdateEspacioVariables>;
}
export const adminUpdateEspacioRef: AdminUpdateEspacioRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
adminUpdateEspacio(dc: DataConnect, vars: AdminUpdateEspacioVariables): MutationPromise<AdminUpdateEspacioData, AdminUpdateEspacioVariables>;

interface AdminUpdateEspacioRef {
  ...
  (dc: DataConnect, vars: AdminUpdateEspacioVariables): MutationRef<AdminUpdateEspacioData, AdminUpdateEspacioVariables>;
}
export const adminUpdateEspacioRef: AdminUpdateEspacioRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the adminUpdateEspacioRef:
```typescript
const name = adminUpdateEspacioRef.operationName;
console.log(name);
```

### Variables
The `AdminUpdateEspacio` mutation requires an argument of type `AdminUpdateEspacioVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface AdminUpdateEspacioVariables {
  id: UUIDString;
  bloqueado?: boolean | null;
  trialStartedAt?: TimestampString | null;
  slug?: string | null;
  estado?: EstadoEspacio | null;
}
```
### Return Type
Recall that executing the `AdminUpdateEspacio` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AdminUpdateEspacioData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface AdminUpdateEspacioData {
  espacio_update?: Espacio_Key | null;
}
```
### Using `AdminUpdateEspacio`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, adminUpdateEspacio, AdminUpdateEspacioVariables } from '@antologico/dataconnect';

// The `AdminUpdateEspacio` mutation requires an argument of type `AdminUpdateEspacioVariables`:
const adminUpdateEspacioVars: AdminUpdateEspacioVariables = {
  id: ..., 
  bloqueado: ..., // optional
  trialStartedAt: ..., // optional
  slug: ..., // optional
  estado: ..., // optional
};

// Call the `adminUpdateEspacio()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await adminUpdateEspacio(adminUpdateEspacioVars);
// Variables can be defined inline as well.
const { data } = await adminUpdateEspacio({ id: ..., bloqueado: ..., trialStartedAt: ..., slug: ..., estado: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await adminUpdateEspacio(dataConnect, adminUpdateEspacioVars);

console.log(data.espacio_update);

// Or, you can use the `Promise` API.
adminUpdateEspacio(adminUpdateEspacioVars).then((response) => {
  const data = response.data;
  console.log(data.espacio_update);
});
```

### Using `AdminUpdateEspacio`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, adminUpdateEspacioRef, AdminUpdateEspacioVariables } from '@antologico/dataconnect';

// The `AdminUpdateEspacio` mutation requires an argument of type `AdminUpdateEspacioVariables`:
const adminUpdateEspacioVars: AdminUpdateEspacioVariables = {
  id: ..., 
  bloqueado: ..., // optional
  trialStartedAt: ..., // optional
  slug: ..., // optional
  estado: ..., // optional
};

// Call the `adminUpdateEspacioRef()` function to get a reference to the mutation.
const ref = adminUpdateEspacioRef(adminUpdateEspacioVars);
// Variables can be defined inline as well.
const ref = adminUpdateEspacioRef({ id: ..., bloqueado: ..., trialStartedAt: ..., slug: ..., estado: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = adminUpdateEspacioRef(dataConnect, adminUpdateEspacioVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.espacio_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.espacio_update);
});
```

## AdminDeleteEspacio
You can execute the `AdminDeleteEspacio` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
adminDeleteEspacio(vars: AdminDeleteEspacioVariables): MutationPromise<AdminDeleteEspacioData, AdminDeleteEspacioVariables>;

interface AdminDeleteEspacioRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: AdminDeleteEspacioVariables): MutationRef<AdminDeleteEspacioData, AdminDeleteEspacioVariables>;
}
export const adminDeleteEspacioRef: AdminDeleteEspacioRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
adminDeleteEspacio(dc: DataConnect, vars: AdminDeleteEspacioVariables): MutationPromise<AdminDeleteEspacioData, AdminDeleteEspacioVariables>;

interface AdminDeleteEspacioRef {
  ...
  (dc: DataConnect, vars: AdminDeleteEspacioVariables): MutationRef<AdminDeleteEspacioData, AdminDeleteEspacioVariables>;
}
export const adminDeleteEspacioRef: AdminDeleteEspacioRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the adminDeleteEspacioRef:
```typescript
const name = adminDeleteEspacioRef.operationName;
console.log(name);
```

### Variables
The `AdminDeleteEspacio` mutation requires an argument of type `AdminDeleteEspacioVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface AdminDeleteEspacioVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `AdminDeleteEspacio` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AdminDeleteEspacioData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface AdminDeleteEspacioData {
  deletedData?: number | null;
}
```
### Using `AdminDeleteEspacio`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, adminDeleteEspacio, AdminDeleteEspacioVariables } from '@antologico/dataconnect';

// The `AdminDeleteEspacio` mutation requires an argument of type `AdminDeleteEspacioVariables`:
const adminDeleteEspacioVars: AdminDeleteEspacioVariables = {
  id: ..., 
};

// Call the `adminDeleteEspacio()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await adminDeleteEspacio(adminDeleteEspacioVars);
// Variables can be defined inline as well.
const { data } = await adminDeleteEspacio({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await adminDeleteEspacio(dataConnect, adminDeleteEspacioVars);

console.log(data.deletedData);

// Or, you can use the `Promise` API.
adminDeleteEspacio(adminDeleteEspacioVars).then((response) => {
  const data = response.data;
  console.log(data.deletedData);
});
```

### Using `AdminDeleteEspacio`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, adminDeleteEspacioRef, AdminDeleteEspacioVariables } from '@antologico/dataconnect';

// The `AdminDeleteEspacio` mutation requires an argument of type `AdminDeleteEspacioVariables`:
const adminDeleteEspacioVars: AdminDeleteEspacioVariables = {
  id: ..., 
};

// Call the `adminDeleteEspacioRef()` function to get a reference to the mutation.
const ref = adminDeleteEspacioRef(adminDeleteEspacioVars);
// Variables can be defined inline as well.
const ref = adminDeleteEspacioRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = adminDeleteEspacioRef(dataConnect, adminDeleteEspacioVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.deletedData);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.deletedData);
});
```

## AdminDeleteProfesional
You can execute the `AdminDeleteProfesional` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
adminDeleteProfesional(vars: AdminDeleteProfesionalVariables): MutationPromise<AdminDeleteProfesionalData, AdminDeleteProfesionalVariables>;

interface AdminDeleteProfesionalRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: AdminDeleteProfesionalVariables): MutationRef<AdminDeleteProfesionalData, AdminDeleteProfesionalVariables>;
}
export const adminDeleteProfesionalRef: AdminDeleteProfesionalRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
adminDeleteProfesional(dc: DataConnect, vars: AdminDeleteProfesionalVariables): MutationPromise<AdminDeleteProfesionalData, AdminDeleteProfesionalVariables>;

interface AdminDeleteProfesionalRef {
  ...
  (dc: DataConnect, vars: AdminDeleteProfesionalVariables): MutationRef<AdminDeleteProfesionalData, AdminDeleteProfesionalVariables>;
}
export const adminDeleteProfesionalRef: AdminDeleteProfesionalRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the adminDeleteProfesionalRef:
```typescript
const name = adminDeleteProfesionalRef.operationName;
console.log(name);
```

### Variables
The `AdminDeleteProfesional` mutation requires an argument of type `AdminDeleteProfesionalVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface AdminDeleteProfesionalVariables {
  uid: string;
}
```
### Return Type
Recall that executing the `AdminDeleteProfesional` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AdminDeleteProfesionalData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface AdminDeleteProfesionalData {
  profesional_delete?: Profesional_Key | null;
}
```
### Using `AdminDeleteProfesional`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, adminDeleteProfesional, AdminDeleteProfesionalVariables } from '@antologico/dataconnect';

// The `AdminDeleteProfesional` mutation requires an argument of type `AdminDeleteProfesionalVariables`:
const adminDeleteProfesionalVars: AdminDeleteProfesionalVariables = {
  uid: ..., 
};

// Call the `adminDeleteProfesional()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await adminDeleteProfesional(adminDeleteProfesionalVars);
// Variables can be defined inline as well.
const { data } = await adminDeleteProfesional({ uid: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await adminDeleteProfesional(dataConnect, adminDeleteProfesionalVars);

console.log(data.profesional_delete);

// Or, you can use the `Promise` API.
adminDeleteProfesional(adminDeleteProfesionalVars).then((response) => {
  const data = response.data;
  console.log(data.profesional_delete);
});
```

### Using `AdminDeleteProfesional`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, adminDeleteProfesionalRef, AdminDeleteProfesionalVariables } from '@antologico/dataconnect';

// The `AdminDeleteProfesional` mutation requires an argument of type `AdminDeleteProfesionalVariables`:
const adminDeleteProfesionalVars: AdminDeleteProfesionalVariables = {
  uid: ..., 
};

// Call the `adminDeleteProfesionalRef()` function to get a reference to the mutation.
const ref = adminDeleteProfesionalRef(adminDeleteProfesionalVars);
// Variables can be defined inline as well.
const ref = adminDeleteProfesionalRef({ uid: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = adminDeleteProfesionalRef(dataConnect, adminDeleteProfesionalVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.profesional_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.profesional_delete);
});
```

## AdminUpsertProfesional
You can execute the `AdminUpsertProfesional` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
adminUpsertProfesional(vars: AdminUpsertProfesionalVariables): MutationPromise<AdminUpsertProfesionalData, AdminUpsertProfesionalVariables>;

interface AdminUpsertProfesionalRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: AdminUpsertProfesionalVariables): MutationRef<AdminUpsertProfesionalData, AdminUpsertProfesionalVariables>;
}
export const adminUpsertProfesionalRef: AdminUpsertProfesionalRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
adminUpsertProfesional(dc: DataConnect, vars: AdminUpsertProfesionalVariables): MutationPromise<AdminUpsertProfesionalData, AdminUpsertProfesionalVariables>;

interface AdminUpsertProfesionalRef {
  ...
  (dc: DataConnect, vars: AdminUpsertProfesionalVariables): MutationRef<AdminUpsertProfesionalData, AdminUpsertProfesionalVariables>;
}
export const adminUpsertProfesionalRef: AdminUpsertProfesionalRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the adminUpsertProfesionalRef:
```typescript
const name = adminUpsertProfesionalRef.operationName;
console.log(name);
```

### Variables
The `AdminUpsertProfesional` mutation requires an argument of type `AdminUpsertProfesionalVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface AdminUpsertProfesionalVariables {
  uid: string;
  nombre: string;
  email: string;
}
```
### Return Type
Recall that executing the `AdminUpsertProfesional` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AdminUpsertProfesionalData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface AdminUpsertProfesionalData {
  profesional_upsert: Profesional_Key;
}
```
### Using `AdminUpsertProfesional`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, adminUpsertProfesional, AdminUpsertProfesionalVariables } from '@antologico/dataconnect';

// The `AdminUpsertProfesional` mutation requires an argument of type `AdminUpsertProfesionalVariables`:
const adminUpsertProfesionalVars: AdminUpsertProfesionalVariables = {
  uid: ..., 
  nombre: ..., 
  email: ..., 
};

// Call the `adminUpsertProfesional()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await adminUpsertProfesional(adminUpsertProfesionalVars);
// Variables can be defined inline as well.
const { data } = await adminUpsertProfesional({ uid: ..., nombre: ..., email: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await adminUpsertProfesional(dataConnect, adminUpsertProfesionalVars);

console.log(data.profesional_upsert);

// Or, you can use the `Promise` API.
adminUpsertProfesional(adminUpsertProfesionalVars).then((response) => {
  const data = response.data;
  console.log(data.profesional_upsert);
});
```

### Using `AdminUpsertProfesional`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, adminUpsertProfesionalRef, AdminUpsertProfesionalVariables } from '@antologico/dataconnect';

// The `AdminUpsertProfesional` mutation requires an argument of type `AdminUpsertProfesionalVariables`:
const adminUpsertProfesionalVars: AdminUpsertProfesionalVariables = {
  uid: ..., 
  nombre: ..., 
  email: ..., 
};

// Call the `adminUpsertProfesionalRef()` function to get a reference to the mutation.
const ref = adminUpsertProfesionalRef(adminUpsertProfesionalVars);
// Variables can be defined inline as well.
const ref = adminUpsertProfesionalRef({ uid: ..., nombre: ..., email: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = adminUpsertProfesionalRef(dataConnect, adminUpsertProfesionalVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.profesional_upsert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.profesional_upsert);
});
```

## AdminEnsureProfesional
You can execute the `AdminEnsureProfesional` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
adminEnsureProfesional(vars: AdminEnsureProfesionalVariables): MutationPromise<AdminEnsureProfesionalData, AdminEnsureProfesionalVariables>;

interface AdminEnsureProfesionalRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: AdminEnsureProfesionalVariables): MutationRef<AdminEnsureProfesionalData, AdminEnsureProfesionalVariables>;
}
export const adminEnsureProfesionalRef: AdminEnsureProfesionalRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
adminEnsureProfesional(dc: DataConnect, vars: AdminEnsureProfesionalVariables): MutationPromise<AdminEnsureProfesionalData, AdminEnsureProfesionalVariables>;

interface AdminEnsureProfesionalRef {
  ...
  (dc: DataConnect, vars: AdminEnsureProfesionalVariables): MutationRef<AdminEnsureProfesionalData, AdminEnsureProfesionalVariables>;
}
export const adminEnsureProfesionalRef: AdminEnsureProfesionalRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the adminEnsureProfesionalRef:
```typescript
const name = adminEnsureProfesionalRef.operationName;
console.log(name);
```

### Variables
The `AdminEnsureProfesional` mutation requires an argument of type `AdminEnsureProfesionalVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface AdminEnsureProfesionalVariables {
  uid: string;
  nombre: string;
  email: string;
}
```
### Return Type
Recall that executing the `AdminEnsureProfesional` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AdminEnsureProfesionalData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface AdminEnsureProfesionalData {
  result?: number | null;
}
```
### Using `AdminEnsureProfesional`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, adminEnsureProfesional, AdminEnsureProfesionalVariables } from '@antologico/dataconnect';

// The `AdminEnsureProfesional` mutation requires an argument of type `AdminEnsureProfesionalVariables`:
const adminEnsureProfesionalVars: AdminEnsureProfesionalVariables = {
  uid: ..., 
  nombre: ..., 
  email: ..., 
};

// Call the `adminEnsureProfesional()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await adminEnsureProfesional(adminEnsureProfesionalVars);
// Variables can be defined inline as well.
const { data } = await adminEnsureProfesional({ uid: ..., nombre: ..., email: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await adminEnsureProfesional(dataConnect, adminEnsureProfesionalVars);

console.log(data.result);

// Or, you can use the `Promise` API.
adminEnsureProfesional(adminEnsureProfesionalVars).then((response) => {
  const data = response.data;
  console.log(data.result);
});
```

### Using `AdminEnsureProfesional`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, adminEnsureProfesionalRef, AdminEnsureProfesionalVariables } from '@antologico/dataconnect';

// The `AdminEnsureProfesional` mutation requires an argument of type `AdminEnsureProfesionalVariables`:
const adminEnsureProfesionalVars: AdminEnsureProfesionalVariables = {
  uid: ..., 
  nombre: ..., 
  email: ..., 
};

// Call the `adminEnsureProfesionalRef()` function to get a reference to the mutation.
const ref = adminEnsureProfesionalRef(adminEnsureProfesionalVars);
// Variables can be defined inline as well.
const ref = adminEnsureProfesionalRef({ uid: ..., nombre: ..., email: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = adminEnsureProfesionalRef(dataConnect, adminEnsureProfesionalVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.result);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.result);
});
```

## AdminCreateEspacioMigrate
You can execute the `AdminCreateEspacioMigrate` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
adminCreateEspacioMigrate(vars: AdminCreateEspacioMigrateVariables): MutationPromise<AdminCreateEspacioMigrateData, AdminCreateEspacioMigrateVariables>;

interface AdminCreateEspacioMigrateRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: AdminCreateEspacioMigrateVariables): MutationRef<AdminCreateEspacioMigrateData, AdminCreateEspacioMigrateVariables>;
}
export const adminCreateEspacioMigrateRef: AdminCreateEspacioMigrateRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
adminCreateEspacioMigrate(dc: DataConnect, vars: AdminCreateEspacioMigrateVariables): MutationPromise<AdminCreateEspacioMigrateData, AdminCreateEspacioMigrateVariables>;

interface AdminCreateEspacioMigrateRef {
  ...
  (dc: DataConnect, vars: AdminCreateEspacioMigrateVariables): MutationRef<AdminCreateEspacioMigrateData, AdminCreateEspacioMigrateVariables>;
}
export const adminCreateEspacioMigrateRef: AdminCreateEspacioMigrateRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the adminCreateEspacioMigrateRef:
```typescript
const name = adminCreateEspacioMigrateRef.operationName;
console.log(name);
```

### Variables
The `AdminCreateEspacioMigrate` mutation requires an argument of type `AdminCreateEspacioMigrateVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
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
```
### Return Type
Recall that executing the `AdminCreateEspacioMigrate` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AdminCreateEspacioMigrateData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface AdminCreateEspacioMigrateData {
  espacio_insert: Espacio_Key;
}
```
### Using `AdminCreateEspacioMigrate`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, adminCreateEspacioMigrate, AdminCreateEspacioMigrateVariables } from '@antologico/dataconnect';

// The `AdminCreateEspacioMigrate` mutation requires an argument of type `AdminCreateEspacioMigrateVariables`:
const adminCreateEspacioMigrateVars: AdminCreateEspacioMigrateVariables = {
  profesionalUid: ..., 
  nombre: ..., 
  rubroPersonalizado: ..., // optional
  slug: ..., // optional
  logoUrl: ..., // optional
  logoShape: ..., // optional
  logoScale: ..., // optional
  brandColors: ..., // optional
  brandFont: ..., // optional
  redesSociales: ..., // optional
  cobros: ..., // optional
  estado: ..., // optional
};

// Call the `adminCreateEspacioMigrate()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await adminCreateEspacioMigrate(adminCreateEspacioMigrateVars);
// Variables can be defined inline as well.
const { data } = await adminCreateEspacioMigrate({ profesionalUid: ..., nombre: ..., rubroPersonalizado: ..., slug: ..., logoUrl: ..., logoShape: ..., logoScale: ..., brandColors: ..., brandFont: ..., redesSociales: ..., cobros: ..., estado: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await adminCreateEspacioMigrate(dataConnect, adminCreateEspacioMigrateVars);

console.log(data.espacio_insert);

// Or, you can use the `Promise` API.
adminCreateEspacioMigrate(adminCreateEspacioMigrateVars).then((response) => {
  const data = response.data;
  console.log(data.espacio_insert);
});
```

### Using `AdminCreateEspacioMigrate`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, adminCreateEspacioMigrateRef, AdminCreateEspacioMigrateVariables } from '@antologico/dataconnect';

// The `AdminCreateEspacioMigrate` mutation requires an argument of type `AdminCreateEspacioMigrateVariables`:
const adminCreateEspacioMigrateVars: AdminCreateEspacioMigrateVariables = {
  profesionalUid: ..., 
  nombre: ..., 
  rubroPersonalizado: ..., // optional
  slug: ..., // optional
  logoUrl: ..., // optional
  logoShape: ..., // optional
  logoScale: ..., // optional
  brandColors: ..., // optional
  brandFont: ..., // optional
  redesSociales: ..., // optional
  cobros: ..., // optional
  estado: ..., // optional
};

// Call the `adminCreateEspacioMigrateRef()` function to get a reference to the mutation.
const ref = adminCreateEspacioMigrateRef(adminCreateEspacioMigrateVars);
// Variables can be defined inline as well.
const ref = adminCreateEspacioMigrateRef({ profesionalUid: ..., nombre: ..., rubroPersonalizado: ..., slug: ..., logoUrl: ..., logoShape: ..., logoScale: ..., brandColors: ..., brandFont: ..., redesSociales: ..., cobros: ..., estado: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = adminCreateEspacioMigrateRef(dataConnect, adminCreateEspacioMigrateVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.espacio_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.espacio_insert);
});
```

## AdminCreateWorkshopMigrate
You can execute the `AdminCreateWorkshopMigrate` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
adminCreateWorkshopMigrate(vars: AdminCreateWorkshopMigrateVariables): MutationPromise<AdminCreateWorkshopMigrateData, AdminCreateWorkshopMigrateVariables>;

interface AdminCreateWorkshopMigrateRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: AdminCreateWorkshopMigrateVariables): MutationRef<AdminCreateWorkshopMigrateData, AdminCreateWorkshopMigrateVariables>;
}
export const adminCreateWorkshopMigrateRef: AdminCreateWorkshopMigrateRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
adminCreateWorkshopMigrate(dc: DataConnect, vars: AdminCreateWorkshopMigrateVariables): MutationPromise<AdminCreateWorkshopMigrateData, AdminCreateWorkshopMigrateVariables>;

interface AdminCreateWorkshopMigrateRef {
  ...
  (dc: DataConnect, vars: AdminCreateWorkshopMigrateVariables): MutationRef<AdminCreateWorkshopMigrateData, AdminCreateWorkshopMigrateVariables>;
}
export const adminCreateWorkshopMigrateRef: AdminCreateWorkshopMigrateRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the adminCreateWorkshopMigrateRef:
```typescript
const name = adminCreateWorkshopMigrateRef.operationName;
console.log(name);
```

### Variables
The `AdminCreateWorkshopMigrate` mutation requires an argument of type `AdminCreateWorkshopMigrateVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
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
```
### Return Type
Recall that executing the `AdminCreateWorkshopMigrate` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AdminCreateWorkshopMigrateData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface AdminCreateWorkshopMigrateData {
  workshop_insert: Workshop_Key;
}
```
### Using `AdminCreateWorkshopMigrate`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, adminCreateWorkshopMigrate, AdminCreateWorkshopMigrateVariables } from '@antologico/dataconnect';

// The `AdminCreateWorkshopMigrate` mutation requires an argument of type `AdminCreateWorkshopMigrateVariables`:
const adminCreateWorkshopMigrateVars: AdminCreateWorkshopMigrateVariables = {
  espacioId: ..., 
  nombre: ..., 
  tipo: ..., // optional
  descripcion: ..., // optional
  cuposTotales: ..., 
  cuposDisponibles: ..., 
  precio: ..., 
  fecha: ..., 
  duracionHoras: ..., // optional
  duracionMinutos: ..., // optional
  experienciaPrevia: ..., // optional
  scheduleData: ..., // optional
  headerType: ..., // optional
  headerValue: ..., // optional
  metodosPago: ..., // optional
  estado: ..., // optional
};

// Call the `adminCreateWorkshopMigrate()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await adminCreateWorkshopMigrate(adminCreateWorkshopMigrateVars);
// Variables can be defined inline as well.
const { data } = await adminCreateWorkshopMigrate({ espacioId: ..., nombre: ..., tipo: ..., descripcion: ..., cuposTotales: ..., cuposDisponibles: ..., precio: ..., fecha: ..., duracionHoras: ..., duracionMinutos: ..., experienciaPrevia: ..., scheduleData: ..., headerType: ..., headerValue: ..., metodosPago: ..., estado: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await adminCreateWorkshopMigrate(dataConnect, adminCreateWorkshopMigrateVars);

console.log(data.workshop_insert);

// Or, you can use the `Promise` API.
adminCreateWorkshopMigrate(adminCreateWorkshopMigrateVars).then((response) => {
  const data = response.data;
  console.log(data.workshop_insert);
});
```

### Using `AdminCreateWorkshopMigrate`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, adminCreateWorkshopMigrateRef, AdminCreateWorkshopMigrateVariables } from '@antologico/dataconnect';

// The `AdminCreateWorkshopMigrate` mutation requires an argument of type `AdminCreateWorkshopMigrateVariables`:
const adminCreateWorkshopMigrateVars: AdminCreateWorkshopMigrateVariables = {
  espacioId: ..., 
  nombre: ..., 
  tipo: ..., // optional
  descripcion: ..., // optional
  cuposTotales: ..., 
  cuposDisponibles: ..., 
  precio: ..., 
  fecha: ..., 
  duracionHoras: ..., // optional
  duracionMinutos: ..., // optional
  experienciaPrevia: ..., // optional
  scheduleData: ..., // optional
  headerType: ..., // optional
  headerValue: ..., // optional
  metodosPago: ..., // optional
  estado: ..., // optional
};

// Call the `adminCreateWorkshopMigrateRef()` function to get a reference to the mutation.
const ref = adminCreateWorkshopMigrateRef(adminCreateWorkshopMigrateVars);
// Variables can be defined inline as well.
const ref = adminCreateWorkshopMigrateRef({ espacioId: ..., nombre: ..., tipo: ..., descripcion: ..., cuposTotales: ..., cuposDisponibles: ..., precio: ..., fecha: ..., duracionHoras: ..., duracionMinutos: ..., experienciaPrevia: ..., scheduleData: ..., headerType: ..., headerValue: ..., metodosPago: ..., estado: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = adminCreateWorkshopMigrateRef(dataConnect, adminCreateWorkshopMigrateVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.workshop_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.workshop_insert);
});
```

## DecrementarCupo
You can execute the `DecrementarCupo` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
decrementarCupo(vars: DecrementarCupoVariables): MutationPromise<DecrementarCupoData, DecrementarCupoVariables>;

interface DecrementarCupoRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DecrementarCupoVariables): MutationRef<DecrementarCupoData, DecrementarCupoVariables>;
}
export const decrementarCupoRef: DecrementarCupoRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
decrementarCupo(dc: DataConnect, vars: DecrementarCupoVariables): MutationPromise<DecrementarCupoData, DecrementarCupoVariables>;

interface DecrementarCupoRef {
  ...
  (dc: DataConnect, vars: DecrementarCupoVariables): MutationRef<DecrementarCupoData, DecrementarCupoVariables>;
}
export const decrementarCupoRef: DecrementarCupoRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the decrementarCupoRef:
```typescript
const name = decrementarCupoRef.operationName;
console.log(name);
```

### Variables
The `DecrementarCupo` mutation requires an argument of type `DecrementarCupoVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DecrementarCupoVariables {
  workshopId: UUIDString;
}
```
### Return Type
Recall that executing the `DecrementarCupo` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DecrementarCupoData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DecrementarCupoData {
  workshop_update?: Workshop_Key | null;
}
```
### Using `DecrementarCupo`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, decrementarCupo, DecrementarCupoVariables } from '@antologico/dataconnect';

// The `DecrementarCupo` mutation requires an argument of type `DecrementarCupoVariables`:
const decrementarCupoVars: DecrementarCupoVariables = {
  workshopId: ..., 
};

// Call the `decrementarCupo()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await decrementarCupo(decrementarCupoVars);
// Variables can be defined inline as well.
const { data } = await decrementarCupo({ workshopId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await decrementarCupo(dataConnect, decrementarCupoVars);

console.log(data.workshop_update);

// Or, you can use the `Promise` API.
decrementarCupo(decrementarCupoVars).then((response) => {
  const data = response.data;
  console.log(data.workshop_update);
});
```

### Using `DecrementarCupo`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, decrementarCupoRef, DecrementarCupoVariables } from '@antologico/dataconnect';

// The `DecrementarCupo` mutation requires an argument of type `DecrementarCupoVariables`:
const decrementarCupoVars: DecrementarCupoVariables = {
  workshopId: ..., 
};

// Call the `decrementarCupoRef()` function to get a reference to the mutation.
const ref = decrementarCupoRef(decrementarCupoVars);
// Variables can be defined inline as well.
const ref = decrementarCupoRef({ workshopId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = decrementarCupoRef(dataConnect, decrementarCupoVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.workshop_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.workshop_update);
});
```

## CreateReservaConUsuario
You can execute the `CreateReservaConUsuario` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createReservaConUsuario(vars: CreateReservaConUsuarioVariables): MutationPromise<CreateReservaConUsuarioData, CreateReservaConUsuarioVariables>;

interface CreateReservaConUsuarioRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateReservaConUsuarioVariables): MutationRef<CreateReservaConUsuarioData, CreateReservaConUsuarioVariables>;
}
export const createReservaConUsuarioRef: CreateReservaConUsuarioRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createReservaConUsuario(dc: DataConnect, vars: CreateReservaConUsuarioVariables): MutationPromise<CreateReservaConUsuarioData, CreateReservaConUsuarioVariables>;

interface CreateReservaConUsuarioRef {
  ...
  (dc: DataConnect, vars: CreateReservaConUsuarioVariables): MutationRef<CreateReservaConUsuarioData, CreateReservaConUsuarioVariables>;
}
export const createReservaConUsuarioRef: CreateReservaConUsuarioRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createReservaConUsuarioRef:
```typescript
const name = createReservaConUsuarioRef.operationName;
console.log(name);
```

### Variables
The `CreateReservaConUsuario` mutation requires an argument of type `CreateReservaConUsuarioVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateReservaConUsuarioVariables {
  nombre: string;
  email: string;
  workshopId: UUIDString;
  estado: EstadoReserva;
  metodoPago?: MetodoPago | null;
  estadoPago?: EstadoPago | null;
  pagoExternoId?: string | null;
}
```
### Return Type
Recall that executing the `CreateReservaConUsuario` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateReservaConUsuarioData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateReservaConUsuarioData {
  usuario_upsert: Usuario_Key;
  reserva_insert: Reserva_Key;
  workshop_update?: Workshop_Key | null;
}
```
### Using `CreateReservaConUsuario`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createReservaConUsuario, CreateReservaConUsuarioVariables } from '@antologico/dataconnect';

// The `CreateReservaConUsuario` mutation requires an argument of type `CreateReservaConUsuarioVariables`:
const createReservaConUsuarioVars: CreateReservaConUsuarioVariables = {
  nombre: ..., 
  email: ..., 
  workshopId: ..., 
  estado: ..., 
  metodoPago: ..., // optional
  estadoPago: ..., // optional
  pagoExternoId: ..., // optional
};

// Call the `createReservaConUsuario()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createReservaConUsuario(createReservaConUsuarioVars);
// Variables can be defined inline as well.
const { data } = await createReservaConUsuario({ nombre: ..., email: ..., workshopId: ..., estado: ..., metodoPago: ..., estadoPago: ..., pagoExternoId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createReservaConUsuario(dataConnect, createReservaConUsuarioVars);

console.log(data.usuario_upsert);
console.log(data.reserva_insert);
console.log(data.workshop_update);

// Or, you can use the `Promise` API.
createReservaConUsuario(createReservaConUsuarioVars).then((response) => {
  const data = response.data;
  console.log(data.usuario_upsert);
  console.log(data.reserva_insert);
  console.log(data.workshop_update);
});
```

### Using `CreateReservaConUsuario`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createReservaConUsuarioRef, CreateReservaConUsuarioVariables } from '@antologico/dataconnect';

// The `CreateReservaConUsuario` mutation requires an argument of type `CreateReservaConUsuarioVariables`:
const createReservaConUsuarioVars: CreateReservaConUsuarioVariables = {
  nombre: ..., 
  email: ..., 
  workshopId: ..., 
  estado: ..., 
  metodoPago: ..., // optional
  estadoPago: ..., // optional
  pagoExternoId: ..., // optional
};

// Call the `createReservaConUsuarioRef()` function to get a reference to the mutation.
const ref = createReservaConUsuarioRef(createReservaConUsuarioVars);
// Variables can be defined inline as well.
const ref = createReservaConUsuarioRef({ nombre: ..., email: ..., workshopId: ..., estado: ..., metodoPago: ..., estadoPago: ..., pagoExternoId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createReservaConUsuarioRef(dataConnect, createReservaConUsuarioVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.usuario_upsert);
console.log(data.reserva_insert);
console.log(data.workshop_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.usuario_upsert);
  console.log(data.reserva_insert);
  console.log(data.workshop_update);
});
```

## MarkReservaPaid
You can execute the `MarkReservaPaid` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
markReservaPaid(vars: MarkReservaPaidVariables): MutationPromise<MarkReservaPaidData, MarkReservaPaidVariables>;

interface MarkReservaPaidRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: MarkReservaPaidVariables): MutationRef<MarkReservaPaidData, MarkReservaPaidVariables>;
}
export const markReservaPaidRef: MarkReservaPaidRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
markReservaPaid(dc: DataConnect, vars: MarkReservaPaidVariables): MutationPromise<MarkReservaPaidData, MarkReservaPaidVariables>;

interface MarkReservaPaidRef {
  ...
  (dc: DataConnect, vars: MarkReservaPaidVariables): MutationRef<MarkReservaPaidData, MarkReservaPaidVariables>;
}
export const markReservaPaidRef: MarkReservaPaidRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the markReservaPaidRef:
```typescript
const name = markReservaPaidRef.operationName;
console.log(name);
```

### Variables
The `MarkReservaPaid` mutation requires an argument of type `MarkReservaPaidVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface MarkReservaPaidVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `MarkReservaPaid` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `MarkReservaPaidData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface MarkReservaPaidData {
  reserva_update?: Reserva_Key | null;
}
```
### Using `MarkReservaPaid`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, markReservaPaid, MarkReservaPaidVariables } from '@antologico/dataconnect';

// The `MarkReservaPaid` mutation requires an argument of type `MarkReservaPaidVariables`:
const markReservaPaidVars: MarkReservaPaidVariables = {
  id: ..., 
};

// Call the `markReservaPaid()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await markReservaPaid(markReservaPaidVars);
// Variables can be defined inline as well.
const { data } = await markReservaPaid({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await markReservaPaid(dataConnect, markReservaPaidVars);

console.log(data.reserva_update);

// Or, you can use the `Promise` API.
markReservaPaid(markReservaPaidVars).then((response) => {
  const data = response.data;
  console.log(data.reserva_update);
});
```

### Using `MarkReservaPaid`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, markReservaPaidRef, MarkReservaPaidVariables } from '@antologico/dataconnect';

// The `MarkReservaPaid` mutation requires an argument of type `MarkReservaPaidVariables`:
const markReservaPaidVars: MarkReservaPaidVariables = {
  id: ..., 
};

// Call the `markReservaPaidRef()` function to get a reference to the mutation.
const ref = markReservaPaidRef(markReservaPaidVars);
// Variables can be defined inline as well.
const ref = markReservaPaidRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = markReservaPaidRef(dataConnect, markReservaPaidVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.reserva_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.reserva_update);
});
```

## MarkReservaUnpaid
You can execute the `MarkReservaUnpaid` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
markReservaUnpaid(vars: MarkReservaUnpaidVariables): MutationPromise<MarkReservaUnpaidData, MarkReservaUnpaidVariables>;

interface MarkReservaUnpaidRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: MarkReservaUnpaidVariables): MutationRef<MarkReservaUnpaidData, MarkReservaUnpaidVariables>;
}
export const markReservaUnpaidRef: MarkReservaUnpaidRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
markReservaUnpaid(dc: DataConnect, vars: MarkReservaUnpaidVariables): MutationPromise<MarkReservaUnpaidData, MarkReservaUnpaidVariables>;

interface MarkReservaUnpaidRef {
  ...
  (dc: DataConnect, vars: MarkReservaUnpaidVariables): MutationRef<MarkReservaUnpaidData, MarkReservaUnpaidVariables>;
}
export const markReservaUnpaidRef: MarkReservaUnpaidRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the markReservaUnpaidRef:
```typescript
const name = markReservaUnpaidRef.operationName;
console.log(name);
```

### Variables
The `MarkReservaUnpaid` mutation requires an argument of type `MarkReservaUnpaidVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface MarkReservaUnpaidVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `MarkReservaUnpaid` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `MarkReservaUnpaidData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface MarkReservaUnpaidData {
  reserva_update?: Reserva_Key | null;
}
```
### Using `MarkReservaUnpaid`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, markReservaUnpaid, MarkReservaUnpaidVariables } from '@antologico/dataconnect';

// The `MarkReservaUnpaid` mutation requires an argument of type `MarkReservaUnpaidVariables`:
const markReservaUnpaidVars: MarkReservaUnpaidVariables = {
  id: ..., 
};

// Call the `markReservaUnpaid()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await markReservaUnpaid(markReservaUnpaidVars);
// Variables can be defined inline as well.
const { data } = await markReservaUnpaid({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await markReservaUnpaid(dataConnect, markReservaUnpaidVars);

console.log(data.reserva_update);

// Or, you can use the `Promise` API.
markReservaUnpaid(markReservaUnpaidVars).then((response) => {
  const data = response.data;
  console.log(data.reserva_update);
});
```

### Using `MarkReservaUnpaid`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, markReservaUnpaidRef, MarkReservaUnpaidVariables } from '@antologico/dataconnect';

// The `MarkReservaUnpaid` mutation requires an argument of type `MarkReservaUnpaidVariables`:
const markReservaUnpaidVars: MarkReservaUnpaidVariables = {
  id: ..., 
};

// Call the `markReservaUnpaidRef()` function to get a reference to the mutation.
const ref = markReservaUnpaidRef(markReservaUnpaidVars);
// Variables can be defined inline as well.
const ref = markReservaUnpaidRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = markReservaUnpaidRef(dataConnect, markReservaUnpaidVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.reserva_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.reserva_update);
});
```

