import React, { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Search, Loader2, AlertCircle, CheckCircle } from "lucide-react";
import InfoTooltip from "./InfoTooltip";

type ScrapeStatus = "idle" | "loading" | "success" | "error";

interface UrlInputSectionProps {
  onScrape?: (url: string) => void;
  status?: ScrapeStatus;
  error?: string;
}

const UrlInputSection = ({
  onScrape = () => {},
  status = "idle",
  error = "",
}: UrlInputSectionProps) => {
  const [url, setUrl] = useState<string>("https://example.com");

  const handleScrape = () => {
    if (url.trim()) {
      onScrape(url);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleScrape();
    }
  };

  const renderStatusIndicator = () => {
    switch (status) {
      case "loading":
        return (
          <div className="flex items-center text-yellow-500">
            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
            <span>Scraping in progress...</span>
          </div>
        );
      case "success":
        return (
          <div className="flex items-center text-green-500">
            <CheckCircle className="h-5 w-5 mr-2" />
            <span>Scraping completed successfully</span>
          </div>
        );
      case "error":
        return (
          <div className="flex items-center text-red-500">
            <AlertCircle className="h-5 w-5 mr-2" />
            <span>{error || "An error occurred during scraping"}</span>
          </div>
        );
      default:
        return (
          <div className="text-gray-400 text-sm">
            Enter a URL and click Scrape to extract data
          </div>
        );
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold text-gray-800">URL Input</h2>
          <InfoTooltip
            content={
              <div>
                <p>
                  Enter any website URL to extract structured data using our
                  adaptive scraping engine.
                </p>
                <p className="mt-1">Our AI-powered scraper can handle:</p>
                <ul className="list-disc pl-4 mt-1 space-y-1">
                  <li>News articles</li>
                  <li>E-commerce sites</li>
                  <li>Blogs</li>
                  <li>Business websites</li>
                  <li>And more!</li>
                </ul>
              </div>
            }
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <Input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter website URL to scrape"
              className="pr-10 h-11 w-full"
              disabled={status === "loading"}
            />
            <Search className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
          </div>

          <Button
            onClick={handleScrape}
            disabled={status === "loading" || !url.trim()}
            className="h-11 px-6"
          >
            {status === "loading" ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Scraping...
              </>
            ) : (
              "Scrape"
            )}
          </Button>
        </div>

        <div className="h-6">{renderStatusIndicator()}</div>
      </div>
    </div>
  );
};

export default UrlInputSection;
