# Media Client Hub

CRM for digital media and automation teams.

Media Client Hub helps teams manage accounts, contacts, leads, resources, planning, and notifications from one workspace.

## Development

This project uses TanStack Start, React, Vite, and Bun.

```sh
bun install
bun run dev
```

Create a `.env` file with `VITE_API_BASE_URL` to connect the UI to a backend API. If it is empty, the app uses the demo data in `src/mocks/crm.ts`.

## Production

Vercel can deploy this repository with the default settings. The build uses Nitro's Vercel preset:

```sh
bun run build
```
