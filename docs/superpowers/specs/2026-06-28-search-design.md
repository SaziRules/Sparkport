# Search Feature Design

## Goal

Instant search with a live dropdown in the header. As the user types, matching products appear immediately. Clicking a result goes to the product page; submitting goes to the shop page filtered by the query.

## Architecture

```
User types in header search bar
  → useSearch hook debounces 300ms
  → GET /api/products/search?q=<term>&limit=6
  → Next.js route calls getProducts({ search: q, per_page: 6 })
  → WooCommerce returns matching products
  → SearchDropdown renders below the input

User clicks a result    → /product/[slug]
User presses Enter      → /shop?q=<term>
"See all results" link  → /shop?q=<term>
Escape / click outside  → close dropdown
```

## Tech Stack

Next.js 16 App Router, React 19, TypeScript, Tailwind v4, WooCommerce REST API v3

## Global Constraints

- Brand teal: `#009eb9`, dark blue: `#184363`
- Minimum query length before fetching: 2 characters
- Dropdown shows at most 6 results
- Debounce delay: 300ms
- All new components are `'use client'`
- Follow existing patterns: `lib/wordpress/products.ts` for WC calls, Basic Auth from `lib/wordpress/config.ts`

---

## Components & Files

### 1. `app/api/products/search/route.ts` (new)

GET handler. Reads `q` and `limit` (default 6) from query params.

- Returns `{ results: [] }` immediately if `q.length < 2`
- Calls `getProducts({ search: q, per_page: limit })`
- Maps each WC product to `{ id, name, slug, price, image }` where:
  - `price` is `product.price` formatted with currency symbol (e.g. `R29.99`)
  - `image` is `product.images[0]?.src ?? ''`
- Sets `Cache-Control: no-store` on the response
- Returns `{ results: SearchResult[] }`

```ts
interface SearchResult {
  id: number;
  name: string;
  slug: string;
  price: string;
  image: string;
}
```

### 2. `lib/hooks/useSearch.ts` (new)

Client hook. Takes `query: string`, returns `{ results: SearchResult[], isLoading: boolean, error: string }`.

Behaviour:
- If `query.trim().length < 2`: return `{ results: [], isLoading: false, error: '' }` synchronously — no fetch
- Otherwise: debounce 300ms, then `fetch('/api/products/search?q=<query>&limit=6', { signal })`
- Uses `AbortController` — aborts the previous request when a new query fires before it resolves
- On fetch error (non-abort): sets `error` to a generic message, `results` to `[]`
- Clears `error` on each new fetch

### 3. `components/SearchDropdown.tsx` (new)

Renders the live result list. Props:

```ts
interface SearchDropdownProps {
  query: string;
  results: SearchResult[];
  isLoading: boolean;
  highlightedIndex: number;           // -1 = none highlighted
  onResultClick: (slug: string) => void;
  onSeeAll: () => void;
}
```

States rendered:

| State | Content |
|---|---|
| `isLoading` | 3 skeleton rows (neutral shimmer, same height as result cards) |
| `results.length > 0` | Up to 6 result cards + "See all results" footer |
| `results.length === 0` (query ≥ 2, not loading) | "No products found for **X**" neutral message |

**Result card:** 40×40 thumbnail (`object-contain`, neutral bg), product name (truncated 1 line, `text-sm font-semibold text-[#184363]`), price (`text-sm text-[#009eb9]`). Highlighted row: `bg-[#e8f5f7]`.

**Footer link:** `text-sm text-[#009eb9] font-semibold` — "See all results for **X** →"

### 4. `lib/hooks/useSearchKeyboard.ts` (new)

Manages keyboard navigation for the dropdown. Takes `resultCount: number` and callbacks. Returns `{ highlightedIndex, handleKeyDown, resetHighlight }`.

- `↑` / `↓`: move `highlightedIndex` through `0..resultCount-1`, clamped (no wrap)
- `Enter`: if `highlightedIndex >= 0`, fire `onSelectHighlighted()`; else fire `onSubmit()`
- `Escape`: fire `onClose()`

Kept separate so the same keyboard logic can be tested independently and reused in both desktop and mobile.

### 5. `components/KlaasHeader.tsx` (modify)

Wire `useSearch` and `useSearchKeyboard` to the existing search input.

- Add `query` state bound to the input's `value` / `onChange`
- `isOpen` = `query.length >= 2` (dropdown visible when there are potentially results)
- Render `SearchDropdown` absolutely below the search bar (`top-full left-0 right-0 z-50`) inside a `relative` wrapper
- `onResultClick(slug)` → `router.push('/product/' + slug)`, close dropdown, clear query
- Form `onSubmit` → `router.push('/shop?q=' + query)`, close dropdown
- Click outside: attach `mousedown` listener on `document` via `useEffect`, close if click is outside the search wrapper ref

### 6. `components/SparkportMobileHeader.tsx` (modify)

Wire the same hooks to the existing overlay input.

- When `query.length < 2`: show "Popular Searches" section as-is
- When `query.length >= 2`: replace Popular Searches with `SearchDropdown` (rendered inline inside the overlay scroll area, not absolutely positioned)
- `onResultClick` → close overlay, navigate to `/product/[slug]`
- Form submit → close overlay, navigate to `/shop?q=...`

### 7. `app/shop/page.tsx` (modify)

Accept `q` search param alongside the existing `category` param.

- When `q` is present: call `getAllProducts({ search: q })` instead of `getAllProducts()`
- Pass `initialQuery: q` and filtered products down to `ShopLayout`

### 8. `components/ShopLayout.tsx` (modify)

Accept `initialQuery?: string` prop.

- Initialise `searchQuery` state from `initialQuery ?? ''`
- Pre-populate the sidebar search input with `initialQuery`
- When `initialQuery` is present and products come pre-filtered, client-side search still works as normal (filtering the already-filtered list from the server)

---

## Error Handling

- API route: if `getProducts` throws, return `{ results: [] }` with status 200 — a broken search is not a broken page
- Hook: network errors set `error` state; the dropdown shows a neutral "Couldn't load results" message
- Images: use `next/image` with `onError` fallback to a neutral placeholder

## Testing

- **`__tests__/api/search.test.ts`**: query < 2 chars → `{ results: [] }`; valid query → maps WC response to `SearchResult[]`; empty WC response → `{ results: [] }`
- **`__tests__/lib/useSearchKeyboard.test.ts`**: arrow key movement, Enter with/without highlight, Escape
- No tests for `useSearch` itself (it wraps `fetch` which is integration territory) or for the React components (no RTL component tests in this codebase)
