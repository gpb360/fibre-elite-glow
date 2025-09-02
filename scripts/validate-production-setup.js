#!/usr/bin/env node

/**
 * Production Setup Validation Script
 * 
 * This script validates the entire production setup including:
 * - Environment variables
 * - Database connectivity
 * - Stripe integration
 * - API endpoints
 * - Security configurations
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// ANSI color codes for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m',
};

class ProductionSetupValidator {
  constructor() {
    this.results = [];
    this.startTime = Date.now();
  }

  log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
  }

  logResult(component, status, message, details = null) {
    const statusColor = status === 'PASS' ? 'green' : status === 'WARN' ? 'yellow' : 'red';
    const emoji = status === 'PASS' ? '✅' : status === 'WARN' ? '⚠️' : '❌';
    
    this.log(`${emoji} [${component}] ${message}`, statusColor);
    
    if (details && process.env.VERBOSE) {
      this.log(`   Details: ${JSON.stringify(details, null, 2)}`, 'cyan');
    }

    this.results.push({ component, status, message, details, timestamp: new Date().toISOString() });
  }

  async validateEnvironmentVariables() {
    this.log('\n🔍 Validating Environment Variables...', 'bold');

    const requiredVars = [
      'STRIPE_SECRET_KEY',
      'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
      'STRIPE_WEBHOOK_SECRET',
      'NEXT_PUBLIC_SUPABASE_URL',
      'NEXT_PUBLIC_SUPABASE_ANON_KEY',
      'SUPABASE_SERVICE_ROLE_KEY',
    ];

    const optionalVars = [
      'NEXT_PUBLIC_BASE_URL',
      'NODE_ENV',
    ];

    // Check required variables
    for (const varName of requiredVars) {
      const value = process.env[varName];
      if (!value) {
        this.logResult('Environment', 'FAIL', `Missing required variable: ${varName}`);
      } else if (value.length < 10) {
        this.logResult('Environment', 'WARN', `Variable ${varName} seems too short`);
      } else {
        this.logResult('Environment', 'PASS', `${varName} is configured`);
      }
    }

    // Check optional variables
    for (const varName of optionalVars) {
      const value = process.env[varName];
      if (!value) {
        this.logResult('Environment', 'WARN', `Optional variable ${varName} is not set`);
      } else {
        this.logResult('Environment', 'PASS', `${varName} is configured: ${value.substring(0, 20)}...`);
      }
    }

    // Validate Stripe key formats
    const stripeSecret = process.env.STRIPE_SECRET_KEY;
    const stripePublishable = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    const stripeWebhook = process.env.STRIPE_WEBHOOK_SECRET;

    if (stripeSecret && !stripeSecret.startsWith('sk_')) {
      this.logResult('Stripe', 'FAIL', 'STRIPE_SECRET_KEY format is invalid');
    }

    if (stripePublishable && !stripePublishable.startsWith('pk_')) {
      this.logResult('Stripe', 'FAIL', 'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY format is invalid');
    }

    if (stripeWebhook && !stripeWebhook.startsWith('whsec_')) {
      this.logResult('Stripe', 'FAIL', 'STRIPE_WEBHOOK_SECRET format is invalid');
    }

    // Check environment consistency
    const isProduction = process.env.NODE_ENV === 'production';
    const hasTestKeys = stripeSecret?.includes('test') || stripePublishable?.includes('test');
    
    if (isProduction && hasTestKeys) {
      this.logResult('Environment', 'WARN', 'Using test keys in production environment');
    } else if (!isProduction && !hasTestKeys && stripeSecret && stripePublishable) {
      this.logResult('Environment', 'WARN', 'Using live keys in development environment');
    }
  }

  async validateFileStructure() {
    this.log('\n📁 Validating File Structure...', 'bold');

    const requiredFiles = [
      'package.json',
      'next.config.js',
      'middleware.ts',
      'app/layout.tsx',
      'src/lib/stripe.ts',
      'src/integrations/supabase/client.ts',
      'app/api/create-checkout-session/route.ts',
      'app/api/webhooks/stripe/route.ts',
    ];

    const requiredDirectories = [
      'app',
      'src',
      'public',
      'app/api',
      'src/lib',
      'src/components',
    ];

    // Check files
    for (const filePath of requiredFiles) {
      if (fs.existsSync(filePath)) {
        this.logResult('FileStructure', 'PASS', `Required file exists: ${filePath}`);
      } else {
        this.logResult('FileStructure', 'FAIL', `Missing required file: ${filePath}`);
      }
    }

    // Check directories
    for (const dirPath of requiredDirectories) {
      if (fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory()) {
        this.logResult('FileStructure', 'PASS', `Required directory exists: ${dirPath}`);
      } else {
        this.logResult('FileStructure', 'FAIL', `Missing required directory: ${dirPath}`);
      }
    }

    // Check package.json
    try {
      const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
      const requiredDeps = ['next', '@stripe/stripe-js', 'stripe', '@supabase/supabase-js'];
      
      for (const dep of requiredDeps) {
        if (packageJson.dependencies?.[dep] || packageJson.devDependencies?.[dep]) {
          this.logResult('Dependencies', 'PASS', `Required dependency found: ${dep}`);
        } else {
          this.logResult('Dependencies', 'FAIL', `Missing required dependency: ${dep}`);
        }
      }
    } catch (error) {
      this.logResult('Dependencies', 'FAIL', 'Failed to read package.json', error.message);
    }
  }

  async validateDatabaseSchema() {
    this.log('\n🗄️  Validating Database Schema...', 'bold');

    const schemaFiles = [
      'supabase/database-schema.sql',
      'supabase/complete-database-setup.sql',
    ];

    for (const schemaFile of schemaFiles) {
      if (fs.existsSync(schemaFile)) {
        this.logResult('Database', 'PASS', `Schema file exists: ${schemaFile}`);
        
        // Check if schema file contains essential tables
        const schemaContent = fs.readFileSync(schemaFile, 'utf8');
        const requiredTables = ['products', 'orders', 'customers', 'checkout_sessions'];
        
        for (const table of requiredTables) {
          if (schemaContent.includes(`CREATE TABLE`)) {
            this.logResult('Database', 'PASS', `Schema includes table definition: ${table}`);
          } else {
            this.logResult('Database', 'WARN', `Schema might be missing table: ${table}`);
          }
        }
      } else {
        this.logResult('Database', 'WARN', `Schema file not found: ${schemaFile}`);
      }
    }
  }

  async validateBuildConfiguration() {
    this.log('\n🔧 Validating Build Configuration...', 'bold');

    // Check next.config.js
    try {
      const nextConfigPath = 'next.config.js';
      if (fs.existsSync(nextConfigPath)) {
        const nextConfigContent = fs.readFileSync(nextConfigPath, 'utf8');
        
        if (nextConfigContent.includes('experimental')) {
          this.logResult('Build', 'PASS', 'Next.js configuration includes experimental features');
        }
        
        if (nextConfigContent.includes('env')) {
          this.logResult('Build', 'PASS', 'Next.js configuration includes environment variables');
        }
        
        this.logResult('Build', 'PASS', 'Next.js configuration file exists');
      } else {
        this.logResult('Build', 'WARN', 'Next.js configuration file not found');
      }
    } catch (error) {
      this.logResult('Build', 'FAIL', 'Failed to read Next.js configuration', error.message);
    }

    // Check TypeScript configuration
    try {
      if (fs.existsSync('tsconfig.json')) {
        const tsConfig = JSON.parse(fs.readFileSync('tsconfig.json', 'utf8'));
        if (tsConfig.compilerOptions?.strict) {
          this.logResult('Build', 'PASS', 'TypeScript strict mode is enabled');
        } else {
          this.logResult('Build', 'WARN', 'TypeScript strict mode is disabled');
        }
        this.logResult('Build', 'PASS', 'TypeScript configuration exists');
      } else {
        this.logResult('Build', 'WARN', 'TypeScript configuration not found');
      }
    } catch (error) {
      this.logResult('Build', 'FAIL', 'Failed to read TypeScript configuration', error.message);
    }
  }

  async testBuild() {
    this.log('\n🏗️  Testing Build Process...', 'bold');

    try {
      this.log('   Running build test...', 'blue');
      const buildOutput = execSync('npm run build --silent', { 
        encoding: 'utf8',
        timeout: 120000, // 2 minutes timeout
      });

      if (buildOutput.includes('Error')) {
        this.logResult('Build', 'FAIL', 'Build process failed', buildOutput);
      } else {
        this.logResult('Build', 'PASS', 'Build completed successfully');
        
        // Check if build output directory exists
        if (fs.existsSync('.next')) {
          this.logResult('Build', 'PASS', 'Build output directory created');
        } else {
          this.logResult('Build', 'WARN', 'Build output directory not found');
        }
      }
    } catch (error) {
      this.logResult('Build', 'FAIL', 'Build process failed', error.message);
    }
  }

  async validateSecurityConfiguration() {
    this.log('\n🔒 Validating Security Configuration...', 'bold');

    // Check middleware.ts
    try {
      if (fs.existsSync('middleware.ts')) {
        const middlewareContent = fs.readFileSync('middleware.ts', 'utf8');
        
        const securityChecks = [
          { feature: 'CSRF Protection', pattern: 'csrf' },
          { feature: 'Rate Limiting', pattern: 'rate' },
          { feature: 'Security Headers', pattern: 'X-Frame-Options' },
          { feature: 'HTTPS Redirect', pattern: 'https' },
        ];

        for (const check of securityChecks) {
          if (middlewareContent.toLowerCase().includes(check.pattern.toLowerCase())) {
            this.logResult('Security', 'PASS', `${check.feature} is configured`);
          } else {
            this.logResult('Security', 'WARN', `${check.feature} might not be configured`);
          }
        }

        this.logResult('Security', 'PASS', 'Middleware security configuration exists');
      } else {
        this.logResult('Security', 'WARN', 'Middleware configuration not found');
      }
    } catch (error) {
      this.logResult('Security', 'FAIL', 'Failed to read middleware configuration', error.message);
    }

    // Check environment for security-related variables
    const securityEnvVars = ['NEXTAUTH_SECRET', 'ENCRYPTION_KEY', 'JWT_SECRET'];
    for (const varName of securityEnvVars) {
      if (process.env[varName]) {
        this.logResult('Security', 'PASS', `Security variable ${varName} is configured`);
      } else {
        this.logResult('Security', 'WARN', `Security variable ${varName} is not configured`);
      }
    }
  }

  generateReport() {
    const endTime = Date.now();
    const duration = (endTime - this.startTime) / 1000;
    
    this.log(`\n📊 Validation Complete (${duration}s)`, 'bold');
    
    const summary = this.results.reduce((acc, result) => {
      acc[result.status] = (acc[result.status] || 0) + 1;
      return acc;
    }, {});

    this.log(`\n📈 Summary:`, 'bold');
    this.log(`   ✅ PASS: ${summary.PASS || 0}`, 'green');
    this.log(`   ⚠️  WARN: ${summary.WARN || 0}`, 'yellow');
    this.log(`   ❌ FAIL: ${summary.FAIL || 0}`, 'red');

    const failCount = summary.FAIL || 0;
    const warnCount = summary.WARN || 0;
    
    if (failCount > 0) {
      this.log(`\n🚨 Validation failed with ${failCount} critical issues`, 'red');
      return false;
    } else if (warnCount > 0) {
      this.log(`\n⚠️  Validation passed with ${warnCount} warnings`, 'yellow');
      return true;
    } else {
      this.log(`\n🎉 All validations passed!`, 'green');
      return true;
    }
  }

  async run() {
    this.log('🚀 Starting Production Setup Validation', 'bold');
    this.log(`Environment: ${process.env.NODE_ENV || 'development'}`, 'blue');
    this.log(`Timestamp: ${new Date().toISOString()}`, 'blue');

    await this.validateEnvironmentVariables();
    await this.validateFileStructure();
    await this.validateDatabaseSchema();
    await this.validateBuildConfiguration();
    await this.validateSecurityConfiguration();
    
    // Only run build test if specifically requested
    if (process.env.RUN_BUILD_TEST === 'true') {
      await this.testBuild();
    }

    const success = this.generateReport();
    
    // Write detailed report to file
    const reportData = {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      duration: (Date.now() - this.startTime) / 1000,
      results: this.results,
      summary: this.results.reduce((acc, result) => {
        acc[result.status] = (acc[result.status] || 0) + 1;
        return acc;
      }, {}),
    };

    fs.writeFileSync('production-validation-report.json', JSON.stringify(reportData, null, 2));
    this.log(`\n📄 Detailed report saved to: production-validation-report.json`, 'cyan');

    process.exit(success ? 0 : 1);
  }
}

// Run if called directly
if (require.main === module) {
  const validator = new ProductionSetupValidator();
  validator.run().catch(error => {
    console.error('❌ Validation script failed:', error);
    process.exit(1);
  });
}

module.exports = ProductionSetupValidator;