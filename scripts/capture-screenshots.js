const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

// Create screenshots directory
const screenshotsDir = path.join(__dirname, '../screenshots');
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

async function captureScreenshots() {
  const browser = await puppeteer.launch({
    headless: false, // Set to true for production
    defaultViewport: { width: 1920, height: 1080 }
  });

  const page = await browser.newPage();

  try {
    console.log('🎯 Capturing screenshots...');

    // 1. Dashboard
    console.log('📊 Capturing Dashboard...');
    await page.goto('http://localhost:9002', { waitUntil: 'networkidle2' });
    await new Promise(resolve => setTimeout(resolve, 2000));
    await page.screenshot({
      path: path.join(screenshotsDir, 'dashboard.png'),
      fullPage: true
    });

    // 2. Login Page
    console.log('🔐 Capturing Login Page...');
    await page.goto('http://localhost:9002/login', { waitUntil: 'networkidle2' });
    await new Promise(resolve => setTimeout(resolve, 2000));
    await page.screenshot({
      path: path.join(screenshotsDir, 'login.png'),
      fullPage: true
    });

    // 3. API Discovery
    console.log('🔍 Capturing API Discovery...');
    await page.goto('http://localhost:9002/api-discovery', { waitUntil: 'networkidle2' });
    await new Promise(resolve => setTimeout(resolve, 2000));
    await page.screenshot({
      path: path.join(screenshotsDir, 'api-discovery.png'),
      fullPage: true
    });

    // 4. Threat Detection
    console.log('🛡️ Capturing Threat Detection...');
    await page.goto('http://localhost:9002/threat-detection', { waitUntil: 'networkidle2' });
    await new Promise(resolve => setTimeout(resolve, 2000));
    await page.screenshot({
      path: path.join(screenshotsDir, 'threat-detection.png'),
      fullPage: true
    });

    // 5. API Catalog
    console.log('📚 Capturing API Catalog...');
    await page.goto('http://localhost:9002/api-catalog', { waitUntil: 'networkidle2' });
    await new Promise(resolve => setTimeout(resolve, 2000));
    await page.screenshot({
      path: path.join(screenshotsDir, 'api-catalog.png'),
      fullPage: true
    });

    // 6. MCP Security
    console.log('🤖 Capturing MCP Security...');
    await page.goto('http://localhost:9002/mcp-catalog', { waitUntil: 'networkidle2' });
    await new Promise(resolve => setTimeout(resolve, 2000));
    await page.screenshot({
      path: path.join(screenshotsDir, 'mcp-security.png'),
      fullPage: true
    });

    // 7. API Documentation
    console.log('📄 Capturing API Documentation...');
    await page.goto('http://localhost:9002/api-documentation', { waitUntil: 'networkidle2' });
    await new Promise(resolve => setTimeout(resolve, 2000));
    await page.screenshot({
      path: path.join(screenshotsDir, 'api-documentation.png'),
      fullPage: true
    });

    // 8. Security Policies
    console.log('🔒 Capturing Security Policies...');
    await page.goto('http://localhost:9002/security-policies', { waitUntil: 'networkidle2' });
    await new Promise(resolve => setTimeout(resolve, 2000));
    await page.screenshot({
      path: path.join(screenshotsDir, 'security-policies.png'),
      fullPage: true
    });

    console.log('✅ All screenshots captured successfully!');
    console.log(`📁 Screenshots saved to: ${screenshotsDir}`);

  } catch (error) {
    console.error('❌ Error capturing screenshots:', error);
  } finally {
    await browser.close();
  }
}

// Run the screenshot capture
captureScreenshots().catch(console.error); 