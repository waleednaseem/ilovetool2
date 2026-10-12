# Product Requirements Document (PRD)

**Product:** Conversion Web App (PDF tools + Unit converters)  
**Status:** Draft  
**Date:** 2026-03-12  
**Stack:** Next.js frontend (Context API + Axios); backend deferred  

---

## 1. Overview

A free web app that combines **unit converters** (daily traffic / SEO) with **PDF tools** (high intent, later monetization). Unit converters stay always free. PDF tools launch free with limits, then move to freemium for paid upgrades.

**Primary goals (in order):**
1. Daily organic traffic and return visits  
2. Cross-discovery from units → PDF tools  
3. Paid conversion on PDF limits (later phase)  

---

## 2. Problem

- Users need quick unit conversions (currency, length, weight, etc.) daily.  
- Same users periodically need PDF merge/split/compress/convert.  
- Existing sites either do only one category or gate too early, hurting habit and SEO.

---

## 3. Goals & Success Metrics

| Phase | Goal | Metric |
|-------|------|--------|
| Month 1–2 | Organic growth on unit pages | Rising organic visits / impressions |
| Month 2–3 | Cross-sell | % of unit visitors who open a PDF tool |
| Later | Monetization | Free PDF users hitting limit → upgrade rate |

**Launch target:** 35–40 tools total (≈20 unit + 15–18 PDF). Cap early scope below ~80 tools.

---

## 4. Users

| Persona | Need | Frequency |
|---------|------|-----------|
| General / students | Length, weight, temp, currency | Daily–weekly |
| Office / freelancers | PDF merge, compress, convert | Weekly–monthly |
| Future paid user | Larger files, batch, OCR, no ads | As needed |

---

## 5. Product Principles

1. **Units = traffic magnet** — never lock behind signup or paywall.  
2. **PDF = monetization surface** — free tier with clear limits.  
3. **One tool = one SEO URL** — e.g. `/convert/kg-to-lb`.  
4. **Ship quality over quantity** — fewer polished tools beat many thin pages.  

---

## 6. Scope

### 6.1 In scope (MVP → V1)

- Unit converters (client-side where possible)  
- PDF P0 tools (backend/API when ready)  
- SEO routes, meta, sitemap, internal linking  
- Homepage with currency strip + tool discovery  
- Favorites / recent (localStorage)  
- Shareable converter URLs (`?from=&to=&v=`)  

### 6.2 Out of scope (initial)

- Native mobile apps  
- Backend auth / payments (until freemium phase)  
- Docker / infra changes  
- Locking unit converters  

---

## 7. Features

### 7.1 Unit converters (~20)

| Priority | Category | Tools |
|----------|----------|--------|
| P0 | Currency | USD↔PKR, EUR↔PKR, GBP↔PKR, multi-currency (live rates later) |
| P0 | Length | m↔ft, cm↔inch, km↔mile |
| P0 | Weight | kg↔lb, g↔oz |
| P0 | Temperature | C↔F, C↔K |
| P1 | Area | m²↔ft², acre↔hectare |
| P1 | Volume | liter↔gallon, ml↔cup |
| P1 | Speed | km/h↔mph |
| P1 | Data | MB↔GB, GB↔TB |
| P1 | Time | hours↔days, timestamp→date |
| P2 | Fuel / BMI | L/100km↔mpg, BMI calculator |

**Engagement hooks:**
- Homepage “Today’s rates” (PKR strip)  
- Favorites + recent conversions (localStorage)  
- Shareable result query params  

### 7.2 PDF tools (15–18)

**P0 client-side (MVP — 4):**
1. Merge PDF  
2. Split / unmerge PDF  
3. Sign PDF (draw or upload)  
4. Fill PDF forms (AcroForm)  

**P0 stubbed for API (6):**
5. Compress PDF  
6. PDF → Word  
7. Word → PDF  
8. PDF ↔ JPG  
9. Rotate PDF  
10. Protect / Unlock PDF  

**P1 (next):**
11. PDF ↔ Excel  
12. PDF ↔ PowerPoint  
13. Organize / reorder pages  
14. Watermark  
15. Page numbers  
16. OCR (paid candidate)  
17. Extract images  
18. PDF → PDF/A  

**Also in MVP converters:** house area (m²↔ft²), fabric/clothes meters (m↔yard, cloth m↔ft).  

---

## 8. Monetization (later)

| Free | Paid |
|------|------|
| All unit converters | — |
| PDF: 2 files/day, 10MB max, no batch, ads OK | Unlimited, 100MB+, batch, OCR, no ads, priority queue |

---

## 9. User Flows

```mermaid
flowchart LR
  SEO[Unit SEO pages] --> Daily[Daily visits]
  Daily --> Discover[Discover PDF tools]
  Discover --> Free[Free limited PDF]
  Free --> Paid[Upgrade on limits]
```

1. Land on unit converter via search → convert instantly (no signup).  
2. See related units + CTA to PDF tools.  
3. Use free PDF tool within limits.  
4. (Later) Hit limit → signup / upgrade.  

---

## 10. Technical Requirements

| Area | Requirement |
|------|-------------|
| Frontend | Next.js App Router, TypeScript, Tailwind |
| State | Context API (`src/context`) |
| HTTP | Axios (`src/services/api.ts`) |
| Units | Prefer client-side math; currency rates via API later |
| PDF | Processing via backend/API when available; frontend upload UX first |
| SEO | Unique route + title/meta per tool; category sitemaps |
| Constraints | No `.env` edits in agent workflow; no Docker changes; UI copy in English |

---

## 11. Build Phases

| Phase | Timing | Deliverable |
|-------|--------|-------------|
| 1 | Parallel | Homepage + registries + favorites |
| 2 | Parallel | ≥12 unit converters (incl. house/fabric/currency) |
| 3 | Parallel | Client PDF: merge, split, sign, form fill |
| 4 | Parallel | Stub heavy PDF + Axios contracts |
| 5 | Parallel | SEO sitemap/robots + Vitest + build |
| Later | — | Live FX, remaining units, API PDF, freemium |

---

## 12. SEO / Traffic Checklist

- [ ] One route per conversion pair  
- [ ] Unique title + meta description  
- [ ] Internal links between related converters  
- [ ] Cross-CTA: units → PDF tools  
- [ ] Sitemap (global + per category)  
- [ ] Fast load; no signup for units  

---

## 13. Non-Functional Requirements

- Mobile-responsive layouts  
- Accessible forms (labels, keyboard)  
- Clear error states for invalid input / failed PDF jobs  
- Privacy: do not retain uploaded files beyond processing window (when backend exists)  

---

## 14. Open Decisions (product, not blockers)

- Brand / product name for public launch  
- Live FX rate provider for currency  
- PDF processing vendor vs self-hosted backend  

---

## 15. Acceptance Criteria (MVP)

- [ ] At least 12 P0 unit converters live with SEO URLs  
- [ ] Homepage shows tool discovery + PKR rates strip (static OK at first)  
- [ ] Recent/favorites work without account  
- [ ] Shareable unit URL restores inputs  
- [ ] 8 PDF P0 tools usable end-to-end (or clearly stubbed with API contract if backend pending)  
- [ ] Unit tools require no login  

---

## Document history

| Version | Date | Notes |
|---------|------|-------|
| 0.1 | 2026-03-12 | Initial PRD from Conversion Tools Strategy plan |
