/**
 * Alert Seed Data
 *
 * Contains sample environmental alerts for development and testing.
 */

import { AlertLevel, AlertType } from '@smart-forecast/shared';
import { ADMIN_USER_ID } from './users.seed';

export interface AlertSeedData {
  level: AlertLevel;
  type: AlertType;
  title: string;
  message: string;
  advice: string | null;
  area: {
    type: 'Polygon';
    coordinates: number[][][];
  } | null;
  sentAt: Date;
  expiresAt: Date | null;
  sentCount: number;
  isAutomatic: boolean;
  sourceData: Record<string, unknown> | null;
  stationId: string | null;
  createdBy: string | null;
}

// Helper to create dates relative to now
function daysAgo(days: number): Date {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
}

function hoursFromNow(hours: number): Date {
  const date = new Date();
  date.setHours(date.getHours() + hours);
  return date;
}

// Polygon covering Hanoi center area
const HANOI_CENTER_POLYGON = {
  type: 'Polygon' as const,
  coordinates: [
    [
      [105.78, 21.0],
      [105.78, 21.06],
      [105.88, 21.06],
      [105.88, 21.0],
      [105.78, 21.0],
    ],
  ],
};

// Polygon covering Hanoi west area (Hà Đông, Cầu Giấy)
const HANOI_WEST_POLYGON = {
  type: 'Polygon' as const,
  coordinates: [
    [
      [105.74, 20.94],
      [105.74, 21.05],
      [105.82, 21.05],
      [105.82, 20.94],
      [105.74, 20.94],
    ],
  ],
};

export const ALERT_SEED_DATA: AlertSeedData[] = [
  // Critical weather alerts (Manual by Admin)
  {
    level: AlertLevel.CRITICAL,
    type: AlertType.WEATHER,
    title: 'Cảnh báo bão số 5',
    message:
      'Bão số 5 đang tiến vào đồng bằng Bắc Bộ. Dự kiến ảnh hưởng đến Hà Nội từ tối nay. Người dân hạn chế ra đường, gia cố nhà cửa.',
    advice:
      'Ở trong nhà, gia cố cửa sổ, chuẩn bị đèn pin và thực phẩm dự trữ. Theo dõi thông tin từ cơ quan chức năng.',
    area: null, // City-wide
    sentAt: daysAgo(2),
    expiresAt: daysAgo(1),
    sentCount: 15420,
    isAutomatic: false,
    sourceData: null,
    stationId: null,
    createdBy: ADMIN_USER_ID,
  },
  {
    level: AlertLevel.CRITICAL,
    type: AlertType.WEATHER,
    title: 'Cảnh báo mưa lớn đặc biệt',
    message:
      'Mưa rất to với lượng 150-200mm trong 6 giờ tới. Nguy cơ ngập úng cao ở các vùng trũng. Người dân không nên di chuyển nếu không cần thiết.',
    advice:
      'Không di chuyển khi ngập nước, tránh xa cột điện và vùng trũng. Liên hệ cứu hộ nếu cần: 114.',
    area: HANOI_CENTER_POLYGON,
    sentAt: hoursFromNow(-6),
    expiresAt: hoursFromNow(6),
    sentCount: 8750,
    isAutomatic: false,
    sourceData: null,
    stationId: null,
    createdBy: ADMIN_USER_ID,
  },

  // High priority air quality alerts (Automatic)
  {
    level: AlertLevel.HIGH,
    type: AlertType.AIR_QUALITY,
    title: '⚠️ Cảnh báo Chất lượng không khí - Mức cao',
    message:
      'Chỉ số AQI đã đạt mức 175, vượt ngưỡng cho phép (150). Vui lòng thực hiện các biện pháp phòng ngừa cần thiết.',
    advice:
      'Hạn chế hoạt động ngoài trời, đeo khẩu trang N95 khi ra ngoài. Người có bệnh hô hấp nên ở trong nhà.',
    area: HANOI_WEST_POLYGON,
    sentAt: daysAgo(1),
    expiresAt: hoursFromNow(12),
    sentCount: 4230,
    isAutomatic: true,
    sourceData: {
      metric: 'aqi',
      value: 175,
      threshold: 150,
      operator: 'GT',
      timestamp: daysAgo(1).toISOString(),
    },
    stationId: 'station-cau-giay-001',
    createdBy: null,
  },
  {
    level: AlertLevel.HIGH,
    type: AlertType.AIR_QUALITY,
    title: 'Cảnh báo khói bụi từ đốt rơm rạ',
    message:
      'Nồng độ PM2.5 tăng cao do đốt rơm rạ ở ngoại thành. AQI dự báo duy trì ở mức Không tốt cho nhóm nhạy cảm trong 24-48 giờ tới.',
    advice:
      'Đóng cửa sổ, sử dụng máy lọc không khí nếu có. Hạn chế ra ngoài vào sáng sớm và chiều tối.',
    area: null,
    sentAt: daysAgo(3),
    expiresAt: daysAgo(1),
    sentCount: 12100,
    isAutomatic: false,
    sourceData: null,
    stationId: null,
    createdBy: ADMIN_USER_ID,
  },

  // Medium priority alerts
  {
    level: AlertLevel.MEDIUM,
    type: AlertType.WEATHER,
    title: 'Dự báo mưa dông',
    message:
      'Chiều và tối nay có khả năng mưa rào và dông rải rác, cục bộ có mưa vừa. Đề phòng sét và gió giật mạnh trong cơn dông.',
    advice: 'Mang theo áo mưa khi ra ngoài, tránh trú dưới cây to khi có dông.',
    area: null,
    sentAt: hoursFromNow(-3),
    expiresAt: hoursFromNow(12),
    sentCount: 3580,
    isAutomatic: false,
    sourceData: null,
    stationId: null,
    createdBy: ADMIN_USER_ID,
  },
  {
    level: AlertLevel.MEDIUM,
    type: AlertType.ENVIRONMENTAL,
    title: '⚠️ Cảnh báo Thời tiết - Mức trung bình',
    message:
      'Nhiệt độ đã đạt mức 38.5°C, vượt ngưỡng cho phép (37). Vui lòng thực hiện các biện pháp phòng ngừa cần thiết.',
    advice:
      'Hạn chế hoạt động ngoài trời từ 11h-15h, uống đủ nước, mặc quần áo thoáng mát.',
    area: null,
    sentAt: daysAgo(5),
    expiresAt: daysAgo(2),
    sentCount: 9870,
    isAutomatic: true,
    sourceData: {
      metric: 'temperature',
      value: 38.5,
      threshold: 37,
      operator: 'GT',
      timestamp: daysAgo(5).toISOString(),
    },
    stationId: 'station-hoan-kiem-001',
    createdBy: null,
  },
  {
    level: AlertLevel.MEDIUM,
    type: AlertType.DISASTER,
    title: 'Cảnh báo ngập úng cục bộ',
    message:
      'Do mưa lớn kéo dài, một số tuyến phố vùng trũng có thể xảy ra ngập úng. Theo dõi thông tin từ cơ quan chức năng.',
    advice:
      'Tránh các tuyến đường ngập, không lội qua vùng nước sâu. Cập nhật tình hình giao thông trước khi di chuyển.',
    area: HANOI_CENTER_POLYGON,
    sentAt: hoursFromNow(-12),
    expiresAt: hoursFromNow(24),
    sentCount: 5620,
    isAutomatic: false,
    sourceData: null,
    stationId: null,
    createdBy: ADMIN_USER_ID,
  },

  // Low priority alerts
  {
    level: AlertLevel.LOW,
    type: AlertType.WEATHER,
    title: 'Dự báo thời tiết tuần',
    message:
      'Tuần tới thời tiết ổn định, ngày nắng, đêm mát. Nhiệt độ 24-32°C. Thích hợp cho các hoạt động ngoài trời.',
    advice: 'Thời tiết đẹp, phù hợp cho các hoạt động ngoài trời và du lịch.',
    area: null,
    sentAt: daysAgo(7),
    expiresAt: daysAgo(0),
    sentCount: 6540,
    isAutomatic: false,
    sourceData: null,
    stationId: null,
    createdBy: ADMIN_USER_ID,
  },
  {
    level: AlertLevel.LOW,
    type: AlertType.AIR_QUALITY,
    title: 'Chất lượng không khí cải thiện',
    message:
      'AQI đã giảm xuống mức Tốt (0-50) sau đợt mưa. Thời tiết thuận lợi cho các hoạt động ngoài trời.',
    advice: 'Chất lượng không khí tốt, an toàn cho mọi hoạt động ngoài trời.',
    area: null,
    sentAt: daysAgo(4),
    expiresAt: daysAgo(3),
    sentCount: 2340,
    isAutomatic: false,
    sourceData: null,
    stationId: null,
    createdBy: ADMIN_USER_ID,
  },
  {
    level: AlertLevel.LOW,
    type: AlertType.ENVIRONMENTAL,
    title: 'Thông báo bảo trì hệ thống quan trắc',
    message:
      'Hệ thống quan trắc tại trạm Hoàn Kiếm sẽ được bảo trì từ 2:00-4:00 sáng ngày mai. Dữ liệu có thể bị gián đoạn trong thời gian này.',
    advice: null,
    area: null,
    sentAt: daysAgo(1),
    expiresAt: hoursFromNow(-20),
    sentCount: 890,
    isAutomatic: false,
    sourceData: null,
    stationId: 'station-hoan-kiem-001',
    createdBy: ADMIN_USER_ID,
  },
];
