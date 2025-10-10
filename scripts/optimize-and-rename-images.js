#!/usr/bin/env node

/**
 * Image Optimization and Renaming Script for La Belle Vie
 * Renames all 60 Google FX images with SEO-optimized names and organizes them
 */

import fs from 'fs';
import path from 'path';

class ImageOptimizer {
  constructor() {
    this.sourceDir = path.join(process.cwd(), 'downloads', 'google-fx-all-images');
    this.outputDir = path.join(process.cwd(), 'public', 'images', 'seo-optimized');
    this.planFile = path.join(process.cwd(), 'image-optimization-plan', 'image-renaming-guide.csv');
    this.optimizationPlan = [];
    
    // Create output directory structure
    this.createDirectoryStructure();
  }

  createDirectoryStructure() {
    const directories = [
      this.outputDir,
      path.join(this.outputDir, 'homepage'),
      path.join(this.outputDir, 'products'),
      path.join(this.outputDir, 'benefits'),
      path.join(this.outputDir, 'ingredients'),
      path.join(this.outputDir, 'blog'),
      path.join(this.outputDir, 'social'),
      path.join(this.outputDir, 'webp'),
      path.join(this.outputDir, 'thumbnails')
    ];

    directories.forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`📁 Created directory: ${path.relative(process.cwd(), dir)}`);
      }
    });
  }

  loadOptimizationPlan() {
    console.log('📋 Loading optimization plan...');
    
    if (!fs.existsSync(this.planFile)) {
      throw new Error(`Plan file not found: ${this.planFile}`);
    }

    const csvContent = fs.readFileSync(this.planFile, 'utf-8');
    const lines = csvContent.split('\n').slice(1); // Skip header
    
    this.optimizationPlan = lines
      .filter(line => line.trim())
      .map(line => {
        // Parse CSV line (handling quoted fields)
        const matches = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
        if (!matches || matches.length < 7) return null;
        
        return {
          originalFile: matches[0].replace(/"/g, ''),
          seoFilename: matches[1].replace(/"/g, ''),
          page: matches[2].replace(/"/g, ''),
          primaryKeyword: matches[3].replace(/"/g, ''),
          imageType: matches[4].replace(/"/g, ''),
          altText: matches[5].replace(/"/g, ''),
          seoScore: parseInt(matches[6]) || 0
        };
      })
      .filter(Boolean);

    console.log(`✅ Loaded ${this.optimizationPlan.length} image optimization instructions`);
    return this.optimizationPlan;
  }

  async optimizeImages() {
    console.log('🖼️  Starting image optimization and renaming...');
    
    let processedCount = 0;
    let errorCount = 0;
    const results = [];

    for (const plan of this.optimizationPlan) {
      try {
        const result = await this.processImage(plan);
        results.push(result);
        processedCount++;
        
        if (processedCount % 10 === 0) {
          console.log(`📊 Progress: ${processedCount}/${this.optimizationPlan.length} images processed`);
        }
        
      } catch (error) {
        console.error(`❌ Error processing ${plan.originalFile}: ${error.message}`);
        errorCount++;
      }
    }

    console.log(`\n🎉 Image optimization complete!`);
    console.log(`✅ Successfully processed: ${processedCount} images`);
    console.log(`❌ Errors: ${errorCount} images`);

    return results;
  }

  async processImage(plan) {
    const sourcePath = path.join(this.sourceDir, plan.originalFile);
    
    if (!fs.existsSync(sourcePath)) {
      throw new Error(`Source file not found: ${plan.originalFile}`);
    }

    // Determine output directory based on page
    const pageDir = this.getPageDirectory(plan.page);
    const outputPath = path.join(pageDir, plan.seoFilename);

    // Copy and rename the image
    fs.copyFileSync(sourcePath, outputPath);
    
    // Get file stats
    const stats = fs.statSync(outputPath);
    
    console.log(`✅ ${plan.originalFile} → ${plan.seoFilename}`);
    
    return {
      originalFile: plan.originalFile,
      seoFilename: plan.seoFilename,
      outputPath: outputPath,
      page: plan.page,
      imageType: plan.imageType,
      altText: plan.altText,
      seoScore: plan.seoScore,
      fileSize: stats.size,
      processed: true
    };
  }

  getPageDirectory(page) {
    const pageMapping = {
      'homepage': path.join(this.outputDir, 'homepage'),
      'total-essential': path.join(this.outputDir, 'products'),
      'total-essential-plus': path.join(this.outputDir, 'products'),
      'benefits': path.join(this.outputDir, 'benefits'),
      'ingredients': path.join(this.outputDir, 'ingredients'),
      'blog': path.join(this.outputDir, 'blog'),
      'social': path.join(this.outputDir, 'social')
    };

    return pageMapping[page] || this.outputDir;
  }

  generateImplementationGuide(results) {
    console.log('📝 Generating implementation guide...');
    
    const guide = {
      metadata: {
        generated: new Date().toISOString(),
        totalImages: results.length,
        outputDirectory: this.outputDir
      },
      
      // Group by page for easy implementation
      pageImplementations: this.groupResultsByPage(results),
      
      // React component updates needed
      componentUpdates: this.generateComponentUpdates(results),
      
      // Playwright test cases
      testCases: this.generateTestCases(results),
      
      // Next steps
      nextSteps: [
        '1. Review optimized images in public/images/seo-optimized/',
        '2. Update React components with new image paths',
        '3. Add proper alt tags using the provided text',
        '4. Implement lazy loading for performance',
        '5. Run Playwright tests to verify functionality',
        '6. Monitor Core Web Vitals after deployment'
      ]
    };

    // Save implementation guide
    const guidePath = path.join(this.outputDir, 'implementation-guide.json');
    fs.writeFileSync(guidePath, JSON.stringify(guide, null, 2));
    
    // Save React component snippets
    this.generateReactSnippets(results);
    
    console.log(`📋 Implementation guide saved: ${guidePath}`);
    return guide;
  }

  groupResultsByPage(results) {
    const grouped = {};
    
    results.forEach(result => {
      if (!grouped[result.page]) {
        grouped[result.page] = [];
      }
      grouped[result.page].push(result);
    });

    return grouped;
  }

  generateComponentUpdates(results) {
    const updates = [];
    
    // Group by page and generate specific component updates
    const pageGroups = this.groupResultsByPage(results);
    
    Object.entries(pageGroups).forEach(([page, images]) => {
      const heroImages = images.filter(img => img.imageType === 'hero');
      const productImages = images.filter(img => img.imageType === 'product');
      
      if (heroImages.length > 0) {
        updates.push({
          component: `${page} Hero Component`,
          file: `src/components/pages/${page}.tsx`,
          images: heroImages.map(img => ({
            path: `/images/seo-optimized/${this.getRelativePath(img.outputPath)}`,
            alt: img.altText,
            seoScore: img.seoScore
          }))
        });
      }
      
      if (productImages.length > 0) {
        updates.push({
          component: `${page} Product Gallery`,
          file: `src/components/pages/${page}.tsx`,
          images: productImages.map(img => ({
            path: `/images/seo-optimized/${this.getRelativePath(img.outputPath)}`,
            alt: img.altText,
            seoScore: img.seoScore
          }))
        });
      }
    });

    return updates;
  }

  generateTestCases(results) {
    return results.map(result => ({
      name: `Test ${result.seoFilename} loads correctly`,
      page: result.page,
      imagePath: `/images/seo-optimized/${this.getRelativePath(result.outputPath)}`,
      altText: result.altText,
      checks: [
        'Image is visible',
        'Image loads without errors',
        'Alt text is present and correct',
        'Image has proper dimensions',
        'SEO attributes are correct'
      ]
    }));
  }

  generateReactSnippets(results) {
    console.log('⚛️  Generating React component snippets...');
    
    const pageGroups = this.groupResultsByPage(results);
    
    Object.entries(pageGroups).forEach(([page, images]) => {
      const snippets = images.map(img => {
        const relativePath = this.getRelativePath(img.outputPath);
        return `<Image
  src="/images/seo-optimized/${relativePath}"
  alt="${img.altText}"
  width={1408}
  height={768}
  priority={${img.imageType === 'hero' ? 'true' : 'false'}}
  className="rounded-lg"
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
/>`;
      });

      const snippetFile = path.join(this.outputDir, `${page}-react-snippets.txt`);
      fs.writeFileSync(snippetFile, snippets.join('\n\n'));
      console.log(`⚛️  React snippets saved: ${page}-react-snippets.txt`);
    });
  }

  getRelativePath(fullPath) {
    const seoOptimizedIndex = fullPath.indexOf('seo-optimized');
    return fullPath.substring(seoOptimizedIndex + 'seo-optimized/'.length);
  }

  generateSummaryReport(results) {
    const summary = {
      totalImages: results.length,
      averageSEOScore: results.reduce((sum, r) => sum + r.seoScore, 0) / results.length,
      totalFileSize: results.reduce((sum, r) => sum + r.fileSize, 0),
      pageDistribution: {},
      typeDistribution: {},
      highPriorityImages: results.filter(r => r.seoScore >= 90).length
    };

    results.forEach(result => {
      summary.pageDistribution[result.page] = (summary.pageDistribution[result.page] || 0) + 1;
      summary.typeDistribution[result.imageType] = (summary.typeDistribution[result.imageType] || 0) + 1;
    });

    console.log('\n📊 Optimization Summary:');
    console.log('========================');
    console.log(`Total images processed: ${summary.totalImages}`);
    console.log(`Average SEO score: ${summary.averageSEOScore.toFixed(1)}/100`);
    console.log(`High priority images (90+ score): ${summary.highPriorityImages}`);
    console.log(`Total file size: ${(summary.totalFileSize / 1024 / 1024).toFixed(2)} MB`);
    
    console.log('\nPage distribution:');
    Object.entries(summary.pageDistribution).forEach(([page, count]) => {
      console.log(`  ${page}: ${count} images`);
    });

    return summary;
  }
}

// Main execution
async function optimizeImages() {
  const optimizer = new ImageOptimizer();
  
  try {
    optimizer.loadOptimizationPlan();
    const results = await optimizer.optimizeImages();
    const guide = optimizer.generateImplementationGuide(results);
    const summary = optimizer.generateSummaryReport(results);
    
    console.log('\n🎉 Image optimization complete!');
    console.log('📁 Optimized images location: public/images/seo-optimized/');
    console.log('📋 Implementation guide: public/images/seo-optimized/implementation-guide.json');
    console.log('⚛️  React snippets: public/images/seo-optimized/*-react-snippets.txt');
    console.log('\n🚀 Ready for frontend integration and Playwright testing!');
    
  } catch (error) {
    console.error('❌ Optimization failed:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  optimizeImages();
}

export default ImageOptimizer;
