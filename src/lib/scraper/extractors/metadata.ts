import { Page } from "playwright";
import { CheerioAPI } from "cheerio";

export async function extractMetadata(page: Page, $: CheerioAPI) {
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
    const baseUrl = await page.evaluate(() => window.location.origin);
    favicon = new URL(favicon, baseUrl).toString();
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
