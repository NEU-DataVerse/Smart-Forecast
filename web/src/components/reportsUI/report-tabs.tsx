import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { IIncident } from '@/../../shared/src/types/incident.types';
import { IncidentStatus } from '@/../../shared/src/constants';
import { ReportCard } from './report-card';

interface ReportTabsProps {
  reports: IIncident[];
  onSelectReport: (report: IIncident) => void;
}

export function ReportTabs({ reports, onSelectReport }: ReportTabsProps) {
  const filterReports = (status?: IncidentStatus) => {
    if (!status) return reports;
    return reports.filter((r) => r.status === status);
  };

  return (
    <Tabs defaultValue="all">
      <TabsList>
        <TabsTrigger value="all">Tất cả ({reports.length})</TabsTrigger>
        <TabsTrigger value="pending">
          Chờ xử lý ({filterReports(IncidentStatus.PENDING).length})
        </TabsTrigger>
        <TabsTrigger value="verified">
          Đã xác nhận ({filterReports(IncidentStatus.VERIFIED).length})
        </TabsTrigger>
        <TabsTrigger value="rejected">
          Đã từ chối ({filterReports(IncidentStatus.REJECTED).length})
        </TabsTrigger>
      </TabsList>

      <TabsContent value="all" className="space-y-4 mt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reports.map((report) => (
            <ReportCard key={report.id} report={report} onClick={onSelectReport} />
          ))}
        </div>
      </TabsContent>

      <TabsContent value="pending" className="space-y-4 mt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filterReports(IncidentStatus.PENDING).map((report) => (
            <ReportCard key={report.id} report={report} onClick={onSelectReport} />
          ))}
        </div>
      </TabsContent>

      <TabsContent value="verified" className="space-y-4 mt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filterReports(IncidentStatus.VERIFIED).map((report) => (
            <ReportCard key={report.id} report={report} onClick={onSelectReport} />
          ))}
        </div>
      </TabsContent>

      <TabsContent value="rejected" className="space-y-4 mt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filterReports(IncidentStatus.REJECTED).map((report) => (
            <ReportCard key={report.id} report={report} onClick={onSelectReport} />
          ))}
        </div>
      </TabsContent>
    </Tabs>
  );
}
