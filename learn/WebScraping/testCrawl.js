import { crawlWebsite } from "./crawlWebsite.js";
import { closeBrowser } from "./fetchers/dynamicFetcher.js";

(async () => {
  try {
    const res = await crawlWebsite({ startUrl: "https://hardik-gojiya-portfolio.netlify.app", maxPages: 5, delayMs: 200 });
    console.log('Pages:', res.length);
    console.log(res[0]);
  } catch (err) {
    console.error('crawl failed ->', err);
  } finally {
    await closeBrowser().catch(() => {});
  }
})();