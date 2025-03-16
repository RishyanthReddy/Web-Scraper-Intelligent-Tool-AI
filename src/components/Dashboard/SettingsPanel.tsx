import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "../ui/card";
import { Label } from "../ui/label";
import { Slider } from "../ui/slider";
import { Switch } from "../ui/switch";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Settings, Save, RotateCcw } from "lucide-react";
import InfoTooltip from "./InfoTooltip";

interface SettingsPanelProps {
  onSave?: (settings: ScrapeSettings) => void;
  initialSettings?: ScrapeSettings;
  isOpen?: boolean;
}

interface ScrapeSettings {
  waitTime: number;
  depth: number;
  extractImages: boolean;
  extractLinks: boolean;
  extractText: boolean;
  dataFormat: string;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({
  onSave = () => {},
  initialSettings = {
    waitTime: 3,
    depth: 2,
    extractImages: true,
    extractLinks: true,
    extractText: true,
    dataFormat: "json",
  },
  isOpen = true,
}) => {
  const [settings, setSettings] = useState<ScrapeSettings>(initialSettings);

  const handleSave = () => {
    onSave(settings);
  };

  const handleReset = () => {
    setSettings(initialSettings);
  };

  if (!isOpen) return null;

  return (
    <Card className="w-full max-w-md bg-white shadow-lg">
      <CardHeader className="border-b">
        <div className="flex items-center">
          <Settings className="mr-2 h-5 w-5" />
          <CardTitle>Scraping Settings</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <Label htmlFor="wait-time">Wait Time (seconds)</Label>
                <InfoTooltip
                  content="Time to wait for dynamic content to load after the page is initially rendered. Increase for JavaScript-heavy sites."
                  iconSize={14}
                />
              </div>
              <span className="text-sm font-medium">{settings.waitTime}s</span>
            </div>
            <Slider
              id="wait-time"
              min={0}
              max={10}
              step={0.5}
              value={[settings.waitTime]}
              onValueChange={(value) =>
                setSettings({ ...settings, waitTime: value[0] })
              }
            />
            <p className="text-xs text-muted-foreground">
              Time to wait for dynamic content to load
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <Label htmlFor="depth">Scraping Depth</Label>
                <InfoTooltip
                  content="How many levels of links to follow from the initial page. Higher values will scrape more content but take longer."
                  iconSize={14}
                />
              </div>
              <span className="text-sm font-medium">{settings.depth}</span>
            </div>
            <Slider
              id="depth"
              min={1}
              max={5}
              step={1}
              value={[settings.depth]}
              onValueChange={(value) =>
                setSettings({ ...settings, depth: value[0] })
              }
            />
            <p className="text-xs text-muted-foreground">
              How many levels of links to follow
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <h3 className="text-sm font-medium">Data Types to Extract</h3>

            <div className="flex items-center justify-between">
              <Label htmlFor="extract-text">Extract Text</Label>
              <Switch
                id="extract-text"
                checked={settings.extractText}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, extractText: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="extract-images">Extract Images</Label>
              <Switch
                id="extract-images"
                checked={settings.extractImages}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, extractImages: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="extract-links">Extract Links</Label>
              <Switch
                id="extract-links"
                checked={settings.extractLinks}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, extractLinks: checked })
                }
              />
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <Label htmlFor="data-format">Output Format</Label>
            <Select
              value={settings.dataFormat}
              onValueChange={(value) =>
                setSettings({ ...settings, dataFormat: value })
              }
            >
              <SelectTrigger id="data-format">
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="json">JSON</SelectItem>
                <SelectItem value="csv">CSV</SelectItem>
                <SelectItem value="xml">XML</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <Button variant="outline" onClick={handleReset}>
          <RotateCcw className="mr-2 h-4 w-4" />
          Reset
        </Button>
        <Button onClick={handleSave}>
          <Save className="mr-2 h-4 w-4" />
          Save Settings
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SettingsPanel;
