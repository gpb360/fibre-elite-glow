import fs from 'fs';
import path from 'path';

// Create SVG-based placeholder images with proper dimensions and La Belle Vie branding
function createPlaceholderImages() {
  console.log('🎨 Creating placeholder images for La Belle Vie...');

  const placeholders = [
    {
      name: 'og-default.jpg',
      path: 'public/assets/',
      width: 1200,
      height: 630,
      title: 'La Belle Vie',
      subtitle: 'Premium Gut Health Supplements',
      bgColor: '#2D5016',
      textColor: '#FFFFFF'
    },
    {
      name: 'benefits-hero.jpg', 
      path: 'public/assets/',
      width: 1200,
      height: 630,
      title: 'Health Benefits',
      subtitle: 'Transform Your Wellness Journey',
      bgColor: '#4A7C59',
      textColor: '#FFFFFF'
    },
    {
      name: 'faq-hero.jpg',
      path: 'public/assets/', 
      width: 1200,
      height: 630,
      title: 'FAQ',
      subtitle: 'Your Questions Answered',
      bgColor: '#6B9C78',
      textColor: '#FFFFFF'
    },
    {
      name: 'testimonials-hero.jpg',
      path: 'public/assets/',
      width: 1200, 
      height: 630,
      title: 'Customer Reviews',
      subtitle: 'Real Results from Real People',
      bgColor: '#8FB997',
      textColor: '#FFFFFF'
    },
    {
      name: 'logo.png',
      path: 'public/',
      width: 500,
      height: 200,
      title: 'La Belle Vie',
      subtitle: '',
      bgColor: 'transparent',
      textColor: '#2D5016'
    },
    {
      name: 'total-essential.jpg',
      path: 'public/images/',
      width: 800,
      height: 800,
      title: 'Total Essential',
      subtitle: 'Premium Fiber Supplement',
      bgColor: '#2D5016',
      textColor: '#FFFFFF'
    },
    {
      name: 'total-essential-plus.jpg',
      path: 'public/images/',
      width: 800,
      height: 800,
      title: 'Total Essential Plus',
      subtitle: 'With Super-Fruits',
      bgColor: '#663399',
      textColor: '#FFFFFF'
    }
  ];

  let createdCount = 0;

  for (const placeholder of placeholders) {
    try {
      // Ensure directory exists
      const fullDir = path.join(process.cwd(), placeholder.path);
      if (!fs.existsSync(fullDir)) {
        fs.mkdirSync(fullDir, { recursive: true });
      }

      // Create SVG content
      const svg = createSVGPlaceholder(placeholder);
      
      // Save as SVG first
      const svgPath = path.join(fullDir, placeholder.name.replace(/\.(jpg|png)$/, '.svg'));
      fs.writeFileSync(svgPath, svg);
      
      console.log(`✅ Created: ${placeholder.path}${placeholder.name.replace(/\.(jpg|png)$/, '.svg')}`);
      createdCount++;

      // Create a simple HTML file to help convert to final format
      const htmlContent = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>${placeholder.title}</title>
    <style>
        body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }
        .placeholder { margin-bottom: 20px; border: 1px solid #ccc; }
    </style>
</head>
<body>
    <div class="placeholder">
        <h3>${placeholder.name} (${placeholder.width}x${placeholder.height})</h3>
        <div>${svg}</div>
        <p><strong>Instructions:</strong> Right-click on the image above and "Save image as..." to save as ${placeholder.name}</p>
        <p><strong>Alternative:</strong> Use the SVG file at: ${svgPath}</p>
    </div>
</body>
</html>`;

      const htmlPath = path.join(fullDir, placeholder.name.replace(/\.(jpg|png)$/, '.html'));
      fs.writeFileSync(htmlPath, htmlContent);

    } catch (error) {
      console.error(`❌ Error creating ${placeholder.name}: ${error.message}`);
    }
  }

  // Create a master index file
  const indexContent = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>La Belle Vie Placeholder Images</title>
    <style>
        body { 
            margin: 0; 
            padding: 20px; 
            font-family: Arial, sans-serif; 
            background: #f5f5f5;
        }
        .container { 
            max-width: 1200px; 
            margin: 0 auto; 
            background: white; 
            padding: 30px; 
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 40px;
            color: #2D5016;
        }
        .grid { 
            display: grid; 
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); 
            gap: 20px; 
        }
        .placeholder { 
            border: 1px solid #ddd; 
            border-radius: 8px;
            overflow: hidden;
            background: white;
        }
        .placeholder-header {
            background: #2D5016;
            color: white;
            padding: 15px;
            font-weight: bold;
        }
        .placeholder-content {
            padding: 15px;
        }
        .placeholder svg {
            width: 100%;
            height: auto;
            border: 1px solid #eee;
        }
        .instructions {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin: 30px 0;
        }
        .priority {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: bold;
        }
        .high { background: #ff6b6b; color: white; }
        .medium { background: #ffd93d; color: #333; }
        .low { background: #6bcf7f; color: white; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>La Belle Vie Placeholder Images</h1>
            <p>Temporary placeholders following brand guidelines and optimized Kling AI specifications</p>
        </div>

        <div class="instructions">
            <h2>📋 How to Use These Placeholders</h2>
            <ol>
                <li><strong>Right-click</strong> on each image below and select "Save image as..."</li>
                <li><strong>Save with exact filename</strong> shown in the header (e.g., og-default.jpg)</li>
                <li><strong>Place in correct directory</strong> as specified</li>
                <li><strong>Replace with final images</strong> when available from Google FX or Kling AI</li>
            </ol>
            
            <h3>🎯 Priority Order</h3>
            <p><span class="priority high">HIGH</span> SEO images, brand assets, product images</p>
            <p><span class="priority medium">MEDIUM</span> Educational content, backgrounds</p>
            <p><span class="priority low">LOW</span> Ingredient closeups, diagrams</p>
        </div>

        <div class="grid">
            ${placeholders.map(p => `
                <div class="placeholder">
                    <div class="placeholder-header">
                        ${p.name} 
                        <span class="priority ${p.path.includes('assets') || p.path.includes('images') ? 'high' : 'medium'}">
                            ${p.path.includes('assets') || p.path.includes('images') ? 'HIGH' : 'MEDIUM'}
                        </span>
                    </div>
                    <div class="placeholder-content">
                        ${createSVGPlaceholder(p)}
                        <p><strong>Dimensions:</strong> ${p.width}x${p.height}</p>
                        <p><strong>Directory:</strong> ${p.path}</p>
                        <p><strong>Purpose:</strong> ${getImagePurpose(p.name)}</p>
                    </div>
                </div>
            `).join('')}
        </div>

        <div class="instructions">
            <h2>🚀 Next Steps</h2>
            <ol>
                <li>Save all placeholder images to their respective directories</li>
                <li>Test your website with these placeholders</li>
                <li>Use our optimized Kling AI prompts to generate final images</li>
                <li>Replace placeholders with final professional images</li>
            </ol>
            
            <p><strong>Reference:</strong> optimized-kling-ai-prompts.csv for exact image specifications</p>
        </div>
    </div>
</body>
</html>`;

  fs.writeFileSync('placeholder-images-index.html', indexContent);

  console.log(`\n🎉 Created ${createdCount} placeholder images!`);
  console.log('📂 Locations:');
  placeholders.forEach(p => {
    console.log(`   ${p.path}${p.name.replace(/\.(jpg|png)$/, '.svg')}`);
  });
  console.log('\n🌐 Open placeholder-images-index.html in your browser to view and download all placeholders');
  console.log('📋 Follow the instructions to save each image with the correct filename and location');
}

function createSVGPlaceholder({ width, height, title, subtitle, bgColor, textColor }) {
  const titleSize = Math.max(width / 20, 24);
  const subtitleSize = Math.max(width / 30, 16);
  
  return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:${bgColor};stop-opacity:1" />
            <stop offset="100%" style="stop-color:${adjustColor(bgColor, -20)};stop-opacity:1" />
        </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="${bgColor === 'transparent' ? 'none' : 'url(#bg)'}" 
          stroke="${bgColor === 'transparent' ? textColor : 'none'}" 
          stroke-width="${bgColor === 'transparent' ? '2' : '0'}"/>
    <text x="50%" y="${height/2 - (subtitle ? titleSize/2 : 0)}" 
          font-family="Arial, sans-serif" 
          font-size="${titleSize}" 
          font-weight="bold" 
          fill="${textColor}" 
          text-anchor="middle" 
          dominant-baseline="middle">${title}</text>
    ${subtitle ? `<text x="50%" y="${height/2 + titleSize/2 + 10}" 
          font-family="Arial, sans-serif" 
          font-size="${subtitleSize}" 
          fill="${textColor}" 
          text-anchor="middle" 
          dominant-baseline="middle">${subtitle}</text>` : ''}
    <text x="${width - 10}" y="${height - 10}" 
          font-family="Arial, sans-serif" 
          font-size="12" 
          fill="${textColor}" 
          text-anchor="end" 
          opacity="0.7">${width}×${height}</text>
</svg>`;
}

function adjustColor(color, amount) {
  if (color === 'transparent') return color;
  
  const hex = color.replace('#', '');
  const r = Math.max(0, Math.min(255, parseInt(hex.substr(0, 2), 16) + amount));
  const g = Math.max(0, Math.min(255, parseInt(hex.substr(2, 2), 16) + amount));
  const b = Math.max(0, Math.min(255, parseInt(hex.substr(4, 2), 16) + amount));
  
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function getImagePurpose(filename) {
  const purposes = {
    'og-default.jpg': 'Default Open Graph social media sharing image',
    'benefits-hero.jpg': 'Hero image for benefits page showing health and wellness',
    'faq-hero.jpg': 'Hero image for FAQ page with question mark and support theme',
    'testimonials-hero.jpg': 'Hero image for testimonials page showing customer satisfaction',
    'logo.png': 'La Belle Vie company logo for branding and schema markup',
    'total-essential.jpg': 'Product image for Total Essential fiber supplement',
    'total-essential-plus.jpg': 'Product image for Total Essential Plus with super-fruits'
  };
  
  return purposes[filename] || 'Placeholder image for website content';
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  createPlaceholderImages();
}

export default createPlaceholderImages;