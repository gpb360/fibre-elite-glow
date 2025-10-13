#!/usr/bin/env node

/**
 * Test email sending functionality
 * Usage: node scripts/test-email.js [email@example.com]
 */

// Node.js 18+ has built-in fetch

// Load environment variables from .env.local
import { loadEnv } from './load-env.js';
loadEnv();

const TEST_EMAIL = process.argv[2] || 'garypboyd@gmail.com';
const LOCAL_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

async function testEmail() {
  console.log('🧪 Testing email sending functionality...');
  console.log(`📧 Sending test email to: ${TEST_EMAIL}`);
  console.log(`🌐 Target URL: ${LOCAL_URL}/api/test-email`);

  try {
    const response = await fetch(`${LOCAL_URL}/api/test-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customerEmail: TEST_EMAIL,
        customerName: 'Test Customer'
      }),
    });

    const result = await response.json();

    if (response.ok) {
      console.log('✅ Email sent successfully!');
      console.log('Response:', JSON.stringify(result, null, 2));
    } else {
      console.error('❌ Failed to send email:', response.status);
      console.error('Error:', result);
    }
  } catch (error) {
    console.error('❌ Error testing email:', error.message);

    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Make sure your development server is running:');
      console.log('   pnpm dev');
    }
  }
}

// Check if server is running first
async function checkServer() {
  try {
    const response = await fetch(`${LOCAL_URL}/api/webhook-test`);
    return response.ok;
  } catch {
    return false;
  }
}

async function main() {
  console.log('🔍 Checking if development server is running...');

  const serverRunning = await checkServer();

  if (!serverRunning) {
    console.error('❌ Development server is not running at', LOCAL_URL);
    console.log('\n💡 Please start your development server first:');
    console.log('   pnpm dev');
    console.log('\nThen run this script again.');
    process.exit(1);
  }

  console.log('✅ Development server is running!\n');

  await testEmail();
}

main();