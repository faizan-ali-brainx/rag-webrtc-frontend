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
│   ├── call/     # callSlice, WebRTC utils, realtime event bridge, CallPage
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

## Routes

| Path | Access | Page |
|---|---|---|
| `/login`, `/signup` | public (redirects home if already signed in) | Auth pages |
| `/` | protected | Home (authenticated landing) |
| `/documents` | protected | Upload + manage documents |
| `/chat`, `/chat/:id` | protected | RAG chat |
| `/call` | protected | Live voice call (WebRTC) |
| `*` | public | Real 404 page |

## Features

- **Documents** (`features/documents`): drag-or-click upload, status badges (`PROCESSING`/`READY`/`FAILED`) with polling while processing, and delete — all via `documentsSlice` + `useDocumentsPage`.
- **Chat** (`features/chat`): sidebar of past chats (with inline **rename** and **delete**), message bubbles with **source-citation chips**, a composer, and a "no documents yet" notice — via `chatSlice` + `useChatPage`. Sending optimistically appends the user message, then renders the grounded answer. **Enter** sends, **Shift+Enter** adds a newline; a typing indicator shows while the model responds, and the view auto-scrolls to the latest message.
- **Theme** (`features/theme`): light/dark toggle in the header, persisted to `localStorage` and defaulting to the OS preference; all colors come from CSS custom-property tokens in `styles/_tokens.scss`.
- **Call** (`features/call`): a live voice call over WebRTC, connecting directly to OpenAI once the backend hands the browser a short-lived token — via `callSlice` + `useRealtimeCall`/`useRealtimeEvents`. "Start call" requests the microphone (never on page load), opens a peer connection and an `oai-events` data channel, and negotiates SDP against the `callsUrl` the backend returns (never hardcoded here). While live, `CallStatusBadge` shows connection state, `TranscriptPanel` shows the assistant's spoken answers as they stream in, and a `LookupIndicator` appears while the model is calling our `/realtime/retrieve` endpoint mid-conversation. "End call" (and unmounting/navigating away) always releases the microphone.

## Roadmap

- **Phase 1:** foundation + auth (login, signup, session rehydration, route guarding). ✅
- **Phase 2:** document upload UI and RAG chat. ✅
- **Phase 3:** realtime voice call (WebRTC). ✅
