# Backend contract (Django REST Framework)

This project is **frontend only**. All data is read over HTTP from a Django
backend. Until that backend exists, every request falls back to the demo
records in `src/mocks/crm.ts` so the UI stays usable.

## Configuration

`.env`

```
VITE_API_BASE_URL=http://localhost:8000/api
```

- Empty / missing value → the app runs entirely on demo data.
- Set value → the app calls the endpoints below. If a call fails, that
  screen silently falls back to demo data and logs a warning to the console.

Django must allow the frontend origin (`django-cors-headers`):

```python
CORS_ALLOWED_ORIGINS = ["http://localhost:8080"]
```

## Where the code lives

| Folder | Purpose |
| --- | --- |
| `src/types/crm.ts` | Domain types — the single source of truth for JSON shapes |
| `src/mocks/crm.ts` | Demo records used as fallback |
| `src/api/http.ts` | Fetch wrapper, base URL, `ApiError`, mock fallback |
| `src/api/endpoints.ts` | Every backend path in one object |
| `src/api/*.ts` | One typed module per resource |
| `src/hooks/use-*.ts` | One TanStack Query hook per resource |
| `src/routes/*.tsx` | Pages — call hooks, render components |
| `src/components/crm/*` | Reusable table, detail sheet, stat card, pills |
| `src/lib/format.ts` | Display formatters |

## Endpoints

All list endpoints accept a plain array **or** DRF pagination
(`{ "count": n, "results": [...] }`) — the wrapper unwraps `results`.

| Method | Path | Returns |
| --- | --- | --- |
| GET | `/accounts/` | `Account[]` |
| GET | `/accounts/:id/` | `Account` |
| GET | `/contacts/` | `Contact[]` |
| GET | `/contacts/:id/` | `Contact` |
| GET | `/leads/` | `Lead[]` |
| GET | `/leads/:id/` | `Lead` |
| GET | `/resources/` | `Resource[]` |
| GET | `/resources/:id/` | `Resource` |
| GET | `/team-members/` | `Member[]` |
| GET | `/team-members/:id/` | `Member` |
| GET | `/schedule-items/` | `ScheduleItem[]` |
| GET | `/schedule-items/:id/` | `ScheduleItem` |
| GET | `/notifications/` | `Notification[]` |
| GET | `/notifications/:id/` | `Notification` |

## JSON fields

Field names must match `src/types/crm.ts` exactly (camelCase). Use
`djangorestframework-camel-case` or explicit serializer field names.

```jsonc
// Account
{
  "id": "ACC-101",
  "name": "Northwind Studios",
  "industry": "Entertainment",
  "owner": "Ira Malhotra",          // team member name
  "retainer": 4800,                  // number, monthly, USD
  "health": "Healthy",               // Healthy | At risk | Churn risk
  "since": "Mar 2024",               // display string
  "services": ["Reels production"],
  "plan": "Growth retainer …",
  "process": ["Monthly strategy call"],
  "nextInvoice": "1 Sep 2026",
  "paymentStatus": "Paid",           // Paid | Due | Overdue
  "contactId": "CON-201"             // FK to Contact.id
}

// Contact
{ "id": "CON-201", "name": "…", "role": "…", "account": "Northwind Studios",
  "email": "…", "phone": "…", "channel": "WhatsApp", "lastTouch": "12 Aug 2026",
  "notes": "…" }

// Lead
{ "id": "LEAD-301", "name": "…", "company": "…", "source": "Referral",
  "stage": "Proposal",               // New | Qualified | Proposal | Negotiation | Won | Lost
  "value": 5400, "owner": "…", "created": "28 Jul 2026", "score": 82,
  "need": "…", "nextStep": "…",
  "timeline": [{ "date": "28 Jul", "event": "Inbound referral" }] }

// Resource
{ "id": "RES-401", "title": "…",
  "type": "Playbook",                // Reel | Carousel | Static | Video | Template | Playbook
  "account": "Shared", "owner": "…",
  "status": "Approved",              // Draft | In review | Approved | Published
  "updated": "11 Aug 2026", "format": "Notion doc", "summary": "…" }

// Member (team)
{ "id": "TM-501", "name": "…", "role": "…", "capacity": 82, "accounts": 2,
  "focus": "…", "status": "Loaded" } // Available | Loaded | On leave

// ScheduleItem
{ "id": "SCH-1", "day": 3,           // day of month, 1-31
  "time": "09:30", "account": "…", "title": "…",
  "channel": "Instagram",            // Instagram | YouTube | LinkedIn | TikTok | Newsletter
  "owner": "…",
  "status": "Scheduled" }            // Scheduled | Needs approval | Published

// Notification
{ "id": "NTF-601",
  "kind": "payment",                 // payment | client | system
  "title": "…", "detail": "…", "account": "…", "when": "2h ago",
  "severity": "high" }               // high | medium | low
```

## Adding a new resource

1. Add the type to `src/types/crm.ts`.
2. Add the paths to `src/api/endpoints.ts`.
3. Create `src/api/<resource>.ts` using `fetchList` / `fetchOne`.
4. Create `src/hooks/use-<resource>.ts` with a stable query key.
5. Consume the hook in the route; keep pages free of fetching logic.
