import { Page } from "playwright";
import { CheerioAPI } from "cheerio";
import { ScraperOptions } from "../types";

export async function extractContent(
  page: Page,
  $: CheerioAPI,
  options: ScraperOptions,
) {
  const content: any = {};

  // Extract headings if text extraction is enabled
  if (options.extractText) {
    content.headings = [];
    $("h1, h2, h3, h4, h5, h6").each((_, el) => {
      const level = parseInt(el.tagName.substring(1));
      const text = $(el).text().trim();
      if (text) {
        content.headings.push({ level, text });
      }
    });

    // Extract paragraphs
    content.paragraphs = [];
    $("p").each((_, el) => {
      const text = $(el).text().trim();
      if (text) {
        content.paragraphs.push(text);
      }
    });

    // Extract lists
    content.lists = [];
    $("ul, ol").each((_, el) => {
      const type = el.tagName.toLowerCase() === "ul" ? "unordered" : "ordered";
      const items: string[] = [];

      $(el)
        .find("li")
        .each((_, li) => {
          const text = $(li).text().trim();
          if (text) {
            items.push(text);
          }
        });

      if (items.length > 0) {
        content.lists.push({ type, items });
      }
    });

    // Extract tables
    content.tables = [];
    $("table").each((_, table) => {
      const headers: string[] = [];
      const rows: string[][] = [];

      // Extract table headers
      $(table)
        .find("th")
        .each((_, th) => {
          headers.push($(th).text().trim());
        });

      // Extract table rows
      $(table)
        .find("tr")
        .each((_, tr) => {
          const cells: string[] = [];
          $(tr)
            .find("td")
            .each((_, td) => {
              cells.push($(td).text().trim());
            });

          if (cells.length > 0) {
            rows.push(cells);
          }
        });

      if (headers.length > 0 || rows.length > 0) {
        content.tables.push({ headers, rows });
      }
    });
  }

  // Extract links if link extraction is enabled
  if (options.extractLinks) {
    content.links = [];
    const baseUrl = await page.evaluate(() => window.location.origin);

    $("a[href]").each((_, el) => {
      const text = $(el).text().trim();
      let url = $(el).attr("href") || "";

      // Skip empty links, javascript: links, and anchor links
      if (!url || url.startsWith("javascript:") || url === "#") {
        return;
      }

      // Make URL absolute if it's relative
      if (!url.startsWith("http")) {
        url = new URL(url, baseUrl).toString();
      }

      // Determine if the link is internal
      const isInternal = url.startsWith(baseUrl);

      content.links.push({ text, url, isInternal });
    });
  }

  // Extract images if image extraction is enabled
  if (options.extractImages) {
    content.images = [];
    const baseUrl = await page.evaluate(() => window.location.origin);

    $("img[src]").each((_, el) => {
      const alt = $(el).attr("alt") || "";
      let src = $(el).attr("src") || "";

      // Skip data URLs and empty sources
      if (!src || src.startsWith("data:")) {
        return;
      }

      // Make URL absolute if it's relative
      if (!src.startsWith("http")) {
        src = new URL(src, baseUrl).toString();
      }

      const width = $(el).attr("width")
        ? parseInt($(el).attr("width") || "0")
        : undefined;
      const height = $(el).attr("height")
        ? parseInt($(el).attr("height") || "0")
        : undefined;

      content.images.push({ alt, src, width, height });
    });
  }

  return content;
}
