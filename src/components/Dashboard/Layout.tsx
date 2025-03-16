import React, { useState } from "react";
import { Button } from "../ui/button";
import { Settings, History, X } from "lucide-react";

// Create mock components since the actual components don't seem to be available
const Header = () => (
  <header className="bg-white border-b border-gray-200 p-4">
    <h1 className="text-2xl font-bold">AI Web Scraper</h1>
  </header>
);

const UrlInputSection = () => (
  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
    <h2 className="text-lg font-medium mb-4">Enter URL to Scrape</h2>
    <div className="flex gap-2">
      <input
        type="text"
        placeholder="https://example.com"
        className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <Button>Scrape</Button>
    </div>
  </div>
);

const ResultsPanel = () => (
  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
    <h2 className="text-lg font-medium mb-4">Results</h2>
    <div className="bg-gray-100 p-4 rounded-md h-64 overflow-auto">
      <pre className="text-sm">
        {JSON.stringify({ sample: "data" }, null, 2)}
      </pre>
    </div>
    <div className="mt-4 flex gap-2">
      <Button variant="outline">Download JSON</Button>
      <Button variant="outline">Download CSV</Button>
    </div>
  </div>
);

const SettingsPanel = () => (
  <div>
    <h2 className="text-xl font-bold mb-4">Scraping Settings</h2>
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Wait Time (ms)</label>
        <input
          type="number"
          className="w-full p-2 border rounded"
          defaultValue={1000}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Scraping Depth</label>
        <input
          type="number"
          className="w-full p-2 border rounded"
          defaultValue={2}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Data Types</label>
        <div className="space-y-2">
          <div className="flex items-center">
            <input type="checkbox" id="text" defaultChecked className="mr-2" />
            <label htmlFor="text">Text</label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="images"
              defaultChecked
              className="mr-2"
            />
            <label htmlFor="images">Images</label>
          </div>
          <div className="flex items-center">
            <input type="checkbox" id="links" defaultChecked className="mr-2" />
            <label htmlFor="links">Links</label>
          </div>
        </div>
      </div>
      <Button className="w-full">Save Settings</Button>
    </div>
  </div>
);

const HistorySidebar = () => (
  <div>
    <h2 className="text-xl font-bold mb-4">Scraping History</h2>
    <div className="space-y-2">
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className="p-3 border rounded hover:bg-gray-50 cursor-pointer"
        >
          <div className="font-medium">example.com</div>
          <div className="text-sm text-gray-500">Today at 12:34 PM</div>
        </div>
      ))}
    </div>
  </div>
);

interface DashboardLayoutProps {
  children?: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [showSettings, setShowSettings] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const toggleSettings = () => {
    setShowSettings(!showSettings);
    if (showHistory && !showSettings) setShowHistory(false);
  };

  const toggleHistory = () => {
    setShowHistory(!showHistory);
    if (showSettings && !showHistory) setShowSettings(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />

      <div className="flex flex-1 overflow-hidden">
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="p-6">
            <UrlInputSection />
          </div>

          <div className="flex-1 p-6 pt-0 overflow-auto">
            <ResultsPanel />
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
                <SettingsPanel />
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
              <div className="p-4 h-full overflow-auto">
                <HistorySidebar />
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

export default DashboardLayout;
