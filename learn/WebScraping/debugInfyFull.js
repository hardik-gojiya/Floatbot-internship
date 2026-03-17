import { fetchStatic } from "./fetchers/staticFetcher.js";
import { fetchDynamic, closeBrowser } from "./fetchers/dynamicFetcher.js";
import { extractText } from "./extractors/textExtractor.js";

(async () => {
  const url = "https://www.infywebify.com";
  try {
    console.log('URL:', url);

    const staticHtml = await fetchStatic(url);
    const staticText = extractText(staticHtml);
    console.log('\n--- STATIC HTML length:', staticHtml.length, '---');
    console.log('\n--- STATIC EXTRACTED TEXT START ---\n');
    console.log(staticText);
    console.log('\n--- STATIC EXTRACTED TEXT END ---\n');

    try {
      const dynHtml = await fetchDynamic(url);
      const dynText = extractText(dynHtml);
      console.log('\n--- DYNAMIC HTML length:', dynHtml.length, '---');
      console.log('\n--- DYNAMIC EXTRACTED TEXT START ---\n');
      console.log(dynText);
      console.log('\n--- DYNAMIC EXTRACTED TEXT END ---\n');
    } catch (err) {
      console.error('fetchDynamic failed ->', err?.message || err);
    }
  } catch (err) {
    console.error('fetchStatic failed ->', err?.message || err);
  } finally {
    await closeBrowser().catch(() => {});
  }
})();