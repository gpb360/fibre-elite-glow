#!/usr/bin/env node

/**
 * Search for "lebel" folders and videos in Google Drive
 * 
 * This script searches for folders containing "lebel" in the name
 * and lists all video files within those folders.
 */

import https from 'https';
import fs from 'fs';
import path from 'path';
import querystring from 'querystring';
import { fileURLToPath } from 'url';

// Load credentials from tokens file
function loadCredentials() {
  const tokensPath = path.join(process.cwd(), 'google-drive-tokens.json');
  if (fs.existsSync(tokensPath)) {
    const tokensData = JSON.parse(fs.readFileSync(tokensPath, 'utf8'));
    return {
      client_id: tokensData.client_id,
      client_secret: tokensData.client_secret,
      refresh_token: tokensData.refresh_token
    };
  }
  throw new Error('Tokens file not found. Please run get-google-refresh-token.js first.');
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
      res.on('data', (chunk) => { data += chunk; });
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

// Search for folders containing "lebel" in the name
async function searchLebelFolders(accessToken) {
  return new Promise((resolve, reject) => {
    const query = encodeURIComponent("name contains 'lebel' and mimeType='application/vnd.google-apps.folder'");
    const options = {
      hostname: 'www.googleapis.com',
      port: 443,
      path: `/drive/v3/files?q=${query}&fields=files(id,name,parents,createdTime,modifiedTime)`,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          if (response.error) {
            reject(new Error(`Drive API error: ${response.error.message}`));
            return;
          }
          resolve(response.files || []);
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

// Search for video files in a specific folder
async function searchVideosInFolder(accessToken, folderId) {
  return new Promise((resolve, reject) => {
    // Common video MIME types
    const videoMimeTypes = [
      'video/mp4',
      'video/avi',
      'video/mov',
      'video/wmv',
      'video/flv',
      'video/webm',
      'video/mkv',
      'video/m4v',
      'video/3gp',
      'video/quicktime'
    ];
    
    const mimeQuery = videoMimeTypes.map(type => `mimeType='${type}'`).join(' or ');
    const query = encodeURIComponent(`'${folderId}' in parents and (${mimeQuery})`);
    
    const options = {
      hostname: 'www.googleapis.com',
      port: 443,
      path: `/drive/v3/files?q=${query}&fields=files(id,name,mimeType,size,createdTime,modifiedTime,webViewLink)`,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          if (response.error) {
            reject(new Error(`Drive API error: ${response.error.message}`));
            return;
          }
          resolve(response.files || []);
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

// Format file size
function formatFileSize(bytes) {
  if (!bytes) return 'Unknown size';
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
}

// Format date
function formatDate(dateString) {
  return new Date(dateString).toLocaleString();
}

// Main search function
async function main() {
  console.log('🔍 Searching for "lebel" folders and videos in Google Drive...\n');

  try {
    // Load credentials and get access token
    console.log('📋 Loading credentials...');
    const credentials = loadCredentials();
    console.log('🔄 Getting access token...');
    const accessToken = await getAccessToken(credentials);
    console.log('✅ Access token obtained\n');

    // Search for folders containing "lebel"
    console.log('📁 Searching for folders containing "lebel"...');
    const lebelFolders = await searchLebelFolders(accessToken);
    
    if (lebelFolders.length === 0) {
      console.log('❌ No folders found containing "lebel" in the name.');
      return;
    }

    console.log(`✅ Found ${lebelFolders.length} folder(s) containing "lebel":\n`);

    // Display folders and search for videos in each
    for (const folder of lebelFolders) {
      console.log(`📂 Folder: ${folder.name}`);
      console.log(`   📅 Created: ${formatDate(folder.createdTime)}`);
      console.log(`   📝 Modified: ${formatDate(folder.modifiedTime)}`);
      console.log(`   🆔 ID: ${folder.id}\n`);

      // Search for videos in this folder
      console.log(`   🎬 Searching for videos in "${folder.name}"...`);
      const videos = await searchVideosInFolder(accessToken, folder.id);

      if (videos.length === 0) {
        console.log('   ❌ No video files found in this folder.\n');
      } else {
        console.log(`   ✅ Found ${videos.length} video file(s):\n`);
        
        videos.forEach((video, index) => {
          console.log(`   ${index + 1}. 🎥 ${video.name}`);
          console.log(`      📊 Type: ${video.mimeType}`);
          console.log(`      📏 Size: ${formatFileSize(parseInt(video.size))}`);
          console.log(`      📅 Created: ${formatDate(video.createdTime)}`);
          console.log(`      📝 Modified: ${formatDate(video.modifiedTime)}`);
          console.log(`      🔗 Link: ${video.webViewLink}`);
          console.log('');
        });
      }
      
      console.log('─'.repeat(60) + '\n');
    }

    // Summary
    const totalVideos = lebelFolders.reduce(async (acc, folder) => {
      const videos = await searchVideosInFolder(accessToken, folder.id);
      return (await acc) + videos.length;
    }, Promise.resolve(0));

    console.log(`📊 Summary:`);
    console.log(`   📁 Folders found: ${lebelFolders.length}`);
    console.log(`   🎬 Total videos: ${await totalVideos}`);

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

// Check if this is the main module
const __filename = fileURLToPath(import.meta.url);
const isMainModule = process.argv[1] === __filename;

if (isMainModule) {
  main();
}

export { searchLebelFolders, searchVideosInFolder, loadCredentials, getAccessToken };
