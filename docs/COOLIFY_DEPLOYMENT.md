# Coolify Deployment Guide

This document outlines the steps to deploy the Torsor application using Coolify.

## Architecture Adjustments Made
The codebase has been updated to be fully compatible with Coolify's Docker Compose deployment model:
1. **Production Dockerfiles:**
   - Frontend (`Dockerfile`): Uses a multi-stage build. First stage builds the Vite SPA, second stage serves it via `nginx:alpine`.
   - API (`apps/api/Dockerfile`): Multi-stage build that omits `devDependencies` in the final image and starts using `npm start`.
   - Worker (`apps/worker/Dockerfile`): Similar multi-stage build, omitting dev dependencies.
2. **Docker Compose (`docker-compose.yml`):**
   - Cleaned up for production deployment. Local volume mounts (e.g., `./apps/api:/app`) and dev commands (`npm run dev`) have been removed from this file.
   - `expose` is used instead of `ports` to ensure internal services don't conflict on the host and rely on Traefik for ingress.
   - Environment variables are mapped appropriately.
3. **Local Development Override (`docker-compose.override.yml`):**
   - Contains all the local dev overrides (hot-reloading volumes, `target: development` build stages, and host port mappings).
   - Coolify ignores this file by default, keeping production isolated from dev setups.

## Deployment Steps in Coolify

1. **Create a New Resource:**
   - In your Coolify dashboard, select your target Server and Environment.
   - Click **+ New** -> **Public Repository** (or Private if it's private).
   - Enter the repository URL and branch (e.g., `main`).
   - Select **Docker Compose** as the build pack.

2. **Configure Docker Compose Settings:**
   - **Docker Compose Location:** `/docker-compose.yml`
   - Coolify will parse the file and detect the services: `frontend`, `api`, `worker`, `postgres`, `redis`, `adminer`.

3. **Set Environment Variables:**
   Navigate to the **Environment Variables** tab in Coolify and configure the following:

   *Global / Application Env Vars:*
   - `NODE_ENV=production`
   - `APP_ENV=production`
   - `JWT_SECRET=<generate-a-secure-secret>`
   - `POSTGRES_DB=torsor_prod`
   - `POSTGRES_USER=torsor`
   - `POSTGRES_PASSWORD=<secure-db-password>`
   - `VITE_API_URL=https://api.yourdomain.com` *(Must be the public URL for the API)*
   - `CORS_ORIGIN=https://app.yourdomain.com` *(Must match the frontend URL)*
   - `GEMINI_API_KEY=<your-google-gemini-key>`

4. **Configure Domains (Traefik Ingress):**
   In the **Services** tab (or main configuration), assign domains to the services that need public access:
   - **frontend:** Set Domain to `https://app.yourdomain.com`. Coolify will automatically configure Traefik and provision SSL via Let's Encrypt.
   - **api:** Set Domain to `https://api.yourdomain.com`.
   - Leave `worker`, `postgres`, `redis`, and `adminer` without public domains unless you specifically need external access. They will communicate internally via the Docker network.

5. **Health Checks:**
   - Health checks are already defined in `docker-compose.yml` using `CMD-SHELL`. Coolify will respect these during deployment to ensure zero-downtime rollouts.
   - API exposes `/health` and `/ready` endpoints, which can also be configured in Coolify's custom health check UI if needed.

6. **Deploy:**
   - Click **Deploy**.
   - Coolify will build the multi-stage Dockerfiles, provision the internal network, start the database and cache, wait for them to be healthy, and then start the API, Worker, and Frontend.

## Rollback Mechanism
Coolify supports rollback by redeploying previous successful image tags. Since we use Docker Compose builds directly, ensure you maintain persistent volumes (already defined as `postgres_data` and `redis_data` in the compose file) to prevent data loss across deployments.