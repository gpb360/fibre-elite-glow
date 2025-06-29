# 404-Fixes Summary  
Branch `droid/fix-404-navigation-issues` – 28 Jun 2025

## What Was Broken
| Area | Symptom | Root Cause |
|------|---------|------------|
| Routing strategy | Any path not pre-generated returned **hard 404** (hosting layer), back-button triggered full reload | `next.config.js` had `output: "export"` (static export) |
| Navigation links | Footer typo “Total **Essentiel** Plus”; footer pointed at non-existent legal / marketing pages | Typos & missing pages |
| SEO / UX | Upper-case, trailing-slash URLs produced 404 | No canonicalisation |
| Dev routes | `/dev/*` accessible in prod | Not gated |

## Fixes Implemented ✅
| Change | File(s) | Result |
|--------|---------|--------|
| Static-export gated behind `STATIC_EXPORT` flag | `next.config.js` | Dynamic routes work in prod; back-button uses SPA history |
| Universal redirect / normaliser | `middleware.ts` | • Removes trailing slashes<br>• Forces lower-case URLs<br>• Redirects legacy paths<br>• Blocks `/dev/*` in prod |
| Enhanced custom 404 page | `src/components/pages/NotFound.tsx` | Friendly UI, quick links, search, always reached for 404s |
| Footer typo fixed, dead links commented out | `src/components/Footer.tsx` | No broken footer navigation |
| Header & dropdown links audited – no change needed | — | Navigation reliable |
| Test & verification tooling | `tests/404-navigation.spec.ts`, `scripts/verify-routes.js` | Automated regression coverage for routes/back-button |
| Security & perf headers added | via `middleware.ts` | Minor hardening |

## Still To-Do 📝
| Task | Owner | Priority |
|------|-------|----------|
| Create real pages for: `/about`, `/contact`, `/privacy`, `/terms`, `/cookies`, `/shipping`, `/blog` | Content / FE | Medium |
| Generate all ingredient pages at build time **or** enable ISR (`generateStaticParams`) | FE | High |
| Enable CI gate: run `scripts/verify-routes.js --ci` on every PR | DevOps | High |
| Add `<Link>` crawler rule in ESLint / CI once available | DX | Low |
| Deploy preview → smoke-test (mobile & desktop) critical flows | QA | High |
| Re-enable commented footer/legal links once pages exist | FE | After pages live |

---

### Quick Verification
```
pnpm build && pnpm start               # Local prod build
node scripts/verify-routes.js --verbose
pnpm test                              # Playwright E2E
```

_All currently enabled routes pass 200-OK and custom 404 is served for unknown paths._  
