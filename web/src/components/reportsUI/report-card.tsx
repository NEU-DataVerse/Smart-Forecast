import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Image as ImageIcon } from 'lucide-react';
import { IIncident } from '@/../../shared/src/types/incident.types';
import {
  IncidentStatus,
  IncidentTypeLabels,
  IncidentStatusLabels,
} from '@/../../shared/src/constants';
import { formatDate, getLocationString } from './report-utils';

interface ReportCardProps {
  report: IIncident;
  onClick: (report: IIncident) => void;
}

export function ReportCard({ report, onClick }: ReportCardProps) {
  return (
    <Card
      className="cursor-pointer hover:border-blue-300 transition-colors"
      onClick={() => onClick(report)}
    >
      <CardContent className="pt-6">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-slate-900">{IncidentTypeLabels[report.type]}</h3>
            <p className="text-slate-500">Người báo cáo: {report.reportedBy}</p>
          </div>
          <Badge
            variant={
              report.status === IncidentStatus.VERIFIED
                ? 'default'
                : report.status === IncidentStatus.REJECTED
                  ? 'destructive'
                  : 'secondary'
            }
          >
            {IncidentStatusLabels[report.status]}
          </Badge>
        </div>

        <p className="text-slate-600 mb-3 line-clamp-2">{report.description}</p>

        <div className="flex items-center gap-4 text-slate-500 mb-2">
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            <span>{getLocationString(report.location.coordinates)}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-slate-500">
            <ImageIcon className="h-4 w-4" />
            <span>{report.imageUrls.length} ảnh</span>
          </div>
          <span className="text-slate-400">{formatDate(report.createdAt)}</span>
        </div>
      </CardContent>
    </Card>
  );
}
