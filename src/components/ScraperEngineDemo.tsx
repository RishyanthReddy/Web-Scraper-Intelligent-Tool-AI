import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Loader2,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  FileText,
  Link2,
  Image,
  List,
  Table,
  Info,
  AlertCircle,
  Settings,
  History,
  X,
  Download,
  Search,
} from "lucide-react";
import { ScraperEngine } from "@/lib/scraper";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import Header from "./Dashboard/Header";
import SettingsPanel from "./Dashboard/SettingsPanel";
import HistorySidebar from "./Dashboard/HistorySidebar";
import { ScrapeResult, ScrapedData } from "@/lib/scraper/types";

interface HistoryItem {
  id: string;
  url: string;
  timestamp: string;
  status: "success" | "error" | "pending";
}

const ScraperEngineDemo = () => {
  const [url, setUrl] = useState("https://example.com");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ScrapedData | null>(null);
  const [error, setError] = useState("");
  const [engine, setEngine] = useState<ScraperEngine | null>(null);
  const [expandedNodes, setExpandedNodes] = useState(["root", "root.content"]);
  const [showSettings, setShowSettings] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([
    {
      id: "1",
      url: "https://example.com",
      timestamp: new Date().toISOString(),
      status: "success",
    },
  ]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Initialize the scraper engine
    const scraperEngine = new ScraperEngine();
    setEngine(scraperEngine);
  }, []);

  const toggleSettings = () => {
    setShowSettings(!showSettings);
    if (showHistory && !showSettings) setShowHistory(false);
  };

  const toggleHistory = () => {
    setShowHistory(!showHistory);
    if (showSettings && !showHistory) setShowSettings(false);
  };

  const handleScrape = async () => {
    if (!engine) {
      setError("Scraper engine not initialized");
      return;
    }

    setIsLoading(true);
    setError("");
    setResult(null);

    try {
      // Use the real scraper engine which now uses API-based scraping
      const scrapeResult = await engine.scrape(url);

      if (scrapeResult.status === "error") {
        setError(scrapeResult.error || "Failed to scrape the website");
      } else {
        setResult(scrapeResult.data);

        // Add to history
        const newHistoryItem: HistoryItem = {
          id: Date.now().toString(),
          url: url,
          timestamp: new Date().toISOString(),
          status: "success",
        };

        setHistoryItems([newHistoryItem, ...historyItems]);
      }
    } catch (err: any) {
      console.error("Scraping error:", err);
      setError("Failed to scrape the website: " + (err.message || String(err)));
    } finally {
      setIsLoading(false);
    }
  };

  const handleRescrape = (item: HistoryItem) => {
    setUrl(item.url);
    handleScrape();
  };

  const handleDeleteHistory = (id: string) => {
    setHistoryItems(historyItems.filter((item) => item.id !== id));
  };

  const handleSelectHistoryItem = (item: HistoryItem) => {
    setUrl(item.url);
    handleScrape();
  };

  const toggleNode = (path: string) => {
    if (expandedNodes.includes(path)) {
      setExpandedNodes(
        expandedNodes.filter(
          (node) => node !== path && !node.startsWith(`${path}.`),
        ),
      );
    } else {
      setExpandedNodes([...expandedNodes, path]);
    }
  };

  const getNodeIcon = (key: string, value: any) => {
    if (key === "headings" || key === "paragraphs" || key === "mainText")
      return <FileText className="h-4 w-4 text-blue-500" />;
    if (key === "links") return <Link2 className="h-4 w-4 text-purple-500" />;
    if (key === "images") return <Image className="h-4 w-4 text-green-500" />;
    if (key === "lists") return <List className="h-4 w-4 text-amber-500" />;
    if (key === "tables") return <Table className="h-4 w-4 text-indigo-500" />;
    return null;
  };

  const getNodeCount = (value: any) => {
    if (Array.isArray(value)) {
      return (
        <Badge variant="outline" className="ml-2 text-xs">
          {value.length}
        </Badge>
      );
    }
    return null;
  };

  const renderStructuredTree = (data: any, path = "root") => {
    if (!data) return null;

    // Filter out the main content sections we want to display
    const mainSections = {
      title: data.title,
      url: data.url,
      content: {},
    };

    // Only include non-empty content sections
    if (data.content) {
      const contentKeys = [
        "headings",
        "paragraphs",
        "links",
        "images",
        "lists",
        "tables",
      ];

      contentKeys.forEach((key) => {
        if (
          data.content[key] &&
          Array.isArray(data.content[key]) &&
          data.content[key].length > 0
        ) {
          mainSections.content[key] = data.content[key];
        }
      });
    }

    return renderTreeNode(mainSections, path);
  };

  const renderTreeNode = (data: any, path: string) => {
    if (data === null) return <span className="text-gray-500">null</span>;

    if (typeof data !== "object") {
      // Render primitive values
      if (typeof data === "string") {
        return <span className="text-green-600 break-all">"{data}"</span>;
      } else if (typeof data === "number") {
        return <span className="text-blue-600">{data}</span>;
      } else if (typeof data === "boolean") {
        return <span className="text-purple-600">{data.toString()}</span>;
      }
      return <span>{String(data)}</span>;
    }

    const isArray = Array.isArray(data);
    const isEmpty = Object.keys(data).length === 0;

    if (isEmpty) {
      return isArray ? (
        <span className="text-gray-500">[]</span>
      ) : (
        <span className="text-gray-500">{"{}"}</span>
      );
    }

    const isExpanded = expandedNodes.includes(path);

    // For arrays, show a preview of the first few items
    if (isArray) {
      return (
        <div>
          <div
            className="flex items-center cursor-pointer hover:bg-gray-200 rounded py-1 px-2"
            onClick={() => toggleNode(path)}
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4 text-gray-500 mr-1" />
            ) : (
              <ChevronRight className="h-4 w-4 text-gray-500 mr-1" />
            )}
            <span className="font-medium text-blue-700">
              Array [{data.length} items]
            </span>
          </div>

          {isExpanded && (
            <div className="ml-6 border-l-2 border-gray-200 pl-2">
              {data.slice(0, 10).map((item: any, index: number) => (
                <div key={`${path}-${index}`} className="my-1">
                  <span className="text-gray-500 font-mono">[{index}]: </span>
                  {renderTreeNode(item, `${path}.[${index}]`)}
                </div>
              ))}
              {data.length > 10 && (
                <div className="text-gray-500 italic text-sm">
                  ...and {data.length - 10} more items
                </div>
              )}
            </div>
          )}
        </div>
      );
    }

    // For objects, show the key-value pairs
    return (
      <div>
        {Object.entries(data).map(([key, value]) => {
          const nodePath = `${path}.${key}`;
          const isNodeExpanded = expandedNodes.includes(nodePath);
          const icon = getNodeIcon(key, value);
          const count = getNodeCount(value);

          // Skip empty arrays or objects
          if (
            (Array.isArray(value) && value.length === 0) ||
            (typeof value === "object" &&
              value !== null &&
              Object.keys(value).length === 0)
          ) {
            return null;
          }

          // For objects and arrays, render expandable nodes
          if (typeof value === "object" && value !== null) {
            return (
              <div key={nodePath} className="my-2">
                <div
                  className="flex items-center cursor-pointer hover:bg-gray-200 rounded py-1 px-2"
                  onClick={() => toggleNode(nodePath)}
                >
                  {isNodeExpanded ? (
                    <ChevronDown className="h-4 w-4 text-gray-500 mr-1" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-gray-500 mr-1" />
                  )}
                  <div className="flex items-center">
                    {icon && <span className="mr-1.5">{icon}</span>}
                    <span className="font-medium text-indigo-800">{key}</span>
                    {count}
                  </div>
                </div>

                {isNodeExpanded && (
                  <div className="ml-6 border-l-2 border-gray-200 pl-2">
                    {renderTreeNode(value, nodePath)}
                  </div>
                )}
              </div>
            );
          }

          // For primitive values, render directly
          return (
            <div key={nodePath} className="my-1 ml-2">
              <span className="font-medium text-indigo-800">{key}: </span>
              {renderTreeNode(value, nodePath)}
            </div>
          );
        })}
      </div>
    );
  };

  // Original JSON tree renderer for the raw view
  const renderJsonTree = (data: any, path = "", depth = 0) => {
    if (data === null) return <span className="text-gray-500">null</span>;

    if (typeof data !== "object") {
      // Render primitive values
      if (typeof data === "string") {
        return <span className="text-green-600">"{data}"</span>;
      } else if (typeof data === "number") {
        return <span className="text-blue-600">{data}</span>;
      } else if (typeof data === "boolean") {
        return <span className="text-purple-600">{data.toString()}</span>;
      }
      return <span>{String(data)}</span>;
    }

    const isArray = Array.isArray(data);
    const isEmpty = Object.keys(data).length === 0;

    if (isEmpty) {
      return isArray ? (
        <span className="text-gray-500">[]</span>
      ) : (
        <span className="text-gray-500">{"{}"}</span>
      );
    }

    return (
      <div className="ml-4">
        {Object.entries(data).map(([key, value], index) => (
          <div key={`${path}-${key}-${index}`} className="my-1">
            <span className="text-red-600 font-mono">{key}: </span>
            {renderJsonTree(value, `${path}.${key}`, depth + 1)}
          </div>
        ))}
      </div>
    );
  };

  const downloadData = async (format: "json" | "csv" | "xml" = "json") => {
    if (!result || !engine) return;

    try {
      // Get the download data
      const content = engine.convertData(result, format);
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const domain = new URL(result.url).hostname;

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
      }

      // Create a blob and download link
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);

      // Create a download link and trigger it
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
    } catch (error) {
      console.error("Error downloading data:", error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header title="AI Web Scraper" onSettingsClick={toggleSettings} />

      <div className="flex flex-1 overflow-hidden">
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="p-6">
            <div className="w-full max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="flex flex-col space-y-4">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-semibold text-gray-800">
                    URL Input
                  </h2>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-grow">
                    <Input
                      type="url"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="Enter website URL to scrape"
                      className="pr-10 h-11 w-full"
                      disabled={isLoading}
                    />
                    <Search className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
                  </div>

                  <Button
                    onClick={handleScrape}
                    disabled={isLoading || !url.trim()}
                    className="h-11 px-6"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Scraping...
                      </>
                    ) : (
                      "Scrape"
                    )}
                  </Button>
                </div>

                <div className="h-6">
                  {isLoading && (
                    <div className="flex items-center text-yellow-500">
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      <span>Scraping in progress...</span>
                    </div>
                  )}
                  {error && (
                    <div className="flex items-center text-red-500">
                      <AlertCircle className="h-5 w-5 mr-2" />
                      <span>{error}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 p-6 pt-0 overflow-auto">
            {result && (
              <div className="w-full h-full bg-white rounded-lg shadow-md p-4 flex flex-col">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h2 className="text-xl font-semibold">
                      {result.title || "Extracted Data"}
                    </h2>
                    <p className="text-sm text-gray-500">{result.url}</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => downloadData("json")}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      JSON
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => downloadData("csv")}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      CSV
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => downloadData("xml")}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      XML
                    </Button>
                  </div>
                </div>

                <div className="relative mb-4">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search in results..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <Tabs defaultValue="structured" className="flex-1">
                  <TabsList className="mb-2">
                    <TabsTrigger value="structured">
                      Structured View
                    </TabsTrigger>
                    <TabsTrigger value="tree">Tree View</TabsTrigger>
                    <TabsTrigger value="raw">Raw JSON</TabsTrigger>
                  </TabsList>

                  <TabsContent
                    value="structured"
                    className="flex-1 overflow-auto"
                  >
                    <div className="font-mono text-sm bg-gray-50 p-4 rounded-md overflow-auto h-[400px]">
                      {renderStructuredTree(result)}
                    </div>
                  </TabsContent>

                  <TabsContent value="tree" className="flex-1 overflow-auto">
                    <div className="font-mono text-sm bg-gray-50 p-4 rounded-md overflow-auto h-[400px]">
                      {renderJsonTree(result)}
                    </div>
                  </TabsContent>

                  <TabsContent value="raw" className="flex-1 overflow-auto">
                    <pre className="font-mono text-sm bg-gray-50 p-4 rounded-md overflow-auto h-[400px] whitespace-pre-wrap">
                      {JSON.stringify(result, null, 2)}
                    </pre>
                  </TabsContent>
                </Tabs>
              </div>
            )}

            {!result && !isLoading && (
              <div className="w-full h-full bg-white rounded-lg shadow-md p-8 flex flex-col items-center justify-center text-center">
                <Info className="h-12 w-12 text-blue-500 mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Data Yet</h3>
                <p className="text-gray-600 max-w-md">
                  Enter a URL in the input field above and click "Scrape" to
                  extract structured data from any website.
                </p>
              </div>
            )}
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
                <SettingsPanel isOpen={true} />
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

export default ScraperEngineDemo;
