'use client';
import { AlertTriangle, FileText } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useState } from 'react';

const summaryCards = [
  {
    title: 'New Reports',
    value: '18',
    description: '+5 from yesterday',
    icon: FileText,
    color: 'text-purple-500',
    bgColor: 'bg-purple-50',
  },
  {
    title: 'Active Alerts',
    value: '3',
    description: '2 high priority',
    icon: AlertTriangle,
    color: 'text-orange-500',
    bgColor: 'bg-orange-50',
  },
];

const recentReports = [
  {
    id: 1,
    location: 'Downtown District',
    type: 'Heavy Rain',
    status: 'Pending',
    time: '10 min ago',
    severity: 'High',
    description:
      'Continuous heavy rainfall causing water accumulation on streets. Multiple intersections affected.',
    reporter: 'John Smith',
    coordinates: '40.7128, -74.0060',
    images: 2,
  },
  {
    id: 2,
    location: 'North Park',
    type: 'Strong Winds',
    status: 'Approved',
    time: '25 min ago',
    severity: 'Medium',
    description:
      'Strong wind gusts observed, some tree branches falling. Residents advised to stay indoors.',
    reporter: 'Sarah Johnson',
    coordinates: '40.7580, -73.9855',
    images: 1,
  },
  {
    id: 3,
    location: 'East Harbor',
    type: 'Flooding',
    status: 'Pending',
    time: '1 hour ago',
    severity: 'High',
    description:
      'Significant flooding in low-lying areas. Water levels rising rapidly near the harbor.',
    reporter: 'Mike Chen',
    coordinates: '40.7489, -73.9680',
    images: 3,
  },
  {
    id: 4,
    location: 'West Valley',
    type: 'Hail Storm',
    status: 'Approved',
    time: '2 hours ago',
    severity: 'Medium',
    description:
      'Hail storm reported with medium-sized hailstones. Some vehicle damage reported.',
    reporter: 'Emily Davis',
    coordinates: '40.7282, -74.0776',
    images: 2,
  },
];

const activeAlerts = [
  {
    id: 1,
    type: 'Thunderstorm Warning',
    area: 'Downtown & Suburbs',
    severity: 'High',
    time: '30 min ago',
  },
  {
    id: 2,
    type: 'Flood Advisory',
    area: 'East Harbor',
    severity: 'Medium',
    time: '1 hour ago',
  },
  {
    id: 3,
    type: 'Wind Alert',
    area: 'North Region',
    severity: 'Low',
    time: '3 hours ago',
  },
];

export default function Dashboard() {
  const [selectedReport, setSelectedReport] = useState<
    (typeof recentReports)[0] | null
  >(null);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-slate-900">Dashboard Overview</h2>
        <p className="text-slate-500 text-sm">
          Real-time weather monitoring and system analytics
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {summaryCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.title} className="p-4">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-0">
                <CardTitle className="text-slate-600 text-sm">
                  {card.title}
                </CardTitle>
                <div className={`${card.bgColor} p-1.5 rounded-lg`}>
                  <Icon className={`h-4 w-4 ${card.color}`} />
                </div>
              </CardHeader>
              <CardContent className="p-0 pt-2">
                <div className="text-slate-900 text-2xl">{card.value}</div>
                <p className="text-slate-500 text-xs">{card.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Reports */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Recent User Reports</CardTitle>
            <CardDescription className="text-xs">
              Latest submissions from mobile app
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {recentReports.map((report) => (
                <div
                  key={report.id}
                  className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors"
                  onClick={() => setSelectedReport(report)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="text-slate-900 text-sm">
                      {report.location}
                    </div>
                    <div className="text-slate-500 text-xs">{report.type}</div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge
                      variant={
                        report.status === 'Approved' ? 'default' : 'secondary'
                      }
                      className="text-xs"
                    >
                      {report.status}
                    </Badge>
                    <span className="text-slate-400 text-xs hidden sm:inline">
                      {report.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Active Alerts */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Active Disaster Alerts</CardTitle>
            <CardDescription className="text-xs">
              Currently broadcasted warnings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {activeAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="p-2.5 border border-slate-200 rounded-lg"
                >
                  <div className="flex items-start justify-between mb-1">
                    <div className="text-slate-900 text-sm">{alert.type}</div>
                    <Badge
                      variant={
                        alert.severity === 'High'
                          ? 'destructive'
                          : alert.severity === 'Medium'
                          ? 'default'
                          : 'secondary'
                      }
                      className="text-xs"
                    >
                      {alert.severity}
                    </Badge>
                  </div>
                  <div className="text-slate-500 text-xs">📍 {alert.area}</div>
                  <div className="text-slate-400 text-xs">{alert.time}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Report Details Dialog */}
      <Dialog
        open={!!selectedReport}
        onOpenChange={(open: boolean) => !open && setSelectedReport(null)}
      >
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Report Details</DialogTitle>
            <DialogDescription>
              Submitted {selectedReport?.time}
            </DialogDescription>
          </DialogHeader>
          {selectedReport && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-slate-500 mb-1">Location</div>
                  <div className="text-sm text-slate-900">
                    {selectedReport.location}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 mb-1">Type</div>
                  <div className="text-sm text-slate-900">
                    {selectedReport.type}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 mb-1">Status</div>
                  <Badge
                    variant={
                      selectedReport.status === 'Approved'
                        ? 'default'
                        : 'secondary'
                    }
                    className="text-xs"
                  >
                    {selectedReport.status}
                  </Badge>
                </div>
                <div>
                  <div className="text-xs text-slate-500 mb-1">Severity</div>
                  <Badge
                    variant={
                      selectedReport.severity === 'High'
                        ? 'destructive'
                        : 'default'
                    }
                    className="text-xs"
                  >
                    {selectedReport.severity}
                  </Badge>
                </div>
              </div>

              <div>
                <div className="text-xs text-slate-500 mb-1">Reporter</div>
                <div className="text-sm text-slate-900">
                  {selectedReport.reporter}
                </div>
              </div>

              <div>
                <div className="text-xs text-slate-500 mb-1">Coordinates</div>
                <div className="text-sm text-slate-900 font-mono">
                  {selectedReport.coordinates}
                </div>
              </div>

              <div>
                <div className="text-xs text-slate-500 mb-1">Description</div>
                <div className="text-sm text-slate-900 leading-relaxed">
                  {selectedReport.description}
                </div>
              </div>

              <div>
                <div className="text-xs text-slate-500 mb-1">Attachments</div>
                <div className="text-sm text-slate-900">
                  {selectedReport.images} image(s) attached
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
