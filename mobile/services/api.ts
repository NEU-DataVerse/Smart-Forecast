import axios from 'axios';
import { NearbyAirQualityResponse, NearbyWeatherResponse } from '@/types';
import type {
  IAlert,
  IAlertQueryParams,
  IIncident,
  IIncidentQueryParams,
} from '@smart-forecast/shared';

// Get backend URL with fallback - safe for module import
export const getBackendUrl = (): string => {
  const url = process.env.EXPO_PUBLIC_API_URL;
  if (!url || url.trim() === '' || url.includes('YOUR_SERVER_IP')) {
    console.warn('⚠️ EXPO_PUBLIC_API_URL is not configured properly. Please check your .env file.');
    return '';
  }
  return url;
};

export const weatherApi = {
  // Lấy dữ liệu thời tiết từ backend API (qua Orion-LD)
  async getNearbyWeather(
    lat: number,
    lon: number,
    token?: string,
    include: 'current' | 'forecast' | 'both' = 'current',
  ): Promise<NearbyWeatherResponse> {
    const baseUrl = getBackendUrl();
    if (!baseUrl) {
      throw new Error('Backend URL is not configured. Please check your .env file.');
    }
    const url = `${baseUrl}/weather/nearby`;
    console.log('🌤️ Weather API Request:', { url, lat, lon, include, hasToken: !!token });
    try {
      const response = await axios.get<NearbyWeatherResponse>(url, {
        params: {
          lat,
          lon,
          include,
        },
        headers: {
          Accept: 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      return response.data;
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu thời tiết:', error);
      throw error;
    }
  },
};

export const airQualityApi = {
  // Lấy dữ liệu chất lượng không khí gần đây từ backend API
  async getNearbyAirQuality(
    lat: number,
    lon: number,
    token?: string,
    include: 'current' | 'forecast' | 'both' = 'both',
  ): Promise<NearbyAirQualityResponse> {
    const baseUrl = getBackendUrl();
    if (!baseUrl) {
      throw new Error('Backend URL is not configured. Please check your .env file.');
    }
    const url = `${baseUrl}/air-quality/nearby`;
    console.log('🌫️ Air Quality API Request:', { url, lat, lon, include, hasToken: !!token });
    try {
      const response = await axios.get<NearbyAirQualityResponse>(url, {
        params: {
          lat,
          lon,
          include,
        },
        headers: {
          Accept: 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      return response.data;
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu chất lượng không khí:', error);
      throw error;
    }
  },
};

// Kiểu dữ liệu Auth API
export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  role: 'admin' | 'user' | 'viewer';
  avatarUrl?: string;
}

export interface GoogleAuthResponse {
  access_token: string;
  user: AuthUser;
  isNewUser: boolean;
}

export const authApi = {
  // Đăng nhập Google - gửi idToken đến backend để xác thực
  async googleSignIn(idToken: string): Promise<GoogleAuthResponse> {
    const baseUrl = getBackendUrl();
    if (!baseUrl) {
      throw new Error('Backend URL is not configured. Please check your .env file.');
    }

    try {
      console.log('🔐 Calling Google Sign-In API:', `${baseUrl}/auth/google`);
      const response = await axios.post<GoogleAuthResponse>(
        `${baseUrl}/auth/google`,
        { idToken },
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          timeout: 30000, // 30 seconds timeout
        },
      );

      console.log('✅ Google Sign-In success:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Lỗi đăng nhập Google:', error);

      // Log more details for debugging
      if (error.response) {
        console.error('Response error:', error.response.status, error.response.data);
      } else if (error.request) {
        console.error('Network error - no response received:', error.message);
      } else {
        console.error('Request setup error:', error.message);
      }

      throw error;
    }
  },
};

// Kiểu dữ liệu Alert API
export interface AlertListResponse {
  data: IAlert[];
  total: number;
  page: number;
  limit: number;
}

export const alertApi = {
  // Lấy cảnh báo đang hoạt động (chưa hết hạn)
  async getActiveAlerts(token?: string): Promise<IAlert[]> {
    const baseUrl = getBackendUrl();
    if (!baseUrl) {
      throw new Error('Backend URL is not configured. Please check your .env file.');
    }
    try {
      const response = await axios.get<IAlert[]>(`${baseUrl}/alert/active`, {
        headers: {
          Accept: 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      return response.data;
    } catch (error) {
      console.error('Lỗi khi lấy cảnh báo đang hoạt động:', error);
      throw error;
    }
  },

  // Lấy cảnh báo với bộ lọc và phân trang
  async getAlerts(params?: IAlertQueryParams, token?: string): Promise<AlertListResponse> {
    const baseUrl = getBackendUrl();
    if (!baseUrl) {
      throw new Error('Backend URL is not configured. Please check your .env file.');
    }
    try {
      const response = await axios.get<AlertListResponse>(`${baseUrl}/alert`, {
        params: {
          page: params?.page ?? 1,
          limit: params?.limit ?? 20,
          ...(params?.level && { level: params.level }),
          ...(params?.type && { type: params.type }),
          ...(params?.startDate && { startDate: params.startDate }),
          ...(params?.endDate && { endDate: params.endDate }),
        },
        headers: {
          Accept: 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      return response.data;
    } catch (error) {
      console.error('Lỗi khi lấy danh sách cảnh báo:', error);
      throw error;
    }
  },
};

// Kiểu dữ liệu Incident API
export interface IncidentListResponse {
  data: IIncident[];
  total: number;
  page: number;
  limit: number;
}

export const incidentApi = {
  // Lấy sự cố của người dùng hiện tại
  async getMyIncidents(
    params?: IIncidentQueryParams,
    token?: string,
  ): Promise<IncidentListResponse> {
    const baseUrl = getBackendUrl();
    if (!baseUrl) {
      throw new Error('Backend URL is not configured. Please check your .env file.');
    }
    try {
      const response = await axios.get<IncidentListResponse>(`${baseUrl}/incident/my-reports`, {
        params: {
          page: params?.page ?? 1,
          limit: params?.limit ?? 50,
          ...(params?.status && { status: params.status }),
          ...(params?.type && { type: params.type }),
          ...(params?.startDate && { startDate: params.startDate }),
          ...(params?.endDate && { endDate: params.endDate }),
        },
        headers: {
          Accept: 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      return response.data;
    } catch (error) {
      console.error('Lỗi khi lấy sự cố của người dùng:', error);
      throw error;
    }
  },

  // Lấy tất cả sự cố với bộ lọc
  async getIncidents(params?: IIncidentQueryParams, token?: string): Promise<IncidentListResponse> {
    const baseUrl = getBackendUrl();
    if (!baseUrl) {
      throw new Error('Backend URL is not configured. Please check your .env file.');
    }
    try {
      const response = await axios.get<IncidentListResponse>(`${baseUrl}/incident`, {
        params: {
          page: params?.page ?? 1,
          limit: params?.limit ?? 50,
          ...(params?.status && { status: params.status }),
          ...(params?.type && { type: params.type }),
          ...(params?.startDate && { startDate: params.startDate }),
          ...(params?.endDate && { endDate: params.endDate }),
          ...(params?.reportedBy && { reportedBy: params.reportedBy }),
        },
        headers: {
          Accept: 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      return response.data;
    } catch (error) {
      console.error('Lỗi khi lấy danh sách sự cố:', error);
      throw error;
    }
  },
};

/**
 * User API - Profile, Push Token and Location
 */
export const userApi = {
  /**
   * Update FCM/Expo Push token to receive push notifications
   * @param fcmToken - Expo Push Token (ExponentPushToken[xxx])
   * @param token - JWT auth token (required)
   */
  async updateFcmToken(fcmToken: string, token: string): Promise<{ message: string }> {
    const baseUrl = getBackendUrl();
    if (!baseUrl) {
      throw new Error('Backend URL is not configured. Please check your .env file.');
    }
    try {
      const response = await axios.put<{ message: string }>(
        `${baseUrl}/users/fcm-token`,
        { fcmToken },
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log('✅ FCM token updated successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Lỗi khi cập nhật FCM token:', error);
      throw error;
    }
  },

  /**
   * Update push notification token (alias for updateFcmToken)
   * @param pushToken - Expo Push Token
   * @param token - JWT auth token (required)
   */
  async updatePushToken(pushToken: string, token: string): Promise<void> {
    if (!token) {
      throw new Error('Auth token is required to update push token');
    }
    const baseUrl = getBackendUrl();
    if (!baseUrl) {
      throw new Error('Backend URL is not configured. Please check your .env file.');
    }
    await axios.put(
      `${baseUrl}/users/fcm-token`,
      { fcmToken: pushToken },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    );
    console.log('✅ Push token updated successfully');
  },

  /**
   * Update user location for geo-targeted alerts
   * @param location - User's current location {lat, lon}
   * @param token - JWT auth token (required)
   */
  async updateLocation(location: { lat: number; lon: number }, token: string): Promise<void> {
    if (!token) {
      throw new Error('Auth token is required to update location');
    }
    const baseUrl = getBackendUrl();
    if (!baseUrl) {
      throw new Error('Backend URL is not configured. Please check your .env file.');
    }
    // Backend expects PATCH with { latitude, longitude }
    await axios.patch(
      `${baseUrl}/users/location`,
      { latitude: location.lat, longitude: location.lon },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    );
    console.log('✅ User location updated successfully');
  },
};
