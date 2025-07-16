#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Starting Performance Audit...\n');

// Bundle Analysis
console.log('📦 Analyzing Bundle Size...');
try {
  const bundleAnalysis = execSync('pnpm build', { encoding: 'utf8' });
  console.log('✅ Build completed successfully\n');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}

// Check for large chunks
const chunksDir = '.next/static/chunks';
if (fs.existsSync(chunksDir)) {
  const chunks = fs.readdirSync(chunksDir)
    .filter(file => file.endsWith('.js'))
    .map(file => {
      const stats = fs.statSync(path.join(chunksDir, file));
      return { file, size: stats.size };
    })
    .sort((a, b) => b.size - a.size);

  console.log('📊 Largest JavaScript Chunks:');
  chunks.slice(0, 10).forEach(chunk => {
    const sizeKB = (chunk.size / 1024).toFixed(2);
    const status = chunk.size > 250000 ? '⚠️' : '✅';
    console.log(`${status} ${chunk.file}: ${sizeKB} KB`);
  });
  console.log();
}

// Audit Images
console.log('🖼️ Auditing Images...');
const auditImages = (dir, images = []) => {
  if (!fs.existsSync(dir)) return images;
  
  const items = fs.readdirSync(dir);
  items.forEach(item => {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      auditImages(fullPath, images);
    } else if (/\.(jpg|jpeg|png|gif|svg|webp)$/i.test(item)) {
      images.push({
        path: fullPath,
        size: stat.size,
        optimized: /\.(webp|avif)$/i.test(item)
      });
    }
  });
  return images;
};

const images = auditImages('public');
const largeImages = images.filter(img => img.size > 100000); // > 100KB
const unoptimizedImages = images.filter(img => !img.optimized && img.size > 50000); // > 50KB

console.log(`📈 Total images: ${images.length}`);
console.log(`⚠️ Large images (>100KB): ${largeImages.length}`);
console.log(`🔧 Unoptimized images (>50KB): ${unoptimizedImages.length}`);

if (largeImages.length > 0) {
  console.log('\n⚠️ Large Images Found:');
  largeImages.forEach(img => {
    console.log(`   ${img.path}: ${(img.size / 1024).toFixed(2)} KB`);
  });
}
console.log();

// Check for unused imports
console.log('🔍 Checking for Performance Issues...');

const performanceIssues = [];

// Check for console.log in production files
const checkConsoleLog = (dir) => {
  if (!fs.existsSync(dir)) return;
  
  const items = fs.readdirSync(dir);
  items.forEach(item => {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory() && !item.includes('node_modules') && !item.includes('.next')) {
      checkConsoleLog(fullPath);
    } else if (/\.(ts|tsx|js|jsx)$/.test(item)) {
      const content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes('console.log') && !fullPath.includes('performance-audit.js')) {
        performanceIssues.push(`Console.log found in: ${fullPath}`);
      }
    }
  });
};

checkConsoleLog('src');
checkConsoleLog('app');

// Check for missing alt tags
const checkAltTags = (dir) => {
  if (!fs.existsSync(dir)) return;
  
  const items = fs.readdirSync(dir);
  items.forEach(item => {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory() && !item.includes('node_modules') && !item.includes('.next')) {
      checkAltTags(fullPath);
    } else if (/\.(tsx|jsx)$/.test(item)) {
      const content = fs.readFileSync(fullPath, 'utf8');
      // Simple regex to find img tags without alt attributes
      const imgWithoutAlt = /<img(?![^>]*alt=)/g;
      const matches = content.match(imgWithoutAlt);
      if (matches) {
        performanceIssues.push(`Missing alt attribute in: ${fullPath} (${matches.length} instances)`);
      }
    }
  });
};

checkAltTags('src');
checkAltTags('app');

// Performance Recommendations
console.log('🎯 Performance Recommendations:');

const recommendations = [
  '✅ Enable gzip/brotli compression',
  '✅ Use Next.js Image component for all images',
  '✅ Implement lazy loading for below-fold content',
  '✅ Minimize JavaScript bundles',
  '✅ Use CDN for static assets',
  '✅ Enable service worker for caching',
  '✅ Optimize font loading with font-display: swap',
  '✅ Remove unused CSS and JavaScript',
  '✅ Implement critical CSS for above-fold content',
  '✅ Use resource hints (preload, prefetch, preconnect)'
];

recommendations.forEach(rec => console.log(`   ${rec}`));

if (performanceIssues.length > 0) {
  console.log('\n⚠️ Issues Found:');
  performanceIssues.forEach(issue => console.log(`   ${issue}`));
}

console.log('\n🏁 Performance Audit Complete!');

// Generate performance report
const report = {
  timestamp: new Date().toISOString(),
  bundleSize: chunks?.slice(0, 5),
  imageStats: {
    total: images.length,
    large: largeImages.length,
    unoptimized: unoptimizedImages.length
  },
  issues: performanceIssues,
  recommendations
};

fs.writeFileSync('performance-report.json', JSON.stringify(report, null, 2));
console.log('📄 Report saved to performance-report.json');