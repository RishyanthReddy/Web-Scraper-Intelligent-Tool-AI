import React, { useState } from "react";
import Header from "./Dashboard/Header";
import UrlInputSection from "./Dashboard/UrlInputSection";
import ResultsPanel from "./Dashboard/ResultsPanel";
import SettingsPanel from "./Dashboard/SettingsPanel";
import HistorySidebar from "./Dashboard/HistorySidebar";
import { Button } from "./ui/button";
import { Settings, History, X } from "lucide-react";

interface ScrapeSettings {
  waitTime: number;
  depth: number;
  extractImages: boolean;
  extractLinks: boolean;
  extractText: boolean;
  dataFormat: string;
}

interface HistoryItem {
  id: string;
  url: string;
  timestamp: string;
  status: "success" | "error" | "pending";
}

type ScrapeStatus = "idle" | "loading" | "success" | "error";

const Home = () => {
  const [showSettings, setShowSettings] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [scrapeStatus, setScrapeStatus] = useState<ScrapeStatus>("idle");
  const [currentUrl, setCurrentUrl] = useState("");
  const [error, setError] = useState("");
  const [extractedData, setExtractedData] = useState<any>(null);
  const [settings, setSettings] = useState<ScrapeSettings>({
    waitTime: 3,
    depth: 2,
    extractImages: true,
    extractLinks: true,
    extractText: true,
    dataFormat: "json",
  });
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([
    {
      id: "1",
      url: "https://example.com",
      timestamp: "2023-06-15T14:30:00Z",
      status: "success",
    },
    {
      id: "2",
      url: "https://test-site.org/products",
      timestamp: "2023-06-15T13:15:00Z",
      status: "success",
    },
    {
      id: "3",
      url: "https://broken-site.net",
      timestamp: "2023-06-15T12:45:00Z",
      status: "error",
    },
  ]);

  const toggleSettings = () => {
    setShowSettings(!showSettings);
    if (showHistory && !showSettings) setShowHistory(false);
  };

  const toggleHistory = () => {
    setShowHistory(!showHistory);
    if (showSettings && !showHistory) setShowSettings(false);
  };

  const handleScrape = async (url: string) => {
    setCurrentUrl(url);
    setScrapeStatus("loading");
    setError("");
    setExtractedData(null); // Clear previous data

    try {
      // Import the scraper service dynamically to avoid issues with SSR
      const scraperService = (await import("../services/ScraperService"))
        .default;

      // Update scraper options from the current settings
      scraperService.updateOptions(settings);

      // Perform the actual scrape
      const result = await scraperService.scrapeUrl(url);

      if (result.status === "error") {
        setScrapeStatus("error");
        setError(
          result.error ||
            "Failed to scrape the website. Please check the URL and try again.",
        );
        return;
      }

      // Handle successful scrape
      setScrapeStatus("success");
      setExtractedData(result.data);

      // Add to history
      const newHistoryItem: HistoryItem = {
        id: Date.now().toString(),
        url: url,
        timestamp: new Date().toISOString(),
        status: "success",
      };

      setHistoryItems([newHistoryItem, ...historyItems]);
    } catch (error) {
      console.error("Scraping error:", error);
      setScrapeStatus("error");
      setError(
        error instanceof Error
          ? error.message
          : "An unexpected error occurred during scraping.",
      );
    }
  };

  const handleRescrape = (item: HistoryItem) => {
    handleScrape(item.url);
  };

  const handleDeleteHistory = (id: string) => {
    setHistoryItems(historyItems.filter((item) => item.id !== id));
  };

  const handleSelectHistoryItem = async (item: HistoryItem) => {
    setCurrentUrl(item.url);

    try {
      // Import the scraper service dynamically
      const scraperService = (await import("../services/ScraperService"))
        .default;

      // Get the history item from the service
      const historyItem = scraperService.getHistoryItem(item.id);

      if (historyItem && historyItem.data) {
        // If we have the data in history, use it
        setScrapeStatus("success");
        setExtractedData(historyItem.data);
      } else {
        // If we don't have the data or it was an error, trigger a new scrape
        handleScrape(item.url);
      }
    } catch (error) {
      console.error("Error retrieving history item:", error);
      // Fallback to a new scrape
      handleScrape(item.url);
    }
  };

  const handleSaveSettings = (newSettings: ScrapeSettings) => {
    setSettings(newSettings);
    setShowSettings(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header title="AI Web Scraper" onSettingsClick={toggleSettings} />

      <div className="flex flex-1 overflow-hidden">
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="p-6">
            <UrlInputSection
              onScrape={handleScrape}
              status={scrapeStatus}
              error={error}
            />
          </div>

          <div className="flex-1 p-6 pt-0 overflow-auto">
            <ResultsPanel
              data={extractedData}
              isLoading={scrapeStatus === "loading"}
              error={error}
              onDownload={(format) => {
                if (!extractedData) return;

                try {
                  // Import the scraper service dynamically
                  import("../services/ScraperService").then((module) => {
                    const scraperService = module.default;
                    const { content, filename, mimeType } =
                      scraperService.downloadData(extractedData, format);

                    // Create a blob and trigger download
                    const blob = new Blob([content], { type: mimeType });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = filename;
                    document.body.appendChild(a);
                    a.click();

                    // Clean up
                    setTimeout(() => {
                      document.body.removeChild(a);
                      URL.revokeObjectURL(url);
                    }, 100);
                  });
                } catch (error) {
                  console.error("Error downloading data:", error);
                }
              }}
            />
          </div>
        </div>

        {/* Right Sidebar - Settings Panel */}
        <div
          className={`${showSettings ? "w-80" : "w-0"} transition-all duration-300 overflow-hidden border-l border-gray-200 bg-white`}
        >
          {showSettings && (
            <div className="h-full relative">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 z-10"
                onClick={toggleSettings}
              >
                <X className="h-5 w-5" />
              </Button>
              <div className="p-4 h-full overflow-auto">
                <SettingsPanel
                  initialSettings={settings}
                  onSave={handleSaveSettings}
                  isOpen={true}
                />
              </div>
            </div>
          )}
        </div>

        {/* Left Sidebar - History */}
        <div
          className={`${showHistory ? "w-80" : "w-0"} transition-all duration-300 overflow-hidden border-r border-gray-200 bg-white order-first`}
        >
          {showHistory && (
            <div className="h-full relative">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 z-10"
                onClick={toggleHistory}
              >
                <X className="h-5 w-5" />
              </Button>
              <div className="h-full overflow-auto">
                <HistorySidebar
                  historyItems={historyItems}
                  onSelectItem={handleSelectHistoryItem}
                  onRescrape={handleRescrape}
                  onDelete={handleDeleteHistory}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="bg-white border-t border-gray-200 p-4 flex justify-center space-x-4">
        <Button
          variant={showHistory ? "default" : "outline"}
          onClick={toggleHistory}
          className="flex items-center gap-2"
        >
          <History className="h-4 w-4" />
          History
        </Button>
        <Button
          variant={showSettings ? "default" : "outline"}
          onClick={toggleSettings}
          className="flex items-center gap-2"
        >
          <Settings className="h-4 w-4" />
          Settings
        </Button>
      </div>
    </div>
  );
};

export default Home;
