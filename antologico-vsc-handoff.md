# Antológico — Brief de traspaso a VSC / Claude Code

Este documento es el punto de partida para construir el proyecto real en código, a partir de todo lo diseñado y prototipado en Claude. Pensado para pegarse como contexto inicial en Claude Code (terminal, VS Code o JetBrains) u otro asistente de código.

---

## 1. Qué es el producto

**Antológico** es un SaaS multi-tenant: profesionales (Tenants) publican talleres/clases, y usuarios finales los descubren, reservan y pagan un cupo.

Tres superficies, tres roles:

- **Super Admin** (Web) — gobierno de la plataforma: ver tenants, gestionar planes de suscripción, supervisión general. Panel deliberadamente separado del de Tenant (visual y funcionalmente).
- **Tenant / Panel del profesional** (Web) — crear/editar/publicar talleres, ver reservas, estadísticas de ingresos, auditoría exportable, personalizar dominio e identidad de marca.
- **Usuario** (Mobile) — descubrir talleres, reservar y pagar un cupo, ver reservas, configurar notificaciones.

## 2. Stack técnico (actualizado — decisión: Firebase SQL Connect)

> **Cambio de decisión respecto a la propuesta académica original:** se define usar **Firebase** como plataforma de backend, con **Firebase SQL Connect** (antes "Data Connect") como base de datos relacional — en vez de un servidor Node/Express propio con MySQL. Se mantiene la base **relacional** (era el requisito no negociable), pero corre sobre PostgreSQL vía Cloud SQL, administrado por Firebase.

| | |
|---|---|
| Lenguaje | JavaScript (Web y Mobile) |
| Frontend Web | React.js |
| Frontend Mobile | React Native |
| Backend | Firebase (Cloud Functions solo si hace falta lógica que SQL Connect no cubre — ej. integración con Mercado Pago) |
| Base de datos | **PostgreSQL vía Firebase SQL Connect** (relacional, Cloud SQL por debajo) |
| Esquema / capa de datos | Schema GraphQL propio de SQL Connect (`.gql`) — reemplaza a Prisma/Sequelize |
| Autenticación | **Firebase Authentication** (incluye Google Auth listo para usar) — reemplaza el JWT manual |
| Pagos | Mercado Pago SDK (se integra desde una Cloud Function, ya que requiere lógica de servidor con la clave secreta) |
| Dominios | API de un registrador (Namecheap / GoDaddy), llamada también desde una Cloud Function |
| Hosting web (opcional) | Firebase Hosting, si no se despliega `web-tenant`/`web-superadmin` en otro lado |
| Otros | Google Calendar API (a evaluar si se mantiene en el MVP) |

**Qué NO cambia:** el modelo de datos (sección 3), el inventario de pantallas, el sistema de diseño, ni la lógica de negocio validada en el prototipo (sección 7). Lo que cambia es *dónde* y *cómo* se define/persiste ese modelo.

## 3. Modelo de datos (DER ya definido)

> Con Firebase SQL Connect, este modelo se declara como **schema GraphQL** (archivo `schema.gql`), no como modelo de Prisma. Las tablas y relaciones son las mismas — solo cambia la sintaxis de declaración. SQL Connect genera las tablas de Postgres a partir de ese schema.

Entidades principales y relaciones (ver `Antológico - Diagrama Entidad-Relación (DER)` y `Diagrama de Clases UML` del proyecto académico):

- **profesionales** (Tenant): `profesionalID`, `nombre`, `email`, `plan_suscripcion`, `datos_tarjeta`, `template`, `estado`
- **dominios**: `dominioID`, `profesionalID` (FK), `url_personalizada`, `estado`, `ssl_activo`, `nameservers`
- **workshops** (talleres): `workshopID`, `profesionalID` (FK), `nombre`, `cupos_totales`, `cupos_disponibles`, `precio`, `horario`
- **usuarios**: `usuarioID`, `nombre`, `email`
- **reservas**: `reservaID`, `usuarioID` (FK), `workshopID` (FK), `fecha_reserva`, `estado`, `comprobante_url`

Relaciones: un profesional tiene 1 dominio y muchos workshops; un usuario hace muchas reservas; una reserva pertenece a un workshop y a un usuario.

**Falta agregar al modelo** (surgió durante el diseño, no estaba en el DER original):
- Tabla `planes` (Super Admin): nombre, precio mensual/anual, features, para que dejen de estar hardcodeados en el frontend.
- Campo de identidad de marca en `profesionales`: color de encabezado o imagen de portada por taller (ver sección 6).

## 4. Inventario de pantallas (27 en total)

### Landing y Onboarding (Web)
1. Landing — selección de rol (Tenant / Usuario)
2. Login — Tenant
3. Registro Tenant — Paso 1: Datos
4. Registro Tenant — Paso 2: Dominio
5. Registro Tenant — Paso 3: Plan
6. Login — Super Admin (panel separado, sin auto-registro)

### Panel del Tenant (Web) — 7 pantallas
7. Resumen (KPIs, gráfico de ingresos, reservas recientes)
8. Talleres (listado con filtros)
9. Nuevo/Editar taller (formulario + preview en vivo)
10. Reservas (tabla con filtros)
11. Reportes (estadísticas + auditoría exportable)
12. Identidad de marca (logo, forma, paleta extraída, remoción de fondo)
13. Configuración (dominio, suscripción, cuenta)

### Panel del Super Admin (Web) — 4 pantallas
14. Resumen de la plataforma (MRR, tenants activos, etc.)
15. Tenants (listado)
16. Detalle de Tenant
17. Planes de suscripción (CRUD)

### App de Usuario (Mobile) — 6 pantallas
18. Onboarding
19. Registro/Login
20. Explorar talleres
21. Detalle de taller (con link a Google Maps)
22. Reservar y pagar (Mercado Pago)
23. Confirmación de reserva
24. Mis reservas
25. Perfil (con toggles de notificaciones)

## 5. Sistema de diseño

Ver `antologico-tokens.css` y `antologico-tailwind.config.js` adjuntos — son la fuente de verdad de color/tipografía/espaciado/radios.

- **Color de marca definitivo: Coral** (`#E85D4A`), con degradé propio hacia `#8C2E1F` para la Landing.
- El **ocre** (`#B98527`) es un acento secundario fijo (categorías, badges) — no cambia si se agrega un modo de tema distinto.
- Tipografía: **Fraunces** (títulos), **IBM Plex Sans** (interfaz), **IBM Plex Mono** (precios, cupos, horarios, códigos — nunca para prosa).
- **Pendiente:** modo oscuro / alto contraste — los tokens ya reservan `--color-surface-0-dark` e `--color-ink-dark` como punto de partida, pero los valores finales del tema oscuro no están definidos todavía.

## 6. Funcionalidad de personalización de encabezado por plan (nueva, del prototipo)

Validada en el prototipo interactivo, pendiente de pasar a producción:

- **Plan Esencial:** el encabezado de la tarjeta de cada taller es un **color liso**, elegible de una paleta fija (o selector de color libre — a definir).
- **Planes Profesional/Estudio:** el encabezado permite **subir una imagen propia** (drag & drop + click), que se recorta/cubre automáticamente (`object-fit: cover`).

Esto requiere un campo por taller (o por profesional) tipo `header_type: 'color' | 'image'` + `header_value` (hex, o URL de archivo subido a **Firebase Storage** — ya disponible en el mismo proyecto, sin agregar otro servicio).

## 7. El ABM ya prototipado (referencia de comportamiento, no de código)

En el prototipo se armó un CRUD funcional de **Talleres**, **Usuarios** y **Tenants** con datos en memoria (login ficticio → listado → alta/edición → baja), como prueba de flujo antes de escribir el código real. El comportamiento a replicar con datos reales:

- **Talleres:** listar (con estado de cupos calculado: Disponible / Últimos cupos / Agotado), crear, editar (nombre, categoría, cupos, precio, fecha + hora con selector fácil de hora/minutos — no un `<input type="time">` nativo, se sintió incómodo), eliminar.
- **Usuarios:** listar con reservas asociadas y estado de notificaciones, crear, editar, suspender/activar, eliminar.
- **Tenants** (Super Admin): listar con dominio y plan, crear, editar plan/estado, eliminar.

**Nota de UX ya validada:** para el campo de horario, usar dos selects (hora en pasos de 1h, minutos en pasos de 15) en vez de un time picker nativo — se probó y se prefirió así.

## 8. Estructura de repositorio sugerida

```
antologico/
├── apps/
│   ├── web-tenant/        (React) — Landing, Login, Registro, Panel del Tenant
│   ├── web-superadmin/    (React) — Login separado + Panel del Super Admin
│   └── mobile-usuario/    (React Native) — Onboarding, Explorar, Reservas
├── packages/
│   ├── design-tokens/     — antologico-tokens.css, tailwind.config.js, versión RN (JS theme object)
│   └── ui/                — componentes compartidos (Button, Badge, Card) si el diseño se solidifica
├── dataconnect/
│   ├── schema/            — schema.gql (tablas y relaciones del DER, sección 3)
│   └── connector/         — queries y mutations (.gql) que consumen las apps
├── functions/             (Firebase Cloud Functions) — Mercado Pago, API del registrador de dominios
├── firebase.json / .firebaserc
└── docs/
    └── antologico-vsc-handoff.md   (este archivo)
```

`web-tenant` y `web-superadmin` son apps separadas a propósito — replica la decisión de diseño de mantenerlos como paneles distintos, no pestañas de un mismo panel.

## 9. Orden de trabajo sugerido (incremental, no todo junto)

1. **Setup:** conectar el repo al proyecto de Firebase ya creado (`firebase init`), inicializar **SQL Connect** (`firebase init dataconnect`), declarar el schema `.gql` a partir del DER de la sección 3, y habilitar **Firebase Authentication** (Google Auth).
2. **CRUD de Talleres real** (backend + `web-tenant`), replicando el comportamiento validado en el prototipo (sección 7). Es el corazón del producto — hacerlo primero.
3. **Landing + Login + Registro del Tenant** (3 pasos), conectados al backend real.
4. **Reservas + pago con Mercado Pago** (sandbox primero).
5. **App mobile de Usuario** (Explorar → Detalle → Reservar → Confirmación → Mis reservas).
6. **Panel del Super Admin** (Tenants, Planes) — es el que menos apura, es interno.
7. **Identidad de marca** (logo, paleta, encabezado por plan de la sección 6).
8. **Modo oscuro / alto contraste** (una vez que el resto esté estable — es un cambio de tokens, no de estructura).

## 10. Qué llevarse del prototipo, y qué no

- **Sí llevarse:** la paleta y tipografía (tokens), el inventario de pantallas y su contenido, el modelo de datos, el comportamiento de los ABM (qué campos, qué validaciones informales, qué estados).
- **No llevarse tal cual:** el código de los archivos `.dc.html` del prototipo — son de un formato propio del entorno de diseño (state/renderVals declarativo), no son React ni HTML reutilizable directamente. Sirven como referencia visual y de comportamiento, no para copiar y pegar.

---

**Próximo paso sugerido:** abrir Claude Code en la carpeta del repo, pegar este archivo como contexto, y arrancar por el punto 1 del orden de trabajo (setup + DB).
