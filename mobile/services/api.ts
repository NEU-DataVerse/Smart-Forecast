import axios from 'axios';
import { NearbyAirQualityResponse, NearbyWeatherResponse } from '@/types';
import type {
  IAlert,
  IAlertQueryParams,
  IIncident,
  IIncidentQueryParams,
} from '@smart-forecast/shared';

export const getBackendUrl = (): string | undefined => {
  return process.env.EXPO_PUBLIC_API_URL;
};

const BACKEND_URL = getBackendUrl();

export const weatherApi = {
  // Lấy dữ liệu thời tiết từ backend API (qua Orion-LD)
  async getNearbyWeather(
    lat: number,
    lon: number,
    token?: string,
    include: 'current' | 'forecast' | 'both' = 'current',
  ): Promise<NearbyWeatherResponse> {
    try {
      const response = await axios.get<NearbyWeatherResponse>(`${BACKEND_URL}/weather/nearby`, {
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
  ): Promise<NearbyAirQualityResponse> {
    try {
      const response = await axios.get<NearbyAirQualityResponse>(
        `${BACKEND_URL}/air-quality/nearby`,
        {
          params: {
            lat,
            lon,
            include: 'current',
          },
          headers: {
            Accept: 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        },
      );

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
    try {
      const response = await axios.post<GoogleAuthResponse>(
        `${BACKEND_URL}/auth/google`,
        { idToken },
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        },
      );

      return response.data;
    } catch (error) {
      console.error('Lỗi đăng nhập Google:', error);
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
    try {
      const response = await axios.get<IAlert[]>(`${BACKEND_URL}/alert/active`, {
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
    try {
      const response = await axios.get<AlertListResponse>(`${BACKEND_URL}/alert`, {
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
    try {
      const response = await axios.get<IncidentListResponse>(`${BACKEND_URL}/incident/my-reports`, {
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
    try {
      const response = await axios.get<IncidentListResponse>(`${BACKEND_URL}/incident`, {
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

// User API
export const userApi = {
  // Cập nhật FCM token (ExponentPushToken) để nhận push notifications
  async updateFcmToken(fcmToken: string, token: string): Promise<{ message: string }> {
    try {
      const response = await axios.put<{ message: string }>(
        `${BACKEND_URL}/users/fcm-token`,
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
};
