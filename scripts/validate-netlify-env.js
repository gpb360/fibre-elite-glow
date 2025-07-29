#!/usr/bin/env node

/**
 * Netlify Environment Validation Script
 * Validates that all required environment variables are properly set for Stripe integration
 */

const chalk = require('chalk');

console.log(chalk.blue('🔍 Validating Netlify Environment Variables...\n'));

// Required environment variables for Stripe integration
const REQUIRED_VARS = {
  // Stripe Configuration
  'STRIPE_SECRET_KEY': {
    description: 'Stripe secret key for server-side operations',
    pattern: /^sk_(test_|live_)/,
    required: true
  },
  'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY': {
    description: 'Stripe publishable key for client-side operations',
    pattern: /^pk_(test_|live_)/,
    required: true
  },
  'STRIPE_WEBHOOK_SECRET': {
    description: 'Stripe webhook secret for webhook verification',
    pattern: /^whsec_/,
    required: false
  },
  
  // Application Configuration
  'NEXT_PUBLIC_BASE_URL': {
    description: 'Base URL for the application (used for redirects)',
    pattern: /^https?:\/\//,
    required: true
  },
  
  // Supabase Configuration
  'NEXT_PUBLIC_SUPABASE_URL': {
    description: 'Supabase project URL',
    pattern: /^https:\/\/.*\.supabase\.co$/,
    required: true
  },
  'NEXT_PUBLIC_SUPABASE_ANON_KEY': {
    description: 'Supabase anonymous key for client-side operations',
    pattern: /^eyJ/,
    required: true
  },
  'SUPABASE_SERVICE_ROLE_KEY': {
    description: 'Supabase service role key for server-side operations',
    pattern: /^eyJ/,
    required: false
  }
};

// Optional environment variables
const OPTIONAL_VARS = {
  'NEXT_PUBLIC_STRIPE_TEST_MODE': {
    description: 'Enable Stripe test mode',
    pattern: /^(true|false)$/,
    required: false
  },
  'NODE_ENV': {
    description: 'Node environment',
    pattern: /^(development|production|test)$/,
    required: false
  }
};

function validateEnvironment() {
  let hasErrors = false;
  let hasWarnings = false;
  
  console.log(chalk.yellow('📋 Required Environment Variables:\n'));
  
  // Check required variables
  Object.entries(REQUIRED_VARS).forEach(([varName, config]) => {
    const value = process.env[varName];
    
    if (!value) {
      console.log(chalk.red(`❌ ${varName}: Missing`));
      console.log(chalk.gray(`   ${config.description}`));
      hasErrors = true;
    } else if (config.pattern && !config.pattern.test(value)) {
      console.log(chalk.red(`❌ ${varName}: Invalid format`));
      console.log(chalk.gray(`   Expected pattern: ${config.pattern}`));
      console.log(chalk.gray(`   Current value: ${value.substring(0, 20)}...`));
      hasErrors = true;
    } else {
      console.log(chalk.green(`✅ ${varName}: Valid`));
      if (varName.includes('KEY') || varName.includes('SECRET')) {
        console.log(chalk.gray(`   Value: ${value.substring(0, 20)}...`));
      } else {
        console.log(chalk.gray(`   Value: ${value}`));
      }
    }
    console.log();
  });
  
  console.log(chalk.yellow('📋 Optional Environment Variables:\n'));
  
  // Check optional variables
  Object.entries(OPTIONAL_VARS).forEach(([varName, config]) => {
    const value = process.env[varName];
    
    if (!value) {
      console.log(chalk.yellow(`⚠️  ${varName}: Not set (optional)`));
      console.log(chalk.gray(`   ${config.description}`));
      hasWarnings = true;
    } else if (config.pattern && !config.pattern.test(value)) {
      console.log(chalk.yellow(`⚠️  ${varName}: Invalid format (optional)`));
      console.log(chalk.gray(`   Expected pattern: ${config.pattern}`));
      console.log(chalk.gray(`   Current value: ${value}`));
      hasWarnings = true;
    } else {
      console.log(chalk.green(`✅ ${varName}: Valid`));
      console.log(chalk.gray(`   Value: ${value}`));
    }
    console.log();
  });
  
  // Environment consistency checks
  console.log(chalk.yellow('🔍 Environment Consistency Checks:\n'));
  
  const stripeSecret = process.env.STRIPE_SECRET_KEY;
  const stripePublishable = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  const isTestMode = process.env.NEXT_PUBLIC_STRIPE_TEST_MODE === 'true' || process.env.NODE_ENV === 'development';
  
  if (stripeSecret && stripePublishable) {
    const secretIsTest = stripeSecret.startsWith('sk_test_');
    const publishableIsTest = stripePublishable.startsWith('pk_test_');
    
    if (secretIsTest !== publishableIsTest) {
      console.log(chalk.red('❌ Stripe key mismatch: Secret and publishable keys are from different environments'));
      hasErrors = true;
    } else if (isTestMode && !secretIsTest) {
      console.log(chalk.yellow('⚠️  Using live Stripe keys in test mode'));
      hasWarnings = true;
    } else if (!isTestMode && secretIsTest) {
      console.log(chalk.yellow('⚠️  Using test Stripe keys in production mode'));
      hasWarnings = true;
    } else {
      console.log(chalk.green('✅ Stripe keys are consistent'));
    }
  }
  
  // Base URL validation
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  if (baseUrl) {
    if (baseUrl.includes('localhost') && process.env.NODE_ENV === 'production') {
      console.log(chalk.yellow('⚠️  Using localhost URL in production environment'));
      hasWarnings = true;
    } else if (!baseUrl.includes('localhost') && process.env.NODE_ENV === 'development') {
      console.log(chalk.yellow('⚠️  Using production URL in development environment'));
      hasWarnings = true;
    } else {
      console.log(chalk.green('✅ Base URL is appropriate for environment'));
    }
  }
  
  console.log();
  
  // Summary
  console.log(chalk.blue('📊 Validation Summary:\n'));
  
  if (hasErrors) {
    console.log(chalk.red('❌ Validation failed - missing or invalid required environment variables'));
    console.log(chalk.yellow('\n💡 To fix these issues:'));
    console.log('1. Set the missing environment variables in your Netlify dashboard');
    console.log('2. Go to Site settings > Environment variables');
    console.log('3. Add each missing variable with the correct value');
    console.log('4. Redeploy your site after adding the variables\n');
    process.exit(1);
  } else if (hasWarnings) {
    console.log(chalk.yellow('⚠️  Validation completed with warnings - review optional configurations'));
    console.log(chalk.green('✅ All required environment variables are properly configured\n'));
    process.exit(0);
  } else {
    console.log(chalk.green('✅ All environment variables are properly configured'));
    console.log(chalk.green('🚀 Your Netlify deployment should work correctly\n'));
    process.exit(0);
  }
}

// Netlify-specific instructions
function showNetlifyInstructions() {
  console.log(chalk.blue('🌐 Netlify Environment Variable Setup Instructions:\n'));
  console.log('1. Go to your Netlify dashboard: https://app.netlify.com');
  console.log('2. Select your site (lebve.netlify.app)');
  console.log('3. Go to Site settings > Environment variables');
  console.log('4. Add the following variables:\n');
  
  Object.entries(REQUIRED_VARS).forEach(([varName, config]) => {
    if (config.required) {
      console.log(chalk.cyan(`   ${varName}`));
      console.log(chalk.gray(`   Description: ${config.description}`));
      console.log(chalk.gray(`   Pattern: ${config.pattern}\n`));
    }
  });
  
  console.log('5. Click "Save" after adding all variables');
  console.log('6. Trigger a new deployment to apply the changes\n');
}

// Run validation
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  showNetlifyInstructions();
} else {
  validateEnvironment();
}
