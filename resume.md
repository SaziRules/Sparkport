# Session Resume — Sparkport
Last updated: 31 August 2026

---

## Where We Left Off

Payment gateway is the active focus. The checkout flow redirects to PayFast correctly but PayFast rejects it with **"Merchant Key Required"** because `PAYFAST_MERCHANT_KEY` is blank in `.env.local`.

**One action unblocks payments:**
Log into **payfast.co.za → Integration → Merchant Details**, copy the Merchant Key, and add it:
```
PAYFAST_MERCHANT_KEY=<key>
```
Then restart the dev server and test a card payment end-to-end.

---

## Payment Gateway — Full Picture

The WooCommerce plugin is **"Payfast Gateway for WooCommerce"**. The person who set up WooCommerce named the display title, description, and button "Paygate" — that's just a label, not the actual gateway. The plugin sends customers to PayFast.

Credential mapping from the WooCommerce plugin settings:

| WC Plugin field | `.env.local` key | Value |
|---|---|---|
| Terminal ID | `PAYFAST_MERCHANT_ID` | `1049261100010` |
| Encryption Key | `PAYFAST_PASSPHRASE` | `Hik5philDsrg` |
| *(not shown)* | `PAYFAST_MERCHANT_KEY` | **still needed** |

`PAYFAST_SANDBOX=false` — live mode.

### Payment flow (how it works)
1. Customer submits checkout form → POST `/api/checkout`
2. Server creates WC order via REST API (`/wc/v3/orders`)
3. Server builds PayFast redirect URL with MD5 signature (`lib/payfastSignature.ts`)
4. Frontend receives `{ redirect: 'https://www.payfast.co.za/eng/process?...' }` and does `window.location.href`
5. Customer pays on PayFast
6. PayFast POSTs ITN to `/api/checkout/payfast-notify` → marks WC order as `processing`
7. PayFast redirects customer to `/checkout/success?order_id=XXX&method=payfast`

### Key files
- `app/api/checkout/route.ts` — order creation + PayFast URL builder
- `lib/payfastSignature.ts` — MD5 signature logic
- `app/api/checkout/payfast-notify/route.ts` — ITN handler
- `app/checkout/page.tsx` — checkout form, payment method selection
- `app/checkout/success/page.tsx` — success/confirmation page (EFT bank details still placeholder)
- `lib/paygate.ts` + `app/api/checkout/paygate-notify/route.ts` — created during session but unused; safe to delete

---

## What Was Done This Session

- **Events page** (`app/events/page.tsx`) — full rebuild. Removed fake upcoming events (TBC dates), removed false SAHPRA/SAPC/GEMS/Dept of Health partnership claims, replaced with honest "watch this space" placeholder. Added to `isFullWidth` list in `MainWrapper.tsx`.
- **Health-insurance hero** (`app/health-insurance/page.tsx`) — fixed broken hero. Was using `fixed inset-0` background divs that bled across the whole page. Replaced with `next/image fill` + `overflow-hidden` pattern.
- **Footer payment logos** (`components/Footer.tsx`) — replaced with logos from `/public/images/payments/`. Kept Mastercard (external SVG), added Visa.svg, instant-eft.svg, payfast.png. Fixed SVG sizing with `object-contain` instead of `w-auto`.
- **bottleneck.md** — added Brevo email setup (item 19), added PayFast credential items, removed completed events page item, corrected PayGate → PayFast throughout.

---

## Current `.env.local` State

```
NEXT_PUBLIC_SUPABASE_URL=https://oserakooknnthfsuezge.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...

NEXT_PUBLIC_WP_API_URL=https://sparkport.co.za/wp-json
WC_CONSUMER_KEY=ck_199174810f007391b13c9fbedcdf6df6382e5a1f
WC_CONSUMER_SECRET=cs_affede0ad45ee35a1067148a87cc10c935afe260
WC_WEBHOOK_SECRET=K3g7MjlXNTVmUnR5VUlPaFBCbU5XbFpRMmUzclQ0WVkj

PAYFAST_MERCHANT_ID=1049261100010
PAYFAST_MERCHANT_KEY=          ← BLANK — this is the blocker
PAYFAST_PASSPHRASE=Hik5philDsrg
PAYFAST_SANDBOX=false
SITE_URL=https://sparkport-flax.vercel.app
```

---

## Immediate Next Steps (in order)

1. **Get PayFast Merchant Key** → fill in `.env.local` → restart dev server → test card payment
2. **Test full checkout flow** end-to-end: add to cart → checkout → PayFast → success page
3. **Get FNB banking details** → fill in `app/checkout/success/page.tsx:13` (EFT section)
4. Continue through `bottleneck.md` — next code items are signup bonus points (item 4) and S5/S6 warning on `/fill-script` (item 8)

---

## Important Patterns / Gotchas

- **Next.js does not hot-reload `.env.local`** — must fully restart dev server (`Ctrl+C` then `npm run dev`) after any env var change
- **`SITE_URL` points to Vercel** — after paying on PayFast in dev, you'll be redirected to the Vercel deployment's success page, not localhost. Expected behaviour.
- **PayFast ITN notify URL** also points to Vercel in dev — WC order won't auto-update to `processing` during local testing. Fine for now.
- **Tailwind v4 syntax**: use `font-extrabold!` (with `!`) for important overrides
- **`next/image` with `fill`**: parent needs `relative` + `overflow-hidden`; content above image needs `relative z-10`
- **MainWrapper.tsx** controls full-width vs constrained layout — any new full-bleed page needs its path added to the `isFullWidth` check
