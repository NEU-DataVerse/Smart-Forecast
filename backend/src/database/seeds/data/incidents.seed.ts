/**
 * Incident Seed Data
 *
 * Contains sample incident reports for development and testing.
 */

import { IncidentType, IncidentStatus } from '@smart-forecast/shared';
import { ADMIN_USER_ID, TEST_USER_ID, DEMO_USER_ID } from './users.seed';

export interface IncidentSeedData {
  type: IncidentType;
  description: string;
  location: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };
  imageUrls: string[];
  status: IncidentStatus;
  reportedBy: string;
  verifiedBy: string | null;
  adminNotes: string | null;
}

export const INCIDENT_SEED_DATA: IncidentSeedData[] = [
  // Flooding incidents
  {
    type: IncidentType.FLOODING,
    description:
      'Ngập nặng tại ngã tư Trần Phú - Cầu Giấy, nước lên đến 50cm, xe máy không thể di chuyển',
    location: {
      type: 'Point',
      coordinates: [105.7883, 21.0313],
    },
    imageUrls: [
      'https://example.com/images/flood-1.jpg',
      'https://example.com/images/flood-2.jpg',
    ],
    status: IncidentStatus.VERIFIED,
    reportedBy: TEST_USER_ID,
    verifiedBy: ADMIN_USER_ID,
    adminNotes: 'Đã thông báo cho đội xử lý thoát nước',
  },
  {
    type: IncidentType.FLOODING,
    description:
      'Ngập nhẹ tại đường Giải Phóng, đoạn gần bến xe Giáp Bát, nước dâng khoảng 20cm',
    location: {
      type: 'Point',
      coordinates: [105.8418, 20.9925],
    },
    imageUrls: ['https://example.com/images/flood-3.jpg'],
    status: IncidentStatus.PENDING,
    reportedBy: DEMO_USER_ID,
    verifiedBy: null,
    adminNotes: null,
  },

  // Fallen tree incidents
  {
    type: IncidentType.FALLEN_TREE,
    description:
      'Cây xà cừ lớn đổ chắn ngang đường Hoàng Hoa Thám, gây ách tắc giao thông',
    location: {
      type: 'Point',
      coordinates: [105.8168, 21.0406],
    },
    imageUrls: [
      'https://example.com/images/tree-1.jpg',
      'https://example.com/images/tree-2.jpg',
    ],
    status: IncidentStatus.IN_PROGRESS,
    reportedBy: TEST_USER_ID,
    verifiedBy: ADMIN_USER_ID,
    adminNotes: 'Đội cây xanh đang tiến hành xử lý',
  },
  {
    type: IncidentType.FALLEN_TREE,
    description:
      'Nhánh cây gãy đè lên ô tô đỗ trên phố Trần Hưng Đạo sau trận mưa lớn',
    location: {
      type: 'Point',
      coordinates: [105.8515, 21.0188],
    },
    imageUrls: ['https://example.com/images/tree-3.jpg'],
    status: IncidentStatus.RESOLVED,
    reportedBy: DEMO_USER_ID,
    verifiedBy: ADMIN_USER_ID,
    adminNotes: 'Đã dọn dẹp xong, chủ xe đã liên hệ bảo hiểm',
  },

  // Air pollution incidents
  {
    type: IncidentType.AIR_POLLUTION,
    description:
      'Khói bụi dày đặc từ công trường xây dựng trên đường Phạm Văn Đồng, ảnh hưởng đến khu dân cư xung quanh',
    location: {
      type: 'Point',
      coordinates: [105.7845, 21.0485],
    },
    imageUrls: ['https://example.com/images/pollution-1.jpg'],
    status: IncidentStatus.VERIFIED,
    reportedBy: TEST_USER_ID,
    verifiedBy: ADMIN_USER_ID,
    adminNotes: 'Đã thông báo cho chủ đầu tư yêu cầu che chắn công trường',
  },
  {
    type: IncidentType.AIR_POLLUTION,
    description:
      'Mùi hôi thối bất thường từ cống thoát nước tại ngõ 68 Nguyễn Lương Bằng',
    location: {
      type: 'Point',
      coordinates: [105.8246, 21.0102],
    },
    imageUrls: [],
    status: IncidentStatus.PENDING,
    reportedBy: DEMO_USER_ID,
    verifiedBy: null,
    adminNotes: null,
  },

  // Road damage incidents
  {
    type: IncidentType.ROAD_DAMAGE,
    description:
      'Ổ gà lớn tại đường Nguyễn Trãi, gần ngã tư Khuất Duy Tiến, nguy hiểm cho xe 2 bánh',
    location: {
      type: 'Point',
      coordinates: [105.7978, 21.0023],
    },
    imageUrls: [
      'https://example.com/images/road-1.jpg',
      'https://example.com/images/road-2.jpg',
    ],
    status: IncidentStatus.IN_PROGRESS,
    reportedBy: TEST_USER_ID,
    verifiedBy: ADMIN_USER_ID,
    adminNotes: 'Đã báo công ty công trình giao thông, dự kiến sửa trong tuần',
  },
  {
    type: IncidentType.ROAD_DAMAGE,
    description: 'Nắp cống bị mất tại đường Trường Chinh, đoạn gần Ngã Tư Sở',
    location: {
      type: 'Point',
      coordinates: [105.8198, 21.0028],
    },
    imageUrls: ['https://example.com/images/road-3.jpg'],
    status: IncidentStatus.RESOLVED,
    reportedBy: ADMIN_USER_ID,
    verifiedBy: ADMIN_USER_ID,
    adminNotes: 'Đã thay nắp cống mới',
  },

  // Landslide incidents
  {
    type: IncidentType.LANDSLIDE,
    description:
      'Sạt lở đất nhỏ tại taluy đường ven sông Hồng, khu vực Long Biên',
    location: {
      type: 'Point',
      coordinates: [105.8725, 21.0453],
    },
    imageUrls: ['https://example.com/images/landslide-1.jpg'],
    status: IncidentStatus.VERIFIED,
    reportedBy: DEMO_USER_ID,
    verifiedBy: ADMIN_USER_ID,
    adminNotes: 'Đã cắm biển cảnh báo, theo dõi tình hình',
  },

  // Other incidents
  {
    type: IncidentType.OTHER,
    description:
      'Đèn tín hiệu giao thông tại ngã tư Trần Duy Hưng - Hoàng Minh Giám không hoạt động',
    location: {
      type: 'Point',
      coordinates: [105.7978, 21.0168],
    },
    imageUrls: ['https://example.com/images/other-1.jpg'],
    status: IncidentStatus.RESOLVED,
    reportedBy: TEST_USER_ID,
    verifiedBy: ADMIN_USER_ID,
    adminNotes: 'Đã sửa chữa, đèn hoạt động bình thường',
  },
  {
    type: IncidentType.OTHER,
    description: 'Biển báo giao thông bị đổ tại đầu đường Xuân Thủy',
    location: {
      type: 'Point',
      coordinates: [105.7845, 21.0358],
    },
    imageUrls: [],
    status: IncidentStatus.REJECTED,
    reportedBy: DEMO_USER_ID,
    verifiedBy: ADMIN_USER_ID,
    adminNotes:
      'Không thuộc phạm vi xử lý của hệ thống, đã chuyển phản ánh đến cơ quan chức năng',
  },
];
