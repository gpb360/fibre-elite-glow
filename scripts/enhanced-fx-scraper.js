import { chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import { pipeline } from 'stream';

const streamPipeline = promisify(pipeline);

async function enhancedGoogleFxScraper() {
  console.log('🚀 Starting enhanced Google FX multi-section scraper...');
  
  const downloadDir = path.join(process.cwd(), 'downloads', 'google-fx-images');
  if (!fs.existsSync(downloadDir)) {
    fs.mkdirSync(downloadDir, { recursive: true });
  }

  let context;
  let page;
  let totalDownloads = 0;

  try {
    context = await chromium.launchPersistentContext('/tmp/playwright-google-fx-enhanced', {
      headless: false,
      viewport: { width: 1920, height: 1080 },
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      args: [
        '--no-first-run',
        '--disable-blink-features=AutomationControlled'
      ]
    });

    page = await context.newPage();

    // List of different Google FX URLs to try
    const fxUrls = [
      'https://labs.google/fx/library?type=whisk',
      'https://labs.google/fx/library',
      'https://labs.google/fx/',
      'https://aitestkitchen.withgoogle.com/',
      'https://labs.google.com/search?q=images'
    ];

    const downloadedFiles = [];

    for (const url of fxUrls) {
      try {
        console.log(`\n🌐 Trying: ${url}`);
        await page.goto(url, { 
          waitUntil: 'networkidle',
          timeout: 30000 
        });

        await page.waitForTimeout(3000);

        // Try to sign in if needed
        const signInSelectors = [
          'button:has-text("Sign in")',
          'a:has-text("Sign in")',
          'a[href*="accounts.google.com"]'
        ];

        for (const selector of signInSelectors) {
          try {
            const element = page.locator(selector).first();
            if (await element.isVisible({ timeout: 2000 })) {
              console.log('🔐 Attempting sign-in...');
              await element.click();
              await page.waitForTimeout(5000);
              break;
            }
          } catch (e) {
            // Continue
          }
        }

        // Look for images with various strategies
        const imageStrategies = [
          // Strategy 1: Standard img tags
          async () => {
            const images = await page.locator('img[src*="http"]').all();
            console.log(`  📸 Strategy 1: Found ${images.length} standard images`);
            return images;
          },
          
          // Strategy 2: Lazy-loaded images
          async () => {
            await page.evaluate(() => {
              window.scrollTo(0, document.body.scrollHeight);
            });
            await page.waitForTimeout(2000);
            const images = await page.locator('img[data-src*="http"], img[loading="lazy"]').all();
            console.log(`  📸 Strategy 2: Found ${images.length} lazy-loaded images`);
            return images;
          },

          // Strategy 3: Background images
          async () => {
            const elements = await page.evaluate(() => {
              const divs = Array.from(document.querySelectorAll('div, section, article'));
              return divs
                .filter(div => {
                  const style = window.getComputedStyle(div);
                  return style.backgroundImage && style.backgroundImage !== 'none' && style.backgroundImage.includes('http');
                })
                .map(div => window.getComputedStyle(div).backgroundImage.match(/url\("?([^"]*)"?\)/)?.[1])
                .filter(Boolean);
            });
            console.log(`  📸 Strategy 3: Found ${elements.length} background images`);
            return elements.map(src => ({ getAttribute: () => Promise.resolve(src) }));
          },

          // Strategy 4: Canvas and SVG
          async () => {
            const canvases = await page.locator('canvas').all();
            const svgs = await page.locator('svg image').all();
            console.log(`  📸 Strategy 4: Found ${canvases.length} canvases, ${svgs.length} SVG images`);
            return [...canvases, ...svgs];
          }
        ];

        let allImages = [];
        for (const strategy of imageStrategies) {
          try {
            const images = await strategy();
            allImages = allImages.concat(images);
          } catch (e) {
            console.log(`  ⚠️  Strategy failed: ${e.message}`);
          }
        }

        // Download unique images
        const seenSrcs = new Set();
        const uniqueImages = [];

        for (const img of allImages) {
          try {
            const src = await img.getAttribute('src') || await img.getAttribute('data-src') || img;
            if (typeof src === 'string' && !seenSrcs.has(src) && (src.startsWith('http') || src.startsWith('data:'))) {
              seenSrcs.add(src);
              uniqueImages.push(src);
            }
          } catch (e) {
            // Skip problematic images
          }
        }

        console.log(`  📊 Found ${uniqueImages.length} unique images on this page`);

        // Download up to 10 images per URL
        const maxPerUrl = 10;
        for (let i = 0; i < Math.min(uniqueImages.length, maxPerUrl); i++) {
          try {
            const src = uniqueImages[i];
            console.log(`  📥 Downloading ${i + 1}/${Math.min(uniqueImages.length, maxPerUrl)}: ${src.substring(0, 60)}...`);

            if (src.startsWith('data:')) {
              // Handle data URLs
              const matches = src.match(/^data:image\/([^;]+);base64,(.+)$/);
              if (matches) {
                const extension = matches[1] === 'jpeg' ? 'jpg' : matches[1];
                const base64Data = matches[2];
                const filename = `fx-enhanced-${String(totalDownloads + 1).padStart(3, '0')}.${extension}`;
                const filepath = path.join(downloadDir, filename);
                
                fs.writeFileSync(filepath, base64Data, 'base64');
                downloadedFiles.push(filename);
                totalDownloads++;
                console.log(`  ✅ Saved: ${filename}`);
              }
            } else {
              // Handle regular URLs
              try {
                const response = await fetch(src, {
                  headers: {
                    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
                    'Referer': url,
                    'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8'
                  }
                });

                if (response.ok && response.headers.get('content-type')?.startsWith('image/')) {
                  const extension = src.includes('.png') ? 'png' : 
                                 src.includes('.gif') ? 'gif' : 
                                 src.includes('.webp') ? 'webp' : 'jpg';
                  const filename = `fx-enhanced-${String(totalDownloads + 1).padStart(3, '0')}.${extension}`;
                  const filepath = path.join(downloadDir, filename);
                  
                  const buffer = await response.arrayBuffer();
                  fs.writeFileSync(filepath, Buffer.from(buffer));
                  
                  downloadedFiles.push(filename);
                  totalDownloads++;
                  console.log(`  ✅ Saved: ${filename}`);
                } else {
                  console.log(`  ❌ Invalid response: ${response.status}`);
                }
              } catch (fetchError) {
                console.log(`  ❌ Download error: ${fetchError.message}`);
              }
            }

            await page.waitForTimeout(500); // Be respectful
          } catch (error) {
            console.log(`  ⚠️  Error downloading image: ${error.message}`);
          }
        }

      } catch (urlError) {
        console.log(`❌ Error with URL ${url}: ${urlError.message}`);
      }
    }

    // Try alternative Google services for more images
    console.log('\n🔍 Trying alternative Google services...');
    
    const alternativeUrls = [
      'https://artsandculture.google.com/',
      'https://www.google.com/search?q=fiber+supplement+images&tbm=isch',
      'https://fonts.google.com/',
      'https://material.io/design'
    ];

    for (const url of alternativeUrls) {
      try {
        console.log(`\n🌐 Checking: ${url}`);
        await page.goto(url, { waitUntil: 'networkidle', timeout: 20000 });
        await page.waitForTimeout(2000);

        const images = await page.locator('img[src*="http"]').all();
        console.log(`  📸 Found ${images.length} images`);

        // Download a few from each alternative source
        for (let i = 0; i < Math.min(images.length, 3); i++) {
          try {
            const img = images[i];
            const src = await img.getAttribute('src');
            
            if (src && src.startsWith('http')) {
              const response = await fetch(src, {
                headers: {
                  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
                  'Referer': url
                }
              });

              if (response.ok && response.headers.get('content-type')?.startsWith('image/')) {
                const extension = src.includes('.png') ? 'png' : 'jpg';
                const filename = `alt-source-${String(totalDownloads + 1).padStart(3, '0')}.${extension}`;
                const filepath = path.join(downloadDir, filename);
                
                const buffer = await response.arrayBuffer();
                fs.writeFileSync(filepath, Buffer.from(buffer));
                
                downloadedFiles.push(filename);
                totalDownloads++;
                console.log(`  ✅ Saved: ${filename}`);
              }
            }
          } catch (e) {
            // Skip errors
          }
        }
      } catch (e) {
        console.log(`  ⚠️  Skipped ${url}: ${e.message}`);
      }
    }

    // Generate comprehensive summary
    const summary = `Enhanced Google FX Scraper Results
Generated: ${new Date().toISOString()}
Total Images Downloaded: ${totalDownloads}
Download Location: ${downloadDir}

Downloaded Files:
${downloadedFiles.map(f => `- ${f}`).join('\n')}

Sources Checked:
${fxUrls.map(url => `- ${url}`).join('\n')}
${alternativeUrls.map(url => `- ${url}`).join('\n')}

La Belle Vie Priority Mapping:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔥 HIGH PRIORITY (Review First):
1. og-default.jpg (1200x630) - Social media banner
   └─ Look for: Brand banners, social media graphics
   
2. benefits-hero.jpg (1200x630) - Health benefits hero
   └─ Look for: People exercising, healthy lifestyle images
   
3. logo.png (500x200) - La Belle Vie logo
   └─ Look for: Clean logo designs, minimalist branding
   
4. total-essential.jpg (800x800) - Green supplement jar
   └─ Look for: Green product shots, supplement containers
   
5. total-essential-plus.jpg (800x800) - Berry supplement jar  
   └─ Look for: Purple/berry colored products, superfruit items

⚡ MEDIUM PRIORITY:
- Educational backgrounds and ingredient images
- Scientific diagrams and health illustrations

📝 LOW PRIORITY:
- Individual ingredient closeups
- Detailed scientific diagrams

NEXT STEPS:
1. Review all ${totalDownloads} downloaded images
2. Select best matches for each target file
3. Rename to exact target filenames
4. Move to correct project directories
5. Use optimized Kling AI prompts for any remaining gaps

Reference: optimized-kling-ai-prompts.csv for detailed specifications!
`;

    const summaryPath = path.join(downloadDir, 'enhanced-scrape-summary.txt');
    fs.writeFileSync(summaryPath, summary);

    console.log(`\n🎉 Enhanced scraping completed!`);
    console.log(`📊 Total downloads: ${totalDownloads} images`);
    console.log(`📂 Location: ${downloadDir}`);
    console.log(`📋 Summary: ${summaryPath}`);

    if (totalDownloads > 0) {
      console.log(`\n🔄 Next: Review images and run organization script:`);
      console.log(`   node scripts/organize-downloaded-images.js`);
    }

  } catch (error) {
    console.error('\n❌ Enhanced scraper error:', error.message);
  } finally {
    try {
      if (page && !page.isClosed()) await page.close();
      if (context) await context.close();
    } catch (e) {
      // Ignore cleanup errors
    }
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  enhancedGoogleFxScraper();
}

export default enhancedGoogleFxScraper;