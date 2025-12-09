/*
 * SPDX-License-Identifier: MIT
 * Copyright (c) 2025 NEU-DataVerse
 */

'use client';

import { useState } from 'react';
import {
  Thermometer,
  CloudRain,
  Wind,
  Cloud,
  ChevronDown,
  ChevronUp,
  Info,
  X,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import {
  WEATHER_LAYERS,
  LAYER_CATEGORIES,
  MAX_ACTIVE_LAYERS,
  getLayersByCategory,
  type WeatherLayerConfig,
} from '@/config/weather-layers';
import { useMediaQuery } from '@/hooks/useMediaQuery';

interface WeatherLayerControlProps {
  activeLayers: string[];
  onLayersChange: (layers: string[]) => void;
  opacity: number;
  onOpacityChange: (opacity: number) => void;
  failedLayers?: string[];
  onRetryLayer?: (layerCode: string) => void;
  className?: string;
}

const CATEGORY_ICONS = {
  temperature: Thermometer,
  precipitation: CloudRain,
  'wind-pressure': Wind,
  'clouds-humidity': Cloud,
};

export function WeatherLayerControl({
  activeLayers,
  onLayersChange,
  opacity,
  onOpacityChange,
  failedLayers = [],
  onRetryLayer,
  className = '',
}: WeatherLayerControlProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const layersByCategory = getLayersByCategory();
  const isMobile = useMediaQuery('(max-width: 768px)');

  const handleLayerToggle = (layerCode: string) => {
    const isCurrentlyActive = activeLayers.includes(layerCode);

    if (isCurrentlyActive) {
      // Remove layer
      onLayersChange(activeLayers.filter((code) => code !== layerCode));
    } else {
      // Add layer - check max limit
      if (activeLayers.length >= MAX_ACTIVE_LAYERS) {
        // Show warning (handled by parent via toast)
        return;
      }
      onLayersChange([...activeLayers, layerCode]);
    }
  };

  const handleClearAll = () => {
    onLayersChange([]);
  };

  const isLayerFailed = (layerCode: string) => failedLayers.includes(layerCode);
  const canAddMoreLayers = activeLayers.length < MAX_ACTIVE_LAYERS;

  // Layer controls content (shared between desktop Card and mobile Sheet)
  const LayerControlsContent = () => (
    <>
      {/* Max layers warning */}
      {activeLayers.length >= MAX_ACTIVE_LAYERS && (
        <Alert variant="default" className="py-2">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-xs">
            Đã đạt giới hạn {MAX_ACTIVE_LAYERS} lớp. Tắt một lớp để bật lớp khác.
          </AlertDescription>
        </Alert>
      )}

      {/* Opacity Control */}
      <div className="space-y-2 pb-2 border-b">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">Độ trong suốt</Label>
          <span className="text-xs text-slate-500">{Math.round(opacity * 100)}%</span>
        </div>
        <Slider
          value={[opacity]}
          onValueChange={([value]) => onOpacityChange(value)}
          min={0.2}
          max={1}
          step={0.1}
          className="w-full"
          disabled={activeLayers.length === 0}
        />
      </div>

      {/* Layer Categories */}
      <Accordion type="multiple" defaultValue={['temperature']} className="w-full">
        {(Object.keys(layersByCategory) as Array<WeatherLayerConfig['category']>).map(
          (category) => {
            const CategoryIcon = CATEGORY_ICONS[category];
            const categoryLayers = layersByCategory[category];
            const activeCategoryCount = categoryLayers.filter((layer) =>
              activeLayers.includes(layer.code),
            ).length;

            return (
              <AccordionItem key={category} value={category}>
                <AccordionTrigger className="py-2 hover:no-underline">
                  <div className="flex items-center gap-2 text-sm">
                    <CategoryIcon className="h-4 w-4" />
                    <span>{LAYER_CATEGORIES[category].label}</span>
                    {activeCategoryCount > 0 && (
                      <Badge variant="secondary" className="text-xs">
                        {activeCategoryCount}
                      </Badge>
                    )}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-2">
                  <div className="space-y-2 pt-1">
                    {categoryLayers.map((layer) => {
                      const isActive = activeLayers.includes(layer.code);
                      const isFailed = isLayerFailed(layer.code);
                      const isDisabled = !isActive && !canAddMoreLayers;

                      return (
                        <div
                          key={layer.code}
                          className={`flex items-center justify-between p-2 rounded-md transition-colors ${
                            isActive ? 'bg-blue-50 border border-blue-200' : 'hover:bg-slate-50'
                          } ${isDisabled ? 'opacity-50' : ''}`}
                        >
                          <div className="flex items-center gap-2 flex-1">
                            <Switch
                              checked={isActive}
                              onCheckedChange={() => handleLayerToggle(layer.code)}
                              disabled={isDisabled || isFailed}
                              id={`layer-${layer.code}`}
                            />
                            <div className="flex-1">
                              <Label
                                htmlFor={`layer-${layer.code}`}
                                className={`text-sm cursor-pointer ${isFailed ? 'text-red-500' : ''}`}
                              >
                                {layer.name}
                              </Label>
                              <p className="text-xs text-slate-500">{layer.unit}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            {isFailed && onRetryLayer && (
                              <Button
                                onClick={() => onRetryLayer(layer.code)}
                                variant="ghost"
                                size="sm"
                                className="h-7 w-7 p-0"
                              >
                                <RefreshCw className="h-3 w-3 text-red-500" />
                              </Button>
                            )}
                            <TooltipProvider delayDuration={200}>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                                    <Info className="h-3 w-3 text-slate-400" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent side="left" className="max-w-xs">
                                  <p className="text-xs">{layer.description}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          },
        )}
      </Accordion>

      {/* Failed layers summary */}
      {failedLayers.length > 0 && (
        <Alert variant="destructive" className="py-2">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-xs">
            {failedLayers.length} lớp không tải được. Kiểm tra API key hoặc thử lại.
          </AlertDescription>
        </Alert>
      )}
    </>
  );

  // Mobile version with Sheet drawer
  if (isMobile) {
    return (
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetTrigger asChild>
          <Button variant="secondary" size="sm" className="shadow-lg">
            <Cloud className="h-4 w-4 mr-2" />
            Layers ({activeLayers.length})
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="h-[80vh] overflow-y-auto">
          <SheetHeader className="pb-4">
            <div className="flex items-center gap-2">
              <Cloud className="h-5 w-5 text-blue-600" />
              <SheetTitle>Weather Layers</SheetTitle>
              <Badge variant="secondary" className="text-xs">
                {activeLayers.length}/{MAX_ACTIVE_LAYERS}
              </Badge>
              {activeLayers.length > 0 && (
                <Button onClick={handleClearAll} variant="ghost" size="sm" className="ml-auto">
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </SheetHeader>
          <div className="space-y-4">
            <LayerControlsContent />
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  // Desktop version with collapsible Card
  if (!isExpanded) {
    return (
      <div className={`${className}`}>
        <Button
          onClick={() => setIsExpanded(true)}
          variant="secondary"
          size="sm"
          className="shadow-lg"
        >
          <Cloud className="h-4 w-4 mr-2" />
          Weather Layers ({activeLayers.length})
          <ChevronDown className="h-4 w-4 ml-2" />
        </Button>
      </div>
    );
  }

  return (
    <Card className={`${className} shadow-xl`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cloud className="h-5 w-5 text-blue-600" />
            <CardTitle className="text-base">Weather Layers</CardTitle>
            <Badge variant="secondary" className="text-xs">
              {activeLayers.length}/{MAX_ACTIVE_LAYERS}
            </Badge>
          </div>
          <div className="flex items-center gap-1">
            {activeLayers.length > 0 && (
              <Button onClick={handleClearAll} variant="ghost" size="sm">
                <X className="h-4 w-4" />
              </Button>
            )}
            <Button onClick={() => setIsExpanded(false)} variant="ghost" size="sm">
              <ChevronUp className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <LayerControlsContent />
      </CardContent>
    </Card>
  );
}
