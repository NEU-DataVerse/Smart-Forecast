/**
 * Station Seed Data
 *
 * Contains sample observation stations in Vietnam.
 * These stations are used for weather and air quality data collection.
 */

import {
  StationStatus,
  StationPriority,
} from '../../../modules/stations/dto/station.dto';

export interface StationSeedData {
  id: string;
  type: string;
  code: string;
  name: string;
  status: StationStatus;
  city: string;
  district: string;
  ward?: string;
  location: {
    lat: number;
    lon: number;
    altitude?: number;
  };
  address: {
    streetAddress?: string;
    addressLocality: string;
    addressRegion: string;
    addressCountry: string;
    postalCode?: string;
  };
  timezone: string;
  timezoneOffset: number;
  priority: StationPriority;
  categories: string[];
  metadata?: {
    installationDate?: string;
    operator?: string;
    contact?: string;
    description?: string;
  };
}

// Station IDs for reference - Hà Nội
export const STATION_HOAN_KIEM_ID =
  'urn:ngsi-ld:ObservationStation:ha-noi-hoan-kiem';
export const STATION_HA_DONG_ID =
  'urn:ngsi-ld:ObservationStation:ha-noi-ha-dong';
export const STATION_CAU_GIAY_ID =
  'urn:ngsi-ld:ObservationStation:ha-noi-cau-giay';
export const STATION_LONG_BIEN_ID =
  'urn:ngsi-ld:ObservationStation:ha-noi-long-bien';

// Station IDs for reference - Ho Chi Minh City
export const STATION_QUAN_1_ID = 'urn:ngsi-ld:ObservationStation:hcm-quan-1';
export const STATION_QUAN_7_ID = 'urn:ngsi-ld:ObservationStation:hcm-quan-7';
export const STATION_THU_DUC_ID = 'urn:ngsi-ld:ObservationStation:hcm-thu-duc';
export const STATION_TAN_BINH_ID =
  'urn:ngsi-ld:ObservationStation:hcm-tan-binh';

export const STATION_SEED_DATA: StationSeedData[] = [
  {
    id: STATION_HOAN_KIEM_ID,
    type: 'ObservationStation',
    code: 'HN-HK-001',
    name: 'Trạm Hoàn Kiếm',
    status: StationStatus.ACTIVE,
    city: 'Hà Nội',
    district: 'Hoàn Kiếm',
    ward: 'Hàng Trống',
    location: {
      lat: 21.028511,
      lon: 105.804817,
      altitude: 12,
    },
    address: {
      streetAddress: 'Hồ Hoàn Kiếm',
      addressLocality: 'Hoàn Kiếm',
      addressRegion: 'Hà Nội',
      addressCountry: 'VN',
      postalCode: '100000',
    },
    timezone: 'Asia/Ho_Chi_Minh',
    timezoneOffset: 25200,
    priority: StationPriority.HIGH,
    categories: ['urban', 'tourist', 'heritage'],
    metadata: {
      installationDate: '2024-01-01T00:00:00.000Z',
      operator: 'Hanoi Environmental Department',
      contact: 'hoankiem@environment.hanoi.gov.vn',
      description: 'Trạm quan trắc tại khu vực trung tâm lịch sử Hà Nội',
    },
  },
  {
    id: STATION_HA_DONG_ID,
    type: 'ObservationStation',
    code: 'HN-HD-001',
    name: 'Trạm Hà Đông',
    status: StationStatus.ACTIVE,
    city: 'Hà Nội',
    district: 'Hà Đông',
    ward: 'Quang Trung',
    location: {
      lat: 20.959001,
      lon: 105.765226,
      altitude: 15,
    },
    address: {
      streetAddress: 'Phố Quang Trung',
      addressLocality: 'Hà Đông',
      addressRegion: 'Hà Nội',
      addressCountry: 'VN',
      postalCode: '100000',
    },
    timezone: 'Asia/Ho_Chi_Minh',
    timezoneOffset: 25200,
    priority: StationPriority.MEDIUM,
    categories: ['urban', 'residential'],
    metadata: {
      installationDate: '2024-02-15T00:00:00.000Z',
      operator: 'Hanoi Environmental Department',
      contact: 'hadong@environment.hanoi.gov.vn',
      description: 'Trạm quan trắc khu vực Hà Đông, phía Tây Hà Nội',
    },
  },
  {
    id: STATION_CAU_GIAY_ID,
    type: 'ObservationStation',
    code: 'HN-CG-001',
    name: 'Trạm Cầu Giấy',
    status: StationStatus.ACTIVE,
    city: 'Hà Nội',
    district: 'Cầu Giấy',
    ward: 'Dịch Vọng',
    location: {
      lat: 21.0313,
      lon: 105.7883,
      altitude: 10,
    },
    address: {
      streetAddress: 'Đường Xuân Thủy',
      addressLocality: 'Cầu Giấy',
      addressRegion: 'Hà Nội',
      addressCountry: 'VN',
      postalCode: '100000',
    },
    timezone: 'Asia/Ho_Chi_Minh',
    timezoneOffset: 25200,
    priority: StationPriority.HIGH,
    categories: ['urban', 'education', 'business'],
    metadata: {
      installationDate: '2024-03-01T00:00:00.000Z',
      operator: 'Hanoi Environmental Department',
      contact: 'caugiay@environment.hanoi.gov.vn',
      description: 'Trạm quan trắc khu vực Cầu Giấy, gần các trường đại học',
    },
  },
  {
    id: STATION_LONG_BIEN_ID,
    type: 'ObservationStation',
    code: 'HN-LB-001',
    name: 'Trạm Long Biên',
    status: StationStatus.ACTIVE,
    city: 'Hà Nội',
    district: 'Long Biên',
    ward: 'Bồ Đề',
    location: {
      lat: 21.0453,
      lon: 105.8725,
      altitude: 8,
    },
    address: {
      streetAddress: 'Phố Ngọc Lâm',
      addressLocality: 'Long Biên',
      addressRegion: 'Hà Nội',
      addressCountry: 'VN',
      postalCode: '100000',
    },
    timezone: 'Asia/Ho_Chi_Minh',
    timezoneOffset: 25200,
    priority: StationPriority.MEDIUM,
    categories: ['urban', 'residential', 'riverside'],
    metadata: {
      installationDate: '2024-03-15T00:00:00.000Z',
      operator: 'Hanoi Environmental Department',
      contact: 'longbien@environment.hanoi.gov.vn',
      description: 'Trạm quan trắc khu vực Long Biên, ven sông Hồng',
    },
  },
  // ============ Ho Chi Minh City Stations ============
  {
    id: STATION_QUAN_1_ID,
    type: 'ObservationStation',
    code: 'HCM-Q1-001',
    name: 'Trạm Quận 1',
    status: StationStatus.ACTIVE,
    city: 'Hồ Chí Minh',
    district: 'Quận 1',
    ward: 'Bến Nghé',
    location: {
      lat: 10.7769,
      lon: 106.7009,
      altitude: 5,
    },
    address: {
      streetAddress: 'Đường Nguyễn Huệ',
      addressLocality: 'Quận 1',
      addressRegion: 'Hồ Chí Minh',
      addressCountry: 'VN',
      postalCode: '700000',
    },
    timezone: 'Asia/Ho_Chi_Minh',
    timezoneOffset: 25200,
    priority: StationPriority.HIGH,
    categories: ['urban', 'tourist', 'business'],
    metadata: {
      installationDate: '2024-04-01T00:00:00.000Z',
      operator: 'HCMC Environmental Department',
      contact: 'quan1@environment.hcmc.gov.vn',
      description:
        'Trạm quan trắc trung tâm Quận 1, khu vực Phố đi bộ Nguyễn Huệ',
    },
  },
  {
    id: STATION_QUAN_7_ID,
    type: 'ObservationStation',
    code: 'HCM-Q7-001',
    name: 'Trạm Quận 7',
    status: StationStatus.ACTIVE,
    city: 'Hồ Chí Minh',
    district: 'Quận 7',
    ward: 'Phú Mỹ',
    location: {
      lat: 10.7284,
      lon: 106.7188,
      altitude: 3,
    },
    address: {
      streetAddress: 'Đường Nguyễn Văn Linh',
      addressLocality: 'Quận 7',
      addressRegion: 'Hồ Chí Minh',
      addressCountry: 'VN',
      postalCode: '700000',
    },
    timezone: 'Asia/Ho_Chi_Minh',
    timezoneOffset: 25200,
    priority: StationPriority.MEDIUM,
    categories: ['urban', 'residential', 'modern'],
    metadata: {
      installationDate: '2024-04-15T00:00:00.000Z',
      operator: 'HCMC Environmental Department',
      contact: 'quan7@environment.hcmc.gov.vn',
      description: 'Trạm quan trắc khu vực Phú Mỹ Hưng, Quận 7',
    },
  },
  {
    id: STATION_THU_DUC_ID,
    type: 'ObservationStation',
    code: 'HCM-TD-001',
    name: 'Trạm Thủ Đức',
    status: StationStatus.ACTIVE,
    city: 'Hồ Chí Minh',
    district: 'Thủ Đức',
    ward: 'Linh Trung',
    location: {
      lat: 10.87,
      lon: 106.8031,
      altitude: 10,
    },
    address: {
      streetAddress: 'Đường Võ Văn Ngân',
      addressLocality: 'Thủ Đức',
      addressRegion: 'Hồ Chí Minh',
      addressCountry: 'VN',
      postalCode: '700000',
    },
    timezone: 'Asia/Ho_Chi_Minh',
    timezoneOffset: 25200,
    priority: StationPriority.HIGH,
    categories: ['urban', 'education', 'tech-hub'],
    metadata: {
      installationDate: '2024-05-01T00:00:00.000Z',
      operator: 'HCMC Environmental Department',
      contact: 'thuduc@environment.hcmc.gov.vn',
      description: 'Trạm quan trắc khu vực Thủ Đức, gần ĐHQG TP.HCM',
    },
  },
  {
    id: STATION_TAN_BINH_ID,
    type: 'ObservationStation',
    code: 'HCM-TB-001',
    name: 'Trạm Tân Bình',
    status: StationStatus.ACTIVE,
    city: 'Hồ Chí Minh',
    district: 'Tân Bình',
    ward: 'Phường 2',
    location: {
      lat: 10.8231,
      lon: 106.6297,
      altitude: 8,
    },
    address: {
      streetAddress: 'Đường Hoàng Văn Thụ',
      addressLocality: 'Tân Bình',
      addressRegion: 'Hồ Chí Minh',
      addressCountry: 'VN',
      postalCode: '700000',
    },
    timezone: 'Asia/Ho_Chi_Minh',
    timezoneOffset: 25200,
    priority: StationPriority.MEDIUM,
    categories: ['urban', 'airport', 'traffic'],
    metadata: {
      installationDate: '2024-05-15T00:00:00.000Z',
      operator: 'HCMC Environmental Department',
      contact: 'tanbinh@environment.hcmc.gov.vn',
      description: 'Trạm quan trắc khu vực gần sân bay Tân Sơn Nhất',
    },
  },
];
