# INDLink Monitoring Guide

## 1. Uptime Kuma Setup (Infrastructure Health)
1.  Deploy Uptime Kuma via Docker on a **separate micro-VPS** ($5/mo). Do not host it on the same server as INDLink.
2.  Create a Monitor:
    *   **Type:** HTTP(s)
    *   **URL:** `https://indlink.in/api/health`
    *   **Interval:** 60 seconds
3.  Configure Notifications: Connect Uptime Kuma to a Discord Webhook or Telegram Bot.

## 2. Sentry Setup (Application Errors)
1.  Create a project in Sentry.io.
2.  Add `SENTRY_DSN` to your `.env` file.
3.  Sentry will automatically catch unhandled exceptions in API routes and React rendering errors on the client.

## 3. PostHog Setup (Product Analytics)
1.  Create a PostHog Cloud account.
2.  Add `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST` to `.env`.
3.  PostHog tracks user retention, feature usage (e.g., "How many people click 'Add Link'"), and conversion funnels.
