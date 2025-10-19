# 404 / Navigation Audit  
_La Belle Vie – Next.js (App Router)_

Last reviewed: **28 Jun 2025**  
Branch: `droid/fix-404-navigation-issues`

---

## 1 · Executive Summary
Production users reported hard 404s that break the back-button and force a full reload.  
The audit identified two major classes of problems:

| Category | Impact | Root cause |
|----------|--------|------------|
| **Static-export limitations** | Any non-pre-generated route returns a 404 served by the hosting layer (not by our custom `app/not-found.tsx`). Back-navigation reloads the entire bundle. | `next.config.js` sets `output: "export"` → site is exported as static HTML with no fallback for dynamic routes. |
| **Broken / missing links** | Internal navigation to non-existent pages or typos triggers 404. | Typos in `href`, missing pages (`about`, `contact`, `privacy`, etc.), inconsistent slugs, case-sensitive mismatches. |

---

## 2 · Static Export Compatibility Matrix

| Feature / Page | Requires SSR / ISR? | Status with `output:"export"` | Fix |
|----------------|---------------------|------------------------------|-----|
| Dynamic ingredient pages (`/ingredients/[slug]`) | ✅ (dynamic params) | ❌ 404 after build | Switch to **dynamic route with SSG/ISR** or remove static export. |
| Checkout pages (`/checkout`, success/error) | ✅ (runtime data & search params) | ❌ 404 w/ hard refresh | Use normal Next.js build, **remove `output:"export"`**. |
| Not-found page (`app/not-found.tsx`) | – | Served only for client-side misses | Works once `output:"export"` removed. |

**Recommendation:** Convert project back to default hybrid rendering (`output` _unset_) to regain dynamic routing and proper 404 handling.

---

## 3 · Component & Page-level Findings

All items marked **fixed ✅** are already addressed on branch
`droid/fix-404-navigation-issues` (see commit history).

| Component / Page | Issue | Root Cause | Required Fix |
|------------------|-------|-----------|--------------|
| `next.config.js` | Static export prevents dynamic routes | `output: "export"` | **Fixed ✅** – now gated behind `STATIC_EXPORT=true`, default build is hybrid. |
| `Header` links | All correct ✅ | – | No change. |
| `Footer` links | • `/products` label typo “Essentiel”<br>• Dead legal / marketing links | Missing pages / typo | **Fixed ✅** – typo corrected; dead links commented out until pages exist. |
| Ingredient index page `/ingredients` | `Link` target slugs are lower-case but file names match; OK | – | Ensure all ingredient pages are statically generated or use ISR. |
| Ingredient detail pages | 404 in production | Not generated in static export | Remove static export or generate all pages via `generateStaticParams`. |
| `/products/total-essential-plus` | Works but loses state on back | Static export (full reload) | Remove static export. |
| `/dev/*` routes | Exposed in prod build | Included in output | Add `robots.txt` rules & conditional `if (process.env.NODE_ENV==="development")` guard in routes export. |
| `SignIn` modal links | N/A | – | Works. |
| Custom `NotFound` component | Not reached on hard 404 | Host returns 404 HTML before SPA loads | Handled once static export removed. |

---

## 4 · Action Plan

### Phase 1 – Configuration
1. **Remove static export**  
   ```diff
   // next.config.js
   - output: 'export',
   ```
   or wrap behind an env flag for Netlify/Cloudflare Pages if truly needed.

2. **Add fallback for dynamic params** (if still using SSG):
   ```ts
   export const dynamicParams = true;
   ```

### Phase 2 – Content / Links
| Task | Owner | Branch | Checklist |
|------|-------|--------|-----------|
| Fix “Essentiel” typo in Footer | FE dev | `droid/fix-404-navigation-issues` | `Footer.tsx: Total Essential Plus` |
| Remove / replace dead footer links or scaffold pages (`about`, `contact`, `privacy`, `terms`, `cookies`, `shipping`, `blog`) | Content team | same | _Commented-out links_ ✅ / Page stubs **TODO** |
| Verify all ingredient pages listed in `app/ingredients` exist and export metadata | FE dev | same |  |

### Phase 3 – QA
1. `pnpm build && pnpm start` – verify all routes work without 404.  
2. Run **Playwright** suite (`pnpm test`) plus new 404 regression test:
   ```
   expect(page.url()).not.toContain('404')
   ```
3. Manual back-button test on mobile & desktop.

### Phase 4 – Deployment
1. Push branch, open PR, request review.  
2. Deploy preview to Vercel/Supabase Edge Functions.  

Implemented
`middleware.ts` to:
* normalise trailing slashes & case
* redirect legacy URLs
* block `/dev/*` in prod  

Additional recommendations:
3. Smoke-test critical flows (landing → product → cart → checkout).  
4. Merge & promote to production.
- Keep automated `scripts/verify-routes.js` (added) in CI to fail
  build on new 404s.

---

## 5 · Future Safeguards

- Add **cypress/playwright** route-existence test that crawls `<a href>` attributes and ensures 2xx/3xx status.
- Use **Next.js 15 `linkChecker`** ESLint rule when stable.
- Enforce CI check: build fails if `next build` prints “Could not find a matching page for route”.

---

### Appendix A – Pages without Implementation

| Dead Link | Proposed Resolution |
|-----------|--------------------|
| `/about` | Create marketing page or remove link |
| `/contact` | Create simple contact form or link to mailto: |
| `/privacy`, `/terms`, `/cookies` | Generate legal pages from template |
| `/shipping` | Summarise shipping policy |
| `/blog` | Remove until blog is launched |

---

**End of document**
