# INDLink Incident Response Plan

## 1. Severity Levels
*   **SEV-1 (Critical):** Database down, website unreachable, payment gateway failing. (Response: < 15 mins)
*   **SEV-2 (High):** Major feature broken (e.g., Image Uploads, AI generation) but site is up. (Response: < 1 hr)
*   **SEV-3 (Low):** UI bugs, non-critical analytics tracking failures. (Response: Next Sprint)

## 2. Contact Matrix
*   **Lead Engineer:** Primary responder for SEV-1.
*   **DevOps / Infrastructure:** Responds to Database/Server alerts.

## 3. Resolution Workflow
1.  **Detect:** Uptime Kuma or Sentry triggers an alert to the `#alerts` Slack/Discord channel.
2.  **Acknowledge:** Engineer claims the incident.
3.  **Investigate:** Check `pm2 logs`, Sentry stack traces, and database connections.
4.  **Mitigate:** 
    *   If a bad deployment caused the issue: Immediately run `git revert` and deploy.
    *   If database overload: Scale up VPS / Database tier.
5.  **Post-Mortem:** Write a summary of why it happened and how to prevent it.
