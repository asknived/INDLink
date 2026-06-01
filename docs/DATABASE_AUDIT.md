# INDLink Database Audit & Optimization Plan

## Current State Analysis (Phase 6)
The Prisma Schema currently contains 25+ models representing a highly relational structure. 

## 1. Indexing Review
*   `User.email`: Handled inherently by `NextAuth` adapters but requires a B-Tree index for login queries.
*   `Profile.username`: `@@unique` automatically creates an index. Essential for high-speed custom domain lookups.
*   **Bottleneck Risk - `Click` Table:** The `Click` table tracks every individual click. It currently lacks compound indexes. 
    *   *Optimization Required:* Add `@@index([profileId, createdAt])` and `@@index([linkId, createdAt])` to speed up the Analytics Dashboard aggregation queries.

## 2. Query Performance Tuning
*   **N+1 Query Avoidance:** The `/[username]` page must use Prisma `include: { links: true, socialLinks: true }` to fetch the profile and its relations in a single SQL query. Do not map over links to run subsequent `findUnique` queries.
*   **Pagination:** Use cursor-based pagination for the Developer API and Admin Panel rather than `offset` (skip/take) when records exceed 100,000. Offset pagination degrades massively at scale.

## 3. Storage Optimization
*   Use `BigInt` for `storageUsed` (Already implemented).
*   The `metadata` field in `AuditLog` uses `@db.Text`. If JSON querying becomes necessary, migrating this to MySQL's native `JSON` column type is recommended.
