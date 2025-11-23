import { SetMetadata } from '@nestjs/common';
import { UserRole } from '@smart-forecast/shared';

/**
 * Metadata key for roles
 */
export const ROLES_KEY = 'roles';

/**
 * Decorator to specify required roles for a route
 * Usage: @Roles(UserRole.ADMIN, UserRole.MANAGER)
 */
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
