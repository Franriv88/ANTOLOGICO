# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `antologico`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

**If you're looking for the `React README`, you can find it at [`dataconnect-generated/react/README.md`](./react/README.md)**

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

# Table of Contents
- [**Overview**](#generated-javascript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*GetMyProfile*](#getmyprofile)
  - [*ListPlanes*](#listplanes)
  - [*ListRubros*](#listrubros)
  - [*ListMyEspacios*](#listmyespacios)
  - [*GetMyEspacio*](#getmyespacio)
  - [*ListMyWorkshops*](#listmyworkshops)
  - [*ListMyWorkshopsByEstado*](#listmyworkshopsbyestado)
  - [*SearchMyWorkshops*](#searchmyworkshops)
  - [*GetMyWorkshop*](#getmyworkshop)
  - [*ListPublicWorkshops*](#listpublicworkshops)
- [**Mutations**](#mutations)
  - [*UpsertProfesional*](#upsertprofesional)
  - [*UpdateEspacioPlanId*](#updateespacioplanid)
  - [*CreateEspacio*](#createespacio)
  - [*UpdateEspacioIdentidad*](#updateespacioidentidad)
  - [*UpdateEspacio*](#updateespacio)
  - [*CreateWorkshop*](#createworkshop)
  - [*UpdateWorkshop*](#updateworkshop)
  - [*UpdateWorkshopEstado*](#updateworkshopestado)
  - [*DeleteWorkshop*](#deleteworkshop)
  - [*SolicitarCancelacionEspacio*](#solicitarcancelacionespacio)
  - [*ReactivarSuscripcionEspacio*](#reactivarsuscripcionespacio)
  - [*DecrementarCupo*](#decrementarcupo)

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
    logoUrl?: string | null;
    logoShape?: string | null;
    brandColors?: unknown | null;
    brandFont?: string | null;
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
    logoUrl?: string | null;
    logoShape?: string | null;
    brandColors?: unknown | null;
    brandFont?: string | null;
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
    estado: EstadoWorkshop;
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
    estado: EstadoWorkshop;
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
    estado: EstadoWorkshop;
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
    estado: EstadoWorkshop;
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

## UpdateEspacioPlanId
You can execute the `UpdateEspacioPlanId` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateEspacioPlanId(vars: UpdateEspacioPlanIdVariables): MutationPromise<UpdateEspacioPlanIdData, UpdateEspacioPlanIdVariables>;

interface UpdateEspacioPlanIdRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateEspacioPlanIdVariables): MutationRef<UpdateEspacioPlanIdData, UpdateEspacioPlanIdVariables>;
}
export const updateEspacioPlanIdRef: UpdateEspacioPlanIdRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateEspacioPlanId(dc: DataConnect, vars: UpdateEspacioPlanIdVariables): MutationPromise<UpdateEspacioPlanIdData, UpdateEspacioPlanIdVariables>;

interface UpdateEspacioPlanIdRef {
  ...
  (dc: DataConnect, vars: UpdateEspacioPlanIdVariables): MutationRef<UpdateEspacioPlanIdData, UpdateEspacioPlanIdVariables>;
}
export const updateEspacioPlanIdRef: UpdateEspacioPlanIdRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateEspacioPlanIdRef:
```typescript
const name = updateEspacioPlanIdRef.operationName;
console.log(name);
```

### Variables
The `UpdateEspacioPlanId` mutation requires an argument of type `UpdateEspacioPlanIdVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateEspacioPlanIdVariables {
  id: UUIDString;
  planId: UUIDString;
}
```
### Return Type
Recall that executing the `UpdateEspacioPlanId` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateEspacioPlanIdData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateEspacioPlanIdData {
  espacio_update?: Espacio_Key | null;
}
```
### Using `UpdateEspacioPlanId`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateEspacioPlanId, UpdateEspacioPlanIdVariables } from '@antologico/dataconnect';

// The `UpdateEspacioPlanId` mutation requires an argument of type `UpdateEspacioPlanIdVariables`:
const updateEspacioPlanIdVars: UpdateEspacioPlanIdVariables = {
  id: ..., 
  planId: ..., 
};

// Call the `updateEspacioPlanId()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateEspacioPlanId(updateEspacioPlanIdVars);
// Variables can be defined inline as well.
const { data } = await updateEspacioPlanId({ id: ..., planId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateEspacioPlanId(dataConnect, updateEspacioPlanIdVars);

console.log(data.espacio_update);

// Or, you can use the `Promise` API.
updateEspacioPlanId(updateEspacioPlanIdVars).then((response) => {
  const data = response.data;
  console.log(data.espacio_update);
});
```

### Using `UpdateEspacioPlanId`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateEspacioPlanIdRef, UpdateEspacioPlanIdVariables } from '@antologico/dataconnect';

// The `UpdateEspacioPlanId` mutation requires an argument of type `UpdateEspacioPlanIdVariables`:
const updateEspacioPlanIdVars: UpdateEspacioPlanIdVariables = {
  id: ..., 
  planId: ..., 
};

// Call the `updateEspacioPlanIdRef()` function to get a reference to the mutation.
const ref = updateEspacioPlanIdRef(updateEspacioPlanIdVars);
// Variables can be defined inline as well.
const ref = updateEspacioPlanIdRef({ id: ..., planId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateEspacioPlanIdRef(dataConnect, updateEspacioPlanIdVars);

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
  brandColors: ..., // optional
  brandFont: ..., // optional
};

// Call the `updateEspacioIdentidad()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateEspacioIdentidad(updateEspacioIdentidadVars);
// Variables can be defined inline as well.
const { data } = await updateEspacioIdentidad({ id: ..., logoUrl: ..., logoShape: ..., brandColors: ..., brandFont: ..., });

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
  brandColors: ..., // optional
  brandFont: ..., // optional
};

// Call the `updateEspacioIdentidadRef()` function to get a reference to the mutation.
const ref = updateEspacioIdentidadRef(updateEspacioIdentidadVars);
// Variables can be defined inline as well.
const ref = updateEspacioIdentidadRef({ id: ..., logoUrl: ..., logoShape: ..., brandColors: ..., brandFont: ..., });

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
  estado?: EstadoWorkshop | null;
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
  estado: ..., // optional
};

// Call the `createWorkshop()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createWorkshop(createWorkshopVars);
// Variables can be defined inline as well.
const { data } = await createWorkshop({ espacioId: ..., nombre: ..., tipo: ..., descripcion: ..., cuposTotales: ..., cuposDisponibles: ..., precio: ..., fecha: ..., duracionHoras: ..., duracionMinutos: ..., experienciaPrevia: ..., scheduleData: ..., headerType: ..., headerValue: ..., estado: ..., });

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
  estado: ..., // optional
};

// Call the `createWorkshopRef()` function to get a reference to the mutation.
const ref = createWorkshopRef(createWorkshopVars);
// Variables can be defined inline as well.
const ref = createWorkshopRef({ espacioId: ..., nombre: ..., tipo: ..., descripcion: ..., cuposTotales: ..., cuposDisponibles: ..., precio: ..., fecha: ..., duracionHoras: ..., duracionMinutos: ..., experienciaPrevia: ..., scheduleData: ..., headerType: ..., headerValue: ..., estado: ..., });

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
  estado?: EstadoWorkshop | null;
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
  estado: ..., // optional
};

// Call the `updateWorkshop()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateWorkshop(updateWorkshopVars);
// Variables can be defined inline as well.
const { data } = await updateWorkshop({ id: ..., espacioId: ..., nombre: ..., tipo: ..., descripcion: ..., cuposTotales: ..., cuposDisponibles: ..., precio: ..., fecha: ..., duracionHoras: ..., duracionMinutos: ..., experienciaPrevia: ..., scheduleData: ..., headerType: ..., headerValue: ..., estado: ..., });

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
  estado: ..., // optional
};

// Call the `updateWorkshopRef()` function to get a reference to the mutation.
const ref = updateWorkshopRef(updateWorkshopVars);
// Variables can be defined inline as well.
const ref = updateWorkshopRef({ id: ..., espacioId: ..., nombre: ..., tipo: ..., descripcion: ..., cuposTotales: ..., cuposDisponibles: ..., precio: ..., fecha: ..., duracionHoras: ..., duracionMinutos: ..., experienciaPrevia: ..., scheduleData: ..., headerType: ..., headerValue: ..., estado: ..., });

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

