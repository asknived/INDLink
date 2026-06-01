# INDLink Final Production Checklist

Complete this checklist before routing live traffic to the production domain.

## 1. Environment Variables
- [ ] `NODE_ENV` is set to `production`.
- [ ] `DATABASE_URL` points to the production MySQL database.
- [ ] `AUTH_SECRET` is generated (`openssl rand -base64 32`) and different from dev/staging.
- [ ] `NEXT_PUBLIC_BASE_URL` is set to `https://indlink.in`.
- [ ] Redis, R2, Razorpay, Resend, and OpenAI keys are present.

## 2. Database
- [ ] `npx prisma db push` or `npx prisma migrate deploy` executed successfully on Prod DB.
- [ ] Initial admin user created in the database.

## 3. Storage (R2)
- [ ] CORS policies configured on Cloudflare R2 bucket to allow `https://indlink.in` `PUT` and `GET`.
- [ ] Bucket is public or Public URL is correctly configured in `.env`.

## 4. Payments
- [ ] Razorpay webhook endpoint (`/api/webhooks/razorpay`) configured in Razorpay Dashboard.
- [ ] Webhook Secret added to `.env`.
- [ ] Test purchase completed successfully in live mode with a Rs 1 product.

## 5. Security & Infrastructure
- [ ] Cloudflare SSL set to Full (strict).
- [ ] Uptime Kuma monitoring `/api/health` endpoint.
- [ ] PostHog & Sentry API keys integrated.
