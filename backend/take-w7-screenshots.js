import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const findBrowserPath = () => {
  const paths = [
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    path.join(process.env.LOCALAPPDATA || '', 'Google\\Chrome\\Application\\chrome.exe')
  ];

  for (const p of paths) {
    if (fs.existsSync(p)) {
      return p;
    }
  }
  return null;
};

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function capture() {
  const browserPath = findBrowserPath();
  if (!browserPath) {
    console.error('❌ Could not locate Microsoft Edge or Google Chrome. Please take screenshots manually.');
    process.exit(1);
  }

  console.log(`🚀 Found browser at: ${browserPath}`);
  
  const browser = await puppeteer.launch({
    executablePath: browserPath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 960 });

  // ----------------------------------------------------
  // Step 1: Access login and Register a fresh account
  // ----------------------------------------------------
  console.log('🌐 Step 1: Navigating to login page...');
  await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle2' });
  await page.waitForSelector('#email');

  // Toggle to register form
  const toggleBtn = await page.evaluateHandle(() => {
    return Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Create Account'));
  });
  if (toggleBtn) {
    await toggleBtn.click();
    await page.waitForSelector('#name');
    await wait(500);
  }

  const uniqueEmail = `bhumika.ai${Date.now()}@example.com`;
  console.log(`✍️ Registering account: ${uniqueEmail}`);
  await page.type('#name', 'Bhumika Bahuguna');
  await page.type('#email', uniqueEmail);
  await page.type('#password', 'password123');
  await wait(500);

  const registerSubmitBtn = await page.evaluateHandle(() => {
    return Array.from(document.querySelectorAll('button')).find(b => b.type === 'submit');
  });
  if (registerSubmitBtn) {
    await registerSubmitBtn.click();
    console.log('⏳ Waiting for registration to complete...');
    await wait(3000); 
  }

  // ----------------------------------------------------
  // Step 2: Login
  // ----------------------------------------------------
  console.log('🌐 Step 2: Logging in...');
  await page.waitForSelector('#email');
  
  await page.click('#email', { clickCount: 3 });
  await page.keyboard.press('Backspace');
  await page.type('#email', uniqueEmail);
  await page.type('#password', 'password123');
  await wait(500);

  const loginSubmitBtn = await page.evaluateHandle(() => {
    return Array.from(document.querySelectorAll('button')).find(b => b.type === 'submit');
  });
  if (loginSubmitBtn) {
    await loginSubmitBtn.click();
    console.log('⏳ Waiting for redirect to dashboard...');
    await page.waitForSelector('#search-crops');
    await wait(2000);
  }

  // ----------------------------------------------------
  // Step 3: Navigate to AI Advisor & Prepare Query
  // ----------------------------------------------------
  console.log('🌐 Step 3: Navigating to AI Advisor...');
  await page.goto('http://localhost:5173/ai-advisor', { waitUntil: 'networkidle2' });
  await page.waitForSelector('#ai-query');
  await wait(2000); // Give time for crop list dropdown fetch

  // Type a custom query
  console.log('✍️ Writing agronomist query...');
  await page.type('#ai-query', 'Explain nitrogen management for paddy rice crops.');
  await wait(500);

  // Take Screenshot 1: User Input State
  const screenshot1Path = path.join(__dirname, '..', 'w7_1_input.png');
  await page.screenshot({ path: screenshot1Path });
  console.log(`📸 Screenshot 1 captured: ${screenshot1Path} (User Input)`);

  // ----------------------------------------------------
  // Step 4: Click Submit & Capture Loading state
  // ----------------------------------------------------
  console.log('🖱️ Clicking Ask AI...');
  const submitBtn = await page.$('#submit-ai-btn');
  if (submitBtn) {
    await submitBtn.click();
  }

  // Instantly wait 300ms for loader to toggle and capture Screenshot 2: Loading State
  await wait(300);
  const screenshot2Path = path.join(__dirname, '..', 'w7_2_loading.png');
  await page.screenshot({ path: screenshot2Path });
  console.log(`📸 Screenshot 2 captured: ${screenshot2Path} (Loading State)`);

  // ----------------------------------------------------
  // Step 5: Wait for response & capture Output
  // ----------------------------------------------------
  console.log('⏳ Waiting for AI advice response to render...');
  await page.waitForSelector('#ai-output-response', { timeout: 10000 });
  await wait(2000); // Wait for telemetry card log update

  // Take Screenshot 3: Output State with Telemetry console
  const screenshot3Path = path.join(__dirname, '..', 'w7_3_output.png');
  await page.screenshot({ path: screenshot3Path });
  console.log(`📸 Screenshot 3 captured: ${screenshot3Path} (Output and Network Log)`);

  await browser.close();
  console.log('✅ AI Screenshot sequence complete!');
}

capture().catch((err) => {
  console.error('❌ Error executing screenshot script:', err);
  process.exit(1);
});
