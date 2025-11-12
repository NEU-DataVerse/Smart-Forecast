import { UserRole } from "../constants";

/**
 * Base User interface
 */
export interface IUser {
    id: string;
    email: string;
    fullName: string;
    role: UserRole;
    phoneNumber?: string;
    avatarUrl?: string;
    fcmToken?: string; // For push notifications
    createdAt: Date;
    updatedAt: Date;
}

/**
 * User profile (public information)
 */
export interface IUserProfile {
    id: string;
    email: string;
    fullName: string;
    role: UserRole;
    avatarUrl?: string;
}

/**
 * User creation DTO
 */
export interface ICreateUser {
    email: string;
    password: string;
    fullName: string;
    phoneNumber?: string;
    role?: UserRole;
}

/**
 * User update DTO
 */
export interface IUpdateUser {
    fullName?: string;
    phoneNumber?: string;
    avatarUrl?: string;
    fcmToken?: string;
}
