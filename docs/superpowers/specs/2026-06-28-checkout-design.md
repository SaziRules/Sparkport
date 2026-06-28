# Checkout Page Design
**Date:** 2026-06-28
**Status:** Approved

## Goal
Replace the current sparkport.co.za redirect with a fully on-site checkout experience at `/checkout`. Everything — form, payment selection, and order confirmation — happens on this Next.js front end. This site is intended to eventually replace the live WordPress site entirely.

## Payment Methods
Three methods supported by the existing WooCommerce setup:
- **PayFast** (`payfast`) — hosted card payment, instant confirmation
- **EFT** (`bacs`) — manual bank transfer, order ships once payment clears
- **In-store** (`cod`) — customer pays and collects at the Durban pharmacy

## Layout
Two-column on desktop (`lg+`), single column stacked on mobile (form above, summary below).

- **Left column:** delivery details form
- **Right column:** sticky order summary card + payment method selector + submit button

## Form Fields (left column)
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| First name | text | yes | |
| Last name | text | yes | |
| Email address | email | yes | |
| Phone number | tel | yes | SA format |
| Address line 1 | text | yes | |
| Address line 2 | text | no | labelled "Optional" |
| City | text | yes | |
| Province | select | yes | Dropdown of 9 SA provinces |
| Postal code | text | yes | |
| Country | display | — | Fixed: "South Africa" |
| Order notes | textarea | no | "Special instructions for your order" |

SA provinces dropdown values: Eastern Cape, Free State, Gauteng, KwaZulu-Natal, Limpopo, Mpumalanga, North West, Northern Cape, Western Cape.

Client-side validation fires on submit (not on blur — less annoying). Required fields show inline error messages. Email must match RFC format. Phone must be non-empty (no regex enforcement on format — SA numbers vary).

## Order Summary (right column)
- Item list: thumbnail + name + qty × unit price + line total
- Subtotal
- Discount line (hidden when `total_discount === '0'`)
- Delivery: "FREE" when subtotal ≥ R500 after discount, otherwise "Calculated after order"
- **Total** (large, bold, teal)

Summary pulls directly from `useCart()` — no extra fetch needed.

## Payment Method Selector
Three radio cards below the summary. Each card: radio input + icon + name + one-line description.

| Slug | Display name | Description |
|------|-------------|-------------|
| `payfast` | PayFast | Pay securely by card — instant confirmation |
| `bacs` | EFT | Direct bank transfer — use your order ID as reference |
| `cod` | In-store | Pay when you collect at our Durban pharmacy |

Default selected: PayFast.

## Submit Button
Adapts label to selected payment method:
- PayFast → "Pay with PayFast"
- EFT / In-store → "Place Order"

States: idle → loading (spinner, disabled) → redirect. Security row below: lock icon + "Secure checkout" + Visa / MC / PayFast badges.

## API Route
**New file:** `app/api/checkout/route.ts`

**POST** — client sends:
```json
{
  "billing": { "first_name", "last_name", "email", "phone", "address_1", "address_2", "city", "state", "postcode", "country": "ZA" },
  "payment_method": "payfast" | "bacs" | "cod",
  "customer_note": ""
}
```

Route reads `wc_cart_token` from cookies, then:
1. Fetches `GET /wc/store/v1/cart` (with Cart-Token) to obtain a fresh Nonce header — same pattern as `app/api/cart/add/route.ts`
2. Posts to:
```
POST {WP_API_URL}/wc/store/v1/checkout
Headers: Nonce, Cart-Token
Body: { billing_address, shipping_address (= billing_address), payment_method, customer_note }
```

WC responds with `{ order_id, payment_result: { payment_status, redirect_url } }`.

**Route returns to client:**
- PayFast: `{ redirect: redirect_url }` — client follows with `window.location.href`
- EFT: `{ redirect: '/checkout/success?order_id=X&method=bacs' }`
- In-store: `{ redirect: '/checkout/success?order_id=X&method=cod' }`

Error responses from WC (4xx/5xx) are forwarded to the client with appropriate status codes. Client shows an inline error message above the submit button — no full-page redirect on failure.

## Success Page
**Route:** `app/checkout/success/page.tsx`
**Query params:** `order_id`, `method`

The success page is a **client component** (needs `clearCart()` and `useSearchParams()`). On mount:
1. Call `clearCart()` from CartContext
2. Fetch order details from `/api/checkout/order/[id]` — a server route that calls `GET /wc/v3/orders/{order_id}` using `WC_CONSUMER_KEY` + `WC_CONSUMER_SECRET` (credentials stay server-side)

**Page structure:**
- Green animated checkmark
- "Order #X confirmed!"
- "Confirmation sent to {email}"
- Method-specific block:
  - **PayFast:** "Payment received — your order is being prepared."
  - **EFT:** Bank name, account number, branch code (hardcoded constants in the success page — store owner updates them). "Use **#X** as your payment reference. Your order ships once payment clears."
  - **In-store:** Store address + trading hours. "Bring order number **#X** when you collect."
- Order summary (items + total from WC order fetch)
- CTAs: "Continue Shopping" → `/shop` | "View Order" → `/account/orders` (disabled, tooltip: "Coming soon")

The success page does NOT validate the order_id against the user's session in this phase. It trusts the WC fetch — if the order doesn't exist, WC returns 404 and the page shows a generic "Order not found" fallback.

## Files Changed
| File | Action | Notes |
|------|--------|-------|
| `app/checkout/page.tsx` | Replace | Was a redirect stub — full rewrite |
| `app/checkout/success/page.tsx` | Replace | Was a basic stub — full rewrite |
| `app/api/checkout/route.ts` | Create | WC Store API checkout proxy |
| `app/api/checkout/order/[id]/route.ts` | Create | WC REST order fetch for success page |
| `components/CartDrawer.tsx` | Modify | Remove arrow from "Proceed to Checkout →" |
| `app/cart/page.tsx` | Modify | Update checkout button copy |

## Button Copy Fixes (in scope)
- CartDrawer: remove arrow from "Proceed to Checkout →" → **"Proceed to Checkout"**
- Cart page: "Complete My Order — Secure Checkout" → **"Proceed to Checkout"**

## Out of Scope (future)
- Account pre-fill for logged-in users
- Saved addresses
- Shipping rate calculation (rate shown as "Calculated after order" for non-free orders)
- Order history / account dashboard
- PayFast ITN webhook validation
