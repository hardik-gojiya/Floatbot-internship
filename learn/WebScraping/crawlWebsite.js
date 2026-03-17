import { extractLinks } from "./extractors/linkExtractor.js";
import { extractText } from "./extractors/textExtractor.js";
import { fetchPage } from "./fetchers/smartFetcher.js";
import { normalizeUrl } from "./utils/urlUtils.js";

export async function crawlWebsite({ startUrl, maxPages = 25, delayMs = 800 }) {
  const visited = new Set();
  const queue = [normalizeUrl(startUrl)];
  const results = [];

  while (queue.length && results.length < maxPages) {
    const url = queue.shift();
    if (visited.has(url)) continue;

    visited.add(url);

    try {
      const html = await fetchPage(url);
      const text = extractText(html);

      if (text.length > 200) {
        results.push({ url, text });
      }

      const links = extractLinks(html, startUrl);
      console.log(`Crawled: ${url} (found ${links.length} links)`);
      for (const link of links) {
        if (!visited.has(link)) queue.push(link);
      }

      await new Promise((r) => setTimeout(r, delayMs));
    } catch (err) {
      console.error("Failed:", url, "->", err?.message || err);
    }
  }
  return results;
}
