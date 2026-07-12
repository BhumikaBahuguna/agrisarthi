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
    console.error('❌ Could not locate Microsoft Edge or Google Chrome.');
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

  console.log('🌐 Navigating to Dashboard...');
  await page.goto('http://localhost:5173/dashboard', { waitUntil: 'networkidle2' });
  await wait(3000);

  // ----------------------------------------------------
  // 1. READ (crud2_read.png)
  // ----------------------------------------------------
  const readPath = path.join(__dirname, '..', 'crud2_read.png');
  await page.screenshot({ path: readPath });
  console.log(`📸 READ Captured: ${readPath}`);

  // ----------------------------------------------------
  // 2. CREATE (crud1_create.png)
  // ----------------------------------------------------
  console.log('🖱️ Clicking Add New Crop...');
  let buttons = await page.$$('button');
  for (const btn of buttons) {
    const text = await page.evaluate(el => el.textContent, btn);
    if (text.includes('Add New Crop Cycle')) {
      await btn.click();
      break;
    }
  }
  await wait(1000);
  
  await page.type('#name', 'Test Crop Integration');
  await page.type('#variety', 'Beta-1');
  await page.select('#status', 'Planted');
  await page.type('#fieldArea', '12');
  await page.type('#plantedDate', '01-01-2026');
  await page.type('#expectedHarvestDate', '12-12-2026');
  await wait(500);

  const createPath = path.join(__dirname, '..', 'crud1_create.png');
  await page.screenshot({ path: createPath });
  console.log(`📸 CREATE Captured: ${createPath}`);

  // Submit
  buttons = await page.$$('button');
  for (const btn of buttons) {
    const text = await page.evaluate(el => el.textContent, btn);
    if (text.includes('Record Crop Cycle') || text.includes('Save Changes')) {
      await btn.click();
      break;
    }
  }
  await wait(3000);

  // ----------------------------------------------------
  // 3. UPDATE (crud3_update.png)
  // ----------------------------------------------------
  console.log('🖱️ Clicking Edit...');
  buttons = await page.$$('button');
  let editClicked = false;
  for (const btn of buttons) {
    const text = await page.evaluate(el => el.textContent, btn);
    if (text.includes('Edit')) {
      await btn.click();
      editClicked = true;
      break;
    }
  }
  
  if (editClicked) {
    await wait(1000);
    // Clear area and update
    await page.click('#fieldArea', { clickCount: 3 });
    await page.keyboard.press('Backspace');
    await page.type('#fieldArea', '25.5');
    await wait(500);

    const updatePath = path.join(__dirname, '..', 'crud3_update.png');
    await page.screenshot({ path: updatePath });
    console.log(`📸 UPDATE Captured: ${updatePath}`);

    // Submit Edit
    buttons = await page.$$('button');
    for (const btn of buttons) {
      const text = await page.evaluate(el => el.textContent, btn);
      if (text.includes('Save Changes')) {
        await btn.click();
        break;
      }
    }
    await wait(3000);
  }

  // ----------------------------------------------------
  // 4. DELETE (crud4_delete.png)
  // ----------------------------------------------------
  console.log('🖱️ Clicking Delete...');
  buttons = await page.$$('button');
  let deleteClicked = false;
  for (const btn of buttons) {
    const text = await page.evaluate(el => el.textContent, btn);
    if (text.includes('Delete')) {
      await btn.click();
      deleteClicked = true;
      break;
    }
  }

  if (deleteClicked) {
    await wait(1000);
    const deletePath = path.join(__dirname, '..', 'crud4_delete.png');
    await page.screenshot({ path: deletePath });
    console.log(`📸 DELETE Captured: ${deletePath}`);

    // Confirm Delete to clean up
    buttons = await page.$$('button');
    for (const btn of buttons) {
      const text = await page.evaluate(el => el.textContent, btn);
      if (text.includes('Yes, Delete')) {
        await btn.click();
        break;
      }
    }
    await wait(2000);
  }

  await browser.close();
  console.log('✅ All screenshots captured!');
}

capture().catch((err) => {
  console.error('❌ Error executing capture script:', err);
  process.exit(1);
});
