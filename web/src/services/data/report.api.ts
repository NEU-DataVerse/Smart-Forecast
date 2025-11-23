import { IIncident } from '@/../../shared/src/types/incident.types';
import { IncidentType, IncidentStatus } from '@/../../shared/src/constants';

export const recentReports: IIncident[] = [
  {
    id: '660e8400-e29b-41d4-a716-446655440001',
    type: IncidentType.FLOODING,
    description:
      'Ngập nước nghiêm trọng tại khu vực đường Nguyễn Trãi, nước ngập cao khoảng 30-40cm. Giao thông bị ảnh hưởng nghiêm trọng, nhiều phương tiện không thể di chuyển.',
    location: {
      type: 'Point',
      coordinates: [105.8342, 21.0278],
    },
    imageUrls: [
      'https://minio.example.com/incidents/flooding-nguyen-trai-1.jpg',
      'https://minio.example.com/incidents/flooding-nguyen-trai-2.jpg',
    ],
    status: IncidentStatus.VERIFIED,
    reportedBy: 'user-001',
    verifiedBy: 'admin-001',
    adminNotes: 'Đã xác nhận và chuyển đến đội ứng cứu khẩn cấp. Ưu tiên cao.',
    createdAt: new Date('2025-11-21T09:15:00Z'),
    updatedAt: new Date('2025-11-21T09:30:00Z'),
  },
  {
    id: '660e8400-e29b-41d4-a716-446655440002',
    type: IncidentType.FALLEN_TREE,
    description:
      'Cây xanh to bị đổ chắn ngang đường Hoàng Diệu do gió lớn. Cây đổ gây cản trở giao thông và có nguy cơ gây tai nạn.',
    location: {
      type: 'Point',
      coordinates: [105.8512, 21.0245],
    },
    imageUrls: ['https://minio.example.com/incidents/fallen-tree-hoang-dieu.jpg'],
    status: IncidentStatus.IN_PROGRESS,
    reportedBy: 'user-002',
    verifiedBy: 'admin-002',
    adminNotes: 'Đã điều động đội cưa cây đến hiện trường. Dự kiến xử lý trong 2 giờ.',
    createdAt: new Date('2025-11-21T07:45:00Z'),
    updatedAt: new Date('2025-11-21T08:00:00Z'),
  },
  {
    id: '660e8400-e29b-41d4-a716-446655440003',
    type: IncidentType.ROAD_DAMAGE,
    description:
      'Đường bị hư hỏng nặng với nhiều ổ gà sâu tại đường Giải Phóng. Gây nguy hiểm cho người tham gia giao thông, đặc biệt là xe máy.',
    location: {
      type: 'Point',
      coordinates: [105.8423, 20.9976],
    },
    imageUrls: [
      'https://minio.example.com/incidents/road-damage-giai-phong-1.jpg',
      'https://minio.example.com/incidents/road-damage-giai-phong-2.jpg',
      'https://minio.example.com/incidents/road-damage-giai-phong-3.jpg',
    ],
    status: IncidentStatus.PENDING,
    reportedBy: 'user-003',
    createdAt: new Date('2025-11-21T10:20:00Z'),
    updatedAt: new Date('2025-11-21T10:20:00Z'),
  },
  {
    id: '660e8400-e29b-41d4-a716-446655440004',
    type: IncidentType.LANDSLIDE,
    description:
      'Sạt lở đất nhỏ tại khu vực đồi núi Ba Vì. Một phần đất đá sụt xuống đường, cần xử lý ngay để tránh mở rộng.',
    location: {
      type: 'Point',
      coordinates: [105.3876, 21.1543],
    },
    imageUrls: ['https://minio.example.com/incidents/landslide-ba-vi.jpg'],
    status: IncidentStatus.VERIFIED,
    reportedBy: 'user-004',
    verifiedBy: 'admin-001',
    adminNotes: 'Đã xác nhận tình trạng sạt lở. Đang phối hợp với UBND huyện Ba Vì xử lý.',
    createdAt: new Date('2025-11-20T16:30:00Z'),
    updatedAt: new Date('2025-11-20T17:00:00Z'),
  },
  {
    id: '660e8400-e29b-41d4-a716-446655440005',
    type: IncidentType.AIR_POLLUTION,
    description:
      'Khói bụi dày đặc từ khu công nghiệp gây ô nhiễm không khí nghiêm trọng. Người dân xung quanh phản ánh mùi khó chịu và khó thở.',
    location: {
      type: 'Point',
      coordinates: [105.9123, 21.0456],
    },
    imageUrls: [
      'https://minio.example.com/incidents/air-pollution-industrial.jpg',
      'https://minio.example.com/incidents/air-pollution-smoke.jpg',
    ],
    status: IncidentStatus.REJECTED,
    reportedBy: 'user-005',
    verifiedBy: 'admin-003',
    adminNotes:
      'Đã kiểm tra hiện trường. Nguồn khói là từ hoạt động sản xuất hợp pháp, đã có giấy phép môi trường.',
    createdAt: new Date('2025-11-20T14:00:00Z'),
    updatedAt: new Date('2025-11-20T15:30:00Z'),
  },
];
