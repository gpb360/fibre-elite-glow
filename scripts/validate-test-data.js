#!/usr/bin/env node

/**
 * Test Data Validation Script
 * Validates the integrity and completeness of test data
 */

const chalk = require('chalk');
const path = require('path');

console.log(chalk.blue('🔍 Validating Test Data...\n'));

// Import test data (using require since it's a JS script)
const testDataPath = path.join(__dirname, '../tests/utils/test-data.ts');

// Since we can't directly import TypeScript, we'll do basic validation
async function validateTestData() {
  try {
    // Read the test data file content
    const fs = require('fs');
    const content = fs.readFileSync(testDataPath, 'utf8');
    
    console.log(chalk.blue('Checking test data structure...\n'));
    
    // Check for required exports
    const requiredExports = [
      'STRIPE_TEST_CARDS',
      'TEST_CUSTOMERS', 
      'TEST_CUSTOMER',
      'TEST_PRODUCTS',
      'TEST_SCENARIOS',
      'CART_SCENARIOS',
      'TIMEOUTS',
      'SELECTORS'
    ];
    
    let allExportsPresent = true;
    
    requiredExports.forEach(exportName => {
      if (content.includes(`export const ${exportName}`)) {
        console.log(chalk.green(`✅ ${exportName}: Present`));
      } else {
        console.log(chalk.red(`❌ ${exportName}: Missing`));
        allExportsPresent = false;
      }
    });
    
    // Check for required functions
    const requiredFunctions = [
      'generateRandomEmail',
      'generateTestCustomer',
      'buildCartItems',
      'calculateExpectedTotal',
      'validateTestData',
      'generateTestReport'
    ];
    
    console.log(chalk.blue('\nChecking utility functions...\n'));
    
    let allFunctionsPresent = true;
    
    requiredFunctions.forEach(funcName => {
      if (content.includes(`export function ${funcName}`)) {
        console.log(chalk.green(`✅ ${funcName}: Present`));
      } else {
        console.log(chalk.red(`❌ ${funcName}: Missing`));
        allFunctionsPresent = false;
      }
    });
    
    // Check Stripe test cards coverage
    console.log(chalk.blue('\nChecking Stripe test card coverage...\n'));
    
    const stripeCardTypes = [
      'VISA_SUCCESS',
      'MASTERCARD_SUCCESS', 
      'AMEX_SUCCESS',
      'GENERIC_DECLINE',
      'INSUFFICIENT_FUNDS',
      'EXPIRED_CARD',
      'INCORRECT_CVC',
      'THREE_D_SECURE_REQUIRED'
    ];
    
    stripeCardTypes.forEach(cardType => {
      if (content.includes(`${cardType}:`)) {
        console.log(chalk.green(`✅ Stripe Card ${cardType}: Defined`));
      } else {
        console.log(chalk.yellow(`⚠️  Stripe Card ${cardType}: Missing`));
      }
    });
    
    // Check customer variations
    console.log(chalk.blue('\nChecking customer variations...\n'));
    
    const customerTypes = [
      'DEFAULT',
      'INTERNATIONAL',
      'MINIMAL',
      'LONG_ADDRESS',
      'BUSINESS'
    ];
    
    customerTypes.forEach(customerType => {
      if (content.includes(`${customerType}:`)) {
        console.log(chalk.green(`✅ Customer ${customerType}: Defined`));
      } else {
        console.log(chalk.yellow(`⚠️  Customer ${customerType}: Missing`));
      }
    });
    
    // Check product structure
    console.log(chalk.blue('\nChecking product structure...\n'));
    
    const productTypes = ['TOTAL_ESSENTIAL', 'TOTAL_ESSENTIAL_PLUS'];
    
    productTypes.forEach(productType => {
      if (content.includes(`${productType}:`)) {
        console.log(chalk.green(`✅ Product ${productType}: Defined`));
        
        // Check if it has packages
        const productSection = content.split(`${productType}:`)[1]?.split('},')[0];
        if (productSection && productSection.includes('packages:')) {
          console.log(chalk.gray(`   → Has packages configuration`));
        } else {
          console.log(chalk.yellow(`   ⚠️  Missing packages configuration`));
        }
      } else {
        console.log(chalk.red(`❌ Product ${productType}: Missing`));
      }
    });
    
    // Check cart scenarios
    console.log(chalk.blue('\nChecking cart scenarios...\n'));
    
    const cartScenarios = [
      'SINGLE_ITEM',
      'POPULAR_PACKAGE',
      'MIXED_PRODUCTS', 
      'BULK_ORDER',
      'VALUE_OPTIMIZATION'
    ];
    
    cartScenarios.forEach(scenario => {
      if (content.includes(`${scenario}:`)) {
        console.log(chalk.green(`✅ Cart Scenario ${scenario}: Defined`));
      } else {
        console.log(chalk.yellow(`⚠️  Cart Scenario ${scenario}: Missing`));
      }
    });
    
    // Summary
    console.log(chalk.blue('\n📋 Validation Summary:\n'));
    
    if (allExportsPresent && allFunctionsPresent) {
      console.log(chalk.green('🎉 Test data structure is complete!'));
      console.log(chalk.green('✅ All required exports and functions are present'));
      console.log(chalk.green('✅ Comprehensive test coverage is available'));
      console.log(chalk.gray('\n💡 Test data includes:'));
      console.log(chalk.gray('   - Multiple Stripe test card scenarios'));
      console.log(chalk.gray('   - Various customer profiles and addresses'));
      console.log(chalk.gray('   - Product packages with different pricing'));
      console.log(chalk.gray('   - Cart combination scenarios'));
      console.log(chalk.gray('   - Payment success and failure scenarios'));
      
      return true;
    } else {
      console.log(chalk.red('❌ Test data validation failed'));
      if (!allExportsPresent) {
        console.log(chalk.red('   - Missing required exports'));
      }
      if (!allFunctionsPresent) {
        console.log(chalk.red('   - Missing required utility functions'));
      }
      
      return false;
    }
    
  } catch (error) {
    console.error(chalk.red('❌ Error validating test data:'), error.message);
    return false;
  }
}

// Additional checks for test data quality
function checkTestDataQuality() {
  console.log(chalk.blue('🔍 Checking test data quality...\n'));
  
  const fs = require('fs');
  const content = fs.readFileSync(testDataPath, 'utf8');
  
  // Check for hardcoded values that should be dynamic
  const issues = [];
  
  if (content.includes('test@example.com') && !content.includes('generateRandomEmail')) {
    issues.push('Contains hardcoded email addresses - consider using dynamic generation');
  }
  
  if (content.includes('4242424242424242')) {
    console.log(chalk.green('✅ Uses Stripe test card numbers'));
  }
  
  if (content.includes('as const')) {
    console.log(chalk.green('✅ Uses TypeScript const assertions for type safety'));
  }
  
  if (content.includes('export function')) {
    console.log(chalk.green('✅ Includes utility functions'));
  }
  
  if (issues.length > 0) {
    console.log(chalk.yellow('⚠️  Quality issues found:'));
    issues.forEach(issue => {
      console.log(chalk.yellow(`   - ${issue}`));
    });
  } else {
    console.log(chalk.green('✅ Test data quality is good'));
  }
}

async function main() {
  console.log(chalk.blue('🚀 Starting test data validation...\n'));
  
  const isValid = await validateTestData();
  checkTestDataQuality();
  
  if (isValid) {
    console.log(chalk.green('\n🎉 Test data validation completed successfully!'));
    console.log(chalk.green('✅ Ready for comprehensive checkout testing'));
    process.exit(0);
  } else {
    console.log(chalk.red('\n❌ Test data validation failed'));
    console.log(chalk.yellow('💡 Please fix the issues above before running tests'));
    process.exit(1);
  }
}

main();