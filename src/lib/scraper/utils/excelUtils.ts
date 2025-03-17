/**
 * Excel utilities for the scraper
 *
 * This file contains utilities for converting scraped data to Excel format.
 * Currently, we're using CSV as a fallback since we don't have a proper Excel library.
 * In a production environment, you would use a library like xlsx or exceljs.
 */

import { ScrapedData } from "../types";

/**
 * Convert scraped data to Excel format
 *
 * Note: This is a placeholder. In a real implementation, you would use a library
 * like xlsx or exceljs to create actual Excel files.
 */
export function convertToExcel(data: ScrapedData): string {
  // In a real implementation, this would return a Buffer or Blob
  // For now, we'll just return CSV as a fallback
  return convertToCSV(data);
}

/**
 * Convert scraped data to CSV format
 */
export function convertToCSV(data: ScrapedData): string {
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
      rows.push([String(heading.level || ""), heading.text || ""]);
    });
    rows.push([]);
  }

  // Paragraphs
  if (data.content?.paragraphs && data.content.paragraphs.length > 0) {
    rows.push(["PARAGRAPHS"]);
    data.content.paragraphs.forEach((paragraph, index) => {
      rows.push([`Paragraph ${index + 1}`, paragraph || ""]);
    });
    rows.push([]);
  }

  // Links
  if (data.content?.links && data.content.links.length > 0) {
    rows.push(["LINKS"]);
    rows.push(["Text", "URL", "Internal"]);
    data.content.links.forEach((link) => {
      rows.push([
        link.text || "",
        link.url || "",
        String(link.isInternal || false),
      ]);
    });
    rows.push([]);
  }

  // Images
  if (data.content?.images && data.content.images.length > 0) {
    rows.push(["IMAGES"]);
    rows.push(["Alt Text", "Source", "Width", "Height"]);
    data.content.images.forEach((image) => {
      rows.push([
        image.alt || "",
        image.src || "",
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
      rows.push([`List ${listIndex + 1} (${list.type || "unknown"})`]);
      list.items.forEach((item, itemIndex) => {
        rows.push([`Item ${itemIndex + 1}`, item || ""]);
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
      if (table.headers && table.headers.length > 0) {
        rows.push(table.headers.map((header) => header || "[No Header]"));
      }

      // Add table rows
      if (table.rows && table.rows.length > 0) {
        table.rows.forEach((row) => {
          rows.push(row.map((cell) => cell || "[Empty Cell]"));
        });
      }

      rows.push([]);
    });
  }

  // Convert rows to CSV
  try {
    return rows
      .map((row) =>
        row
          .map((cell) => `"${String(cell || "").replace(/"/g, '""')}"`)
          .join(","),
      )
      .join("\n");
  } catch (error) {
    console.error("Error converting to CSV:", error);
    return (
      "Error generating CSV: " +
      (error instanceof Error ? error.message : String(error))
    );
  }
}
