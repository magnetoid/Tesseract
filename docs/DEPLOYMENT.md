# Deployment Guide

Choose a deployment option based on your needs, scale, and infrastructure preference.

## Option 1: Docker Compose on VPS (Simple, Cost-Effective)

**Good for:** Self-hosted, small-medium scale, full control

### Prerequisites
- VPS (DigitalOcean, Linode, Vultr, AWS EC2, etc.)
- Docker & Docker Compose installed
- Domain name with DNS configured
- SSL certificate (Let's Encrypt via Traefik or nginx)

### Steps

1. **Prepare VPS**
```bash
# SSH into server
ssh root@your.server.ip

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

2. **Clone and Deploy**
```bash
# Clone repo
git clone https://github.com/yourusername/torsor-audit.git
cd torsor-audit

# Create production env
cp .env.production .env

# Edit with production values
nano .env
# Set: GEMINI_API_KEY, JWT_SECRET, DB_PASSWORD, etc.
```

3. **Set up SSL with Traefik** (optional but recommended)

Add to `docker-compose.yml`:
```yaml
traefik:
  image: traefik:v2.10
  ports:
    - "80:80"
    - "443:443"
  volumes:
    - /var/run/docker.sock:/var/run/docker.sock
    - ./traefik.yml:/traefik.yml
    - ./acme.json:/acme.json
  labels:
    - traefik.http.middlewares.redirect-http-to-https.redirectscheme.scheme=https
    - traefik.http.middlewares.redirect-http-to-https.redirectscheme.permanent=true
```

4. **Start Services**
```bash
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f api
```

5. **Enable Auto-Restart**
```bash
# Make docker-compose restart on server reboot
sudo systemctl enable docker
```

### Backup Strategy
```bash
# Backup database daily
0 2 * * * docker-compose exec -T postgres pg_dump -U postgres torsor_prod > /backups/db-$(date +\%Y\%m\%d).sql

# Backup volumes
0 3 * * * tar -czf /backups/volumes-$(date +\%Y\%m\%d).tar.gz postgres_data/ redis_data/
```

## Option 2: Supabase + Cloud Run/Railway (Managed, Scalable)

**Good for:** Startup scale, managed infrastructure, rapid iteration

### Setup with Supabase

1. **Create Supabase Project** (https://supabase.com)
   - Database automatically provisioned
   - Connection string provided
   - Auth system included (optional)

2. **Import Schema**
   - In Supabase dashboard → SQL Editor
   - Paste contents of `db/init/001_init_schema.sql`
   - Run

3. **Deploy API to Cloud Run** (Google Cloud)
```bash
# Login to Google Cloud
gcloud auth login
gcloud config set project YOUR_PROJECT_ID

# Build and push image
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/torsor-api

# Deploy to Cloud Run
gcloud run deploy torsor-api \
  --image gcr.io/YOUR_PROJECT_ID/torsor-api \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars="DATABASE_URL=<supabase-url>,REDIS_URL=<redis-cloud-url>,GEMINI_API_KEY=<key>"
```

4. **Deploy Worker to Cloud Run**
```bash
gcloud builds submit apps/worker --tag gcr.io/YOUR_PROJECT_ID/torsor-worker

gcloud run deploy torsor-worker \
  --image gcr.io/YOUR_PROJECT_ID/torsor-worker \
  --platform managed \
  --region us-central1 \
  --set-env-vars="DATABASE_URL=<supabase-url>,REDIS_URL=<redis-cloud-url>"
```

5. **Deploy Frontend to Vercel** (easiest option)
```bash
npm i -g vercel
vercel deploy

# Set env var VITE_API_URL to your Cloud Run API URL
vercel env add VITE_API_URL
```

**Services:**
- Database: Supabase PostgreSQL (managed)
- Redis: Redis Cloud (https://redis.com/try-free/)
- API: Cloud Run (serverless containers)
- Worker: Cloud Run
- Frontend: Vercel (CDN + serverless)

**Cost**: ~$20-100/month depending on usage

## Option 3: Railway (All-in-One Platform)

**Good for:** Simplicity, fast deployment, modern DX

1. **Push to GitHub**
```bash
git push origin main
```

2. **Create Railway Project** (https://railway.app)
   - Connect GitHub repo
   - Select services to deploy:
     - Frontend
     - API
     - Worker
     - PostgreSQL (Railway provides managed)
     - Redis (Railway provides managed)

3. **Configure Environment**
   - Railway auto-detects `Dockerfile` and `docker-compose.yml`
   - Set env vars in Railway dashboard
   - Set `DATABASE_URL`, `REDIS_URL`, `GEMINI_API_KEY`, `JWT_SECRET`

4. **Deploy**
   - Push to `main` branch
   - Railway auto-deploys

**Cost**: Pay-as-you-go, ~$15-80/month for dev/small scale

## Option 4: Fly.io (Distributed, Global)

**Good for:** Global scale, fast cold starts, edge computing

1. **Install Fly CLI**
```bash
curl -L https://fly.io/install.sh | sh
```

2. **Initialize Fly App**
```bash
flyctl launch

# Answer prompts:
# - Name: torsor
# - Region: pick closest to you
# - Postgres: yes
# - Redis: yes
```

3. **Deploy**
```bash
flyctl deploy
```

**Cost**: ~$10-50/month baseline

## Option 5: Kubernetes (Enterprise, Complex)

**Good for:** Large scale, high availability, team infrastructure

1. **Create Helm Chart**
```bash
mkdir k8s
cd k8s
helm create torsor
```

2. **Update values.yaml**
```yaml
api:
  image: your-registry/torsor-api:latest
  replicas: 3
  resources:
    requests:
      memory: "256Mi"
      cpu: "250m"

worker:
  image: your-registry/torsor-worker:latest
  replicas: 2

postgres:
  enabled: false  # Use managed: AWS RDS, GCP Cloud SQL
  externalUrl: postgresql://...

redis:
  enabled: false  # Use managed: Redis Cloud, AWS ElastiCache
  externalUrl: redis://...
```

3. **Deploy**
```bash
kubectl apply -f k8s/torsor/namespace.yaml
helm install torsor ./k8s/torsor -n torsor
```

See `k8s/` directory for Helm chart templates.

## Environment Configuration by Platform

### Cloud Run
Set via `--set-env-vars` or Cloud Run console:
```
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
GEMINI_API_KEY=xxx
JWT_SECRET=yyy
```

### Railway
Set via Railway dashboard → Variables

### Fly.io
Set via `flyctl secrets`:
```bash
flyctl secrets set DATABASE_URL=postgresql://...
flyctl secrets set REDIS_URL=redis://...
```

### Docker Compose on VPS
Use `.env` file (see Option 1)

## Database Migrations in Production

### One-off Migration
```bash
# From Cloud Run
gcloud run execute torsor-api -- npx knex migrate:latest

# From Docker
docker-compose exec api npm run migrate

# From Railway
railway run npm run migrate
```

### Automated on Deploy
Add to Dockerfile entrypoint:
```dockerfile
CMD ["sh", "-c", "npm run migrate && npm run start"]
```

## Monitoring & Logging

### Cloud Run
- **Metrics**: CPU, memory, request latency in GCP Console
- **Logs**: Cloud Logging → Logs Explorer
- **Errors**: Error Reporting

### Railway
- Dashboard shows resource usage
- Logs streaming in Railway UI

### Fly.io
```bash
flyctl logs
flyctl status
flyctl monitoring
```

### Docker Compose
```bash
docker-compose logs -f api
docker-compose logs -f worker
docker stats  # Resource usage
```

## Scaling

### Horizontal (more instances)
- **Cloud Run**: Automatically scales based on requests
- **Railway**: Set max/min replicas in dashboard
- **Fly.io**: `flyctl scale count api=3`
- **Docker Compose**: Run multiple instances with load balancer

### Vertical (bigger instances)
- **Cloud Run**: Change memory/CPU in configuration
- **Railway**: Change resource allocation
- **Fly.io**: `flyctl scale vm dedicated-cpu-2x`
- **Docker Compose**: Increase resource limits in docker-compose.yml

## SSL/TLS Certificates

### Let's Encrypt (Free)
```bash
# Via Traefik on VPS
# Auto-renews before expiry

# Via cloud platform
# AWS ACM, GCP Cloud Armor, etc.
```

### Monitoring Certificate Expiry
```bash
# Check cert expiry
openssl s_client -connect yourdomain.com:443 -showcerts | grep -A 5 "Not After"

# Setup alert: 30 days before expiry
```

## Disaster Recovery

### Database Backup
```bash
# Automated: Use managed backup (Supabase, Cloud SQL, RDS)

# Manual backup
docker-compose exec postgres pg_dump -U postgres torsor_dev > backup.sql

# Restore
docker-compose exec postgres psql -U postgres torsor_dev < backup.sql
```

### Application Rollback
```bash
# Docker: Re-tag and run previous image
docker pull your-registry/torsor-api:v1.0
docker-compose up -d

# Git: Revert commit
git revert <commit-hash>
git push
# Auto-deploy triggers

# Cloud Run / Railway: Use deployment history to rollback
```

## Cost Optimization

- **Use reserved instances** for stable baseline
- **Spot instances** for worker nodes
- **Managed databases** (RDS, Supabase) vs self-hosted (cheaper but ops overhead)
- **CDN** for static assets (Cloudflare, AWS CloudFront)
- **Object storage** for large files (AWS S3, GCP GCS)
- **Monitor usage** - set billing alerts

## Security in Production

- [ ] Enable HTTPS/TLS everywhere
- [ ] Rotate JWT secrets regularly
- [ ] Use database passwords from secrets manager (not .env)
- [ ] Enable database backups and point-in-time recovery
- [ ] Use VPC/security groups to restrict network access
- [ ] Enable audit logging
- [ ] Set up DDoS protection (Cloudflare, AWS Shield)
- [ ] Enable rate limiting on API
- [ ] Scan dependencies for vulnerabilities (`npm audit`)
- [ ] Keep dependencies updated

## Next Steps

1. **Choose deployment option** (recommend: Railway or Supabase + Cloud Run)
2. **Set up Gemini API key** (https://ai.google.dev/)
3. **Configure database & Redis** in chosen platform
4. **Deploy API & worker** using guides above
5. **Deploy frontend** (Vercel, Railway, or cdn)
6. **Configure custom domain** with DNS
7. **Monitor** in production for errors and performance
8. **Set up CI/CD** to auto-deploy on git push
