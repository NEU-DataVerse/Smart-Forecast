/**
 * Users API Service
 */

import { apiGet } from '@/lib/api-client';
import type { IUserProfile } from '@smart-forecast/shared';

const BASE_PATH = '/users';

export const usersService = {
  /**
   * List all users
   */
  async list(): Promise<IUserProfile[]> {
    return apiGet<IUserProfile[]>(BASE_PATH);
  },

  /**
   * Get user by ID
   */
  async getById(id: string): Promise<IUserProfile> {
    return apiGet<IUserProfile>(`${BASE_PATH}/${id}`);
  },
};
