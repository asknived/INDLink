# Cloudflare Setup Guide for INDLink

Cloudflare acts as the edge security and CDN layer for INDLink, accelerating image delivery and mitigating DDoS attacks.

## 1. DNS Setup
*   **A Record:** Name: `@`, Content: `<Your VPS IP>`, Proxy status: **Proxied** (Orange Cloud)
*   **CNAME Record:** Name: `www`, Content: `indlink.in`, Proxy status: **Proxied**
*   **Wildcard DNS (For Custom Domains):** You will need an Enterprise plan for wildcard proxying, or users must CNAME their domains directly to `indlink.in` using Cloudflare for SaaS.

## 2. SSL/TLS Mode
*   Navigate to **SSL/TLS -> Overview**.
*   Set mode to **Full (strict)**. This requires your origin server to have a valid SSL certificate (via Let's Encrypt / Certbot).

## 3. Caching Rules
*   Navigate to **Caching -> Cache Rules**.
*   **Rule 1 (Static Assets):** Match URI path starting with `/_next/static/` -> Cache Level: Cache Everything. Edge Cache TTL: 1 year.
*   **Rule 2 (Media Files):** Cloudflare R2 is natively integrated, but ensure media delivery paths are cached.

## 4. Web Application Firewall (WAF) & Rate Limiting
*   Navigate to **Security -> WAF**.
*   **Rate Limiting Rule 1 (Login):** Block IPs hitting `/api/auth/callback/credentials` more than 10 times in 1 minute.
*   **Rate Limiting Rule 2 (AI APIs):** Block IPs hitting `/api/ai/*` more than 5 times in 1 minute to prevent OpenAI bill spiking.

## 5. Page Rules
*   **Force HTTPS:** Enable "Always Use HTTPS".
*   **Security Headers:** Enable HTTP Strict Transport Security (HSTS) with a max-age of 6 months.
