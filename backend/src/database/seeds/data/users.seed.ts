/**
 * User Seed Data
 *
 * Contains sample users for development and testing.
 * Uses fixed UUIDs to allow foreign key references from other entities.
 */

import { UserRole } from '@smart-forecast/shared';

export interface UserSeedData {
  id: string;
  email: string;
  password?: string;
  fullName: string;
  role: UserRole;
  provider: string;
  googleId?: string;
  phoneNumber?: string;
  emailVerified: boolean;
  isActive: boolean;
  fcmToken?: string;
  fcmTokenUpdatedAt?: Date;
  location?: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };
  locationUpdatedAt?: Date;
}

// Fixed UUIDs for consistent foreign key references
export const ADMIN_USER_ID = '11111111-1111-1111-1111-111111111111';
export const TEST_USER_ID = '22222222-2222-2222-2222-222222222222';
export const DEMO_USER_ID = '33333333-3333-3333-3333-333333333333';

// Sample locations in Hanoi
const HANOI_CENTER_LOCATION = {
  type: 'Point' as const,
  coordinates: [105.8342, 21.0278] as [number, number], // Hoàn Kiếm
};

const HANOI_WEST_LOCATION = {
  type: 'Point' as const,
  coordinates: [105.7772, 21.0285] as [number, number], // Cầu Giấy
};

const HANOI_SOUTH_LOCATION = {
  type: 'Point' as const,
  coordinates: [105.8194, 20.9811] as [number, number], // Hà Đông
};

export const USER_SEED_DATA: UserSeedData[] = [
  {
    id: ADMIN_USER_ID,
    email: 'admin@smartforecast.com',
    password: 'admin123',
    fullName: 'System Administrator',
    role: UserRole.ADMIN,
    provider: 'local',
    phoneNumber: '0901234567',
    emailVerified: true,
    isActive: true,
    fcmToken: 'fake-fcm-token-admin-device-001',
    fcmTokenUpdatedAt: new Date(),
    location: HANOI_CENTER_LOCATION,
    locationUpdatedAt: new Date(),
  },
  {
    id: TEST_USER_ID,
    email: 'user@test.com',
    fullName: 'Test User',
    role: UserRole.USER,
    provider: 'google',
    googleId: 'google-oauth-test-id-12345',
    phoneNumber: '0912345678',
    emailVerified: true,
    isActive: true,
    fcmToken: 'fake-fcm-token-test-user-002',
    fcmTokenUpdatedAt: new Date(),
    location: HANOI_WEST_LOCATION,
    locationUpdatedAt: new Date(),
  },
  {
    id: DEMO_USER_ID,
    email: 'demo@smartforecast.com',
    password: 'demo123',
    fullName: 'Demo User',
    role: UserRole.USER,
    provider: 'local',
    phoneNumber: '0923456789',
    emailVerified: true,
    isActive: true,
    fcmToken: 'fake-fcm-token-demo-user-003',
    fcmTokenUpdatedAt: new Date(),
    location: HANOI_SOUTH_LOCATION,
    locationUpdatedAt: new Date(),
  },
];
