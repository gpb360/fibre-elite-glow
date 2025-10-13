#!/usr/bin/env node

/**
 * Load environment variables from .env.local for Node.js scripts
 * This is needed because Node.js scripts don't automatically load .env files
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read .env.local file
const envPath = path.join(__dirname, '..', '.env.local');

export function loadEnv() {
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');

    envContent.split('\n').forEach(line => {
      // Remove comments and empty lines
      const cleanLine = line.replace(/#.*/, '').trim();

      if (cleanLine && cleanLine.includes('=')) {
        const [key, ...valueParts] = cleanLine.split('=');
        const value = valueParts.join('=').trim();

        // Set environment variable
        process.env[key.trim()] = value;
      }
    });

    console.log('✅ Environment variables loaded from .env.local');
    return true;
  } else {
    console.log('⚠️  .env.local file not found, using default values');
    return false;
  }
}