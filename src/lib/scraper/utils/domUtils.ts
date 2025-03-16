import { CheerioAPI } from "cheerio";

/**
 * Utility functions for DOM manipulation and analysis
 */

/**
 * Identify the main content area of a page using heuristics
 */
export function identifyMainContent($: CheerioAPI): CheerioAPI {
  // Common content container selectors
  const contentSelectors = [
    "article",
    "main",
    ".content",
    "#content",
    ".post",
    ".article",
    ".post-content",
    ".entry-content",
    ".main-content",
  ];

  // Try to find the main content container
  for (const selector of contentSelectors) {
    const element = $(selector);
    if (element.length > 0) {
      // Return the first matching element that has substantial content
      const filtered = element.filter((_, el) => {
        const text = $(el).text().trim();
        return text.length > 100; // Arbitrary threshold for "substantial" content
      });

      if (filtered.length > 0) {
        return filtered.first();
      }
    }
  }

  // If no content container is found, use the body
  return $("body");
}

/**
 * Remove common noise elements from the DOM
 */
export function removeNoiseElements($: CheerioAPI): void {
  // Common selectors for elements that are usually not part of the main content
  const noiseSelectors = [
    "header",
    "footer",
    "nav",
    ".navigation",
    ".menu",
    ".sidebar",
    ".comments",
    ".advertisement",
    ".ads",
    ".ad-container",
    ".social-media",
    ".share-buttons",
    ".related-posts",
    ".recommended",
    ".newsletter",
    ".subscription",
    ".popup",
    ".modal",
    "script",
    "style",
    "noscript",
    "iframe",
  ];

  // Remove noise elements
  $(noiseSelectors.join(", ")).remove();
}

/**
 * Calculate the content density of an element
 * (ratio of text length to HTML length)
 */
export function calculateContentDensity($: CheerioAPI, element: any): number {
  const html = $.html(element);
  const text = $(element).text().trim();

  if (html.length === 0) return 0;
  return text.length / html.length;
}

/**
 * Detect if an element is likely to be a navigation menu
 */
export function isNavigationMenu($: CheerioAPI, element: any): boolean {
  // Navigation menus typically have many links in a small area
  const links = $(element).find("a");
  if (links.length < 3) return false;

  // Navigation menus often have list items
  const listItems = $(element).find("li");
  if (listItems.length > 0 && listItems.length >= links.length * 0.7) {
    return true;
  }

  // Check for common navigation classes/ids
  const elementHtml = $.html(element).toLowerCase();
  const navIndicators = ["nav", "menu", "navigation", "navbar", "header-links"];

  return navIndicators.some((indicator) => elementHtml.includes(indicator));
}

/**
 * Detect if an element is likely to be a sidebar
 */
export function isSidebar($: CheerioAPI, element: any): boolean {
  const elementHtml = $.html(element).toLowerCase();
  const sidebarIndicators = ["sidebar", "side-bar", "aside", "widget"];

  return sidebarIndicators.some((indicator) => elementHtml.includes(indicator));
}
