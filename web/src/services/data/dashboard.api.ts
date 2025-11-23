import { AlertTriangle, FileText } from 'lucide-react';

export const summaryCards = [
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

export const recentReports = [
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
    description: 'Hail storm reported with medium-sized hailstones. Some vehicle damage reported.',
    reporter: 'Emily Davis',
    coordinates: '40.7282, -74.0776',
    images: 2,
  },
];

export const activeAlerts = [
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

// Thay thế các mảng này bằng các hàm fetch data:
// export async function fetchDashboardData() {
//   const reports = await fetch('/api/reports');
//   const alerts = await fetch('/api/alerts');
//   return { reports, alerts, summary: processSummary(reports, alerts) };
// }
