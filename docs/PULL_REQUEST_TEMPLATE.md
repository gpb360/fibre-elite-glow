<!--
  Pull Request Template
  La Belle Vie – Ingredients Expansion
-->

## 📋 Summary

Provide a concise description of this pull request.  
Example:

> Add Ingredients section with SEO-optimised Oil Palm Fibre page, update product pages and navigation.

## ✨ What's New / Changed
- **Ingredients Landing Page `/ingredients`**
  - Showcases all key ingredients with cards & hero section.
- **Detailed Ingredient Page `/ingredients/oil-palm-fibre`**
  - Rich content, FAQ, scientific evidence, schema-org JSON-LD.
  - Images, split sections, benefit cards.
- **Navigation Update**
  - “Ingredients” added to desktop & mobile menus.
- **Product Pages Enhanced**
  - Ingredient links + featured Oil Palm Fibre spotlight.
- **SEO Optimisations**
  - Metadata (title, description, keywords, OG, Twitter).
- **Supporting Components & Assets**
  - New UI components, images, and structured data helpers.

## 🧪 How to Test
1. `pnpm install` (if dependencies changed)  
2. `pnpm dev` and browse:
   - `/ingredients` – ensure cards render and links work.
   - `/ingredients/oil-palm-fibre` – review all sections, images, FAQ toggles.
   - `/products/total-essential` & `total-essential-plus` – verify new links & info-box.
3. Confirm navigation dropdowns open/close on desktop & mobile.
4. Run `pnpm lint && pnpm test` – expect no errors.

## 📸 Screenshots / GIFs
> Attach UI screenshots or Loom link demonstrating new pages & nav.

## ✅ Checklist
- [ ] Code compiles locally without errors
- [ ] Linting passes (`pnpm lint`)
- [ ] Unit/E2E tests pass (`pnpm test` / Playwright)
- [ ] New pages/components have mobile-responsive styles
- [ ] Accessibility reviewed (alt text, aria labels)
- [ ] Documentation / comments updated
- [ ] Linked to relevant issue(s) → `Closes #___`

## 🔗 Related Issues / Tickets
Closes #<!--issue-->  
<!--Add additional references-->

## 📄 Additional Notes
- Schema.org JSON-LD added for Oil Palm Fibre page to improve rich-result eligibility.
- PR authored with Factory assistant; manual review encouraged for copy edits or design tweaks.
