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

  console.log('🌐 Navigating to AgriSarthi Dashboard...');
  await page.goto('http://localhost:5173/dashboard', { waitUntil: 'networkidle2' });
  
  console.log('⏳ Waiting for crops to load from backend...');
  await wait(3000); // Give plenty of time for fetching

  // Screenshot 1: Dashboard Loaded
  const screenshot1Path = path.join(__dirname, '..', 'screenshot1_dashboard.png');
  await page.screenshot({ path: screenshot1Path });
  console.log(`📸 Screenshot 1 captured: ${screenshot1Path}`);

  // Clicks "➕ Add New Crop Cycle" button
  console.log('🖱️ Clicking "Add New Crop Cycle" button...');
  // Find button containing the text "Add New Crop Cycle" or click selector
  const buttons = await page.$$('button');
  let addButton = null;
  for (const button of buttons) {
    const text = await page.evaluate(el => el.textContent, button);
    if (text.includes('Add New Crop Cycle')) {
      addButton = button;
      break;
    }
  }

  if (addButton) {
    await addButton.click();
    await wait(1000); // Wait for modal animation
    
    console.log('✍️ Filling form fields...');
    await page.type('#name', 'Potato');
    await page.type('#variety', 'Kufri Jyoti');
    
    // Choose status 'Planted' (index 1 or value 'Planted')
    await page.select('#status', 'Planted');
    
    await page.type('#fieldArea', '3.5');
    
    // Enter dates. In Puppeteer, typing into date inputs can be done by typing text '2026-06-25'
    await page.type('#plantedDate', '25-06-2026');
    await page.type('#expectedHarvestDate', '10-10-2026');

    await wait(1000);

    // Screenshot 2: Modal Filled
    const screenshot2Path = path.join(__dirname, '..', 'screenshot2_modal.png');
    await page.screenshot({ path: screenshot2Path });
    console.log(`📸 Screenshot 2 captured: ${screenshot2Path}`);

    // Click Save / Submit button (inside Modal footer)
    console.log('💾 Submitting form...');
    const modalButtons = await page.$$('button');
    let saveButton = null;
    for (const mb of modalButtons) {
      const text = await page.evaluate(el => el.textContent, mb);
      if (text.includes('Record Crop Cycle') || text.includes('Save Changes')) {
        saveButton = mb;
        break;
      }
    }

    if (saveButton) {
      await saveButton.click();
      console.log('⏳ Waiting for Toast notification and refresh...');
      await wait(3000); // Wait for submission, toast alert, and dynamic refresh
      
      // Screenshot 3: Final Dashboard with New Crop and API Log
      const screenshot3Path = path.join(__dirname, '..', 'screenshot3_completed.png');
      await page.screenshot({ path: screenshot3Path });
      console.log(`📸 Screenshot 3 captured: ${screenshot3Path}`);
    } else {
      console.error('❌ Could not find form Save button in modal.');
    }
  } else {
    console.error('❌ Could not find "Add New Crop Cycle" button.');
  }

  await browser.close();
  console.log('✅ Screenshot captures complete!');
}

capture().catch((err) => {
  console.error('❌ Error executing capture script:', err);
  process.exit(1);
});
