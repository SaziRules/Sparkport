# Design Spec: Policy Heroes · Footer Branches · Branch Pages
**Date:** 2026-07-02  
**Status:** Approved  

---

## 1. Policy Page Hero Redesign

### Problem
All policy pages (`/terms-conditions`, `/privacy-policy`, `/shipping-policy`, `/regulated-medication`) render their hero inside `MainWrapper`, which constrains content to `max-w-385 px-6`. The heroes use `bg-[#184363]` — identical to the nav header — and appear visually merged with it because the header is full-bleed while the hero is inset.

### Solution: Full-bleed gradient hero (Option A)

**`MainWrapper` change:**  
Add policy and branch routes to the `isFullWidth` condition so they receive `max-w-full px-0`:
```
/terms-conditions, /privacy-policy, /shipping-policy, /regulated-medication, /branches
```

**Hero component per page:**  
Each policy page gets a shared visual treatment — a full-bleed diagonal gradient hero — implemented inline per page (no shared component needed; the pages are all different enough). 

Hero structure:
- Background: `bg-gradient-to-br from-[#184363] via-[#1a5a8a] to-[#009eb9]`
- Breadcrumb: `Home / Page Title` — small, white/60 opacity, `text-xs uppercase tracking-widest`
- H1: white, `text-4xl lg:text-5xl font-extrabold`
- Subtitle: one line, page-specific, white/70
- Last updated (T&C, Privacy only): `text-white/50 text-sm`
- Padding: `py-16 lg:py-20 px-6`
- Inner content constrained: `max-w-4xl mx-auto`

Page-specific subtitles:
- Terms & Conditions: "The rules governing your use of Sparkport Pharmacy's website and services"
- Privacy Policy: "How we collect, use, and protect your personal information under POPIA"
- Shipping Policy: "Delivery timeframes, collection options, and courier information"
- Regulated Medication: "What you need to know about S5 and S6 controlled substances"

Content sections below the hero remain unchanged (`max-w-4xl mx-auto px-6`).

---

## 2. Footer — 5th Column (Our Branches)

### Current layout
`grid-cols-12`: Newsletter `col-span-4` | Links `col-span-5` (2-col inner grid) | Contact `col-span-3`

### New layout
`grid-cols-12`: Newsletter `col-span-3` | Information `col-span-2` | Account `col-span-2` | Contact `col-span-2` | Our Branches `col-span-3`

The "Middle Columns" wrapper (currently `col-span-5` with inner 2-col grid) is dissolved — Information and Account become first-class columns. Contact shrinks from `col-span-3` to `col-span-2`. Our Branches takes `col-span-3`.

**Our Branches column:**
- Heading: `"Our Branches"` — same style as other column headings
- List all 8 branches in `stores.ts` order, each a `<Link>` to `/branches/[slug]`
- Link style: `text-neutral-300 hover:text-white transition-colors text-sm`
- Branch display name: short form (e.g. "Quality Street", "Musgrave", "Warner Beach", "Chatsworth", "Umlazi", "Pietermaritzburg", "Overport", "City Centre")

**Additional fix while in footer:**
- Replace `"PAYGATE"` badge text with `"PayFast"` in the bottom copyright bar

**Mobile:** All columns stack to single column (unchanged behaviour — `grid-cols-1` on mobile).

---

## 3. Branch Pages

### Routes
`app/branches/[slug]/page.tsx` — Next.js App Router, statically generated via `generateStaticParams`.

URL examples:
- `/branches/overport`
- `/branches/quality-street`
- `/branches/musgrave`
- `/branches/warner-beach`
- `/branches/chatsworth`
- `/branches/umlazi`
- `/branches/pietermaritzburg`
- `/branches/city-centre`

### Data layer — `lib/stores.ts` extension

Add two fields to the `Store` interface and each store object:
- `slug: string` — URL-safe identifier
- `area: string` — suburb/neighbourhood label for SEO copy

Add a `content` object per store with:
- `gettingHere: string` — 2–3 sentences about location/access
- `seoWriteUp: string` — ~180 words promotional copy, unique per branch

All branch page content lives in `lib/stores.ts`. No database queries needed.

### Page metadata (per branch)
```typescript
export async function generateMetadata({ params }) {
  const store = getStoreBySlug(params.slug)
  return {
    title: `${store.name} | Sparkport Pharmacy ${store.area}`,
    description: store.content.seoWriteUp.slice(0, 160),
    keywords: `Sparkport pharmacy, ${store.area} pharmacy, pharmacy near me, ${store.area}, KwaZulu-Natal pharmacy, prescription dispensing ${store.area}`,
  }
}
```

### Page layout

**Desktop (lg+):** `flex flex-row` container — two columns side by side:
- Left: `w-1/2` — normal block flow, scrolls with the page
- Right: `w-1/2 sticky top-0 h-screen` — map panel sticks to viewport while the left content scrolls past it; naturally exits sticky when the footer comes into view

Footer renders normally in the document flow below the flex row — no overlay conflict.

**Mobile:** Stacked. Content first, then map at `h-[60vh]`. No sticky behaviour.

**Header/footer visibility:** Standard — header and footer render as normal. The sticky right panel is at `z-0`; the header sits above it at `z-40`+.

### Left panel sections (top to bottom)

**1. Branch hero strip**
- Full-width within the left panel
- Background: `bg-[#184363]`
- Branch name: `text-3xl font-extrabold text-white`
- Full address: `text-white/70 text-sm`
- Area badge: teal pill (e.g. "Overport, Durban")
- "← All Branches" back link to `/store-locator`

**2. Hours**
- Day groups: Mon–Thu / Fri / Sat / Sun
- Each row: day label + time + live open/closed indicator
- Open indicator: green dot `animate-pulse` if current time falls within hours
- Hours parsed from the existing `hours` string in stores.ts

**3. Contact**
- Phone: click-to-call `href="tel:..."`, formatted with icon
- Email: mailto link with icon
- WhatsApp: `https://wa.me/27...` deep link (phone number sanitised to international format)
- Google Maps: `https://maps.google.com/?q=<address>` opens in new tab

**4. Getting Here**
- 2–3 sentences from `store.content.gettingHere`
- Light grey background card

**5. About This Branch** (SEO write-up)
- `store.content.seoWriteUp` rendered as prose
- ~180 words, unique per branch
- Covers: location, community, services (chronic medication management, acute prescriptions, OTC, dispensary, online ordering, delivery), why Sparkport

**6. CTA strip**
- Two buttons side by side: "Fill Your Script" (→ `/fill-script`, teal) and "Contact Us" (→ `/contact`, dark blue outline)

### Map

OpenStreetMap embed — same URL pattern as `StoreLocator`:
```
https://www.openstreetmap.org/export/embed.html?bbox=${lng-0.02},${lat-0.02},${lng+0.02},${lat+0.02}&layer=mapnik&marker=${lat},${lng}
```
`<iframe>` fills the entire right panel, `w-full h-full border-0`.

### Static generation
```typescript
export async function generateStaticParams() {
  return STORES.map(store => ({ slug: store.slug }))
}
```

### SEO write-ups (per branch — to be implemented in stores.ts)

**Quality Street (Jacobs):** Serves the industrial and residential community of Jacobs and surrounding South Durban Basin suburbs including Bluff, Merebank, and Wentworth. Compact, professional dispensary known for fast script turnaround.

**Musgrave:** Serves the cosmopolitan Berea ridge corridor — students, young professionals, and the established residential community of Musgrave and Glenwood. Walk-in friendly.

**Warner Beach:** Community pharmacy serving the coastal suburbs of Warner Beach, Winkelspruit, and Kingsburgh. Relaxed seaside setting with a full dispensary and wellness product range.

**Chatsworth:** Serves one of KZN's largest townships — Chatsworth, Montford, and Woodhurst. High-volume dispensary with extended Sunday trading.

**Umlazi:** Serves Umlazi township and surrounding areas from a convenient Ithala Centre location. Known for accessibility and community health focus.

**Pietermaritzburg:** Sparkport's inland anchor — serving Raisethorpe and the broader PMB metro. Extended weekend trading including Sundays.

**Overport:** Flagship location. Corner of Moses Kotane and Randles Road. Extended trading until 10PM seven days a week. Serves Overport, Sydenham, and surrounding Durban North inner-city suburbs.

**City Centre:** Heart of the Durban CBD. Corner of Yusuf Dadoo and Anton Lembede Streets. Early opening at 7:30AM serving the business district, commuters, and city-centre residents. Wholesale enquiries welcome.

*(Full ~180-word write-ups to be expanded during implementation.)*

### Footer branch links
`Footer.tsx` updated: "Our Branches" column links use short display names matching the branch name minus "Sparkport " prefix (e.g. "Overport", "City Centre").

### Store Locator compatibility
`StoreLocator.tsx` and `lib/stores.ts` share the same `STORES` array. Each store card in the locator can optionally add a "View branch page →" link using `store.slug`.

---

## Implementation Order

1. Extend `lib/stores.ts` with `slug`, `area`, and `content` fields
2. Update `MainWrapper` to add policy routes to full-width list
3. Redesign heroes on all 4 policy pages
4. Update `Footer.tsx` — new 5-column grid + PayFast fix + Our Branches column
5. Create `app/branches/[slug]/page.tsx` with static generation
6. Optionally: add "View branch page" links to `StoreLocator`
