# Image Optimization Plan - La Belle Vie

## Current Status

### ✅ Existing Product/Marketing Images (in `/public/lovable-uploads/webp/`)
- `antioxidant-parsley-fresh-herb.webp` - Used for Antioxidant Parsley ingredient page
- `total-essential-fiber-supplement-bottle.webp` - Main product bottle
- `total-essential-plus-fiber-supplement-bottle.webp` - Premium product bottle
- `digestive-health-benefits-fiber-supplement.webp` - Benefits section
- `fruit-veg-bottle.webp` - Hero background
- `prebiotic-fiber-gut-health.webp` - Educational content

### ✅ Existing Ingredient Banner Images (in `/public/assets/webp/`)
These are high-quality 16x9 banners already created for ingredient pages:

#### Berries & Fruits
- ✅ `16x9_A_cluster_of_acai_berries.webp` (132 KB) - Acai Berry
- ✅ `16x9_a_close_up_shot_cranberry_.webp` (103 KB) - Cranberry
- ✅ `16x9_Three_ripe_strawberries_with_bri.webp` (132 KB) - Strawberry
- ✅ `16x9_a_close_up_shot_of_a_papaya_frui.webp` (143 KB) - Papaya
- ❌ **Raspberry** - MISSING (needs to be created/sourced)

#### Vegetables & Greens
- ✅ `16x9_broccoli_extract.webp` (464 KB - needs optimization) - Broccoli
- ✅ `16x9_a_bowl_filled_with_green_spinach.webp` (55 KB) - Spinach
- ✅ `16x9_a_close_up_shot_of_cabbage.webp` (204 KB) - Cabbage
- ✅ `16x9_a_plump_organic_carrot_with_inte.webp` (111 KB) - Carrot
- ✅ `16x9_a_celery_plant_with_vibrant_gree.webp` (48 KB) - Celery
- ✅ `16x9_A_vibrant_cluster_of_fresh_parsl.webp` (114 KB) - Parsley (alternate)

#### Fibers & Functional Ingredients
- ✅ `16x9_apple_fibre.webp` (168 KB) - Apple Fiber
- ✅ `16x9_A_pile_of_oats_and_oat_straws_ar.webp` (181 KB) - Oat Bran
- ✅ `16x9_A_photorealistic_palme-oil.webp` (179 KB) - Palm Fiber
- ✅ `16x9_A_close_up_of_a_corn_plant_with_.webp` (122 KB) - Corn Fiber
- ✅ `16x9_A_close_up_shot_of_guar_gum.webp` (120 KB) - Guar Gum
- ✅ `16x9_a_prebiotic-powerhouse.webp` (394 KB - needs optimization) - Prebiotic

#### Botanicals
- ✅ `16x9_a_close_up_shot_of_aleo.webp` (166 KB) - Aloe Vera

### ❌ Missing Images (High Priority)

#### Critical Missing
1. **16x9_raspberry_berries.webp** - Raspberry ingredient page banner
2. **fiber-supplement-premium-ingredients.webp** - Testimonial avatar (ProductEssentialPlus)
3. PNG versions in `/public/assets/` should be removed (keeping only WebP versions)

#### Images Needing Optimization (>200 KB)
1. `16x9_broccoli_extract.webp` (464 KB → target 150 KB)
2. `16x9_a_prebiotic-powerhouse.webp` (394 KB → target 150 KB)
3. `16x9_a_close_up_shot_of_cabbage.webp` (204 KB → target 150 KB)

## SEO Optimization Standards

### File Naming Convention
```
[ingredient-name]-[key-benefit].webp
```
Examples:
- `acai-berry-superfood.webp`
- `spinach-powder-iron-rich.webp`
- `oat-bran-cholesterol-support.webp`

### Alt Text Format
```
[Ingredient Name] - [Key Benefit/Description] for [Use Case]
```
Examples:
- "Acai Berry - Antioxidant-rich superfood for immune support and digestive health"
- "Beta-Glucan Oat Bran - Cholesterol-lowering fiber for heart health and gut wellness"
- "Fresh Spinach Powder - Iron-rich green superfood for energy and vitality"

### Image Specifications
- **Format**: WebP (with JPG fallback for older browsers)
- **Dimensions**:
  - Hero images: 1280x720px (16:9 ratio)
  - Background images: 1920x1080px (full HD)
  - Product thumbnails: 600x600px (1:1 ratio)
  - Testimonial avatars: 80x80px (1:1 ratio)
- **Compression**:
  - Quality: 85-90% for hero images
  - Quality: 70-80% for backgrounds
  - Quality: 90-95% for product images
- **File Size Targets**:
  - Hero images: < 150KB
  - Backgrounds: < 200KB
  - Product images: < 100KB
  - Avatars: < 10KB

### Performance Optimization
1. **Lazy Loading**: All images except above-the-fold content
2. **Priority Loading**: Hero images and product images
3. **Responsive Images**: Use Next.js Image component with `sizes` prop
4. **CDN Delivery**: All images served through optimized CDN
5. **Cache Headers**: Set to 1 year for immutable assets

## Image Source Recommendations

### Option 1: Unsplash (Free, High Quality)
- Already configured in next.config.js
- Search terms: "organic [ingredient]", "fresh [ingredient]", "natural [ingredient]"
- Ensure commercial use license

### Option 2: Custom Photography
- Hire photographer for product shots
- Controlled branding and consistency
- Higher cost but unique imagery

### Option 3: Stock Photography (Paid)
- Shutterstock, Adobe Stock, Getty Images
- Professional quality
- Extended commercial licenses

## Implementation Priority

### Phase 1: Map Existing Assets to Pages (Immediate - 1-2 hours)
**Goal**: Update all ingredient page components to use the existing banner images from `/public/assets/webp/`

#### Berries & Fruits
1. ✅ Acai Berry → Use `16x9_A_cluster_of_acai_berries.webp`
2. ✅ Cranberry → Use `16x9_a_close_up_shot_cranberry_.webp`
3. ❌ Raspberry → **CREATE NEW** `16x9_raspberry_cluster.webp`
4. ✅ Strawberry → Use `16x9_Three_ripe_strawberries_with_bri.webp`
5. ✅ Papaya → Use `16x9_a_close_up_shot_of_a_papaya_frui.webp`

#### Vegetables & Greens
1. ✅ Broccoli Extract → Use `16x9_broccoli_extract.webp`
2. ✅ Spinach Powder → Use `16x9_a_bowl_filled_with_green_spinach.webp`
3. ✅ Cabbage Extract → Use `16x9_a_close_up_shot_of_cabbage.webp`
4. ✅ Carrot → Use `16x9_a_plump_organic_carrot_with_inte.webp`
5. ✅ Celery → Use `16x9_a_celery_plant_with_vibrant_gree.webp`
6. ✅ Parsley → Use `16x9_A_vibrant_cluster_of_fresh_parsl.webp` (already using different version)

#### Fibers & Functional
1. ✅ Apple Fiber → Use `16x9_apple_fibre.webp`
2. ✅ Oat Bran → Use `16x9_A_pile_of_oats_and_oat_straws_ar.webp`
3. ✅ Palm Fiber → Use `16x9_A_photorealistic_palme-oil.webp`
4. ✅ Corn Fiber → Use `16x9_A_close_up_of_a_corn_plant_with_.webp`
5. ✅ Guar Gum → Use `16x9_A_close_up_shot_of_guar_gum.webp`
6. ✅ Prebiotic → Use `16x9_a_prebiotic-powerhouse.webp`

#### Botanicals
1. ✅ Aloe Vera → Use `16x9_a_close_up_shot_of_aleo.webp`

### Phase 2: Create Missing Raspberry Image (1 day)
1. Source high-quality raspberry cluster image from Unsplash
2. Optimize to 16:9 ratio, 1280x720px
3. Compress to WebP format (target <150KB)
4. Save as `16x9_raspberry_cluster.webp`

### Phase 3: Optimize Oversized Images (1 day)
1. `16x9_broccoli_extract.webp` (464 KB → 150 KB)
2. `16x9_a_prebiotic-powerhouse.webp` (394 KB → 150 KB)
3. `16x9_a_close_up_shot_of_cabbage.webp` (204 KB → 150 KB)

### Phase 4: Cleanup (1 hour)
1. Remove PNG duplicates from `/public/assets/` (keep only WebP versions)
2. Create testimonial avatar `fiber-supplement-premium-ingredients.webp`
3. Verify all pages load correctly with new image paths

### Phase 5: Performance Testing & SEO (2 days)
- Run PageSpeed Insights on all ingredient pages
- Verify Core Web Vitals improvements
- Check image search indexing
- Monitor page load times

## SEO Impact Metrics

### Target Improvements
- **Page Load Speed**: Reduce by 30-40% with WebP
- **Core Web Vitals**:
  - LCP (Largest Contentful Paint): < 2.5s
  - CLS (Cumulative Layout Shift): < 0.1
- **Image Search Rankings**: Rank for ingredient-specific queries
- **Engagement**: Increase time-on-page by 20-30%

### Monitoring
- Google Search Console - Image impressions
- PageSpeed Insights - Performance scores
- Google Analytics - Bounce rate and engagement
- Ahrefs/SEMrush - Image search rankings

## Next Steps

1. ✅ Configure Next.js for Unsplash domain
2. 📝 Create this optimization plan
3. 🎨 Source/create missing critical images
4. 🔄 Implement images for top 5 ingredient pages
5. ✅ Test performance improvements
6. 📊 Monitor SEO impact
7. 🔁 Roll out to remaining pages

## Notes

- All images should have descriptive, keyword-rich filenames
- Alt text should be unique and describe the specific image
- Consider schema.org markup for product images
- Implement image sitemaps for better indexing
- Use structured data for ingredient information
