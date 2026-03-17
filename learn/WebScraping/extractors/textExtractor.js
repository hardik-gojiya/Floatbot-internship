import { createRequire } from "module";
const require = createRequire(import.meta.url);
const cheerio = require("cheerio");

export function extractText(html) {
  const $ = cheerio.load(html);

  $("script, style, nav, footer, header, aside, noscript, svg").remove();

  const text = $("body").text().replace(/\s+/g, " ").trim();

  return text;
}
