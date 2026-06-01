# Staging Deployment Strategy

To ensure zero-downtime and safe deployments to `production.indlink.in`, we mandate the use of a staging environment (`staging.indlink.in`).

## 1. Staging Environment Constraints
*   **Database:** Must be completely separate from Production (e.g., `indlink_staging` database).
*   **Payments:** Razorpay API Keys must be strictly set to **TEST MODE** (`rzp_test_...`).
*   **Storage:** Use a separate R2 bucket (e.g., `indlink-staging-bucket`).
*   **Emails:** Configure Resend to only send to verified domain emails or capture them locally via Mailtrap.

## 2. Docker Compose Override
Create a `docker-compose.staging.yml`:
```yaml
version: '3.8'
services:
  app:
    environment:
      - NEXT_PUBLIC_BASE_URL=https://staging.indlink.in
      - DATABASE_URL=mysql://user:pass@db:3306/indlink_staging
```

## 3. GitHub Actions Pipeline (Staging)
Add a staging workflow triggering on push to a `staging` branch:
1.  Push to `staging`.
2.  Pipeline builds Docker image, deploys to Staging VPS.
3.  QA Team validates changes.
4.  If approved, Open PR to `main` for Production Deployment.
