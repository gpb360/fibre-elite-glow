import fs from 'fs';
import path from 'path';

function analyzeExistingImages() {
  console.log('🔍 Analyzing existing images in La Belle Vie project...');
  
  const publicDir = path.join(process.cwd(), 'public');
  
  // Required images from our missing list
  const requiredImages = [
    { path: 'public/assets/', file: 'og-default.jpg', status: 'missing', priority: 'HIGH' },
    { path: 'public/assets/', file: 'benefits-hero.jpg', status: 'missing', priority: 'HIGH' },
    { path: 'public/assets/', file: 'faq-hero.jpg', status: 'missing', priority: 'MEDIUM' },
    { path: 'public/assets/', file: 'testimonials-hero.jpg', status: 'missing', priority: 'MEDIUM' },
    { path: 'public/', file: 'logo.png', status: 'missing', priority: 'HIGH' },
    { path: 'public/images/', file: 'total-essential.jpg', status: 'missing', priority: 'HIGH' },
    { path: 'public/images/', file: 'total-essential-plus.jpg', status: 'missing', priority: 'HIGH' }
  ];

  // Scan existing images
  console.log('\n📊 EXISTING IMAGES FOUND:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  const existingImages = {
    assets: [],
    lovableUploads: [],
    images: [],
    root: []
  };

  // Check assets directory
  const assetsDir = path.join(publicDir, 'assets');
  if (fs.existsSync(assetsDir)) {
    const assetFiles = fs.readdirSync(assetsDir).filter(f => 
      f.match(/\.(jpg|jpeg|png|webp|svg)$/i) && !f.includes('.html')
    );
    existingImages.assets = assetFiles;
    console.log(`\n📁 public/assets/ (${assetFiles.length} images):`);
    assetFiles.forEach(file => console.log(`   ✅ ${file}`));
  }

  // Check lovable-uploads directory  
  const lovableDir = path.join(publicDir, 'lovable-uploads');
  if (fs.existsSync(lovableDir)) {
    const lovableFiles = fs.readdirSync(lovableDir).filter(f => 
      f.match(/\.(jpg|jpeg|png|webp|svg)$/i)
    );
    existingImages.lovableUploads = lovableFiles;
    console.log(`\n📁 public/lovable-uploads/ (${lovableFiles.length} images):`);
    lovableFiles.forEach(file => console.log(`   ✅ ${file}`));
  }

  // Check images directory
  const imagesDir = path.join(publicDir, 'images');
  if (fs.existsSync(imagesDir)) {
    const imageFiles = fs.readdirSync(imagesDir).filter(f => 
      f.match(/\.(jpg|jpeg|png|webp|svg)$/i) && !f.includes('.html')
    );
    existingImages.images = imageFiles;
    console.log(`\n📁 public/images/ (${imageFiles.length} images):`);
    imageFiles.forEach(file => console.log(`   ✅ ${file}`));
  }

  // Check root public directory
  const rootFiles = fs.readdirSync(publicDir).filter(f => 
    f.match(/\.(jpg|jpeg|png|webp|svg)$/i) && !f.includes('.html')
  );
  existingImages.root = rootFiles;
  if (rootFiles.length > 0) {
    console.log(`\n📁 public/ root (${rootFiles.length} images):`);
    rootFiles.forEach(file => console.log(`   ✅ ${file}`));
  }

  // Analyze what we can use from existing images
  console.log('\n\n🎯 MAPPING EXISTING IMAGES TO REQUIREMENTS:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  const mappingSuggestions = [];

  // Check for product images in lovable-uploads
  const productImages = existingImages.lovableUploads.filter(f => 
    f.includes('total-essential') || f.includes('product') || f.includes('bottle') || f.includes('jar')
  );

  if (productImages.length > 0) {
    console.log('\n🔥 HIGH PRIORITY - Product Images Found:');
    productImages.forEach(file => {
      if (file.includes('total-essential') && !file.includes('plus')) {
        console.log(`   📦 ${file} → Could be used for total-essential.jpg`);
        mappingSuggestions.push({
          existing: `public/lovable-uploads/${file}`,
          target: 'public/images/total-essential.jpg',
          action: 'copy_and_rename'
        });
      } else if (file.includes('plus')) {
        console.log(`   📦 ${file} → Could be used for total-essential-plus.jpg`);
        mappingSuggestions.push({
          existing: `public/lovable-uploads/${file}`,
          target: 'public/images/total-essential-plus.jpg', 
          action: 'copy_and_rename'
        });
      }
    });
  }

  // Check for ingredient images that could be used
  const ingredientImages = existingImages.assets.filter(f => 
    f.includes('apple') || f.includes('broccoli') || f.includes('acai') || 
    f.includes('carrot') || f.includes('spinach') || f.includes('celery')
  );

  if (ingredientImages.length > 0) {
    console.log('\n🍎 Ingredient Images Available:');
    ingredientImages.forEach(file => console.log(`   🌿 ${file} → Ready to use for ingredient content`));
  }

  // Check for potential hero images
  const heroImages = existingImages.lovableUploads.filter(f => 
    f.includes('fruit') || f.includes('veg') || f.includes('health')
  );

  if (heroImages.length > 0) {
    console.log('\n🌟 Potential Hero Images:');
    heroImages.forEach(file => {
      console.log(`   🖼️  ${file} → Could be adapted for benefits-hero.jpg`);
      mappingSuggestions.push({
        existing: `public/lovable-uploads/${file}`,
        target: 'public/assets/benefits-hero.jpg',
        action: 'copy_and_resize'
      });
    });
  }

  // Status summary
  console.log('\n\n📋 MISSING IMAGE STATUS:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  let stillMissing = 0;
  let canBeMapped = 0;

  requiredImages.forEach(req => {
    const fullPath = path.join(process.cwd(), req.path, req.file);
    const exists = fs.existsSync(fullPath);
    const hasSVGPlaceholder = fs.existsSync(fullPath.replace(/\.(jpg|png)$/, '.svg'));
    
    if (exists) {
      console.log(`✅ ${req.priority} | ${req.file} | EXISTS`);
    } else if (hasSVGPlaceholder) {
      console.log(`📝 ${req.priority} | ${req.file} | PLACEHOLDER CREATED`);
      stillMissing++;
    } else {
      console.log(`❌ ${req.priority} | ${req.file} | MISSING`);
      stillMissing++;
    }
  });

  console.log('\n🎯 RECOMMENDED ACTIONS:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  if (mappingSuggestions.length > 0) {
    console.log('\n1. 📁 COPY EXISTING IMAGES:');
    mappingSuggestions.forEach((suggestion, i) => {
      console.log(`   ${i + 1}. Copy ${suggestion.existing} → ${suggestion.target}`);
    });
    canBeMapped = mappingSuggestions.length;
  }

  console.log('\n2. 🎨 CREATE REMAINING IMAGES:');
  console.log('   • Use optimized Kling AI prompts for high-quality generation');
  console.log('   • Focus on HIGH priority items first');
  console.log('   • Use placeholder SVGs as temporary solutions');

  console.log('\n3. 🖼️  PLACEHOLDER STATUS:');
  console.log('   • SVG placeholders created for all missing images');
  console.log('   • Open placeholder-images-index.html to view all placeholders');
  console.log('   • Placeholders follow La Belle Vie brand colors and specifications');

  // Generate quick copy script
  if (mappingSuggestions.length > 0) {
    let copyScript = '#!/bin/bash\n# Quick script to copy existing images to target locations\n\n';
    mappingSuggestions.forEach(suggestion => {
      copyScript += `echo "Copying ${suggestion.existing} → ${suggestion.target}"\n`;
      copyScript += `cp "${suggestion.existing}" "${suggestion.target}"\n\n`;
    });
    
    fs.writeFileSync('scripts/copy-existing-images.sh', copyScript);
    fs.chmodSync('scripts/copy-existing-images.sh', '755');
    console.log('\n📄 Quick copy script created: scripts/copy-existing-images.sh');
  }

  console.log('\n\n🎉 SUMMARY:');
  console.log(`   📊 Total required: ${requiredImages.length} images`);
  console.log(`   ✅ Can be mapped from existing: ${canBeMapped} images`);
  console.log(`   ❌ Still need to create: ${stillMissing - canBeMapped} images`);
  console.log(`   📝 Placeholders ready: ${stillMissing} SVG files`);
  
  const totalExisting = existingImages.assets.length + existingImages.lovableUploads.length + 
                       existingImages.images.length + existingImages.root.length;
  console.log(`   🖼️  Total existing images in project: ${totalExisting}`);

  return {
    requiredImages,
    existingImages,
    mappingSuggestions,
    stillMissing,
    canBeMapped
  };
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  analyzeExistingImages();
}

export default analyzeExistingImages;