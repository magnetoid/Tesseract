# Torsor compose-first foundation

This repo now has a practical local/dev backbone centered on `docker-compose.yml`.

## Stack

Core services:
- `frontend` — React + Vite app at the repo root
- `api` — Express + TypeScript service in `apps/api`
- `worker` — async job processor in `apps/worker`
- `postgres` — primary relational store with bootstrap schema + demo seed
- `redis` — queue signaling / lightweight cache / future rate-limit store

Optional tooling:
- `adminer` — lightweight DB UI behind the `tools` compose profile

## Why this compose setup is better

- one central stack for local full-stack work
- source-mounted app services for live development inside containers
- named `node_modules` volumes so bind mounts do not break installs
- DB and Redis health-gated startup for API and worker
- minimal demo seed data so the stack is smoke-testable immediately
- pragmatic auth-ready env surface without forcing a heavy Supabase self-host stack today

## Bootstrapping

```bash
cp .env.example .env.development
npm install
npm run lint
npm run build:all
```

## Run the stack

Shared-server-safe default:

```bash
docker compose up --build
```

This compose file now uses internal `expose` entries instead of binding host ports, which makes it safer for Coolify/shared hosts where `3000`, `3001`, `5432`, `6379`, or `8080` may already be taken.

For local host-port access, create a `docker-compose.override.yml` like this:

```yaml
services:
  frontend:
    ports:
      - "3000:3000"
  api:
    ports:
      - "3001:3001"
  postgres:
    ports:
      - "5432:5432"
  redis:
    ports:
      - "6379:6379"
  adminer:
    ports:
      - "8080:8080"
```

Docker Compose loads that override automatically in local development, while Coolify can keep using the safe base file.

Optional DB UI:

```bash
docker compose --profile tools up --build
```

Default container-internal service ports:
- frontend: `3000`
- api: `3001`
- adminer: `8080`
- postgres: `5432`
- redis: `6379`

If you add the local override above, those become reachable on the same localhost ports.

## Useful compose commands

```bash
# full logs
docker compose logs -f

# API only
docker compose logs -f api

# Worker only
docker compose logs -f worker

# infrastructure only
docker compose up postgres redis
```

## Native split-dev mode

If you want infra in containers and apps on the host:

```bash
docker compose up postgres redis
npm run dev
npm run dev -w apps/api
npm run dev -w apps/worker
```

## Seeded local data

The compose bootstrap creates:
- demo user: `demo@torsor.local`
- demo password: `demo12345`
- demo project: `Torsor Demo Project`

That gives you a quick `project_id` source for task enqueue tests.

## API surface

- `GET /health`
- `GET /ready`
- `GET /api/v1`
- `GET /api/v1/config`
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
- `GET /api/v1/tasks`
- `POST /api/v1/tasks`

## Supabase / auth-ready position

This pass keeps compose pragmatic instead of dragging in the entire Supabase self-host stack.

What is already aligned:
- Postgres is the source of truth and can remain the underlying DB
- env placeholders exist for `SUPABASE_URL`, `SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY`
- API config endpoint exposes whether Supabase is configured
- JWT / auth wiring is treated as a first-class next step, not an afterthought

How to evolve cleanly later:
1. keep `postgres` as the dev database unless you explicitly want full Supabase local parity
2. either:
   - integrate hosted Supabase for auth/storage first, or
   - add Supabase local services later as a dedicated compose profile once auth/storage requirements are clearer
3. move user/session management from the current skeleton tables to the chosen auth model
4. add storage + realtime only when the product needs them

That gives Torsor a strong compose-first base now without prematurely overengineering the local stack.

## What is real vs placeholder

Real now:
- compose orchestration
- health-gated backend startup
- schema bootstrap + demo seed
- queue/task lifecycle skeleton
- coherent env files for dev and production templates
- docs for local setup and deployment direction

Still intentionally skeletal:
- OAuth/social login providers
- real provider execution beyond mock completion payloads
- deeper IDE/editor data plumbing across every panel
- production-grade secrets / ingress / observability

## Deployment/domain direction

- app target domain: `app.torsor.dev`
- keep the marketing/landing site on `torsor.dev` untouched
- production env templates in this repo now point the app-facing config at `app.torsor.dev`
- for Coolify, route only the `frontend` service externally; keep `api`, `worker`, `postgres`, `redis`, and `adminer` internal unless you deliberately add a separate route
