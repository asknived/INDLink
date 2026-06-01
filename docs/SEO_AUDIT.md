# INDLink SEO Audit

## Current Implementation Status
INDLink relies heavily on Next.js 15 Server-Side Rendering (SSR) which provides immense out-of-the-box SEO benefits.

### 1. Metadata Generation
*   **Public Profiles (`/[username]`):** We use Next.js `generateMetadata` to dynamically fetch the profile and construct `<title>`, `<meta name="description">`, and `openGraph` tags based on the creator's data.

### 2. Robots.txt & Sitemap
*   **Action Required:** Create `src/app/sitemap.ts` to dynamically generate URLs for all public profiles and products to ensure Google indexes creators immediately.
*   **Action Required:** Create `src/app/robots.txt` to allow crawling on `/` but disallow crawling on `/dashboard`, `/admin`, and `/api`.

### 3. Structured Data (JSON-LD)
*   **Action Required:** Inject JSON-LD `Person` or `Organization` schemas into the `<head>` of the public profile pages to enable rich snippets in Google Search results.
