/**
 * Comprehensive Image Audit and Mapping System
 * Cross-Reference Logic Implementation
 * 
 * This script implements intelligent matching to map new images to missing image slots
 * based on naming conventions, visual content analysis, and page context.
 */

const fs = require('fs').promises;
const path = require('path');

class ImageMappingSystem {
  constructor() {
    this.outputDir = path.join(process.cwd(), 'audit-results');
    this.inventory = [];
    this.missingImages = [];
    this.mappingResults = [];
    
    // Scoring weights for different matching criteria
    this.weights = {
      exact_filename_match: 100,
      page_context_match: 80,
      category_match: 60,
      keyword_match: 40,
      alt_text_match: 30,
      dimension_match: 20,
      seo_score_bonus: 10
    };
  }

  async initialize() {
    console.log('🚀 Initializing Image Mapping System...');
    
    // Load inventory data
    await this.loadInventoryData();
    
    // Load missing images data
    await this.loadMissingImagesData();
    
    console.log(`✅ Loaded ${this.inventory.length} available images`);
    console.log(`✅ Loaded ${this.missingImages.length} missing image slots`);
  }

  async loadInventoryData() {
    try {
      const inventoryPath = path.join(this.outputDir, 'new-images-inventory.csv');
      const csvContent = await fs.readFile(inventoryPath, 'utf8');
      
      this.inventory = this.parseCSV(csvContent);
      console.log('📊 Inventory data loaded successfully');
      
    } catch (error) {
      console.error('❌ Error loading inventory data:', error.message);
      console.log('⚠️  Please run Phase 1 (image-audit-system.js) first');
      throw error;
    }
  }

  async loadMissingImagesData() {
    try {
      const missingPath = path.join(this.outputDir, 'missing-images-audit.csv');
      const csvContent = await fs.readFile(missingPath, 'utf8');
      
      this.missingImages = this.parseCSV(csvContent);
      console.log('📊 Missing images data loaded successfully');
      
    } catch (error) {
      console.error('❌ Error loading missing images data:', error.message);
      console.log('⚠️  Please run Phase 2 (missing-images-audit.js) first');
      throw error;
    }
  }

  parseCSV(csvContent) {
    const lines = csvContent.split('\n');
    const headers = lines[0].split(',').map(h => h.replace(/"/g, ''));
    const data = [];
    
    for (let i = 1; i < lines.length; i++) {
      if (lines[i].trim()) {
        const values = this.parseCSVLine(lines[i]);
        const row = {};
        
        headers.forEach((header, index) => {
          row[header] = values[index] || '';
        });
        
        data.push(row);
      }
    }
    
    return data;
  }

  parseCSVLine(line) {
    const values = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"';
          i++; // Skip next quote
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        values.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    
    values.push(current); // Add last value
    return values;
  }

  async performIntelligentMatching() {
    console.log('\n🧠 Starting intelligent image matching...');
    
    for (let i = 0; i < this.missingImages.length; i++) {
      const missingImage = this.missingImages[i];
      
      console.log(`\n🔍 Matching ${i + 1}/${this.missingImages.length}: ${missingImage.missing_image_path}`);
      
      const matches = await this.findBestMatches(missingImage);
      
      this.mappingResults.push({
        missing_image: missingImage,
        matches: matches,
        best_match: matches[0] || null,
        confidence_score: matches[0]?.total_score || 0,
        matching_criteria: matches[0]?.criteria || {},
        recommendation: this.generateRecommendation(missingImage, matches[0])
      });
      
      if (matches.length > 0) {
        console.log(`✅ Best match: ${matches[0].filename} (score: ${matches[0].total_score})`);
      } else {
        console.log('❌ No suitable matches found');
      }
    }
  }

  async findBestMatches(missingImage) {
    const matches = [];
    
    for (const availableImage of this.inventory) {
      const score = this.calculateMatchScore(missingImage, availableImage);
      
      if (score.total_score > 20) { // Minimum threshold
        matches.push({
          ...availableImage,
          total_score: score.total_score,
          criteria: score.criteria
        });
      }
    }
    
    // Sort by score (highest first)
    matches.sort((a, b) => b.total_score - a.total_score);
    
    // Return top 3 matches
    return matches.slice(0, 3);
  }

  calculateMatchScore(missingImage, availableImage) {
    const criteria = {};
    let totalScore = 0;
    
    // 1. Exact filename match (highest priority)
    const missingFilename = path.basename(missingImage.missing_image_path, path.extname(missingImage.missing_image_path));
    const availableFilename = path.basename(availableImage.filename, path.extname(availableImage.filename));
    
    if (missingFilename === availableFilename) {
      criteria.exact_filename_match = this.weights.exact_filename_match;
      totalScore += this.weights.exact_filename_match;
    }
    
    // 2. Page context match
    const pageMatch = this.calculatePageContextMatch(missingImage, availableImage);
    if (pageMatch > 0) {
      criteria.page_context_match = pageMatch;
      totalScore += pageMatch;
    }
    
    // 3. Category/type match
    const categoryMatch = this.calculateCategoryMatch(missingImage, availableImage);
    if (categoryMatch > 0) {
      criteria.category_match = categoryMatch;
      totalScore += categoryMatch;
    }
    
    // 4. Keyword matching in filenames and descriptions
    const keywordMatch = this.calculateKeywordMatch(missingImage, availableImage);
    if (keywordMatch > 0) {
      criteria.keyword_match = keywordMatch;
      totalScore += keywordMatch;
    }
    
    // 5. Alt text similarity
    const altTextMatch = this.calculateAltTextMatch(missingImage, availableImage);
    if (altTextMatch > 0) {
      criteria.alt_text_match = altTextMatch;
      totalScore += altTextMatch;
    }
    
    // 6. Dimension compatibility
    const dimensionMatch = this.calculateDimensionMatch(missingImage, availableImage);
    if (dimensionMatch > 0) {
      criteria.dimension_match = dimensionMatch;
      totalScore += dimensionMatch;
    }
    
    // 7. SEO score bonus
    const seoScore = parseInt(availableImage.seo_score) || 0;
    if (seoScore >= 80) {
      criteria.seo_score_bonus = this.weights.seo_score_bonus;
      totalScore += this.weights.seo_score_bonus;
    }
    
    return {
      total_score: Math.round(totalScore),
      criteria: criteria
    };
  }

  calculatePageContextMatch(missingImage, availableImage) {
    const missingPage = missingImage.page_name?.toLowerCase() || '';
    const availablePage = availableImage.intended_page?.toLowerCase() || '';
    
    if (missingPage === availablePage) {
      return this.weights.page_context_match;
    }
    
    // Partial matches
    const pageKeywords = {
      'homepage': ['home', 'index', 'main'],
      'products': ['product', 'total-essential', 'supplement'],
      'benefits': ['benefit', 'health', 'wellness'],
      'ingredients': ['ingredient', 'natural', 'organic']
    };
    
    for (const [page, keywords] of Object.entries(pageKeywords)) {
      if (missingPage.includes(page) && keywords.some(keyword => availablePage.includes(keyword))) {
        return this.weights.page_context_match * 0.7; // Partial match
      }
    }
    
    return 0;
  }

  calculateCategoryMatch(missingImage, availableImage) {
    const missingContext = (missingImage.context || '').toLowerCase();
    const availableCategory = (availableImage.category || '').toLowerCase();
    
    // Direct category matches
    const categoryMappings = {
      'hero': ['hero-banner', 'banner-image'],
      'product': ['product-image', 'product-showcase'],
      'testimonial': ['testimonial', 'avatar'],
      'ingredient': ['ingredient-image', 'natural'],
      'lifestyle': ['lifestyle-image', 'wellness'],
      'educational': ['educational-content', 'benefits-illustration']
    };
    
    for (const [key, categories] of Object.entries(categoryMappings)) {
      if (missingContext.includes(key) && categories.some(cat => availableCategory.includes(cat))) {
        return this.weights.category_match;
      }
    }
    
    return 0;
  }

  calculateKeywordMatch(missingImage, availableImage) {
    const missingKeywords = this.extractKeywords(missingImage.missing_image_path + ' ' + (missingImage.alt_text || ''));
    const availableKeywords = this.extractKeywords(availableImage.filename + ' ' + (availableImage.visual_description || ''));
    
    const commonKeywords = missingKeywords.filter(keyword => 
      availableKeywords.some(avail => avail.includes(keyword) || keyword.includes(avail))
    );
    
    if (commonKeywords.length > 0) {
      return Math.min(this.weights.keyword_match, commonKeywords.length * 10);
    }
    
    return 0;
  }

  extractKeywords(text) {
    const stopWords = ['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'a', 'an'];
    
    return text.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, ' ')
      .split(/[\s-]+/)
      .filter(word => word.length > 2 && !stopWords.includes(word))
      .filter(Boolean);
  }

  calculateAltTextMatch(missingImage, availableImage) {
    const missingAlt = (missingImage.alt_text || '').toLowerCase();
    const availableAlt = (availableImage.alt_text_suggestion || '').toLowerCase();
    
    if (!missingAlt || !availableAlt) return 0;
    
    const missingWords = missingAlt.split(/\s+/);
    const availableWords = availableAlt.split(/\s+/);
    
    const commonWords = missingWords.filter(word => 
      availableWords.some(avail => avail.includes(word) || word.includes(avail))
    );
    
    if (commonWords.length > 0) {
      return Math.min(this.weights.alt_text_match, commonWords.length * 8);
    }
    
    return 0;
  }

  calculateDimensionMatch(missingImage, availableImage) {
    const missingDimensions = missingImage.dimensions || '';
    const availableDimensions = availableImage.dimensions || '';
    
    if (!missingDimensions || !availableDimensions) return 0;
    
    // Extract width and height
    const missingMatch = missingDimensions.match(/(\d+)x(\d+)/);
    const availableMatch = availableDimensions.match(/(\d+)x(\d+)/);
    
    if (!missingMatch || !availableMatch) return 0;
    
    const missingWidth = parseInt(missingMatch[1]);
    const missingHeight = parseInt(missingMatch[2]);
    const availableWidth = parseInt(availableMatch[1]);
    const availableHeight = parseInt(availableMatch[2]);
    
    // Calculate aspect ratio similarity
    const missingRatio = missingWidth / missingHeight;
    const availableRatio = availableWidth / availableHeight;
    
    const ratioDiff = Math.abs(missingRatio - availableRatio);
    
    if (ratioDiff < 0.1) {
      return this.weights.dimension_match;
    } else if (ratioDiff < 0.3) {
      return this.weights.dimension_match * 0.5;
    }
    
    return 0;
  }

  generateRecommendation(missingImage, bestMatch) {
    if (!bestMatch) {
      return {
        action: 'manual_review',
        priority: 'high',
        message: 'No suitable automatic match found. Manual review required.',
        suggestions: [
          'Check if a custom image needs to be created',
          'Review similar pages for image inspiration',
          'Consider using a generic placeholder temporarily'
        ]
      };
    }
    
    const confidence = bestMatch.total_score;
    
    if (confidence >= 80) {
      return {
        action: 'auto_replace',
        priority: 'high',
        message: `High confidence match found. Safe to replace automatically.`,
        implementation: `Replace "${missingImage.missing_image_path}" with "${bestMatch.file_path}"`,
        alt_text: bestMatch.alt_text_suggestion
      };
    } else if (confidence >= 50) {
      return {
        action: 'review_and_replace',
        priority: 'medium',
        message: `Good match found but requires review before implementation.`,
        implementation: `Consider replacing "${missingImage.missing_image_path}" with "${bestMatch.file_path}"`,
        alt_text: bestMatch.alt_text_suggestion,
        review_notes: `Match score: ${confidence}. Please verify visual compatibility.`
      };
    } else {
      return {
        action: 'manual_review',
        priority: 'low',
        message: `Low confidence match. Manual review recommended.`,
        suggestions: [
          `Potential match: ${bestMatch.file_path} (score: ${confidence})`,
          'Consider creating a more specific image',
          'Review page context for better matching'
        ]
      };
    }
  }

  async generateMappingReport() {
    console.log('\n📊 Generating image mapping report...');
    
    // Sort by confidence score
    this.mappingResults.sort((a, b) => b.confidence_score - a.confidence_score);
    
    // Export detailed mapping CSV
    await this.exportMappingCSV();
    
    // Generate implementation guide
    await this.generateImplementationGuide();
    
    // Generate summary statistics
    await this.generateMappingSummary();
    
    console.log('✅ Image mapping report generated successfully');
  }

  async exportMappingCSV() {
    const csvHeaders = [
      'missing_page',
      'missing_image_path',
      'missing_alt_text',
      'missing_priority',
      'best_match_filename',
      'best_match_path',
      'confidence_score',
      'recommendation_action',
      'recommendation_priority',
      'implementation_notes',
      'suggested_alt_text',
      'matching_criteria'
    ];
    
    const csvRows = [csvHeaders.join(',')];
    
    for (const result of this.mappingResults) {
      const missing = result.missing_image;
      const match = result.best_match;
      const rec = result.recommendation;
      
      const row = [
        missing.page_name || '',
        missing.missing_image_path || '',
        missing.alt_text || '',
        missing.priority || '',
        match?.filename || 'No match',
        match?.file_path || 'No match',
        result.confidence_score || 0,
        rec.action || '',
        rec.priority || '',
        rec.message || '',
        rec.alt_text || match?.alt_text_suggestion || '',
        JSON.stringify(result.matching_criteria || {}).replace(/"/g, '""')
      ].map(value => `"${String(value).replace(/"/g, '""')}"`);
      
      csvRows.push(row.join(','));
    }
    
    const csvContent = csvRows.join('\n');
    const csvPath = path.join(this.outputDir, 'image-mapping-recommendations.csv');
    
    await fs.writeFile(csvPath, csvContent, 'utf8');
    console.log(`📄 Mapping recommendations CSV exported to: ${csvPath}`);
  }

  async generateImplementationGuide() {
    const guide = {
      high_priority_replacements: [],
      medium_priority_reviews: [],
      manual_review_required: [],
      implementation_steps: []
    };
    
    for (const result of this.mappingResults) {
      const rec = result.recommendation;
      const missing = result.missing_image;
      const match = result.best_match;
      
      if (rec.action === 'auto_replace') {
        guide.high_priority_replacements.push({
          page: missing.page_name,
          current: missing.missing_image_path,
          replacement: match.file_path,
          alt_text: rec.alt_text,
          confidence: result.confidence_score
        });
      } else if (rec.action === 'review_and_replace') {
        guide.medium_priority_reviews.push({
          page: missing.page_name,
          current: missing.missing_image_path,
          suggested: match.file_path,
          notes: rec.review_notes,
          confidence: result.confidence_score
        });
      } else {
        guide.manual_review_required.push({
          page: missing.page_name,
          current: missing.missing_image_path,
          suggestions: rec.suggestions,
          priority: rec.priority
        });
      }
    }
    
    // Generate implementation steps
    guide.implementation_steps = [
      '1. Review high-priority replacements and implement immediately',
      '2. Manually verify medium-priority suggestions before implementing',
      '3. Create or source new images for manual review items',
      '4. Update alt text according to recommendations',
      '5. Test all pages after implementation',
      '6. Run performance audit to ensure no regressions'
    ];
    
    const guidePath = path.join(this.outputDir, 'implementation-guide.json');
    await fs.writeFile(guidePath, JSON.stringify(guide, null, 2));
    console.log(`📋 Implementation guide saved to: ${guidePath}`);
  }

  async generateMappingSummary() {
    const summary = {
      total_missing_images: this.missingImages.length,
      total_available_images: this.inventory.length,
      matching_results: {
        high_confidence: 0,
        medium_confidence: 0,
        low_confidence: 0,
        no_match: 0
      },
      recommendations: {
        auto_replace: 0,
        review_and_replace: 0,
        manual_review: 0
      },
      coverage_percentage: 0
    };
    
    for (const result of this.mappingResults) {
      const confidence = result.confidence_score;
      const action = result.recommendation.action;
      
      // Confidence categories
      if (confidence >= 80) {
        summary.matching_results.high_confidence++;
      } else if (confidence >= 50) {
        summary.matching_results.medium_confidence++;
      } else if (confidence > 0) {
        summary.matching_results.low_confidence++;
      } else {
        summary.matching_results.no_match++;
      }
      
      // Recommendation categories
      summary.recommendations[action] = (summary.recommendations[action] || 0) + 1;
    }
    
    // Calculate coverage
    const matchedImages = summary.matching_results.high_confidence + summary.matching_results.medium_confidence;
    summary.coverage_percentage = Math.round((matchedImages / this.missingImages.length) * 100);
    
    const summaryPath = path.join(this.outputDir, 'mapping-summary.json');
    await fs.writeFile(summaryPath, JSON.stringify(summary, null, 2));
    console.log(`📊 Mapping summary saved to: ${summaryPath}`);
  }
}

// Main execution
async function runImageMapping() {
  const mapper = new ImageMappingSystem();
  
  try {
    await mapper.initialize();
    await mapper.performIntelligentMatching();
    await mapper.generateMappingReport();
    
    console.log('\n🎉 Cross-Reference Logic Implementation completed successfully!');
    console.log('📁 Results saved in: audit-results/');
    console.log('📄 Files generated:');
    console.log('  - image-mapping-recommendations.csv');
    console.log('  - implementation-guide.json');
    console.log('  - mapping-summary.json');
    
  } catch (error) {
    console.error('❌ Error during image mapping:', error);
  }
}

// Export for use in other scripts
module.exports = { ImageMappingSystem };

// Run if called directly
if (require.main === module) {
  runImageMapping();
}
