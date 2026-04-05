# Torsor foundation skeleton

Torsor now has a compose-first full-stack foundation around the existing frontend app.

## Included

- root React/Vite frontend
- `apps/api` Express + TypeScript API
- `apps/worker` background worker
- `docker-compose.yml` as the main local/dev entrypoint
- Postgres bootstrap schema + demo seed under `db/init/`
- env templates for local and production-like setups
- setup/deployment/architecture docs under `docs/`

## Quick start

```bash
cp .env.example .env.development
npm install
npm run lint
npm run build:all

docker compose up --build
```

Then open:
- frontend: http://localhost:3000
- API root: http://localhost:3001/api/v1
- health: http://localhost:3001/health
- readiness: http://localhost:3001/ready

## Compose notes

The base `docker-compose.yml` is now shared-server/Coolify-safe by default: services use internal `expose` ports instead of binding host ports. That avoids collisions on shared hosts and plays nicely with a single routed app entrypoint.

The compose stack includes:
- `frontend`
- `api`
- `worker`
- `postgres`
- `redis`
- optional `adminer` via `--profile tools`

For local `localhost` port bindings, add a `docker-compose.override.yml`; an example is documented in `README_FULLSTACK.md`.

For the fuller rationale and Supabase/auth-ready direction, read `README_FULLSTACK.md`.

## Native dev split

```bash
docker compose up postgres redis
npm run dev
npm run dev -w apps/api
npm run dev -w apps/worker
```

## Example task enqueue

```bash
curl -X POST http://localhost:3001/api/v1/tasks \
  -H 'content-type: application/json' \
  -d '{"projectId":"<project-uuid>","prompt":"Generate a landing page hero","taskType":"generate"}'
```

## Current status

Solid now:
- local service wiring
- queue skeleton
- DB bootstrap
- health/readiness flow
- real password auth backbone (`/api/v1/auth/signup`, `/api/v1/auth/login`, `/api/v1/auth/me`)
- DB-backed project CRUD and project file list/upsert routes
- frontend auth + project loading/creation wired to the API
- env/docs aligned to `app.torsor.dev` without touching the `torsor.dev` landing page

Still intentionally partial:
- OAuth providers are still placeholders in the UI
- most deep IDE/editor panels remain mock-heavy
- tests/CI are still light

## Phase 2 dev auth

Seeded dev credentials:
- email: `demo@torsor.local`
- password: `demo12345`

Core Phase 2 routes:
- `POST /api/v1/auth/signup`
- `POST /api/v1/auth/login`
- `GET /api/v1/auth/me`
- `GET /api/v1/projects`
- `POST /api/v1/projects`
- `GET /api/v1/projects/:projectId`
- `PATCH /api/v1/projects/:projectId`
- `DELETE /api/v1/projects/:projectId`
- `GET /api/v1/projects/:projectId/files`
- `POST /api/v1/projects/:projectId/files`
