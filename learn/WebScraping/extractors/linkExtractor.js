
import { isInternalLink, normalizeUrl } from "../utils/urlUtils.js";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const cheerio = require("cheerio");

export function extractLinks(html, baseUrl) {
  const $ = cheerio.load(html);
  const links = new Set();

  $("a[href]").each((_, el) => {
    const href = $(el).attr("href");
    if (!href) return;

    try {
      const fullUrl = new URL(href, baseUrl).href;
      if (isInternalLink(fullUrl, baseUrl)) {
        links.add(normalizeUrl(fullUrl));
      }
    } catch {}
  });

  return [...links];
}
