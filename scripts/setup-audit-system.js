#!/usr/bin/env node

/**
 * Setup Script for Comprehensive Image Audit System
 * 
 * This script helps users set up the image audit system by:
 * - Checking prerequisites
 * - Installing dependencies
 * - Verifying configuration
 * - Running initial tests
 */

const fs = require('fs').promises;
const path = require('path');
const { execSync } = require('child_process');

class AuditSystemSetup {
  constructor() {
    this.projectRoot = path.resolve(process.cwd(), '..');
    this.scriptsDir = process.cwd();
    this.checks = [];
    this.errors = [];
    this.warnings = [];
  }

  async run() {
    console.log('🚀 Setting up Comprehensive Image Audit System');
    console.log('='.repeat(60));
    
    await this.checkEnvironment();
    await this.checkDirectories();
    await this.installDependencies();
    await this.setupGoogleSheets();
    await this.runTests();
    await this.generateReport();
    
    console.log('\n🎉 Setup completed!');
    this.printNextSteps();
  }

  async checkEnvironment() {
    console.log('\n🔍 Checking environment...');
    
    // Check Node.js version
    const nodeVersion = process.version;
    const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
    
    if (majorVersion >= 16) {
      this.logSuccess(`Node.js version: ${nodeVersion} ✅`);
    } else {
      this.logError(`Node.js version ${nodeVersion} is too old. Requires 16+`);
    }
    
    // Check if we're in the right directory
    const packageJsonExists = await this.fileExists(path.join(this.projectRoot, 'package.json'));
    if (packageJsonExists) {
      this.logSuccess('Project root detected ✅');
    } else {
      this.logWarning('Could not detect project root. Make sure you\'re in the scripts directory');
    }
    
    // Check if development server is available
    try {
      const response = await fetch('http://localhost:3000');
      if (response.ok) {
        this.logSuccess('Development server running ✅');
      } else {
        this.logWarning('Development server not responding. Start with "npm run dev"');
      }
    } catch (error) {
      this.logWarning('Development server not running. Start with "npm run dev"');
    }
  }

  async checkDirectories() {
    console.log('\n📁 Checking directories...');
    
    const requiredDirs = [
      {
        path: path.join(this.projectRoot, 'public', 'images', 'seo-optimized'),
        name: 'SEO Optimized Images',
        required: true
      },
      {
        path: path.join(this.projectRoot, 'public', 'assets'),
        name: 'Assets Directory',
        required: false
      },
      {
        path: path.join(this.scriptsDir, 'audit-results'),
        name: 'Audit Results',
        required: false,
        create: true
      }
    ];
    
    for (const dir of requiredDirs) {
      const exists = await this.directoryExists(dir.path);
      
      if (exists) {
        // Count files in directory
        try {
          const files = await fs.readdir(dir.path);
          const imageFiles = files.filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f));
          this.logSuccess(`${dir.name}: ${imageFiles.length} images found ✅`);
        } catch (error) {
          this.logSuccess(`${dir.name}: Directory exists ✅`);
        }
      } else if (dir.create) {
        try {
          await fs.mkdir(dir.path, { recursive: true });
          this.logSuccess(`${dir.name}: Created ✅`);
        } catch (error) {
          this.logError(`Failed to create ${dir.name}: ${error.message}`);
        }
      } else if (dir.required) {
        this.logError(`${dir.name}: Not found (required)`);
      } else {
        this.logWarning(`${dir.name}: Not found (optional)`);
      }
    }
  }

  async installDependencies() {
    console.log('\n📦 Installing dependencies...');
    
    const dependencies = ['playwright', 'sharp', 'googleapis'];
    
    for (const dep of dependencies) {
      try {
        require.resolve(dep);
        this.logSuccess(`${dep}: Already installed ✅`);
      } catch (error) {
        console.log(`Installing ${dep}...`);
        try {
          execSync(`npm install ${dep}`, { stdio: 'inherit', cwd: this.scriptsDir });
          this.logSuccess(`${dep}: Installed ✅`);
        } catch (installError) {
          this.logError(`Failed to install ${dep}: ${installError.message}`);
        }
      }
    }
    
    // Install Playwright browsers
    try {
      console.log('Installing Playwright browsers...');
      execSync('npx playwright install', { stdio: 'inherit', cwd: this.scriptsDir });
      this.logSuccess('Playwright browsers: Installed ✅');
    } catch (error) {
      this.logError(`Failed to install Playwright browsers: ${error.message}`);
    }
  }

  async setupGoogleSheets() {
    console.log('\n📊 Setting up Google Sheets integration...');
    
    const credentialPaths = [
      path.join(this.scriptsDir, 'google-credentials.json'),
      path.join(this.scriptsDir, 'credentials', 'google-sheets.json'),
      path.join(this.projectRoot, 'google-credentials.json')
    ];
    
    let credentialsFound = false;
    
    for (const credPath of credentialPaths) {
      if (await this.fileExists(credPath)) {
        this.logSuccess(`Google Sheets credentials: Found at ${credPath} ✅`);
        credentialsFound = true;
        break;
      }
    }
    
    if (!credentialsFound) {
      this.logWarning('Google Sheets credentials: Not found (optional)');
      console.log('  To enable Google Sheets integration:');
      console.log('  1. Create a Google Cloud Project');
      console.log('  2. Enable Google Sheets API');
      console.log('  3. Create service account credentials');
      console.log('  4. Save as google-credentials.json in scripts directory');
    }
    
    // Check environment variable
    if (process.env.GOOGLE_SHEETS_CREDENTIALS) {
      this.logSuccess('Google Sheets credentials: Found in environment ✅');
    }
  }

  async runTests() {
    console.log('\n🧪 Running tests...');
    
    // Test image directory access
    try {
      const seoDir = path.join(this.projectRoot, 'public', 'images', 'seo-optimized');
      const files = await fs.readdir(seoDir);
      const imageFiles = files.filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f));
      
      if (imageFiles.length > 0) {
        this.logSuccess(`Image access test: ${imageFiles.length} images accessible ✅`);
      } else {
        this.logWarning('Image access test: No images found in seo-optimized directory');
      }
    } catch (error) {
      this.logError(`Image access test failed: ${error.message}`);
    }
    
    // Test script syntax
    const scripts = [
      'image-audit-system.js',
      'missing-images-audit.js', 
      'image-mapping-system.js',
      'google-sheets-integration.js',
      'comprehensive-image-audit.js'
    ];
    
    for (const script of scripts) {
      try {
        require(path.join(this.scriptsDir, script));
        this.logSuccess(`${script}: Syntax OK ✅`);
      } catch (error) {
        this.logError(`${script}: Syntax error - ${error.message}`);
      }
    }
  }

  async generateReport() {
    const report = {
      setup_date: new Date().toISOString(),
      environment: {
        node_version: process.version,
        platform: process.platform,
        cwd: process.cwd()
      },
      checks: this.checks,
      errors: this.errors,
      warnings: this.warnings,
      ready_to_run: this.errors.length === 0
    };
    
    const reportPath = path.join(this.scriptsDir, 'setup-report.json');
    await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
    
    console.log(`\n📋 Setup report saved to: ${reportPath}`);
  }

  printNextSteps() {
    console.log('\n🚀 Next Steps:');
    
    if (this.errors.length === 0) {
      console.log('✅ System is ready! You can now run:');
      console.log('');
      console.log('  # Run complete audit');
      console.log('  node comprehensive-image-audit.js');
      console.log('');
      console.log('  # Run individual phases');
      console.log('  node comprehensive-image-audit.js --phase1');
      console.log('  node comprehensive-image-audit.js --phase2');
      console.log('  node comprehensive-image-audit.js --phase3');
      console.log('  node comprehensive-image-audit.js --phase4');
      console.log('');
      console.log('  # Get help');
      console.log('  node comprehensive-image-audit.js --help');
    } else {
      console.log('⚠️  Please fix the following errors before running:');
      this.errors.forEach(error => {
        console.log(`  ❌ ${error}`);
      });
    }
    
    if (this.warnings.length > 0) {
      console.log('\n💡 Optional improvements:');
      this.warnings.forEach(warning => {
        console.log(`  ⚠️  ${warning}`);
      });
    }
    
    console.log('\n📖 For detailed documentation, see: scripts/README.md');
  }

  async fileExists(filePath) {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  async directoryExists(dirPath) {
    try {
      const stat = await fs.stat(dirPath);
      return stat.isDirectory();
    } catch {
      return false;
    }
  }

  logSuccess(message) {
    console.log(`  ✅ ${message}`);
    this.checks.push({ type: 'success', message });
  }

  logWarning(message) {
    console.log(`  ⚠️  ${message}`);
    this.warnings.push(message);
    this.checks.push({ type: 'warning', message });
  }

  logError(message) {
    console.log(`  ❌ ${message}`);
    this.errors.push(message);
    this.checks.push({ type: 'error', message });
  }
}

// Run setup if called directly
if (require.main === module) {
  const setup = new AuditSystemSetup();
  setup.run().catch(error => {
    console.error('💥 Setup failed:', error);
    process.exit(1);
  });
}

module.exports = { AuditSystemSetup };
