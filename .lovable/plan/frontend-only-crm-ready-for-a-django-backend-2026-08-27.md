# Frontend-only CRM, ready for a Django backend

Goal: keep the app purely frontend (no Lovable Cloud, no server code), organise it into clear
layer folders with predictable names, and add a thin API layer that talks to Django REST endpoints
with the current demo data as a fallback until the backend is live.

## Structure (layer folders)

```text
src/
  types/crm.ts             all domain types (Account, Contact, Lead, Resource, Member,
                           ScheduleItem, Notification, Stage, Health)
  mocks/crm.ts             the current demo records, used as fallback data
  api/
    http.ts                fetch wrapper: base URL, JSON parsing, error class, trailing slash
    endpoints.ts           one place listing every Django path (/api/accounts/ etc.)
    accounts.ts            listAccounts(), getAccount(id)
    contacts.ts  leads.ts  resources.ts  team.ts  schedule.ts  notifications.ts
  hooks/
    use-accounts.ts        TanStack Query hooks (one file per module)
    use-contacts.ts ... use-notifications.ts
  lib/format.ts            currency and date helpers
  components/crm/          shared presentation pieces (table, detail sheet, header, pill, stat)
  routes/                  page files only: fetch via hooks, render components
```

Each route keeps its own `head()` metadata and its own page component; no business logic in routes
beyond wiring hook data into components.

## How data flows

- `VITE_API_BASE_URL` (in `.env`) points at Django, e.g. `http://localhost:8000/api`.
- Every API function goes through `http.ts`, which returns typed results and throws a readable
  `ApiError` on non-2xx.
- Every module hook uses TanStack Query with a stable key (`["accounts"]`, `["leads", id]`).
- Fallback: when `VITE_API_BASE_URL` is unset, or the request fails, the hook resolves with the
  matching mock array so the UI keeps working. A small `USE_MOCKS` flag in `api/http.ts` makes this
  explicit and easy to delete once Django is wired up.
- Loading and error states render as skeleton rows / an inline message in the list panels.

## Readability rules applied throughout

- Descriptive names, no abbreviations: `selectedAccountId`, `formatCurrency`, `useLeads`.
- One exported component per file; file names kebab-case, components PascalCase.
- Short doc comment at the top of each `api/*` and `hooks/*` file saying which Django endpoint it
  expects and what shape it returns.
- Types imported from `src/types/crm.ts` only — no inline duplicated shapes.
- No changes to visual design or behaviour; this is a structural refactor plus the API layer.

## Reference for your Django side

A short `API.md` at the project root listing the expected endpoints, methods, and JSON field names
per resource, so the Django serializers can match the frontend types exactly.

## Technical notes

- Pure client-side data fetching (hooks in components), no route loaders calling the backend, so
  prerender/SSR never needs the Django server to be up.
- CORS must allow the preview origin on the Django side; noted in `API.md`.
- No `createServerFn`, no backend enablement — the app stays frontend-only.
