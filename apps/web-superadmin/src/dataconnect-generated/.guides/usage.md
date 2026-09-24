# Basic Usage

Always prioritize using a supported framework over using the generated SDK
directly. Supported frameworks simplify the developer experience and help ensure
best practices are followed.





## Advanced Usage
If a user is not using a supported framework, they can use the generated SDK directly.

Here's an example of how to use it with the first 5 operations:

```js
import { upsertProfesional, createEspacio, updateEspacio, createWorkshop, updateWorkshop, deleteWorkshop, solicitarCancelacionEspacio, reactivarSuscripcionEspacio, decrementarCupo, getMyProfile } from '@antologico/dataconnect';


// Operation UpsertProfesional:  For variables, look at type UpsertProfesionalVars in ../index.d.ts
const { data } = await UpsertProfesional(dataConnect, upsertProfesionalVars);

// Operation CreateEspacio:  For variables, look at type CreateEspacioVars in ../index.d.ts
const { data } = await CreateEspacio(dataConnect, createEspacioVars);

// Operation UpdateEspacio:  For variables, look at type UpdateEspacioVars in ../index.d.ts
const { data } = await UpdateEspacio(dataConnect, updateEspacioVars);

// Operation CreateWorkshop:  For variables, look at type CreateWorkshopVars in ../index.d.ts
const { data } = await CreateWorkshop(dataConnect, createWorkshopVars);

// Operation UpdateWorkshop:  For variables, look at type UpdateWorkshopVars in ../index.d.ts
const { data } = await UpdateWorkshop(dataConnect, updateWorkshopVars);

// Operation DeleteWorkshop:  For variables, look at type DeleteWorkshopVars in ../index.d.ts
const { data } = await DeleteWorkshop(dataConnect, deleteWorkshopVars);

// Operation SolicitarCancelacionEspacio:  For variables, look at type SolicitarCancelacionEspacioVars in ../index.d.ts
const { data } = await SolicitarCancelacionEspacio(dataConnect, solicitarCancelacionEspacioVars);

// Operation ReactivarSuscripcionEspacio:  For variables, look at type ReactivarSuscripcionEspacioVars in ../index.d.ts
const { data } = await ReactivarSuscripcionEspacio(dataConnect, reactivarSuscripcionEspacioVars);

// Operation DecrementarCupo:  For variables, look at type DecrementarCupoVars in ../index.d.ts
const { data } = await DecrementarCupo(dataConnect, decrementarCupoVars);

// Operation GetMyProfile: 
const { data } = await GetMyProfile(dataConnect);


```