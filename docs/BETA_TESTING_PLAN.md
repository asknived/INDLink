# INDLink Beta Testing Plan

## 1. Objectives
*   Validate the core value proposition (Link-in-bio + Digital Products).
*   Test system scalability under mild, real-world load.
*   Identify UX bottlenecks in the profile creation flow.

## 2. Audience Cohorts
1.  **Cohort A (Friends & Family):** ~50 users. Goal: Find breaking bugs in the UI.
2.  **Cohort B (Micro-influencers):** ~20 creators. We manually onboard them. Goal: Validate the Creator Storefront and Razorpay integration.
3.  **Cohort C (Waitlist Users):** ~500 users. Open beta via email invite.

## 3. Feature Flags (Beta Toggles)
In the database `FeatureFlag` table, ensure:
*   `AI_PROFILE_ASSISTANT`: `true` for Cohort B only (to manage OpenAI costs).
*   `CUSTOM_DOMAINS`: `false` until wildcard DNS routing is fully stabilized.

## 4. Feedback Loop
*   Create a Discord/WhatsApp community for beta testers.
*   Install PostHog session recording to watch how users navigate the dashboard. (Ensure GDPR/Privacy policies are updated).
