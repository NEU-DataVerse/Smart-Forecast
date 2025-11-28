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

// Station IDs for reference
export const STATION_HOAN_KIEM_ID =
  'urn:ngsi-ld:ObservationStation:ha-noi-hoan-kiem';
export const STATION_HA_DONG_ID =
  'urn:ngsi-ld:ObservationStation:ha-noi-ha-dong';
export const STATION_CAU_GIAY_ID =
  'urn:ngsi-ld:ObservationStation:ha-noi-cau-giay';
export const STATION_LONG_BIEN_ID =
  'urn:ngsi-ld:ObservationStation:ha-noi-long-bien';

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
];
