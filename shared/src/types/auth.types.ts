import { UserRole } from '../constants';
import { IUserProfile } from './user.types';

/**
 * Login request payload
 */
export interface ILoginRequest {
  email: string;
  password: string;
}

/**
 * Login response
 */
export interface ILoginResponse {
  access_token: string;
  user: IUserProfile;
}

/**
 * Register request payload (for citizens)
 */
export interface IRegisterRequest {
  email: string;
  password: string;
  fullName: string;
  phoneNumber?: string;
}

/**
 * Register response
 */
export interface IRegisterResponse {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
}

/**
 * JWT Token payload
 */
export interface IJwtPayload {
  sub: string; // user id
  email: string;
  role: UserRole;
  iat?: number; // issued at
  exp?: number; // expiration
}

/**
 * FCM Token update request
 */
export interface IFcmTokenRequest {
  fcmToken: string;
}

/**
 * Google OAuth request payload (from mobile)
 */
export interface IGoogleAuthRequest {
  idToken: string;
}

/**
 * Google OAuth response
 */
export interface IGoogleAuthResponse {
  access_token: string;
  user: IUserProfile;
  isNewUser: boolean;
}
