import axios from "axios";
import { ScrapedData, ScrapeResult } from "./types";

// Free API services for web scraping
const SCRAPER_API_URL = "https://api.scraperapi.com";
const SCRAPE_DO_API_URL = "https://api.scrape.do";
const SCRAPE_STACK_API_URL = "https://api.scrapestack.com";

// Use ScrapingBee API which has a free tier
const SCRAPING_BEE_API_URL = "https://app.scrapingbee.com/api/v1";

// Use Bright Data API
const BRIGHT_DATA_API_URL = "https://api.brightdata.com";

// Use Proxycrawl API
const PROXY_CRAWL_API_URL = "https://api.proxycrawl.com";

// Use Zenrows API which has a free tier
const ZENROWS_API_URL = "https://api.zenrows.com/v1";

/**
 * Scrape a website using a third-party API service
 * This approach works in browser environments without JSDOM compatibility issues
 */
export async function scrapeWithAPI(
  url: string,
  apiKey?: string,
): Promise<ScrapeResult> {
  const startTime = Date.now();

  try {
    // If no API key is provided, use a proxy-based approach
    if (!apiKey) {
      return await scrapeWithCorsProxy(url, startTime);
    }

    // Use ZenRows API (they offer a free tier)
    const response = await axios.get(`${ZENROWS_API_URL}`, {
      params: {
        apikey: apiKey,
        url: url,
        js_render: "true",
        premium_proxy: "true",
      },
    });

    if (response.status !== 200) {
      throw new Error(`API returned status code ${response.status}`);
    }

    // Process the HTML content
    const html = response.data;
    const data = processScrapedContent(html, url);

    return {
      data,
      status: "success",
      duration: Date.now() - startTime,
    };
  } catch (error) {
    console.error("API scraping error:", error);
    return {
      data: null,
      error: error instanceof Error ? error.message : String(error),
      status: "error",
      duration: Date.now() - startTime,
    };
  }
}

/**
 * Fallback method using CORS proxies when no API key is available
 */
async function scrapeWithCorsProxy(
  url: string,
  startTime: number,
): Promise<ScrapeResult> {
  try {
    // Try multiple CORS proxies in case some are down or rate-limited
    const corsProxies = [
      `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
      `https://cors-anywhere.herokuapp.com/${url}`,
      `https://cors-proxy.htmldriven.com/?url=${encodeURIComponent(url)}`,
      `https://crossorigin.me/${url}`,
      `https://thingproxy.freeboard.io/fetch/${url}`,
    ];

    // Try each proxy until one works
    let html = null;
    let error = null;

    for (const proxyUrl of corsProxies) {
      try {
        const response = await fetch(proxyUrl, {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
          },
        });

        if (response.ok) {
          html = await response.text();
          break;
        }
      } catch (err) {
        error = err;
        // Continue to the next proxy
        continue;
      }
    }

    if (!html) {
      throw error || new Error("All CORS proxies failed");
    }

    // Process the HTML content
    const data = processScrapedContent(html, url);

    return {
      data,
      status: "success",
      duration: Date.now() - startTime,
    };
  } catch (error) {
    console.error("CORS proxy scraping error:", error);
    return {
      data: null,
      error: error instanceof Error ? error.message : String(error),
      status: "error",
      duration: Date.now() - startTime,
    };
  }
}

/**
 * Process HTML content and extract structured data
 */
function processScrapedContent(html: string, url: string): ScrapedData {
  // Use DOMParser which is available in browser environments
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  // Extract basic information
  const title = doc.title || "";

  // Extract metadata
  const metadata = extractMetadata(doc, url);

  // Extract content
  const content = extractContent(doc, url);

  // Create the scraped data object
  return {
    url,
    title,
    timestamp: new Date().toISOString(),
    metadata,
    content,
  };
}

/**
 * Extract metadata from the document
 */
function extractMetadata(
  doc: Document,
  baseUrl: string,
): ScrapedData["metadata"] {
  // Extract basic metadata
  const description =
    doc.querySelector('meta[name="description"]')?.getAttribute("content") ||
    doc
      .querySelector('meta[property="og:description"]')
      ?.getAttribute("content") ||
    "";

  const keywords =
    doc.querySelector('meta[name="keywords"]')?.getAttribute("content") || "";
  const keywordsArray = keywords
    .split(",")
    .map((k) => k.trim())
    .filter(Boolean);

  const author =
    doc.querySelector('meta[name="author"]')?.getAttribute("content") ||
    doc
      .querySelector('meta[property="article:author"]')
      ?.getAttribute("content") ||
    "";

  // Extract Open Graph metadata
  const openGraph: Record<string, string> = {};
  doc.querySelectorAll('meta[property^="og:"]').forEach((el) => {
    const property = el.getAttribute("property");
    const content = el.getAttribute("content");
    if (property && content) {
      openGraph[property.replace("og:", "")] = content;
    }
  });

  // Extract Twitter Card metadata
  const twitterCard: Record<string, string> = {};
  doc.querySelectorAll('meta[name^="twitter:"]').forEach((el) => {
    const name = el.getAttribute("name");
    const content = el.getAttribute("content");
    if (name && content) {
      twitterCard[name.replace("twitter:", "")] = content;
    }
  });

  // Extract favicon
  let favicon =
    doc.querySelector('link[rel="icon"]')?.getAttribute("href") ||
    doc.querySelector('link[rel="shortcut icon"]')?.getAttribute("href") ||
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
 * Extract content from the document
 */
function extractContent(
  doc: Document,
  baseUrl: string,
): ScrapedData["content"] {
  const content: ScrapedData["content"] = {};

  // Extract headings
  content.headings = [];
  doc.querySelectorAll("h1, h2, h3, h4, h5, h6").forEach((el) => {
    const level = parseInt(el.tagName.substring(1));
    const text = el.textContent?.trim() || "";
    if (text) {
      content.headings.push({ level, text });
    }
  });

  // Extract paragraphs
  content.paragraphs = [];
  doc.querySelectorAll("p").forEach((el) => {
    const text = el.textContent?.trim() || "";
    if (text) {
      content.paragraphs.push(text);
    }
  });

  // Extract links
  content.links = [];
  doc.querySelectorAll("a[href]").forEach((el) => {
    const text = el.textContent?.trim() || "";
    let url = el.getAttribute("href") || "";

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

  // Extract images
  content.images = [];
  doc.querySelectorAll("img[src]").forEach((el) => {
    const alt = el.getAttribute("alt") || "";
    let src = el.getAttribute("src") || "";

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

    const width = el.getAttribute("width")
      ? parseInt(el.getAttribute("width") || "0")
      : undefined;
    const height = el.getAttribute("height")
      ? parseInt(el.getAttribute("height") || "0")
      : undefined;

    content.images.push({ alt, src, width, height });
  });

  // Extract lists
  content.lists = [];
  doc.querySelectorAll("ul, ol").forEach((el) => {
    const type = el.tagName.toLowerCase() === "ul" ? "unordered" : "ordered";
    const items: string[] = [];

    el.querySelectorAll("li").forEach((li) => {
      const text = li.textContent?.trim() || "";
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
  doc.querySelectorAll("table").forEach((table) => {
    const headers: string[] = [];
    const rows: string[][] = [];

    // Extract table headers
    table.querySelectorAll("th").forEach((th) => {
      headers.push(th.textContent?.trim() || "");
    });

    // Extract table rows
    table.querySelectorAll("tr").forEach((tr) => {
      const cells: string[] = [];
      tr.querySelectorAll("td").forEach((td) => {
        cells.push(td.textContent?.trim() || "");
      });

      if (cells.length > 0) {
        rows.push(cells);
      }
    });

    if (headers.length > 0 || rows.length > 0) {
      content.tables.push({ headers, rows });
    }
  });

  // Extract main text
  content.mainText = doc.body.textContent?.trim() || "";

  return content;
}
