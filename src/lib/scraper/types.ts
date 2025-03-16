export interface ScraperOptions {
  waitTime: number;
  depth: number;
  extractImages: boolean;
  extractLinks: boolean;
  extractText: boolean;
  dataFormat: "json" | "csv" | "xml" | "excel";
  concurrency?: number;
  userAgent?: string;
  timeout?: number;
}

export interface ScrapedData {
  url: string;
  title: string;
  timestamp: string;
  metadata: {
    description?: string;
    keywords?: string[];
    author?: string;
    openGraph?: Record<string, string>;
    twitterCard?: Record<string, string>;
    favicon?: string;
  };
  content: {
    headings?: Array<{ level: number; text: string }>;
    paragraphs?: string[];
    links?: Array<{ text: string; url: string; isInternal: boolean }>;
    images?: Array<{
      alt: string;
      src: string;
      width?: number;
      height?: number;
    }>;
    lists?: Array<{ type: "ordered" | "unordered"; items: string[] }>;
    tables?: Array<{ headers: string[]; rows: string[][] }>;
    mainText?: string;
  };
  raw?: any;
}

export interface ScrapeResult {
  data: ScrapedData | null;
  error?: string;
  status: "success" | "error" | "pending";
  duration: number;
}
