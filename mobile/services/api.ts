import axios from 'axios';
import { Platform } from 'react-native';
import { EnvironmentData, NearbyAirQualityResponse } from '@/types';

const OPENWEATHER_API_KEY = process.env.EXPO_PUBLIC_OPENWEATHER_API_KEY || '';
const OPENWEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5';

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
  // Get weather data from OpenWeatherMap (temperature, humidity, wind, etc.)
  async getEnvironmentData(lat: number, lon: number): Promise<EnvironmentData> {
    try {
      const weatherResponse = await axios.get(`${OPENWEATHER_BASE_URL}/weather`, {
        params: {
          lat,
          lon,
          appid: OPENWEATHER_API_KEY,
          units: 'metric',
        },
      });

      const weatherData = weatherResponse.data;

      return {
        temperature: Math.round(weatherData.main.temp),
        humidity: weatherData.main.humidity,
        aqi: 1, // Default, will be overridden by backend air quality data
        clouds: weatherData.clouds.all,
        windSpeed: weatherData.wind.speed,
        pressure: weatherData.main.pressure,
        description: weatherData.weather[0]?.description || '',
        icon: weatherData.weather[0]?.icon || '01d',
        location: weatherData.name || 'Unknown',
        timestamp: Date.now(),
      };
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
