import { apiGet, apiPost } from '@/lib/api-client';
import { ApiClient } from '@/services/axios';
import { ILoginRequest, ILoginResponse, IUserProfile, UserRole } from '@smart-forecast/shared';

export interface AuthResult {
  success: boolean;
  data?: ILoginResponse;
  error?: string;
}

const BASE_PATH = '/auth';

export const authService = {
  // Authenticate user with email and password
  async authenticate(credentials: ILoginRequest): Promise<AuthResult> {
    try {
      const response = await apiPost<ILoginResponse>(`${BASE_PATH}/login`, credentials);

      const { access_token, user } = response;

      if (!access_token || !user || user.role !== UserRole.ADMIN) {
        return {
          success: false,
          error: 'Invalid response from server',
        };
      }

      localStorage.setItem('access_token', access_token);

      // Update axios header
      ApiClient.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;

      return {
        success: true,
        data: response,
      };
    } catch (error: unknown) {
      const err = error as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      const errorMessage =
        err?.response?.data?.message || err?.message || 'Failed to login. Please try again.';

      return {
        success: false,
        error: errorMessage,
      };
    }
  },

  //  Clear authentication data
  clearAuthData(): void {
    localStorage.removeItem('access_token');
    delete ApiClient.defaults.headers.common['Authorization'];
  },

  // Get current authenticated user
  async getCurrentUser(): Promise<IUserProfile> {
    return apiGet<IUserProfile>(`${BASE_PATH}/me`);
  },
};
