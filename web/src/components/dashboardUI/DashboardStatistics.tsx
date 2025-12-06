'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import {
  Radio,
  AlertTriangle,
  FileText,
  CheckCircle,
  Clock,
  XCircle,
  Wrench,
  Shield,
  Zap,
  ChevronRight,
} from 'lucide-react';
import type { DashboardSummaryResponse } from '@/services/api/dashboard.service';

interface DashboardStatisticsProps {
  data: DashboardSummaryResponse | undefined;
  isLoading: boolean;
}

// Progress Ring Component (SVG Donut Chart)
interface ProgressRingProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  color: string;
  bgColor?: string;
}

function ProgressRing({
  percentage,
  size = 80,
  strokeWidth = 8,
  color,
  bgColor = '#e2e8f0',
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={bgColor}
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-700 ease-out"
        />
      </svg>
      {/* Percentage text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-lg font-bold text-slate-700">{percentage}%</span>
      </div>
    </div>
  );
}

// Grouped Card Skeleton
function GroupedCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <div className="h-2 bg-slate-200 animate-pulse" />
      <CardContent className="p-5">
        <div className="animate-pulse">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 bg-slate-200 rounded-lg" />
            <div className="h-5 w-32 bg-slate-200 rounded" />
          </div>
          <div className="flex items-center gap-6">
            <div className="h-20 w-20 bg-slate-200 rounded-full" />
            <div className="flex-1 space-y-3">
              <div className="h-4 w-full bg-slate-200 rounded" />
              <div className="h-4 w-3/4 bg-slate-200 rounded" />
              <div className="h-4 w-1/2 bg-slate-200 rounded" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Stat Item inside Grouped Card
interface StatItemProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}

function StatItem({ label, value, icon, color }: StatItemProps) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <div className="flex items-center gap-2">
        <span className={color}>{icon}</span>
        <span className="text-sm text-slate-600">{label}</span>
      </div>
      <span className={`font-semibold ${color}`}>{value}</span>
    </div>
  );
}

// Grouped Card Component
interface GroupedCardProps {
  title: string;
  icon: React.ReactNode;
  iconBg: string;
  accentColor: string;
  ringColor: string;
  percentage: number;
  mainValue: number;
  totalValue: number;
  href: string;
  stats: { label: string; value: number; icon: React.ReactNode; color: string }[];
}

function GroupedCard({
  title,
  icon,
  iconBg,
  accentColor,
  ringColor,
  percentage,
  mainValue,
  totalValue,
  href,
  stats,
}: GroupedCardProps) {
  return (
    <Link href={href} className="block">
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group cursor-pointer h-full">
        {/* Accent top bar */}
        <div className={`h-1.5 ${accentColor}`} />

        <CardContent className="p-5">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-xl ${iconBg}`}>{icon}</div>
              <h3 className="font-semibold text-slate-800">{title}</h3>
            </div>
            <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-1 transition-all" />
          </div>

          {/* Content: Ring + Stats */}
          <div className="flex items-start gap-5">
            {/* Progress Ring */}
            <div className="flex-shrink-0">
              <ProgressRing percentage={percentage} color={ringColor} size={90} strokeWidth={10} />
              <p className="text-center text-xs text-slate-500 mt-2">
                {mainValue}/{totalValue}
              </p>
            </div>

            {/* Stats List */}
            <div className="flex-1 min-w-0">
              {stats.map((stat, idx) => (
                <StatItem
                  key={idx}
                  label={stat.label}
                  value={stat.value}
                  icon={stat.icon}
                  color={stat.color}
                />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export default function DashboardStatistics({ data, isLoading }: DashboardStatisticsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <GroupedCardSkeleton />
        <GroupedCardSkeleton />
        <GroupedCardSkeleton />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
        <p className="font-medium">Không thể tải dữ liệu bảng điều khiển</p>
        <p className="text-sm mt-1">Vui lòng kiểm tra kết nối và thử lại.</p>
      </div>
    );
  }

  const { stations, alerts, incidents } = data;

  // Calculate percentages
  const stationActivePercent =
    stations.total > 0 ? Math.round((stations.active / stations.total) * 100) : 0;
  const alertActivePercent =
    alerts.total > 0 ? Math.round((alerts.activeCount / alerts.total) * 100) : 0;
  const incidentPendingPercent =
    incidents.total > 0 ? Math.round((incidents.pending / incidents.total) * 100) : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Stations Card */}
      <GroupedCard
        title="Trạm quan trắc"
        icon={<Radio className="h-5 w-5 text-blue-600" />}
        iconBg="bg-blue-100"
        accentColor="bg-gradient-to-r from-blue-500 to-blue-600"
        ringColor="#3b82f6"
        percentage={stationActivePercent}
        mainValue={stations.active}
        totalValue={stations.total}
        href="/stations"
        stats={[
          {
            label: 'Hoạt động',
            value: stations.active,
            icon: <CheckCircle className="h-4 w-4" />,
            color: 'text-green-600',
          },
          {
            label: 'Không hoạt động',
            value: stations.inactive,
            icon: <XCircle className="h-4 w-4" />,
            color: 'text-red-500',
          },
          {
            label: 'Bảo trì',
            value: stations.maintenance,
            icon: <Wrench className="h-4 w-4" />,
            color: 'text-yellow-600',
          },
        ]}
      />

      {/* Alerts Card */}
      <GroupedCard
        title="Cảnh báo"
        icon={<AlertTriangle className="h-5 w-5 text-orange-600" />}
        iconBg="bg-orange-100"
        accentColor="bg-gradient-to-r from-orange-500 to-orange-600"
        ringColor="#f97316"
        percentage={alertActivePercent}
        mainValue={alerts.activeCount}
        totalValue={alerts.total}
        href="/alerts"
        stats={[
          {
            label: 'Đang hoạt động',
            value: alerts.activeCount,
            icon: <AlertTriangle className="h-4 w-4" />,
            color: 'text-orange-600',
          },
          {
            label: 'Ưu tiên cao',
            value: alerts.byLevel.HIGH,
            icon: <Shield className="h-4 w-4" />,
            color: 'text-red-600',
          },
          {
            label: 'Nghiêm trọng',
            value: alerts.byLevel.CRITICAL,
            icon: <Zap className="h-4 w-4" />,
            color: 'text-purple-600',
          },
        ]}
      />

      {/* Incidents Card */}
      <GroupedCard
        title="Sự cố"
        icon={<FileText className="h-5 w-5 text-violet-600" />}
        iconBg="bg-violet-100"
        accentColor="bg-gradient-to-r from-violet-500 to-violet-600"
        ringColor="#8b5cf6"
        percentage={incidentPendingPercent}
        mainValue={incidents.pending}
        totalValue={incidents.total}
        href="/incidents"
        stats={[
          {
            label: 'Chờ xử lý',
            value: incidents.pending,
            icon: <Clock className="h-4 w-4" />,
            color: 'text-amber-600',
          },
          {
            label: 'Đã xác minh',
            value: incidents.verified,
            icon: <CheckCircle className="h-4 w-4" />,
            color: 'text-green-600',
          },
          {
            label: 'Đã giải quyết',
            value: incidents.resolved,
            icon: <CheckCircle className="h-4 w-4" />,
            color: 'text-violet-600',
          },
        ]}
      />
    </div>
  );
}
