'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Image as ImageIcon } from 'lucide-react';
import { IIncident, IncidentTypeLabels, IncidentStatusLabels } from '@smart-forecast/shared';
import { formatDate, getLocationString, getReporterName, getStatusVariant } from './report-utils';

interface ReportCardProps {
  report: IIncident;
  onClick: (report: IIncident) => void;
}

export function ReportCard({ report, onClick }: ReportCardProps) {
  const [imageError, setImageError] = useState(false);
  const hasImages = report.imageUrls && report.imageUrls.length > 0;
  const thumbnailUrl = hasImages ? report.imageUrls[0] : null;

  return (
    <Card
      className="cursor-pointer hover:border-blue-300 transition-colors overflow-hidden"
      onClick={() => onClick(report)}
    >
      <div className="flex">
        {/* Thumbnail Image */}
        <div className="w-28 h-28 shrink-0 bg-slate-100 relative">
          {thumbnailUrl && !imageError ? (
            <Image
              src={thumbnailUrl}
              alt={`Incident ${report.id}`}
              fill
              className="object-cover"
              sizes="112px"
              onError={() => setImageError(true)}
              unoptimized // MinIO URLs are external
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ImageIcon className="h-8 w-8 text-slate-400" />
            </div>
          )}
          {hasImages && report.imageUrls.length > 1 && (
            <div className="absolute bottom-1 right-1 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded">
              +{report.imageUrls.length - 1}
            </div>
          )}
        </div>

        {/* Content */}
        <CardContent className="flex-1 p-4">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-medium text-slate-900">{IncidentTypeLabels[report.type]}</h3>
              <p className="text-sm text-slate-500">{getReporterName(report.reportedBy)}</p>
            </div>
            <Badge variant={getStatusVariant(report.status)}>
              {IncidentStatusLabels[report.status]}
            </Badge>
          </div>

          <p className="text-sm text-slate-600 mb-2 line-clamp-2">{report.description}</p>

          <div className="flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              <span>{getLocationString(report.location.coordinates)}</span>
            </div>
            <span>{formatDate(report.createdAt)}</span>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
