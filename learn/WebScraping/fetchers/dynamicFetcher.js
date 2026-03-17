import { chromium } from "playwright";

let browser;

async function ensureBrowser() {
  try {
    if (!browser) {
      browser = await chromium.launch({ headless: true });
    }
  } catch (err) {
    browser = undefined;
    throw err;
  }
}

export async function fetchDynamic(url, { retry = 1 } = {}) {
  await ensureBrowser();

  let page;

  try {
    page = await browser.newPage();
  } catch (err) {
    if (retry > 0) {
      try {
        await closeBrowser().catch(() => {});
        browser = await chromium.launch({ headless: true });
        page = await browser.newPage();
      } catch (err2) {
        throw err2;
      }
    } else {
      throw err;
    }
  }

  try {
    await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });
    const html = await page.content();
    return html;
  } finally {
    try {
      if (page && !page.isClosed()) await page.close();
    } catch (e) {
    }
  }
}

export async function closeBrowser() {
  if (browser) {
    try {
      await browser.close();
    } catch (e) {
      // ignore
    } finally {
      browser = undefined;
    }
  }
}
