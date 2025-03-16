import { ScraperEngine, ScraperOptions } from "../lib/scraper";
import { ScrapedData, ScrapeResult } from "../lib/scraper/types";

class ScraperService {
  private engine: ScraperEngine;
  private history: Map<string, ScrapeResult>;

  constructor() {
    this.engine = new ScraperEngine();
    this.history = new Map();
  }

  /**
   * Scrape a URL and store the result in history
   */
  async scrapeUrl(
    url: string,
    options?: Partial<ScraperOptions>,
    apiKey?: string,
  ): Promise<ScrapeResult> {
    // Update options if provided
    if (options) {
      this.engine.updateOptions(options);
    }

    try {
      // Import the API scraper dynamically
      const { scrapeWithAPI } = await import("../lib/scraper/api");

      // Use the API-based scraper with optional API key
      const result = apiKey
        ? await scrapeWithAPI(url, apiKey)
        : await this.engine.scrape(url);

      // Store in history with a unique ID
      const id = Date.now().toString();
      this.history.set(id, {
        ...result,
        data: result.data ? { ...result.data, id } : null,
      });

      return result;
    } catch (error) {
      console.error("Error in scrapeUrl:", error);
      return {
        data: null,
        error: error instanceof Error ? error.message : String(error),
        status: "error",
        duration: 0,
      };
    }
  }

  /**
   * Get all history items
   */
  getHistory(): Array<{
    id: string;
    url: string;
    timestamp: string;
    status: "success" | "error" | "pending";
  }> {
    return Array.from(this.history.entries()).map(([id, result]) => ({
      id,
      url: result.data?.url || "",
      timestamp: result.data?.timestamp || new Date().toISOString(),
      status: result.status,
    }));
  }

  /**
   * Get a specific history item by ID
   */
  getHistoryItem(id: string): ScrapeResult | undefined {
    return this.history.get(id);
  }

  /**
   * Delete a history item
   */
  deleteHistoryItem(id: string): boolean {
    return this.history.delete(id);
  }

  /**
   * Clear all history
   */
  clearHistory(): void {
    this.history.clear();
  }

  /**
   * Update the scraper options
   */
  updateOptions(options: Partial<ScraperOptions>): void {
    this.engine.updateOptions(options);
  }

  /**
   * Get the current scraper options
   */
  getOptions(): ScraperOptions {
    return this.engine.getOptions();
  }

  /**
   * Convert data to the specified format
   */
  convertData(
    data: ScrapedData,
    format: "json" | "csv" | "xml" | "excel" = "json",
  ): string {
    return this.engine.convertData(data, format);
  }

  /**
   * Download data in the specified format
   */
  downloadData(
    data: ScrapedData,
    format: "json" | "csv" | "xml" | "excel" = "json",
  ): { content: string; filename: string; mimeType: string } {
    const content = this.convertData(data, format);
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const domain = new URL(data.url).hostname;

    let filename = `${domain}-${timestamp}`;
    let mimeType = "";

    switch (format) {
      case "json":
        filename += ".json";
        mimeType = "application/json";
        break;
      case "csv":
        filename += ".csv";
        mimeType = "text/csv";
        break;
      case "xml":
        filename += ".xml";
        mimeType = "application/xml";
        break;
      case "excel":
        filename += ".xlsx";
        mimeType =
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
        break;
    }

    return { content, filename, mimeType };
  }
}

// Create a singleton instance
const scraperService = new ScraperService();
export default scraperService;
