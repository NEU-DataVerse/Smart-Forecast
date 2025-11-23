import { IAlert } from '@/../../shared/src/types/alert.types';
import { AlertLevel, AlertType } from '@/../../shared/src/constants';

const alertHistory: IAlert[] = [
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    level: AlertLevel.CRITICAL,
    type: AlertType.DISASTER,
    title: 'Cảnh báo ngập lụt khẩn cấp!',
    message:
      'Khu vực quận Hoàn Kiếm dự kiến ngập sâu 0.5-1m do mưa lớn kéo dài. Người dân cần di chuyển đến nơi an toàn và theo dõi thông tin từ chính quyền địa phương.',
    area: {
      type: 'Polygon',
      coordinates: [
        [
          [105.8544, 21.0285],
          [105.8544, 21.0385],
          [105.8644, 21.0385],
          [105.8644, 21.0285],
          [105.8544, 21.0285],
        ],
      ],
    },
    sentAt: new Date('2025-11-21T08:30:00Z'),
    expiresAt: new Date('2025-11-21T20:00:00Z'),
    sentCount: 1500,
    createdBy: 'admin-001',
    createdAt: new Date('2025-11-21T08:25:00Z'),
    updatedAt: new Date('2025-11-21T08:25:00Z'),
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440002',
    level: AlertLevel.HIGH,
    type: AlertType.AIR_QUALITY,
    title: 'Cảnh báo ô nhiễm không khí nghiêm trọng',
    message:
      'Chỉ số AQI hiện tại đạt 185 (Mức nguy hại). Khuyến cáo người dân hạn chế ra ngoài, đeo khẩu trang khi di chuyển và tránh hoạt động ngoài trời.',
    area: {
      type: 'Polygon',
      coordinates: [
        [
          [105.8, 21.0],
          [105.8, 21.05],
          [105.9, 21.05],
          [105.9, 21.0],
          [105.8, 21.0],
        ],
      ],
    },
    sentAt: new Date('2025-11-21T06:00:00Z'),
    expiresAt: new Date('2025-11-21T18:00:00Z'),
    sentCount: 3200,
    createdBy: 'admin-002',
    createdAt: new Date('2025-11-21T05:55:00Z'),
    updatedAt: new Date('2025-11-21T05:55:00Z'),
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440003',
    level: AlertLevel.MEDIUM,
    type: AlertType.WEATHER,
    title: 'Cảnh báo mưa dông và gió giật mạnh',
    message:
      'Trong 3-6 giờ tới, khu vực Hà Nội có mưa dông kèm theo gió giật cấp 7-8. Người dân cần cẩn trọng khi tham gia giao thông và tránh xa cây xanh, biển quảng cáo.',
    area: {
      type: 'Polygon',
      coordinates: [
        [
          [105.75, 20.95],
          [105.75, 21.1],
          [105.95, 21.1],
          [105.95, 20.95],
          [105.75, 20.95],
        ],
      ],
    },
    sentAt: new Date('2025-11-20T14:00:00Z'),
    expiresAt: new Date('2025-11-20T20:00:00Z'),
    sentCount: 5600,
    createdBy: 'admin-001',
    createdAt: new Date('2025-11-20T13:55:00Z'),
    updatedAt: new Date('2025-11-20T13:55:00Z'),
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440004',
    level: AlertLevel.HIGH,
    type: AlertType.DISASTER,
    title: 'Cảnh báo sạt lở đất khu vực miền núi',
    message:
      'Do mưa lớn kéo dài, các khu vực Ba Vì, Sóc Sơn có nguy cơ sạt lở đất cao. Người dân cần theo dõi chặt chẽ và sơ tán nếu có dấu hiệu bất thường.',
    area: {
      type: 'Polygon',
      coordinates: [
        [
          [105.4, 21.15],
          [105.4, 21.25],
          [105.55, 21.25],
          [105.55, 21.15],
          [105.4, 21.15],
        ],
      ],
    },
    sentAt: new Date('2025-11-20T09:00:00Z'),
    expiresAt: new Date('2025-11-21T18:00:00Z'),
    sentCount: 800,
    createdBy: 'admin-003',
    createdAt: new Date('2025-11-20T08:50:00Z'),
    updatedAt: new Date('2025-11-20T08:50:00Z'),
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440005',
    level: AlertLevel.LOW,
    type: AlertType.ENVIRONMENTAL,
    title: 'Thông báo chất lượng không khí khá tốt',
    message:
      'Chỉ số AQI hiện tại ở mức 45 (Tốt). Đây là thời điểm phù hợp để tham gia các hoạt động ngoài trời. Hãy tận hưởng không khí trong lành!',
    sentAt: new Date('2025-11-19T07:00:00Z'),
    expiresAt: new Date('2025-11-19T19:00:00Z'),
    sentCount: 4500,
    createdBy: 'admin-002',
    createdAt: new Date('2025-11-19T06:55:00Z'),
    updatedAt: new Date('2025-11-19T06:55:00Z'),
  },
];

/**
 * Check if an alert is currently active based on expiration time
 */
function isAlertActive(alert: IAlert): boolean {
  const now = new Date();

  // If no expiration date, consider it active
  if (!alert.expiresAt) {
    return true;
  }

  return now < new Date(alert.expiresAt);
}

/**
 * Get time remaining until alert expires
 * Returns a human-readable string like "2 hours 30 mins" or "Expired"
 */
function getTimeUntilExpiration(expiresAt: Date | undefined): string {
  if (!expiresAt) {
    return 'No expiration';
  }

  const now = new Date();
  const expirationDate = new Date(expiresAt);
  const diffMs = expirationDate.getTime() - now.getTime();

  // If expired
  if (diffMs <= 0) {
    return 'Expired';
  }

  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 0) {
    const remainingHours = diffHours % 24;
    return `${diffDays}d ${remainingHours}h`;
  } else if (diffHours > 0) {
    const remainingMins = diffMins % 60;
    return `${diffHours}h ${remainingMins}m`;
  } else {
    return `${diffMins}m`;
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
 * Get active alerts only
 */
function getActiveAlerts(): IAlert[] {
  return alertHistory.filter(isAlertActive);
}

export { alertHistory, isAlertActive, getTimeUntilExpiration, formatAlertDate, getActiveAlerts };
