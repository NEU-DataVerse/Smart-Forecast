import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, MapPin, Clock, Users, Send, Timer } from 'lucide-react';
import {
  IAlert,
  AlertLevel,
  AlertLevelLabels,
  AlertLevelColors,
  AlertTypeLabels,
} from '@smart-forecast/shared';

interface AlertListItemProps {
  alert: IAlert;
  onView: (alert: IAlert) => void;
  onResend: (alert: IAlert) => void;
}

/**
 * Check if an alert is currently active based on expiration time
 */
function isAlertActive(alert: IAlert): boolean {
  if (!alert.expiresAt) return true;
  return new Date() < new Date(alert.expiresAt);
}

/**
 * Get time remaining until alert expires
 */
function getTimeUntilExpiration(expiresAt: Date | undefined): string {
  if (!expiresAt) return 'Không giới hạn';

  const now = new Date();
  const expirationDate = new Date(expiresAt);
  const diffMs = expirationDate.getTime() - now.getTime();

  if (diffMs <= 0) return 'Đã hết hạn';

  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 0) {
    const remainingHours = diffHours % 24;
    return `${diffDays} ngày ${remainingHours} giờ`;
  } else if (diffHours > 0) {
    const remainingMins = diffMins % 60;
    return `${diffHours} giờ ${remainingMins} phút`;
  } else {
    return `${diffMins} phút`;
  }
}

/**
 * Get formatted date string for display
 */
function formatAlertDate(date: Date): string {
  const d = new Date(date);
  return d.toLocaleString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Get badge variant based on alert level
 */
function getLevelBadgeStyle(level: AlertLevel): React.CSSProperties {
  return {
    backgroundColor: AlertLevelColors[level],
    color: level === AlertLevel.MEDIUM ? '#000' : '#fff',
  };
}

export function AlertListItem({ alert, onView, onResend }: AlertListItemProps) {
  const active = isAlertActive(alert);
  const levelColor = AlertLevelColors[alert.level];

  return (
    <Card className="overflow-hidden">
      {/* Color indicator bar */}
      <div className="h-1" style={{ backgroundColor: levelColor }} />
      <CardContent className="pt-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <h3 className="text-lg font-semibold text-slate-900">{alert.title}</h3>
              {active ? (
                <Badge variant="default" className="bg-green-500 hover:bg-green-600">
                  Đang hoạt động
                </Badge>
              ) : (
                <Badge variant="destructive">Đã hết hạn</Badge>
              )}
              <Badge style={getLevelBadgeStyle(alert.level)}>{AlertLevelLabels[alert.level]}</Badge>
              <Badge variant="outline">{AlertTypeLabels[alert.type]}</Badge>
              {alert.isAutomatic && (
                <Badge variant="outline" className="border-orange-300 text-orange-600">
                  Tự động
                </Badge>
              )}
            </div>
            <p className="text-slate-600 mb-3 line-clamp-2">{alert.message}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 shrink-0" />
                <span>{alert.area ? 'Có vùng ảnh hưởng' : 'Toàn bộ khu vực'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 shrink-0" />
                <span>{(alert.sentCount || 0).toLocaleString()} người nhận</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 shrink-0" />
                <span>{formatAlertDate(alert.sentAt)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Timer className="h-4 w-4 shrink-0" />
                <span
                  className={
                    !active
                      ? 'text-red-500'
                      : getTimeUntilExpiration(alert.expiresAt).includes('phút')
                        ? 'text-orange-500'
                        : ''
                  }
                >
                  {getTimeUntilExpiration(alert.expiresAt)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-2 ml-4 shrink-0">
            <Button variant="outline" size="sm" onClick={() => onView(alert)}>
              <Eye className="h-4 w-4 mr-2" />
              Chi tiết
            </Button>
            <Button size="sm" onClick={() => onResend(alert)}>
              <Send className="h-4 w-4 mr-2" />
              Gửi lại
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
