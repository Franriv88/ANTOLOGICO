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
  - [*ListPublicWorkshops*](#listpublicworkshops)
- [**Mutations**](#mutations)
  - [*UpsertProfesional*](#upsertprofesional)
  - [*UpdateEspacioPlanId*](#updateespacioplanid)
  - [*CreateEspacio*](#createespacio)
  - [*UpdateEspacioIdentidad*](#updateespacioidentidad)
  - [*UpdateEspacioCobros*](#updateespaciocobros)
  - [*UpdateEspacioRedes*](#updateespacioredes)
  - [*UpdateEspacio*](#updateespacio)
  - [*CreateWorkshop*](#createworkshop)
  - [*UpdateWorkshop*](#updateworkshop)
  - [*UpdateWorkshopEstado*](#updateworkshopestado)
  - [*DeleteWorkshop*](#deleteworkshop)
  - [*SolicitarCancelacionEspacio*](#solicitarcancelacionespacio)
  - [*ReactivarSuscripcionEspacio*](#reactivarsuscripcionespacio)
  - [*CancelarReserva*](#cancelarreserva)
  - [*DecrementarCupo*](#decrementarcupo)

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
    logoUrl?: string | null;
    logoShape?: string | null;
    logoScale?: number | null;
    brandColors?: unknown | null;
    brandFont?: string | null;
    redesSociales?: unknown | null;
    cobros?: unknown | null;
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
    logoUrl?: string | null;
    logoShape?: string | null;
    logoScale?: number | null;
    brandColors?: unknown | null;
    brandFont?: string | null;
    redesSociales?: unknown | null;
    cobros?: unknown | null;
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

## UpdateEspacioPlanId
You can execute the `UpdateEspacioPlanId` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useUpdateEspacioPlanId(options?: useDataConnectMutationOptions<UpdateEspacioPlanIdData, FirebaseError, UpdateEspacioPlanIdVariables>): UseDataConnectMutationResult<UpdateEspacioPlanIdData, UpdateEspacioPlanIdVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useUpdateEspacioPlanId(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateEspacioPlanIdData, FirebaseError, UpdateEspacioPlanIdVariables>): UseDataConnectMutationResult<UpdateEspacioPlanIdData, UpdateEspacioPlanIdVariables>;
```

### Variables
The `UpdateEspacioPlanId` Mutation requires an argument of type `UpdateEspacioPlanIdVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface UpdateEspacioPlanIdVariables {
  id: UUIDString;
  planId: UUIDString;
}
```
### Return Type
Recall that calling the `UpdateEspacioPlanId` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `UpdateEspacioPlanId` Mutation is of type `UpdateEspacioPlanIdData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface UpdateEspacioPlanIdData {
  espacio_update?: Espacio_Key | null;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `UpdateEspacioPlanId`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, UpdateEspacioPlanIdVariables } from '@antologico/dataconnect';
import { useUpdateEspacioPlanId } from '@antologico/dataconnect/react'

export default function UpdateEspacioPlanIdComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useUpdateEspacioPlanId();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useUpdateEspacioPlanId(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpdateEspacioPlanId(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpdateEspacioPlanId(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useUpdateEspacioPlanId` Mutation requires an argument of type `UpdateEspacioPlanIdVariables`:
  const updateEspacioPlanIdVars: UpdateEspacioPlanIdVariables = {
    id: ..., 
    planId: ..., 
  };
  mutation.mutate(updateEspacioPlanIdVars);
  // Variables can be defined inline as well.
  mutation.mutate({ id: ..., planId: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(updateEspacioPlanIdVars, options);

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

