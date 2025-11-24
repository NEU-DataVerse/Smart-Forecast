/**
 * Users API Service
 */

import { apiGet } from '@/lib/api-client';
import type { User } from '@/types/dto';

const BASE_PATH = '/users';

export const usersService = {
  /**
   * List all users
   */
  async list(): Promise<User[]> {
    return apiGet<User[]>(BASE_PATH);
  },

  /**
   * Get user by ID
   */
  async getById(id: string): Promise<User> {
    return apiGet<User>(`${BASE_PATH}/${id}`);
  },
};
