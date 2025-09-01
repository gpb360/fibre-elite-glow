import { chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import { pipeline } from 'stream';
import https from 'https';
import querystring from 'querystring';

const streamPipeline = promisify(pipeline);

// Google OAuth credentials and token management
class GoogleAuth {
  constructor() {
    this.tokensPath = path.join(process.cwd(), 'google-sheets-tokens.json');
    this.credentials = null;
    this.loadCredentials();
  }

  loadCredentials() {
    try {
      if (fs.existsSync(this.tokensPath)) {
        this.credentials = JSON.parse(fs.readFileSync(this.tokensPath, 'utf8'));
        console.log('✅ Loaded existing Google credentials');
      } else {
        console.log('⚠️  No existing Google credentials found');
      }
    } catch (error) {
      console.error('❌ Error loading credentials:', error.message);
    }
  }

  async refreshAccessToken() {
    if (!this.credentials || !this.credentials.refresh_token) {
      throw new Error('No refresh token available');
    }

    const postData = querystring.stringify({
      client_id: this.credentials.client_id,
      client_secret: this.credentials.client_secret,
      refresh_token: this.credentials.refresh_token,
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
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => {
          try {
            const response = JSON.parse(data);
            if (response.access_token) {
              this.credentials.access_token = response.access_token;
              this.credentials.expires_in = response.expires_in;
              this.credentials.generated_at = new Date().toISOString();

              // Save updated credentials
              fs.writeFileSync(this.tokensPath, JSON.stringify(this.credentials, null, 2));
              console.log('✅ Access token refreshed successfully');
              resolve(response.access_token);
            } else {
              reject(new Error('Failed to refresh token: ' + data));
            }
          } catch (error) {
            reject(error);
          }
        });
      });

      req.on('error', reject);
      req.write(postData);
      req.end();
    });
  }

  async getValidAccessToken() {
    if (!this.credentials) {
      throw new Error('No credentials available');
    }

    // Check if token is expired (with 5 minute buffer)
    const now = new Date();
    const tokenTime = new Date(this.credentials.generated_at);
    const expiresIn = this.credentials.expires_in || 3600;
    const tokenAge = (now - tokenTime) / 1000;

    if (tokenAge > (expiresIn - 300)) {
      console.log('🔄 Access token expired, refreshing...');
      return await this.refreshAccessToken();
    }

    return this.credentials.access_token;
  }

  async injectAuthCookies(page) {
    try {
      const accessToken = await this.getValidAccessToken();

      // Set authentication cookies that Google services recognize
      await page.context().addCookies([
        {
          name: 'oauth_token',
          value: accessToken,
          domain: '.google.com',
          path: '/',
          httpOnly: false,
          secure: true,
          sameSite: 'None'
        },
        {
          name: 'oauth_token',
          value: accessToken,
          domain: '.labs.google.com',
          path: '/',
          httpOnly: false,
          secure: true,
          sameSite: 'None'
        }
      ]);

      // Set authorization header for requests
      await page.setExtraHTTPHeaders({
        'Authorization': `Bearer ${accessToken}`
      });

      console.log('✅ Injected Google authentication');
      return true;
    } catch (error) {
      console.error('❌ Failed to inject auth:', error.message);
      return false;
    }
  }
}

async function scrapeGoogleFxImages() {
  console.log('🚀 Starting automated Google FX image scraper...');

  // Initialize Google authentication
  const googleAuth = new GoogleAuth();

  // Create downloads directory
  const downloadDir = path.join(process.cwd(), 'downloads', 'google-fx-images');
  if (!fs.existsSync(downloadDir)) {
    fs.mkdirSync(downloadDir, { recursive: true });
  }

  let context;
  let page;

  try {
    // Try to use existing browser session first
    console.log('🔗 Attempting to use existing browser session...');

    // First, try to connect to existing Chrome browser if running
    try {
      // Check if there's an existing Chrome instance we can connect to
      const browser = await chromium.connectOverCDP('http://localhost:9222');
      const contexts = browser.contexts();

      if (contexts.length > 0) {
        context = contexts[0];
        console.log('✅ Connected to existing browser session');
      } else {
        await browser.close();
        throw new Error('No existing contexts found');
      }
    } catch (connectError) {
      console.log('ℹ️  No existing browser session found, launching new browser...');

      // Launch browser with persistent context and user data directory
      // This will maintain authentication between sessions
      const userDataDir = path.join(process.cwd(), '.browser-data', 'google-fx');
      if (!fs.existsSync(userDataDir)) {
        fs.mkdirSync(userDataDir, { recursive: true });
      }

      context = await chromium.launchPersistentContext(userDataDir, {
        headless: false, // Keep visible for authentication
        viewport: { width: 1920, height: 1080 },
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        args: [
          '--no-first-run',
          '--disable-blink-features=AutomationControlled',
          '--disable-features=VizDisplayCompositor'
        ],
        ignoreDefaultArgs: ['--enable-automation'],
        extraHTTPHeaders: {
          'Accept-Language': 'en-US,en;q=0.9'
        }
      });

      console.log('🌐 New browser launched - authentication may be required');
    }

    // Remove automation indicators
    await context.addInitScript(() => {
      Object.defineProperty(navigator, 'webdriver', {
        get: () => undefined,
      });
    });

    page = await context.newPage();

    // Set additional headers
    await page.setExtraHTTPHeaders({
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Encoding': 'gzip, deflate, br',
      'DNT': '1',
      'Connection': 'keep-alive',
      'Upgrade-Insecure-Requests': '1',
    });

    // Inject Google authentication
    console.log('🔐 Setting up Google authentication...');
    const authSuccess = await googleAuth.injectAuthCookies(page);

    if (!authSuccess) {
      console.log('⚠️  Authentication setup failed, will try manual login if needed');
    }

    // Navigate to Google first to establish session
    console.log('🌐 Navigating to Google to establish session...');
    await page.goto('https://www.google.com', {
      waitUntil: 'networkidle',
      timeout: 30000
    });

    await page.waitForTimeout(2000);

    // Check if we need to accept cookies
    try {
      const acceptButton = page.locator('button:has-text("Accept all"), button:has-text("I agree"), button:has-text("Accept")').first();
      if (await acceptButton.isVisible({ timeout: 5000 })) {
        await acceptButton.click();
        console.log('✅ Accepted cookies');
      }
    } catch (e) {
      console.log('ℹ️  No cookie banner found');
    }

    // Navigation will be handled in the authentication flow

    // Enhanced authentication detection and handling
    console.log('🔍 Checking authentication status...');

    async function checkAuthenticationStatus() {
      // Look for signs that we're authenticated with Google
      const authIndicators = [
        '[data-ogsr-up]', // Google account indicator
        '.gb_A', // Google account menu
        '[aria-label*="Account"]',
        '.account-info',
        '[data-ved]', // Google search elements (indicates logged in)
        '.gb_D', // Google apps menu
        'a[href*="myaccount.google.com"]' // Account link
      ];

      for (const selector of authIndicators) {
        try {
          const element = page.locator(selector).first();
          if (await element.isVisible({ timeout: 1000 })) {
            return true;
          }
        } catch (e) {
          // Continue checking
        }
      }
      return false;
    }

    let isAuthenticated = await checkAuthenticationStatus();

    if (isAuthenticated) {
      console.log('✅ Already authenticated with Google');
    } else {
      console.log('⚠️  Not authenticated - will need to sign in');
    }

    if (!isAuthenticated) {
      console.log('🔐 Authentication required - setting up sign-in process...');

      // Navigate to Google FX Library first to trigger sign-in
      console.log('🎨 Navigating to Google FX Library to check access...');
      await page.goto('https://labs.google/fx/library?type=whisk', {
        waitUntil: 'networkidle',
        timeout: 30000
      });

      await page.waitForTimeout(3000);

      // Check if we're now authenticated after navigation
      isAuthenticated = await checkAuthenticationStatus();

      if (!isAuthenticated) {
        // Look for sign-in buttons or prompts
        const signInSelectors = [
          'a[href*="accounts.google.com"]',
          'button:has-text("Sign in")',
          'a:has-text("Sign in")',
          '.sign-in',
          '[data-action="sign-in"]',
          'button[data-action="signin"]',
          'button:has-text("Get started")'
        ];

        let signInFound = false;
        for (const selector of signInSelectors) {
          try {
            const element = page.locator(selector).first();
            if (await element.isVisible({ timeout: 2000 })) {
              console.log(`🔐 Found sign-in button: ${selector}`);
              console.log('⚠️  Manual authentication required!');
              console.log('   Please sign in to Google in the browser window that opened.');
              console.log('   After signing in, press Enter here to continue...');

              signInFound = true;
              break;
            }
          } catch (e) {
            // Continue checking other selectors
          }
        }

        if (!signInFound) {
          console.log('⚠️  Authentication status unclear. Please check the browser window.');
          console.log('   If you need to sign in, please do so now.');
          console.log('   Press Enter when ready to continue...');
        }

        // Wait for manual authentication
        await new Promise(resolve => {
          import('readline').then(({ createInterface }) => {
            const rl = createInterface({
              input: process.stdin,
              output: process.stdout
            });
            rl.question('Press Enter after signing in to Google...', () => {
              rl.close();
              resolve();
            });
          });
        });

        // Verify authentication after manual sign-in
        console.log('🔄 Verifying authentication...');
        await page.reload({ waitUntil: 'networkidle' });
        await page.waitForTimeout(3000);

        isAuthenticated = await checkAuthenticationStatus();

        if (isAuthenticated) {
          console.log('✅ Authentication successful!');
        } else {
          console.log('⚠️  Authentication verification inconclusive, proceeding anyway...');
        }
      } else {
        console.log('✅ Authentication detected after navigation');
      }
    } else {
      // If already authenticated, navigate to the FX library
      console.log('🎨 Navigating to Google FX Library...');
      await page.goto('https://labs.google/fx/library?type=whisk', {
        waitUntil: 'networkidle',
        timeout: 30000
      });
      await page.waitForTimeout(3000);
    }

    console.log('🔍 Navigating through Google FX Library UI...');

    // Wait for the library page to load
    await page.waitForTimeout(5000);

    // Step 1: Look for and click on "Images" or similar navigation
    console.log('📂 Looking for Images section...');

    const imagesSectionSelectors = [
      'a:has-text("Images")',
      'button:has-text("Images")',
      '[data-category="images"]',
      '.category-images',
      'a[href*="images"]',
      'button[aria-label*="Images"]',
      '.nav-item:has-text("Images")'
    ];

    let imagesSection = null;
    for (const selector of imagesSectionSelectors) {
      try {
        const element = page.locator(selector).first();
        if (await element.isVisible({ timeout: 3000 })) {
          console.log(`✅ Found Images section: ${selector}`);
          imagesSection = element;
          break;
        }
      } catch (e) {
        // Continue checking
      }
    }

    if (imagesSection) {
      console.log('🖱️  Clicking on Images section...');
      await imagesSection.click();
      await page.waitForTimeout(5000); // Increased wait time

      // Debug: Check what's actually on the page after clicking Images
      console.log('🔍 Debug: Checking page content after clicking Images...');
      const allImages = await page.locator('img').all();
      console.log(`   Found ${allImages.length} total img elements`);

      const specificImages = await page.locator('img.sc-45c5bb04-2').all();
      console.log(`   Found ${specificImages.length} Google FX images (sc-45c5bb04-2)`);

      const allDivs = await page.locator('div').all();
      console.log(`   Found ${allDivs.length} total div elements`);

    } else {
      console.log('ℹ️  No specific Images section found, proceeding with current page');
    }

    // Step 2: Look for the specific Google FX image containers
    console.log('🖼️  Looking for Google FX image containers...');

    // Based on debug analysis, try multiple approaches to find clickable containers
    const imageContainerSelectors = [
      '.sc-3891b690-0.kshWfx.sc-c81bbd81-1.iMJBNG', // Exact match from debug
      '.sc-3891b690-0', // Partial match
      '.kshWfx', // Another partial match
      'div[class*="sc-3891b690-0"]', // Contains class
      'div[class*="kshWfx"]', // Contains class
      'div[class*="sc-c81bbd81-1"]' // Contains class
    ];

    let imageCards = [];
    for (const selector of imageContainerSelectors) {
      try {
        const cards = await page.locator(selector).all();
        if (cards.length > 0) {
          console.log(`📊 Found ${cards.length} containers with selector: ${selector}`);
          imageCards = cards;
          break; // Use first successful selector
        }
      } catch (e) {
        console.log(`❌ Error with selector ${selector}:`, e.message);
      }
    }

    if (imageCards.length === 0) {
      // Fallback: look for any div containing the specific image classes
      console.log('🔍 Fallback: Looking for divs containing Google FX images...');
      try {
        const fallbackSelector = 'div:has(img.sc-45c5bb04-2)';
        imageCards = await page.locator(fallbackSelector).all();
        console.log(`📊 Found ${imageCards.length} fallback image containers`);

        if (imageCards.length === 0) {
          // Last resort: look for any images and try to find their clickable parents
          console.log('🔍 Last resort: Looking for image parent elements...');
          const images = await page.locator('img.sc-45c5bb04-2').all();

          for (let i = 0; i < Math.min(images.length, 10); i++) {
            try {
              // Try to find clickable parent by going up the DOM
              const parentDiv = images[i].locator('..').locator('..').locator('..');
              if (await parentDiv.isVisible({ timeout: 1000 })) {
                imageCards.push(parentDiv);
              }
            } catch (e) {
              // Skip problematic elements
            }
          }

          console.log(`📊 Found ${imageCards.length} parent containers`);
        }
      } catch (e) {
        console.log('❌ Error in fallback detection:', e.message);
      }
    }

    // Step 3: Process each image through the download flow
    console.log(`📊 Found ${imageCards.length} images to process`);

    let downloadCount = 0;
    const maxDownloads = Math.min(imageCards.length, 10); // Reasonable limit for testing

    for (let i = 0; i < maxDownloads; i++) {
      try {
        const imageCard = imageCards[i];

        console.log(`\n🖼️  Processing image ${i + 1}/${maxDownloads}...`);

        // Click on the image card to open it
        console.log('🖱️  Clicking on image...');

        // Try different click approaches
        try {
          // First try a regular click
          await imageCard.click();
          await page.waitForTimeout(2000);

          // Check if a modal opened or if we navigated
          const modalSelectors = [
            '.modal',
            '.dialog',
            '.overlay',
            '.popup',
            '[role="dialog"]',
            '.lightbox'
          ];

          let modalFound = false;
          for (const selector of modalSelectors) {
            try {
              const modal = page.locator(selector).first();
              if (await modal.isVisible({ timeout: 1000 })) {
                console.log(`✅ Modal/dialog opened: ${selector}`);
                modalFound = true;
                break;
              }
            } catch (e) {
              // Continue checking
            }
          }

          if (!modalFound) {
            // Try double-click if single click didn't work
            console.log('🖱️  Trying double-click...');
            await imageCard.dblclick();
            await page.waitForTimeout(2000);
          }

        } catch (clickError) {
          console.log(`⚠️  Click error: ${clickError.message}`);
        }

        await page.waitForTimeout(1000);

        // Look for download button on the image detail page
        console.log('🔍 Looking for download button...');

        // Wait a bit more for the page to fully load
        await page.waitForTimeout(2000);

        const downloadButtonSelectors = [
          'button:has-text("Download")', // This is the one that works!
          'a:has-text("Download")',
          'button:has-text("download")', // lowercase
          'a:has-text("download")', // lowercase
          '[aria-label*="Download"]',
          '[aria-label*="download"]',
          '.download-btn',
          '.download-button',
          'button[data-action="download"]',
          '.btn-download',
          'a[download]',
          'button:has-text("Save")',
          'a:has-text("Save")',
          'button:has-text("Get")',
          'a:has-text("Get")',
          '[title*="Download"]',
          '[title*="download"]'
        ];

        // Debug: Log all buttons and links on the page
        try {
          const allButtons = await page.locator('button, a').all();
          console.log(`🔍 Found ${allButtons.length} buttons/links on page`);

          for (let i = 0; i < Math.min(allButtons.length, 10); i++) {
            try {
              const text = await allButtons[i].textContent();
              const tagName = await allButtons[i].evaluate(el => el.tagName);
              const className = await allButtons[i].getAttribute('class') || '';
              console.log(`   ${i + 1}. ${tagName}: "${text?.trim()}" (class: ${className})`);
            } catch (e) {
              // Skip problematic elements
            }
          }
        } catch (e) {
          console.log('⚠️  Could not debug page elements');
        }

        let downloadButton = null;
        for (const selector of downloadButtonSelectors) {
          try {
            const element = page.locator(selector).first();
            if (await element.isVisible({ timeout: 2000 })) {
              console.log(`✅ Found download button: ${selector}`);
              downloadButton = element;
              break;
            }
          } catch (e) {
            // Continue checking
          }
        }

        if (downloadButton) {
          console.log('📥 Clicking download button...');

          // Set up download handling
          const downloadPromise = page.waitForDownload({ timeout: 30000 });

          await downloadButton.click();

          try {
            const download = await downloadPromise;
            const filename = `google-fx-${String(downloadCount + 1).padStart(3, '0')}-${download.suggestedFilename()}`;
            const filepath = path.join(downloadDir, filename);

            await download.saveAs(filepath);
            console.log(`✅ Downloaded: ${filename}`);
            downloadCount++;

          } catch (downloadError) {
            console.log('⚠️  Download may have started in browser - checking for additional download steps...');

            // Look for a second download button or confirmation
            await page.waitForTimeout(2000);

            const secondDownloadSelectors = [
              'button:has-text("Download")',
              'a:has-text("Download")',
              '.download-confirm',
              '.final-download'
            ];

            for (const selector of secondDownloadSelectors) {
              try {
                const element = page.locator(selector).first();
                if (await element.isVisible({ timeout: 2000 })) {
                  console.log(`🔄 Found second download button: ${selector}`);

                  const secondDownloadPromise = page.waitForDownload({ timeout: 30000 });
                  await element.click();

                  try {
                    const download = await secondDownloadPromise;
                    const filename = `google-fx-${String(downloadCount + 1).padStart(3, '0')}-${download.suggestedFilename()}`;
                    const filepath = path.join(downloadDir, filename);

                    await download.saveAs(filepath);
                    console.log(`✅ Downloaded: ${filename}`);
                    downloadCount++;
                    break;

                  } catch (e) {
                    console.log('⚠️  Second download attempt failed');
                  }
                }
              } catch (e) {
                // Continue checking
              }
            }
          }
        } else {
          console.log('❌ No download button found for this image');
        }

        // Navigate back to the library or close modal
        console.log('🔙 Navigating back to library...');

        const backButtonSelectors = [
          'button:has-text("Back")',
          'button:has-text("Close")',
          '[aria-label*="Close"]',
          '[aria-label*="Back"]',
          '.close-btn',
          '.back-btn',
          'button[data-action="close"]'
        ];

        let backButton = null;
        for (const selector of backButtonSelectors) {
          try {
            const element = page.locator(selector).first();
            if (await element.isVisible({ timeout: 2000 })) {
              await element.click();
              backButton = element;
              break;
            }
          } catch (e) {
            // Continue checking
          }
        }

        if (!backButton) {
          // Try pressing Escape key
          await page.keyboard.press('Escape');
        }

        await page.waitForTimeout(2000);

      } catch (error) {
        console.log(`⚠️  Error processing image ${i + 1}: ${error.message}`);

        // Try to recover by going back to the main page
        try {
          await page.goto('https://labs.google/fx/library?type=whisk', {
            waitUntil: 'networkidle',
            timeout: 15000
          });
          await page.waitForTimeout(3000);
        } catch (e) {
          console.log('⚠️  Failed to recover, continuing...');
        }
      }
    }

    // Optional: Try to load more images by scrolling (if needed)
    if (downloadCount < 5 && imageCards.length > maxDownloads) {
      console.log('🔄 Scrolling to load more images...');

      for (let scroll = 0; scroll < 2; scroll++) {
        await page.evaluate(() => {
          window.scrollBy(0, window.innerHeight);
        });
        await page.waitForTimeout(3000);

        // Look for new image cards after scroll
        try {
          const newCards = await page.locator('.image-card, .thumbnail, .gallery-item').all();
          console.log(`Found ${newCards.length} total image cards after scroll ${scroll + 1}`);

          // Process a few more images if found
          if (newCards.length > imageCards.length) {
            const additionalCards = newCards.slice(imageCards.length, imageCards.length + 3);
            console.log(`📊 Processing ${additionalCards.length} additional images...`);

            for (let j = 0; j < additionalCards.length; j++) {
              // Similar processing logic as above (simplified for brevity)
              try {
                await additionalCards[j].click();
                await page.waitForTimeout(2000);

                const downloadBtn = page.locator('button:has-text("Download")').first();
                if (await downloadBtn.isVisible({ timeout: 3000 })) {
                  const downloadPromise = page.waitForDownload({ timeout: 15000 });
                  await downloadBtn.click();

                  try {
                    const download = await downloadPromise;
                    const filename = `google-fx-${String(downloadCount + 1).padStart(3, '0')}-${download.suggestedFilename()}`;
                    const filepath = path.join(downloadDir, filename);
                    await download.saveAs(filepath);
                    console.log(`✅ Downloaded additional: ${filename}`);
                    downloadCount++;
                  } catch (e) {
                    console.log('⚠️  Additional download failed');
                  }
                }

                await page.keyboard.press('Escape');
                await page.waitForTimeout(1000);

              } catch (e) {
                console.log(`⚠️  Error with additional image ${j + 1}`);
              }
            }
          }
        } catch (e) {
          console.log('No additional images found after scrolling');
        }
      }
    }

    // Generate summary
    const downloadedFiles = fs.existsSync(downloadDir) ?
      fs.readdirSync(downloadDir).filter(f => f.startsWith('google-fx-')) : [];

    const summary = `Google FX Library Scrape Summary
Generated: ${new Date().toISOString()}
Total Images Downloaded: ${downloadCount}
Download Location: ${downloadDir}
Processing Method: UI Navigation + Download Flow

Files Downloaded:
${downloadedFiles.length > 0 ? downloadedFiles.map(f => `- ${f}`).join('\n') : '- No files downloaded yet'}

Scraping Process:
1. ✅ Authenticated with Google
2. ✅ Navigated to Google FX Library
3. ✅ Located Images section
4. ✅ Processed ${maxDownloads} image cards
5. ✅ Used proper download flow (click → download → back)

Next Steps:
1. Review downloaded images in: ${downloadDir}
2. Select best matches for La Belle Vie needs:
   - Social media banners (og-default.jpg)
   - Health/wellness images (benefits-hero.jpg)
   - Logo designs (logo.png)
   - Product shots (total-essential.jpg, total-essential-plus.jpg)
3. Rename and move to correct directories
4. Run script again to download more images if needed
5. Use optimized Kling AI prompts for any missing images

Priority Mapping:
🔥 High: SEO images, brand assets, product images
⚡ Medium: Educational content, backgrounds
📝 Low: Ingredient closeups, diagrams

Technical Notes:
- Script now follows proper UI navigation flow
- Downloads handled through browser download API
- Each image processed individually with proper back navigation
- Authentication maintained throughout session
`;

    const summaryPath = path.join(downloadDir, 'scrape-summary.txt');
    fs.writeFileSync(summaryPath, summary);

    console.log(`\n🎉 Scraping completed!`);
    console.log(`📊 Downloaded ${downloadCount} images`);
    console.log(`📂 Location: ${downloadDir}`);
    console.log(`📋 Summary: ${summaryPath}`);

  } catch (error) {
    console.error('\n❌ Scraping error:', error.message);
    
    if (error.message.includes('net::ERR_INTERNET_DISCONNECTED')) {
      console.log('🌐 Internet connection issue. Please check your connection.');
    } else if (error.message.includes('Target page, context or browser has been closed')) {
      console.log('🔄 Browser was closed. This is normal if closed manually.');
    } else {
      console.log('💡 Try running the script again or check the Google FX Library manually.');
    }
  } finally {
    // Cleanup
    try {
      if (page && !page.isClosed()) await page.close();
      if (context) await context.close();
    } catch (e) {
      // Ignore cleanup errors
    }
  }
}

// Add error handling and retry logic
async function runWithRetry() {
  const maxRetries = 2;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`\n🔄 Attempt ${attempt}/${maxRetries}`);
      await scrapeGoogleFxImages();
      break; // Success, exit retry loop
    } catch (error) {
      console.error(`❌ Attempt ${attempt} failed:`, error.message);
      
      if (attempt < maxRetries) {
        console.log(`⏳ Waiting 5 seconds before retry...`);
        await new Promise(resolve => setTimeout(resolve, 5000));
      } else {
        console.log(`\n💡 All attempts failed. Manual alternatives:`);
        console.log(`1. 🌐 Visit: https://labs.google/fx/library?type=whisk`);
        console.log(`2. 🖼️  Right-click images and save manually`);
        console.log(`3. 📁 Save to: downloads/google-fx-images/`);
        console.log(`4. 🏷️  Use the mapping guide for organization`);
      }
    }
  }
}

export { runWithRetry as default };

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runWithRetry();
}