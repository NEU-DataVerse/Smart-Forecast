/**
 * User DTOs
 * Copied from backend/src/modules/user
 */

export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  CITIZEN = 'citizen',
}

export interface User {
  id: string;
  email: string;
  role: UserRole;
  fullName: string;
  phoneNumber: string;
  avatarUrl: string;
  fcmToken: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserListResponse {
  data: User[];
  meta?: {
    total: number;
    page: number;
    limit: number;
  };
}
