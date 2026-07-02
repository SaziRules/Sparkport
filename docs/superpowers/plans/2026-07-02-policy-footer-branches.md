# Policy Heroes · Footer Branches · Branch Pages — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix policy page heroes merging with the header, add an "Our Branches" footer column, and create a static branch page per store with a sticky-map split layout.

**Architecture:** Single source of truth is `lib/stores.ts` — add `slug`, `area`, and `content` fields there. `MainWrapper` gets updated to pass full-bleed layout to policy + branch routes. Four policy pages get gradient hero replacements. Footer gets a 5-column restructure. Branch pages use Next.js static generation with a left-scroll / right-sticky-map layout.

**Tech Stack:** Next.js 14 App Router (Server Components, static generation), Tailwind CSS, TypeScript strict, OpenStreetMap embed iframe.

## Global Constraints

- Brand colors: `#009eb9` teal, `#184363` dark blue. No other primary colors.
- No comments in code unless the WHY is non-obvious.
- No `<main>` nested inside `<main>` — MainWrapper already renders `<main>`; page components must use `<div>` as root.
- Gradient pattern: `bg-gradient-to-br from-[#184363] via-[#1a5a8a] to-[#009eb9]` for all policy/branch heroes.
- Branch slugs are kebab-case, lowercase, matching URL paths in the spec.
- All branch content lives in `lib/stores.ts` — no API calls, no database queries.
- OpenStreetMap embed URL: `https://www.openstreetmap.org/export/embed.html?bbox=${lng-0.02},${lat-0.02},${lng+0.02},${lat+0.02}&layer=mapnik&marker=${lat},${lng}`

---

## File Map

| Action | File |
|--------|------|
| Modify | `lib/stores.ts` |
| Modify | `components/MainWrapper.tsx` |
| Modify | `app/terms-conditions/page.tsx` |
| Modify | `app/privacy-policy/page.tsx` |
| Modify | `app/shipping-policy/page.tsx` |
| Modify | `app/regulated-medication/page.tsx` |
| Modify | `components/Footer.tsx` |
| Create | `app/branches/[slug]/page.tsx` |
| Create | `app/branches/[slug]/OpenIndicator.tsx` |

---

### Task 1: Extend lib/stores.ts

**Files:**
- Modify: `lib/stores.ts`

**Interfaces:**
- Produces: `Store` interface with `slug`, `area`, `content.gettingHere`, `content.seoWriteUp`; `getStoreBySlug(slug: string): Store | undefined` helper; `STORES` array (unchanged order, same 8 entries)

- [ ] **Step 1: Replace lib/stores.ts with the extended version**

```typescript
export interface Store {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  hours: string;
  coordinates: { lat: number; lng: number };
  slug: string;
  area: string;
  content: {
    gettingHere: string;
    seoWriteUp: string;
  };
}

export const STORES: Store[] = [
  {
    id: '1',
    name: 'Sparkport Quality Street',
    address: '315 Quality Street, Jacobs, Durban, 4052',
    phone: '(031) 461-3760',
    email: 'scriptsqs@sparkport.co.za',
    hours: 'Mon-Thu: 9AM-5:30PM • Fri: 9AM-5:30PM • Sat: 9AM-2PM • Sun: Closed',
    coordinates: { lat: -29.8854, lng: 30.9838 },
    slug: 'quality-street',
    area: 'Jacobs, Durban',
    content: {
      gettingHere:
        'Located on Quality Street in Jacobs, directly accessible from the M4 South Coast Road. Street parking is available directly outside the pharmacy. The branch is well signposted and situated near several industrial and residential estates in the South Durban Basin.',
      seoWriteUp:
        'Sparkport Quality Street is a full-service community pharmacy serving the industrial and residential areas of Jacobs, Bluff, Merebank, and Wentworth in the South Durban Basin. Our compact, professionally staffed dispensary is known for fast script turnaround and knowledgeable pharmacist consultations.\n\nWe dispense both acute and chronic prescriptions, stock a comprehensive range of over-the-counter medicines, vitamins, and health supplements, and offer in-store pharmacist advice. Our team is experienced in handling Schedule 5 and Schedule 6 medications in full compliance with SAHPRA regulations and the Medicines Act.\n\nOnline prescription submissions are supported — simply upload your script via our website and select Quality Street as your preferred collection branch. We will contact you when your medication is ready for collection.\n\nWhether you live in Jacobs, work in the nearby industrial corridor, or are passing through the South Durban Basin, Sparkport Quality Street offers the professional pharmacy service you can rely on. We are committed to accessible, high-quality pharmaceutical care for every member of our community.',
    },
  },
  {
    id: '2',
    name: 'Sparkport Musgrave',
    address: '77 Musgrave Rd, Musgrave, Berea, 4001',
    phone: '(031) 201-8121',
    email: 'clinic.musgrave@sparkport.co.za',
    hours: 'Mon-Thu: 8AM-6PM • Fri: 8AM-6PM • Sat: 8AM-2PM • Sun: Closed',
    coordinates: { lat: -29.8389, lng: 30.9987 },
    slug: 'musgrave',
    area: 'Berea, Durban',
    content: {
      gettingHere:
        'Situated on Musgrave Road on the Berea ridge, easily accessible from the M13 and Florida Road interchange. Metered street parking and nearby paid parking facilities are available. The branch is within walking distance of Musgrave Centre and several medical suites.',
      seoWriteUp:
        'Sparkport Musgrave serves the cosmopolitan Berea ridge corridor — students, young professionals, and the established residential community of Musgrave, Glenwood, and Morningside. Our walk-in friendly dispensary is staffed by experienced pharmacists who take time to counsel patients on their medication.\n\nWe provide full dispensary services for acute and chronic prescriptions, a broad OTC product range, and specialist advice on chronic disease management. Our pharmacy is convenient to nearby medical practices and specialist consulting rooms, making us a natural choice for patients collecting prescriptions immediately after a consultation.\n\nChromic medication management is a specialty at this branch — we work with patients to ensure repeat prescriptions are refilled on time and that dosing schedules are maintained. Online ordering with in-store collection at Musgrave is available through the Sparkport website.\n\nSparkport Musgrave is dedicated to providing professional, personable pharmaceutical care to one of Durban\'s most vibrant and diverse communities. Our team understands the needs of both long-term residents and the transient student population, offering guidance on a wide range of health and wellness products.',
    },
  },
  {
    id: '3',
    name: 'Sparkport Warner Beach',
    address: '125 Kingsway St, Warner Beach, Kingsburgh, 4126',
    phone: '(031) 916-6550',
    email: 'warnerbeach@sparkport.co.za',
    hours: 'Mon-Thu: 8:30AM-5:30PM • Fri: 8:30AM-5:30PM • Sat: 9AM-2PM • Sun: Closed',
    coordinates: { lat: -30.0850, lng: 30.8567 },
    slug: 'warner-beach',
    area: 'Kingsburgh, KZN South Coast',
    content: {
      gettingHere:
        'Located on Kingsway Street in Warner Beach, conveniently placed along the main road serving the coastal suburbs south of Durban. Ample parking is available outside the branch. Easily reached from the N2 South via the Warner Beach off-ramp.',
      seoWriteUp:
        'Sparkport Warner Beach is a community pharmacy serving the coastal suburbs of Warner Beach, Winkelspruit, Illovo Beach, and the wider Kingsburgh corridor along the KwaZulu-Natal South Coast. Our relaxed, seaside setting belies a full-service dispensary equipped to handle the full spectrum of pharmacy needs.\n\nWe dispense both acute and chronic prescriptions and carry a comprehensive wellness product range including vitamins, supplements, skincare, and baby products. Our pharmacists are available for consultation during all trading hours and provide guidance on chronic disease management, including hypertension, diabetes, and respiratory conditions.\n\nScript uploads via the Sparkport website are fully supported — submit your prescription online and select Warner Beach as your collection branch. Our team will process your script and notify you when it is ready.\n\nSparkport Warner Beach is proud to serve a community that values quality healthcare in a convenient coastal location. Whether you are a long-time resident or a visitor to the South Coast, we are here to ensure your pharmacy needs are met with professionalism and care.',
    },
  },
  {
    id: '4',
    name: 'Sparkport Chatsworth',
    address: 'Shop 3, Ayesha Centre, 50 Tranquil St, Chatsworth, 4092',
    phone: '(031) 401-0010',
    email: 'chatsdispensary@sparkport.co.za',
    hours: 'Mon-Sun: 9AM-8PM • Fri: 9AM-6PM',
    coordinates: { lat: -29.9197, lng: 30.8970 },
    slug: 'chatsworth',
    area: 'Chatsworth, Durban',
    content: {
      gettingHere:
        'Located in the Ayesha Centre on Tranquil Street in Chatsworth. The centre offers ample free parking. Accessible from the M7 Chatsworth Road and multiple public transport routes serving the township.',
      seoWriteUp:
        'Sparkport Chatsworth serves one of KwaZulu-Natal\'s largest and most vibrant townships, providing full dispensary services to the communities of Chatsworth, Montford, Woodhurst, and surrounding suburbs. Our high-volume dispensary operates seven days a week with extended trading hours, including Sundays, to ensure medication is always accessible when you need it.\n\nOur experienced pharmacy team handles both acute and chronic prescriptions, with particular expertise in managing long-term chronic conditions common in the Chatsworth community, including hypertension, diabetes, asthma, and HIV/ARV therapy. We carry a full range of OTC medicines, health products, and wellness supplements.\n\nOnline prescription submission is available via the Sparkport website. Simply upload your script, choose Chatsworth as your preferred branch, and we will prepare your medication for collection. Our team will contact you when it is ready.\n\nSparkport Chatsworth is deeply embedded in the community it serves. We understand the importance of accessible, reliable pharmaceutical care for every family, and we are committed to delivering a professional, compassionate service every day of the week.',
    },
  },
  {
    id: '5',
    name: 'Sparkport Umlazi',
    address: 'Shop 4 Ithala Centre, Existing Main Road, Umlazi, 4031',
    phone: '(031) 906-8118',
    email: 'umlazidisp@sparkport.co.za',
    hours: 'Mon-Thu: 9AM-6PM • Fri: 9AM-5PM • Sat: 9AM-2PM • Sun: Closed',
    coordinates: { lat: -29.9589, lng: 30.8841 },
    slug: 'umlazi',
    area: 'Umlazi, Durban',
    content: {
      gettingHere:
        'Situated in the Ithala Centre on Existing Main Road in Umlazi. The centre has parking available for customers. The branch is accessible via multiple taxi routes and public transport connections serving the township.',
      seoWriteUp:
        'Sparkport Umlazi is a community-focused pharmacy serving Umlazi township and the surrounding areas from our convenient Ithala Centre location. We are known for our accessibility, commitment to community health, and the warm, professional service our team delivers every day.\n\nOur dispensary handles acute and chronic prescriptions, ARV and HIV management, chronic disease monitoring, and a full range of over-the-counter medicines and health products. We work closely with the local community to ensure that medication is dispensed safely, on time, and with proper counselling.\n\nScript submissions via the Sparkport website are supported — upload your prescription online, select Umlazi as your preferred branch, and our team will prepare and notify you when your medication is ready for collection.\n\nAt Sparkport Umlazi, we believe every member of our community deserves access to quality pharmaceutical care. Our team speaks the languages of the community and is committed to providing clear, understandable health information to every patient who walks through our doors.',
    },
  },
  {
    id: '6',
    name: 'Sparkport Pietermaritzburg',
    address: '553 Dr Chota Motala Rd, Raisethorpe, PMB, 3201',
    phone: '(033) 397-0099',
    email: 'dispensary@sparkport.net',
    hours: 'Mon-Sat: 9AM-8PM • Sun: 10AM-6PM',
    coordinates: { lat: -29.6186, lng: 30.3802 },
    slug: 'pietermaritzburg',
    area: 'Pietermaritzburg, KZN',
    content: {
      gettingHere:
        'Located on Dr Chota Motala Road in Raisethorpe, Pietermaritzburg. Street and off-road parking is available in the vicinity. The branch is centrally accessible within the PMB metro, close to major arterial routes serving Raisethorpe and the broader city.',
      seoWriteUp:
        'Sparkport Pietermaritzburg is our inland anchor branch, serving Raisethorpe and the broader Pietermaritzburg metro with extended trading hours seven days a week. As the Msunduzi municipality\'s dedicated Sparkport branch, we provide comprehensive pharmaceutical services to the communities of Raisethorpe, Northdale, and the wider PMB area.\n\nOur experienced team dispenses both acute and chronic prescriptions, manages long-term chronic conditions including diabetes, hypertension, and respiratory disease, and stocks a wide range of OTC medicines, vitamins, and wellness products. Extended Saturday trading until 8PM and Sunday hours until 6PM make us one of the most accessible pharmacies in the city.\n\nScript submissions via the Sparkport website are fully supported. Upload your prescription, select Pietermaritzburg as your preferred collection branch, and our team will notify you when it is ready.\n\nSparkport Pietermaritzburg is committed to raising the standard of pharmaceutical care in the inland KZN region. Our team combines professional expertise with genuine community care to ensure every patient receives the attention and guidance they deserve.',
    },
  },
  {
    id: '7',
    name: 'Sparkport Overport',
    address: 'Corner Moses Kotane & Randles Road, Durban, 4091',
    phone: '(031) 207-1011',
    email: 'dispensary@sparkport.co.za',
    hours: 'Mon-Thu: 8AM-10PM • Fri: 8AM-10PM • Sat: 8AM-10PM • Sun: 9AM-10PM',
    coordinates: { lat: -29.8765, lng: 31.0131 },
    slug: 'overport',
    area: 'Overport, Durban',
    content: {
      gettingHere:
        'The flagship branch is situated on the corner of Moses Kotane Avenue and Randles Road in Overport, easily accessible from the M13. On-street parking is available on both roads. The branch is served by multiple taxi routes and is within walking distance of the Overport City shopping centre.',
      seoWriteUp:
        'Sparkport Overport is our flagship location — the corner of Moses Kotane Avenue and Randles Road in Overport, Durban. We trade seven days a week until 10PM, making us one of the longest-trading pharmacies in KwaZulu-Natal and the go-to option when you need medication late in the evening.\n\nOur full-service dispensary handles everything from everyday acute prescriptions and chronic medication management to Schedule 5 and Schedule 6 controlled substances, all dispensed in strict compliance with SAHPRA and PCSA regulations. We stock an extensive range of OTC medicines, health supplements, skincare, and baby products.\n\nOnline prescription submission is available — upload your script via the Sparkport website, select Overport as your collection branch, and our pharmacist team will process and notify you when it is ready. Given our extended hours, evening collection after a busy day is always possible.\n\nSparkport Overport has been serving the communities of Overport, Sydenham, Essenwood, and surrounding Durban North inner-city suburbs for decades. We are proud of our role as a health anchor in a dynamic, multicultural neighbourhood.',
    },
  },
  {
    id: '8',
    name: 'Sparkport City Centre',
    address: 'Corner Yusuf Dadoo & Anton Lembede St, Durban, 4001',
    phone: '(031) 304-9767',
    email: 'wholesale@sparkport.co.za',
    hours: 'Mon-Thu: 7:30AM-7:30PM • Fri: 7:30AM-7:30PM • Sat: 7:30AM-7PM • Sun: 9AM-4PM',
    coordinates: { lat: -29.8587, lng: 31.0295 },
    slug: 'city-centre',
    area: 'Durban CBD',
    content: {
      gettingHere:
        'Located on the corner of Yusuf Dadoo Street (Grey Street) and Anton Lembede Street in the heart of the Durban CBD. Accessible via the city\'s major arterial routes and within walking distance of the Durban Station taxi rank and bus terminal. Paid parking is available in several nearby facilities.',
      seoWriteUp:
        'Sparkport City Centre is located at the heart of the Durban CBD, on the corner of Yusuf Dadoo Street (Grey Street) and Anton Lembede Street. We open at 7:30AM Monday to Saturday — earlier than most city pharmacies — to serve commuters, business district workers, and early-morning patients before their day begins.\n\nOur full-service dispensary handles acute and chronic prescriptions, with particular experience in serving the diverse and high-volume patient base of the Durban CBD. We stock a comprehensive range of OTC medicines, health products, vitamins, and wholesale enquiries are welcome.\n\nOnline prescription submission is supported — upload your script via the Sparkport website and select City Centre as your preferred collection branch. Given our early opening hours and central location, pre-work collection is a convenient option for many of our patients.\n\nSparkport City Centre has served the commercial heart of Durban for many years. Our central location makes us accessible to residents, workers, and visitors across the city, and our experienced team is equipped to handle high volumes without compromising on the quality of care or counsel provided to each patient.',
    },
  },
];

export function getStoreBySlug(slug: string): Store | undefined {
  return STORES.find((s) => s.slug === slug);
}
```

- [ ] **Step 2: Verify TypeScript compiles cleanly**

Run: `npx tsc --noEmit`
Expected: no errors related to `lib/stores.ts`.

- [ ] **Step 3: Commit**

```bash
git add lib/stores.ts
git commit -m "feat: extend stores.ts with slug, area, content, and getStoreBySlug"
```

---

### Task 2: MainWrapper Update + Policy Hero Redesigns

**Files:**
- Modify: `components/MainWrapper.tsx`
- Modify: `app/terms-conditions/page.tsx`
- Modify: `app/privacy-policy/page.tsx`
- Modify: `app/shipping-policy/page.tsx`
- Modify: `app/regulated-medication/page.tsx`

**Interfaces:**
- Consumes: nothing new
- Produces: all policy routes + `/branches` receive `max-w-full px-0` from MainWrapper; all 4 policy pages have gradient heroes

- [ ] **Step 1: Update MainWrapper.tsx**

Replace the `isFullWidth` line:

```typescript
'use client';

import { usePathname } from 'next/navigation';

export default function MainWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isFullWidth =
    pathname?.startsWith('/account') ||
    pathname?.startsWith('/fill-script') ||
    pathname?.startsWith('/manager') ||
    pathname?.startsWith('/terms-conditions') ||
    pathname?.startsWith('/privacy-policy') ||
    pathname?.startsWith('/shipping-policy') ||
    pathname?.startsWith('/regulated-medication') ||
    pathname?.startsWith('/branches');

  return (
    <main className={isFullWidth ? 'mx-auto max-w-full px-0' : 'mx-auto max-w-385 px-6'}>
      {children}
    </main>
  );
}
```

- [ ] **Step 2: Redesign terms-conditions hero**

The outer `<main>` must become `<div>` to avoid nesting inside MainWrapper's `<main>`. Replace only the opening tag and the hero div. The content below the hero is unchanged.

In `app/terms-conditions/page.tsx`, change:
- `<main className="min-h-screen bg-white">` → `<div className="bg-white min-h-screen">`
- `</main>` (closing) → `</div>`
- Replace the hero div:

```tsx
{/* Hero */}
<div className="bg-gradient-to-br from-[#184363] via-[#1a5a8a] to-[#009eb9] py-16 lg:py-20 px-6">
  <div className="max-w-4xl mx-auto">
    <p className="text-white/60 text-xs uppercase tracking-widest mb-3">
      Home / Terms &amp; Conditions
    </p>
    <h1 className="text-4xl lg:text-5xl font-extrabold text-white mb-3">
      Terms &amp; Conditions
    </h1>
    <p className="text-white/70">
      The rules governing your use of Sparkport Pharmacy&apos;s website and services
    </p>
    <p className="text-white/50 text-sm mt-3">Last updated: 2 July 2026 · Version 2.0</p>
  </div>
</div>
```

- [ ] **Step 3: Redesign privacy-policy hero**

In `app/privacy-policy/page.tsx`, replace the hero div:

```tsx
{/* Hero */}
<div className="bg-gradient-to-br from-[#184363] via-[#1a5a8a] to-[#009eb9] py-16 lg:py-20 px-6">
  <div className="max-w-4xl mx-auto">
    <p className="text-white/60 text-xs uppercase tracking-widest mb-3">
      Home / Privacy Policy
    </p>
    <h1 className="text-4xl lg:text-5xl font-extrabold text-white mb-3">
      Privacy Policy
    </h1>
    <p className="text-white/70">
      How we collect, use, and protect your personal information under POPIA
    </p>
    <p className="text-white/50 text-sm mt-3">Last updated: 28 June 2026</p>
  </div>
</div>
```

- [ ] **Step 4: Redesign shipping-policy hero**

The outer `<main>` must become `<div>`. In `app/shipping-policy/page.tsx`:
- `<main className="min-h-screen bg-white">` → `<div className="bg-white min-h-screen">`
- `</main>` → `</div>`
- Replace the hero div:

```tsx
{/* Hero */}
<div className="bg-gradient-to-br from-[#184363] via-[#1a5a8a] to-[#009eb9] py-16 lg:py-20 px-6">
  <div className="max-w-4xl mx-auto">
    <p className="text-white/60 text-xs uppercase tracking-widest mb-3">
      Home / Shipping Policy
    </p>
    <h1 className="text-4xl lg:text-5xl font-extrabold text-white mb-3">
      Shipping &amp; Delivery Policy
    </h1>
    <p className="text-white/70">
      Delivery timeframes, collection options, and courier information
    </p>
    <p className="text-white/50 text-sm mt-3">Last updated: 28 June 2026</p>
  </div>
</div>
```

- [ ] **Step 5: Redesign regulated-medication hero**

In `app/regulated-medication/page.tsx`, the page currently has an inline flat-blue hero div (not extracted). Replace:

```tsx
{/* Current hero — replace this block */}
<div className="bg-[#184363] py-16 px-6">
  <div className="max-w-4xl mx-auto">
    ...
  </div>
</div>
```

With:

```tsx
{/* Hero */}
<div className="bg-gradient-to-br from-[#184363] via-[#1a5a8a] to-[#009eb9] py-16 lg:py-20 px-6">
  <div className="max-w-4xl mx-auto">
    <p className="text-white/60 text-xs uppercase tracking-widest mb-3">
      Home / Regulated Medication
    </p>
    <h1 className="text-4xl lg:text-5xl font-extrabold text-white mb-3">
      Understanding Regulated Medications
    </h1>
    <p className="text-white/70">
      What you need to know about S5 and S6 controlled substances
    </p>
  </div>
</div>
```

- [ ] **Step 6: Verify in dev server**

Run: `npm run dev`
Visit: `/terms-conditions`, `/privacy-policy`, `/shipping-policy`, `/regulated-medication`
Expected: Hero spans full browser width with a diagonal teal gradient. No visual merge with the dark-blue header. Breadcrumb visible in white/60 above the H1.

- [ ] **Step 7: Commit**

```bash
git add components/MainWrapper.tsx app/terms-conditions/page.tsx app/privacy-policy/page.tsx app/shipping-policy/page.tsx app/regulated-medication/page.tsx
git commit -m "feat: full-bleed gradient heroes on policy pages; extend MainWrapper full-width routes"
```

---

### Task 3: Footer Restructure

**Files:**
- Modify: `components/Footer.tsx`

**Interfaces:**
- Consumes: `STORES` from `lib/stores.ts` (slug + name fields)
- Produces: 5-column footer grid, Our Branches column, PayFast badge

- [ ] **Step 1: Import STORES in Footer.tsx**

Add at the top of `components/Footer.tsx` (after existing imports):

```typescript
import { STORES } from '@/lib/stores';
```

- [ ] **Step 2: Restructure the grid and add Our Branches column**

Replace the entire grid `<div>` (from `<div className="grid grid-cols-1 lg:grid-cols-12 ...">` to its closing `</div>`) with:

```tsx
<div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

  {/* Newsletter — col-span-3 */}
  <div className="lg:col-span-3">
    <Image
      src="https://sparkport.co.za/wp-content/uploads/SP-Logo-01.png"
      alt="Sparkport"
      width={160}
      height={56}
      className="h-14 w-auto mb-6"
    />
    <p className="text-neutral-300! mb-6">
      Stay tuned for latest updates and new features
    </p>

    {subscribed ? (
      <div className="mb-4 flex items-center gap-2 text-sm text-emerald-400 font-medium">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        You&apos;re subscribed — thanks!
      </div>
    ) : (
      <form onSubmit={handleSubscribe} className="mb-4">
        <div className="flex">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            className="flex-1 px-4 py-2.5 bg-white text-neutral-900 placeholder:text-neutral-500 focus:outline-none rounded-l-lg"
            required
          />
          <button
            type="submit"
            disabled={!acceptedTerms || subLoading}
            className="px-6 py-2.5 bg-[#00bcd4] text-white font-medium rounded-r-lg hover:bg-[#00acc1] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
            {subLoading ? '…' : 'Subscribe'}
          </button>
        </div>
        {subError && (
          <p className="mt-1.5 text-xs text-red-400">{subError}</p>
        )}
      </form>
    )}

    <label className="flex items-start gap-2 cursor-pointer">
      <input
        type="checkbox"
        checked={acceptedTerms}
        onChange={(e) => setAcceptedTerms(e.target.checked)}
        className="w-4 h-4 mt-0.5 rounded border-neutral-500 bg-transparent"
      />
      <span className="text-sm text-neutral-400">
        I accept terms and conditions &amp; privacy policy
      </span>
    </label>
  </div>

  {/* Information — col-span-2 */}
  <div className="lg:col-span-2">
    <h3 className="text-white font-semibold mb-4">Information</h3>
    <ul className="space-y-2.5">
      <li>
        <Link href="/health-care-services" className="text-neutral-300 hover:text-white transition-colors text-sm">
          Health Care Services
        </Link>
      </li>
      <li>
        <Link href="/shipping-policy" className="text-neutral-300 hover:text-white transition-colors text-sm">
          Shipping Policy
        </Link>
      </li>
      <li>
        <Link href="/privacy-policy" className="text-neutral-300 hover:text-white transition-colors text-sm">
          Privacy Policy
        </Link>
      </li>
      <li>
        <Link href="/store-locator" className="text-neutral-300 hover:text-white transition-colors text-sm">
          Store Locator
        </Link>
      </li>
      <li>
        <Link href="/terms-conditions" className="text-neutral-300 hover:text-white transition-colors text-sm">
          Terms &amp; Conditions
        </Link>
      </li>
    </ul>
  </div>

  {/* Account — col-span-2 */}
  <div className="lg:col-span-2">
    <h3 className="text-white font-semibold mb-4">Account details</h3>
    <ul className="space-y-2.5">
      <li>
        <Link href="/account/orders" className="text-neutral-300 hover:text-white transition-colors text-sm">
          Orders
        </Link>
      </li>
      <li>
        <Link href="/terms-conditions#returns" className="text-neutral-300 hover:text-white transition-colors text-sm">
          Returns
        </Link>
      </li>
      <li>
        <Link href="/auth/forgot-password" className="text-neutral-300 hover:text-white transition-colors text-sm">
          Lost password
        </Link>
      </li>
    </ul>
  </div>

  {/* Contact — col-span-2 */}
  <div className="lg:col-span-2">
    <h3 className="text-white font-semibold mb-4">About / Contacts</h3>
    <div className="space-y-3 mb-6">
      <div className="flex items-start gap-3">
        <svg className="w-5 h-5 text-white shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <p className="text-neutral-300! text-sm">
          382 Randles Rd, Overport, Durban, 4091.
        </p>
      </div>
      <div className="flex items-center gap-3">
        <svg className="w-5 h-5 text-white shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        <a href="mailto:online@sparkport.co.za" className="text-neutral-300 hover:text-white transition-colors text-sm">
          online@sparkport.co.za
        </a>
      </div>
    </div>
    <div className="flex items-center gap-3">
      <a
        href="https://facebook.com/sparkport"
        target="_blank"
        rel="noopener noreferrer"
        className="w-10 h-10 bg-[#00bcd4] rounded flex items-center justify-center hover:bg-[#00acc1] transition-colors"
        aria-label="Facebook"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      </a>
      <a
        href="https://instagram.com/sparkport"
        target="_blank"
        rel="noopener noreferrer"
        className="w-10 h-10 bg-[#00bcd4] rounded flex items-center justify-center hover:bg-[#00acc1] transition-colors"
        aria-label="Instagram"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      </a>
    </div>
  </div>

  {/* Our Branches — col-span-3 */}
  <div className="lg:col-span-3">
    <h3 className="text-white font-semibold mb-4">Our Branches</h3>
    <ul className="space-y-2.5">
      {STORES.map((store) => (
        <li key={store.slug}>
          <Link
            href={`/branches/${store.slug}`}
            className="text-neutral-300 hover:text-white transition-colors text-sm"
          >
            {store.name.replace('Sparkport ', '')}
          </Link>
        </li>
      ))}
    </ul>
  </div>

</div>
```

- [ ] **Step 3: Fix PAYGATE → PayFast in copyright bar**

In the bottom copyright bar, find:
```tsx
<div className="px-2 py-1 bg-white text-black text-xs font-semibold">
  PAYGATE
</div>
```

Replace with:
```tsx
<div className="px-2 py-1 bg-white text-black text-xs font-semibold">
  PayFast
</div>
```

- [ ] **Step 4: Verify in dev server**

Run: `npm run dev`
Visit the home page and scroll to the footer.
Expected: 5 columns on desktop — Newsletter | Information | Account details | About/Contacts | Our Branches. All 8 branch names listed, each linking to `/branches/[slug]`. PayFast badge in copyright bar. Mobile: all columns stack.

- [ ] **Step 5: Commit**

```bash
git add components/Footer.tsx
git commit -m "feat: footer 5-column layout with Our Branches column; fix PayFast badge"
```

---

### Task 4: Branch Pages

**Files:**
- Create: `app/branches/[slug]/OpenIndicator.tsx`
- Create: `app/branches/[slug]/page.tsx`

**Interfaces:**
- Consumes: `Store`, `STORES`, `getStoreBySlug` from `lib/stores.ts`
- Produces: Static pages at `/branches/[slug]` for all 8 slugs

- [ ] **Step 1: Create the OpenIndicator client component**

Create `app/branches/[slug]/OpenIndicator.tsx`:

```tsx
'use client';

import { useEffect, useState } from 'react';

interface Props {
  hours: string;
}

function isOpenNow(hours: string): boolean {
  const now = new Date();
  const day = now.getDay();
  const hour = now.getHours();
  const minute = now.getMinutes();
  const currentMinutes = hour * 60 + minute;

  const lower = hours.toLowerCase();

  let openStr: string | null = null;
  let closeStr: string | null = null;

  if (day === 0) {
    const sunMatch = lower.match(/sun[^:]*:\s*([^\s•]+)\s*[-–]\s*([^\s•]+)/);
    if (!sunMatch) return false;
    openStr = sunMatch[1];
    closeStr = sunMatch[2];
  } else if (day === 6) {
    const satMatch = lower.match(/sat[^:]*:\s*([^\s•]+)\s*[-–]\s*([^\s•]+)/);
    if (!satMatch) return false;
    openStr = satMatch[1];
    closeStr = satMatch[2];
  } else if (day === 5) {
    const friMatch = lower.match(/fri[^:]*:\s*([^\s•]+)\s*[-–]\s*([^\s•]+)/);
    if (!friMatch) return false;
    openStr = friMatch[1];
    closeStr = friMatch[2];
  } else {
    const monMatch = lower.match(/mon[^:]*:\s*([^\s•]+)\s*[-–]\s*([^\s•]+)/);
    if (!monMatch) return false;
    openStr = monMatch[1];
    closeStr = monMatch[2];
  }

  function parseTime(t: string): number {
    const clean = t.toLowerCase().replace(/\s/g, '');
    const pm = clean.includes('pm');
    const am = clean.includes('am');
    const digits = clean.replace(/[^0-9:]/g, '');
    const [hStr, mStr] = digits.split(':');
    let h = parseInt(hStr, 10);
    const m = mStr ? parseInt(mStr, 10) : 0;
    if (pm && h !== 12) h += 12;
    if (am && h === 12) h = 0;
    return h * 60 + m;
  }

  const open = parseTime(openStr);
  const close = parseTime(closeStr);
  return currentMinutes >= open && currentMinutes < close;
}

export default function OpenIndicator({ hours }: Props) {
  const [open, setOpen] = useState<boolean | null>(null);

  useEffect(() => {
    setOpen(isOpenNow(hours));
    const id = setInterval(() => setOpen(isOpenNow(hours)), 60_000);
    return () => clearInterval(id);
  }, [hours]);

  if (open === null) return null;

  return open ? (
    <span className="inline-flex items-center gap-1.5 text-emerald-400 text-sm font-medium">
      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
      Open Now
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 text-neutral-400 text-sm font-medium">
      <span className="w-2 h-2 rounded-full bg-neutral-500" />
      Closed
    </span>
  );
}
```

- [ ] **Step 2: Create the branch page**

Create `app/branches/[slug]/page.tsx`:

```tsx
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { STORES, getStoreBySlug } from '@/lib/stores';
import OpenIndicator from './OpenIndicator';

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  return STORES.map((store) => ({ slug: store.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const store = getStoreBySlug(params.slug);
  if (!store) return {};
  return {
    title: `${store.name} | Sparkport Pharmacy ${store.area}`,
    description: store.content.seoWriteUp.slice(0, 160),
    keywords: `Sparkport pharmacy, ${store.area} pharmacy, pharmacy near me, ${store.area}, KwaZulu-Natal pharmacy, prescription dispensing ${store.area}`,
  };
}

function parseHourRows(hours: string): { label: string; time: string }[] {
  return hours.split('•').map((segment) => {
    const trimmed = segment.trim();
    const colonIdx = trimmed.indexOf(':');
    if (colonIdx === -1) return { label: trimmed, time: '' };
    return {
      label: trimmed.slice(0, colonIdx).trim(),
      time: trimmed.slice(colonIdx + 1).trim(),
    };
  });
}

export default function BranchPage({ params }: Props) {
  const store = getStoreBySlug(params.slug);
  if (!store) notFound();

  const { lat, lng } = store.coordinates;
  const mapSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.02},${lat - 0.02},${lng + 0.02},${lat + 0.02}&layer=mapnik&marker=${lat},${lng}`;
  const mapsUrl = `https://maps.google.com/?q=${encodeURIComponent(store.address)}`;
  const waPhone = store.phone.replace(/\D/g, '').replace(/^0/, '27');
  const hourRows = parseHourRows(store.hours);
  const shortName = store.name.replace('Sparkport ', '');

  return (
    <div className="bg-white min-h-screen">
      {/* Desktop: flex row. Mobile: stacked. */}
      <div className="flex flex-col lg:flex-row">

        {/* Left panel — scrollable content */}
        <div className="w-full lg:w-1/2">

          {/* Branch hero strip */}
          <div className="bg-[#184363] px-6 py-10">
            <Link
              href="/store-locator"
              className="inline-flex items-center gap-1.5 text-white/60 hover:text-white text-sm mb-6 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              All Branches
            </Link>
            <h1 className="text-3xl font-extrabold text-white mb-1">{store.name}</h1>
            <p className="text-white/70 text-sm mb-3">{store.address}</p>
            <span className="inline-block bg-[#009eb9] text-white text-xs font-semibold px-3 py-1 rounded-full">
              {store.area}
            </span>
          </div>

          <div className="px-6 py-8 space-y-8">

            {/* Hours */}
            <section>
              <h2 className="text-lg font-bold text-[#184363] mb-4">Trading Hours</h2>
              <div className="bg-neutral-50 rounded-2xl border border-neutral-200 divide-y divide-neutral-100">
                {hourRows.map((row, i) => (
                  <div key={i} className="flex items-center justify-between px-5 py-3">
                    <span className="text-neutral-700 text-sm font-medium">{row.label}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-neutral-600 text-sm">{row.time || 'Closed'}</span>
                      {i === 0 && <OpenIndicator hours={store.hours} />}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Contact */}
            <section>
              <h2 className="text-lg font-bold text-[#184363] mb-4">Contact</h2>
              <div className="space-y-3">
                <a
                  href={`tel:${store.phone.replace(/\s/g, '')}`}
                  className="flex items-center gap-3 text-neutral-700 hover:text-[#009eb9] transition-colors"
                >
                  <svg className="w-5 h-5 text-[#009eb9] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span className="text-sm">{store.phone}</span>
                </a>
                <a
                  href={`mailto:${store.email}`}
                  className="flex items-center gap-3 text-neutral-700 hover:text-[#009eb9] transition-colors"
                >
                  <svg className="w-5 h-5 text-[#009eb9] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm">{store.email}</span>
                </a>
                <a
                  href={`https://wa.me/${waPhone}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-neutral-700 hover:text-[#009eb9] transition-colors"
                >
                  <svg className="w-5 h-5 text-[#009eb9] shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  <span className="text-sm">WhatsApp</span>
                </a>
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-neutral-700 hover:text-[#009eb9] transition-colors"
                >
                  <svg className="w-5 h-5 text-[#009eb9] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                  <span className="text-sm">Get Directions</span>
                </a>
              </div>
            </section>

            {/* Getting Here */}
            <section>
              <h2 className="text-lg font-bold text-[#184363] mb-3">Getting Here</h2>
              <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-5">
                <p className="text-neutral-600 text-sm leading-relaxed">{store.content.gettingHere}</p>
              </div>
            </section>

            {/* Mobile map */}
            <div className="block lg:hidden rounded-2xl overflow-hidden border border-neutral-200">
              <iframe
                src={mapSrc}
                title={`Map of ${store.name}`}
                className="w-full border-0"
                style={{ height: '60vh' }}
                loading="lazy"
              />
            </div>

            {/* About This Branch */}
            <section>
              <h2 className="text-lg font-bold text-[#184363] mb-3">About {shortName}</h2>
              <div className="prose prose-sm prose-neutral max-w-none">
                {store.content.seoWriteUp.split('\n\n').map((para, i) => (
                  <p key={i} className="text-neutral-600 leading-relaxed mb-4">{para}</p>
                ))}
              </div>
            </section>

            {/* CTA strip */}
            <div className="flex flex-col sm:flex-row gap-3 pb-4">
              <Link
                href="/fill-script"
                className="flex-1 text-center px-6 py-3 bg-[#009eb9] text-white font-bold rounded-xl hover:bg-[#007fa0] transition-colors text-sm"
              >
                Fill Your Script
              </Link>
              <Link
                href="/contact"
                className="flex-1 text-center px-6 py-3 bg-transparent text-[#184363] border-2 border-[#184363] font-semibold rounded-xl hover:bg-[#184363] hover:text-white transition-colors text-sm"
              >
                Contact Us
              </Link>
            </div>

          </div>
        </div>

        {/* Right panel — sticky map (desktop only) */}
        <div className="hidden lg:block lg:w-1/2 sticky top-0 h-screen">
          <iframe
            src={mapSrc}
            title={`Map of ${store.name}`}
            className="w-full h-full border-0"
            loading="lazy"
          />
        </div>

      </div>
    </div>
  );
}
```

- [ ] **Step 3: Verify static generation**

Run: `npm run build`
Expected: Build succeeds. You should see 8 branch routes listed under `/branches/[slug]` as statically generated pages (indicated by the ○ static symbol in the build output).

- [ ] **Step 4: Spot-check a branch page in dev**

Run: `npm run dev`
Visit: `/branches/overport`
Expected:
- Hero strip shows "Sparkport Overport", full address, teal "Overport, Durban" badge, back arrow link
- Trading hours table with Open/Closed indicator on the first row
- Contact links (phone, email, WhatsApp, directions) are all functional
- Getting Here card shows 2–3 sentences
- SEO write-up paragraphs render
- Two CTA buttons: "Fill Your Script" and "Contact Us"
- On desktop: map fills the right half of the viewport, stays sticky while scrolling through content
- On mobile: map appears between Getting Here and About sections at 60vh height

Also visit: `/branches/city-centre`
Expected: Same structure. "City Centre" shown as short name. 7:30AM opening time shows correctly in hours table.

- [ ] **Step 5: Commit**

```bash
git add app/branches/
git commit -m "feat: static branch pages with sticky map layout and OpenIndicator"
```

---

## Self-Review

**Spec coverage check:**
- ✅ MainWrapper full-width for policy + /branches routes
- ✅ Gradient hero on all 4 policy pages (terms, privacy, shipping, regulated-medication)
- ✅ Breadcrumb in heroes
- ✅ Last updated in T&C and Privacy heroes only (Shipping and Regulated don't have last-updated in spec)
- ✅ Footer 5-column grid: col-span-3/2/2/2/3
- ✅ "Our Branches" column with 8 links, short display names
- ✅ Footer PayFast fix
- ✅ Branch slugs match spec
- ✅ generateStaticParams from STORES
- ✅ generateMetadata per branch
- ✅ Left/right flex layout on desktop, stacked on mobile
- ✅ Right panel: sticky top-0 h-screen
- ✅ Footer renders normally below the flex row (not overlapped)
- ✅ Branch hero: name, address, area badge, back link to /store-locator
- ✅ Hours with Open/Closed indicator (client component, animates)
- ✅ Contact: phone (tel:), email (mailto:), WhatsApp (wa.me/27...), Google Maps
- ✅ Getting Here section
- ✅ About branch (SEO write-up)
- ✅ CTA strip: "Fill Your Script" + "Contact Us"
- ✅ OpenStreetMap embed URL pattern with bbox and marker
- ✅ Mobile map at 60vh between content sections
- ✅ ~180-word SEO write-ups for all 8 branches

**Nested `<main>` issue:** terms-conditions and shipping-policy currently use `<main>` as their root. Task 2 explicitly changes both to `<div>`. Covered.

**Type consistency:** `getStoreBySlug` defined in Task 1, consumed in Task 4 — same name, same signature.

**Placeholder scan:** No TBDs or TODOs. All code blocks are complete. SEO write-ups are full text, not truncated.
