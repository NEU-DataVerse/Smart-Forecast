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
  /**
   * Get air quality data from nearby station based on GPS coordinates
   * This is the primary method for mobile app
   */
  async getEnvironmentData(lat: number, lon: number): Promise<EnvironmentData> {
    try {
      const weatherResponse = await axios.get(`${WEATHER_BASE_URL}/weather`, {
        params: {
          lat,
          lon,
          radius: 50,
          include: 'current,forecast',
        },
      });

      const airQualityResponse = await axios.get(`${WEATHER_BASE_URL}/air_pollution`, {
        params: {
          lat,
          lon,
          appid: OPENWEATHER_API_KEY,
        },
      });

      if (!current) {
        throw new Error('No air quality data found');
      }

      // Transform backend response to EnvironmentData format
      return {
        temperature: current.temperature || 25,
        humidity: current.humidity || 60,
        aqi: current.aqi?.openWeather?.index || 1,
        clouds: current.clouds || 0,
        windSpeed: current.windSpeed || 0,
        pressure: current.pressure || 1013,
        description: current.aqi?.openWeather?.level || 'Good',
        icon: '01d',
        location: current.address || data.nearestStation?.name || 'Unknown',
        timestamp: Date.now(),
      };
    } catch (error) {
      console.error('Error fetching air quality data:', error);
      throw error;
    }
  },

  /**
   * Get current air quality data for all stations
   */
  async getCurrentAirQuality(): Promise<AirQualityData[]> {
    try {
      const response = await apiClient.get('/air-quality/current');
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching current air quality:', error);
      throw error;
    }
  },

  /**
   * Get air quality forecast
   */
  async getForecastAirQuality(): Promise<AirQualityData[]> {
    try {
      const response = await apiClient.get('/air-quality/forecast');
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching air quality forecast:', error);
      throw error;
    }
  },

  /**
   * Get nearby air quality data with additional details
   */
  async getNearbyAirQuality(
    lat: number,
    lon: number,
    radius: number = 50,
    include: string = 'current',
  ): Promise<any> {
    try {
      const response = await apiClient.get('/air-quality/nearby', {
        params: { lat, lon, radius, include },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching nearby air quality:', error);
      throw error;
    }
  },

  /**
   * Get all stations
   */
  async getAllStations(): Promise<Sensor[]> {
    try {
      const response = await apiClient.get('/stations');
      const stations = response.data.stations || [];

      // Transform station data to Sensor format
      return stations.map((station: any) => ({
        id: station.id || station.code,
        name: station.name,
        latitude: station.location?.coordinates?.[1] || station.latitude,
        longitude: station.location?.coordinates?.[0] || station.longitude,
        type: 'air_quality',
        status: station.status === 'active' ? 'active' : 'inactive',
        lastReading: {
          aqi: station.lastReading?.aqi,
          temperature: station.lastReading?.temperature,
          humidity: station.lastReading?.humidity,
        },
      }));
    } catch (error) {
      console.error('Error fetching stations:', error);
      throw error;
    }
  },

  /**
   * Get nearest stations by GPS coordinates
   */
  async getNearestStations(
    lat: number,
    lon: number,
    limit: number = 5,
    radius: number = 50,
  ): Promise<Sensor[]> {
    try {
      const response = await apiClient.get('/stations/nearest', {
        params: { lat, lon, limit, radius },
      });

      const stations = response.data.stations || [];

      // Transform station data to Sensor format
      return stations.map((station: any) => ({
        id: station.id || station.code,
        name: station.name,
        latitude: station.location?.coordinates?.[1] || station.latitude,
        longitude: station.location?.coordinates?.[0] || station.longitude,
        type: 'air_quality',
        status: station.status === 'active' ? 'active' : 'inactive',
        lastReading: {
          aqi: station.lastReading?.aqi,
          temperature: station.lastReading?.temperature,
          humidity: station.lastReading?.humidity,
        },
      }));
    } catch (error) {
      console.error('Error fetching nearest stations:', error);
      throw error;
    }
  },
};
