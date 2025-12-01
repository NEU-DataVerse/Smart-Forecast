import axios, { AxiosInstance } from 'axios';
import { EnvironmentData } from '@/types';
import { User } from '@/context/auth.interface';
import { tokenStorage } from '@/utils/tokenStorage';

const OPENWEATHER_API_KEY = process.env.EXPO_PUBLIC_OPENWEATHER_API_KEY || '';
const BACKEND_API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
const WEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5';

// Create axios instance for backend API
const apiClient: AxiosInstance = axios.create({
  baseURL: BACKEND_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
apiClient.interceptors.request.use(
  async (config) => {
    const token = await tokenStorage.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export const authApi = {
  async googleSignIn(
    idToken: string,
  ): Promise<{ access_token: string; user: User; isNewUser: boolean }> {
    try {
      const response = await apiClient.post('/auth/google', { idToken });
      return response.data;
    } catch (error) {
      console.error('Google sign-in error:', error);
      throw error;
    }
  },

  async getProfile(): Promise<User> {
    try {
      const response = await apiClient.get('/auth/me');
      return response.data;
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  },
};

export const weatherApi = {
  async getEnvironmentData(lat: number, lon: number): Promise<EnvironmentData> {
    try {
      const weatherResponse = await axios.get(`${WEATHER_BASE_URL}/weather`, {
        params: {
          lat,
          lon,
          appid: OPENWEATHER_API_KEY,
          units: 'metric',
        },
      });

      const airQualityResponse = await axios.get(`${WEATHER_BASE_URL}/air_pollution`, {
        params: {
          lat,
          lon,
          appid: OPENWEATHER_API_KEY,
        },
      });

      const weatherData = weatherResponse.data;
      const aqiData = airQualityResponse.data;

      return {
        temperature: Math.round(weatherData.main.temp),
        humidity: weatherData.main.humidity,
        aqi: aqiData.list[0]?.main?.aqi || 1,
        clouds: weatherData.clouds.all,
        windSpeed: weatherData.wind.speed,
        pressure: weatherData.main.pressure,
        description: weatherData.weather[0]?.description || '',
        icon: weatherData.weather[0]?.icon || '01d',
        location: weatherData.name || 'Unknown',
        timestamp: Date.now(),
      };
    } catch (error) {
      console.error('Error fetching environment data:', error);
      throw error;
    }
  },
};
