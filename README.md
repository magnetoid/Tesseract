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

The compose stack includes:
- `frontend`
- `api`
- `worker`
- `postgres`
- `redis`
- optional `adminer` via `--profile tools`

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
- coherent env/docs base

Next:
- auth
- real AI execution
- frontend-to-API integration
- tests/CI
