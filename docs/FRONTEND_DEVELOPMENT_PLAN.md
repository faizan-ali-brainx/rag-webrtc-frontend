# FRONTEND DEVELOPMENT PLAN — RAG Chat + Call (WebRTC)

> **Purpose of this document.** This is a self-contained specification for the **frontend** of a web application called *RAG Chat + Call*. It is written so that any engineer or AI agent with **zero prior context** can implement the client end-to-end. It pairs with `BACKEND_DEVELOPMENT_PLAN.md` (the NestJS API). Where the two must agree, **the backend document's API contract is authoritative**; the relevant parts are restated here (§6) for convenience.
>
> **Mandatory companion document:** `WEB_FRONTEND_PR_STANDARDS.md` in this same folder. Every PR is scored against 17 weighted rules; **0 violations → passing score, 4+ violations → near-zero score.** This plan has been written to satisfy those rules by construction — §7 and §15 map them to concrete requirements. Read the standards doc before writing any code, and re-check it before opening any PR. If you find a conflict, the standards doc wins and this plan should be corrected.

---

## 1. Project overview

The app lets a user upload **documents** (e.g. PDFs) and then ask questions about them in two ways:

1. **RAG Chat** — a text chat UI. The user types a question and receives an answer grounded in their uploaded documents, with **source citations**.
2. **RAG Call** — a real-time **voice** conversation. The user clicks "Start call", speaks into the mic, and the assistant answers by voice over **WebRTC** connected to OpenAI's Realtime API. During the call the assistant can look things up in the user's documents.

**What is RAG (context):** the backend retrieves the most relevant chunks of the user's documents and feeds them to the language model so answers are grounded and citable. The frontend does not implement RAG logic — it uploads documents, sends questions, renders answers plus sources, and (for voice) manages the WebRTC connection and bridges the model's document-lookup tool calls back to our backend.

The frontend's jobs:
- Auth screens (signup/login), persisted JWT session, route guarding, session rehydration on refresh.
- Document upload UI with processing status.
- Chat UI (messages, source citations, new/continue conversation).
- Voice call UI: request an ephemeral token **and the OpenAI endpoint URL** from our backend, open a WebRTC peer connection to OpenAI, stream mic audio, play back assistant audio, and handle the `retrieve_documents` tool-call round-trip via our backend.

---

## 2. Developer & working-style context

The developer is a mobile engineer (Android/Flutter, 5+ years) with **strong TypeScript and React** fundamentals, recently trained on this exact frontend stack (React, TypeScript, Redux Toolkit with Thunks, typed axios layer, custom hooks, React Router, React Hook Form + Zod) by building a Task Manager client against a NestJS backend. React/Redux/TS can be treated as solid.

The **new** piece is the **WebRTC realtime voice client** (§10) — that section is the most detailed on purpose.

Development is **AI-assisted**: an AI agent writes the majority of the code and docs; the human developer performs manual verification (including browser and microphone testing) and review.

---

## 3. Tech stack

| Concern | Choice | Notes |
|---|---|---|
| Language | TypeScript (strict, **no `any`**) | model unknown shapes explicitly rather than escaping to `any` |
| UI library | **React 18** | |
| Build tool | **Vite** | dev server on `:5173` |
| State | **Redux Toolkit** — `configureStore`, `createSlice`, `createAsyncThunk` | Rule 17: never raw `useState` for shared/global state |
| Typed hooks | `useAppDispatch` / `useAppSelector` | **never** the raw `react-redux` hooks |
| Routing | **React Router v6** | protected routes + a real 404 page |
| HTTP | **axios**, typed API layer with interceptors | unwraps the response envelope, handles 401 |
| Forms | **React Hook Form** + **Zod** | |
| Styling | **Tailwind v4 + SCSS Modules** | exact architecture in §8 — this is a 5%-weighted rule |
| Realtime | Browser **WebRTC** (`RTCPeerConnection`, `getUserMedia`) | connects directly to OpenAI |
| Feedback | `features/toast/` with `runWithToast` | every mutation reports success/failure |
| Testing | Vitest + React Testing Library | see §12 — **not a scored rule**, kept deliberately light |
| Lint | ESLint with `max-lines-per-function: 23` | mechanically enforces Rule 6 |

**Dependency discipline (hard rule).** Do not install a package until the PR that actually imports it. If a PR removes the last usage of a package, remove the package too. Run `npx depcheck` before opening any PR.

---

## 4. Repository & folder layout

Two separate git repositories live side by side under one parent folder so both can be edited together:

```
RAG/
├── BACKEND_DEVELOPMENT_PLAN.md
├── FRONTEND_DEVELOPMENT_PLAN.md      ← this file
├── WEB_BACKEND_PR_STANDARDS.md
├── WEB_FRONTEND_PR_STANDARDS.md      ← mandatory, read before coding
├── backend/     ← NestJS API — own git repo
└── frontend/    ← THIS repo — own git repo
```

Frontend internal structure. **Components and their filenames are `PascalCase`; instances/variables are `camelCase`; constants are `UPPER_SNAKE_CASE`** (Rules 9 & 15).

```
frontend/
├── src/
│   ├── main.tsx                        # imports styles/tailwind.css AND styles/global.scss (two separate imports — see §8)
│   ├── App.tsx                         # providers + router
│   ├── app/
│   │   ├── store.ts                    # configureStore, rootReducer, RootState/AppDispatch types
│   │   └── hooks.ts                     # useAppDispatch / useAppSelector
│   ├── api/
│   │   ├── config.ts                   # the ONLY place import.meta.env is read
│   │   ├── axios.ts                    # instance + envelope-unwrapping + 401 interceptors
│   │   ├── apiError.ts                 # extractApiErrorMessage()
│   │   ├── auth.api.ts
│   │   ├── documents.api.ts
│   │   ├── chat.api.ts
│   │   └── realtime.api.ts
│   ├── routes/
│   │   ├── routes.constants.ts          # ROUTES — every path lives here, never a string literal
│   │   ├── AppRoutes.tsx
│   │   └── ProtectedRoute.tsx
│   ├── components/                      # shared, presentational
│   │   ├── Button.tsx + Button.module.scss
│   │   ├── TextField.tsx                # composes global ui_* classes — no module needed (see §8)
│   │   ├── FormError.tsx + FormError.module.scss
│   │   ├── Spinner.tsx                  # Tailwind only — nothing left to scope
│   │   ├── EmptyState.tsx + EmptyState.module.scss
│   │   └── AppShell.tsx + AppShell.module.scss
│   ├── features/
│   │   ├── toast/
│   │   │   ├── toastSlice.ts
│   │   │   ├── ToastHost.tsx + ToastHost.module.scss
│   │   │   ├── runWithToast.ts
│   │   │   └── toast.constants.ts
│   │   ├── auth/
│   │   │   ├── authSlice.ts
│   │   │   ├── LoginPage.tsx + LoginPage.module.scss
│   │   │   ├── SignupPage.tsx + SignupPage.module.scss
│   │   │   ├── components/{AuthCard.tsx,LoginFormFields.tsx,SignupFormFields.tsx,AuthLinks.tsx}
│   │   │   ├── hooks/{useLoginForm.ts,useSignupForm.ts,useSessionRehydration.ts}
│   │   │   └── auth.schemas.ts          # Zod schemas
│   │   ├── documents/
│   │   │   ├── documentsSlice.ts
│   │   │   ├── DocumentsPage.tsx + DocumentsPage.module.scss
│   │   │   ├── components/{UploadDropzone.tsx,DocumentList.tsx,DocumentItem.tsx,DocumentStatusBadge.tsx}
│   │   │   ├── hooks/{useDocumentUpload.ts,useDocumentPolling.ts,useDocumentsPage.ts}
│   │   │   └── documents.constants.ts   # accepted MIME/extensions, max size, poll interval
│   │   ├── chat/
│   │   │   ├── chatSlice.ts
│   │   │   ├── ChatPage.tsx + ChatPage.module.scss
│   │   │   ├── components/{MessageList.tsx,MessageBubble.tsx,SourceChips.tsx,SourceChip.tsx,ChatComposer.tsx,ChatSidebar.tsx}
│   │   │   ├── hooks/{useChatPage.ts,useChatComposer.ts}
│   │   │   └── chat.constants.ts
│   │   └── call/
│   │       ├── callSlice.ts
│   │       ├── CallPage.tsx + CallPage.module.scss
│   │       ├── components/{CallControls.tsx,CallStatusBadge.tsx,TranscriptPanel.tsx,TranscriptItem.tsx,LookupIndicator.tsx}
│   │       ├── hooks/{useRealtimeCall.ts,useRealtimeEvents.ts}
│   │       ├── utils/{createPeerConnection.ts,negotiateSdp.ts,handleServerEvent.ts,sendToolResult.ts,teardownCall.ts}
│   │       └── call.constants.ts        # OAI_EVENTS_CHANNEL, event type strings, error messages
│   ├── pages/
│   │   └── NotFoundPage.tsx + NotFoundPage.module.scss   # a REAL 404, never a redirect
│   ├── styles/                          # see §8
│   └── types/                           # shared API types mirroring the backend contract
├── .env.example                         # placeholders ONLY
├── .eslintrc.cjs                        # max-lines-per-function: 23
└── README.md                            # updated in EVERY PR
```

---

## 5. Environment variables

Vite requires the `VITE_` prefix. `.env.example` is committed with placeholders; `.env` is git-ignored and never committed.

```env
VITE_API_BASE_URL=http://localhost:3000/api/v1
```

**That is the only variable needed.** `import.meta.env` is read **exclusively** in `api/config.ts`:
```ts
/** Runtime configuration sourced from Vite env vars; the only place import.meta.env is read. */
export const API_CONFIG = {
  baseUrl: import.meta.env.VITE_API_BASE_URL as string,
} as const;
```
No component, hook, or slice reads `import.meta.env` directly, and **no provider URL is ever hardcoded** anywhere in this repo (Rule 4).

> **Why there is no OpenAI URL here:** the browser must POST its WebRTC offer to an OpenAI endpoint. Rather than hardcode or duplicate that URL, the **backend returns it** as `callsUrl` in the realtime token response (§6, §10). The frontend never knows an OpenAI hostname at build time.

**The frontend never holds the OpenAI secret key.** The only AI credential it ever touches is the short-lived **ephemeral realtime token**, fetched at call time from our backend.

---

## 6. API contract the frontend consumes

Base URL: `API_CONFIG.baseUrl`. Auth endpoints are public; everything else sends `Authorization: Bearer <jwt>`.

### 6.1 Response envelope (exact shapes)
```json
// success
{ "success": true, "data": { "...": "..." }, "message": "..." }
// error
{ "success": false, "message": "..." }
```
The error shape has **no nested `error` object and no `code` field** — read `response.data.message`. `DELETE /documents/:id` returns **`204 No Content` with no body**; the axios layer must tolerate that.

### 6.2 Endpoints
| Feature | Method | Path | Request | Response (inner `data`) |
|---|---|---|---|---|
| Signup | POST | `/auth/signup` | `{ email, password, name? }` | `{ user, accessToken }` |
| Login | POST | `/auth/login` | `{ email, password }` | `{ user, accessToken }` |
| Me | GET | `/auth/me` | — | `{ id, email, name }` |
| Upload doc | POST | `/documents` | `multipart`, field `file` | `{ id, filename, status }` |
| List docs | GET | `/documents` | — | `Document[]` |
| Get doc | GET | `/documents/:id` | — | `Document` |
| Delete doc | DELETE | `/documents/:id` | — | **204, no body** |
| Send chat | POST | `/chat` | `{ chatId?, message }` | `{ chatId, answer, sources }` |
| List chats | GET | `/chat` | — | `Chat[]` |
| Get chat | GET | `/chat/:id` | — | `{ id, title, messages }` |
| Realtime token | POST | `/realtime/token` | — | `{ value, expiresAt, model, callsUrl }` |
| Retrieve (tool) | POST | `/realtime/retrieve` | `{ query }` | `{ chunks: Source[] }` |

> **The backend validates with `forbidNonWhitelisted: true`** — sending a field the DTO doesn't declare is a **400**. Practical consequence: **omit** optional fields rather than sending `null`/`undefined` placeholders. For a brand-new conversation, send `{ message }` with **no `chatId` key at all**.

### 6.3 Shared types (`src/types/`)
```ts
export type DocStatus = 'PROCESSING' | 'READY' | 'FAILED';

export interface AuthUser { id: string; email: string; name?: string; }
export interface Document { id: string; filename: string; mimeType: string; sizeBytes: number; status: DocStatus; error?: string; createdAt: string; }
export interface Source { documentId: string; filename: string; chunkIndex: number; snippet: string; }
export interface ChatMessage { id: string; role: 'user' | 'assistant'; content: string; sources?: Source[]; createdAt: string; }
export interface Chat { id: string; title?: string; messages?: ChatMessage[]; createdAt: string; }
export interface RealtimeSession { value: string; expiresAt: number; model: string; callsUrl: string; }
```

### 6.4 The axios layer (`api/axios.ts`)
Two interceptors, each a short named function (23-line cap applies to these too):
- **Request** — attach `Authorization: Bearer <token>` from the store/`localStorage`.
- **Response success** — return `HTTP_NO_CONTENT` responses as `undefined`, otherwise unwrap `response.data.data`.
- **Response error** — reject with a real `Error` carrying `extractApiErrorMessage(error)` (reads `error.response?.data?.message`, falling back to a generic constant). On **401**, clear auth state and redirect to `ROUTES.LOGIN`.

Thunks pass `thunkApi.signal` into axios as `{ signal }` so in-flight requests abort when a component unmounts (Rule 12).

---

## 7. Architecture rules (hard requirements)

### 7.1 MVC: View → Controller → Model (Rule 5)
- **Model** = a Redux Toolkit slice under `features/<name>/`. All shared state and all async work (`createAsyncThunk`) live here.
- **Controller** = a custom hook under `features/<name>/hooks/`. It selects from the store, dispatches thunks, and owns local UI logic (form wiring, polling, connection lifecycle).
- **View** = the component. It receives data and callbacks and renders JSX. **No business logic, no direct API calls, no `dispatch` chains inside a component body.**

Every page has a controller hook — `useLoginForm`, `useSignupForm`, `useDocumentsPage`, `useChatPage`, `useRealtimeCall`. A page component should read as: call the hook, destructure, render sub-components.

### 7.2 Function length — 23 lines (Rule 6, the one most likely to bite)
```js
'max-lines-per-function': ['error', { max: 23, skipBlankLines: true, skipComments: true }]
```
A component's hooks **plus its JSX return** must fit in 23 lines. When it doesn't, extract a named sub-component (`*FormFields`, `*Links`, `*Header`, `*List`, `*Item`) or push setup into the controller hook. This is why every feature folder above has a `components/` directory — the decomposition is planned up front, not retrofitted.

**Specifically flagged:** the WebRTC connection logic is far too large for one hook. It is decomposed into `useRealtimeCall` (orchestration), `useRealtimeEvents` (data-channel handling), and four small pure utils (`createPeerConnection`, `negotiateSdp`, `handleServerEvent`, `sendToolResult`, `teardownCall`). See §10 — each is written to fit the cap.

### 7.3 Comments (Rule 10)
A **one-line comment above every exported component, hook, util, thunk, and slice** stating its purpose. Trivial inline handlers (`onClick={() => setOpen(true)}`) need none. Unfinished work is marked `// TODO`.

### 7.4 Error handling (Rule 12)
Every API interaction: try/catch (or a rejected-thunk branch), a **real user-facing message**, and **cleanup**:
- Thunks pass `thunkApi.signal` to axios so requests abort on unmount.
- `useDocumentPolling` clears its interval in the `useEffect` cleanup and stops polling once no document is `PROCESSING`.
- `useRealtimeCall` tears down the data channel, mic tracks, and peer connection in its cleanup — leaving `/call` must never leave the microphone open.

### 7.5 User feedback on every mutation (project convention)
`features/toast/runWithToast.ts`:
```ts
/** Dispatches a thunk, always toasting failures and optionally toasting success. */
export async function runWithToast<T>(dispatch: AppDispatch, action: AsyncThunkAction<T>, successMessage?: string): Promise<T | undefined>
```
Every mutation — signup, login, logout, upload, delete, send message, start/end call failure — must tell the user whether it worked. Use `runWithToast` unless the page already owns a more specific inline slot: **a form's `<FormError>` stays the primary feedback for its own submit failure — do not also toast the same error.** Skip the success toast for noisy/obvious actions.

### 7.6 Constants over magic strings
- **Every route path** lives in `routes/routes.constants.ts` as `ROUTES`. If you are about to write a path as a string a second time anywhere, it belongs there already.
- Durations, poll intervals, accepted MIME types, max upload size, realtime event type strings, and error messages live in the relevant `*.constants.ts`.

### 7.7 DRY & reusability (Rules 8 & 14)
Repeated JSX becomes a component (`SourceChip`, `DocumentStatusBadge`, `EmptyState`); repeated logic becomes a hook or util. `Button`, `TextField`, `FormError`, `Spinner`, and `EmptyState` are shared and used everywhere rather than re-styled per page.

### 7.8 No dead code (Rule 11)
No `console.log`, no commented-out code, no unused imports. Grep the diff before every PR.

---

## 8. Styling architecture (Rule 13 — 5% weight)

**The stack is Tailwind v4 + SCSS Modules — not global `.css` files.** Each tool has a distinct job:

- **Tailwind utility classes** in JSX (`className="flex items-center gap-3"`) — simple one-off structure/layout: spacing, flex, anything you'd otherwise write as a 1–3 property rule with no reuse.
- **`*.module.scss`** — anything with more than a couple of rules, pseudo-selectors, nesting, animations, or that composes a shared placeholder/mixin. One per component/page, imported as `import styles from './Thing.module.scss'` and referenced as `styles.someClass` (**never** a string literal — CSS Modules hash names per file).

```
src/styles/
├── global.scss          # tokens + cross-file shared classes — imported once in main.tsx
├── tailwind.css         # `@import 'tailwindcss';` ONLY — kept as a separate .css file
├── _tokens.scss         # CSS custom properties: colors, fonts (@use'd by global.scss)
├── _mixins.scss         # @mixin focus-ring, etc. — parameterized shared behavior
└── _placeholders.scss   # %card, %auth_card, %panel — @extend'd from page modules
```

**`tailwind.css` must stay a separate plain `.css` file, imported alongside `global.scss` in `main.tsx`.** Putting `@import 'tailwindcss';` inside a `.scss` file makes Sass try to resolve it as a legacy Sass import — which prints a deprecation warning and lets Tailwind's `@theme`/`@layer` output get re-processed by Vite's CSS minifier, bloating the bundle (measured 25KB vs 9.7KB). Two imports, deliberately.

**Placeholders vs mixins.** Use a placeholder (`@extend %card;`) when every user wants the *exact same* declarations verbatim. Use a mixin (`@include focus-ring;`) when the shared behavior takes parameters or varies per call site. Note: `@extend`ing one placeholder from several modules dedupes the **source**, not the **compiled output** (each module compiles independently) — expected, not a bug.

**Colors and fonts come from CSS custom properties** in `_tokens.scss`. No hex literals scattered through modules.

**No static inline `style={{}}`.** Inline style is only for genuinely dynamic values (e.g. an audio-level bar's computed width).

**When a component doesn't need its own module:** if after moving out anything shared there is nothing left to scope (e.g. `TextField.tsx` composes only global `ui_field`/`ui_input`/`ui_field_error`), do **not** create an empty module file — add a one-line comment saying why, so the next person doesn't think you forgot.

**Global classes exist deliberately for one reason: cross-file raw string usage.** A class referenced as a literal string from more than one component's JSX can't be scoped into either owner's module without breaking the other call sites. If you hit this, either keep it global **with a comment explaining why** (this is fine, not a hack) or refactor the other call sites to use the owning component. New global classes are **snake_case** (`.ui_field_error`); CSS Module classes are **camelCase** (`.headerRow`, not `.header_row`) since they're accessed as JS object properties.

---

## 9. State, routing, and feature UIs

### 9.1 Slices (Model layer)
- **authSlice** — `{ user, accessToken, rehydrationStatus }`. Thunks: `signup`, `login`, `fetchMe`, `logout`. Token persisted to `localStorage`; on boot `useSessionRehydration` dispatches `fetchMe` if a token exists, and `ProtectedRoute` waits for rehydration to finish before deciding to redirect.
- **documentsSlice** — `{ items, uploadStatus, listStatus }`. Thunks: `uploadDocument`, `fetchDocuments`, `fetchDocument`, `deleteDocument`.
- **chatSlice** — `{ chats, activeChatId, messages, sendStatus }`. Thunks: `sendMessage`, `fetchChats`, `fetchChat`. `sendMessage` optimistically appends the user message; on fulfilled it appends the assistant message with `sources` and sets `activeChatId` from the response.
- **callSlice** — `{ status: 'idle' | 'connecting' | 'live' | 'ended' | 'error', transcript, isLookingUp, error? }`. Driven by `useRealtimeCall`; holds only UI-facing state.
- **toastSlice** — `{ toasts }` with `showToast` / `dismissToast`.

### 9.2 Routes
Defined in `routes/routes.constants.ts`:
```ts
/** Every route path in the app; never write a path as a bare string literal. */
export const ROUTES = {
  LOGIN: '/login',
  SIGNUP: '/signup',
  DOCUMENTS: '/documents',
  CHAT: '/chat',
  CHAT_DETAIL: '/chat/:id',
  CALL: '/call',
} as const;
```
| Path | Page | Access |
|---|---|---|
| `/login` | `LoginPage` | public |
| `/signup` | `SignupPage` | public |
| `/` | redirect → `ROUTES.CHAT` | — |
| `/documents` | `DocumentsPage` | protected |
| `/chat`, `/chat/:id` | `ChatPage` | protected |
| `/call` | `CallPage` | protected |
| `*` | **`NotFoundPage`** | public |

**Rule 16 specifics:** the `*` route renders a **real 404 page** that says "not found" — never a silent redirect. `ProtectedRoute` must actually gate access (check `accessToken` *and* completed rehydration, then redirect to `ROUTES.LOGIN`), not merely hide nav links. `AppShell` nav links are added **incrementally with each feature PR** so no PR ships a link to a route that doesn't exist yet.

### 9.3 Auth
Login/Signup use React Hook Form + Zod (`auth.schemas.ts`). Controller hooks `useLoginForm`/`useSignupForm` own submit + error mapping; the pages render `AuthCard` + `*FormFields` + `AuthLinks` sub-components to stay under 23 lines. Submit failures surface in `<FormError>` (not a toast); successful login/signup toasts and redirects to `ROUTES.CHAT`.

### 9.4 Documents
- `UploadDropzone` — drag-and-drop plus file picker, accepting `.pdf`, `.txt`, `.md`, enforcing the max size from `documents.constants.ts` (kept in sync with the backend's `RAG_MAX_UPLOAD_MB`).
- After upload returns `PROCESSING`, `useDocumentPolling` re-fetches every `POLL_INTERVAL_MS` (~2s) until no document is `PROCESSING`, then stops. Interval cleared on unmount.
- `DocumentList` / `DocumentItem` / `DocumentStatusBadge` show filename, size, status (spinner while processing, error text if `FAILED`), and a delete button. Delete gets `runWithToast`; a 204 response means the item is simply removed from the slice.
- `EmptyState` prompts the user to upload before chatting.

### 9.5 Chat
- `MessageList` → `MessageBubble` (user vs assistant variants) → `SourceChips` → `SourceChip` (filename, expandable `snippet`).
- `ChatComposer` — textarea + send; disabled while `sendStatus === 'pending'`.
- `ChatSidebar` lists prior chats (`GET /chat`); selecting one loads `GET /chat/:id`. "New chat" clears `activeChatId` so the next send **omits `chatId`**.
- If the user has no `READY` documents, show an `EmptyState` linking to `ROUTES.DOCUMENTS`.

### 9.6 Call
`CallPage` composes `CallControls` (start/end), `CallStatusBadge` (`connecting`/`live`/`error`), `TranscriptPanel` → `TranscriptItem`, and `LookupIndicator` (shown while `isLookingUp` — a `retrieve_documents` call is in flight). Mic permission is requested only on "Start call"; a denial shows a clear message via toast. Teardown runs on End call, unmount, and route change.

---

## 10. Realtime voice client (WebRTC) — the new/critical part

The browser connects **directly** to OpenAI over WebRTC. Our backend mints a short-lived token, supplies the endpoint URL, and answers document lookups. Everything below is sized to respect the 23-line cap.

**Flow (verified against current OpenAI Realtime docs; re-verify event names at implementation time):**

### Step 1 — Get the session from our backend
`POST /realtime/token` → `{ value, expiresAt, model, callsUrl }`. Fetch it **immediately before connecting** (ephemeral tokens expire in about a minute). `callsUrl` comes from the backend precisely so no OpenAI hostname is hardcoded here.

### Step 2 — Build the peer connection
```ts
/** Creates a peer connection wired to the microphone and to an audio element for model playback. */
export async function createPeerConnection(): Promise<CallConnection> {
  const pc = new RTCPeerConnection();
  const audio = new Audio();
  audio.autoplay = true;
  pc.ontrack = (event) => { audio.srcObject = event.streams[0]; };
  const mic = await navigator.mediaDevices.getUserMedia({ audio: true });
  mic.getTracks().forEach((track) => pc.addTrack(track, mic));
  const dataChannel = pc.createDataChannel(OAI_EVENTS_CHANNEL);   // must be 'oai-events'
  return { pc, mic, dataChannel, audio };
}
```

### Step 3 — Negotiate SDP with OpenAI
```ts
/** Exchanges an SDP offer with OpenAI and applies the returned answer. */
export async function negotiateSdp(pc: RTCPeerConnection, token: string, callsUrl: string): Promise<void> {
  const offer = await pc.createOffer();
  await pc.setLocalDescription(offer);
  const response = await fetch(callsUrl, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/sdp' },
    body: offer.sdp,
  });
  if (!response.ok) throw new Error(REALTIME_CONNECT_FAILED);
  await pc.setRemoteDescription({ type: 'answer', sdp: await response.text() });
}
```
Once the answer is applied the call is live — **WebRTC handles the audio automatically**; you never stream audio chunks by hand.

> This is a raw `fetch`, deliberately **not** the axios layer: the body is `application/sdp` text, the auth is the ephemeral token, and there is no response envelope to unwrap. Keep it in `features/call/utils/` with a comment stating why it bypasses `api/axios.ts`.

### Step 4 — Handle data-channel events and bridge the tool call
`useRealtimeEvents` attaches `dataChannel.onmessage`, parses the JSON event, and routes it through `handleServerEvent`:
- **Transcript events** → dispatch into `callSlice.transcript`.
- **A `retrieve_documents` function call** → set `isLookingUp`, call our backend, send the result back, clear the flag:
```ts
/** Sends a tool result back to the model and asks it to continue the response. */
export function sendToolResult(dataChannel: RTCDataChannel, callId: string, chunks: Source[]): void {
  dataChannel.send(JSON.stringify({
    type: EVENT_ITEM_CREATE,           // 'conversation.item.create'
    item: { type: 'function_call_output', call_id: callId, output: JSON.stringify(chunks) },
  }));
  dataChannel.send(JSON.stringify({ type: EVENT_RESPONSE_CREATE }));   // 'response.create'
}
```
The lookup itself goes through the normal API layer: `realtimeApi.retrieve(query)` → `POST /realtime/retrieve` with the user's JWT.

> **Verify at implementation time:** the exact event `type` strings and the shape of the function-call event (where `call_id` and the arguments live) must be checked against the current OpenAI Realtime events reference. The *pattern* is stable: receive function-call event → call our `/realtime/retrieve` → send `function_call_output` → send `response.create`. All event type strings live in `call.constants.ts` so a rename is a one-file change.
>
> **The tool is declared server-side** at token-mint time (backend §10.1), along with the model, voice, and system instructions. The browser only *handles* the call — it never declares the tool.

### Step 5 — Teardown
```ts
/** Releases the microphone, data channel, and peer connection so nothing leaks after a call. */
export function teardownCall(connection: CallConnection | null): void {
  if (!connection) return;
  connection.dataChannel.close();
  connection.mic.getTracks().forEach((track) => track.stop());
  connection.pc.close();
  connection.audio.srcObject = null;
}
```
Called from `useRealtimeCall`'s `endCall` **and** its `useEffect` cleanup. Verify manually that the browser's mic indicator turns off.

### Security notes
- The ephemeral token is the only credential the browser touches; the long-lived OpenAI key stays server-side.
- `/realtime/retrieve` is JWT-authenticated and user-scoped on the backend, so a call can only ever surface the caller's own documents.
- Request mic permission only on explicit user action; show a clear error if denied.

---

## 11. Delivery plan — phases and PRs

**Rule 2 is one feature per PR.** Delivered as **six PRs**, each independently satisfying all 17 rules: what/why/how description, README updated, ≤23-line functions, module SCSS per component, comments, no dead code, no unused deps, `npm run lint` + `tsc -b` clean.

| PR | Scope | Key acceptance criteria |
|---|---|---|
| **FE-1 — Project foundation** | Vite + React + TS strict, ESLint 23-line rule, **styling architecture** (`_tokens`/`_mixins`/`_placeholders`/`global.scss` + separate `tailwind.css`), `app/store.ts` + typed hooks, `api/config.ts` + `api/axios.ts` + `apiError.ts`, `routes.constants.ts` + `AppRoutes` + `ProtectedRoute` shell, **`NotFoundPage`**, `AppShell`, shared `Button`/`TextField`/`FormError`/`Spinner`/`EmptyState`, `features/toast/` (`toastSlice`, `ToastHost`, `runWithToast`, `toast.constants.ts`), README skeleton | Unknown URL renders a real 404 (not a redirect); envelope unwrapping and error-message extraction work against the live backend; a toast can be shown; two style imports in `main.tsx`; lint + typecheck clean |
| **FE-2 — Auth** | `authSlice`, Login/Signup pages + `components/` + `hooks/`, Zod schemas, session rehydration, working `ProtectedRoute`, logout | Signup/login work end-to-end; token survives refresh; protected route redirects when unauthenticated **and** waits for rehydration; submit errors show in `<FormError>`, not a duplicate toast; logout clears state |
| **FE-3 — Documents** | `documentsSlice`, `DocumentsPage` + dropzone/list/item/badge, `useDocumentUpload`, `useDocumentPolling`, delete with `runWithToast`, `documents.constants.ts` | Upload a PDF and watch `PROCESSING → READY`; polling stops when nothing is processing and the interval is cleared on unmount; oversized/wrong-type files rejected client-side with a real message; delete removes the row on 204 |
| **FE-4 — Chat** | `chatSlice`, `ChatPage` + message list/bubble/source chips/composer/sidebar, `useChatPage`, empty state | A question about an uploaded doc renders a grounded answer with correct source chips; a new conversation sends **no `chatId` key**; prior chats load; no-documents empty state links to `/documents` |
| **FE-5 — Call (WebRTC)** | `callSlice`, `useRealtimeCall` + `useRealtimeEvents` + the five utils, `CallPage` + controls/status/transcript/lookup indicator, `call.constants.ts` | Start a call, ask a document question aloud, hear a grounded spoken answer; transcript populates; lookup indicator appears during retrieval; End call releases the mic (browser indicator off); no OpenAI URL hardcoded anywhere |
| **FE-6 — Polish & docs** | README completion, `npx depcheck`, accessibility/responsive pass, final 17-rule compliance sweep and remediation | README documents every component, hook, env var, and setup step; lint + typecheck clean; no unused deps |

---

## 12. Testing

**Note on scoring:** the frontend's 17 rules contain **no testing rule** (its Rule 17 is State Management — testing is a *backend*-only scored rule). Tests here are therefore for our own confidence, and are kept deliberately light so effort goes where it is graded. Do **not** interpret this as permission to ship broken code — the manual checklist in §13 is the real gate.

Keep a small Vitest + RTL smoke set:
- Login form validation and submit-error rendering.
- `ProtectedRoute` redirect when unauthenticated.
- `NotFoundPage` renders for an unknown route.
- `MessageBubble` + `SourceChips` render an assistant message with sources.
- `extractApiErrorMessage` reads `data.message` and falls back correctly.
- `handleServerEvent` — tool-call detection produces the retrieve-then-send-result sequence (mocked data channel). The live WebRTC handshake is verified manually.

Mock the API layer; never call the live backend or OpenAI from tests.

---

## 13. Manual verification checklist (the real gate — run with the backend up)
1. Signup → redirected to chat; refresh keeps the session; logout clears it.
2. Visit a nonsense URL → a real 404 page, not a redirect.
3. Upload a known PDF; watch `PROCESSING → READY`; delete another document and see it disappear.
4. Ask a question whose answer is in the PDF → correct answer with the right source chip.
5. Ask something absent from all documents → an honest "I don't know".
6. Start a voice call → ask the same question aloud → hear a correct spoken answer; transcript and lookup indicator update.
7. End the call → the browser's microphone indicator turns off. Navigate away mid-call → same.
8. Kill the backend and trigger a mutation → a real error toast, no unhandled rejection in the console.

---

## 14. README requirements (Rule 3 — updated in every PR)
By FE-6 the README must document: setup and run steps, the single `VITE_` env var and that it is read only via `api/config.ts`, the folder/feature architecture, the MVC (view → hook → slice) convention, **every shared component and custom hook**, the styling architecture including why `tailwind.css` is separate, the toast convention, and how to run lint/typecheck/tests. Each PR adds its own slice.

---

## 15. Standards compliance map

Verification aid for a reviewer or handoff agent — where each of the 17 frontend rules is satisfied.

| # | Rule | Satisfied by |
|---|---|---|
| 1 | Title & Description | §11 — every PR carries a what/why/how description |
| 2 | Single Responsibility | §11 — six single-feature PRs |
| 3 | Readme Updated | §14 |
| 4 | Environment Variables | §5 — one `VITE_` var read only in `api/config.ts`; **no hardcoded provider URL** (`callsUrl` comes from the backend) |
| 5 | MVC Pattern | §7.1 — slice (model) → hook (controller) → component (view); a controller hook per page |
| 6 | Shy Code | §7.2 — 23-line cap, ESLint-enforced; `components/` folders planned per feature; WebRTC logic split into 2 hooks + 5 utils |
| 7 | SOLID | §4/§7.7 — one slice/hook/util per responsibility |
| 8 | DRY | §7.7 — shared components, hooks, and utils; no duplicated logic |
| 9 | Naming | §4 — `camelCase` vars/fns, `UPPER_SNAKE_CASE` constants, `PascalCase` components |
| 10 | Comments | §7.3 — one-liner above every export |
| 11 | No Dead Code | §7.8 |
| 12 | Error Handling | §7.4 — try/catch + real message + cleanup (abort signal, cleared interval, WebRTC teardown) |
| 13 | Styling | §8 — Tailwind v4 + SCSS Modules, tokens, placeholders/mixins, separate `tailwind.css`, no static inline style |
| 14 | Reusability | §7.7 — repeated JSX → component, repeated logic → hook/util |
| 15 | Component Naming | §4 — `PascalCase` components **and** filenames; `camelCase` instances |
| 16 | Routing | §9.2 — a **real** `NotFoundPage`, and `ProtectedRoute` genuinely gates access |
| 17 | State Management | §9.1 — Redux Toolkit slices + `createAsyncThunk` + typed hooks; no `useState` for shared state |

---

## 16. Out of scope for v1
Password reset / email verification screens; SSE token-by-token streaming; multi-file batch upload UX; message editing/deletion; call recording or download; dark mode/theming; i18n; mobile-specific layouts beyond responsive basics.
