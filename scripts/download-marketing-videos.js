#!/usr/bin/env node

/**
 * Download Marketing Videos from Google Drive
 * 
 * This script downloads the selected professional marketing videos
 * from Google Drive and optimizes them for web delivery.
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

// Selected videos to download
const SELECTED_VIDEOS = [
  {
    id: '1s3Xlacle2likvk8-Ms9DEbkhxMb1ADgJ',
    name: '1b_Total Essential_Generic Edit (No Overlay).mp4',
    filename: 'generic-edit.mp4',
    description: 'Main promotional video',
    usage: 'Hero section background/featured video'
  },
  {
    id: '1a8TkYhtz7n_JE7VIn4w4-UYMaKc8qrBy',
    name: '3b_Total Essential_Happy Customers Edit (no Overlay).mp4',
    filename: 'happy-customers.mp4',
    description: 'Customer testimonials',
    usage: 'Testimonials section'
  },
  {
    id: '13Bbvk8aznv8hS-yrwBnZFa5i0h93YmR2',
    name: '4b_Total Essential_Ingredients Edit (no Overlay).mp4',
    filename: 'ingredients.mp4',
    description: 'Product ingredients showcase',
    usage: 'Product showcase section'
  },
  {
    id: '1IQ_jfPakgS4awIGQX0QZ-hYzZAyehpmS',
    name: '5b_Total Essential_Stylish Result Video (no Overlay).mp4',
    filename: 'stylish-result.mp4',
    description: 'Results demonstration',
    usage: 'Health section and product showcase'
  },
  {
    id: '1X68a_lOKiLKSAgNnbYND5VAZJJ5SMug5',
    name: '6b_Total Essential_Open Box with VO (no Overlay).mp4',
    filename: 'open-box-vo.mp4',
    description: 'Unboxing with voiceover',
    usage: 'Product pages'
  }
];

// Download a file from Google Drive
async function downloadFile(accessToken, fileId, filename, outputDir) {
  return new Promise((resolve, reject) => {
    const outputPath = path.join(outputDir, filename);
    
    // Create output directory if it doesn't exist
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const options = {
      hostname: 'www.googleapis.com',
      port: 443,
      path: `/drive/v3/files/${fileId}?alt=media`,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    };

    const file = fs.createWriteStream(outputPath);
    let downloadedBytes = 0;

    const req = https.request(options, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`Download failed with status: ${res.statusCode}`));
        return;
      }

      const totalBytes = parseInt(res.headers['content-length'] || '0');
      
      res.on('data', (chunk) => {
        downloadedBytes += chunk.length;
        if (totalBytes > 0) {
          const progress = ((downloadedBytes / totalBytes) * 100).toFixed(1);
          process.stdout.write(`\r   📥 Downloading ${filename}: ${progress}%`);
        }
      });

      res.pipe(file);

      file.on('finish', () => {
        file.close();
        console.log(`\n   ✅ Downloaded: ${filename}`);
        resolve(outputPath);
      });

      file.on('error', (error) => {
        fs.unlink(outputPath, () => {}); // Delete partial file
        reject(error);
      });
    });

    req.on('error', (error) => {
      reject(new Error(`Download request error: ${error.message}`));
    });

    req.end();
  });
}

// Format file size
function formatFileSize(bytes) {
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
}

// Main download function
async function main() {
  console.log('📥 Downloading Professional Marketing Videos...\n');

  try {
    // Load credentials and get access token
    console.log('🔐 Authenticating with Google Drive...');
    const credentials = loadCredentials();
    const accessToken = await getAccessToken(credentials);
    console.log('✅ Authentication successful\n');

    // Create output directory
    const outputDir = path.join(process.cwd(), 'public', 'videos', 'marketing');
    console.log(`📁 Output directory: ${outputDir}\n`);

    // Download each selected video
    console.log('🎬 Downloading selected marketing videos:\n');
    
    const downloadedFiles = [];
    
    for (const video of SELECTED_VIDEOS) {
      console.log(`📹 ${video.description}`);
      console.log(`   🎯 Usage: ${video.usage}`);
      
      try {
        const filePath = await downloadFile(accessToken, video.id, video.filename, outputDir);
        
        // Get file stats
        const stats = fs.statSync(filePath);
        const fileSize = formatFileSize(stats.size);
        
        downloadedFiles.push({
          ...video,
          filePath,
          fileSize,
          localPath: `/videos/marketing/${video.filename}`
        });
        
        console.log(`   📊 Size: ${fileSize}`);
        console.log(`   💾 Saved to: ${filePath}\n`);
        
      } catch (error) {
        console.error(`   ❌ Failed to download ${video.filename}: ${error.message}\n`);
      }
    }

    // Create video configuration file
    const configPath = path.join(outputDir, 'video-config.json');
    const videoConfig = {
      videos: downloadedFiles.map(file => ({
        id: file.filename.replace('.mp4', ''),
        title: file.description,
        src: file.localPath,
        usage: file.usage,
        fileSize: file.fileSize,
        originalName: file.name
      })),
      downloadedAt: new Date().toISOString(),
      totalVideos: downloadedFiles.length
    };

    fs.writeFileSync(configPath, JSON.stringify(videoConfig, null, 2));
    console.log(`📋 Video configuration saved to: ${configPath}\n`);

    // Summary
    console.log('📊 Download Summary:');
    console.log(`   ✅ Successfully downloaded: ${downloadedFiles.length}/${SELECTED_VIDEOS.length} videos`);
    console.log(`   📁 Total files: ${downloadedFiles.length}`);
    
    const totalSize = downloadedFiles.reduce((sum, file) => {
      const stats = fs.statSync(file.filePath);
      return sum + stats.size;
    }, 0);
    console.log(`   💾 Total size: ${formatFileSize(totalSize)}`);

    console.log('\n🎉 Video download complete!');
    console.log('\n📝 Next steps:');
    console.log('   1. Review downloaded videos in public/videos/marketing/');
    console.log('   2. Test video playback in the application');
    console.log('   3. Implement video components in website sections');
    console.log('   4. Optimize video loading and performance');

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

export { downloadFile, loadCredentials, getAccessToken, SELECTED_VIDEOS };
