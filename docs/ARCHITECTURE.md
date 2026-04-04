# Torsor Architecture

## Overview

Torsor is a full-stack vibe-coding application with the following components:

- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **API**: Node.js + Express + TypeScript
- **Worker**: Background job processor for AI tasks
- **Database**: PostgreSQL with UUID PKs and jsonb support
- **Cache**: Redis for sessions, task queues, and rate limiting
- **AI**: Integration with Gemini API (pluggable for other providers)

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (React/Vite)                     │
│                    Port 3000 (dev) / 3000 (prod)             │
└──────────────────────┬──────────────────────────────────────┘
                       │ HTTP/REST
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                    API Service (Express)                     │
│                    Port 3001                                 │
│ - Authentication (JWT)                                       │
│ - Project CRUD                                               │
│ - File management                                            │
│ - AI task submission                                         │
│ - User management                                            │
└─┬────────────────────┬──────────────────────────────────────┘
  │                    │
  │                    │ SQL
  │                    ▼
  │            ┌──────────────────┐
  │            │   PostgreSQL      │
  │            │  (Port 5432)      │
  │            └──────────────────┘
  │
  ├─ Redis (Port 6379)
  │  ├─ Session store
  │  ├─ Task queue
  │  └─ Cache layer
  │
  └─ Pub/Sub for notifications
                       │
                       ▼
          ┌──────────────────────────┐
          │   Worker Service         │
          │ (Background Jobs)        │
          │ - AI processing          │
          │ - Code compilation       │
          │ - File transformations   │
          └──────────────────────────┘
                       │
                       ▼
          ┌──────────────────────────┐
          │   External Services      │
          │ - Gemini API             │
          │ - Other AI providers     │
          │ - Deployment targets     │
          └──────────────────────────┘
```

## Database Schema

Key tables:
- `users` - Application users
- `projects` - User projects/workspaces
- `project_files` - Code files within projects
- `ai_tasks` - AI processing task queue
- `secrets` - Encrypted API keys and credentials
- `sessions` - JWT session tracking
- `audit_logs` - Activity tracking for compliance

See `db/init/001_init_schema.sql` for full schema.

## Docker Compose Services

### postgres
- PostgreSQL 16 Alpine
- Persistent volume: `postgres_data`
- Health check enabled
- Initialization: Loads SQL from `db/init/*.sql`

### redis
- Redis 7 Alpine
- Persistent volume: `redis_data` (append-only)
- Health check enabled

### api
- Node.js 20 Alpine with Express
- Port: 3001
- Environment: DATABASE_URL, REDIS_URL, GEMINI_API_KEY, JWT_SECRET
- Depends on: postgres, redis (with health checks)
- Healthcheck: `/health` endpoint

### worker
- Node.js 20 Alpine
- Processes pending AI tasks from database
- Configurable concurrency (default: 5)
- Depends on: postgres, redis

### frontend
- Node.js 20 Alpine with Vite
- Port: 3000
- Communicates with API at VITE_API_URL
- Depends on: api service

## Environment Configuration

### Development (.env.development)
```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/torsor_dev
REDIS_URL=redis://localhost:6379
API_PORT=3001
FRONTEND_PORT=3000
VITE_API_URL=http://localhost:3001
NODE_ENV=development
JWT_SECRET=dev-secret-change-in-production
GEMINI_API_KEY=your_key_here
```

### Production (.env.production)
Use managed services:
- Supabase or AWS RDS for Postgres
- Redis Cloud or AWS ElastiCache for Redis
- Environment-specific secrets in deployment platform

## Deployment Paths

### Option 1: Docker Compose (Local/VPS)
```bash
docker-compose up -d
```
Good for: Development, small deployments, proof-of-concept

### Option 2: Kubernetes
- Create Helm charts for each service
- Use managed databases (GCP Cloud SQL, AWS RDS, Supabase)
- Deploy via kubectl or Helm

### Option 3: Supabase + Cloud Run/Vercel
- Use Supabase for PostgreSQL + Auth + Edge Functions
- Deploy API to Cloud Run / Railway / Render
- Deploy worker to Cloud Run
- Deploy frontend to Vercel / Netlify

### Option 4: Managed PaaS (Fly.io, Railway, Render)
- Each service as a separate deployment
- Managed databases included
- Built-in monitoring and autoscaling

## Authentication & Secrets

### JWT Flow (Planned)
1. User registers or logs in
2. API returns JWT token
3. Frontend stores in memory/localStorage
4. Requests include `Authorization: Bearer <token>`
5. API validates token, returns user context

### Encrypted Secrets (Planned)
- API keys stored in `secrets` table
- Encrypted at rest (encryption key in .env)
- Decrypted only when needed (provider calls)
- Separate encryption keys per environment

## AI Provider Integration

### Current: Gemini API
- Prompt-based code generation
- Model: `gemini-2.0-flash` (or configurable)
- Rate limiting: TBD
- Cost tracking: Planned

### Future Providers
- OpenAI GPT-4 / o1
- Anthropic Claude
- Local models (Ollama)
- Custom fine-tuned models

## Task Queue System (Worker)

### Flow
1. Frontend/API submits AI task → `ai_tasks` table with status=`pending`
2. Worker polls database for `pending` tasks (limit: CONCURRENCY)
3. Worker processes each task:
   - Updates status to `processing`
   - Calls AI provider API
   - Stores result or error
   - Updates status to `completed` or `failed`
4. Frontend polls `/api/v1/ai-tasks/:id` or uses websockets for updates

### Future: Redis-based Queue
- Use Redis LPUSH/RPOP for faster task distribution
- BullMQ or similar for advanced features (retries, DLQ, scheduling)

## Monitoring & Observability (Planned)

### Health Checks
- `/health` - Service is running
- `/ready` - All dependencies are healthy
- Configure in K8s, Docker health checks, monitoring tools

### Logging
- Structured JSON logs (structured-logger or pino)
- Centralize to: ELK, Datadog, or cloud provider

### Metrics
- Request latency, error rates
- Task queue depth, worker utilization
- Database query times, connection pool status

### Tracing
- Distributed tracing (Jaeger, Datadog APM)
- Request correlation IDs
- Cross-service dependency visualization

## Scaling Considerations

### Horizontal Scaling
- **API**: Stateless, can run multiple instances behind load balancer
- **Worker**: Run multiple instances, each polls queue independently
- **Frontend**: Static assets, serve via CDN

### Database
- **Read replicas** for scaling read-heavy workloads
- **Connection pooling** (PgBouncer) between API and database
- **Sharding** if user/project data grows very large (future)

### Caching
- Redis caching layer for frequently accessed data
- Project metadata, user profiles, etc.
- Cache invalidation strategy (TTL + event-based)

## Development Workflow

1. **Local**: `docker-compose up -d` for full stack
2. **Frontend changes**: Hot reload via Vite
3. **API changes**: Auto-restart via tsx watch
4. **Worker changes**: Auto-restart via tsx watch
5. **Schema changes**: Edit `db/init/001_init_schema.sql`, rerun migrations (see SETUP.md)

## Security Checklist

- [ ] JWT secret rotated in production
- [ ] Database credentials not in version control (.env in .gitignore)
- [ ] Secrets encrypted at rest and in transit (TLS)
- [ ] CORS configured appropriately (restrict origins in prod)
- [ ] Rate limiting on API endpoints
- [ ] Input validation on all endpoints
- [ ] SQL injection prevention (use parameterized queries)
- [ ] CSRF protection if using cookies
- [ ] XSS protection (Content-Security-Policy headers)
- [ ] Authentication required for sensitive operations
- [ ] Audit logs for compliance

## Next Steps (Implementation Roadmap)

1. **Auth**: JWT login/signup, session management
2. **Projects**: CRUD endpoints, user project association
3. **Files**: Save/load/version control for project files
4. **AI Integration**: Wire Gemini API to worker, streaming responses
5. **Deployment**: Dockerize, set up CI/CD, deploy to staging
6. **Monitoring**: Add structured logging, metrics, error tracking
7. **Testing**: Unit tests (jest), integration tests (supertest)
8. **Supabase Migration**: Replace postgres+redis with managed Supabase
9. **Auth Expansion**: OAuth (GitHub, Google), multi-factor auth
10. **Project Sharing**: Collaboration, real-time sync (WebSockets)
