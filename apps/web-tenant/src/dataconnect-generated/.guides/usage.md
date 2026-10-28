# Basic Usage

Always prioritize using a supported framework over using the generated SDK
directly. Supported frameworks simplify the developer experience and help ensure
best practices are followed.




### React
For each operation, there is a wrapper hook that can be used to call the operation.

Here are all of the hooks that get generated:
```ts
import { useUpsertProfesional, useReassignProfesionalUid, useUpdateEspacioPlanId, useCreateEspacio, useUpdateEspacioIdentidad, useUpdateEspacioCobros, useUpdateEspacioRedes, useUpdateEspacio, useCreateWorkshop, useUpdateWorkshop } from '@antologico/dataconnect/react';
// The types of these hooks are available in react/index.d.ts

const { data, isPending, isSuccess, isError, error } = useUpsertProfesional(upsertProfesionalVars);

const { data, isPending, isSuccess, isError, error } = useReassignProfesionalUid(reassignProfesionalUidVars);

const { data, isPending, isSuccess, isError, error } = useUpdateEspacioPlanId(updateEspacioPlanIdVars);

const { data, isPending, isSuccess, isError, error } = useCreateEspacio(createEspacioVars);

const { data, isPending, isSuccess, isError, error } = useUpdateEspacioIdentidad(updateEspacioIdentidadVars);

const { data, isPending, isSuccess, isError, error } = useUpdateEspacioCobros(updateEspacioCobrosVars);

const { data, isPending, isSuccess, isError, error } = useUpdateEspacioRedes(updateEspacioRedesVars);

const { data, isPending, isSuccess, isError, error } = useUpdateEspacio(updateEspacioVars);

const { data, isPending, isSuccess, isError, error } = useCreateWorkshop(createWorkshopVars);

const { data, isPending, isSuccess, isError, error } = useUpdateWorkshop(updateWorkshopVars);

```

Here's an example from a different generated SDK:

```ts
import { useListAllMovies } from '@dataconnect/generated/react';

function MyComponent() {
  const { isLoading, data, error } = useListAllMovies();
  if(isLoading) {
    return <div>Loading...</div>
  }
  if(error) {
    return <div> An Error Occurred: {error} </div>
  }
}

// App.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import MyComponent from './my-component';

function App() {
  const queryClient = new QueryClient();
  return <QueryClientProvider client={queryClient}>
    <MyComponent />
  </QueryClientProvider>
}
```



## Advanced Usage
If a user is not using a supported framework, they can use the generated SDK directly.

Here's an example of how to use it with the first 5 operations:

```js
import { upsertProfesional, reassignProfesionalUid, updateEspacioPlanId, createEspacio, updateEspacioIdentidad, updateEspacioCobros, updateEspacioRedes, updateEspacio, createWorkshop, updateWorkshop } from '@antologico/dataconnect';


// Operation UpsertProfesional:  For variables, look at type UpsertProfesionalVars in ../index.d.ts
const { data } = await UpsertProfesional(dataConnect, upsertProfesionalVars);

// Operation ReassignProfesionalUid:  For variables, look at type ReassignProfesionalUidVars in ../index.d.ts
const { data } = await ReassignProfesionalUid(dataConnect, reassignProfesionalUidVars);

// Operation UpdateEspacioPlanId:  For variables, look at type UpdateEspacioPlanIdVars in ../index.d.ts
const { data } = await UpdateEspacioPlanId(dataConnect, updateEspacioPlanIdVars);

// Operation CreateEspacio:  For variables, look at type CreateEspacioVars in ../index.d.ts
const { data } = await CreateEspacio(dataConnect, createEspacioVars);

// Operation UpdateEspacioIdentidad:  For variables, look at type UpdateEspacioIdentidadVars in ../index.d.ts
const { data } = await UpdateEspacioIdentidad(dataConnect, updateEspacioIdentidadVars);

// Operation UpdateEspacioCobros:  For variables, look at type UpdateEspacioCobrosVars in ../index.d.ts
const { data } = await UpdateEspacioCobros(dataConnect, updateEspacioCobrosVars);

// Operation UpdateEspacioRedes:  For variables, look at type UpdateEspacioRedesVars in ../index.d.ts
const { data } = await UpdateEspacioRedes(dataConnect, updateEspacioRedesVars);

// Operation UpdateEspacio:  For variables, look at type UpdateEspacioVars in ../index.d.ts
const { data } = await UpdateEspacio(dataConnect, updateEspacioVars);

// Operation CreateWorkshop:  For variables, look at type CreateWorkshopVars in ../index.d.ts
const { data } = await CreateWorkshop(dataConnect, createWorkshopVars);

// Operation UpdateWorkshop:  For variables, look at type UpdateWorkshopVars in ../index.d.ts
const { data } = await UpdateWorkshop(dataConnect, updateWorkshopVars);


```