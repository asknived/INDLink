# INDLink Launch Checklist

## T-Minus 24 Hours
- [ ] Database backup tested and restored successfully on a dummy instance.
- [ ] Send grid/Resend domain verified and DMARC/SPF records propagated.
- [ ] Razorpay Live Keys entered into the production environment.
- [ ] Edge Middleware Custom Domains logic verified locally via `hosts` file hacking.

## T-Minus 2 Hours
- [ ] Deploy v1.0.0 Docker image to Hostinger VPS.
- [ ] Trigger manual `npx prisma db push` or `migrate deploy`.
- [ ] Verify Nginx SSL Certificate is valid and active.
- [ ] Check Sentry to ensure no runtime errors are occurring on boot.

## T-Zero (Launch)
- [ ] Remove `Password Protection` or `Under Construction` middleware.
- [ ] Announce launch on Twitter/X, LinkedIn, and via Email Newsletter.
- [ ] Monitor Uptime Kuma dashboard continuously for the first hour.
