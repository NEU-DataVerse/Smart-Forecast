import axios from 'axios';
import { EnvironmentData } from '@/types';

const OPENWEATHER_API_KEY = process.env.EXPO_PUBLIC_OPENWEATHER_API_KEY || '';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export const weatherApi = {
  async getEnvironmentData(lat: number, lon: number): Promise<EnvironmentData> {
    try {
      const weatherResponse = await axios.get(`${BASE_URL}/weather`, {
        params: {
          lat,
          lon,
          appid: OPENWEATHER_API_KEY,
          units: 'metric',
        },
      });

      const airQualityResponse = await axios.get(`${BASE_URL}/air_pollution`, {
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
