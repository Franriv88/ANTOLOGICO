# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project status

This repo is at the start of implementation. The design and architecture have been fully specified in `antologico-vsc-handoff.md` — read that file first for any new work. No application code exists yet; the repo only contains design tokens and config.

## What is Antológico

Multi-tenant SaaS: professionals (Tenants) publish workshops, end users discover, book, and pay for spots.

Three surfaces, three roles:
- **Super Admin** (Web) — platform governance: tenants, subscription plans. Deliberately separate from Tenant panel (visually and functionally).
- **Tenant** (Web) — create/edit/publish workshops, bookings, revenue stats, brand identity, custom domain.
- **User** (Mobile) — discover workshops, book and pay, manage reservations.

## Planned monorepo structure

```
antologico/
├── apps/
│   ├── web-tenant/        React — Landing, Login, Registro, Tenant Panel
│   ├── web-superadmin/    React — Separate login + Super Admin panel
│   └── mobile-usuario/    React Native — Onboarding, Explore, Bookings
├── packages/
│   ├── design-tokens/     antologico-tokens.css, tailwind.config.js, RN theme object
│   ├── api-client/        Shared HTTP calls across all 3 apps
│   └── ui/                Shared components (Button, Badge, Card)
├── server/
│   └── api/               Node + Express + Prisma/Sequelize + MySQL
└── docs/
    └── antologico-vsc-handoff.md
```

`web-tenant` and `web-superadmin` are intentionally separate apps, not tabs of the same panel.

## Tech stack

| Layer | Choice |
|---|---|
| Frontend Web | React.js |
| Frontend Mobile | React Native |
| Backend | Node.js + Express |
| Database | MySQL |
| ORM | Prisma or Sequelize (to be decided at setup) |
| Auth | OAuth 2.0 (Google Auth) + JWT |
| Payments | Mercado Pago SDK |
| Domain management | Namecheap / GoDaddy API |

## Data model (core entities)

- `profesionales` (Tenant): `profesionalID`, `nombre`, `email`, `plan_suscripcion`, `datos_tarjeta`, `template`, `estado`
- `dominios`: `dominioID`, `profesionalID` FK, `url_personalizada`, `estado`, `ssl_activo`, `nameservers`
- `workshops`: `workshopID`, `profesionalID` FK, `nombre`, `cupos_totales`, `cupos_disponibles`, `precio`, `horario`
- `usuarios`: `usuarioID`, `nombre`, `email`
- `reservas`: `reservaID`, `usuarioID` FK, `workshopID` FK, `fecha_reserva`, `estado`, `comprobante_url`

**Still needs to be added:**
- `planes` table (Super Admin): name, monthly/annual price, features — currently hardcoded in frontend.
- Per-workshop brand identity field: `header_type: 'color' | 'image'` + `header_value` (hex or file URL).

## Suggested build order

1. Repo setup, DB schema via Prisma/Sequelize from the model above, basic JWT auth.
2. Workshop CRUD (backend + `web-tenant`) — this is the core of the product, build first.
3. Landing + Login + Tenant registration (3-step flow).
4. Bookings + Mercado Pago payment (sandbox first).
5. Mobile user app (Explore → Detail → Book → Confirm → My Bookings).
6. Super Admin panel (Tenants, Plans).
7. Brand identity (logo, palette, per-plan workshop header from step 2 field).
8. Dark mode / high contrast (token-only change, do last).

## Design system

Source of truth: `antologico-tokens.css` (CSS custom properties) and `antologico-tailwind.config.js` (Tailwind extension). Copy `antologico-tokens.css` into `globals.css` or the entry point; merge the `extend` block into `tailwind.config.js`.

Key decisions:
- **Brand color: Coral** `#E85D4A`, gradient toward `#8C2E1F` on Landing.
- **Ocre** `#B98527` is a fixed secondary accent (categories, badges) — does not change with brand themes.
- `--font-display`: Fraunces (headings); `--font-sans`: IBM Plex Sans (UI); `--font-mono`: IBM Plex Mono (prices, slots, times, codes — never for prose).
- Super Admin sidebar: `#1A1611` background, active nav accent with `--color-accent` (left border), not `--color-primary` — intentionally different from Tenant panel.
- Dark mode tokens are reserved (`--color-surface-0-dark`, `--color-ink-dark`) but final values are not yet defined.

Google Fonts URL:
```
https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap
```

## UX decisions already validated

- **Time picker for workshops:** use two `<select>` elements (hour in 1h steps, minutes in 15-min steps) instead of a native `<input type="time">` — tested and preferred.
- **Workshop slot status:** calculate from `cupos_disponibles / cupos_totales` → `Disponible` / `Últimos cupos` / `Agotado`.
- **Workshop header customization by plan:** Esencial = solid color picker; Profesional/Estudio = image upload (drag & drop + click, `object-fit: cover`).

## What not to reuse from the prototype

The `.dc.html` prototype files use a custom declarative format (`state`/`renderVals`) from the design environment — they are not React or reusable HTML. Use them only as visual/behavioral reference.
