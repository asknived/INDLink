# Implementation Plan: INDLink Phase 7 (Production Launch)

This is the final phase of the INDLink project, focusing entirely on DevOps, infrastructure scaling, production security, and launch readiness. 

## User Review Required
> [!IMPORTANT]
> Phase 7 introduces massive infrastructural changes including Docker, Redis, Background Workers (BullMQ), CI/CD, and robust Server/Nginx configs. Please review the proposed architecture before execution.

## Open Questions
> [!WARNING]
> 1. **Background Workers (BullMQ):** BullMQ requires a Redis instance. I will set up the `docker-compose.yml` to spin up Redis alongside MySQL and your Next.js app. Is your target VPS (e.g., Ubuntu 24.04 on DigitalOcean/Hetzner) provisioned with enough RAM (at least 2GB+) to handle Node.js, MySQL, and Redis concurrently?
> 2. **Sentry & PostHog:** I will add Sentry and PostHog tracking logic to the application. You will need to create accounts for both and add their respective public keys to your production `.env` file.
> 3. **Next.js Standalone Build:** To optimize the Docker image, I will configure `next.config.mjs` to output a `standalone` build. This drastically reduces the Docker image size but requires strict environment variable management.

## Proposed Changes

### 1. DevOps & Infrastructure
- **Dockerization:** Generate a multi-stage `Dockerfile` (optimized via Next.js standalone mode) and a `docker-compose.yml` orchestrating Next.js, MySQL, and Redis.
- **CI/CD:** Create `.github/workflows/deploy.yml` for automated testing, linting, and building on every push to `main`.
- **Nginx Configuration:** Create a production-ready `nginx.conf` handling SSL (Let's Encrypt prep), reverse proxying to Next.js, Gzip compression, and security headers.

### 2. High-Performance Architecture
- **Redis (`src/lib/redis.ts`):** Integrate `ioredis` for ultra-fast caching and rate limiting.
- **Background Jobs (`src/jobs`):** Set up `bullmq` to offload heavy tasks (Email sending via Resend, AI generation) from the main request thread to background workers.

### 3. Application Security & Telemetry
- **Security Headers:** Update `next.config.mjs` to inject robust CSP (Content Security Policy), HSTS, XSS protection, and CSRF mitigation headers.
- **Sentry:** Create `sentry.client.config.ts` and `sentry.server.config.ts` for deep error tracking.
- **PostHog:** Integrate PostHog script injection for product analytics (Signups, Conversions).

### 4. Comprehensive Audits & Documentation
I will generate a massive suite of production documentation:
- `DEPLOYMENT.md` (VPS Ubuntu setup, PM2, SSL)
- `DATABASE_AUDIT.md` (Indexing and Query Optimization)
- `LOAD_TESTING.md` (k6 load scripts for 1k/10k/100k users)
- `BACKUP_PLAN.md` (MySQL cron backups and R2 disaster recovery)
- `SEO_AUDIT.md` & `ACCESSIBILITY_AUDIT.md`
- `SECURITY_AUDIT.md`
- `PRODUCTION_CHECKLIST.md` (The final pre-flight checklist)
- `PROJECT_SUMMARY.md` (Updated)
- `INDLINK_LAUNCH_GUIDE.md` (Go-to-market strategy)

## Verification Plan
*   **Static Code Analysis:** Ensure `package.json` correctly reflects `bullmq`, `ioredis`, `@sentry/nextjs`, and `posthog-js`.
*   **No Build Errors:** Execute final build and lint checks before sign-off.
