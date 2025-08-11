#!/usr/bin/env node

/**
 * SEO Image Optimizer for La Belle Vie
 * Analyzes Google FX images and creates SEO-optimized names based on content and target pages
 */

import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

// SEO keyword mapping for La Belle Vie
const SEO_KEYWORDS = {
  // Primary keywords
  primary: [
    'fiber-supplement', 'digestive-health', 'natural-wellness', 'gut-health',
    'total-essential', 'digestive-wellness', 'natural-fiber', 'healthy-digestion'
  ],
  
  // Page-specific keywords
  homepage: [
    'hero', 'banner', 'wellness-lifestyle', 'natural-health', 'premium-supplement'
  ],
  
  products: [
    'total-essential', 'total-essential-plus', 'fiber-blend', 'supplement-bottle',
    'natural-ingredients', 'premium-quality', 'digestive-support'
  ],
  
  benefits: [
    'health-benefits', 'digestive-benefits', 'wellness-benefits', 'gut-health-benefits',
    'natural-detox', 'digestive-support', 'healthy-lifestyle'
  ],
  
  ingredients: [
    'broccoli-extract', 'natural-ingredients', 'fiber-sources', 'plant-based',
    'organic-ingredients', 'natural-compounds', 'digestive-enzymes'
  ],
  
  education: [
    'digestive-system', 'gut-microbiome', 'fiber-education', 'health-science',
    'wellness-guide', 'digestive-anatomy', 'health-research'
  ],
  
  lifestyle: [
    'healthy-lifestyle', 'wellness-journey', 'natural-living', 'health-conscious',
    'active-lifestyle', 'wellness-routine', 'healthy-habits'
  ]
};

// Image content analysis patterns
const CONTENT_PATTERNS = {
  // Visual content indicators
  people: ['person', 'people', 'human', 'face', 'body', 'lifestyle'],
  nature: ['plant', 'green', 'natural', 'organic', 'leaf', 'garden'],
  medical: ['anatomy', 'system', 'health', 'medical', 'science', 'research'],
  food: ['food', 'nutrition', 'ingredient', 'supplement', 'bottle', 'capsule'],
  abstract: ['pattern', 'design', 'geometric', 'abstract', 'artistic'],
  wellness: ['wellness', 'fitness', 'exercise', 'meditation', 'relaxation']
};

// Page mapping based on current website structure
const PAGE_MAPPING = {
  'index.html': {
    keywords: [...SEO_KEYWORDS.primary, ...SEO_KEYWORDS.homepage],
    prefix: 'homepage',
    imageTypes: ['hero', 'banner', 'feature']
  },
  
  'total-essential.html': {
    keywords: [...SEO_KEYWORDS.primary, ...SEO_KEYWORDS.products],
    prefix: 'total-essential',
    imageTypes: ['product', 'hero', 'feature']
  },
  
  'total-essential-plus.html': {
    keywords: [...SEO_KEYWORDS.primary, ...SEO_KEYWORDS.products],
    prefix: 'total-essential-plus',
    imageTypes: ['product', 'hero', 'feature']
  },
  
  'benefits.html': {
    keywords: [...SEO_KEYWORDS.primary, ...SEO_KEYWORDS.benefits],
    prefix: 'benefits',
    imageTypes: ['educational', 'lifestyle', 'health']
  },
  
  'ingredients.html': {
    keywords: [...SEO_KEYWORDS.primary, ...SEO_KEYWORDS.ingredients],
    prefix: 'ingredients',
    imageTypes: ['ingredient', 'natural', 'educational']
  }
};

class SEOImageOptimizer {
  constructor() {
    this.sourceDir = path.join(process.cwd(), 'downloads', 'google-fx-all-images');
    this.outputDir = path.join(process.cwd(), 'public', 'images', 'optimized');
    this.analysisResults = [];
    
    // Ensure output directory exists
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  async analyzeImages() {
    console.log('🔍 Analyzing Google FX images for SEO optimization...');
    
    const imageFiles = fs.readdirSync(this.sourceDir)
      .filter(file => file.endsWith('.jpg') || file.endsWith('.png'))
      .sort();

    console.log(`📊 Found ${imageFiles.length} images to analyze`);

    for (let i = 0; i < imageFiles.length; i++) {
      const filename = imageFiles[i];
      const filepath = path.join(this.sourceDir, filename);
      
      try {
        // Get image metadata
        const metadata = await sharp(filepath).metadata();
        
        // Analyze image content (basic analysis based on filename and metadata)
        const contentAnalysis = this.analyzeImageContent(filename, metadata);
        
        // Generate SEO-optimized name
        const seoName = this.generateSEOName(contentAnalysis, i + 1);
        
        // Map to appropriate page
        const pageMapping = this.mapToPage(contentAnalysis);
        
        const analysis = {
          originalName: filename,
          seoName: seoName,
          contentType: contentAnalysis.type,
          suggestedPage: pageMapping.page,
          keywords: pageMapping.keywords,
          dimensions: `${metadata.width}x${metadata.height}`,
          format: metadata.format,
          size: fs.statSync(filepath).size,
          useCases: this.generateUseCases(contentAnalysis)
        };
        
        this.analysisResults.push(analysis);
        
        console.log(`✅ Analyzed: ${filename} → ${seoName}`);
        
      } catch (error) {
        console.error(`❌ Error analyzing ${filename}:`, error.message);
      }
    }

    return this.analysisResults;
  }

  analyzeImageContent(filename, metadata) {
    // Basic content analysis based on patterns and metadata
    const analysis = {
      type: 'general',
      confidence: 0.5,
      features: [],
      suggestedUse: 'general'
    };

    // Analyze dimensions for use case
    const { width, height } = metadata;
    const aspectRatio = width / height;

    if (aspectRatio > 1.5) {
      analysis.features.push('banner', 'hero');
      analysis.suggestedUse = 'hero';
    } else if (aspectRatio < 0.8) {
      analysis.features.push('portrait', 'mobile');
      analysis.suggestedUse = 'mobile';
    } else {
      analysis.features.push('square', 'social');
      analysis.suggestedUse = 'social';
    }

    // High resolution suggests hero/banner use
    if (width >= 1200) {
      analysis.features.push('high-res', 'hero', 'banner');
      analysis.confidence += 0.2;
    }

    // Standard web resolution
    if (width === 1408 && height === 768) {
      analysis.features.push('web-optimized', 'hero', 'banner');
      analysis.type = 'hero';
      analysis.confidence = 0.9;
    }

    return analysis;
  }

  generateSEOName(contentAnalysis, index) {
    const imageNumber = String(index).padStart(3, '0');
    
    // Select appropriate keywords based on content type
    let keywords = [];
    
    if (contentAnalysis.features.includes('hero')) {
      keywords = ['natural', 'fiber', 'supplement', 'hero'];
    } else if (contentAnalysis.features.includes('banner')) {
      keywords = ['digestive', 'health', 'banner'];
    } else if (contentAnalysis.features.includes('social')) {
      keywords = ['wellness', 'lifestyle', 'social'];
    } else {
      keywords = ['natural', 'health', 'wellness'];
    }

    // Add descriptive terms
    const descriptors = [
      'premium', 'natural', 'organic', 'healthy', 'pure', 'effective',
      'science-backed', 'clinically-tested', 'high-quality'
    ];
    
    const randomDescriptor = descriptors[index % descriptors.length];
    keywords.unshift(randomDescriptor);

    // Create SEO-friendly filename
    const seoName = `${keywords.join('-')}-${imageNumber}`;
    
    return seoName;
  }

  mapToPage(contentAnalysis) {
    // Map images to appropriate pages based on content analysis
    const pages = Object.keys(PAGE_MAPPING);
    
    if (contentAnalysis.features.includes('hero')) {
      return {
        page: 'index.html',
        keywords: PAGE_MAPPING['index.html'].keywords
      };
    }
    
    if (contentAnalysis.features.includes('product')) {
      return {
        page: 'total-essential.html',
        keywords: PAGE_MAPPING['total-essential.html'].keywords
      };
    }
    
    // Default to benefits page for general wellness images
    return {
      page: 'benefits.html',
      keywords: PAGE_MAPPING['benefits.html'].keywords
    };
  }

  generateUseCases(contentAnalysis) {
    const useCases = [];
    
    if (contentAnalysis.features.includes('hero')) {
      useCases.push('Homepage hero section', 'Landing page banner', 'Feature highlight');
    }
    
    if (contentAnalysis.features.includes('social')) {
      useCases.push('Social media posts', 'Blog thumbnails', 'Card components');
    }
    
    if (contentAnalysis.features.includes('banner')) {
      useCases.push('Page headers', 'Section banners', 'Call-to-action backgrounds');
    }
    
    useCases.push('General content', 'Blog illustrations', 'Educational materials');
    
    return useCases;
  }

  async generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      totalImages: this.analysisResults.length,
      summary: {
        heroImages: this.analysisResults.filter(img => img.contentType === 'hero').length,
        socialImages: this.analysisResults.filter(img => img.useCases.includes('Social media posts')).length,
        generalImages: this.analysisResults.filter(img => img.contentType === 'general').length
      },
      images: this.analysisResults,
      recommendations: this.generateRecommendations()
    };

    const reportPath = path.join(this.outputDir, 'seo-analysis-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    console.log(`📋 Analysis report saved: ${reportPath}`);
    return report;
  }

  generateRecommendations() {
    return [
      'Use hero images (1408x768) for homepage and landing page banners',
      'Implement lazy loading for all images to improve Core Web Vitals',
      'Convert images to WebP format for better compression',
      'Add descriptive alt tags using the SEO keywords',
      'Create responsive image sets for different screen sizes',
      'Use structured data markup for product images',
      'Implement proper caching headers for image optimization'
    ];
  }
}

// Run the analysis
async function runAnalysis() {
  const optimizer = new SEOImageOptimizer();
  
  try {
    await optimizer.analyzeImages();
    const report = await optimizer.generateReport();
    
    console.log('\n🎉 SEO Image Analysis Complete!');
    console.log(`📊 Analyzed ${report.totalImages} images`);
    console.log(`🖼️  Hero images: ${report.summary.heroImages}`);
    console.log(`📱 Social images: ${report.summary.socialImages}`);
    console.log(`📋 Report saved with detailed recommendations`);
    
  } catch (error) {
    console.error('❌ Analysis failed:', error.message);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runAnalysis();
}

export default SEOImageOptimizer;
