# INDLink Infrastructure Cost Estimations (Monthly)

## 1. Small Deployment (Beta / Validation Phase)
*Up to 1,000 MAU*
*   **VPS (Hostinger KVM 2 / DigitalOcean Basic):** $10 - $12
*   **Database (MySQL on VPS):** Included
*   **Storage (Cloudflare R2):** Free Tier (10GB)
*   **Emails (Resend):** Free Tier (3,000 emails/mo)
*   **AI (OpenAI):** ~$5 (Pay-as-you-go)
*   **Total Monthly Cost:** **~$15/mo**

## 2. Medium Deployment (Growth Phase)
*Up to 50,000 MAU*
*   **VPS (Hostinger KVM 4 / DO General Purpose 8GB):** $25 - $40
*   **Managed Database (DigitalOcean Managed MySQL):** $30
*   **Storage (Cloudflare R2):** ~$5 (50GB + bandwidth)
*   **Emails (Resend Pro):** $20 (50,000 emails/mo)
*   **AI (OpenAI):** ~$50 (Depending on usage limits)
*   **Total Monthly Cost:** **~$130 - $145/mo**

## 3. Large Deployment (Enterprise Phase)
*100,000+ MAU*
*   **Load Balancer:** $12
*   **App Servers (2x 16GB RAM VPS):** $80
*   **Managed Database (High Availability MySQL Cluster):** $120
*   **Managed Redis Cache:** $30
*   **Storage (Cloudflare R2):** ~$25 (250GB + bandwidth)
*   **Emails (Resend Pro):** $60+
*   **AI (OpenAI):** $200+
*   **Cloudflare Pro / Enterprise:** $25+
*   **Total Monthly Cost:** **~$550+/mo**
