import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Plus } from 'lucide-react';

interface StatisticReportConfig {
  title: string;
  dateRange: string;
  includeTemperature: boolean;
  includeRainfall: boolean;
  includeHumidity: boolean;
  includeWindSpeed: boolean;
  includeAirQuality: boolean;
  region: string;
}

interface StatisticReportDialogProps {
  onCreateReport: (config: StatisticReportConfig) => void;
}

export function StatisticReportDialog({ onCreateReport }: StatisticReportDialogProps) {
  const [open, setOpen] = useState(false);
  const [config, setConfig] = useState<StatisticReportConfig>({
    title: '',
    dateRange: 'week',
    includeTemperature: true,
    includeRainfall: true,
    includeHumidity: true,
    includeWindSpeed: false,
    includeAirQuality: false,
    region: 'all',
  });

  const handleCreate = () => {
    if (!config.title.trim()) {
      alert('Please enter a report title');
      return;
    }
    onCreateReport(config);
    setOpen(false);
    // Reset form
    setConfig({
      title: '',
      dateRange: 'week',
      includeTemperature: true,
      includeRainfall: true,
      includeHumidity: true,
      includeWindSpeed: false,
      includeAirQuality: false,
      region: 'all',
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-1.5" />
          Create Report
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create Statistics Report</DialogTitle>
          <DialogDescription className="text-xs">
            Configure your custom weather statistics report
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm">
              Report Title
            </Label>
            <Input
              id="title"
              placeholder="e.g., Weekly Weather Summary"
              value={config.title}
              onChange={(e) => setConfig({ ...config, title: e.target.value })}
              className="h-9 text-sm"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dateRange" className="text-sm">
              Date Range
            </Label>
            <Select
              value={config.dateRange}
              onValueChange={(value) => setConfig({ ...config, dateRange: value })}
            >
              <SelectTrigger id="dateRange" className="h-9 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Last 24 Hours</SelectItem>
                <SelectItem value="week">Last 7 Days</SelectItem>
                <SelectItem value="month">Last 30 Days</SelectItem>
                <SelectItem value="quarter">Last 3 Months</SelectItem>
                <SelectItem value="year">Last Year</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="region" className="text-sm">
              Region
            </Label>
            <Select
              value={config.region}
              onValueChange={(value) => setConfig({ ...config, region: value })}
            >
              <SelectTrigger id="region" className="h-9 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Regions</SelectItem>
                <SelectItem value="downtown">Downtown District</SelectItem>
                <SelectItem value="north">North Region</SelectItem>
                <SelectItem value="east">East Harbor</SelectItem>
                <SelectItem value="west">West Valley</SelectItem>
                <SelectItem value="south">South Area</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm">Include Metrics</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="temperature"
                  checked={config.includeTemperature}
                  onCheckedChange={(checked) =>
                    setConfig({ ...config, includeTemperature: checked as boolean })
                  }
                />
                <label htmlFor="temperature" className="text-sm cursor-pointer">
                  Temperature Trends
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="rainfall"
                  checked={config.includeRainfall}
                  onCheckedChange={(checked) =>
                    setConfig({ ...config, includeRainfall: checked as boolean })
                  }
                />
                <label htmlFor="rainfall" className="text-sm cursor-pointer">
                  Rainfall Analysis
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="humidity"
                  checked={config.includeHumidity}
                  onCheckedChange={(checked) =>
                    setConfig({ ...config, includeHumidity: checked as boolean })
                  }
                />
                <label htmlFor="humidity" className="text-sm cursor-pointer">
                  Humidity Levels
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="windSpeed"
                  checked={config.includeWindSpeed}
                  onCheckedChange={(checked) =>
                    setConfig({ ...config, includeWindSpeed: checked as boolean })
                  }
                />
                <label htmlFor="windSpeed" className="text-sm cursor-pointer">
                  Wind Speed
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="airQuality"
                  checked={config.includeAirQuality}
                  onCheckedChange={(checked) =>
                    setConfig({ ...config, includeAirQuality: checked as boolean })
                  }
                />
                <label htmlFor="airQuality" className="text-sm cursor-pointer">
                  Air Quality Index
                </label>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} size="sm">
            Cancel
          </Button>
          <Button onClick={handleCreate} size="sm">
            Create Report
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
