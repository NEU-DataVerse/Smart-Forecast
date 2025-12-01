import axios from 'axios';
import { EnvironmentData, AirQualityData, Sensor } from '@/types';

const BACKEND_API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: BACKEND_API_URL,
  timeout: 10000,
});

export const weatherApi = {
  /**
   * Get air quality data from nearby station based on GPS coordinates
   * This is the primary method for mobile app
   */
  async getEnvironmentData(lat: number, lon: number): Promise<EnvironmentData> {
    try {
      const response = await apiClient.get('/air-quality/nearby', {
        params: {
          lat,
          lon,
          radius: 50,
          include: 'current,forecast',
        },
      });

      const data = response.data;
      const current = data.current || data.data?.[0];

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
