import React, { useState } from "react";
import { ScrollArea } from "../ui/scroll-area";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Clock, RefreshCw, Trash2, ExternalLink } from "lucide-react";
import ScrapeStatusBadge from "./ScrapeStatusBadge";

interface HistoryItem {
  id: string;
  url: string;
  timestamp: string;
  status: "success" | "error" | "pending";
}

interface HistorySidebarProps {
  historyItems?: HistoryItem[];
  onSelectItem?: (item: HistoryItem) => void;
  onRescrape?: (item: HistoryItem) => void;
  onDelete?: (id: string) => void;
}

const HistorySidebar = ({
  historyItems = [
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
    {
      id: "4",
      url: "https://data-heavy.com/users",
      timestamp: "2023-06-14T18:20:00Z",
      status: "success",
    },
    {
      id: "5",
      url: "https://api-test.io/endpoints",
      timestamp: "2023-06-14T16:10:00Z",
      status: "pending",
    },
  ],
  onSelectItem = () => {},
  onRescrape = () => {},
  onDelete = () => {},
}: HistorySidebarProps) => {
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const formatUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname + (urlObj.pathname !== "/" ? urlObj.pathname : "");
    } catch (e) {
      return url;
    }
  };

  const handleItemClick = (item: HistoryItem) => {
    setSelectedItemId(item.id);
    onSelectItem(item);
  };

  return (
    <div className="w-[300px] h-full bg-background border-r border-border flex flex-col">
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold">History</h2>
        <p className="text-sm text-muted-foreground">Previously scraped URLs</p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-2">
          {historyItems.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No history items yet</p>
              <p className="text-sm">Scraped URLs will appear here</p>
            </div>
          ) : (
            historyItems.map((item) => (
              <div
                key={item.id}
                className={`p-3 rounded-md cursor-pointer transition-colors ${selectedItemId === item.id ? "bg-accent" : "hover:bg-accent/50"}`}
                onClick={() => handleItemClick(item)}
              >
                <div className="flex justify-between items-start">
                  <div className="truncate flex-1">
                    <p className="font-medium truncate">
                      {formatUrl(item.url)}
                    </p>
                    <div className="flex items-center text-xs text-muted-foreground mt-1">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>{formatTimestamp(item.timestamp)}</span>
                    </div>
                  </div>
                  <ScrapeStatusBadge
                    status={item.status}
                    showText={false}
                    size="sm"
                    className="ml-2"
                  />
                </div>

                {selectedItemId === item.id && (
                  <div className="mt-2 pt-2 border-t border-border flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRescrape(item);
                      }}
                    >
                      <RefreshCw className="h-3.5 w-3.5 mr-1" />
                      Re-scrape
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectItem(item);
                      }}
                    >
                      <ExternalLink className="h-3.5 w-3.5 mr-1" />
                      View
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(item.id);
                      }}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </ScrollArea>

      <div className="p-3 border-t border-border">
        <p className="text-xs text-center text-muted-foreground">
          {historyItems.length} {historyItems.length === 1 ? "item" : "items"}{" "}
          in history
        </p>
      </div>
    </div>
  );
};

export default HistorySidebar;
