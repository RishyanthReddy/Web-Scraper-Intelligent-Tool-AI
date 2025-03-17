import React, { useState } from "react";
import { Button } from "../ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import { Input } from "../ui/input";
import {
  Search,
  Download,
  ChevronRight,
  ChevronDown,
  FileSpreadsheet,
} from "lucide-react";

interface ResultsPanelProps {
  data?: any;
  isLoading?: boolean;
  error?: string;
  onDownload?: (format: "json" | "csv" | "xml" | "excel") => void;
}

const ResultsPanel = ({
  data = null,
  isLoading = false,
  error = "",
  onDownload = () => {},
}: ResultsPanelProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedNodes, setExpandedNodes] = useState<string[]>([]);

  const toggleNode = (path: string) => {
    if (expandedNodes.includes(path)) {
      setExpandedNodes(expandedNodes.filter((node) => node !== path));
    } else {
      setExpandedNodes([...expandedNodes, path]);
    }
  };

  const renderJsonNode = (data: any, path = "", depth = 0) => {
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
    const currentPath = path || "root";
    const isExpanded = expandedNodes.includes(currentPath);

    if (isEmpty) {
      return isArray ? (
        <span className="text-gray-500">[]</span>
      ) : (
        <span className="text-gray-500">{"{}"}</span>
      );
    }

    return (
      <div className="ml-4">
        <div
          className="flex items-center cursor-pointer hover:bg-gray-100 rounded py-1"
          onClick={() => toggleNode(currentPath)}
        >
          {isExpanded ? (
            <ChevronDown className="h-4 w-4 text-gray-500 mr-1" />
          ) : (
            <ChevronRight className="h-4 w-4 text-gray-500 mr-1" />
          )}
          <span className="font-mono">
            {isArray ? `Array(${Object.keys(data).length})` : "Object"}
          </span>
        </div>

        {isExpanded && (
          <div className="border-l-2 border-gray-200 pl-2">
            {Object.entries(data).map(([key, value], index) => (
              <div key={`${currentPath}-${key}-${index}`} className="my-1">
                <span className="text-red-600 font-mono">{key}: </span>
                {renderJsonNode(value, `${currentPath}.${key}`, depth + 1)}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const filterData = (data: any, term: string) => {
    if (!term) return data;
    if (!data) return null;

    const searchTermLower = term.toLowerCase();

    // Simple implementation - in a real app, this would be more sophisticated
    const stringifyAndCheck = (obj: any): boolean => {
      try {
        const str = JSON.stringify(obj).toLowerCase();
        return str.includes(searchTermLower);
      } catch (error) {
        console.error("Error stringifying object for search:", error);
        return false;
      }
    };

    return stringifyAndCheck(data) ? data : null;
  };

  const filteredData = filterData(data, searchTerm);

  return (
    <div className="w-full h-full bg-white rounded-lg shadow-md p-4 flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Extracted Data</h2>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDownload("json")}
            disabled={!data}
          >
            <Download className="h-4 w-4 mr-2" />
            JSON
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDownload("csv")}
            disabled={!data}
          >
            <Download className="h-4 w-4 mr-2" />
            CSV
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDownload("xml")}
            disabled={!data}
          >
            <Download className="h-4 w-4 mr-2" />
            XML
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDownload("excel")}
            disabled={!data}
          >
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            Excel
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

      <Tabs defaultValue="tree" className="flex-1">
        <TabsList className="mb-2">
          <TabsTrigger value="tree">Tree View</TabsTrigger>
          <TabsTrigger value="raw">Raw JSON</TabsTrigger>
        </TabsList>

        <TabsContent value="tree" className="flex-1 overflow-auto">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div className="text-red-500 p-4 bg-red-50 rounded">{error}</div>
          ) : filteredData ? (
            <div className="font-mono text-sm bg-gray-50 p-4 rounded-md overflow-auto h-[400px]">
              {data ? (
                renderJsonNode(filteredData)
              ) : (
                <div>No data available. Please scrape a URL first.</div>
              )}
            </div>
          ) : (
            <div className="text-gray-500 p-4 bg-gray-50 rounded">
              {data
                ? "No results match your search."
                : "No data available. Please scrape a URL first."}
            </div>
          )}
        </TabsContent>

        <TabsContent value="raw" className="flex-1 overflow-auto">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div className="text-red-500 p-4 bg-red-50 rounded">{error}</div>
          ) : filteredData ? (
            <pre className="font-mono text-sm bg-gray-50 p-4 rounded-md overflow-auto h-[400px] whitespace-pre-wrap">
              {data
                ? JSON.stringify(filteredData, null, 2)
                : "No data available. Please scrape a URL first."}
            </pre>
          ) : (
            <div className="text-gray-500 p-4 bg-gray-50 rounded">
              {data
                ? "No results match your search."
                : "No data available. Please scrape a URL first."}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ResultsPanel;
