import { crawlWebsite } from "./crawlWebsite.js";
import { closeBrowser } from "./fetchers/dynamicFetcher.js";

(async () => {
  try {
    const res = await crawlWebsite({ startUrl: "https://www.infywebify.com", maxPages: 5, delayMs: 200 });
    console.log('Pages:', res.length);
    if (res.length) console.log(res[0].url, res[0].text?.slice(0,300));
  } catch (err) {
    console.error('crawl failed ->', err);
  } finally {
    await closeBrowser().catch(() => {});
  }
})();