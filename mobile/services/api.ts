import axios from 'axios';
import { Platform } from 'react-native';
import { NearbyAirQualityResponse, NearbyWeatherResponse } from '@/types';
import type {
  IAlert,
  IAlertQueryParams,
  AlertLevel,
  AlertType,
  IIncident,
  IIncidentQueryParams,
} from '@smart-forecast/shared';

// Backend API URL - use 10.0.2.2 for Android emulator to access host localhost
const getBackendUrl = () => {
  const envUrl = process.env.EXPO_PUBLIC_API_URL;
  if (envUrl) return envUrl;
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:8000/api/v1';
  }
  return 'http://localhost:8000/api/v1';
};

const BACKEND_URL = getBackendUrl();

// TODO: Remove this mock token after implementing proper auth
const MOCK_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMTExMTExMS0xMTExLTExMTEtMTExMS0xMTExMTExMTExMTEiLCJlbWFpbCI6ImFkbWluQHNtYXJ0Zm9yZWNhc3QuY29tIiwicm9sZSI6IkFETUlOIiwiaWF0IjoxNzY0NjkxNjMyLCJleHAiOjE3NjUyOTY0MzJ9.CsCFj7nqu_R1cRk5vULIzXpKU5Oj0ntgJANxqCwTSdc';

export const weatherApi = {
  // Get weather data from backend API (via Orion-LD)
  async getNearbyWeather(
    lat: number,
    lon: number,
    token?: string,
    include: 'current' | 'forecast' | 'both' = 'current',
  ): Promise<NearbyWeatherResponse> {
    try {
      const authToken = token || MOCK_TOKEN;
      const response = await axios.get<NearbyWeatherResponse>(`${BACKEND_URL}/weather/nearby`, {
        params: {
          lat,
          lon,
          include,
        },
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching weather data:', error);
      throw error;
    }
  },
};

export const airQualityApi = {
  // Get nearby air quality data from backend API
  async getNearbyAirQuality(
    lat: number,
    lon: number,
    token?: string,
  ): Promise<NearbyAirQualityResponse> {
    try {
      const authToken = token || MOCK_TOKEN;
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
            Authorization: `Bearer ${authToken}`,
          },
        },
      );

      return response.data;
    } catch (error) {
      console.error('Error fetching air quality data:', error);
      throw error;
    }
  },
};

// Auth API response types
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
  // Google Sign-In - send idToken to backend for verification
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
      console.error('Error with Google sign-in:', error);
      throw error;
    }
  },
};

// Alert API types
export interface AlertListResponse {
  data: IAlert[];
  total: number;
  page: number;
  limit: number;
}

export const alertApi = {
  // Get active alerts (non-expired)
  async getActiveAlerts(token?: string): Promise<IAlert[]> {
    try {
      const authToken = token || MOCK_TOKEN;
      const response = await axios.get<IAlert[]>(`${BACKEND_URL}/alert/active`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching active alerts:', error);
      throw error;
    }
  },

  // Get alerts with filters and pagination
  async getAlerts(params?: IAlertQueryParams, token?: string): Promise<AlertListResponse> {
    try {
      const authToken = token || MOCK_TOKEN;
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
          Authorization: `Bearer ${authToken}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching alerts:', error);
      throw error;
    }
  },
};

// Incident API types
export interface IncidentListResponse {
  data: IIncident[];
  total: number;
  page: number;
  limit: number;
}

export const incidentApi = {
  // Get current user's incidents
  async getMyIncidents(
    params?: IIncidentQueryParams,
    token?: string,
  ): Promise<IncidentListResponse> {
    try {
      const authToken = token || MOCK_TOKEN;
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
          Authorization: `Bearer ${authToken}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching user incidents:', error);
      throw error;
    }
  },

  // Get all incidents with filters
  async getIncidents(params?: IIncidentQueryParams, token?: string): Promise<IncidentListResponse> {
    try {
      const authToken = token || MOCK_TOKEN;
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
          Authorization: `Bearer ${authToken}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching incidents:', error);
      throw error;
    }
  },
};
