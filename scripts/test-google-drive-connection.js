#!/usr/bin/env node

/**
 * Google Drive API Connection Test
 *
 * This script tests your Google Drive API connection using the refresh token
 * obtained from the OAuth flow.
 */

import https from 'https';
import fs from 'fs';
import path from 'path';
import querystring from 'querystring';

// Load credentials from environment or tokens file
function loadCredentials() {
  let credentials = {};
  
  // Try to load from environment variables first
  if (process.env.GOOGLE_DRIVE_REFRESH_TOKEN) {
    credentials = {
      client_id: process.env.GOOGLE_DRIVE_CLIENT_ID,
      client_secret: process.env.GOOGLE_DRIVE_CLIENT_SECRET,
      refresh_token: process.env.GOOGLE_DRIVE_REFRESH_TOKEN
    };
  } else {
    // Try to load from tokens file
    const tokensPath = path.join(process.cwd(), 'google-drive-tokens.json');
    if (fs.existsSync(tokensPath)) {
      const tokensData = JSON.parse(fs.readFileSync(tokensPath, 'utf8'));
      credentials = {
        client_id: tokensData.client_id,
        client_secret: tokensData.client_secret,
        refresh_token: tokensData.refresh_token
      };
    }
  }
  
  return credentials;
}

// Get a fresh access token using the refresh token
async function getAccessToken(credentials) {
  
  const postData = querystring.stringify({
    client_id: credentials.client_id,
    client_secret: credentials.client_secret,
    refresh_token: credentials.refresh_token,
    grant_type: 'refresh_token'
  });

  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'oauth2.googleapis.com',
      port: 443,
      path: '/token',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          
          if (response.error) {
            reject(new Error(`Token refresh error: ${response.error_description || response.error}`));
            return;
          }

          resolve(response.access_token);
        } catch (error) {
          reject(new Error(`Failed to parse token response: ${error.message}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(new Error(`Request error: ${error.message}`));
    });

    req.write(postData);
    req.end();
  });
}

// Test Google Drive API by listing files
async function testDriveAPI(accessToken) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'www.googleapis.com',
      port: 443,
      path: '/drive/v3/files?pageSize=10&fields=files(id,name,mimeType,createdTime)',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          
          if (response.error) {
            reject(new Error(`Drive API error: ${response.error.message}`));
            return;
          }

          resolve(response);
        } catch (error) {
          reject(new Error(`Failed to parse API response: ${error.message}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(new Error(`API request error: ${error.message}`));
    });

    req.end();
  });
}

// Get user info to verify authentication
async function getUserInfo(accessToken) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'www.googleapis.com',
      port: 443,
      path: '/drive/v3/about?fields=user',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          
          if (response.error) {
            reject(new Error(`User info error: ${response.error.message}`));
            return;
          }

          resolve(response.user);
        } catch (error) {
          reject(new Error(`Failed to parse user info: ${error.message}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(new Error(`User info request error: ${error.message}`));
    });

    req.end();
  });
}

// Main test function
async function main() {
  console.log('🧪 Testing Google Drive API Connection...\n');

  try {
    // Load credentials
    console.log('📋 Loading credentials...');
    const credentials = loadCredentials();
    
    if (!credentials.refresh_token) {
      console.log('❌ No refresh token found!');
      console.log('📝 Please run the OAuth script first: node scripts/get-google-refresh-token.js');
      console.log('🔧 Or set environment variables: GOOGLE_DRIVE_REFRESH_TOKEN, GOOGLE_DRIVE_CLIENT_ID, GOOGLE_DRIVE_CLIENT_SECRET');
      process.exit(1);
    }
    
    console.log('✅ Credentials loaded successfully');
    console.log(`🔑 Client ID: ${credentials.client_id.substring(0, 20)}...`);
    console.log(`🔄 Refresh Token: ${credentials.refresh_token.substring(0, 20)}...\n`);

    // Get access token
    console.log('🔄 Refreshing access token...');
    const accessToken = await getAccessToken(credentials);
    console.log('✅ Access token obtained successfully\n');

    // Test user authentication
    console.log('👤 Getting user information...');
    const userInfo = await getUserInfo(accessToken);
    console.log('✅ User authenticated successfully');
    console.log(`📧 Email: ${userInfo.emailAddress}`);
    console.log(`👤 Display Name: ${userInfo.displayName}\n`);

    // Test Drive API
    console.log('📁 Testing Google Drive API...');
    const driveResponse = await testDriveAPI(accessToken);
    console.log('✅ Google Drive API working successfully');
    console.log(`📊 Found ${driveResponse.files.length} files in your Drive\n`);

    // Display some files
    if (driveResponse.files.length > 0) {
      console.log('📄 Recent files:');
      driveResponse.files.slice(0, 5).forEach((file, index) => {
        console.log(`   ${index + 1}. ${file.name} (${file.mimeType})`);
      });
    } else {
      console.log('📄 No files found in your Google Drive');
    }

    console.log('\n🎉 All tests passed! Your Google Drive API connection is working correctly.');
    console.log('🚀 You can now use this refresh token with your Google Drive MCP server.');

  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    console.log('\n🔧 Troubleshooting tips:');
    console.log('   1. Make sure your refresh token is valid');
    console.log('   2. Check that the Google Drive API is enabled in your Google Cloud project');
    console.log('   3. Verify your client ID and client secret are correct');
    console.log('   4. Ensure you have the necessary permissions (drive scope)');
    process.exit(1);
  }
}

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n👋 Test interrupted. Exiting...');
  process.exit(0);
});

// Check if this is the main module (ES module equivalent of require.main === module)
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const isMainModule = process.argv[1] === __filename;

if (isMainModule) {
  main();
}

export { loadCredentials, getAccessToken, testDriveAPI, getUserInfo };
