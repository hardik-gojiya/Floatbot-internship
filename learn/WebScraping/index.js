import express from "express";
import { crawlWebsite } from "./crawlWebsite.js";
import { closeBrowser } from "./fetchers/dynamicFetcher.js";
import { PlaywrightCrawler, Dataset, RequestQueue } from "crawlee";
import { v4 as uuidv4 } from "uuid";

const app = express();
const PORT = 7000;

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.get("/scrape", async (req, res) => {
  try {
    const { url } = req.query;

    if (!url) {
      return res.status(400).json({ error: "URL parameter is required" });
    }

    const data = await crawlWebsite({ startUrl: url });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    try {
      await closeBrowser();
    } catch (e) {
      console.error("Error closing browser:", e);
    }
  }
});

app.get("/crawly-scrape", async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: "URL is required" });

  const requestId = uuidv4();
  let requestQueue;
  let dataset;

  try {
    requestQueue = await RequestQueue.open(requestId);
    dataset = await Dataset.open(requestId);

    const crawler = new PlaywrightCrawler({
      requestQueue,
      maxConcurrency: 5,
      maxRequestsPerCrawl: 100,
      requestHandlerTimeoutSecs: 30,

      async requestHandler({ request, page, enqueueLinks, log }) {
        log.info(`Scraping: ${request.url}`);
        await page.waitForLoadState("networkidle");

        const title = await page.title();

        // 1. Extract clean plain text inside the browser context
        const plainText = await page.evaluate(() => {
          // Remove elements that don't contain useful "plain data"
          const selector = 'script, style, noscript, nav, footer, header, aside';
          const elements = document.querySelectorAll(selector);
          elements.forEach((el) => el.remove());

          // Get the text and clean up whitespace
          return document.body.innerText
            .replace(/\s\s+/g, ' ') // Replace multiple spaces/newlines with one space
            .trim();
        });

        await dataset.pushData({
          title,
          url: request.loadedUrl,
          text: plainText, // No more HTML tags
        });

        await enqueueLinks({ strategy: "same-domain" });
      },
    });

    await crawler.run([url]);

    const { items } = await dataset.getData();

    await dataset.drop();
    await requestQueue.drop();

    res.json({
      success: true,
      count: items.length,
      data: items,
    });
  } catch (error) {
    if (dataset) await dataset.drop();
    if (requestQueue) await requestQueue.drop();
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
