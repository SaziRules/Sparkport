# Store Locator Redesign — Design Doc

**Date:** 2026-11-16
**Status:** Draft (awaiting approval)

## Intent

Rebuild `/store-locator` with the information architecture and interaction polish of the checkstar store locator, translated into sparkport's own visual language. The current locator is a single-column list with an OpenStreet iframe showing one store at a time — functional but visually generic and not a surface the pharmacy group wants to send prospective customers to.

The destination is a store-finding experience where a first-time visitor can scan all 8 branches, see which are open right now, understand what each offers, and get directions in two clicks — on both desktop and mobile — with motion that feels intentional rather than decorative.

## Why now

The store locator is the single most-visited page for people deciding whether to pick up a prescription at Sparkport vs a competitor. It currently reads as an afterthought. Separately, the data on each store (images, services, hours granularity) has been limited by the current UI's needs — this redesign is the moment to upgrade both.

## Goals

- Translate checkstar's two-column (list + map) desktop layout and tabbed-with-bottom-sheet mobile layout into sparkport's light, teal-and-dark-blue identity
- Interactive map with clickable markers that sync with the sidebar (click marker → card scrolls into view and expands; click card → map pans to marker)
- Each store card surfaces: storefront photo, open/closed status (live-updating), today's hours, quick services at a glance, call + directions CTAs
- A deep-link to the full branch page (`/branches/[slug]`) for long-form content; the locator stays compact
- Framer Motion animations for card expand/collapse, bottom-sheet slide, floating selected-store pill, marker scale-on-select — none of them gratuitous
- Works with 8 current stores; new store added to `lib/stores.ts` → appears everywhere

## Non-goals

- Not redesigning `/branches/[slug]` (the per-store detail page)
- Not changing brand palette, logo, typography system, or global nav
- Not swapping to Google Maps or Mapbox
- Not building a filter system beyond free-text search (would be over-engineering for 8 stores)
- Not integrating live stock or prescription availability

## Anti-goals

- A palette swap of checkstar's dark theme (reads as "theme flipped" rather than native)
- A 3-column list+map+detail layout (duplicates `/branches/[slug]`)
- Infinite animation complexity (motion should serve navigation, not entertain)
- Introducing a tile provider that requires an API key or hits paid quota at low traffic

## Constraints

- **Brand:** teal `#009eb9`, dark blue `#184363`, light theme (white surfaces, neutral grays)
- **Map:** Leaflet + `tile.openstreetmap.org` as the tile source — no API key, no watermark, acceptable under OSM's tile usage policy at expected pharmacy-locator traffic. Marker icons via Leaflet's `divIcon` to avoid the broken default-marker-image issue that plagues bundler setups.
- **Framework:** Next.js 16.1.6, React 19, client-component only (`'use client'` at the top of the locator)
- **Build:** Vercel preview must keep working. Leaflet SSR-incompatible, so `StoreMap` is loaded via `next/dynamic` with `ssr: false`.
- **Existing integrations:** `store.id` is referenced by `app/checkout/page.tsx`, `app/checkout/success/page.tsx`, `components/FillYourScript.tsx`, `app/manager/dashboard/sections/StoresSection.tsx`. Changing the `Store` shape must be additive — no breaking existing fields.
- **Deps to add:** `framer-motion`, `leaflet`, `react-leaflet`, `@types/leaflet`, `lucide-react`. All stable, widely used, no known Next.js 16 incompatibilities.
- **Must not regress** the `/branches/[slug]` page which also reads from `lib/stores.ts`.

## Approaches considered

**A — Faithful port, palette flip.** Clone checkstar's `StoreLocatorClient.tsx` almost verbatim, swap dark+orange tokens for light+teal, swap the tile URL. Fastest to ship. Rejected: many of checkstar's choices (translucent borders on dark surfaces, backdrop-blur pills on ink, orange glow accents) are designed for dark backgrounds and don't translate — flipped to light they look washed-out rather than elegant. Ends up feeling like a theme swap.

**B — Light-theme reinterpretation on the same architecture (CHOSEN).** Keep what works structurally: 400px sidebar + map on desktop; list/map tabs + bottom sheet on mobile; cards that expand in place; floating selected-store pill on the map. Rebuild visual choices from scratch for light + sparkport brand: soft shadows instead of translucent borders, teal/dark-blue accents, more generous whitespace, warmer card rhythm. Same patterns, native feel.

**C — Persistent 3-column list+map+detail panel.** Click a store → right-side panel slides in with full content. Rejected: duplicates `/branches/[slug]`, adds complexity, diverges further from checkstar than needed.

## The how (decided)

### Data model changes — `lib/stores.ts`

Extend the `Store` type additively. All new fields are required (placeholders used where real data doesn't yet exist):

```ts
export interface Store {
  // existing
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  hours: string;                      // keep for backwards compat with /branches page parser
  coordinates: { lat: number; lng: number };
  slug: string;
  area: string;
  content: { gettingHere: string; seoWriteUp: string };

  // new
  suburb: string;                     // short form shown above store name on card
  image: string;                      // '/images/branch-hero.jpg' for all, for now
  services: string[];                 // 3–6 tags per store, see Services section
  structuredHours: {
    weekdays: string;                 // 'Mon – Thu: 08:00 – 22:00'
    friday?: string;                  // when friday differs from weekdays
    saturday: string;
    sunday: string;
    publicHolidays?: string;
    fridayNote?: string;              // e.g. 'closed 12:15–13:15 for Jummah'
  };
}
```

The existing single `hours` string stays because `app/branches/[slug]/page.tsx` already parses it with a local `parseHourRows()` helper. We don't touch the branches page in this change.

### Services — initial values

Derived from the existing `content.seoWriteUp` paragraphs for each store. Builder should not guess; use this map:

| Store | Services |
|---|---|
| Overport | `Dispensary`, `Chronic Meds`, `Schedule 5 & 6`, `Script Upload`, `Late-night Trading` |
| City Centre | `Dispensary`, `Chronic Meds`, `Wholesale Enquiries`, `Script Upload`, `Early Opening` |
| Musgrave | `Dispensary`, `Chronic Meds`, `Pharmacist Consult`, `Script Upload` |
| Quality Street | `Dispensary`, `Chronic Meds`, `Schedule 5 & 6`, `Script Upload` |
| Warner Beach | `Dispensary`, `Chronic Meds`, `Pharmacist Consult`, `Script Upload` |
| Chatsworth | `Dispensary`, `Chronic Meds`, `ARV/HIV Management`, `Script Upload`, `7-Day Trading` |
| Umlazi | `Dispensary`, `Chronic Meds`, `ARV/HIV Management`, `Script Upload` |
| Pietermaritzburg | `Dispensary`, `Chronic Meds`, `Script Upload`, `Extended Hours`, `7-Day Trading` |

These are initial values the user can edit later. The service string is also the key the `ServiceBadge` uses to look up an icon (see Icon Map).

### Icon map for `ServiceBadge`

Using `lucide-react`:

| Service | Icon |
|---|---|
| `Dispensary` | `Pill` |
| `Chronic Meds` | `Clock` |
| `Schedule 5 & 6` | `ShieldCheck` |
| `Script Upload` | `Upload` |
| `Late-night Trading` | `Moon` |
| `Early Opening` | `Sunrise` |
| `7-Day Trading` | `CalendarDays` |
| `Extended Hours` | `Clock3` |
| `Pharmacist Consult` | `Stethoscope` |
| `Wholesale Enquiries` | `Package` |
| `ARV/HIV Management` | `Heart` |

Unmapped services render with no icon (fine — label still shows).

### Structured hours — migration

For each store, builder parses the existing `hours` field into the `structuredHours` shape and commits both. The current strings (`'Mon-Thu: 8AM-10PM • Fri: 8AM-10PM • Sat: 8AM-10PM • Sun: 9AM-10PM'`) are mechanical to parse. Normalize times to 24h `'HH:MM – HH:MM'` so `isOpenNow()` can work with strict comparisons.

### Component structure

New directory: `components/StoreLocator/`. One client entry, map in its own file for `next/dynamic`:

```
components/StoreLocator/
├── index.tsx                  // re-export StoreLocatorClient
├── StoreLocatorClient.tsx     // main 'use client', state, layout
├── StoreMap.tsx               // react-leaflet, dynamic imported ssr:false
├── StoreCard.tsx              // sidebar card, expands for details
├── MobileBottomSheet.tsx      // mobile selected-store sheet
├── HoursTable.tsx             // full-week hours grid inside expanded card
├── ServiceBadge.tsx           // icon + label tag
└── time.ts                    // toMins, isOpenNow, todayLabel, todayHours
```

Replaces the current monolithic `components/StoreLocator.tsx` (existing file deleted; `app/store-locator/page.tsx` updated to import from new location).

### Map specifics

- Library: `react-leaflet` (latest compatible with React 19)
- Tiles: `https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`, subdomains `['a','b','c']`
- Attribution: `'© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors'`
- Default view: centered on KZN `[-29.83, 31.005]`, zoom 10 (fits all stores)
- Markers: `divIcon` with inline SVG, two states — base and selected. Base: 28px teal circle with white dot. Selected: 38px dark-blue circle with white pin glyph. Transition via CSS on hover.
- `flyTo` on selection, duration 800ms
- Popups: disabled in favor of the floating desktop pill + mobile bottom sheet

### Visual language (light theme translation)

- Sidebar surface: pure white `#ffffff`, border-right `1px solid #e5e7eb`
- Card hover: `#f9fafb`, 150ms ease-out
- Card active (selected): `#f0fbfc` (teal/5), left border `3px solid #009eb9`
- Shadow for floating pill / bottom sheet: `0 20px 50px -12px rgba(24, 67, 99, 0.25)` (dark-blue tinted shadow, more editorial than neutral gray)
- Open/closed badges: open = `bg-emerald-50 text-emerald-700 border-emerald-200`, closed = `bg-rose-50 text-rose-700 border-rose-200`
- Primary CTA: solid teal `#009eb9` background, white text, subtle shadow on hover
- Secondary CTA: `border border-neutral-200`, dark-blue text
- Typography: existing sparkport scale — `font-extrabold` dark-blue for store names, `text-neutral-500` for meta
- Service badges: light gray background, teal icon tint, dark-blue label text, small rounded-sm

### Animations (Framer Motion)

| Element | Motion |
|---|---|
| Card expand (sidebar) | `height: 0 → auto`, opacity, 300ms, `easeInOut` |
| Mobile bottom sheet | `y: 100% → 0`, 350ms, custom cubic-bezier `[0.32, 0, 0.32, 1]` |
| Scrim behind bottom sheet | fade 200ms |
| Floating selected pill (desktop) | `opacity + y: 8 → 0`, 200ms |
| Map marker select | scale via CSS transition on `divIcon`, 150ms |
| Sidebar scroll-into-view on marker click | smooth native `scrollIntoView({ behavior: 'smooth', block: 'nearest' })` |

### State behavior

- `selected: Store | null` — card expansion + map centering + mobile sheet open
- `searchQuery: string` — filters by store name, suburb, address, area
- `mobileTab: 'list' | 'map'` — mobile only, switching to `list` clears selection
- `openMap: Record<string, boolean>` — per-store open-now result, recomputed every 60s via `setInterval`
- `selected` is toggle: clicking the same card again collapses it

### Deep-link

Each expanded card has a `View full details` link to `/branches/{slug}` — the existing per-store page. Users wanting hours tables, directions text, or seo copy go there.

## What's left to the builder

- Exact Tailwind class strings (the visual language above fixes palette, spacing feel, and shadow intent — remaining micro-decisions like exact `px-5` vs `px-6` are implementation calls)
- Hover/focus state micro-timing (document says 150ms ease-out as default; specific overrides within that budget are fine)
- Whether to use a custom hook for `isOpenNow` or inline it in `StoreLocatorClient` (either fine)
- Keyboard accessibility details: cards must be focusable (`role="button"` or actual `<button>`), Enter/Space toggles, Escape closes bottom sheet — fine details left to builder
- Marker SVG exact dimensions and inner glyph (teal pin w/ white interior — builder picks the glyph shape)
- The "More locations coming soon" footer line that checkstar has — builder can keep, drop, or adapt
- Whether `react-leaflet` v5 or latest v4 is more stable with Next.js 16 — builder verifies before installing

## Explicit out-of-scope

- Replacing the placeholder `/images/branch-hero.jpg` with real per-store photos (future task, user-owned)
- Server-side rendering of the map (Leaflet is client-only)
- A proper filter UI (categories, services-filter, etc.) — free-text search only
- Anything on `/branches/[slug]` — unchanged
- Changes to checkout or FillYourScript pharmacy pickers — they continue to use `store.id` from `lib/stores.ts` and don't care about the new fields

## Risk register

| Risk | Mitigation |
|---|---|
| Leaflet markers show broken default images after bundling | Use `divIcon` with inline SVG — no default-icon dependency |
| OSM tile usage policy breach at high traffic | Monitor; if hit, swap to MapTiler free tier (one URL + one env var change) |
| Hours parsing produces wrong `isOpenNow` for store with unusual hours | Builder commits BOTH `hours` (string) and `structuredHours` (object) to the data file — user verifies by diff on PR |
| `framer-motion` adds ~45kb to bundle | Acceptable; it's used elsewhere in future tasks and the locator is a route-split chunk anyway |
| `react-leaflet` v5 incompatible with React 19 / Next 16 | Builder verifies on a throwaway page before committing; falls back to v4.2.1 if needed |
