/**
 * Comprehensive Image Audit and Mapping System
 * Phase 2: Missing Images Cross-Reference
 * 
 * This script crawls all website pages to identify broken image links,
 * missing references, and placeholder images that need replacement.
 */

const { chromium } = require('playwright');
const fs = require('fs').promises;
const path = require('path');

class MissingImagesAudit {
  constructor() {
    this.browser = null;
    this.page = null;
    this.missingImages = [];
    this.brokenImages = [];
    this.placeholderImages = [];
    this.outputDir = path.join(process.cwd(), 'audit-results');
    
    // Define all pages to crawl
    this.pagesToCrawl = [
      { url: '/', name: 'homepage', priority: 'High' },
      { url: '/benefits', name: 'benefits', priority: 'High' },
      { url: '/products', name: 'products', priority: 'High' },
      { url: '/products/total-essential', name: 'total-essential', priority: 'High' },
      { url: '/products/total-essential-plus', name: 'total-essential-plus', priority: 'High' },
      { url: '/ingredients', name: 'ingredients', priority: 'Medium' },
      { url: '/faq', name: 'faq', priority: 'Medium' },
      { url: '/cart', name: 'cart', priority: 'Low' },
      { url: '/checkout', name: 'checkout', priority: 'Low' }
    ];
  }

  async initialize() {
    console.log('🚀 Initializing Missing Images Audit System...');
    
    // Ensure output directory exists
    await fs.mkdir(this.outputDir, { recursive: true });
    
    // Launch browser
    this.browser = await chromium.launch({ 
      headless: false,
      args: ['--disable-web-security', '--disable-features=VizDisplayCompositor']
    });
    
    this.page = await this.browser.newPage();
    
    // Set up request interception to catch failed image loads
    await this.page.route('**/*', (route) => {
      const request = route.request();
      if (request.resourceType() === 'image') {
        route.continue().catch(() => {
          // Image failed to load
          this.brokenImages.push({
            url: request.url(),
            page: this.currentPageName,
            timestamp: new Date().toISOString()
          });
        });
      } else {
        route.continue();
      }
    });
    
    // Start local development server
    await this.startDevServer();
    
    console.log('✅ Browser and server initialized');
  }

  async startDevServer() {
    console.log('🔧 Starting development server...');
    
    // Check if server is already running
    try {
      const response = await fetch('http://localhost:3000');
      if (response.ok) {
        console.log('✅ Development server already running');
        return;
      }
    } catch (error) {
      // Server not running, need to start it
    }
    
    console.log('⚠️  Development server not detected. Please ensure "npm run dev" is running on port 3000');
    console.log('Waiting 5 seconds for server to be ready...');
    await new Promise(resolve => setTimeout(resolve, 5000));
  }

  async crawlAllPages() {
    console.log('🕷️  Starting website crawl...');
    
    for (let i = 0; i < this.pagesToCrawl.length; i++) {
      const pageInfo = this.pagesToCrawl[i];
      this.currentPageName = pageInfo.name;
      
      console.log(`\n📄 Crawling page ${i + 1}/${this.pagesToCrawl.length}: ${pageInfo.name} (${pageInfo.url})`);
      
      try {
        await this.analyzePage(pageInfo);
        
        // Progress indicator
        const progress = Math.round((i + 1) / this.pagesToCrawl.length * 100);
        console.log(`✅ Progress: ${progress}%`);
        
      } catch (error) {
        console.error(`❌ Error analyzing page ${pageInfo.url}:`, error.message);
      }
      
      // Small delay between pages
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  async analyzePage(pageInfo) {
    const fullUrl = `http://localhost:3000${pageInfo.url}`;
    
    try {
      // Navigate to page
      await this.page.goto(fullUrl, { 
        waitUntil: 'networkidle',
        timeout: 30000 
      });
      
      // Wait for images to load
      await this.page.waitForTimeout(2000);
      
      // Find all images on the page
      const images = await this.page.locator('img').all();
      console.log(`Found ${images.length} images on ${pageInfo.name}`);
      
      for (const img of images) {
        await this.analyzeImageElement(img, pageInfo);
      }
      
      // Check for CSS background images
      await this.checkBackgroundImages(pageInfo);
      
      // Look for React component image references
      await this.checkReactComponentImages(pageInfo);
      
    } catch (error) {
      console.error(`Failed to load page ${fullUrl}:`, error.message);
    }
  }

  async analyzeImageElement(imgElement, pageInfo) {
    try {
      const src = await imgElement.getAttribute('src');
      const alt = await imgElement.getAttribute('alt');
      const className = await imgElement.getAttribute('class');
      
      if (!src) return;
      
      // Check if image is a placeholder
      if (src.includes('placeholder.svg') || src.includes('placeholder.png')) {
        const boundingBox = await imgElement.boundingBox();
        const componentInfo = await this.findReactComponent(imgElement);
        
        this.placeholderImages.push({
          page_url: pageInfo.url,
          page_name: pageInfo.name,
          missing_image_path: src,
          alt_text: alt || 'No alt text',
          css_class: className || '',
          component_location: componentInfo,
          priority: pageInfo.priority,
          dimensions: boundingBox ? `${Math.round(boundingBox.width)}x${Math.round(boundingBox.height)}` : 'unknown',
          context: await this.getImageContext(imgElement),
          suggested_replacement: this.suggestReplacement(src, pageInfo, alt),
          timestamp: new Date().toISOString()
        });
        
        console.log(`🔍 Found placeholder: ${src} on ${pageInfo.name}`);
      }
      
      // Check if image loads successfully
      const isLoaded = await imgElement.evaluate((img) => {
        return img.complete && img.naturalHeight !== 0;
      });
      
      if (!isLoaded) {
        const componentInfo = await this.findReactComponent(imgElement);
        
        this.missingImages.push({
          page_url: pageInfo.url,
          page_name: pageInfo.name,
          missing_image_path: src,
          alt_text: alt || 'No alt text',
          css_class: className || '',
          component_location: componentInfo,
          priority: pageInfo.priority,
          error_type: 'Failed to load',
          context: await this.getImageContext(imgElement),
          suggested_replacement: this.suggestReplacement(src, pageInfo, alt),
          timestamp: new Date().toISOString()
        });
        
        console.log(`❌ Broken image: ${src} on ${pageInfo.name}`);
      }
      
    } catch (error) {
      console.error('Error analyzing image element:', error.message);
    }
  }

  async findReactComponent(element) {
    try {
      // Try to find the nearest React component by looking at data attributes or class names
      const componentInfo = await element.evaluate((el) => {
        let current = el;
        let depth = 0;
        
        while (current && depth < 10) {
          // Look for React component indicators
          const className = current.className;
          const dataAttributes = Array.from(current.attributes)
            .filter(attr => attr.name.startsWith('data-'))
            .map(attr => `${attr.name}="${attr.value}"`)
            .join(' ');
          
          // Check for common React component patterns
          if (className && (
            className.includes('component') ||
            className.includes('section') ||
            className.includes('hero') ||
            className.includes('card') ||
            className.includes('product')
          )) {
            return {
              component: className,
              depth: depth,
              tag: current.tagName.toLowerCase(),
              dataAttributes: dataAttributes
            };
          }
          
          current = current.parentElement;
          depth++;
        }
        
        return {
          component: 'Unknown component',
          depth: depth,
          tag: 'unknown',
          dataAttributes: ''
        };
      });
      
      return `${componentInfo.component} (${componentInfo.tag}, depth: ${componentInfo.depth})`;
      
    } catch (error) {
      return 'Component detection failed';
    }
  }

  async getImageContext(element) {
    try {
      const context = await element.evaluate((el) => {
        // Get surrounding text content
        const parent = el.parentElement;
        if (!parent) return 'No context available';
        
        const textContent = parent.textContent?.trim().substring(0, 100) || '';
        const headings = Array.from(parent.querySelectorAll('h1, h2, h3, h4, h5, h6'))
          .map(h => h.textContent?.trim())
          .filter(Boolean)
          .slice(0, 2);
        
        return {
          surrounding_text: textContent,
          nearby_headings: headings,
          section_type: parent.className || parent.tagName.toLowerCase()
        };
      });
      
      return `${context.section_type}: ${context.nearby_headings.join(', ')} | ${context.surrounding_text}`;
      
    } catch (error) {
      return 'Context extraction failed';
    }
  }

  suggestReplacement(imagePath, pageInfo, altText) {
    // Simple matching logic based on path and context
    const suggestions = [];
    
    // Match by page type
    if (pageInfo.name === 'homepage') {
      if (imagePath.includes('hero') || altText?.includes('hero')) {
        suggestions.push('/images/seo-optimized/homepage/natural-fiber-supplement-hero-01.jpg');
      }
      suggestions.push('/images/seo-optimized/homepage/digestive-wellness-banner-02.jpg');
    } else if (pageInfo.name === 'benefits') {
      suggestions.push('/images/seo-optimized/benefits/digestive-health-benefits-educational-01.jpg');
      suggestions.push('/images/seo-optimized/benefits/gut-health-lifestyle-02.jpg');
    } else if (pageInfo.name.includes('product')) {
      if (pageInfo.name.includes('plus')) {
        suggestions.push('/images/seo-optimized/products/total-essential-plus-product-01.jpg');
      } else {
        suggestions.push('/images/seo-optimized/products/total-essential-fiber-product-01.jpg');
      }
    } else if (pageInfo.name === 'ingredients') {
      suggestions.push('/images/seo-optimized/ingredients/natural-ingredients-natural-02.jpg');
    }
    
    // Match by alt text keywords
    if (altText) {
      const altLower = altText.toLowerCase();
      if (altLower.includes('testimonial') || altLower.includes('avatar')) {
        suggestions.push('/assets/testimonials/professional-supplement-education-digestive-health.jpg');
      }
      if (altLower.includes('ingredient')) {
        suggestions.push('/images/seo-optimized/ingredients/broccoli-extract-ingredient-01.jpg');
      }
      if (altLower.includes('lifestyle')) {
        suggestions.push('/images/seo-optimized/benefits/gut-health-lifestyle-02.jpg');
      }
    }
    
    return suggestions.length > 0 ? suggestions[0] : 'No automatic suggestion available';
  }

  async checkBackgroundImages(pageInfo) {
    try {
      const backgroundImages = await this.page.evaluate(() => {
        const elements = document.querySelectorAll('*');
        const bgImages = [];
        
        elements.forEach(el => {
          const style = window.getComputedStyle(el);
          const bgImage = style.backgroundImage;
          
          if (bgImage && bgImage !== 'none' && bgImage.includes('url(')) {
            const url = bgImage.match(/url\(['"]?([^'"]+)['"]?\)/)?.[1];
            if (url && !url.startsWith('data:')) {
              bgImages.push({
                url: url,
                element: el.tagName.toLowerCase(),
                className: el.className
              });
            }
          }
        });
        
        return bgImages;
      });
      
      for (const bgImg of backgroundImages) {
        // Check if background image exists
        try {
          const response = await this.page.request.get(bgImg.url);
          if (!response.ok()) {
            this.missingImages.push({
              page_url: pageInfo.url,
              page_name: pageInfo.name,
              missing_image_path: bgImg.url,
              alt_text: 'Background image',
              css_class: bgImg.className,
              component_location: `${bgImg.element} background`,
              priority: pageInfo.priority,
              error_type: 'Background image not found',
              context: 'CSS background-image',
              suggested_replacement: this.suggestReplacement(bgImg.url, pageInfo, 'background'),
              timestamp: new Date().toISOString()
            });
          }
        } catch (error) {
          // Background image failed to load
        }
      }
      
    } catch (error) {
      console.error('Error checking background images:', error.message);
    }
  }

  async checkReactComponentImages(pageInfo) {
    // This would require more complex analysis of the React components
    // For now, we'll focus on the DOM-based analysis
    console.log(`📋 React component analysis for ${pageInfo.name} (placeholder for future enhancement)`);
  }

  async generateMissingImagesReport() {
    console.log('\n📊 Generating missing images report...');
    
    // Combine all missing/broken/placeholder images
    const allIssues = [
      ...this.missingImages.map(img => ({ ...img, issue_type: 'missing' })),
      ...this.brokenImages.map(img => ({ ...img, issue_type: 'broken' })),
      ...this.placeholderImages.map(img => ({ ...img, issue_type: 'placeholder' }))
    ];
    
    // Sort by priority and page
    allIssues.sort((a, b) => {
      const priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      return a.page_name.localeCompare(b.page_name);
    });
    
    // Export to CSV
    await this.exportMissingImagesCSV(allIssues);
    
    // Generate summary
    await this.generateMissingImagesSummary(allIssues);
    
    console.log('✅ Missing images report generated successfully');
  }

  async exportMissingImagesCSV(issues) {
    const csvHeaders = [
      'page_url',
      'page_name',
      'missing_image_path',
      'issue_type',
      'component_location',
      'suggested_replacement',
      'priority',
      'alt_text',
      'css_class',
      'context',
      'timestamp'
    ];
    
    const csvRows = [csvHeaders.join(',')];
    
    for (const issue of issues) {
      const row = csvHeaders.map(header => {
        const value = issue[header] || '';
        return `"${String(value).replace(/"/g, '""')}"`;
      });
      csvRows.push(row.join(','));
    }
    
    const csvContent = csvRows.join('\n');
    const csvPath = path.join(this.outputDir, 'missing-images-audit.csv');
    
    await fs.writeFile(csvContent, csvPath, 'utf8');
    console.log(`📄 Missing images CSV exported to: ${csvPath}`);
  }

  async generateMissingImagesSummary(issues) {
    const summary = {
      total_issues: issues.length,
      by_type: {},
      by_priority: {},
      by_page: {},
      critical_issues: [],
      recommendations: []
    };
    
    // Calculate statistics
    for (const issue of issues) {
      summary.by_type[issue.issue_type] = (summary.by_type[issue.issue_type] || 0) + 1;
      summary.by_priority[issue.priority] = (summary.by_priority[issue.priority] || 0) + 1;
      summary.by_page[issue.page_name] = (summary.by_page[issue.page_name] || 0) + 1;
      
      if (issue.priority === 'High') {
        summary.critical_issues.push({
          page: issue.page_name,
          path: issue.missing_image_path,
          type: issue.issue_type,
          suggestion: issue.suggested_replacement
        });
      }
    }
    
    // Generate recommendations
    if (summary.by_type.placeholder > 0) {
      summary.recommendations.push(`Replace ${summary.by_type.placeholder} placeholder images with actual content`);
    }
    if (summary.by_type.missing > 0) {
      summary.recommendations.push(`Fix ${summary.by_type.missing} broken image references`);
    }
    if (summary.by_priority.High > 0) {
      summary.recommendations.push(`Prioritize fixing ${summary.by_priority.High} high-priority image issues`);
    }
    
    const summaryPath = path.join(this.outputDir, 'missing-images-summary.json');
    await fs.writeFile(summaryPath, JSON.stringify(summary, null, 2));
    console.log(`📊 Missing images summary saved to: ${summaryPath}`);
  }

  async cleanup() {
    if (this.browser) {
      await this.browser.close();
    }
    console.log('🧹 Cleanup completed');
  }
}

// Main execution
async function runMissingImagesAudit() {
  const audit = new MissingImagesAudit();
  
  try {
    await audit.initialize();
    await audit.crawlAllPages();
    await audit.generateMissingImagesReport();
    
    console.log('\n🎉 Phase 2: Missing Images Audit completed successfully!');
    console.log('📁 Results saved in: audit-results/');
    console.log('📄 Files generated:');
    console.log('  - missing-images-audit.csv');
    console.log('  - missing-images-summary.json');
    
  } catch (error) {
    console.error('❌ Error during missing images audit:', error);
  } finally {
    await audit.cleanup();
  }
}

// Export for use in other scripts
module.exports = { MissingImagesAudit };

// Run if called directly
if (require.main === module) {
  runMissingImagesAudit();
}
