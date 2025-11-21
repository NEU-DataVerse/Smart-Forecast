import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { MapPin, Image as ImageIcon, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/text-area';

interface Report {
  id: number;
  userName: string;
  type: string;
  description: string;
  location: string;
  coordinates: string;
  images: number;
  status: 'Pending' | 'Approved' | 'Rejected';
  timestamp: string;
  severity: 'High' | 'Medium' | 'Low';
}

const mockReports: Report[] = [
  {
    id: 1,
    userName: 'John Smith',
    type: 'Flooding',
    description:
      'Severe flooding on Main Street. Water level approximately 2 feet deep. Several cars stranded.',
    location: 'Downtown District, Main St & 5th Ave',
    coordinates: '37.7749°N, 122.4194°W',
    images: 3,
    status: 'Pending',
    timestamp: '10 min ago',
    severity: 'High',
  },
  {
    id: 2,
    userName: 'Sarah Johnson',
    type: 'Strong Winds',
    description: 'Tree fell on power lines. Power outage affecting multiple blocks.',
    location: 'North Park, Oak Street',
    coordinates: '37.7849°N, 122.4094°W',
    images: 2,
    status: 'Pending',
    timestamp: '25 min ago',
    severity: 'High',
  },
  {
    id: 3,
    userName: 'Mike Chen',
    type: 'Hail Storm',
    description: 'Large hail causing damage to vehicles and property.',
    location: 'West Valley Shopping Center',
    coordinates: '37.7649°N, 122.4294°W',
    images: 4,
    status: 'Approved',
    timestamp: '2 hours ago',
    severity: 'Medium',
  },
  {
    id: 4,
    userName: 'Emily Davis',
    type: 'Heavy Rain',
    description: 'Moderate rainfall, some puddles forming.',
    location: 'East Harbor',
    coordinates: '37.7949°N, 122.3994°W',
    images: 1,
    status: 'Rejected',
    timestamp: '3 hours ago',
    severity: 'Low',
  },
];

export function Reports() {
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [reports, setReports] = useState(mockReports);
  const [showCreateAlert, setShowCreateAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const handleApprove = (reportId: number) => {
    setReports(reports.map((r) => (r.id === reportId ? { ...r, status: 'Approved' as const } : r)));
    setSelectedReport(null);
  };

  const handleReject = (reportId: number) => {
    setReports(reports.map((r) => (r.id === reportId ? { ...r, status: 'Rejected' as const } : r)));
    setSelectedReport(null);
  };

  const handleCreateAlert = () => {
    console.log('Creating alert:', alertMessage);
    setShowCreateAlert(false);
    setAlertMessage('');
    setSelectedReport(null);
  };

  const filterReports = (status?: string) => {
    if (!status) return reports;
    return reports.filter((r) => r.status === status);
  };

  const ReportCard = ({ report }: { report: Report }) => (
    <Card
      className="cursor-pointer hover:border-blue-300 transition-colors"
      onClick={() => setSelectedReport(report)}
    >
      <CardContent className="pt-6">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-slate-900">{report.type}</h3>
            <p className="text-slate-500">{report.userName}</p>
          </div>
          <Badge
            variant={
              report.status === 'Approved'
                ? 'default'
                : report.status === 'Rejected'
                  ? 'destructive'
                  : 'secondary'
            }
          >
            {report.status}
          </Badge>
        </div>

        <p className="text-slate-600 mb-3 line-clamp-2">{report.description}</p>

        <div className="flex items-center gap-4 text-slate-500 mb-2">
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            <span>{report.location}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-slate-500">
            <ImageIcon className="h-4 w-4" />
            <span>{report.images} images</span>
          </div>
          <span className="text-slate-400">{report.timestamp}</span>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-slate-900">User Reports</h2>
        <p className="text-slate-500">Manage submissions from the mobile app</p>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Reports ({reports.length})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({filterReports('Pending').length})</TabsTrigger>
          <TabsTrigger value="approved">Approved ({filterReports('Approved').length})</TabsTrigger>
          <TabsTrigger value="rejected">Rejected ({filterReports('Rejected').length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reports.map((report) => (
              <ReportCard key={report.id} report={report} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="pending" className="space-y-4 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filterReports('Pending').map((report) => (
              <ReportCard key={report.id} report={report} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="approved" className="space-y-4 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filterReports('Approved').map((report) => (
              <ReportCard key={report.id} report={report} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="rejected" className="space-y-4 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filterReports('Rejected').map((report) => (
              <ReportCard key={report.id} report={report} />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Report Details Dialog */}
      <Dialog open={!!selectedReport} onOpenChange={() => setSelectedReport(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Report Details</DialogTitle>
            <DialogDescription>Review and take action on this report</DialogDescription>
          </DialogHeader>

          {selectedReport && (
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-slate-900">{selectedReport.type}</h3>
                  <p className="text-slate-500">Reported by {selectedReport.userName}</p>
                </div>
                <Badge
                  variant={
                    selectedReport.severity === 'High'
                      ? 'destructive'
                      : selectedReport.severity === 'Medium'
                        ? 'default'
                        : 'secondary'
                  }
                >
                  {selectedReport.severity} Severity
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-slate-500">Status</p>
                  <Badge className="mt-1">{selectedReport.status}</Badge>
                </div>
                <div>
                  <p className="text-slate-500">Submitted</p>
                  <p className="text-slate-900 mt-1">{selectedReport.timestamp}</p>
                </div>
              </div>

              <div>
                <p className="text-slate-500 mb-2">Description</p>
                <p className="text-slate-900">{selectedReport.description}</p>
              </div>

              <div>
                <p className="text-slate-500 mb-2">Location</p>
                <div className="flex items-start gap-2">
                  <MapPin className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div>
                    <p className="text-slate-900">{selectedReport.location}</p>
                    <p className="text-slate-600">{selectedReport.coordinates}</p>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-slate-500 mb-2">Images ({selectedReport.images})</p>
                <div className="grid grid-cols-3 gap-2">
                  {Array.from({ length: selectedReport.images }).map((_, i) => (
                    <div
                      key={i}
                      className="aspect-square bg-slate-100 rounded-lg flex items-center justify-center"
                    >
                      <ImageIcon className="h-8 w-8 text-slate-400" />
                    </div>
                  ))}
                </div>
              </div>

              {selectedReport.status === 'Pending' && (
                <div className="flex gap-2 pt-4">
                  <Button className="flex-1" onClick={() => handleApprove(selectedReport.id)}>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve Report
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowCreateAlert(true)}
                  >
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Create Alert
                  </Button>
                  <Button variant="destructive" onClick={() => handleReject(selectedReport.id)}>
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Create Alert Dialog */}
      <Dialog open={showCreateAlert} onOpenChange={setShowCreateAlert}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Alert from Report</DialogTitle>
            <DialogDescription>
              Send a disaster alert based on this verified report
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <p className="text-slate-500">Incident Type</p>
              <p className="text-slate-900">{selectedReport?.type}</p>
            </div>

            <div>
              <p className="text-slate-500 mb-2">Alert Message</p>
              <Textarea
                placeholder="Enter alert message for nearby users..."
                value={alertMessage}
                onChange={(e) => setAlertMessage(e.target.value)}
                rows={4}
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleCreateAlert} className="flex-1">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Create & Send Alert
              </Button>
              <Button variant="outline" onClick={() => setShowCreateAlert(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
