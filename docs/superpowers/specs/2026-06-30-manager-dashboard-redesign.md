# Manager Dashboard Redesign — Spec
**Date:** 2026-06-30
**Project:** Sparkport Pharmacy Platform
**Scope:** FranchiseAdminDashboard.tsx + StoreManagerDashboard.tsx + lib/supabase/analytics.ts + API routes

---

## Context

The manager dashboard currently renders everything on a single scrollable page: prescriptions (grid/list/table toggle), store stats, and commerce analytics. As prescription volume grows this becomes unworkable. The redesign introduces a sidebar app shell that separates concerns cleanly between the two manager roles.

---

## Roles & Landing Pages

| Role | Primary Task | Landing Section |
|------|-------------|-----------------|
| `franchise_admin` | Monitor operational health across all stores | Overview |
| `store_manager` | Process individual prescriptions throughout the day | Prescriptions |

---

## App Shell

### Layout
- Fixed left sidebar: 240px wide on desktop
- Main content area: fills remaining width, independently scrollable
- Mobile: sidebar collapses to a bottom tab bar (icon only, no hamburger)

### Franchise Admin Sidebar Nav
1. Overview (default)
2. Prescriptions
3. Analytics
4. Stores

### Store Manager Sidebar Nav
1. Prescriptions (default)
2. Analytics

### Sidebar Content (both)
- Top: Sparkport brand mark + "Manager Portal" label
- Middle: manager avatar (initials), name, role badge
- Nav items with icon + label, active state highlighted in teal
- Bottom: Sign Out button

---

## Section: Overview (franchise_admin only)

### Zone 1 — Operational KPI Strip
Four cards in a row:

| Card | Value | Source |
|------|-------|--------|
| Pending Action | count of prescriptions with status `submitted` or `verifying` | prescriptions table |
| Oldest Unprocessed | age of the single longest-waiting `submitted` prescription | prescriptions.created_at |
| Today's Revenue | sum of completed wc_orders today | existing `getRevenueKPIs()` |
| Total Orders | all-time wc_order count | existing `getRevenueKPIs()` |

"Oldest Unprocessed" card border turns amber at 2h, red at 8h.

### Zone 2 — Stores Needing Attention
One card per pharmacy, sorted by urgency (most pending first).

Each card shows:
- Store name + city
- Count of scripts pending action (submitted + verifying)
- Age of oldest unprocessed script at that store
- Border colour: green (0 pending), amber (oldest > 2h), red (oldest > 8h)

### Zone 3 — Volume Sparkline + Recent Activity (side by side)
**Left (60%):** 14-day prescription submission bar chart. One bar per day, CSS-based. Shows whether volume is growing.

**Right (40%):** Last 10 prescription status changes as a live feed.
Format: `RX-00123 → Dispensing · Sparkport Sandton · 12 min ago`
Derived from `prescriptions.updated_at` ordered descending.

---

## Section: Prescriptions (both dashboards)

Replaces the current grid/list/table toggle entirely. Single table view, built for scale.

### Controls Bar
- **Search input:** matches against `prescription_number`, `patient_name`, `patient_phone` (client-side filter on loaded data)
- **Status filter:** dropdown (All / Submitted / Verifying / Verified / Dispensing / Ready / Out for Delivery / Completed / Rejected / Cancelled)
- **Store filter:** dropdown (franchise_admin only — All Stores + per-pharmacy options)
- **Date range:** "Today / Last 7 days / Last 30 days / All" toggle (filters by `created_at`)

### Table Columns

| Column | franchise_admin | store_manager |
|--------|----------------|---------------|
| Rx # | ✓ | ✓ |
| Patient name | ✓ | ✓ |
| Store | ✓ | — |
| Delivery method | ✓ | ✓ |
| Status badge | ✓ | ✓ |
| Age | ✓ | ✓ |
| Quick Action | ✓ | ✓ |

**Age column** — time elapsed since `updated_at` (when status last changed):
- Green pill: < 2 hours
- Amber pill: 2–8 hours
- Red pill: > 8 hours

**Quick Action button** — advances to the next logical status inline, no modal required:

| Current Status | Quick Action Label |
|---------------|-------------------|
| submitted | Mark Verifying |
| verifying | Mark Dispensing |
| dispensing | Mark Ready |
| ready_collect | Mark Completed |
| other | — (no button) |

Calls existing `PATCH /api/manager/prescriptions/[id]` with `{ status }`.

### Row Interaction
Clicking a row opens the existing prescription detail modal (unchanged — image lightbox, full patient info, status buttons, reassign store).

### Pagination
- 20 rows per page, client-side
- Previous / Next buttons + "Page X of Y" indicator
- Total count shown above table: "Showing 1–20 of 143 prescriptions"

---

## Section: Analytics (both dashboards)

Two clearly labelled sub-sections on one scrollable page.

### Sub-section A — Prescription Analytics

#### 1. Submissions Per Day (30-day bar chart)
- CSS bar chart, same visual style as existing revenue chart
- Data source: new `getPrescriptionsByDay(days: number)` function in `lib/supabase/analytics.ts`
- Query: select `created_at` from `prescriptions`, group by date in JS, fill gaps with 0

#### 2. Status Funnel
- Horizontal pipeline visualisation
- One row per status in logical order: Submitted → Verifying → Dispensing → Ready → Completed
- Bar width = (count / max_count) * 100% — CSS width
- Count label on the right
- Source: existing `getPrescriptionMetrics()` (already returns status + count)

#### 3. Per-Store Comparison (franchise_admin) / Store Breakdown (store_manager)
- **Franchise admin:** horizontal bar chart, one row per pharmacy sorted by total prescription count descending. Width = (store_count / max_store_count) * 100%. Derived client-side from loaded prescriptions + pharmacies arrays.
- **Store manager:** status breakdown bar chart for their own store only (submitted, verifying, dispensing, ready, completed). No cross-store data is available to the store manager — their prescriptions API is scoped to their pharmacy.

#### 4. Avg Script Age by Status
- Stat row: for each active status (submitted, verifying, dispensing, ready_collect), calculate average age in hours from `updated_at` to now.
- Displayed as: `Submitted · avg 1.4h` | `Verifying · avg 5.2h` | etc.
- Calculated client-side from the loaded prescriptions array — no extra API call needed.
- If avg > 8h for any status, that figure shows in red.

### Sub-section B — Commerce Analytics
Existing charts, unchanged content, moved here from the bottom of the prescription list:
- Revenue KPI cards (Today, This Month, MoM Growth, Total Orders)
- Revenue per day — 30-day bar chart
- Orders by Status
- Customer Growth — 6-month bar chart
- Top 10 Products table
- Recent Orders table

---

## Section: Stores (franchise_admin only)

The existing store performance table (columns: Store, Total, Submitted, Verifying, Dispensing, Ready, Completed) moved here as its own section. No new data needed — derived from loaded prescriptions + pharmacies.

---

## New Data Function

**`getPrescriptionsByDay(days: number): Promise<{ date: string; count: number }[]>`**

Add to `lib/supabase/analytics.ts`:
- Query: `select created_at from prescriptions` (service role, no RLS)
- Group by `created_at.slice(0, 10)` in JS
- Fill every day in the range with 0 if no submissions
- Return array `[{ date: 'YYYY-MM-DD', count: number }]` sorted ascending

Add `prescriptionsByDay` to the `GET /api/manager/analytics` response.

---

## File Changes

| File | Change |
|------|--------|
| `lib/supabase/analytics.ts` | Add `getPrescriptionsByDay()` |
| `app/api/manager/analytics/route.ts` | Include `prescriptionsByDay` in response |
| `app/manager/dashboard/FranchiseAdminDashboard.tsx` | Full rewrite — sidebar shell + 4 sections |
| `app/manager/dashboard/StoreManagerDashboard.tsx` | Full rewrite — sidebar shell + 2 sections |

No new API routes required. No external chart libraries. No schema changes.

---

## What Does Not Change

- Prescription detail modal (image lightbox, status buttons, reassign store)
- `PATCH /api/manager/prescriptions/[id]` route
- `GET /api/manager/prescriptions/[id]` route (image + delivery address)
- `GET /api/manager/prescriptions` route
- `GET /api/manager/pharmacies` route
- `app/manager/dashboard/page.tsx` (server component, passes manager prop)
- Authentication and middleware

---

## CSS Chart Approach

All charts use CSS only — no Recharts, Chart.js, or other libraries.

| Chart Type | CSS Technique |
|-----------|---------------|
| Vertical bar | `flex items-end`, each bar is a `div` with percentage `height` |
| Horizontal bar | `div` with percentage `width`, `transition-all` for animate-on-load |
| Status funnel | Horizontal bars in status order, width = % of max count |
| Donut / ring | Not used — replaced by status funnel which is clearer |

Tooltips on hover using `group` + `opacity-0 group-hover:opacity-100` Tailwind pattern (existing pattern in codebase).
