# RAG Chat + Call — Frontend

React client for the RAG Chat + Call application.

## Stack

React 19 · TypeScript (strict) · Vite · Redux Toolkit (thunks) · React Router · axios · React Hook Form + Zod · Tailwind v4 + SCSS Modules.

## Prerequisites

- Node.js ≥ 20
- The backend API running (see the backend repo). The client talks to it at `VITE_API_BASE_URL`.

## Getting started

```bash
npm install
cp .env.example .env     # adjust VITE_API_BASE_URL if your API is elsewhere
npm run dev              # http://localhost:5173
```

## Scripts

| Script | Purpose |
|---|---|
| `npm run dev` | Vite dev server with HMR |
| `npm run build` | Type-check (`tsc -b`) and production build |
| `npm run preview` | Preview the production build |
| `npm run lint` | ESLint. Enforces no-`any`, 23-line functions, no-`console` |

## Environment variables

Vite requires the `VITE_` prefix. `import.meta.env` is read in exactly one place — [`src/api/config.ts`](src/api/config.ts) — and no provider URL is hardcoded anywhere else. Only `.env.example` is committed.

| Variable | Purpose |
|---|---|
| `VITE_API_BASE_URL` | Base URL of the backend API (default `http://localhost:3000/api/v1`) |

## Architecture

MVC: **View (component) → Controller (hook) → Model (Redux slice)**. Components hold no business logic; each feature has a controller hook and a slice.

```
src/
├── api/          # config (sole import.meta.env reader), axios client, typed API modules
├── app/          # store + typed useAppDispatch/useAppSelector hooks
├── components/   # shared UI: Button, TextField, FormError, Spinner, EmptyState, AppShell
├── features/
│   ├── auth/     # authSlice, Login/Signup pages, controller hooks, Zod schemas
│   └── toast/    # toastSlice, ToastHost, runWithToast
├── pages/        # HomePage (phase-1 landing), NotFoundPage (real 404)
├── routes/       # ROUTES constants, route tree, ProtectedRoute, PublicOnlyRoute
├── styles/       # tokens, mixins, placeholders, global.scss + separate tailwind.css
└── types/        # shared API types mirroring the backend contract
```

### Styling

Tailwind v4 utilities for one-off layout; **SCSS Modules** (`*.module.scss`) for anything with more than a couple of rules. Design tokens live in `styles/_tokens.scss` as CSS custom properties. `styles/tailwind.css` is kept as a **separate plain CSS file** (imported alongside `global.scss` in `main.tsx`) so Sass never reprocesses Tailwind output — this keeps the CSS bundle small.

### State & data flow

Redux Toolkit slices own all shared state; async work uses `createAsyncThunk`. The axios client attaches the JWT, unwraps the `{ success, data, message }` envelope to its inner `data`, and on a `401` clears auth and redirects to the login route. Every mutation reports success/failure — auth submit errors via `<FormError>`, other mutations via `runWithToast`.

## Routes (phase 1)

| Path | Access | Page |
|---|---|---|
| `/login`, `/signup` | public (redirects home if already signed in) | Auth pages |
| `/` | protected | Home (authenticated landing) |
| `*` | public | Real 404 page |

## Roadmap

- **Phase 1 (this):** foundation + auth (login, signup, session rehydration, route guarding).
- **Phase 2:** document upload UI and chat.
- **Phase 3:** realtime voice call (WebRTC).
