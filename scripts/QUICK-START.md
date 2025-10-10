# 🚀 Quick Start Guide - Image Audit System

Get up and running with the Comprehensive Image Audit and Mapping System in 5 minutes!

## ⚡ Prerequisites (2 minutes)

1. **Start your development server:**
   ```bash
   npm run dev
   # Ensure it's running on http://localhost:3000
   ```

2. **Navigate to scripts directory:**
   ```bash
   cd scripts
   ```

## 🛠️ Setup (2 minutes)

### Option A: Automatic Setup (Recommended)
```bash
# Run the setup script
node setup-audit-system.js
```

### Option B: Manual Setup
```bash
# Install dependencies
npm install playwright sharp googleapis

# Install Playwright browsers
npx playwright install
```

## 🎯 Run the Audit (1 minute)

### Complete Audit (All Phases)
```bash
node comprehensive-image-audit.js
```

### Individual Phases
```bash
# Phase 1: Inventory available images
node comprehensive-image-audit.js --phase1

# Phase 2: Find missing/broken images  
node comprehensive-image-audit.js --phase2

# Phase 3: Generate intelligent mappings
node comprehensive-image-audit.js --phase3

# Phase 4: Export to Google Sheets
node comprehensive-image-audit.js --phase4
```

## 📊 View Results

All results are saved in `audit-results/` directory:

### Key Files
- **`new-images-inventory.csv`** - All available images with metadata
- **`missing-images-audit.csv`** - Broken/missing images that need fixing
- **`image-mapping-recommendations.csv`** - Smart suggestions for replacements
- **`FINAL-AUDIT-REPORT.md`** - Human-readable summary

### Google Sheets (if configured)
The system will create a collaborative spreadsheet with all data formatted and ready for team review.

## 🎯 Quick Implementation

### 1. High-Priority Fixes (Auto-Replace)
```bash
# Find auto-replace recommendations (confidence 80+)
grep "auto_replace" audit-results/image-mapping-recommendations.csv
```

### 2. Example Implementation
```javascript
// BEFORE (broken/placeholder)
<img src="/placeholder.svg" alt="Product image" />

// AFTER (recommended replacement)
<img src="/images/seo-optimized/products/total-essential-fiber-product-01.jpg" 
     alt="Total Essential fiber product showcasing natural digestive health" />
```

### 3. Batch Replace Script
```bash
# Use the implementation guide for step-by-step instructions
cat audit-results/implementation-guide.json
```

## 🔧 Troubleshooting

### Common Issues

**"Development server not running"**
```bash
npm run dev
```

**"No images found"**
```bash
# Check images exist
ls -la public/images/seo-optimized/
```

**"Dependencies missing"**
```bash
cd scripts
npm install playwright sharp
npx playwright install
```

**"Google Sheets not working"**
- This is optional - CSV files will still be generated
- See README.md for Google Sheets setup instructions

## 📈 What the System Does

### Phase 1: Image Inventory
- Scans `public/images/seo-optimized/` directory
- Extracts metadata (dimensions, file size, format)
- Generates SEO-optimized descriptions
- Categorizes images by intended use

### Phase 2: Missing Images Audit
- Crawls all website pages
- Identifies broken image links
- Finds placeholder images (`placeholder.svg`)
- Analyzes React components for missing images

### Phase 3: Intelligent Matching
- Maps available images to missing slots
- Uses AI-powered scoring (filename, context, dimensions)
- Provides confidence ratings (80+ = auto-replace)
- Generates implementation recommendations

### Phase 4: Export & Collaboration
- Creates enhanced CSV files with metadata
- Generates Google Sheets for team collaboration
- Provides executive summary and next steps

## 🎉 Success Metrics

After running the audit, you'll have:

✅ **Complete inventory** of all available images  
✅ **Identified all missing/broken** image references  
✅ **Smart recommendations** for image replacements  
✅ **Implementation guide** with step-by-step instructions  
✅ **Collaborative spreadsheet** for team review  
✅ **Performance insights** and SEO optimization tips  

## 🚀 Next Steps

1. **Review the audit results** in `audit-results/`
2. **Implement high-confidence recommendations** immediately
3. **Review medium-confidence suggestions** manually
4. **Create new images** for items requiring manual review
5. **Test your website** after implementing changes
6. **Re-run the audit** to verify improvements

## 📞 Need Help?

- **Documentation**: See `README.md` for detailed instructions
- **Setup Issues**: Run `node setup-audit-system.js` for diagnostics
- **Results Questions**: Check `FINAL-AUDIT-REPORT.md` for explanations

---

**🎯 Goal**: Zero broken images, optimized SEO, and a professional image management system!

*Happy auditing! 🚀*
