# 🎯 Comprehensive Image Audit and Mapping System

A powerful Playwright-based system for auditing, analyzing, and mapping images across your website. This system provides intelligent recommendations for replacing missing or placeholder images with optimized alternatives.

## 🚀 Features

### Phase 1: New Images Inventory
- **Automated Image Discovery**: Scans `/public/images/seo-optimized/` directory
- **Metadata Extraction**: Dimensions, file size, format, creation dates
- **AI-Generated Descriptions**: Visual content analysis based on filenames and paths
- **SEO Scoring**: Automatic scoring based on filename optimization
- **Page Context Mapping**: Determines intended page and location for each image

### Phase 2: Missing Images Cross-Reference
- **Website Crawling**: Analyzes all pages for broken/missing images
- **Placeholder Detection**: Identifies `placeholder.svg` and similar temporary images
- **Component Analysis**: Locates React components with missing images
- **Background Image Scanning**: Checks CSS background images
- **Priority Classification**: High/Medium/Low priority based on page importance

### Phase 3: Cross-Reference Logic Implementation
- **Intelligent Matching**: Maps available images to missing slots using:
  - Exact filename matching (100 points)
  - Page context matching (80 points)
  - Category/type matching (60 points)
  - Keyword similarity (40 points)
  - Alt text matching (30 points)
  - Dimension compatibility (20 points)
  - SEO score bonus (10 points)
- **Confidence Scoring**: 80+ = Auto-replace, 50-79 = Review, <50 = Manual
- **Implementation Recommendations**: Actionable steps for each image

### Phase 4: Google Sheets Integration & CSV Export
- **Google Sheets API**: Creates collaborative spreadsheets with formatted data
- **Enhanced CSV Export**: Metadata-rich CSV files for offline analysis
- **Summary Dashboard**: Executive overview with key metrics
- **Implementation Guide**: Step-by-step replacement instructions

## 📋 Prerequisites

### Required Dependencies
```bash
npm install playwright sharp googleapis
```

### System Requirements
- Node.js 16+ 
- Development server running on `http://localhost:3000`
- Images in `public/images/seo-optimized/` directory

### Optional: Google Sheets Integration
1. Create a Google Cloud Project
2. Enable Google Sheets API
3. Create service account credentials
4. Save credentials as `google-credentials.json` in project root

## 🛠️ Installation & Setup

### 1. Install Dependencies
```bash
# Install required packages
npm install playwright sharp

# Install optional Google Sheets integration
npm install googleapis

# Install Playwright browsers
npx playwright install
```

### 2. Start Development Server
```bash
npm run dev
# Ensure server is running on http://localhost:3000
```

### 3. Verify Image Directory
```bash
# Check that images exist in the expected location
ls -la public/images/seo-optimized/
```

## 🚀 Usage

### Run Complete Audit (All Phases)
```bash
node scripts/comprehensive-image-audit.js
```

### Run Individual Phases
```bash
# Phase 1: New Images Inventory
node scripts/comprehensive-image-audit.js --phase1

# Phase 2: Missing Images Audit  
node scripts/comprehensive-image-audit.js --phase2

# Phase 3: Cross-Reference Logic
node scripts/comprehensive-image-audit.js --phase3

# Phase 4: Google Sheets Integration
node scripts/comprehensive-image-audit.js --phase4
```

### Run Individual Scripts
```bash
# Run phases independently
node scripts/image-audit-system.js
node scripts/missing-images-audit.js
node scripts/image-mapping-system.js
node scripts/google-sheets-integration.js
```

### Help & Options
```bash
node scripts/comprehensive-image-audit.js --help
```

## 📊 Output Files

All results are saved in the `audit-results/` directory:

### Core Audit Files
- `new-images-inventory.csv` - Complete catalog of available images
- `missing-images-audit.csv` - Pages needing image updates
- `image-mapping-recommendations.csv` - Suggested image placements

### Enhanced Reports
- `enhanced-new-images-inventory.csv` - Inventory with metadata headers
- `enhanced-missing-images-audit.csv` - Missing images with context
- `enhanced-image-mapping-recommendations.csv` - Detailed recommendations

### Summary Files
- `master-summary.csv` - Key metrics overview
- `inventory-summary.json` - Detailed inventory statistics
- `missing-images-summary.json` - Missing images analysis
- `mapping-summary.json` - Matching results summary
- `implementation-guide.json` - Step-by-step implementation plan
- `executive-summary.json` - Complete audit results
- `FINAL-AUDIT-REPORT.md` - Human-readable final report

### Google Sheets (Optional)
- **Spreadsheet URL**: Provided in console output and final report
- **Four Sheets**: Inventory, Missing Images, Mapping, Summary Dashboard

## 🎯 Implementation Workflow

### 1. Review High-Priority Replacements
```bash
# Filter for auto-replace recommendations (confidence 80+)
grep "auto_replace" audit-results/image-mapping-recommendations.csv
```

### 2. Implement Automatic Replacements
Use the implementation guide to replace images with high confidence scores:
```javascript
// Example replacement
// FROM: src="/placeholder.svg"
// TO:   src="/images/seo-optimized/homepage/natural-fiber-supplement-hero-01.jpg"
```

### 3. Review Medium-Confidence Matches
Manually verify suggestions with confidence scores 50-79 before implementing.

### 4. Address Manual Review Items
Create new images or source alternatives for items requiring manual review.

### 5. Update Alt Text
Use the suggested alt text from the recommendations for better SEO.

### 6. Test Implementation
```bash
# Run tests after implementing changes
npm test
npm run build
```

## 🔧 Configuration

### Customize Page Crawling
Edit `missing-images-audit.js` to modify pages to crawl:
```javascript
this.pagesToCrawl = [
  { url: '/', name: 'homepage', priority: 'High' },
  { url: '/custom-page', name: 'custom', priority: 'Medium' },
  // Add your pages here
];
```

### Adjust Matching Weights
Modify scoring weights in `image-mapping-system.js`:
```javascript
this.weights = {
  exact_filename_match: 100,
  page_context_match: 80,
  category_match: 60,
  // Customize weights here
};
```

### Google Sheets Credentials
Place credentials in one of these locations:
- Environment variable: `GOOGLE_SHEETS_CREDENTIALS`
- File: `google-credentials.json`
- File: `credentials/google-sheets.json`

## 🐛 Troubleshooting

### Common Issues

**"Development server not running"**
```bash
# Start the development server
npm run dev
# Verify it's running on port 3000
curl http://localhost:3000
```

**"Sharp package not found"**
```bash
npm install sharp
```

**"No images found in seo-optimized directory"**
```bash
# Check directory exists and has images
ls -la public/images/seo-optimized/
```

**"Google Sheets API not available"**
- This is optional - CSV files will still be generated
- Follow Google Sheets setup instructions if needed

### Debug Mode
Add debug logging by setting environment variable:
```bash
DEBUG=true node scripts/comprehensive-image-audit.js
```

## 📈 Performance Tips

- **Large Image Collections**: The audit can handle 1000+ images efficiently
- **Memory Usage**: Each phase cleans up resources automatically
- **Parallel Processing**: Phases run sequentially to avoid resource conflicts
- **Browser Optimization**: Playwright runs in non-headless mode for debugging

## 🤝 Contributing

### Adding New Matching Criteria
1. Edit `calculateMatchScore()` in `image-mapping-system.js`
2. Add new scoring logic and weight
3. Update documentation

### Adding New Export Formats
1. Create new export method in `google-sheets-integration.js`
2. Add to main orchestrator script
3. Update deliverables list

### Extending Page Analysis
1. Modify `analyzePage()` in `missing-images-audit.js`
2. Add new detection methods
3. Update CSV headers and export logic

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review generated log files in `audit-results/`
3. Examine the executive summary for error details
4. Verify all prerequisites are met

## 📄 License

This image audit system is part of the La Belle Vie project and follows the same licensing terms.

---

*Generated by the Comprehensive Image Audit and Mapping System*
