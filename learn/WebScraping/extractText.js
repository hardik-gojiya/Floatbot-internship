import { createRequire } from "module";
const require = createRequire(import.meta.url);
const cheerio = require("cheerio");

export function extractTextFromHTML(htmlString) {
  const $ = cheerio.load(htmlString);

  $("script, style, nav, footer, header, noscript").remove();

  const text = $("body").text();

  const cleanedText = text
    .replace(/\s+/g, " ")
    .replace(/[\r\n]+/g, "\n")
    .trim();

  return cleanedText;
}
