# Sparkport — Pre-Launch Audit
Last updated: 20 August 2026

---

## 🔴 CRITICAL — Blocks Launch

**1. Pending Supabase Migrations (manual)**
Migrations 011–019 may not all be applied. Run each in the Supabase SQL editor and confirm the tables exist before testing anything:
- `011` → fix manager RLS recursion
- `012` → prescription images INSERT policy
- `013` × 2 → managers RLS + profiles address columns
- `014` → enquiries + subscribers tables
- `015_promotions.sql` → hero slider table (**NOT** `015_hero_banners.sql`)
- `016_prescription_status_log.sql` → needed for the Prescription Roadmap feature
- `017_hero_tiles.sql`, `018_image_banner.sql`, `019_promotional_banners.sql`

**2. WooCommerce Webhooks not set up (manual)**
No webhook = WC orders never sync to Supabase. Set up 4 webhooks in WC Admin → Settings → Advanced → Webhooks pointing to `/api/webhooks/woocommerce` with the `WC_WEBHOOK_SECRET` from `.env.local`. Then run the backfill script.

**3. WC Order Backfill not run**
`scripts/wc-backfill.ts` hasn't been run. Historical orders won't appear in customer dashboards or manager analytics until it is.

---

## 🟠 IMPORTANT — Needed for Full Functionality

**4. Signup Bonus Points not implemented**
`app/account/page.tsx` — the signup handler has no insert into `rewards` or `rewards_transactions`. New users don't receive their 50-point welcome bonus or get placed in the `bronze` tier. (Task 2 in `plan.txt`)

**5. Mid-page Promotional Banners still hardcoded**
`components/PromotionalBanners.tsx` still uses hardcoded Unsplash images. Manager-created promotions from the `promotions` table are not surfaced on the customer site. The public `/api/promotions` endpoint and the dynamic rewrite of `PromotionalBanners.tsx` are unbuilt. (Task 3 in `plan.txt`)

**6. Manager Rewards Section — "Coming Soon"**
Both `FranchiseAdminDashboard.tsx:30` and `StoreManagerDashboard.tsx:29` show "Coming Soon" for the Rewards section. No KPI cards, no top earners table, no transaction history. The `/api/manager/rewards` endpoint doesn't exist yet. (Task 4 in `plan.txt`)

**7. Prescription Roadmap — customer side incomplete**
The migration (`016`), `PrescriptionRoadmapModal.tsx`, and `PrescriptionModal.tsx` exist in the manager dashboard. But the customer-facing "View Journey" experience on `/account/dashboard` — the modal/bottom sheet with timeline, PDF download, share, and print — needs to be verified or finished. (Task 7 in `plan.txt`)

**8. S5/S6 warning missing from `/fill-script`**
Zero mentions of S5, S6, or "scheduled" on the fill-script page. The collapsible amber warning block linking to `/regulated-medication` has not been added. The `/regulated-medication` page itself is complete. (Task 8a in `plan.txt`)

**9. Fraud disclaimer missing from `/prescription-success`**
No disclaimer text on the success page confirming the prescription is valid and that fraud is a criminal offence. (Task 8c in `plan.txt`)

**10. Dead code still present**
`app/manager/dashboard/sections/BannersSection.tsx`, `app/api/manager/banners/route.ts`, and `app/api/manager/banners/[id]/route.ts` are dead — they manage the old `hero_banners` table which was superseded by `promotions`. Not wired into either dashboard. Delete before launch. (Task 1 in `plan.txt`)

**11. Terms & Conditions — completeness unverified**
The T&C page exists and has structure but was last updated 2 July 2026. Verify it covers all 12 sections from Task 9 in `plan.txt`: POPIA, CPA, prescription policy, PayFast, delivery, returns, rewards, S5/S6 link, governing law, and PCSA complaints link.

---

## 🟡 MINOR — Polish / Pre-Launch Quality

**12. Events page is a stub**
`app/events/page.tsx` renders only an `<h1>Events Page</h1>`. Either build it or remove it from navigation before launch.

**13. `health-care-services` uses Unsplash images**
Three sections use Unsplash URLs. Replace with real Sparkport photography before or shortly after launch.

**14. Dead `api/manager/promotional-banners/[slot]` route**
`app/api/manager/promotional-banners/[slot]/route.ts` — confirm this is wired into the manager dashboard. If not, it's orphaned dead code.

**15. Duplicate image-banner routes**
Both `app/api/manager/image-banner/route.ts` and `app/api/image-banner/route.ts` exist. Confirm one isn't superseded (similar to the banners/hero_banners confusion).

**16. No dedicated order detail page**
`/account/orders/[id]` doesn't exist — the orders page opens a modal instead. Acceptable at launch, but shareable/deep-linkable order URLs would be better post-launch.

---

## Manual Steps Required Before Launch (in order)

1. Apply pending Supabase migrations 011–019
2. Set up 4 WC webhooks + test each returns 200
3. Run `npx ts-node scripts/wc-backfill.ts`
4. Delete dead BannersSection + banner API routes
5. Build signup bonus insert (30 min)
6. Add S5/S6 warning to `/fill-script` + fraud disclaimer to `/prescription-success`
7. Build dynamic `PromotionalBanners.tsx` from `promotions` table
8. Build manager Rewards section
9. Verify/complete customer prescription journey roadmap modal
10. Audit T&C for completeness against Task 9 requirements
11. Either build or hide the Events page
