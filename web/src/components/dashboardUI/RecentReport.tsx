import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { recentReports } from '@/services/data/dashboard.api';
interface RecentReportsProps {
  reports: typeof recentReports;
  setSelectedReport: (report: (typeof recentReports)[0]) => void;
}

export default function RecentReports({ reports, setSelectedReport }: RecentReportsProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Recent User Reports</CardTitle>
        <CardDescription className="text-xs">Latest submissions from mobile app</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {reports.map((report) => (
            <div
              key={report.id}
              className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors"
              onClick={() => setSelectedReport(report)}
            >
              <div className="flex-1 min-w-0">
                <div className="text-slate-900 text-sm">{report.location}</div>
                <div className="text-slate-500 text-xs">{report.type}</div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Badge
                  variant={report.status === 'Approved' ? 'default' : 'secondary'}
                  className="text-xs"
                >
                  {report.status}
                </Badge>
                <span className="text-slate-400 text-xs hidden sm:inline">{report.time}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
