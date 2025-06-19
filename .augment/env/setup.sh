#!/bin/bash
set -e

# Set SHELL environment variable
export SHELL=/bin/bash

# Update system packages
sudo apt-get update

# Install Node.js 18 (LTS) using NodeSource repository
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install pnpm using npm (simpler approach)
sudo npm install -g pnpm

# Navigate to workspace directory
cd /mnt/persist/workspace

# Install project dependencies
pnpm install

# Install testing dependencies that are missing
pnpm add -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom

# Create vitest configuration file
cat > vitest.config.ts << 'EOF'
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
EOF

# Create test setup file
mkdir -p src/test
cat > src/test/setup.ts << 'EOF'
import '@testing-library/jest-dom'
EOF

# Add test script to package.json
node -e "
const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
pkg.scripts = pkg.scripts || {};
pkg.scripts.test = 'vitest';
pkg.scripts['test:run'] = 'vitest run';
fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
"

# Verify pnpm installation
pnpm --version