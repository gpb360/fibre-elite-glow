#!/usr/bin/env node

/**
 * Comprehensive Image Audit and Mapping System
 * Main Orchestrator Script
 * 
 * This is the main entry point that runs all phases of the image audit system:
 * 1. Phase 1: New Images Inventory
 * 2. Phase 2: Missing Images Cross-Reference  
 * 3. Cross-Reference Logic Implementation
 * 4. Google Sheets Integration & CSV Export
 */

const { ImageInventorySystem } = require('./image-audit-system');
const { MissingImagesAudit } = require('./missing-images-audit');
const { ImageMappingSystem } = require('./image-mapping-system');
const { GoogleSheetsIntegration } = require('./google-sheets-integration');
const fs = require('fs').promises;
const path = require('path');

class ComprehensiveImageAudit {
  constructor() {
    this.outputDir = path.join(process.cwd(), 'audit-results');
    this.startTime = new Date();
    this.results = {
      phase1: null,
      phase2: null,
      phase3: null,
      phase4: null,
      errors: []
    };
  }

  async initialize() {
    console.log('🚀 Starting Comprehensive Image Audit and Mapping System');
    console.log('=' .repeat(80));
    console.log(`📅 Started at: ${this.startTime.toISOString()}`);
    console.log(`📁 Output directory: ${this.outputDir}`);
    console.log('=' .repeat(80));
    
    // Ensure output directory exists
    await fs.mkdir(this.outputDir, { recursive: true });
    
    // Check prerequisites
    await this.checkPrerequisites();
  }

  async checkPrerequisites() {
    console.log('\n🔍 Checking prerequisites...');
    
    const checks = [
      {
        name: 'SEO Optimized Images Directory',
        path: path.join(process.cwd(), 'public', 'images', 'seo-optimized'),
        required: true
      },
      {
        name: 'Development Server',
        url: 'http://localhost:3000',
        required: true
      },
      {
        name: 'Sharp Package',
        package: 'sharp',
        required: true
      },
      {
        name: 'Playwright Package',
        package: 'playwright',
        required: true
      }
    ];
    
    for (const check of checks) {
      try {
        if (check.path) {
          await fs.access(check.path);
          console.log(`✅ ${check.name}: Found`);
        } else if (check.url) {
          // Check if development server is running
          try {
            const response = await fetch(check.url);
            if (response.ok) {
              console.log(`✅ ${check.name}: Running`);
            } else {
              throw new Error('Server not responding');
            }
          } catch (error) {
            console.log(`⚠️  ${check.name}: Not running (please start with 'npm run dev')`);
            if (check.required) {
              console.log('   This is required for Phase 2 (Missing Images Audit)');
            }
          }
        } else if (check.package) {
          require.resolve(check.package);
          console.log(`✅ ${check.name}: Installed`);
        }
      } catch (error) {
        console.log(`❌ ${check.name}: ${error.message}`);
        if (check.required) {
          this.results.errors.push(`Missing prerequisite: ${check.name}`);
        }
      }
    }
    
    if (this.results.errors.length > 0) {
      console.log('\n⚠️  Some prerequisites are missing. The audit will continue but some phases may fail.');
    }
  }

  async runPhase1() {
    console.log('\n' + '='.repeat(80));
    console.log('📊 PHASE 1: NEW IMAGES INVENTORY');
    console.log('='.repeat(80));
    
    try {
      const system = new ImageInventorySystem();
      await system.initialize();
      await system.scanImageDirectory();
      await system.generateInventoryReport();
      await system.cleanup();
      
      this.results.phase1 = {
        status: 'completed',
        message: 'New images inventory completed successfully',
        files: [
          'new-images-inventory.csv',
          'inventory-summary.json'
        ]
      };
      
      console.log('✅ Phase 1 completed successfully');
      
    } catch (error) {
      console.error('❌ Phase 1 failed:', error.message);
      this.results.phase1 = {
        status: 'failed',
        error: error.message
      };
      this.results.errors.push(`Phase 1: ${error.message}`);
    }
  }

  async runPhase2() {
    console.log('\n' + '='.repeat(80));
    console.log('🕷️  PHASE 2: MISSING IMAGES CROSS-REFERENCE');
    console.log('='.repeat(80));
    
    try {
      const audit = new MissingImagesAudit();
      await audit.initialize();
      await audit.crawlAllPages();
      await audit.generateMissingImagesReport();
      await audit.cleanup();
      
      this.results.phase2 = {
        status: 'completed',
        message: 'Missing images audit completed successfully',
        files: [
          'missing-images-audit.csv',
          'missing-images-summary.json'
        ]
      };
      
      console.log('✅ Phase 2 completed successfully');
      
    } catch (error) {
      console.error('❌ Phase 2 failed:', error.message);
      this.results.phase2 = {
        status: 'failed',
        error: error.message
      };
      this.results.errors.push(`Phase 2: ${error.message}`);
    }
  }

  async runPhase3() {
    console.log('\n' + '='.repeat(80));
    console.log('🧠 PHASE 3: CROSS-REFERENCE LOGIC IMPLEMENTATION');
    console.log('='.repeat(80));
    
    try {
      const mapper = new ImageMappingSystem();
      await mapper.initialize();
      await mapper.performIntelligentMatching();
      await mapper.generateMappingReport();
      
      this.results.phase3 = {
        status: 'completed',
        message: 'Image mapping completed successfully',
        files: [
          'image-mapping-recommendations.csv',
          'implementation-guide.json',
          'mapping-summary.json'
        ]
      };
      
      console.log('✅ Phase 3 completed successfully');
      
    } catch (error) {
      console.error('❌ Phase 3 failed:', error.message);
      this.results.phase3 = {
        status: 'failed',
        error: error.message
      };
      this.results.errors.push(`Phase 3: ${error.message}`);
    }
  }

  async runPhase4() {
    console.log('\n' + '='.repeat(80));
    console.log('📊 PHASE 4: GOOGLE SHEETS INTEGRATION & CSV EXPORT');
    console.log('='.repeat(80));
    
    try {
      const integration = new GoogleSheetsIntegration();
      await integration.initialize();
      await integration.exportEnhancedCSVs();
      const spreadsheetId = await integration.createComprehensiveSpreadsheet();
      await integration.generateFinalReport();
      
      this.results.phase4 = {
        status: 'completed',
        message: 'Google Sheets integration completed successfully',
        spreadsheetId: spreadsheetId,
        files: [
          'enhanced-new-images-inventory.csv',
          'enhanced-missing-images-audit.csv',
          'enhanced-image-mapping-recommendations.csv',
          'master-summary.csv',
          'FINAL-AUDIT-REPORT.md'
        ]
      };
      
      console.log('✅ Phase 4 completed successfully');
      
    } catch (error) {
      console.error('❌ Phase 4 failed:', error.message);
      this.results.phase4 = {
        status: 'failed',
        error: error.message
      };
      this.results.errors.push(`Phase 4: ${error.message}`);
    }
  }

  async generateExecutiveSummary() {
    console.log('\n' + '='.repeat(80));
    console.log('📋 GENERATING EXECUTIVE SUMMARY');
    console.log('='.repeat(80));
    
    const endTime = new Date();
    const duration = Math.round((endTime - this.startTime) / 1000);
    
    const summary = {
      execution: {
        start_time: this.startTime.toISOString(),
        end_time: endTime.toISOString(),
        duration_seconds: duration,
        duration_formatted: this.formatDuration(duration)
      },
      phases: {
        phase1: this.results.phase1,
        phase2: this.results.phase2,
        phase3: this.results.phase3,
        phase4: this.results.phase4
      },
      overall_status: this.results.errors.length === 0 ? 'success' : 'partial_success',
      errors: this.results.errors,
      deliverables: this.collectDeliverables(),
      next_steps: this.generateNextSteps()
    };
    
    // Save summary
    const summaryPath = path.join(this.outputDir, 'executive-summary.json');
    await fs.writeFile(summaryPath, JSON.stringify(summary, null, 2));
    
    // Print summary to console
    this.printExecutiveSummary(summary);
    
    return summary;
  }

  collectDeliverables() {
    const deliverables = [];
    
    Object.values(this.results).forEach(result => {
      if (result && result.files) {
        deliverables.push(...result.files);
      }
    });
    
    return [...new Set(deliverables)]; // Remove duplicates
  }

  generateNextSteps() {
    const steps = [];
    
    if (this.results.phase1?.status === 'completed') {
      steps.push('✅ Review new-images-inventory.csv for available images');
    }
    
    if (this.results.phase2?.status === 'completed') {
      steps.push('✅ Review missing-images-audit.csv for broken/missing images');
    }
    
    if (this.results.phase3?.status === 'completed') {
      steps.push('✅ Implement high-confidence image mappings from recommendations');
      steps.push('📋 Review medium-confidence mappings manually');
      steps.push('🔧 Create new images for manual review items');
    }
    
    if (this.results.phase4?.status === 'completed' && this.results.phase4.spreadsheetId) {
      steps.push(`📊 Review Google Spreadsheet: https://docs.google.com/spreadsheets/d/${this.results.phase4.spreadsheetId}`);
    }
    
    if (this.results.errors.length > 0) {
      steps.push('⚠️  Address failed phases and re-run if needed');
    }
    
    steps.push('🧪 Test all pages after implementing image changes');
    steps.push('📈 Run performance audit to ensure no regressions');
    
    return steps;
  }

  formatDuration(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    } else {
      return `${remainingSeconds}s`;
    }
  }

  printExecutiveSummary(summary) {
    console.log('\n🎉 COMPREHENSIVE IMAGE AUDIT COMPLETED');
    console.log('='.repeat(80));
    console.log(`⏱️  Total Duration: ${summary.execution.duration_formatted}`);
    console.log(`📊 Overall Status: ${summary.overall_status.toUpperCase()}`);
    console.log(`📁 Output Directory: ${this.outputDir}`);
    
    console.log('\n📋 PHASE RESULTS:');
    Object.entries(summary.phases).forEach(([phase, result]) => {
      const status = result?.status === 'completed' ? '✅' : '❌';
      const message = result?.message || result?.error || 'Unknown status';
      console.log(`  ${status} ${phase.toUpperCase()}: ${message}`);
    });
    
    if (summary.errors.length > 0) {
      console.log('\n⚠️  ERRORS ENCOUNTERED:');
      summary.errors.forEach(error => {
        console.log(`  ❌ ${error}`);
      });
    }
    
    console.log('\n📄 DELIVERABLES GENERATED:');
    summary.deliverables.forEach(file => {
      console.log(`  📄 ${file}`);
    });
    
    if (this.results.phase4?.spreadsheetId) {
      console.log(`\n🔗 GOOGLE SPREADSHEET:`);
      console.log(`  https://docs.google.com/spreadsheets/d/${this.results.phase4.spreadsheetId}`);
    }
    
    console.log('\n🚀 NEXT STEPS:');
    summary.next_steps.forEach(step => {
      console.log(`  ${step}`);
    });
    
    console.log('\n' + '='.repeat(80));
    console.log('🎯 AUDIT COMPLETE - Review the generated files and implement recommendations');
    console.log('='.repeat(80));
  }
}

// Main execution function
async function runComprehensiveAudit() {
  const audit = new ComprehensiveImageAudit();
  
  try {
    await audit.initialize();
    
    // Run all phases
    await audit.runPhase1();
    await audit.runPhase2();
    await audit.runPhase3();
    await audit.runPhase4();
    
    // Generate final summary
    await audit.generateExecutiveSummary();
    
  } catch (error) {
    console.error('💥 Critical error during audit:', error);
    process.exit(1);
  }
}

// CLI interface
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
🎯 Comprehensive Image Audit and Mapping System

Usage: node comprehensive-image-audit.js [options]

Options:
  --help, -h     Show this help message
  --phase1       Run only Phase 1 (New Images Inventory)
  --phase2       Run only Phase 2 (Missing Images Audit)
  --phase3       Run only Phase 3 (Cross-Reference Logic)
  --phase4       Run only Phase 4 (Google Sheets Integration)

Examples:
  node comprehensive-image-audit.js              # Run all phases
  node comprehensive-image-audit.js --phase1     # Run only inventory
  node comprehensive-image-audit.js --phase2     # Run only missing images audit

Prerequisites:
  - Development server running on http://localhost:3000
  - Images in public/images/seo-optimized/ directory
  - Node packages: playwright, sharp, googleapis (optional)

Output:
  All results are saved in the 'audit-results/' directory
    `);
    process.exit(0);
  }
  
  // Handle individual phase execution
  if (args.includes('--phase1')) {
    const { ImageInventorySystem } = require('./image-audit-system');
    const system = new ImageInventorySystem();
    system.initialize().then(() => system.scanImageDirectory()).then(() => system.generateInventoryReport()).then(() => system.cleanup());
  } else if (args.includes('--phase2')) {
    const { MissingImagesAudit } = require('./missing-images-audit');
    const audit = new MissingImagesAudit();
    audit.initialize().then(() => audit.crawlAllPages()).then(() => audit.generateMissingImagesReport()).then(() => audit.cleanup());
  } else if (args.includes('--phase3')) {
    const { ImageMappingSystem } = require('./image-mapping-system');
    const mapper = new ImageMappingSystem();
    mapper.initialize().then(() => mapper.performIntelligentMatching()).then(() => mapper.generateMappingReport());
  } else if (args.includes('--phase4')) {
    const { GoogleSheetsIntegration } = require('./google-sheets-integration');
    const integration = new GoogleSheetsIntegration();
    integration.initialize().then(() => integration.exportEnhancedCSVs()).then(() => integration.createComprehensiveSpreadsheet()).then(() => integration.generateFinalReport());
  } else {
    // Run all phases
    runComprehensiveAudit();
  }
}

module.exports = { ComprehensiveImageAudit };
