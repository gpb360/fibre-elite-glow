#!/usr/bin/env node

/**
 * Google OAuth Refresh Token Generator
 *
 * This script helps you obtain a refresh token for Google Drive API access.
 * It will open a browser window for OAuth authorization and capture the refresh token.
 */

import http from 'http';
import url from 'url';
import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import https from 'https';
import querystring from 'querystring';

// Your Google OAuth credentials
const CLIENT_CREDENTIALS = {
  "client_id": "953848423191-11p0lhjnl74k2119fm37s7qpv7rgv6nl.apps.googleusercontent.com",
  "project_id": "labellvie",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_secret": "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",
  "javascript_origins": ["http://localhost:8080"]
};

// OAuth configuration
const REDIRECT_URI = 'http://localhost:3000/oauth/callback';
const SCOPES = [
  'https://www.googleapis.com/auth/drive',
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/drive.readonly'
];

console.log('🔐 Google Drive OAuth Refresh Token Generator\n');

async function getRefreshToken() {
  return new Promise((resolve, reject) => {
    // Create a local server to handle the OAuth callback
    const server = http.createServer(async (req, res) => {
      const parsedUrl = url.parse(req.url, true);
      
      if (parsedUrl.pathname === '/oauth/callback') {
        const { code, error } = parsedUrl.query;
        
        if (error) {
          res.writeHead(400, { 'Content-Type': 'text/html' });
          res.end(`
            <html>
              <body>
                <h1>❌ Authorization Error</h1>
                <p>Error: ${error}</p>
                <p>You can close this window.</p>
              </body>
            </html>
          `);
          server.close();
          reject(new Error(`OAuth error: ${error}`));
          return;
        }

        if (code) {
          try {
            // Exchange authorization code for tokens
            const tokenResponse = await exchangeCodeForTokens(code);
            
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(`
              <html>
                <body>
                  <h1>✅ Authorization Successful!</h1>
                  <p>Refresh token has been generated successfully.</p>
                  <p>Check your terminal for the token details.</p>
                  <p>You can close this window.</p>
                </body>
              </html>
            `);
            
            server.close();
            resolve(tokenResponse);
          } catch (error) {
            res.writeHead(500, { 'Content-Type': 'text/html' });
            res.end(`
              <html>
                <body>
                  <h1>❌ Token Exchange Error</h1>
                  <p>Error: ${error.message}</p>
                  <p>You can close this window.</p>
                </body>
              </html>
            `);
            server.close();
            reject(error);
          }
        }
      } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
      }
    });

    server.listen(3000, () => {
      console.log('🌐 Local OAuth server started on http://localhost:3000');
      
      // Generate authorization URL
      const authUrl = generateAuthUrl();
      console.log('🔗 Opening authorization URL in your browser...');
      console.log(`📋 If the browser doesn't open automatically, visit: ${authUrl}\n`);
      
      // Open browser
      const platform = process.platform;
      const command = platform === 'win32' ? 'start' : platform === 'darwin' ? 'open' : 'xdg-open';
      exec(`${command} "${authUrl}"`);
    });

    server.on('error', (error) => {
      reject(error);
    });
  });
}

function generateAuthUrl() {
  const params = new URLSearchParams({
    client_id: CLIENT_CREDENTIALS.client_id,
    redirect_uri: REDIRECT_URI,
    scope: SCOPES.join(' '),
    response_type: 'code',
    access_type: 'offline',
    prompt: 'consent'
  });

  return `${CLIENT_CREDENTIALS.auth_uri}?${params.toString()}`;
}

async function exchangeCodeForTokens(code) {
  const postData = querystring.stringify({
    client_id: CLIENT_CREDENTIALS.client_id,
    client_secret: CLIENT_CREDENTIALS.client_secret,
    code: code,
    grant_type: 'authorization_code',
    redirect_uri: REDIRECT_URI
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
            reject(new Error(`Token exchange error: ${response.error_description || response.error}`));
            return;
          }

          resolve(response);
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

function saveTokensToFile(tokens) {
  const tokenData = {
    access_token: tokens.access_token,
    refresh_token: tokens.refresh_token,
    scope: tokens.scope,
    token_type: tokens.token_type,
    expires_in: tokens.expires_in,
    generated_at: new Date().toISOString(),
    client_id: CLIENT_CREDENTIALS.client_id,
    client_secret: CLIENT_CREDENTIALS.client_secret
  };

  const filePath = path.join(process.cwd(), 'google-drive-tokens.json');
  fs.writeFileSync(filePath, JSON.stringify(tokenData, null, 2));
  
  console.log(`💾 Tokens saved to: ${filePath}`);
  return filePath;
}

// Main execution
async function main() {
  try {
    console.log('📋 This script will help you obtain a Google Drive refresh token.');
    console.log('🔐 Make sure you have enabled the Google Drive API in your Google Cloud Console.');
    console.log('🌐 A browser window will open for authorization...\n');

    const tokens = await getRefreshToken();
    
    console.log('\n✅ Success! Here are your tokens:\n');
    console.log('🔑 Access Token:', tokens.access_token);
    console.log('🔄 Refresh Token:', tokens.refresh_token);
    console.log('⏰ Expires In:', tokens.expires_in, 'seconds');
    console.log('🎯 Scope:', tokens.scope);
    
    const filePath = saveTokensToFile(tokens);
    
    console.log('\n📝 For your Google Drive MCP configuration, use:');
    console.log('   GOOGLE_DRIVE_REFRESH_TOKEN=' + tokens.refresh_token);
    console.log('   GOOGLE_DRIVE_CLIENT_ID=' + CLIENT_CREDENTIALS.client_id);
    console.log('   GOOGLE_DRIVE_CLIENT_SECRET=' + CLIENT_CREDENTIALS.client_secret);
    
    console.log('\n🎉 You can now use these credentials with your Google Drive MCP server!');
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n👋 Process interrupted. Exiting...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n👋 Process terminated. Exiting...');
  process.exit(0);
});

// Check if this is the main module (ES module equivalent of require.main === module)
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const isMainModule = process.argv[1] === __filename;

if (isMainModule) {
  main();
}

export { getRefreshToken, generateAuthUrl, exchangeCodeForTokens };
