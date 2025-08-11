/**
 * Comprehensive Image Audit and Mapping System
 * Phase 1: New Images Inventory
 * 
 * This script uses Playwright to analyze all images in the seo-optimized directory
 * and generates a comprehensive inventory with metadata, dimensions, and AI-generated descriptions.
 */

const { chromium } = require('playwright');
const fs = require('fs').promises;
const path = require('path');
const sharp = require('sharp');

class ImageInventorySystem {
  constructor() {
    this.browser = null;
    this.page = null;
    this.inventory = [];
    this.seoOptimizedDir = path.join(process.cwd(), 'public', 'images', 'seo-optimized');
    this.outputDir = path.join(process.cwd(), 'audit-results');
  }

  async initialize() {
    console.log('🚀 Initializing Image Inventory System...');
    
    // Ensure output directory exists
    await fs.mkdir(this.outputDir, { recursive: true });
    
    // Launch browser
    this.browser = await chromium.launch({ headless: false });
    this.page = await this.browser.newPage();
    
    console.log('✅ Browser initialized');
  }

  async scanImageDirectory() {
    console.log('📁 Scanning seo-optimized directory...');
    
    const imageFiles = await this.getAllImageFiles(this.seoOptimizedDir);
    console.log(`Found ${imageFiles.length} images to analyze`);
    
    for (let i = 0; i < imageFiles.length; i++) {
      const imagePath = imageFiles[i];
      console.log(`\n📸 Analyzing image ${i + 1}/${imageFiles.length}: ${path.basename(imagePath)}`);
      
      try {
        const imageData = await this.analyzeImage(imagePath);
        this.inventory.push(imageData);
        
        // Progress indicator
        const progress = Math.round((i + 1) / imageFiles.length * 100);
        console.log(`✅ Progress: ${progress}%`);
        
      } catch (error) {
        console.error(`❌ Error analyzing ${imagePath}:`, error.message);
      }
    }
  }

  async getAllImageFiles(dir) {
    const imageFiles = [];
    const extensions = ['.jpg', '.jpeg', '.png', '.webp'];
    
    async function scanDir(currentDir) {
      const entries = await fs.readdir(currentDir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(currentDir, entry.name);
        
        if (entry.isDirectory()) {
          await scanDir(fullPath);
        } else if (extensions.includes(path.extname(entry.name).toLowerCase())) {
          imageFiles.push(fullPath);
        }
      }
    }
    
    await scanDir(dir);
    return imageFiles;
  }

  async analyzeImage(imagePath) {
    const filename = path.basename(imagePath);
    const relativePath = path.relative(process.cwd(), imagePath);
    const webPath = '/' + relativePath.replace(/\\/g, '/');
    
    // Get image metadata using Sharp
    const metadata = await sharp(imagePath).metadata();
    const stats = await fs.stat(imagePath);
    
    // Generate visual description based on filename and path
    const visualDescription = this.generateVisualDescription(imagePath);
    
    // Determine intended page and location
    const pageContext = this.determinePageContext(imagePath);
    
    return {
      filename,
      file_path: webPath,
      full_system_path: imagePath,
      visual_description: visualDescription,
      intended_page: pageContext.page,
      intended_location: pageContext.location,
      dimensions: `${metadata.width}x${metadata.height}`,
      width: metadata.width,
      height: metadata.height,
      file_size_kb: Math.round(stats.size / 1024),
      file_size_bytes: stats.size,
      format: metadata.format,
      has_alpha: metadata.hasAlpha,
      density: metadata.density,
      created_date: stats.birthtime.toISOString(),
      modified_date: stats.mtime.toISOString(),
      category: this.categorizeImage(imagePath),
      seo_score: this.calculateSeoScore(filename, visualDescription),
      alt_text_suggestion: this.generateAltText(filename, pageContext)
    };
  }

  generateVisualDescription(imagePath) {
    const filename = path.basename(imagePath, path.extname(imagePath));
    const pathParts = imagePath.split(path.sep);
    
    // Extract context from path and filename
    const category = pathParts.find(part => 
      ['homepage', 'benefits', 'products', 'ingredients', 'blog', 'social'].includes(part)
    ) || 'general';
    
    const descriptors = filename.split('-');
    
    // Generate description based on filename patterns
    if (filename.includes('hero')) {
      return `Hero banner image for ${category} page featuring ${descriptors.filter(d => d !== 'hero').join(' ')}`;
    } else if (filename.includes('product')) {
      return `Product showcase image featuring ${descriptors.filter(d => d !== 'product').join(' ')}`;
    } else if (filename.includes('ingredient')) {
      return `Ingredient illustration showing ${descriptors.filter(d => d !== 'ingredient').join(' ')}`;
    } else if (filename.includes('lifestyle')) {
      return `Lifestyle image depicting ${descriptors.filter(d => d !== 'lifestyle').join(' ')} in daily life`;
    } else if (filename.includes('educational')) {
      return `Educational illustration about ${descriptors.filter(d => d !== 'educational').join(' ')}`;
    } else if (filename.includes('benefits')) {
      return `Health benefits visualization showing ${descriptors.filter(d => d !== 'benefits').join(' ')}`;
    } else {
      return `${category.charAt(0).toUpperCase() + category.slice(1)} image featuring ${descriptors.join(' ')}`;
    }
  }

  determinePageContext(imagePath) {
    const pathParts = imagePath.split(path.sep);
    const filename = path.basename(imagePath, path.extname(imagePath));
    
    // Determine page from directory structure
    let page = 'unknown';
    let location = 'general';
    
    if (pathParts.includes('homepage')) {
      page = 'homepage';
      if (filename.includes('hero')) location = 'hero-section';
      else if (filename.includes('banner')) location = 'banner-section';
      else if (filename.includes('feature')) location = 'features-section';
    } else if (pathParts.includes('benefits')) {
      page = 'benefits';
      if (filename.includes('hero')) location = 'hero-section';
      else if (filename.includes('educational')) location = 'education-section';
      else if (filename.includes('lifestyle')) location = 'lifestyle-section';
    } else if (pathParts.includes('products')) {
      page = 'products';
      if (filename.includes('product')) location = 'product-showcase';
      else if (filename.includes('comparison')) location = 'comparison-section';
      else if (filename.includes('ingredients')) location = 'ingredients-section';
    } else if (pathParts.includes('ingredients')) {
      page = 'ingredients';
      location = 'ingredient-detail';
    } else if (pathParts.includes('blog')) {
      page = 'blog';
      if (filename.includes('hero')) location = 'article-header';
      else location = 'article-content';
    } else if (pathParts.includes('social')) {
      page = 'social-media';
      location = 'social-sharing';
    }
    
    return { page, location };
  }

  categorizeImage(imagePath) {
    const filename = path.basename(imagePath).toLowerCase();
    
    if (filename.includes('hero')) return 'hero-banner';
    if (filename.includes('product')) return 'product-image';
    if (filename.includes('ingredient')) return 'ingredient-image';
    if (filename.includes('lifestyle')) return 'lifestyle-image';
    if (filename.includes('educational')) return 'educational-content';
    if (filename.includes('benefits')) return 'benefits-illustration';
    if (filename.includes('social')) return 'social-media';
    if (filename.includes('banner')) return 'banner-image';
    if (filename.includes('thumbnail')) return 'thumbnail';
    
    return 'general-content';
  }

  calculateSeoScore(filename, description) {
    let score = 50; // Base score
    
    // Filename SEO factors
    if (filename.includes('fiber') || filename.includes('digestive')) score += 15;
    if (filename.includes('natural') || filename.includes('health')) score += 10;
    if (filename.includes('supplement') || filename.includes('wellness')) score += 10;
    if (filename.includes('total-essential')) score += 15;
    
    // Description factors
    if (description.length > 50 && description.length < 150) score += 10;
    if (description.includes('La Belle Vie') || description.includes('fiber')) score += 5;
    
    return Math.min(100, score);
  }

  generateAltText(filename, pageContext) {
    const descriptors = filename.split('-').filter(d => !['01', '02', '03', '04', '05', '06', '07', '08', '09', '10'].includes(d));
    
    let altText = descriptors.join(' ');
    
    // Add context-specific improvements
    if (pageContext.page === 'homepage') {
      altText += ' for La Belle Vie fiber supplements';
    } else if (pageContext.page === 'products') {
      altText += ' showcasing Total Essential fiber products';
    } else if (pageContext.page === 'benefits') {
      altText += ' illustrating digestive health benefits';
    }
    
    // Capitalize first letter
    return altText.charAt(0).toUpperCase() + altText.slice(1);
  }

  async generateInventoryReport() {
    console.log('\n📊 Generating inventory report...');
    
    // Sort inventory by category and filename
    this.inventory.sort((a, b) => {
      if (a.category !== b.category) {
        return a.category.localeCompare(b.category);
      }
      return a.filename.localeCompare(b.filename);
    });
    
    // Generate CSV
    await this.exportToCSV();
    
    // Generate summary report
    await this.generateSummaryReport();
    
    console.log('✅ Inventory report generated successfully');
  }

  async exportToCSV() {
    const csvHeaders = [
      'filename',
      'file_path',
      'visual_description',
      'intended_page',
      'intended_location',
      'dimensions',
      'file_size_kb',
      'format',
      'category',
      'seo_score',
      'alt_text_suggestion',
      'created_date',
      'modified_date'
    ];
    
    const csvRows = [csvHeaders.join(',')];
    
    for (const item of this.inventory) {
      const row = csvHeaders.map(header => {
        const value = item[header] || '';
        // Escape commas and quotes in CSV
        return `"${String(value).replace(/"/g, '""')}"`;
      });
      csvRows.push(row.join(','));
    }
    
    const csvContent = csvRows.join('\n');
    const csvPath = path.join(this.outputDir, 'new-images-inventory.csv');
    
    await fs.writeFile(csvPath, csvContent, 'utf8');
    console.log(`📄 CSV exported to: ${csvPath}`);
  }

  async generateSummaryReport() {
    const summary = {
      total_images: this.inventory.length,
      categories: {},
      pages: {},
      formats: {},
      total_size_mb: 0,
      average_seo_score: 0,
      high_priority_images: [],
      recommendations: []
    };
    
    // Calculate statistics
    for (const item of this.inventory) {
      summary.categories[item.category] = (summary.categories[item.category] || 0) + 1;
      summary.pages[item.intended_page] = (summary.pages[item.intended_page] || 0) + 1;
      summary.formats[item.format] = (summary.formats[item.format] || 0) + 1;
      summary.total_size_mb += item.file_size_kb / 1024;
      summary.average_seo_score += item.seo_score;
      
      if (item.seo_score >= 80) {
        summary.high_priority_images.push({
          filename: item.filename,
          page: item.intended_page,
          score: item.seo_score
        });
      }
    }
    
    summary.average_seo_score = Math.round(summary.average_seo_score / this.inventory.length);
    summary.total_size_mb = Math.round(summary.total_size_mb * 100) / 100;
    
    // Generate recommendations
    if (summary.average_seo_score < 70) {
      summary.recommendations.push('Consider optimizing image filenames for better SEO');
    }
    if (summary.total_size_mb > 50) {
      summary.recommendations.push('Consider compressing images to reduce total size');
    }
    
    const summaryPath = path.join(this.outputDir, 'inventory-summary.json');
    await fs.writeFile(summaryPath, JSON.stringify(summary, null, 2));
    console.log(`📊 Summary report saved to: ${summaryPath}`);
  }

  async cleanup() {
    if (this.browser) {
      await this.browser.close();
    }
    console.log('🧹 Cleanup completed');
  }
}

// Main execution
async function runImageInventory() {
  const system = new ImageInventorySystem();
  
  try {
    await system.initialize();
    await system.scanImageDirectory();
    await system.generateInventoryReport();
    
    console.log('\n🎉 Phase 1: New Images Inventory completed successfully!');
    console.log('📁 Results saved in: audit-results/');
    console.log('📄 Files generated:');
    console.log('  - new-images-inventory.csv');
    console.log('  - inventory-summary.json');
    
  } catch (error) {
    console.error('❌ Error during inventory process:', error);
  } finally {
    await system.cleanup();
  }
}

// Export for use in other scripts
module.exports = { ImageInventorySystem };

// Run if called directly
if (require.main === module) {
  runImageInventory();
}
