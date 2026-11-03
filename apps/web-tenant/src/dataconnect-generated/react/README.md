# Generated React README
This README will guide you through the process of using the generated React SDK package for the connector `antologico`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

**If you're looking for the `JavaScript README`, you can find it at [`dataconnect-generated/README.md`](../README.md)**

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

You can use this generated SDK by importing from the package `@antologico/dataconnect/react` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#react).

# Table of Contents
- [**Overview**](#generated-react-readme)
- [**TanStack Query Firebase & TanStack React Query**](#tanstack-query-firebase-tanstack-react-query)
  - [*Package Installation*](#installing-tanstack-query-firebase-and-tanstack-react-query-packages)
  - [*Configuring TanStack Query*](#configuring-tanstack-query)
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
  - [*DevExpireTrial*](#devexpiretrial)

# TanStack Query Firebase & TanStack React Query
This SDK provides [React](https://react.dev/) hooks generated specific to your application, for the operations found in the connector `antologico`. These hooks are generated using [TanStack Query Firebase](https://react-query-firebase.invertase.dev/) by our partners at Invertase, a library built on top of [TanStack React Query v5](https://tanstack.com/query/v5/docs/framework/react/overview).

***You do not need to be familiar with Tanstack Query or Tanstack Query Firebase to use this SDK.*** However, you may find it useful to learn more about them, as they will empower you as a user of this Generated React SDK.

## Installing TanStack Query Firebase and TanStack React Query Packages
In order to use the React generated SDK, you must install the `TanStack React Query` and `TanStack Query Firebase` packages.
```bash
npm i --save @tanstack/react-query @tanstack-query-firebase/react
```
```bash
npm i --save firebase@latest # Note: React has a peer dependency on ^11.3.0
```

You can also follow the installation instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#tanstack-install), or the [TanStack Query Firebase documentation](https://react-query-firebase.invertase.dev/react) and [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/installation).

## Configuring TanStack Query
In order to use the React generated SDK in your application, you must wrap your application's component tree in a `QueryClientProvider` component from TanStack React Query. None of your generated React SDK hooks will work without this provider.

```javascript
import { QueryClientProvider } from '@tanstack/react-query';

// Create a TanStack Query client instance
const queryClient = new QueryClient()

function App() {
  return (
    // Provide the client to your App
    <QueryClientProvider client={queryClient}>
      <MyApplication />
    </QueryClientProvider>
  )
}
```

To learn more about `QueryClientProvider`, see the [TanStack React Query documentation](https://tanstack.com/query/latest/docs/framework/react/quick-start) and the [TanStack Query Firebase documentation](https://invertase.docs.page/tanstack-query-firebase/react#usage).

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `antologico`.

You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@antologico/dataconnect';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#emulator-react-angular).

```javascript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@antologico/dataconnect';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) using the hooks provided from your generated React SDK.

# Queries

The React generated SDK provides Query hook functions that call and return [`useDataConnectQuery`](https://react-query-firebase.invertase.dev/react/data-connect/querying) hooks from TanStack Query Firebase.

Calling these hook functions will return a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and the most recent data returned by the Query, among other things. To learn more about these hooks and how to use them, see the [TanStack Query Firebase documentation](https://react-query-firebase.invertase.dev/react/data-connect/querying).

TanStack React Query caches the results of your Queries, so using the same Query hook function in multiple places in your application allows the entire application to automatically see updates to that Query's data.

Query hooks execute their Queries automatically when called, and periodically refresh, unless you change the `queryOptions` for the Query. To learn how to stop a Query from automatically executing, including how to make a query "lazy", see the [TanStack React Query documentation](https://tanstack.com/query/latest/docs/framework/react/guides/disabling-queries).

To learn more about TanStack React Query's Queries, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/guides/queries).

## Using Query Hooks
Here's a general overview of how to use the generated Query hooks in your code:

- If the Query has no variables, the Query hook function does not require arguments.
- If the Query has any required variables, the Query hook function will require at least one argument: an object that contains all the required variables for the Query.
- If the Query has some required and some optional variables, only required variables are necessary in the variables argument object, and optional variables may be provided as well.
- If all of the Query's variables are optional, the Query hook function does not require any arguments.
- Query hook functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.
- Query hooks functions can be called with or without passing in an `options` argument of type `useDataConnectQueryOptions`. To learn more about the `options` argument, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/guides/query-options).
  - ***Special case:***  If the Query has all optional variables and you would like to provide an `options` argument to the Query hook function without providing any variables, you must pass `undefined` where you would normally pass the Query's variables, and then may provide the `options` argument.

Below are examples of how to use the `antologico` connector's generated Query hook functions to execute each Query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#operations-react-angular).

## ListReservasByEspacio
You can execute the `ListReservasByEspacio` Query using the following Query hook function, which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts):

```javascript
useListReservasByEspacio(dc: DataConnect, vars: ListReservasByEspacioVariables, options?: useDataConnectQueryOptions<ListReservasByEspacioData>): UseDataConnectQueryResult<ListReservasByEspacioData, ListReservasByEspacioVariables>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useListReservasByEspacio(vars: ListReservasByEspacioVariables, options?: useDataConnectQueryOptions<ListReservasByEspacioData>): UseDataConnectQueryResult<ListReservasByEspacioData, ListReservasByEspacioVariables>;
```

### Variables
The `ListReservasByEspacio` Query requires an argument of type `ListReservasByEspacioVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface ListReservasByEspacioVariables {
  espacioId: UUIDString;
}
```
### Return Type
Recall that calling the `ListReservasByEspacio` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `ListReservasByEspacio` Query is of type `ListReservasByEspacioData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
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

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `ListReservasByEspacio`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, ListReservasByEspacioVariables } from '@antologico/dataconnect';
import { useListReservasByEspacio } from '@antologico/dataconnect/react'

export default function ListReservasByEspacioComponent() {
  // The `useListReservasByEspacio` Query hook requires an argument of type `ListReservasByEspacioVariables`:
  const listReservasByEspacioVars: ListReservasByEspacioVariables = {
    espacioId: ..., 
  };

  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useListReservasByEspacio(listReservasByEspacioVars);
  // Variables can be defined inline as well.
  const query = useListReservasByEspacio({ espacioId: ..., });

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useListReservasByEspacio(dataConnect, listReservasByEspacioVars);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useListReservasByEspacio(listReservasByEspacioVars, options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useListReservasByEspacio(dataConnect, listReservasByEspacioVars, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.reservas);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## GetMyProfile
You can execute the `GetMyProfile` Query using the following Query hook function, which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts):

```javascript
useGetMyProfile(dc: DataConnect, options?: useDataConnectQueryOptions<GetMyProfileData>): UseDataConnectQueryResult<GetMyProfileData, undefined>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useGetMyProfile(options?: useDataConnectQueryOptions<GetMyProfileData>): UseDataConnectQueryResult<GetMyProfileData, undefined>;
```

### Variables
The `GetMyProfile` Query has no variables.
### Return Type
Recall that calling the `GetMyProfile` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `GetMyProfile` Query is of type `GetMyProfileData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
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

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `GetMyProfile`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@antologico/dataconnect';
import { useGetMyProfile } from '@antologico/dataconnect/react'

export default function GetMyProfileComponent() {
  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useGetMyProfile();

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useGetMyProfile(dataConnect);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useGetMyProfile(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useGetMyProfile(dataConnect, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.profesionales);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## ListPlanes
You can execute the `ListPlanes` Query using the following Query hook function, which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts):

```javascript
useListPlanes(dc: DataConnect, options?: useDataConnectQueryOptions<ListPlanesData>): UseDataConnectQueryResult<ListPlanesData, undefined>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useListPlanes(options?: useDataConnectQueryOptions<ListPlanesData>): UseDataConnectQueryResult<ListPlanesData, undefined>;
```

### Variables
The `ListPlanes` Query has no variables.
### Return Type
Recall that calling the `ListPlanes` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `ListPlanes` Query is of type `ListPlanesData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
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

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `ListPlanes`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@antologico/dataconnect';
import { useListPlanes } from '@antologico/dataconnect/react'

export default function ListPlanesComponent() {
  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useListPlanes();

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useListPlanes(dataConnect);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useListPlanes(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useListPlanes(dataConnect, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.planes);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## ListRubros
You can execute the `ListRubros` Query using the following Query hook function, which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts):

```javascript
useListRubros(dc: DataConnect, options?: useDataConnectQueryOptions<ListRubrosData>): UseDataConnectQueryResult<ListRubrosData, undefined>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useListRubros(options?: useDataConnectQueryOptions<ListRubrosData>): UseDataConnectQueryResult<ListRubrosData, undefined>;
```

### Variables
The `ListRubros` Query has no variables.
### Return Type
Recall that calling the `ListRubros` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `ListRubros` Query is of type `ListRubrosData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface ListRubrosData {
  rubros: ({
    id: UUIDString;
    nombre: string;
  } & Rubro_Key)[];
}
```

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `ListRubros`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@antologico/dataconnect';
import { useListRubros } from '@antologico/dataconnect/react'

export default function ListRubrosComponent() {
  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useListRubros();

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useListRubros(dataConnect);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useListRubros(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useListRubros(dataConnect, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.rubros);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## ListMyEspacios
You can execute the `ListMyEspacios` Query using the following Query hook function, which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts):

```javascript
useListMyEspacios(dc: DataConnect, options?: useDataConnectQueryOptions<ListMyEspaciosData>): UseDataConnectQueryResult<ListMyEspaciosData, undefined>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useListMyEspacios(options?: useDataConnectQueryOptions<ListMyEspaciosData>): UseDataConnectQueryResult<ListMyEspaciosData, undefined>;
```

### Variables
The `ListMyEspacios` Query has no variables.
### Return Type
Recall that calling the `ListMyEspacios` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `ListMyEspacios` Query is of type `ListMyEspaciosData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
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

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `ListMyEspacios`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@antologico/dataconnect';
import { useListMyEspacios } from '@antologico/dataconnect/react'

export default function ListMyEspaciosComponent() {
  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useListMyEspacios();

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useListMyEspacios(dataConnect);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useListMyEspacios(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useListMyEspacios(dataConnect, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.espacios);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## GetMyEspacio
You can execute the `GetMyEspacio` Query using the following Query hook function, which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts):

```javascript
useGetMyEspacio(dc: DataConnect, vars: GetMyEspacioVariables, options?: useDataConnectQueryOptions<GetMyEspacioData>): UseDataConnectQueryResult<GetMyEspacioData, GetMyEspacioVariables>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useGetMyEspacio(vars: GetMyEspacioVariables, options?: useDataConnectQueryOptions<GetMyEspacioData>): UseDataConnectQueryResult<GetMyEspacioData, GetMyEspacioVariables>;
```

### Variables
The `GetMyEspacio` Query requires an argument of type `GetMyEspacioVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface GetMyEspacioVariables {
  id: UUIDString;
}
```
### Return Type
Recall that calling the `GetMyEspacio` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `GetMyEspacio` Query is of type `GetMyEspacioData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
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

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `GetMyEspacio`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, GetMyEspacioVariables } from '@antologico/dataconnect';
import { useGetMyEspacio } from '@antologico/dataconnect/react'

export default function GetMyEspacioComponent() {
  // The `useGetMyEspacio` Query hook requires an argument of type `GetMyEspacioVariables`:
  const getMyEspacioVars: GetMyEspacioVariables = {
    id: ..., 
  };

  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useGetMyEspacio(getMyEspacioVars);
  // Variables can be defined inline as well.
  const query = useGetMyEspacio({ id: ..., });

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useGetMyEspacio(dataConnect, getMyEspacioVars);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useGetMyEspacio(getMyEspacioVars, options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useGetMyEspacio(dataConnect, getMyEspacioVars, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.espacios);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## ListMyWorkshops
You can execute the `ListMyWorkshops` Query using the following Query hook function, which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts):

```javascript
useListMyWorkshops(dc: DataConnect, vars: ListMyWorkshopsVariables, options?: useDataConnectQueryOptions<ListMyWorkshopsData>): UseDataConnectQueryResult<ListMyWorkshopsData, ListMyWorkshopsVariables>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useListMyWorkshops(vars: ListMyWorkshopsVariables, options?: useDataConnectQueryOptions<ListMyWorkshopsData>): UseDataConnectQueryResult<ListMyWorkshopsData, ListMyWorkshopsVariables>;
```

### Variables
The `ListMyWorkshops` Query requires an argument of type `ListMyWorkshopsVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface ListMyWorkshopsVariables {
  espacioId: UUIDString;
}
```
### Return Type
Recall that calling the `ListMyWorkshops` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `ListMyWorkshops` Query is of type `ListMyWorkshopsData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
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
```

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `ListMyWorkshops`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, ListMyWorkshopsVariables } from '@antologico/dataconnect';
import { useListMyWorkshops } from '@antologico/dataconnect/react'

export default function ListMyWorkshopsComponent() {
  // The `useListMyWorkshops` Query hook requires an argument of type `ListMyWorkshopsVariables`:
  const listMyWorkshopsVars: ListMyWorkshopsVariables = {
    espacioId: ..., 
  };

  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useListMyWorkshops(listMyWorkshopsVars);
  // Variables can be defined inline as well.
  const query = useListMyWorkshops({ espacioId: ..., });

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useListMyWorkshops(dataConnect, listMyWorkshopsVars);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useListMyWorkshops(listMyWorkshopsVars, options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useListMyWorkshops(dataConnect, listMyWorkshopsVars, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.workshops);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## ListMyWorkshopsByEstado
You can execute the `ListMyWorkshopsByEstado` Query using the following Query hook function, which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts):

```javascript
useListMyWorkshopsByEstado(dc: DataConnect, vars: ListMyWorkshopsByEstadoVariables, options?: useDataConnectQueryOptions<ListMyWorkshopsByEstadoData>): UseDataConnectQueryResult<ListMyWorkshopsByEstadoData, ListMyWorkshopsByEstadoVariables>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useListMyWorkshopsByEstado(vars: ListMyWorkshopsByEstadoVariables, options?: useDataConnectQueryOptions<ListMyWorkshopsByEstadoData>): UseDataConnectQueryResult<ListMyWorkshopsByEstadoData, ListMyWorkshopsByEstadoVariables>;
```

### Variables
The `ListMyWorkshopsByEstado` Query requires an argument of type `ListMyWorkshopsByEstadoVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface ListMyWorkshopsByEstadoVariables {
  espacioId: UUIDString;
  estado: EstadoWorkshop;
}
```
### Return Type
Recall that calling the `ListMyWorkshopsByEstado` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `ListMyWorkshopsByEstado` Query is of type `ListMyWorkshopsByEstadoData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
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
```

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `ListMyWorkshopsByEstado`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, ListMyWorkshopsByEstadoVariables } from '@antologico/dataconnect';
import { useListMyWorkshopsByEstado } from '@antologico/dataconnect/react'

export default function ListMyWorkshopsByEstadoComponent() {
  // The `useListMyWorkshopsByEstado` Query hook requires an argument of type `ListMyWorkshopsByEstadoVariables`:
  const listMyWorkshopsByEstadoVars: ListMyWorkshopsByEstadoVariables = {
    espacioId: ..., 
    estado: ..., 
  };

  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useListMyWorkshopsByEstado(listMyWorkshopsByEstadoVars);
  // Variables can be defined inline as well.
  const query = useListMyWorkshopsByEstado({ espacioId: ..., estado: ..., });

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useListMyWorkshopsByEstado(dataConnect, listMyWorkshopsByEstadoVars);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useListMyWorkshopsByEstado(listMyWorkshopsByEstadoVars, options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useListMyWorkshopsByEstado(dataConnect, listMyWorkshopsByEstadoVars, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.workshops);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## SearchMyWorkshops
You can execute the `SearchMyWorkshops` Query using the following Query hook function, which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts):

```javascript
useSearchMyWorkshops(dc: DataConnect, vars: SearchMyWorkshopsVariables, options?: useDataConnectQueryOptions<SearchMyWorkshopsData>): UseDataConnectQueryResult<SearchMyWorkshopsData, SearchMyWorkshopsVariables>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useSearchMyWorkshops(vars: SearchMyWorkshopsVariables, options?: useDataConnectQueryOptions<SearchMyWorkshopsData>): UseDataConnectQueryResult<SearchMyWorkshopsData, SearchMyWorkshopsVariables>;
```

### Variables
The `SearchMyWorkshops` Query requires an argument of type `SearchMyWorkshopsVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface SearchMyWorkshopsVariables {
  espacioId: UUIDString;
  q: string;
}
```
### Return Type
Recall that calling the `SearchMyWorkshops` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `SearchMyWorkshops` Query is of type `SearchMyWorkshopsData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
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
```

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `SearchMyWorkshops`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, SearchMyWorkshopsVariables } from '@antologico/dataconnect';
import { useSearchMyWorkshops } from '@antologico/dataconnect/react'

export default function SearchMyWorkshopsComponent() {
  // The `useSearchMyWorkshops` Query hook requires an argument of type `SearchMyWorkshopsVariables`:
  const searchMyWorkshopsVars: SearchMyWorkshopsVariables = {
    espacioId: ..., 
    q: ..., 
  };

  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useSearchMyWorkshops(searchMyWorkshopsVars);
  // Variables can be defined inline as well.
  const query = useSearchMyWorkshops({ espacioId: ..., q: ..., });

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useSearchMyWorkshops(dataConnect, searchMyWorkshopsVars);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useSearchMyWorkshops(searchMyWorkshopsVars, options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useSearchMyWorkshops(dataConnect, searchMyWorkshopsVars, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.workshops);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## GetMyWorkshop
You can execute the `GetMyWorkshop` Query using the following Query hook function, which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts):

```javascript
useGetMyWorkshop(dc: DataConnect, vars: GetMyWorkshopVariables, options?: useDataConnectQueryOptions<GetMyWorkshopData>): UseDataConnectQueryResult<GetMyWorkshopData, GetMyWorkshopVariables>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useGetMyWorkshop(vars: GetMyWorkshopVariables, options?: useDataConnectQueryOptions<GetMyWorkshopData>): UseDataConnectQueryResult<GetMyWorkshopData, GetMyWorkshopVariables>;
```

### Variables
The `GetMyWorkshop` Query requires an argument of type `GetMyWorkshopVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface GetMyWorkshopVariables {
  id: UUIDString;
}
```
### Return Type
Recall that calling the `GetMyWorkshop` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `GetMyWorkshop` Query is of type `GetMyWorkshopData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
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
```

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `GetMyWorkshop`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, GetMyWorkshopVariables } from '@antologico/dataconnect';
import { useGetMyWorkshop } from '@antologico/dataconnect/react'

export default function GetMyWorkshopComponent() {
  // The `useGetMyWorkshop` Query hook requires an argument of type `GetMyWorkshopVariables`:
  const getMyWorkshopVars: GetMyWorkshopVariables = {
    id: ..., 
  };

  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useGetMyWorkshop(getMyWorkshopVars);
  // Variables can be defined inline as well.
  const query = useGetMyWorkshop({ id: ..., });

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useGetMyWorkshop(dataConnect, getMyWorkshopVars);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useGetMyWorkshop(getMyWorkshopVars, options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useGetMyWorkshop(dataConnect, getMyWorkshopVars, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.workshops);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## GetEspacioBySlug
You can execute the `GetEspacioBySlug` Query using the following Query hook function, which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts):

```javascript
useGetEspacioBySlug(dc: DataConnect, vars: GetEspacioBySlugVariables, options?: useDataConnectQueryOptions<GetEspacioBySlugData>): UseDataConnectQueryResult<GetEspacioBySlugData, GetEspacioBySlugVariables>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useGetEspacioBySlug(vars: GetEspacioBySlugVariables, options?: useDataConnectQueryOptions<GetEspacioBySlugData>): UseDataConnectQueryResult<GetEspacioBySlugData, GetEspacioBySlugVariables>;
```

### Variables
The `GetEspacioBySlug` Query requires an argument of type `GetEspacioBySlugVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface GetEspacioBySlugVariables {
  slug: string;
}
```
### Return Type
Recall that calling the `GetEspacioBySlug` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `GetEspacioBySlug` Query is of type `GetEspacioBySlugData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface GetEspacioBySlugData {
  espacios: ({
    id: UUIDString;
    nombre: string;
    slug?: string | null;
  } & Espacio_Key)[];
}
```

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `GetEspacioBySlug`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, GetEspacioBySlugVariables } from '@antologico/dataconnect';
import { useGetEspacioBySlug } from '@antologico/dataconnect/react'

export default function GetEspacioBySlugComponent() {
  // The `useGetEspacioBySlug` Query hook requires an argument of type `GetEspacioBySlugVariables`:
  const getEspacioBySlugVars: GetEspacioBySlugVariables = {
    slug: ..., 
  };

  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useGetEspacioBySlug(getEspacioBySlugVars);
  // Variables can be defined inline as well.
  const query = useGetEspacioBySlug({ slug: ..., });

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useGetEspacioBySlug(dataConnect, getEspacioBySlugVars);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useGetEspacioBySlug(getEspacioBySlugVars, options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useGetEspacioBySlug(dataConnect, getEspacioBySlugVars, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.espacios);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## GetPublicEspacio
You can execute the `GetPublicEspacio` Query using the following Query hook function, which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts):

```javascript
useGetPublicEspacio(dc: DataConnect, vars: GetPublicEspacioVariables, options?: useDataConnectQueryOptions<GetPublicEspacioData>): UseDataConnectQueryResult<GetPublicEspacioData, GetPublicEspacioVariables>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useGetPublicEspacio(vars: GetPublicEspacioVariables, options?: useDataConnectQueryOptions<GetPublicEspacioData>): UseDataConnectQueryResult<GetPublicEspacioData, GetPublicEspacioVariables>;
```

### Variables
The `GetPublicEspacio` Query requires an argument of type `GetPublicEspacioVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface GetPublicEspacioVariables {
  id: UUIDString;
}
```
### Return Type
Recall that calling the `GetPublicEspacio` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `GetPublicEspacio` Query is of type `GetPublicEspacioData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
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

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `GetPublicEspacio`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, GetPublicEspacioVariables } from '@antologico/dataconnect';
import { useGetPublicEspacio } from '@antologico/dataconnect/react'

export default function GetPublicEspacioComponent() {
  // The `useGetPublicEspacio` Query hook requires an argument of type `GetPublicEspacioVariables`:
  const getPublicEspacioVars: GetPublicEspacioVariables = {
    id: ..., 
  };

  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useGetPublicEspacio(getPublicEspacioVars);
  // Variables can be defined inline as well.
  const query = useGetPublicEspacio({ id: ..., });

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useGetPublicEspacio(dataConnect, getPublicEspacioVars);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useGetPublicEspacio(getPublicEspacioVars, options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useGetPublicEspacio(dataConnect, getPublicEspacioVars, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.espacios);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## GetPublicEspacios
You can execute the `GetPublicEspacios` Query using the following Query hook function, which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts):

```javascript
useGetPublicEspacios(dc: DataConnect, vars: GetPublicEspaciosVariables, options?: useDataConnectQueryOptions<GetPublicEspaciosData>): UseDataConnectQueryResult<GetPublicEspaciosData, GetPublicEspaciosVariables>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useGetPublicEspacios(vars: GetPublicEspaciosVariables, options?: useDataConnectQueryOptions<GetPublicEspaciosData>): UseDataConnectQueryResult<GetPublicEspaciosData, GetPublicEspaciosVariables>;
```

### Variables
The `GetPublicEspacios` Query requires an argument of type `GetPublicEspaciosVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface GetPublicEspaciosVariables {
  ids: UUIDString[];
}
```
### Return Type
Recall that calling the `GetPublicEspacios` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `GetPublicEspacios` Query is of type `GetPublicEspaciosData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
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

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `GetPublicEspacios`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, GetPublicEspaciosVariables } from '@antologico/dataconnect';
import { useGetPublicEspacios } from '@antologico/dataconnect/react'

export default function GetPublicEspaciosComponent() {
  // The `useGetPublicEspacios` Query hook requires an argument of type `GetPublicEspaciosVariables`:
  const getPublicEspaciosVars: GetPublicEspaciosVariables = {
    ids: ..., 
  };

  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useGetPublicEspacios(getPublicEspaciosVars);
  // Variables can be defined inline as well.
  const query = useGetPublicEspacios({ ids: ..., });

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useGetPublicEspacios(dataConnect, getPublicEspaciosVars);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useGetPublicEspacios(getPublicEspaciosVars, options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useGetPublicEspacios(dataConnect, getPublicEspaciosVars, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.espacios);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## ListPublicWorkshopsByEspacio
You can execute the `ListPublicWorkshopsByEspacio` Query using the following Query hook function, which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts):

```javascript
useListPublicWorkshopsByEspacio(dc: DataConnect, vars: ListPublicWorkshopsByEspacioVariables, options?: useDataConnectQueryOptions<ListPublicWorkshopsByEspacioData>): UseDataConnectQueryResult<ListPublicWorkshopsByEspacioData, ListPublicWorkshopsByEspacioVariables>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useListPublicWorkshopsByEspacio(vars: ListPublicWorkshopsByEspacioVariables, options?: useDataConnectQueryOptions<ListPublicWorkshopsByEspacioData>): UseDataConnectQueryResult<ListPublicWorkshopsByEspacioData, ListPublicWorkshopsByEspacioVariables>;
```

### Variables
The `ListPublicWorkshopsByEspacio` Query requires an argument of type `ListPublicWorkshopsByEspacioVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface ListPublicWorkshopsByEspacioVariables {
  espacioId: UUIDString;
}
```
### Return Type
Recall that calling the `ListPublicWorkshopsByEspacio` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `ListPublicWorkshopsByEspacio` Query is of type `ListPublicWorkshopsByEspacioData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
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

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `ListPublicWorkshopsByEspacio`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, ListPublicWorkshopsByEspacioVariables } from '@antologico/dataconnect';
import { useListPublicWorkshopsByEspacio } from '@antologico/dataconnect/react'

export default function ListPublicWorkshopsByEspacioComponent() {
  // The `useListPublicWorkshopsByEspacio` Query hook requires an argument of type `ListPublicWorkshopsByEspacioVariables`:
  const listPublicWorkshopsByEspacioVars: ListPublicWorkshopsByEspacioVariables = {
    espacioId: ..., 
  };

  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useListPublicWorkshopsByEspacio(listPublicWorkshopsByEspacioVars);
  // Variables can be defined inline as well.
  const query = useListPublicWorkshopsByEspacio({ espacioId: ..., });

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useListPublicWorkshopsByEspacio(dataConnect, listPublicWorkshopsByEspacioVars);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useListPublicWorkshopsByEspacio(listPublicWorkshopsByEspacioVars, options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useListPublicWorkshopsByEspacio(dataConnect, listPublicWorkshopsByEspacioVars, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.workshops);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## ListMyReservas
You can execute the `ListMyReservas` Query using the following Query hook function, which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts):

```javascript
useListMyReservas(dc: DataConnect, options?: useDataConnectQueryOptions<ListMyReservasData>): UseDataConnectQueryResult<ListMyReservasData, undefined>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useListMyReservas(options?: useDataConnectQueryOptions<ListMyReservasData>): UseDataConnectQueryResult<ListMyReservasData, undefined>;
```

### Variables
The `ListMyReservas` Query has no variables.
### Return Type
Recall that calling the `ListMyReservas` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `ListMyReservas` Query is of type `ListMyReservasData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
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

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `ListMyReservas`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@antologico/dataconnect';
import { useListMyReservas } from '@antologico/dataconnect/react'

export default function ListMyReservasComponent() {
  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useListMyReservas();

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useListMyReservas(dataConnect);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useListMyReservas(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useListMyReservas(dataConnect, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.reservas);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## AdminListAllEspacios
You can execute the `AdminListAllEspacios` Query using the following Query hook function, which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts):

```javascript
useAdminListAllEspacios(dc: DataConnect, options?: useDataConnectQueryOptions<AdminListAllEspaciosData>): UseDataConnectQueryResult<AdminListAllEspaciosData, undefined>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useAdminListAllEspacios(options?: useDataConnectQueryOptions<AdminListAllEspaciosData>): UseDataConnectQueryResult<AdminListAllEspaciosData, undefined>;
```

### Variables
The `AdminListAllEspacios` Query has no variables.
### Return Type
Recall that calling the `AdminListAllEspacios` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `AdminListAllEspacios` Query is of type `AdminListAllEspaciosData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
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

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `AdminListAllEspacios`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@antologico/dataconnect';
import { useAdminListAllEspacios } from '@antologico/dataconnect/react'

export default function AdminListAllEspaciosComponent() {
  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useAdminListAllEspacios();

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useAdminListAllEspacios(dataConnect);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useAdminListAllEspacios(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useAdminListAllEspacios(dataConnect, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.espacios);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## AdminListAllWorkshops
You can execute the `AdminListAllWorkshops` Query using the following Query hook function, which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts):

```javascript
useAdminListAllWorkshops(dc: DataConnect, options?: useDataConnectQueryOptions<AdminListAllWorkshopsData>): UseDataConnectQueryResult<AdminListAllWorkshopsData, undefined>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useAdminListAllWorkshops(options?: useDataConnectQueryOptions<AdminListAllWorkshopsData>): UseDataConnectQueryResult<AdminListAllWorkshopsData, undefined>;
```

### Variables
The `AdminListAllWorkshops` Query has no variables.
### Return Type
Recall that calling the `AdminListAllWorkshops` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `AdminListAllWorkshops` Query is of type `AdminListAllWorkshopsData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
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

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `AdminListAllWorkshops`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@antologico/dataconnect';
import { useAdminListAllWorkshops } from '@antologico/dataconnect/react'

export default function AdminListAllWorkshopsComponent() {
  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useAdminListAllWorkshops();

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useAdminListAllWorkshops(dataConnect);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useAdminListAllWorkshops(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useAdminListAllWorkshops(dataConnect, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.workshops);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## AdminListAllReservas
You can execute the `AdminListAllReservas` Query using the following Query hook function, which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts):

```javascript
useAdminListAllReservas(dc: DataConnect, options?: useDataConnectQueryOptions<AdminListAllReservasData>): UseDataConnectQueryResult<AdminListAllReservasData, undefined>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useAdminListAllReservas(options?: useDataConnectQueryOptions<AdminListAllReservasData>): UseDataConnectQueryResult<AdminListAllReservasData, undefined>;
```

### Variables
The `AdminListAllReservas` Query has no variables.
### Return Type
Recall that calling the `AdminListAllReservas` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `AdminListAllReservas` Query is of type `AdminListAllReservasData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
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

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `AdminListAllReservas`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@antologico/dataconnect';
import { useAdminListAllReservas } from '@antologico/dataconnect/react'

export default function AdminListAllReservasComponent() {
  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useAdminListAllReservas();

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useAdminListAllReservas(dataConnect);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useAdminListAllReservas(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useAdminListAllReservas(dataConnect, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.reservas);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## ListPublicWorkshops
You can execute the `ListPublicWorkshops` Query using the following Query hook function, which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts):

```javascript
useListPublicWorkshops(dc: DataConnect, options?: useDataConnectQueryOptions<ListPublicWorkshopsData>): UseDataConnectQueryResult<ListPublicWorkshopsData, undefined>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useListPublicWorkshops(options?: useDataConnectQueryOptions<ListPublicWorkshopsData>): UseDataConnectQueryResult<ListPublicWorkshopsData, undefined>;
```

### Variables
The `ListPublicWorkshops` Query has no variables.
### Return Type
Recall that calling the `ListPublicWorkshops` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `ListPublicWorkshops` Query is of type `ListPublicWorkshopsData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
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

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `ListPublicWorkshops`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@antologico/dataconnect';
import { useListPublicWorkshops } from '@antologico/dataconnect/react'

export default function ListPublicWorkshopsComponent() {
  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useListPublicWorkshops();

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useListPublicWorkshops(dataConnect);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useListPublicWorkshops(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useListPublicWorkshops(dataConnect, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.workshops);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

# Mutations

The React generated SDK provides Mutations hook functions that call and return [`useDataConnectMutation`](https://react-query-firebase.invertase.dev/react/data-connect/mutations) hooks from TanStack Query Firebase.

Calling these hook functions will return a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, and the most recent data returned by the Mutation, among other things. To learn more about these hooks and how to use them, see the [TanStack Query Firebase documentation](https://react-query-firebase.invertase.dev/react/data-connect/mutations).

Mutation hooks do not execute their Mutations automatically when called. Rather, after calling the Mutation hook function and getting a `UseMutationResult` object, you must call the `UseMutationResult.mutate()` function to execute the Mutation.

To learn more about TanStack React Query's Mutations, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/guides/mutations).

## Using Mutation Hooks
Here's a general overview of how to use the generated Mutation hooks in your code:

- Mutation hook functions are not called with the arguments to the Mutation. Instead, arguments are passed to `UseMutationResult.mutate()`.
- If the Mutation has no variables, the `mutate()` function does not require arguments.
- If the Mutation has any required variables, the `mutate()` function will require at least one argument: an object that contains all the required variables for the Mutation.
- If the Mutation has some required and some optional variables, only required variables are necessary in the variables argument object, and optional variables may be provided as well.
- If all of the Mutation's variables are optional, the Mutation hook function does not require any arguments.
- Mutation hook functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.
- Mutation hooks also accept an `options` argument of type `useDataConnectMutationOptions`. To learn more about the `options` argument, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/guides/mutations#mutation-side-effects).
  - `UseMutationResult.mutate()` also accepts an `options` argument of type `useDataConnectMutationOptions`.
  - ***Special case:*** If the Mutation has no arguments (or all optional arguments and you wish to provide none), and you want to pass `options` to `UseMutationResult.mutate()`, you must pass `undefined` where you would normally pass the Mutation's arguments, and then may provide the options argument.

Below are examples of how to use the `antologico` connector's generated Mutation hook functions to execute each Mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#operations-react-angular).

## UpsertProfesional
You can execute the `UpsertProfesional` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useUpsertProfesional(options?: useDataConnectMutationOptions<UpsertProfesionalData, FirebaseError, UpsertProfesionalVariables>): UseDataConnectMutationResult<UpsertProfesionalData, UpsertProfesionalVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useUpsertProfesional(dc: DataConnect, options?: useDataConnectMutationOptions<UpsertProfesionalData, FirebaseError, UpsertProfesionalVariables>): UseDataConnectMutationResult<UpsertProfesionalData, UpsertProfesionalVariables>;
```

### Variables
The `UpsertProfesional` Mutation requires an argument of type `UpsertProfesionalVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface UpsertProfesionalVariables {
  nombre: string;
  email: string;
}
```
### Return Type
Recall that calling the `UpsertProfesional` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `UpsertProfesional` Mutation is of type `UpsertProfesionalData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface UpsertProfesionalData {
  profesional_upsert: Profesional_Key;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `UpsertProfesional`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, UpsertProfesionalVariables } from '@antologico/dataconnect';
import { useUpsertProfesional } from '@antologico/dataconnect/react'

export default function UpsertProfesionalComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useUpsertProfesional();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useUpsertProfesional(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpsertProfesional(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpsertProfesional(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useUpsertProfesional` Mutation requires an argument of type `UpsertProfesionalVariables`:
  const upsertProfesionalVars: UpsertProfesionalVariables = {
    nombre: ..., 
    email: ..., 
  };
  mutation.mutate(upsertProfesionalVars);
  // Variables can be defined inline as well.
  mutation.mutate({ nombre: ..., email: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(upsertProfesionalVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.profesional_upsert);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## ReassignProfesionalUid
You can execute the `ReassignProfesionalUid` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useReassignProfesionalUid(options?: useDataConnectMutationOptions<ReassignProfesionalUidData, FirebaseError, ReassignProfesionalUidVariables>): UseDataConnectMutationResult<ReassignProfesionalUidData, ReassignProfesionalUidVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useReassignProfesionalUid(dc: DataConnect, options?: useDataConnectMutationOptions<ReassignProfesionalUidData, FirebaseError, ReassignProfesionalUidVariables>): UseDataConnectMutationResult<ReassignProfesionalUidData, ReassignProfesionalUidVariables>;
```

### Variables
The `ReassignProfesionalUid` Mutation requires an argument of type `ReassignProfesionalUidVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface ReassignProfesionalUidVariables {
  nombre: string;
}
```
### Return Type
Recall that calling the `ReassignProfesionalUid` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `ReassignProfesionalUid` Mutation is of type `ReassignProfesionalUidData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface ReassignProfesionalUidData {
  reassigned?: number | null;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `ReassignProfesionalUid`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, ReassignProfesionalUidVariables } from '@antologico/dataconnect';
import { useReassignProfesionalUid } from '@antologico/dataconnect/react'

export default function ReassignProfesionalUidComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useReassignProfesionalUid();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useReassignProfesionalUid(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useReassignProfesionalUid(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useReassignProfesionalUid(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useReassignProfesionalUid` Mutation requires an argument of type `ReassignProfesionalUidVariables`:
  const reassignProfesionalUidVars: ReassignProfesionalUidVariables = {
    nombre: ..., 
  };
  mutation.mutate(reassignProfesionalUidVars);
  // Variables can be defined inline as well.
  mutation.mutate({ nombre: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(reassignProfesionalUidVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.reassigned);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## ActivarPlan
You can execute the `ActivarPlan` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useActivarPlan(options?: useDataConnectMutationOptions<ActivarPlanData, FirebaseError, ActivarPlanVariables>): UseDataConnectMutationResult<ActivarPlanData, ActivarPlanVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useActivarPlan(dc: DataConnect, options?: useDataConnectMutationOptions<ActivarPlanData, FirebaseError, ActivarPlanVariables>): UseDataConnectMutationResult<ActivarPlanData, ActivarPlanVariables>;
```

### Variables
The `ActivarPlan` Mutation requires an argument of type `ActivarPlanVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface ActivarPlanVariables {
  id: UUIDString;
  planId: UUIDString;
  periodoFacturacion: string;
  precioActual: number;
  proximaRenovacion: TimestampString;
}
```
### Return Type
Recall that calling the `ActivarPlan` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `ActivarPlan` Mutation is of type `ActivarPlanData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface ActivarPlanData {
  espacio_update?: Espacio_Key | null;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `ActivarPlan`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, ActivarPlanVariables } from '@antologico/dataconnect';
import { useActivarPlan } from '@antologico/dataconnect/react'

export default function ActivarPlanComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useActivarPlan();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useActivarPlan(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useActivarPlan(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useActivarPlan(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useActivarPlan` Mutation requires an argument of type `ActivarPlanVariables`:
  const activarPlanVars: ActivarPlanVariables = {
    id: ..., 
    planId: ..., 
    periodoFacturacion: ..., 
    precioActual: ..., 
    proximaRenovacion: ..., 
  };
  mutation.mutate(activarPlanVars);
  // Variables can be defined inline as well.
  mutation.mutate({ id: ..., planId: ..., periodoFacturacion: ..., precioActual: ..., proximaRenovacion: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(activarPlanVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.espacio_update);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## AgendarDowngrade
You can execute the `AgendarDowngrade` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useAgendarDowngrade(options?: useDataConnectMutationOptions<AgendarDowngradeData, FirebaseError, AgendarDowngradeVariables>): UseDataConnectMutationResult<AgendarDowngradeData, AgendarDowngradeVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useAgendarDowngrade(dc: DataConnect, options?: useDataConnectMutationOptions<AgendarDowngradeData, FirebaseError, AgendarDowngradeVariables>): UseDataConnectMutationResult<AgendarDowngradeData, AgendarDowngradeVariables>;
```

### Variables
The `AgendarDowngrade` Mutation requires an argument of type `AgendarDowngradeVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface AgendarDowngradeVariables {
  id: UUIDString;
  downgradePendiente: unknown;
}
```
### Return Type
Recall that calling the `AgendarDowngrade` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `AgendarDowngrade` Mutation is of type `AgendarDowngradeData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface AgendarDowngradeData {
  espacio_update?: Espacio_Key | null;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `AgendarDowngrade`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, AgendarDowngradeVariables } from '@antologico/dataconnect';
import { useAgendarDowngrade } from '@antologico/dataconnect/react'

export default function AgendarDowngradeComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useAgendarDowngrade();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useAgendarDowngrade(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useAgendarDowngrade(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useAgendarDowngrade(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useAgendarDowngrade` Mutation requires an argument of type `AgendarDowngradeVariables`:
  const agendarDowngradeVars: AgendarDowngradeVariables = {
    id: ..., 
    downgradePendiente: ..., 
  };
  mutation.mutate(agendarDowngradeVars);
  // Variables can be defined inline as well.
  mutation.mutate({ id: ..., downgradePendiente: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(agendarDowngradeVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.espacio_update);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## CancelarDowngrade
You can execute the `CancelarDowngrade` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useCancelarDowngrade(options?: useDataConnectMutationOptions<CancelarDowngradeData, FirebaseError, CancelarDowngradeVariables>): UseDataConnectMutationResult<CancelarDowngradeData, CancelarDowngradeVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useCancelarDowngrade(dc: DataConnect, options?: useDataConnectMutationOptions<CancelarDowngradeData, FirebaseError, CancelarDowngradeVariables>): UseDataConnectMutationResult<CancelarDowngradeData, CancelarDowngradeVariables>;
```

### Variables
The `CancelarDowngrade` Mutation requires an argument of type `CancelarDowngradeVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface CancelarDowngradeVariables {
  id: UUIDString;
}
```
### Return Type
Recall that calling the `CancelarDowngrade` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `CancelarDowngrade` Mutation is of type `CancelarDowngradeData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface CancelarDowngradeData {
  espacio_update?: Espacio_Key | null;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `CancelarDowngrade`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, CancelarDowngradeVariables } from '@antologico/dataconnect';
import { useCancelarDowngrade } from '@antologico/dataconnect/react'

export default function CancelarDowngradeComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useCancelarDowngrade();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useCancelarDowngrade(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useCancelarDowngrade(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useCancelarDowngrade(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useCancelarDowngrade` Mutation requires an argument of type `CancelarDowngradeVariables`:
  const cancelarDowngradeVars: CancelarDowngradeVariables = {
    id: ..., 
  };
  mutation.mutate(cancelarDowngradeVars);
  // Variables can be defined inline as well.
  mutation.mutate({ id: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(cancelarDowngradeVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.espacio_update);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## UpdateCuponAplicado
You can execute the `UpdateCuponAplicado` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useUpdateCuponAplicado(options?: useDataConnectMutationOptions<UpdateCuponAplicadoData, FirebaseError, UpdateCuponAplicadoVariables>): UseDataConnectMutationResult<UpdateCuponAplicadoData, UpdateCuponAplicadoVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useUpdateCuponAplicado(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateCuponAplicadoData, FirebaseError, UpdateCuponAplicadoVariables>): UseDataConnectMutationResult<UpdateCuponAplicadoData, UpdateCuponAplicadoVariables>;
```

### Variables
The `UpdateCuponAplicado` Mutation requires an argument of type `UpdateCuponAplicadoVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface UpdateCuponAplicadoVariables {
  id: UUIDString;
  cuponAplicado?: unknown | null;
}
```
### Return Type
Recall that calling the `UpdateCuponAplicado` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `UpdateCuponAplicado` Mutation is of type `UpdateCuponAplicadoData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface UpdateCuponAplicadoData {
  espacio_update?: Espacio_Key | null;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `UpdateCuponAplicado`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, UpdateCuponAplicadoVariables } from '@antologico/dataconnect';
import { useUpdateCuponAplicado } from '@antologico/dataconnect/react'

export default function UpdateCuponAplicadoComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useUpdateCuponAplicado();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useUpdateCuponAplicado(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpdateCuponAplicado(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpdateCuponAplicado(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useUpdateCuponAplicado` Mutation requires an argument of type `UpdateCuponAplicadoVariables`:
  const updateCuponAplicadoVars: UpdateCuponAplicadoVariables = {
    id: ..., 
    cuponAplicado: ..., // optional
  };
  mutation.mutate(updateCuponAplicadoVars);
  // Variables can be defined inline as well.
  mutation.mutate({ id: ..., cuponAplicado: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(updateCuponAplicadoVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.espacio_update);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## CreateEspacio
You can execute the `CreateEspacio` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useCreateEspacio(options?: useDataConnectMutationOptions<CreateEspacioData, FirebaseError, CreateEspacioVariables>): UseDataConnectMutationResult<CreateEspacioData, CreateEspacioVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useCreateEspacio(dc: DataConnect, options?: useDataConnectMutationOptions<CreateEspacioData, FirebaseError, CreateEspacioVariables>): UseDataConnectMutationResult<CreateEspacioData, CreateEspacioVariables>;
```

### Variables
The `CreateEspacio` Mutation requires an argument of type `CreateEspacioVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface CreateEspacioVariables {
  nombre: string;
  rubroId?: UUIDString | null;
  rubroPersonalizado?: string | null;
}
```
### Return Type
Recall that calling the `CreateEspacio` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `CreateEspacio` Mutation is of type `CreateEspacioData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface CreateEspacioData {
  espacio_insert: Espacio_Key;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `CreateEspacio`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, CreateEspacioVariables } from '@antologico/dataconnect';
import { useCreateEspacio } from '@antologico/dataconnect/react'

export default function CreateEspacioComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useCreateEspacio();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useCreateEspacio(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useCreateEspacio(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useCreateEspacio(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useCreateEspacio` Mutation requires an argument of type `CreateEspacioVariables`:
  const createEspacioVars: CreateEspacioVariables = {
    nombre: ..., 
    rubroId: ..., // optional
    rubroPersonalizado: ..., // optional
  };
  mutation.mutate(createEspacioVars);
  // Variables can be defined inline as well.
  mutation.mutate({ nombre: ..., rubroId: ..., rubroPersonalizado: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(createEspacioVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.espacio_insert);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## UpdateEspacioIdentidad
You can execute the `UpdateEspacioIdentidad` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useUpdateEspacioIdentidad(options?: useDataConnectMutationOptions<UpdateEspacioIdentidadData, FirebaseError, UpdateEspacioIdentidadVariables>): UseDataConnectMutationResult<UpdateEspacioIdentidadData, UpdateEspacioIdentidadVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useUpdateEspacioIdentidad(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateEspacioIdentidadData, FirebaseError, UpdateEspacioIdentidadVariables>): UseDataConnectMutationResult<UpdateEspacioIdentidadData, UpdateEspacioIdentidadVariables>;
```

### Variables
The `UpdateEspacioIdentidad` Mutation requires an argument of type `UpdateEspacioIdentidadVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
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
Recall that calling the `UpdateEspacioIdentidad` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `UpdateEspacioIdentidad` Mutation is of type `UpdateEspacioIdentidadData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface UpdateEspacioIdentidadData {
  espacio_update?: Espacio_Key | null;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `UpdateEspacioIdentidad`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, UpdateEspacioIdentidadVariables } from '@antologico/dataconnect';
import { useUpdateEspacioIdentidad } from '@antologico/dataconnect/react'

export default function UpdateEspacioIdentidadComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useUpdateEspacioIdentidad();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useUpdateEspacioIdentidad(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpdateEspacioIdentidad(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpdateEspacioIdentidad(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useUpdateEspacioIdentidad` Mutation requires an argument of type `UpdateEspacioIdentidadVariables`:
  const updateEspacioIdentidadVars: UpdateEspacioIdentidadVariables = {
    id: ..., 
    logoUrl: ..., // optional
    logoShape: ..., // optional
    logoScale: ..., // optional
    brandColors: ..., // optional
    brandFont: ..., // optional
  };
  mutation.mutate(updateEspacioIdentidadVars);
  // Variables can be defined inline as well.
  mutation.mutate({ id: ..., logoUrl: ..., logoShape: ..., logoScale: ..., brandColors: ..., brandFont: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(updateEspacioIdentidadVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.espacio_update);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## UpdateEspacioCobros
You can execute the `UpdateEspacioCobros` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useUpdateEspacioCobros(options?: useDataConnectMutationOptions<UpdateEspacioCobrosData, FirebaseError, UpdateEspacioCobrosVariables>): UseDataConnectMutationResult<UpdateEspacioCobrosData, UpdateEspacioCobrosVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useUpdateEspacioCobros(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateEspacioCobrosData, FirebaseError, UpdateEspacioCobrosVariables>): UseDataConnectMutationResult<UpdateEspacioCobrosData, UpdateEspacioCobrosVariables>;
```

### Variables
The `UpdateEspacioCobros` Mutation requires an argument of type `UpdateEspacioCobrosVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface UpdateEspacioCobrosVariables {
  id: UUIDString;
  cobros?: unknown | null;
}
```
### Return Type
Recall that calling the `UpdateEspacioCobros` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `UpdateEspacioCobros` Mutation is of type `UpdateEspacioCobrosData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface UpdateEspacioCobrosData {
  espacio_update?: Espacio_Key | null;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `UpdateEspacioCobros`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, UpdateEspacioCobrosVariables } from '@antologico/dataconnect';
import { useUpdateEspacioCobros } from '@antologico/dataconnect/react'

export default function UpdateEspacioCobrosComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useUpdateEspacioCobros();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useUpdateEspacioCobros(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpdateEspacioCobros(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpdateEspacioCobros(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useUpdateEspacioCobros` Mutation requires an argument of type `UpdateEspacioCobrosVariables`:
  const updateEspacioCobrosVars: UpdateEspacioCobrosVariables = {
    id: ..., 
    cobros: ..., // optional
  };
  mutation.mutate(updateEspacioCobrosVars);
  // Variables can be defined inline as well.
  mutation.mutate({ id: ..., cobros: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(updateEspacioCobrosVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.espacio_update);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## UpdateEspacioRedes
You can execute the `UpdateEspacioRedes` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useUpdateEspacioRedes(options?: useDataConnectMutationOptions<UpdateEspacioRedesData, FirebaseError, UpdateEspacioRedesVariables>): UseDataConnectMutationResult<UpdateEspacioRedesData, UpdateEspacioRedesVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useUpdateEspacioRedes(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateEspacioRedesData, FirebaseError, UpdateEspacioRedesVariables>): UseDataConnectMutationResult<UpdateEspacioRedesData, UpdateEspacioRedesVariables>;
```

### Variables
The `UpdateEspacioRedes` Mutation requires an argument of type `UpdateEspacioRedesVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface UpdateEspacioRedesVariables {
  id: UUIDString;
  redesSociales?: unknown | null;
}
```
### Return Type
Recall that calling the `UpdateEspacioRedes` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `UpdateEspacioRedes` Mutation is of type `UpdateEspacioRedesData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface UpdateEspacioRedesData {
  espacio_update?: Espacio_Key | null;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `UpdateEspacioRedes`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, UpdateEspacioRedesVariables } from '@antologico/dataconnect';
import { useUpdateEspacioRedes } from '@antologico/dataconnect/react'

export default function UpdateEspacioRedesComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useUpdateEspacioRedes();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useUpdateEspacioRedes(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpdateEspacioRedes(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpdateEspacioRedes(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useUpdateEspacioRedes` Mutation requires an argument of type `UpdateEspacioRedesVariables`:
  const updateEspacioRedesVars: UpdateEspacioRedesVariables = {
    id: ..., 
    redesSociales: ..., // optional
  };
  mutation.mutate(updateEspacioRedesVars);
  // Variables can be defined inline as well.
  mutation.mutate({ id: ..., redesSociales: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(updateEspacioRedesVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.espacio_update);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## UpdateEspacio
You can execute the `UpdateEspacio` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useUpdateEspacio(options?: useDataConnectMutationOptions<UpdateEspacioData, FirebaseError, UpdateEspacioVariables>): UseDataConnectMutationResult<UpdateEspacioData, UpdateEspacioVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useUpdateEspacio(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateEspacioData, FirebaseError, UpdateEspacioVariables>): UseDataConnectMutationResult<UpdateEspacioData, UpdateEspacioVariables>;
```

### Variables
The `UpdateEspacio` Mutation requires an argument of type `UpdateEspacioVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface UpdateEspacioVariables {
  id: UUIDString;
  nombre: string;
  rubroId?: UUIDString | null;
  rubroPersonalizado?: string | null;
}
```
### Return Type
Recall that calling the `UpdateEspacio` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `UpdateEspacio` Mutation is of type `UpdateEspacioData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface UpdateEspacioData {
  espacio_update?: Espacio_Key | null;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `UpdateEspacio`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, UpdateEspacioVariables } from '@antologico/dataconnect';
import { useUpdateEspacio } from '@antologico/dataconnect/react'

export default function UpdateEspacioComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useUpdateEspacio();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useUpdateEspacio(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpdateEspacio(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpdateEspacio(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useUpdateEspacio` Mutation requires an argument of type `UpdateEspacioVariables`:
  const updateEspacioVars: UpdateEspacioVariables = {
    id: ..., 
    nombre: ..., 
    rubroId: ..., // optional
    rubroPersonalizado: ..., // optional
  };
  mutation.mutate(updateEspacioVars);
  // Variables can be defined inline as well.
  mutation.mutate({ id: ..., nombre: ..., rubroId: ..., rubroPersonalizado: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(updateEspacioVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.espacio_update);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## UpdateEspacioDirecciones
You can execute the `UpdateEspacioDirecciones` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useUpdateEspacioDirecciones(options?: useDataConnectMutationOptions<UpdateEspacioDireccionesData, FirebaseError, UpdateEspacioDireccionesVariables>): UseDataConnectMutationResult<UpdateEspacioDireccionesData, UpdateEspacioDireccionesVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useUpdateEspacioDirecciones(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateEspacioDireccionesData, FirebaseError, UpdateEspacioDireccionesVariables>): UseDataConnectMutationResult<UpdateEspacioDireccionesData, UpdateEspacioDireccionesVariables>;
```

### Variables
The `UpdateEspacioDirecciones` Mutation requires an argument of type `UpdateEspacioDireccionesVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface UpdateEspacioDireccionesVariables {
  id: UUIDString;
  direcciones?: unknown | null;
}
```
### Return Type
Recall that calling the `UpdateEspacioDirecciones` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `UpdateEspacioDirecciones` Mutation is of type `UpdateEspacioDireccionesData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface UpdateEspacioDireccionesData {
  espacio_update?: Espacio_Key | null;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `UpdateEspacioDirecciones`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, UpdateEspacioDireccionesVariables } from '@antologico/dataconnect';
import { useUpdateEspacioDirecciones } from '@antologico/dataconnect/react'

export default function UpdateEspacioDireccionesComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useUpdateEspacioDirecciones();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useUpdateEspacioDirecciones(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpdateEspacioDirecciones(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpdateEspacioDirecciones(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useUpdateEspacioDirecciones` Mutation requires an argument of type `UpdateEspacioDireccionesVariables`:
  const updateEspacioDireccionesVars: UpdateEspacioDireccionesVariables = {
    id: ..., 
    direcciones: ..., // optional
  };
  mutation.mutate(updateEspacioDireccionesVars);
  // Variables can be defined inline as well.
  mutation.mutate({ id: ..., direcciones: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(updateEspacioDireccionesVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.espacio_update);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## UpdateEspacioTyC
You can execute the `UpdateEspacioTyC` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useUpdateEspacioTyC(options?: useDataConnectMutationOptions<UpdateEspacioTyCData, FirebaseError, UpdateEspacioTyCVariables>): UseDataConnectMutationResult<UpdateEspacioTyCData, UpdateEspacioTyCVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useUpdateEspacioTyC(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateEspacioTyCData, FirebaseError, UpdateEspacioTyCVariables>): UseDataConnectMutationResult<UpdateEspacioTyCData, UpdateEspacioTyCVariables>;
```

### Variables
The `UpdateEspacioTyC` Mutation requires an argument of type `UpdateEspacioTyCVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface UpdateEspacioTyCVariables {
  id: UUIDString;
  terminosCondiciones?: string | null;
  tycEnabled: boolean;
}
```
### Return Type
Recall that calling the `UpdateEspacioTyC` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `UpdateEspacioTyC` Mutation is of type `UpdateEspacioTyCData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface UpdateEspacioTyCData {
  espacio_update?: Espacio_Key | null;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `UpdateEspacioTyC`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, UpdateEspacioTyCVariables } from '@antologico/dataconnect';
import { useUpdateEspacioTyC } from '@antologico/dataconnect/react'

export default function UpdateEspacioTyCComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useUpdateEspacioTyC();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useUpdateEspacioTyC(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpdateEspacioTyC(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpdateEspacioTyC(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useUpdateEspacioTyC` Mutation requires an argument of type `UpdateEspacioTyCVariables`:
  const updateEspacioTyCVars: UpdateEspacioTyCVariables = {
    id: ..., 
    terminosCondiciones: ..., // optional
    tycEnabled: ..., 
  };
  mutation.mutate(updateEspacioTyCVars);
  // Variables can be defined inline as well.
  mutation.mutate({ id: ..., terminosCondiciones: ..., tycEnabled: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(updateEspacioTyCVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.espacio_update);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## UpdateEspacioSlug
You can execute the `UpdateEspacioSlug` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useUpdateEspacioSlug(options?: useDataConnectMutationOptions<UpdateEspacioSlugData, FirebaseError, UpdateEspacioSlugVariables>): UseDataConnectMutationResult<UpdateEspacioSlugData, UpdateEspacioSlugVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useUpdateEspacioSlug(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateEspacioSlugData, FirebaseError, UpdateEspacioSlugVariables>): UseDataConnectMutationResult<UpdateEspacioSlugData, UpdateEspacioSlugVariables>;
```

### Variables
The `UpdateEspacioSlug` Mutation requires an argument of type `UpdateEspacioSlugVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface UpdateEspacioSlugVariables {
  id: UUIDString;
  slug: string;
}
```
### Return Type
Recall that calling the `UpdateEspacioSlug` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `UpdateEspacioSlug` Mutation is of type `UpdateEspacioSlugData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface UpdateEspacioSlugData {
  espacio_update?: Espacio_Key | null;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `UpdateEspacioSlug`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, UpdateEspacioSlugVariables } from '@antologico/dataconnect';
import { useUpdateEspacioSlug } from '@antologico/dataconnect/react'

export default function UpdateEspacioSlugComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useUpdateEspacioSlug();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useUpdateEspacioSlug(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpdateEspacioSlug(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpdateEspacioSlug(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useUpdateEspacioSlug` Mutation requires an argument of type `UpdateEspacioSlugVariables`:
  const updateEspacioSlugVars: UpdateEspacioSlugVariables = {
    id: ..., 
    slug: ..., 
  };
  mutation.mutate(updateEspacioSlugVars);
  // Variables can be defined inline as well.
  mutation.mutate({ id: ..., slug: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(updateEspacioSlugVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.espacio_update);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## CreateWorkshop
You can execute the `CreateWorkshop` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useCreateWorkshop(options?: useDataConnectMutationOptions<CreateWorkshopData, FirebaseError, CreateWorkshopVariables>): UseDataConnectMutationResult<CreateWorkshopData, CreateWorkshopVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useCreateWorkshop(dc: DataConnect, options?: useDataConnectMutationOptions<CreateWorkshopData, FirebaseError, CreateWorkshopVariables>): UseDataConnectMutationResult<CreateWorkshopData, CreateWorkshopVariables>;
```

### Variables
The `CreateWorkshop` Mutation requires an argument of type `CreateWorkshopVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
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
```
### Return Type
Recall that calling the `CreateWorkshop` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `CreateWorkshop` Mutation is of type `CreateWorkshopData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface CreateWorkshopData {
  workshop_insert: Workshop_Key;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `CreateWorkshop`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, CreateWorkshopVariables } from '@antologico/dataconnect';
import { useCreateWorkshop } from '@antologico/dataconnect/react'

export default function CreateWorkshopComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useCreateWorkshop();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useCreateWorkshop(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useCreateWorkshop(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useCreateWorkshop(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useCreateWorkshop` Mutation requires an argument of type `CreateWorkshopVariables`:
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
  };
  mutation.mutate(createWorkshopVars);
  // Variables can be defined inline as well.
  mutation.mutate({ espacioId: ..., nombre: ..., tipo: ..., descripcion: ..., cuposTotales: ..., cuposDisponibles: ..., precio: ..., fecha: ..., duracionHoras: ..., duracionMinutos: ..., experienciaPrevia: ..., scheduleData: ..., headerType: ..., headerValue: ..., metodosPago: ..., estado: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(createWorkshopVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.workshop_insert);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## UpdateWorkshop
You can execute the `UpdateWorkshop` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useUpdateWorkshop(options?: useDataConnectMutationOptions<UpdateWorkshopData, FirebaseError, UpdateWorkshopVariables>): UseDataConnectMutationResult<UpdateWorkshopData, UpdateWorkshopVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useUpdateWorkshop(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateWorkshopData, FirebaseError, UpdateWorkshopVariables>): UseDataConnectMutationResult<UpdateWorkshopData, UpdateWorkshopVariables>;
```

### Variables
The `UpdateWorkshop` Mutation requires an argument of type `UpdateWorkshopVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
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
```
### Return Type
Recall that calling the `UpdateWorkshop` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `UpdateWorkshop` Mutation is of type `UpdateWorkshopData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface UpdateWorkshopData {
  workshop_update?: Workshop_Key | null;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `UpdateWorkshop`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, UpdateWorkshopVariables } from '@antologico/dataconnect';
import { useUpdateWorkshop } from '@antologico/dataconnect/react'

export default function UpdateWorkshopComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useUpdateWorkshop();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useUpdateWorkshop(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpdateWorkshop(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpdateWorkshop(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useUpdateWorkshop` Mutation requires an argument of type `UpdateWorkshopVariables`:
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
  };
  mutation.mutate(updateWorkshopVars);
  // Variables can be defined inline as well.
  mutation.mutate({ id: ..., espacioId: ..., nombre: ..., tipo: ..., descripcion: ..., cuposTotales: ..., cuposDisponibles: ..., precio: ..., fecha: ..., duracionHoras: ..., duracionMinutos: ..., experienciaPrevia: ..., scheduleData: ..., headerType: ..., headerValue: ..., metodosPago: ..., estado: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(updateWorkshopVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.workshop_update);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## UpdateWorkshopEstado
You can execute the `UpdateWorkshopEstado` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useUpdateWorkshopEstado(options?: useDataConnectMutationOptions<UpdateWorkshopEstadoData, FirebaseError, UpdateWorkshopEstadoVariables>): UseDataConnectMutationResult<UpdateWorkshopEstadoData, UpdateWorkshopEstadoVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useUpdateWorkshopEstado(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateWorkshopEstadoData, FirebaseError, UpdateWorkshopEstadoVariables>): UseDataConnectMutationResult<UpdateWorkshopEstadoData, UpdateWorkshopEstadoVariables>;
```

### Variables
The `UpdateWorkshopEstado` Mutation requires an argument of type `UpdateWorkshopEstadoVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface UpdateWorkshopEstadoVariables {
  id: UUIDString;
  espacioId: UUIDString;
  estado: EstadoWorkshop;
  cuposDisponibles: number;
}
```
### Return Type
Recall that calling the `UpdateWorkshopEstado` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `UpdateWorkshopEstado` Mutation is of type `UpdateWorkshopEstadoData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface UpdateWorkshopEstadoData {
  workshop_update?: Workshop_Key | null;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `UpdateWorkshopEstado`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, UpdateWorkshopEstadoVariables } from '@antologico/dataconnect';
import { useUpdateWorkshopEstado } from '@antologico/dataconnect/react'

export default function UpdateWorkshopEstadoComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useUpdateWorkshopEstado();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useUpdateWorkshopEstado(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpdateWorkshopEstado(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpdateWorkshopEstado(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useUpdateWorkshopEstado` Mutation requires an argument of type `UpdateWorkshopEstadoVariables`:
  const updateWorkshopEstadoVars: UpdateWorkshopEstadoVariables = {
    id: ..., 
    espacioId: ..., 
    estado: ..., 
    cuposDisponibles: ..., 
  };
  mutation.mutate(updateWorkshopEstadoVars);
  // Variables can be defined inline as well.
  mutation.mutate({ id: ..., espacioId: ..., estado: ..., cuposDisponibles: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(updateWorkshopEstadoVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.workshop_update);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## DeleteWorkshop
You can execute the `DeleteWorkshop` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useDeleteWorkshop(options?: useDataConnectMutationOptions<DeleteWorkshopData, FirebaseError, DeleteWorkshopVariables>): UseDataConnectMutationResult<DeleteWorkshopData, DeleteWorkshopVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useDeleteWorkshop(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteWorkshopData, FirebaseError, DeleteWorkshopVariables>): UseDataConnectMutationResult<DeleteWorkshopData, DeleteWorkshopVariables>;
```

### Variables
The `DeleteWorkshop` Mutation requires an argument of type `DeleteWorkshopVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface DeleteWorkshopVariables {
  id: UUIDString;
  espacioId: UUIDString;
}
```
### Return Type
Recall that calling the `DeleteWorkshop` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `DeleteWorkshop` Mutation is of type `DeleteWorkshopData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface DeleteWorkshopData {
  workshop_delete?: Workshop_Key | null;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `DeleteWorkshop`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, DeleteWorkshopVariables } from '@antologico/dataconnect';
import { useDeleteWorkshop } from '@antologico/dataconnect/react'

export default function DeleteWorkshopComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useDeleteWorkshop();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useDeleteWorkshop(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useDeleteWorkshop(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useDeleteWorkshop(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useDeleteWorkshop` Mutation requires an argument of type `DeleteWorkshopVariables`:
  const deleteWorkshopVars: DeleteWorkshopVariables = {
    id: ..., 
    espacioId: ..., 
  };
  mutation.mutate(deleteWorkshopVars);
  // Variables can be defined inline as well.
  mutation.mutate({ id: ..., espacioId: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(deleteWorkshopVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.workshop_delete);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## SolicitarCancelacionEspacio
You can execute the `SolicitarCancelacionEspacio` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useSolicitarCancelacionEspacio(options?: useDataConnectMutationOptions<SolicitarCancelacionEspacioData, FirebaseError, SolicitarCancelacionEspacioVariables>): UseDataConnectMutationResult<SolicitarCancelacionEspacioData, SolicitarCancelacionEspacioVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useSolicitarCancelacionEspacio(dc: DataConnect, options?: useDataConnectMutationOptions<SolicitarCancelacionEspacioData, FirebaseError, SolicitarCancelacionEspacioVariables>): UseDataConnectMutationResult<SolicitarCancelacionEspacioData, SolicitarCancelacionEspacioVariables>;
```

### Variables
The `SolicitarCancelacionEspacio` Mutation requires an argument of type `SolicitarCancelacionEspacioVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface SolicitarCancelacionEspacioVariables {
  id: UUIDString;
}
```
### Return Type
Recall that calling the `SolicitarCancelacionEspacio` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `SolicitarCancelacionEspacio` Mutation is of type `SolicitarCancelacionEspacioData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface SolicitarCancelacionEspacioData {
  espacio_update?: Espacio_Key | null;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `SolicitarCancelacionEspacio`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, SolicitarCancelacionEspacioVariables } from '@antologico/dataconnect';
import { useSolicitarCancelacionEspacio } from '@antologico/dataconnect/react'

export default function SolicitarCancelacionEspacioComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useSolicitarCancelacionEspacio();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useSolicitarCancelacionEspacio(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useSolicitarCancelacionEspacio(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useSolicitarCancelacionEspacio(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useSolicitarCancelacionEspacio` Mutation requires an argument of type `SolicitarCancelacionEspacioVariables`:
  const solicitarCancelacionEspacioVars: SolicitarCancelacionEspacioVariables = {
    id: ..., 
  };
  mutation.mutate(solicitarCancelacionEspacioVars);
  // Variables can be defined inline as well.
  mutation.mutate({ id: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(solicitarCancelacionEspacioVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.espacio_update);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## ReactivarSuscripcionEspacio
You can execute the `ReactivarSuscripcionEspacio` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useReactivarSuscripcionEspacio(options?: useDataConnectMutationOptions<ReactivarSuscripcionEspacioData, FirebaseError, ReactivarSuscripcionEspacioVariables>): UseDataConnectMutationResult<ReactivarSuscripcionEspacioData, ReactivarSuscripcionEspacioVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useReactivarSuscripcionEspacio(dc: DataConnect, options?: useDataConnectMutationOptions<ReactivarSuscripcionEspacioData, FirebaseError, ReactivarSuscripcionEspacioVariables>): UseDataConnectMutationResult<ReactivarSuscripcionEspacioData, ReactivarSuscripcionEspacioVariables>;
```

### Variables
The `ReactivarSuscripcionEspacio` Mutation requires an argument of type `ReactivarSuscripcionEspacioVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface ReactivarSuscripcionEspacioVariables {
  id: UUIDString;
}
```
### Return Type
Recall that calling the `ReactivarSuscripcionEspacio` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `ReactivarSuscripcionEspacio` Mutation is of type `ReactivarSuscripcionEspacioData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface ReactivarSuscripcionEspacioData {
  espacio_update?: Espacio_Key | null;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `ReactivarSuscripcionEspacio`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, ReactivarSuscripcionEspacioVariables } from '@antologico/dataconnect';
import { useReactivarSuscripcionEspacio } from '@antologico/dataconnect/react'

export default function ReactivarSuscripcionEspacioComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useReactivarSuscripcionEspacio();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useReactivarSuscripcionEspacio(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useReactivarSuscripcionEspacio(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useReactivarSuscripcionEspacio(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useReactivarSuscripcionEspacio` Mutation requires an argument of type `ReactivarSuscripcionEspacioVariables`:
  const reactivarSuscripcionEspacioVars: ReactivarSuscripcionEspacioVariables = {
    id: ..., 
  };
  mutation.mutate(reactivarSuscripcionEspacioVars);
  // Variables can be defined inline as well.
  mutation.mutate({ id: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(reactivarSuscripcionEspacioVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.espacio_update);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## CancelarReserva
You can execute the `CancelarReserva` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useCancelarReserva(options?: useDataConnectMutationOptions<CancelarReservaData, FirebaseError, CancelarReservaVariables>): UseDataConnectMutationResult<CancelarReservaData, CancelarReservaVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useCancelarReserva(dc: DataConnect, options?: useDataConnectMutationOptions<CancelarReservaData, FirebaseError, CancelarReservaVariables>): UseDataConnectMutationResult<CancelarReservaData, CancelarReservaVariables>;
```

### Variables
The `CancelarReserva` Mutation requires an argument of type `CancelarReservaVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface CancelarReservaVariables {
  id: UUIDString;
  workshopId: UUIDString;
}
```
### Return Type
Recall that calling the `CancelarReserva` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `CancelarReserva` Mutation is of type `CancelarReservaData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface CancelarReservaData {
  reserva_update?: Reserva_Key | null;
  workshop_update?: Workshop_Key | null;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `CancelarReserva`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, CancelarReservaVariables } from '@antologico/dataconnect';
import { useCancelarReserva } from '@antologico/dataconnect/react'

export default function CancelarReservaComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useCancelarReserva();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useCancelarReserva(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useCancelarReserva(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useCancelarReserva(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useCancelarReserva` Mutation requires an argument of type `CancelarReservaVariables`:
  const cancelarReservaVars: CancelarReservaVariables = {
    id: ..., 
    workshopId: ..., 
  };
  mutation.mutate(cancelarReservaVars);
  // Variables can be defined inline as well.
  mutation.mutate({ id: ..., workshopId: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(cancelarReservaVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.reserva_update);
    console.log(mutation.data.workshop_update);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## AdminUpdateEspacio
You can execute the `AdminUpdateEspacio` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useAdminUpdateEspacio(options?: useDataConnectMutationOptions<AdminUpdateEspacioData, FirebaseError, AdminUpdateEspacioVariables>): UseDataConnectMutationResult<AdminUpdateEspacioData, AdminUpdateEspacioVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useAdminUpdateEspacio(dc: DataConnect, options?: useDataConnectMutationOptions<AdminUpdateEspacioData, FirebaseError, AdminUpdateEspacioVariables>): UseDataConnectMutationResult<AdminUpdateEspacioData, AdminUpdateEspacioVariables>;
```

### Variables
The `AdminUpdateEspacio` Mutation requires an argument of type `AdminUpdateEspacioVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface AdminUpdateEspacioVariables {
  id: UUIDString;
  bloqueado?: boolean | null;
  trialStartedAt?: TimestampString | null;
  slug?: string | null;
  estado?: EstadoEspacio | null;
}
```
### Return Type
Recall that calling the `AdminUpdateEspacio` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `AdminUpdateEspacio` Mutation is of type `AdminUpdateEspacioData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface AdminUpdateEspacioData {
  espacio_update?: Espacio_Key | null;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `AdminUpdateEspacio`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, AdminUpdateEspacioVariables } from '@antologico/dataconnect';
import { useAdminUpdateEspacio } from '@antologico/dataconnect/react'

export default function AdminUpdateEspacioComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useAdminUpdateEspacio();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useAdminUpdateEspacio(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useAdminUpdateEspacio(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useAdminUpdateEspacio(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useAdminUpdateEspacio` Mutation requires an argument of type `AdminUpdateEspacioVariables`:
  const adminUpdateEspacioVars: AdminUpdateEspacioVariables = {
    id: ..., 
    bloqueado: ..., // optional
    trialStartedAt: ..., // optional
    slug: ..., // optional
    estado: ..., // optional
  };
  mutation.mutate(adminUpdateEspacioVars);
  // Variables can be defined inline as well.
  mutation.mutate({ id: ..., bloqueado: ..., trialStartedAt: ..., slug: ..., estado: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(adminUpdateEspacioVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.espacio_update);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## AdminDeleteEspacio
You can execute the `AdminDeleteEspacio` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useAdminDeleteEspacio(options?: useDataConnectMutationOptions<AdminDeleteEspacioData, FirebaseError, AdminDeleteEspacioVariables>): UseDataConnectMutationResult<AdminDeleteEspacioData, AdminDeleteEspacioVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useAdminDeleteEspacio(dc: DataConnect, options?: useDataConnectMutationOptions<AdminDeleteEspacioData, FirebaseError, AdminDeleteEspacioVariables>): UseDataConnectMutationResult<AdminDeleteEspacioData, AdminDeleteEspacioVariables>;
```

### Variables
The `AdminDeleteEspacio` Mutation requires an argument of type `AdminDeleteEspacioVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface AdminDeleteEspacioVariables {
  id: UUIDString;
}
```
### Return Type
Recall that calling the `AdminDeleteEspacio` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `AdminDeleteEspacio` Mutation is of type `AdminDeleteEspacioData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface AdminDeleteEspacioData {
  deletedData?: number | null;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `AdminDeleteEspacio`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, AdminDeleteEspacioVariables } from '@antologico/dataconnect';
import { useAdminDeleteEspacio } from '@antologico/dataconnect/react'

export default function AdminDeleteEspacioComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useAdminDeleteEspacio();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useAdminDeleteEspacio(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useAdminDeleteEspacio(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useAdminDeleteEspacio(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useAdminDeleteEspacio` Mutation requires an argument of type `AdminDeleteEspacioVariables`:
  const adminDeleteEspacioVars: AdminDeleteEspacioVariables = {
    id: ..., 
  };
  mutation.mutate(adminDeleteEspacioVars);
  // Variables can be defined inline as well.
  mutation.mutate({ id: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(adminDeleteEspacioVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.deletedData);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## AdminDeleteProfesional
You can execute the `AdminDeleteProfesional` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useAdminDeleteProfesional(options?: useDataConnectMutationOptions<AdminDeleteProfesionalData, FirebaseError, AdminDeleteProfesionalVariables>): UseDataConnectMutationResult<AdminDeleteProfesionalData, AdminDeleteProfesionalVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useAdminDeleteProfesional(dc: DataConnect, options?: useDataConnectMutationOptions<AdminDeleteProfesionalData, FirebaseError, AdminDeleteProfesionalVariables>): UseDataConnectMutationResult<AdminDeleteProfesionalData, AdminDeleteProfesionalVariables>;
```

### Variables
The `AdminDeleteProfesional` Mutation requires an argument of type `AdminDeleteProfesionalVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface AdminDeleteProfesionalVariables {
  uid: string;
}
```
### Return Type
Recall that calling the `AdminDeleteProfesional` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `AdminDeleteProfesional` Mutation is of type `AdminDeleteProfesionalData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface AdminDeleteProfesionalData {
  profesional_delete?: Profesional_Key | null;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `AdminDeleteProfesional`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, AdminDeleteProfesionalVariables } from '@antologico/dataconnect';
import { useAdminDeleteProfesional } from '@antologico/dataconnect/react'

export default function AdminDeleteProfesionalComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useAdminDeleteProfesional();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useAdminDeleteProfesional(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useAdminDeleteProfesional(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useAdminDeleteProfesional(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useAdminDeleteProfesional` Mutation requires an argument of type `AdminDeleteProfesionalVariables`:
  const adminDeleteProfesionalVars: AdminDeleteProfesionalVariables = {
    uid: ..., 
  };
  mutation.mutate(adminDeleteProfesionalVars);
  // Variables can be defined inline as well.
  mutation.mutate({ uid: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(adminDeleteProfesionalVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.profesional_delete);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## AdminUpsertProfesional
You can execute the `AdminUpsertProfesional` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useAdminUpsertProfesional(options?: useDataConnectMutationOptions<AdminUpsertProfesionalData, FirebaseError, AdminUpsertProfesionalVariables>): UseDataConnectMutationResult<AdminUpsertProfesionalData, AdminUpsertProfesionalVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useAdminUpsertProfesional(dc: DataConnect, options?: useDataConnectMutationOptions<AdminUpsertProfesionalData, FirebaseError, AdminUpsertProfesionalVariables>): UseDataConnectMutationResult<AdminUpsertProfesionalData, AdminUpsertProfesionalVariables>;
```

### Variables
The `AdminUpsertProfesional` Mutation requires an argument of type `AdminUpsertProfesionalVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface AdminUpsertProfesionalVariables {
  uid: string;
  nombre: string;
  email: string;
}
```
### Return Type
Recall that calling the `AdminUpsertProfesional` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `AdminUpsertProfesional` Mutation is of type `AdminUpsertProfesionalData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface AdminUpsertProfesionalData {
  profesional_upsert: Profesional_Key;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `AdminUpsertProfesional`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, AdminUpsertProfesionalVariables } from '@antologico/dataconnect';
import { useAdminUpsertProfesional } from '@antologico/dataconnect/react'

export default function AdminUpsertProfesionalComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useAdminUpsertProfesional();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useAdminUpsertProfesional(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useAdminUpsertProfesional(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useAdminUpsertProfesional(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useAdminUpsertProfesional` Mutation requires an argument of type `AdminUpsertProfesionalVariables`:
  const adminUpsertProfesionalVars: AdminUpsertProfesionalVariables = {
    uid: ..., 
    nombre: ..., 
    email: ..., 
  };
  mutation.mutate(adminUpsertProfesionalVars);
  // Variables can be defined inline as well.
  mutation.mutate({ uid: ..., nombre: ..., email: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(adminUpsertProfesionalVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.profesional_upsert);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## AdminEnsureProfesional
You can execute the `AdminEnsureProfesional` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useAdminEnsureProfesional(options?: useDataConnectMutationOptions<AdminEnsureProfesionalData, FirebaseError, AdminEnsureProfesionalVariables>): UseDataConnectMutationResult<AdminEnsureProfesionalData, AdminEnsureProfesionalVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useAdminEnsureProfesional(dc: DataConnect, options?: useDataConnectMutationOptions<AdminEnsureProfesionalData, FirebaseError, AdminEnsureProfesionalVariables>): UseDataConnectMutationResult<AdminEnsureProfesionalData, AdminEnsureProfesionalVariables>;
```

### Variables
The `AdminEnsureProfesional` Mutation requires an argument of type `AdminEnsureProfesionalVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface AdminEnsureProfesionalVariables {
  uid: string;
  nombre: string;
  email: string;
}
```
### Return Type
Recall that calling the `AdminEnsureProfesional` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `AdminEnsureProfesional` Mutation is of type `AdminEnsureProfesionalData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface AdminEnsureProfesionalData {
  result?: number | null;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `AdminEnsureProfesional`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, AdminEnsureProfesionalVariables } from '@antologico/dataconnect';
import { useAdminEnsureProfesional } from '@antologico/dataconnect/react'

export default function AdminEnsureProfesionalComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useAdminEnsureProfesional();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useAdminEnsureProfesional(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useAdminEnsureProfesional(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useAdminEnsureProfesional(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useAdminEnsureProfesional` Mutation requires an argument of type `AdminEnsureProfesionalVariables`:
  const adminEnsureProfesionalVars: AdminEnsureProfesionalVariables = {
    uid: ..., 
    nombre: ..., 
    email: ..., 
  };
  mutation.mutate(adminEnsureProfesionalVars);
  // Variables can be defined inline as well.
  mutation.mutate({ uid: ..., nombre: ..., email: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(adminEnsureProfesionalVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.result);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## AdminCreateEspacioMigrate
You can execute the `AdminCreateEspacioMigrate` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useAdminCreateEspacioMigrate(options?: useDataConnectMutationOptions<AdminCreateEspacioMigrateData, FirebaseError, AdminCreateEspacioMigrateVariables>): UseDataConnectMutationResult<AdminCreateEspacioMigrateData, AdminCreateEspacioMigrateVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useAdminCreateEspacioMigrate(dc: DataConnect, options?: useDataConnectMutationOptions<AdminCreateEspacioMigrateData, FirebaseError, AdminCreateEspacioMigrateVariables>): UseDataConnectMutationResult<AdminCreateEspacioMigrateData, AdminCreateEspacioMigrateVariables>;
```

### Variables
The `AdminCreateEspacioMigrate` Mutation requires an argument of type `AdminCreateEspacioMigrateVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
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
Recall that calling the `AdminCreateEspacioMigrate` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `AdminCreateEspacioMigrate` Mutation is of type `AdminCreateEspacioMigrateData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface AdminCreateEspacioMigrateData {
  espacio_insert: Espacio_Key;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `AdminCreateEspacioMigrate`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, AdminCreateEspacioMigrateVariables } from '@antologico/dataconnect';
import { useAdminCreateEspacioMigrate } from '@antologico/dataconnect/react'

export default function AdminCreateEspacioMigrateComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useAdminCreateEspacioMigrate();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useAdminCreateEspacioMigrate(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useAdminCreateEspacioMigrate(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useAdminCreateEspacioMigrate(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useAdminCreateEspacioMigrate` Mutation requires an argument of type `AdminCreateEspacioMigrateVariables`:
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
  mutation.mutate(adminCreateEspacioMigrateVars);
  // Variables can be defined inline as well.
  mutation.mutate({ profesionalUid: ..., nombre: ..., rubroPersonalizado: ..., slug: ..., logoUrl: ..., logoShape: ..., logoScale: ..., brandColors: ..., brandFont: ..., redesSociales: ..., cobros: ..., estado: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(adminCreateEspacioMigrateVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.espacio_insert);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## AdminCreateWorkshopMigrate
You can execute the `AdminCreateWorkshopMigrate` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useAdminCreateWorkshopMigrate(options?: useDataConnectMutationOptions<AdminCreateWorkshopMigrateData, FirebaseError, AdminCreateWorkshopMigrateVariables>): UseDataConnectMutationResult<AdminCreateWorkshopMigrateData, AdminCreateWorkshopMigrateVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useAdminCreateWorkshopMigrate(dc: DataConnect, options?: useDataConnectMutationOptions<AdminCreateWorkshopMigrateData, FirebaseError, AdminCreateWorkshopMigrateVariables>): UseDataConnectMutationResult<AdminCreateWorkshopMigrateData, AdminCreateWorkshopMigrateVariables>;
```

### Variables
The `AdminCreateWorkshopMigrate` Mutation requires an argument of type `AdminCreateWorkshopMigrateVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
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
Recall that calling the `AdminCreateWorkshopMigrate` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `AdminCreateWorkshopMigrate` Mutation is of type `AdminCreateWorkshopMigrateData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface AdminCreateWorkshopMigrateData {
  workshop_insert: Workshop_Key;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `AdminCreateWorkshopMigrate`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, AdminCreateWorkshopMigrateVariables } from '@antologico/dataconnect';
import { useAdminCreateWorkshopMigrate } from '@antologico/dataconnect/react'

export default function AdminCreateWorkshopMigrateComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useAdminCreateWorkshopMigrate();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useAdminCreateWorkshopMigrate(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useAdminCreateWorkshopMigrate(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useAdminCreateWorkshopMigrate(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useAdminCreateWorkshopMigrate` Mutation requires an argument of type `AdminCreateWorkshopMigrateVariables`:
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
  mutation.mutate(adminCreateWorkshopMigrateVars);
  // Variables can be defined inline as well.
  mutation.mutate({ espacioId: ..., nombre: ..., tipo: ..., descripcion: ..., cuposTotales: ..., cuposDisponibles: ..., precio: ..., fecha: ..., duracionHoras: ..., duracionMinutos: ..., experienciaPrevia: ..., scheduleData: ..., headerType: ..., headerValue: ..., metodosPago: ..., estado: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(adminCreateWorkshopMigrateVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.workshop_insert);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## DecrementarCupo
You can execute the `DecrementarCupo` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useDecrementarCupo(options?: useDataConnectMutationOptions<DecrementarCupoData, FirebaseError, DecrementarCupoVariables>): UseDataConnectMutationResult<DecrementarCupoData, DecrementarCupoVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useDecrementarCupo(dc: DataConnect, options?: useDataConnectMutationOptions<DecrementarCupoData, FirebaseError, DecrementarCupoVariables>): UseDataConnectMutationResult<DecrementarCupoData, DecrementarCupoVariables>;
```

### Variables
The `DecrementarCupo` Mutation requires an argument of type `DecrementarCupoVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface DecrementarCupoVariables {
  workshopId: UUIDString;
}
```
### Return Type
Recall that calling the `DecrementarCupo` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `DecrementarCupo` Mutation is of type `DecrementarCupoData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface DecrementarCupoData {
  workshop_update?: Workshop_Key | null;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `DecrementarCupo`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, DecrementarCupoVariables } from '@antologico/dataconnect';
import { useDecrementarCupo } from '@antologico/dataconnect/react'

export default function DecrementarCupoComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useDecrementarCupo();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useDecrementarCupo(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useDecrementarCupo(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useDecrementarCupo(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useDecrementarCupo` Mutation requires an argument of type `DecrementarCupoVariables`:
  const decrementarCupoVars: DecrementarCupoVariables = {
    workshopId: ..., 
  };
  mutation.mutate(decrementarCupoVars);
  // Variables can be defined inline as well.
  mutation.mutate({ workshopId: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(decrementarCupoVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.workshop_update);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## CreateReservaConUsuario
You can execute the `CreateReservaConUsuario` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useCreateReservaConUsuario(options?: useDataConnectMutationOptions<CreateReservaConUsuarioData, FirebaseError, CreateReservaConUsuarioVariables>): UseDataConnectMutationResult<CreateReservaConUsuarioData, CreateReservaConUsuarioVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useCreateReservaConUsuario(dc: DataConnect, options?: useDataConnectMutationOptions<CreateReservaConUsuarioData, FirebaseError, CreateReservaConUsuarioVariables>): UseDataConnectMutationResult<CreateReservaConUsuarioData, CreateReservaConUsuarioVariables>;
```

### Variables
The `CreateReservaConUsuario` Mutation requires an argument of type `CreateReservaConUsuarioVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
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
Recall that calling the `CreateReservaConUsuario` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `CreateReservaConUsuario` Mutation is of type `CreateReservaConUsuarioData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface CreateReservaConUsuarioData {
  usuario_upsert: Usuario_Key;
  reserva_insert: Reserva_Key;
  workshop_update?: Workshop_Key | null;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `CreateReservaConUsuario`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, CreateReservaConUsuarioVariables } from '@antologico/dataconnect';
import { useCreateReservaConUsuario } from '@antologico/dataconnect/react'

export default function CreateReservaConUsuarioComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useCreateReservaConUsuario();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useCreateReservaConUsuario(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useCreateReservaConUsuario(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useCreateReservaConUsuario(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useCreateReservaConUsuario` Mutation requires an argument of type `CreateReservaConUsuarioVariables`:
  const createReservaConUsuarioVars: CreateReservaConUsuarioVariables = {
    nombre: ..., 
    email: ..., 
    workshopId: ..., 
    estado: ..., 
    metodoPago: ..., // optional
    estadoPago: ..., // optional
    pagoExternoId: ..., // optional
  };
  mutation.mutate(createReservaConUsuarioVars);
  // Variables can be defined inline as well.
  mutation.mutate({ nombre: ..., email: ..., workshopId: ..., estado: ..., metodoPago: ..., estadoPago: ..., pagoExternoId: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(createReservaConUsuarioVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.usuario_upsert);
    console.log(mutation.data.reserva_insert);
    console.log(mutation.data.workshop_update);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## MarkReservaPaid
You can execute the `MarkReservaPaid` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useMarkReservaPaid(options?: useDataConnectMutationOptions<MarkReservaPaidData, FirebaseError, MarkReservaPaidVariables>): UseDataConnectMutationResult<MarkReservaPaidData, MarkReservaPaidVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useMarkReservaPaid(dc: DataConnect, options?: useDataConnectMutationOptions<MarkReservaPaidData, FirebaseError, MarkReservaPaidVariables>): UseDataConnectMutationResult<MarkReservaPaidData, MarkReservaPaidVariables>;
```

### Variables
The `MarkReservaPaid` Mutation requires an argument of type `MarkReservaPaidVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface MarkReservaPaidVariables {
  id: UUIDString;
}
```
### Return Type
Recall that calling the `MarkReservaPaid` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `MarkReservaPaid` Mutation is of type `MarkReservaPaidData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface MarkReservaPaidData {
  reserva_update?: Reserva_Key | null;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `MarkReservaPaid`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, MarkReservaPaidVariables } from '@antologico/dataconnect';
import { useMarkReservaPaid } from '@antologico/dataconnect/react'

export default function MarkReservaPaidComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useMarkReservaPaid();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useMarkReservaPaid(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useMarkReservaPaid(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useMarkReservaPaid(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useMarkReservaPaid` Mutation requires an argument of type `MarkReservaPaidVariables`:
  const markReservaPaidVars: MarkReservaPaidVariables = {
    id: ..., 
  };
  mutation.mutate(markReservaPaidVars);
  // Variables can be defined inline as well.
  mutation.mutate({ id: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(markReservaPaidVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.reserva_update);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## DevExpireTrial
You can execute the `DevExpireTrial` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useDevExpireTrial(options?: useDataConnectMutationOptions<DevExpireTrialData, FirebaseError, DevExpireTrialVariables>): UseDataConnectMutationResult<DevExpireTrialData, DevExpireTrialVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useDevExpireTrial(dc: DataConnect, options?: useDataConnectMutationOptions<DevExpireTrialData, FirebaseError, DevExpireTrialVariables>): UseDataConnectMutationResult<DevExpireTrialData, DevExpireTrialVariables>;
```

### Variables
The `DevExpireTrial` Mutation requires an argument of type `DevExpireTrialVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface DevExpireTrialVariables {
  espacioId: UUIDString;
}
```
### Return Type
Recall that calling the `DevExpireTrial` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `DevExpireTrial` Mutation is of type `DevExpireTrialData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface DevExpireTrialData {
  expired?: number | null;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `DevExpireTrial`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, DevExpireTrialVariables } from '@antologico/dataconnect';
import { useDevExpireTrial } from '@antologico/dataconnect/react'

export default function DevExpireTrialComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useDevExpireTrial();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useDevExpireTrial(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useDevExpireTrial(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useDevExpireTrial(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useDevExpireTrial` Mutation requires an argument of type `DevExpireTrialVariables`:
  const devExpireTrialVars: DevExpireTrialVariables = {
    espacioId: ..., 
  };
  mutation.mutate(devExpireTrialVars);
  // Variables can be defined inline as well.
  mutation.mutate({ espacioId: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(devExpireTrialVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.expired);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

