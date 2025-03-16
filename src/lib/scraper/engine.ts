import { ScraperOptions, ScrapedData, ScrapeResult } from "./types";
import * as cheerio from "cheerio";
// Import Readability but avoid direct JSDOM import which causes browser compatibility issues
import { Readability } from "@mozilla/readability";

export class ScraperEngine {
  private options: ScraperOptions;

  constructor(options: Partial<ScraperOptions> = {}) {
    this.options = {
      waitTime: 3,
      depth: 2,
      extractImages: true,
      extractLinks: true,
      extractText: true,
      dataFormat: "json",
      concurrency: 1,
      userAgent:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      timeout: 30000,
      ...options,
    };
  }

  /**
   * Initialize the browser instance
   */
  async initialize(): Promise<void> {
    console.log("Initializing scraper engine");
  }

  /**
   * Close the browser instance
   */
  async close(): Promise<void> {
    console.log("Closing scraper engine");
  }

  /**
   * Scrape a URL and return structured data
   */
  async scrape(url: string): Promise<ScrapeResult> {
    console.log(`Scraping URL: ${url} with options:`, this.options);
    const startTime = Date.now();

    try {
      // Import the API scraper dynamically to avoid issues with SSR
      const { scrapeWithAPI } = await import("./api");

      // Use the API-based scraper which works in browser environments
      return await scrapeWithAPI(url);
    } catch (error) {
      console.error("Scraping error:", error);
      return {
        data: null,
        error: error instanceof Error ? error.message : String(error),
        status: "error",
        duration: Date.now() - startTime,
      };
    }
  }

  /**
   * Extract metadata from the page
   */
  private extractMetadata(
    $: cheerio.CheerioAPI,
    baseUrl: string,
  ): ScrapedData["metadata"] {
    // Extract basic metadata
    const description =
      $('meta[name="description"]').attr("content") ||
      $('meta[property="og:description"]').attr("content") ||
      "";

    const keywords = $('meta[name="keywords"]').attr("content") || "";
    const keywordsArray = keywords
      .split(",")
      .map((k) => k.trim())
      .filter(Boolean);

    const author =
      $('meta[name="author"]').attr("content") ||
      $('meta[property="article:author"]').attr("content") ||
      "";

    // Extract Open Graph metadata
    const openGraph: Record<string, string> = {};
    $('meta[property^="og:"]').each((_, el) => {
      const property = $(el).attr("property");
      const content = $(el).attr("content");
      if (property && content) {
        openGraph[property.replace("og:", "")] = content;
      }
    });

    // Extract Twitter Card metadata
    const twitterCard: Record<string, string> = {};
    $('meta[name^="twitter:"]').each((_, el) => {
      const name = $(el).attr("name");
      const content = $(el).attr("content");
      if (name && content) {
        twitterCard[name.replace("twitter:", "")] = content;
      }
    });

    // Extract favicon
    let favicon =
      $('link[rel="icon"]').attr("href") ||
      $('link[rel="shortcut icon"]').attr("href") ||
      "";

    // Make favicon URL absolute if it's relative
    if (favicon && !favicon.startsWith("http")) {
      try {
        favicon = new URL(favicon, baseUrl).toString();
      } catch (e) {
        console.error("Error making favicon URL absolute:", e);
      }
    }

    return {
      description,
      keywords: keywordsArray,
      author,
      openGraph,
      twitterCard,
      favicon,
    };
  }

  /**
   * Extract content from the page
   */
  private extractContent(
    $: cheerio.CheerioAPI,
    baseUrl: string,
  ): ScrapedData["content"] {
    const content: ScrapedData["content"] = {};

    // Extract headings
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

    // Extract links if link extraction is enabled
    if (this.options.extractLinks) {
      content.links = [];

      $("a[href]").each((_, el) => {
        const text = $(el).text().trim();
        let url = $(el).attr("href") || "";

        // Skip empty links, javascript: links, and anchor links
        if (!url || url.startsWith("javascript:") || url === "#") {
          return;
        }

        // Make URL absolute if it's relative
        if (!url.startsWith("http")) {
          try {
            url = new URL(url, baseUrl).toString();
          } catch (e) {
            console.error("Error making URL absolute:", e);
            return;
          }
        }

        // Determine if the link is internal
        const isInternal = url.startsWith(baseUrl);

        content.links.push({ text, url, isInternal });
      });
    }

    // Extract images if image extraction is enabled
    if (this.options.extractImages) {
      content.images = [];

      $("img[src]").each((_, el) => {
        const alt = $(el).attr("alt") || "";
        let src = $(el).attr("src") || "";

        // Skip data URLs and empty sources
        if (!src || src.startsWith("data:")) {
          return;
        }

        // Make URL absolute if it's relative
        if (!src.startsWith("http")) {
          try {
            src = new URL(src, baseUrl).toString();
          } catch (e) {
            console.error("Error making image URL absolute:", e);
            return;
          }
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

    // Extract tables with improved structure
    content.tables = [];
    $("table").each((_, table) => {
      const headers: string[] = [];
      const rows: string[][] = [];
      const caption = $(table).find("caption").text().trim() || undefined;
      const tableId = $(table).attr("id") || undefined;
      const tableClass = $(table).attr("class") || undefined;

      // Extract table headers
      $(table)
        .find("thead th, tr th")
        .each((_, th) => {
          const headerText = $(th).text().trim();
          headers.push(headerText);
        });

      // Extract table rows
      $(table)
        .find("tbody tr, tr")
        .each((_, tr) => {
          // Skip header rows that are already processed
          if ($(tr).find("th").length > 0 && $(tr).find("td").length === 0) {
            return;
          }

          const cells: string[] = [];
          $(tr)
            .find("td")
            .each((colIndex, td) => {
              // Get the text content with better whitespace handling
              let cellText = $(td).text().replace(/\s+/g, " ").trim();

              // If we have headers and the cell is empty, use the header as context
              if (cellText === "" && headers[colIndex]) {
                cellText = "[Empty]";
              }

              cells.push(cellText);
            });

          if (cells.length > 0) {
            rows.push(cells);
          }
        });

      // Only add tables that have actual content
      if ((headers.length > 0 && rows.length > 0) || rows.length > 1) {
        content.tables.push({
          headers,
          rows,
          caption,
          id: tableId,
          class: tableClass,
        });
      }
    });

    return content;
  }

  /**
   * Convert the scraped data to the specified format
   */
  convertData(
    data: ScrapedData,
    format: "json" | "csv" | "xml" | "excel" = "json",
  ): string {
    switch (format) {
      case "json":
        return JSON.stringify(data, null, 2);
      case "csv":
        return this.convertToCSV(data);
      case "xml":
        return this.convertToXML(data);
      case "excel":
        return this.convertToCSV(data); // Excel uses CSV format with specific MIME type
      default:
        return JSON.stringify(data, null, 2);
    }
  }

  /**
   * Convert data to CSV format
   */
  private convertToCSV(data: ScrapedData): string {
    if (!data) {
      return "No data available";
    }

    // More comprehensive CSV conversion that includes all data
    const rows = [];

    // Main information
    rows.push(["URL", data.url || ""]);
    rows.push(["Title", data.title || ""]);
    rows.push(["Timestamp", data.timestamp || new Date().toISOString()]);
    rows.push(["Description", data.metadata?.description || ""]);
    rows.push(["Author", data.metadata?.author || ""]);
    rows.push([]);

    // Headings
    if (data.content?.headings && data.content.headings.length > 0) {
      rows.push(["HEADINGS"]);
      rows.push(["Level", "Text"]);
      data.content.headings.forEach((heading) => {
        rows.push([String(heading.level), heading.text]);
      });
      rows.push([]);
    }

    // Paragraphs
    if (data.content?.paragraphs && data.content.paragraphs.length > 0) {
      rows.push(["PARAGRAPHS"]);
      data.content.paragraphs.forEach((paragraph, index) => {
        rows.push([`Paragraph ${index + 1}`, paragraph]);
      });
      rows.push([]);
    }

    // Links
    if (data.content?.links && data.content.links.length > 0) {
      rows.push(["LINKS"]);
      rows.push(["Text", "URL", "Internal"]);
      data.content.links.forEach((link) => {
        rows.push([link.text, link.url, String(link.isInternal)]);
      });
      rows.push([]);
    }

    // Images
    if (data.content?.images && data.content.images.length > 0) {
      rows.push(["IMAGES"]);
      rows.push(["Alt Text", "Source", "Width", "Height"]);
      data.content.images.forEach((image) => {
        rows.push([
          image.alt,
          image.src,
          String(image.width || ""),
          String(image.height || ""),
        ]);
      });
      rows.push([]);
    }

    // Lists
    if (data.content?.lists && data.content.lists.length > 0) {
      rows.push(["LISTS"]);
      data.content.lists.forEach((list, listIndex) => {
        rows.push([`List ${listIndex + 1} (${list.type})`]);
        list.items.forEach((item, itemIndex) => {
          rows.push([`Item ${itemIndex + 1}`, item]);
        });
        rows.push([]);
      });
    }

    // Tables
    if (data.content?.tables && data.content.tables.length > 0) {
      rows.push(["TABLES"]);
      data.content.tables.forEach((table, tableIndex) => {
        rows.push([
          `Table ${tableIndex + 1}${table.caption ? ": " + table.caption : ""}`,
        ]);

        // Add table headers
        if (table.headers.length > 0) {
          rows.push(table.headers);
        }

        // Add table rows
        table.rows.forEach((row) => {
          rows.push(row);
        });

        rows.push([]);
      });
    }

    // Convert rows to CSV
    return rows
      .map((row) =>
        row
          .map((cell) => `"${String(cell || "").replace(/"/g, '""')}"`)
          .join(","),
      )
      .join("\n");
  }

  /**
   * Convert data to XML format
   */
  private convertToXML(data: ScrapedData): string {
    // Simple XML conversion - in a real app, this would use a proper XML library
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<scrapeResult>\n';

    xml += `  <url>${this.escapeXml(data.url)}</url>\n`;
    xml += `  <title>${this.escapeXml(data.title)}</title>\n`;
    xml += `  <timestamp>${data.timestamp}</timestamp>\n`;

    xml += "  <metadata>\n";
    if (data.metadata.description) {
      xml += `    <description>${this.escapeXml(data.metadata.description)}</description>\n`;
    }
    if (data.metadata.author) {
      xml += `    <author>${this.escapeXml(data.metadata.author)}</author>\n`;
    }
    xml += "  </metadata>\n";

    xml += "  <content>\n";
    if (data.content.headings && data.content.headings.length > 0) {
      xml += "    <headings>\n";
      data.content.headings.forEach((heading) => {
        xml += `      <heading level="${heading.level}">${this.escapeXml(heading.text)}</heading>\n`;
      });
      xml += "    </headings>\n";
    }

    if (data.content.paragraphs && data.content.paragraphs.length > 0) {
      xml += "    <paragraphs>\n";
      data.content.paragraphs.forEach((paragraph) => {
        xml += `      <paragraph>${this.escapeXml(paragraph)}</paragraph>\n`;
      });
      xml += "    </paragraphs>\n";
    }
    xml += "  </content>\n";

    xml += "</scrapeResult>";
    return xml;
  }

  /**
   * Escape XML special characters
   */
  private escapeXml(unsafe: string): string {
    return unsafe.replace(/[<>&'"]/g, (c) => {
      switch (c) {
        case "<":
          return "&lt;";
        case ">":
          return "&gt;";
        case "&":
          return "&amp;";
        case "'":
          return "&apos;";
        case '"':
          return "&quot;";
        default:
          return c;
      }
    });
  }

  /**
   * Update the scraper options
   */
  updateOptions(options: Partial<ScraperOptions>): void {
    this.options = { ...this.options, ...options };
  }

  /**
   * Get the current scraper options
   */
  getOptions(): ScraperOptions {
    return { ...this.options };
  }
}
