# Basic Usage

Always prioritize using a supported framework over using the generated SDK
directly. Supported frameworks simplify the developer experience and help ensure
best practices are followed.





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