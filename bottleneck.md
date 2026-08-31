# Sparkport — Pre-Launch Audit
Last updated: 31 August 2026

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

**12. `health-care-services` uses Unsplash images**
Three sections use Unsplash URLs. Replace with real Sparkport photography before or shortly after launch.

**13. Dead `api/manager/promotional-banners/[slot]` route**
`app/api/manager/promotional-banners/[slot]/route.ts` — confirm this is wired into the manager dashboard. If not, it's orphaned dead code.

**14. Duplicate image-banner routes**
Both `app/api/manager/image-banner/route.ts` and `app/api/image-banner/route.ts` exist. Confirm one isn't superseded (similar to the banners/hero_banners confusion).

**15. No dedicated order detail page**
`/account/orders/[id]` doesn't exist — the orders page opens a modal instead. Acceptable at launch, but shareable/deep-linkable order URLs would be better post-launch.

---

## 💳 PayFast Setup (manual — do before go-live)

**16. PayFast Merchant Key missing**
`PAYFAST_MERCHANT_KEY` is blank in `.env.local` — PayFast rejects every card payment with "Merchant Key Required".
- Log into **payfast.co.za → Integration → Merchant Details**
- Copy the Merchant Key (short alphanumeric string next to Merchant ID `1049261100010`)
- Add to `.env.local`: `PAYFAST_MERCHANT_KEY=<key>`
- Add the same to Vercel → Project Settings → Environment Variables

**17. EFT bank account details missing**
`app/checkout/success/page.tsx:13` — `accountNumber` is still `'62XXXXXXXXXX'`. Get the full FNB banking details from the business and update:
- Account number
- Branch code (currently `250655` — confirm this is correct for the account)
- Account name (currently `'Sparkport Pharmacy'` — confirm)

**18. PayFast env vars not yet in Vercel**
`.env.local` has `PAYFAST_MERCHANT_ID`, `PAYFAST_MERCHANT_KEY`, and `PAYFAST_PASSPHRASE` set locally. Add all three to Vercel → Project Settings → Environment Variables before deploying. Card payments will fail in production without this.

---

## 📧 Email / Brevo Setup (manual — do before go-live)

**19. Supabase SMTP + Brevo not configured**
Auth verification emails use Supabase's shared SMTP (4/hour cap, unreliable). New users are not receiving verification emails.

Steps:
1. Supabase Dashboard → Authentication → Settings → SMTP Provider → Enable Custom SMTP
   - Host: `smtp-relay.brevo.com` · Port: `587`
   - Username: Brevo account email
   - Password: Brevo SMTP key (Brevo → SMTP & API → SMTP)
   - Sender name: `Sparkport Pharmacy` · Sender email: `hello@sparkport.co.za`
2. Add `BREVO_API_KEY=<your_api_key>` to `.env.local` (and Vercel env vars)
   - Key found in Brevo → SMTP & API → API Keys
   - This activates the welcome bonus email in `lib/email.ts`
3. Supabase → Authentication → Settings → confirm "Enable email confirmations" is ON

---

## Manual Steps Required Before Launch (in order)

1. Apply pending Supabase migrations 011–019
2. Set up 4 WC webhooks + test each returns 200
3. Run `npx ts-node scripts/wc-backfill.ts`
4. Delete dead BannersSection + banner API routes
5. Add PayFast Merchant Key to `.env.local` and Vercel
6. Build signup bonus insert (30 min)
7. Add S5/S6 warning to `/fill-script` + fraud disclaimer to `/prescription-success`
8. Build dynamic `PromotionalBanners.tsx` from `promotions` table
9. Build manager Rewards section
10. Verify/complete customer prescription journey roadmap modal
11. Audit T&C for completeness against Task 9 requirements
12. Fill in real FNB banking details in `app/checkout/success/page.tsx`
13. Add all PayFast env vars to Vercel
