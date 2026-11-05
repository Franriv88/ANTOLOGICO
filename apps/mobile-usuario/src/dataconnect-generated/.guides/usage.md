# Basic Usage

Always prioritize using a supported framework over using the generated SDK
directly. Supported frameworks simplify the developer experience and help ensure
best practices are followed.





## Advanced Usage
If a user is not using a supported framework, they can use the generated SDK directly.

Here's an example of how to use it with the first 5 operations:

```js
import { upsertProfesional, reassignProfesionalUid, activarPlan, agendarDowngrade, cancelarDowngrade, updateCuponAplicado, createEspacio, updateEspacioIdentidad, updateEspacioCobros, updateEspacioRedes } from '@antologico/dataconnect';


// Operation UpsertProfesional:  For variables, look at type UpsertProfesionalVars in ../index.d.ts
const { data } = await UpsertProfesional(dataConnect, upsertProfesionalVars);

// Operation ReassignProfesionalUid:  For variables, look at type ReassignProfesionalUidVars in ../index.d.ts
const { data } = await ReassignProfesionalUid(dataConnect, reassignProfesionalUidVars);

// Operation ActivarPlan:  For variables, look at type ActivarPlanVars in ../index.d.ts
const { data } = await ActivarPlan(dataConnect, activarPlanVars);

// Operation AgendarDowngrade:  For variables, look at type AgendarDowngradeVars in ../index.d.ts
const { data } = await AgendarDowngrade(dataConnect, agendarDowngradeVars);

// Operation CancelarDowngrade:  For variables, look at type CancelarDowngradeVars in ../index.d.ts
const { data } = await CancelarDowngrade(dataConnect, cancelarDowngradeVars);

// Operation UpdateCuponAplicado:  For variables, look at type UpdateCuponAplicadoVars in ../index.d.ts
const { data } = await UpdateCuponAplicado(dataConnect, updateCuponAplicadoVars);

// Operation CreateEspacio:  For variables, look at type CreateEspacioVars in ../index.d.ts
const { data } = await CreateEspacio(dataConnect, createEspacioVars);

// Operation UpdateEspacioIdentidad:  For variables, look at type UpdateEspacioIdentidadVars in ../index.d.ts
const { data } = await UpdateEspacioIdentidad(dataConnect, updateEspacioIdentidadVars);

// Operation UpdateEspacioCobros:  For variables, look at type UpdateEspacioCobrosVars in ../index.d.ts
const { data } = await UpdateEspacioCobros(dataConnect, updateEspacioCobrosVars);

// Operation UpdateEspacioRedes:  For variables, look at type UpdateEspacioRedesVars in ../index.d.ts
const { data } = await UpdateEspacioRedes(dataConnect, updateEspacioRedesVars);


```