# Setup

## Prerequisites

- Node.js 20+
- Docker Desktop / Docker Engine with Compose

## 1) Install

```bash
cp .env.example .env.development
npm install
```

## 2) Validate locally

```bash
npm run lint
npm run build:all
```

## 3) Start the compose stack

```bash
docker compose up --build
```

Services:
- frontend: http://localhost:3000
- api: http://localhost:3001
- postgres: localhost:5432
- redis: localhost:6379

Optional DB UI:

```bash
docker compose --profile tools up --build
```

Then Adminer is available at:
- adminer: http://localhost:8080

## Native split-dev mode

Infra only:

```bash
docker compose up postgres redis
```

Frontend:

```bash
npm run dev
```

API:

```bash
npm run dev -w apps/api
```

Worker:

```bash
npm run dev -w apps/worker
```

## Health checks

```bash
curl http://localhost:3001/health
curl http://localhost:3001/ready
curl http://localhost:3001/api/v1
```

## Demo seed flow

The DB init scripts create a demo user and a demo project for smoke testing.

Grab a project id:

```bash
curl http://localhost:3001/api/v1/projects
```

Enqueue a sample task:

```bash
curl -X POST http://localhost:3001/api/v1/tasks \
  -H 'content-type: application/json' \
  -d '{"projectId":"<project-uuid>","prompt":"Generate a pricing page","taskType":"generate"}'
```

The worker should claim it and write a mock completion payload.

## Common checks

```bash
npm run lint
npm run build:all
docker compose logs -f api
docker compose logs -f worker
docker compose exec postgres psql -U postgres -d torsor_dev -c '\dt'
```

## Supabase-compatible next step

This repo is intentionally auth-ready without shipping the full self-hosted Supabase stack in this pass.

Current stance:
- local DB remains plain Postgres
- env placeholders exist for Supabase integration
- API exposes whether Supabase is configured
- a later compose profile can add Supabase-specific services if parity becomes necessary

## Troubleshooting

### API readiness stays degraded
- confirm Postgres and Redis are healthy: `docker compose ps`
- inspect API logs: `docker compose logs api`

### Worker is idle
- check pending rows in Postgres:
  `docker compose exec postgres psql -U postgres -d torsor_dev -c "select id,status from ai_tasks order by created_at desc limit 10;"`

### Frontend cannot reach API
- verify `VITE_API_URL` in `.env.development`
- if running frontend outside Docker, `http://localhost:3001` is correct
