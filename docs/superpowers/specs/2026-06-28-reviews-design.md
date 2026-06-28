# Reviews Feature Design

## Goal

Replace all fake/seeded review data with real WooCommerce reviews. Users can view ratings on the shop page and product detail page, and submit reviews (name + email + rating + text) without needing an account.

## Architecture

```
WooCommerce product response → average_rating + rating_count fields
  → mapped into Product type
  → ShopLayout StarRating: real stars or nothing (0 reviews)
  → ProductDetailPage headline: real stars or nothing
  → ProductDetailPage reviews tab: real review list (already working)

User fills submission form on product detail page
  → POST /api/products/[id]/reviews
  → validates inputs server-side
  → proxies to WC REST API with Basic Auth (keys never leave server)
  → WC holds review as "pending" until admin approves
  → UI shows success message or error
```

## Tech Stack

Next.js 16 App Router, React 19, TypeScript, Tailwind v4, WooCommerce REST API v3

## Global Constraints

- Brand teal: `#009eb9`, dark blue: `#184363`
- Star colour: `text-amber-400` (filled), `text-neutral-200` (empty) — matches existing review tab
- Show stars only when `ratingCount > 0`; render nothing when there are no reviews
- Submission requires: name, email (valid format), rating 1–5, review text ≥ 10 characters
- WC reviews are created with `status: 'approved'` unless WC admin has forced moderation
- Follow existing patterns: Basic Auth from `lib/wordpress/config.ts`, `WC_API` constant

---

## Components & Files

### 1. `lib/wordpress/types.ts` (modify)

Add `average_rating` and `rating_count` to `WCProduct`:

```ts
// inside WCProduct interface
average_rating: string;   // WC sends this as a string e.g. "4.20"
rating_count:   number;
```

Add `averageRating` and `ratingCount` to the `Product` interface:

```ts
// inside Product interface
averageRating: number;   // parseFloat(average_rating) || 0
ratingCount:   number;
```

### 2. `lib/wordpress/products.ts` (modify)

In `mapProduct()`, add the two new fields:

```ts
averageRating: parseFloat(p.average_rating) || 0,
ratingCount:   p.rating_count,
```

### 3. `components/ShopLayout.tsx` (modify)

Replace the fake `StarRating` component:

**Old signature:** `function StarRating({ productId }: { productId: number })`
**New signature:** `function StarRating({ rating, count }: { rating: number; count: number })`

Rendering rules:
- If `count === 0`: return `null` — no stars, no count
- If `count > 0`: render 5 stars (filled/half/empty based on `rating`), then `{rating.toFixed(1)}` and `({count})`

Half-star threshold: `rating % 1 >= 0.5` renders a half-filled star using `text-amber-300`.

Remove the seeded `rating` and `reviewCount` calculations entirely.

Call sites in grid view and list view change from `<StarRating productId={product.id} />` to `<StarRating rating={product.averageRating} count={product.ratingCount} />`.

### 4. `components/ProductDetailPage.tsx` (modify)

**Headline section (around line 75–195):**
- Remove `const rating = 4.5` and `const reviewCount = 50 + ...`
- Use `product.averageRating` and `product.ratingCount` directly
- Show the headline star row only when `product.ratingCount > 0`

**Reviews tab header (around line 491–498):**
- Replace fake rating summary with real values from `product.averageRating` / `product.ratingCount`
- Show summary only when `product.ratingCount > 0`

**Tab label (line 411):**
- Change `Reviews (${reviewCount})` to `Reviews (${product.ratingCount})`

**"Be the first to review" section (line 542–544):**
- Remove the "Contact us to leave a review" link
- Keep the "Be the first to review this product" text
- The submission form (below) is always shown, making the CTA redundant

**New: ReviewForm component (inline in ProductDetailPage.tsx):**

```ts
interface ReviewFormProps {
  productId: number;
}
```

Renders below the review list (or below the empty-state text). Fields:
- Star picker: 5 clickable stars, hover preview, selected state in `text-amber-400`; default none selected
- Name: `<input type="text" required />`
- Email: `<input type="email" required />`
- Review: `<textarea required minLength={10} />`
- Submit button: `bg-[#009eb9]` teal, full-width on mobile

Three UI states:

| State | Behaviour |
|---|---|
| Idle | Form visible, button enabled |
| Submitting | Button shows spinner, all inputs `disabled` |
| Success | Form replaced by "Thank you! Your review will appear once approved." (teal checkmark icon) |
| Error | Inline red message below form; inputs re-enabled |

Client-side validation before fetch:
- All fields required
- Rating must be 1–5
- Review text ≥ 10 characters
- Valid email format (`/^[^\s@]+@[^\s@]+\.[^\s@]+$/`)

### 5. `app/api/products/[id]/reviews/route.ts` (new)

`POST` handler. Reads `reviewer`, `reviewer_email`, `rating`, `review` from JSON body.

**Validation (returns 400 on failure):**
- All four fields present and non-empty
- `rating` is integer 1–5
- `review` length ≥ 10 characters
- `reviewer_email` matches email regex

**On valid input:**
- POST to `${WC_API}/products/${id}/reviews` with `Authorization: Basic ...` header
- Body: `{ reviewer, reviewer_email, rating, review, status: 'approved' }`
- On WC success (2xx): return `201 { message: 'Review submitted.' }`
- On WC error: return `502 { message: 'Could not submit your review. Please try again.' }`

---

## Error Handling

- API route never exposes WC error details to the client
- Form shows a single user-friendly error string on network failure or non-2xx response
- If `product.ratingCount === 0`, no stars are shown anywhere — no fallback fake values

## Testing

- **`__tests__/api/reviews.test.ts`**: valid submission → 201; missing fields → 400; invalid rating → 400; short review → 400; WC failure → 502
- No component tests (no RTL component tests in this codebase)
