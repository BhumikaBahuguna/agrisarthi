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
  // Step 1: Access protected /dashboard (Expect redirect to /login)
  // ----------------------------------------------------
  console.log('🌐 Step 1: Navigating directly to protected /dashboard...');
  await page.goto('http://localhost:5173/dashboard', { waitUntil: 'networkidle2' });
  
  // Wait for Redirect to Login form to load
  await page.waitForSelector('#email');
  await wait(1000);
  
  const screenshot1Path = path.join(__dirname, '..', 'w6_1_redirect.png');
  await page.screenshot({ path: screenshot1Path });
  console.log(`📸 Screenshot 1 captured: ${screenshot1Path} (Redirect to Login)`);

  // ----------------------------------------------------
  // Step 2: Register a new account
  // ----------------------------------------------------
  console.log('🌐 Step 2: Toggling registration form...');
  // Click the toggle link to show the registration form
  const toggleBtn = await page.evaluateHandle(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    return buttons.find(b => b.textContent.includes('Create Account'));
  });
  if (toggleBtn) {
    await toggleBtn.click();
    // Wait for the toggle transition and input fields
    await page.waitForSelector('#name');
    await wait(500);
  }

  const uniqueEmail = `bhumika.test${Date.now()}@example.com`;
  console.log(`✍️ Filling registration form with email: ${uniqueEmail}`);
  await page.type('#name', 'Bhumika Bahuguna');
  await page.type('#email', uniqueEmail);
  await page.type('#password', 'password123');
  await wait(500);

  const screenshot2Path = path.join(__dirname, '..', 'w6_2_register.png');
  await page.screenshot({ path: screenshot2Path });
  console.log(`📸 Screenshot 2 captured: ${screenshot2Path} (Registration Form)`);

  // Click Register Button
  const registerSubmitBtn = await page.evaluateHandle(() => {
    return Array.from(document.querySelectorAll('button')).find(b => b.type === 'submit');
  });
  if (registerSubmitBtn) {
    await registerSubmitBtn.click();
    console.log('⏳ Waiting for registration success...');
    // Wait for the submission to complete and UI to switch back to Login mode
    await wait(3000); 
  }

  // ----------------------------------------------------
  // Step 3: Login (Success and Redirect to Dashboard)
  // ----------------------------------------------------
  console.log('🌐 Step 3: Performing Login...');
  // Wait for the input field to be ready (ensures loader is gone)
  await page.waitForSelector('#email');
  
  // Since switching back to login might preserve the email, let's clear the email first just in case
  await page.click('#email', { clickCount: 3 });
  await page.keyboard.press('Backspace');
  await page.type('#email', uniqueEmail);
  
  await page.type('#password', 'password123');
  await wait(500);

  const screenshot3Path = path.join(__dirname, '..', 'w6_3_login.png');
  await page.screenshot({ path: screenshot3Path });
  console.log(`📸 Screenshot 3 captured: ${screenshot3Path} (Login Form)`);

  // Submit Login
  const loginSubmitBtn = await page.evaluateHandle(() => {
    return Array.from(document.querySelectorAll('button')).find(b => b.type === 'submit');
  });
  if (loginSubmitBtn) {
    await loginSubmitBtn.click();
    console.log('⏳ Waiting for dashboard load...');
    // Wait for redirect to /dashboard and the cards to be rendered
    await page.waitForSelector('#search-crops');
    await wait(2000);
  }

  const screenshot4Path = path.join(__dirname, '..', 'w6_4_dashboard_loaded.png');
  await page.screenshot({ path: screenshot4Path });
  console.log(`📸 Screenshot 4 captured: ${screenshot4Path} (Dashboard Loaded)`);

  // ----------------------------------------------------
  // Step 4: OAuth Login Consent (Google Mock consent screen)
  // ----------------------------------------------------
  console.log('🌐 Step 4: Log out and open Google OAuth consent screen...');
  // Click logout first
  const logoutBtn = await page.evaluateHandle(() => {
    return Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Logout'));
  });
  if (logoutBtn) {
    await logoutBtn.click();
    await page.waitForSelector('#email');
    await wait(1000);
  }

  // Click Google sign in button
  const googleBtn = await page.$('#google-login-btn');
  if (googleBtn) {
    await googleBtn.click();
    console.log('⏳ Waiting for Google OAuth Mock Consent Screen...');
    // Wait for the mock consent button to load
    await page.waitForSelector('button');
    await wait(1500);
  }

  const screenshot5Path = path.join(__dirname, '..', 'w6_5_oauth_consent.png');
  await page.screenshot({ path: screenshot5Path });
  console.log(`📸 Screenshot 5 captured: ${screenshot5Path} (OAuth Consent Screen)`);

  // Agree and Redirect
  const agreeBtn = await page.evaluateHandle(() => {
    return Array.from(document.querySelectorAll('button')).find(b => b.type === 'submit');
  });
  if (agreeBtn) {
    await agreeBtn.click();
    console.log('⏳ Waiting for OAuth callback and redirection to Dashboard...');
    await page.waitForSelector('#search-crops');
    await wait(2000);
  }

  const screenshot6Path = path.join(__dirname, '..', 'w6_6_oauth_success.png');
  await page.screenshot({ path: screenshot6Path });
  console.log(`📸 Screenshot 6 captured: ${screenshot6Path} (Logged In via Google OAuth)`);

  // ----------------------------------------------------
  // Step 5: Rate Limiting Error (429 Response)
  // ----------------------------------------------------
  console.log('🌐 Step 5: Triggering Rate Limiting Error...');
  // Log out
  const logoutBtn2 = await page.evaluateHandle(() => {
    return Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Logout'));
  });
  if (logoutBtn2) {
    await logoutBtn2.click();
    await page.waitForSelector('#email');
    await wait(1000);
  }

  // Type wrong password and login repeatedly (5 limits, 6th triggers)
  for (let i = 1; i <= 6; i++) {
    console.log(`🔑 Rate Limit Trigger Attempt ${i}/6...`);
    
    // Clear and type password
    await page.click('#password', { clickCount: 3 });
    await page.keyboard.press('Backspace');
    await page.type('#password', `wrongpass${i}`);

    const submitBtn = await page.evaluateHandle(() => {
      return Array.from(document.querySelectorAll('button')).find(b => b.type === 'submit');
    });
    if (submitBtn) {
      await submitBtn.click();
      await wait(800); // Wait for API response
    }
  }

  const screenshot7Path = path.join(__dirname, '..', 'w6_7_rate_limit.png');
  await page.screenshot({ path: screenshot7Path });
  console.log(`📸 Screenshot 7 captured: ${screenshot7Path} (Rate Limiting Triggered)`);

  await browser.close();
  console.log('✅ Screenshot capture sequence complete!');
}

capture().catch((err) => {
  console.error('❌ Error executing screenshot script:', err);
  process.exit(1);
});
