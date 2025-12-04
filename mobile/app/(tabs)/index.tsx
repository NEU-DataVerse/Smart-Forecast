import React, { useCallback, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { Stack } from 'expo-router';
import * as Location from 'expo-location';
import { useQuery } from '@tanstack/react-query';

import Colors from '@/constants/colors';
import { useAppStore } from '@/store/appStore';
import { useAuth } from '@/context/AuthContext';
import { weatherApi, airQualityApi, userApi } from '@/services/api';
import HourlyForecastCard from '@/components/HourlyForecastCard';
import ForecastSection from '@/components/ForecastSection';
import { WeatherHeader, AirQualitySection, WeatherDetailsSection } from '@/components/home';
import {
  NearbyAirQualityResponse,
  NearbyWeatherResponse,
  WeatherDataResponse,
  AirQualityData,
} from '@/types';
import { formatForecastTime, groupForecastByDay, limitArray } from '@/utils/forecast';
import { getEPAAQIForecastStatus } from '@/utils/aqi';

// Types for forecast items
type WeatherForecastItem = WeatherDataResponse & { validFrom: string; validTo: string };
type AirQualityForecastItem = AirQualityData & { validFrom?: string; validTo?: string };

export default function HomeScreen() {
  const { location, setLocation, setEnvironmentData } = useAppStore();
  const { token } = useAuth();

  // Ghi nhớ location key để tránh refetch không cần thiết
  const locationKey = useMemo(
    () => (location ? [location.latitude, location.longitude] : null),
    [location?.latitude, location?.longitude],
  );

  // Query lấy dữ liệu thời tiết từ backend API (current + forecast)
  const {
    data: weatherData,
    isLoading: isWeatherLoading,
    refetch: refetchWeather,
    isRefetching: isWeatherRefetching,
  } = useQuery<NearbyWeatherResponse>({
    queryKey: ['weather', locationKey],
    queryFn: async () => {
      if (!location) {
        throw new Error('Không có vị trí');
      }
      return await weatherApi.getNearbyWeather(
        location.latitude,
        location.longitude,
        token ?? undefined,
        'both', // Lấy cả current và forecast
      );
    },
    enabled: !!location && !!token,
    retry: 3,
    retryDelay: 1000,
  });

  // Query lấy dữ liệu chất lượng không khí từ backend API (current + forecast)
  const {
    data: airQualityData,
    isLoading: isAirQualityLoading,
    refetch: refetchAirQuality,
    isRefetching: isAirQualityRefetching,
  } = useQuery<NearbyAirQualityResponse>({
    queryKey: ['airQuality', locationKey],
    queryFn: async () => {
      if (!location) {
        throw new Error('Không có vị trí');
      }
      return await airQualityApi.getNearbyAirQuality(
        location.latitude,
        location.longitude,
        token ?? undefined,
        'both', // Lấy cả current và forecast
      );
    },
    enabled: !!location && !!token,
    retry: 3,
    retryDelay: 1000,
  });

  const isLoading = isWeatherLoading || isAirQualityLoading;
  const isRefetching = isWeatherRefetching || isAirQualityRefetching;

  const handleRefresh = () => {
    refetchWeather();
    refetchAirQuality();
  };

  // Cập nhật store khi dữ liệu thời tiết thay đổi
  useEffect(() => {
    if (weatherData?.current) {
      const current = weatherData.current;
      setEnvironmentData({
        temperature: Math.round(current.temperature.current ?? 0),
        humidity: current.atmospheric.humidity ?? 0,
        aqi: airQualityData?.current?.aqi?.epaUS?.index ?? 0,
        clouds: current.cloudiness ?? 0,
        windSpeed: current.wind.speed ?? 0,
        pressure: current.atmospheric.pressure ?? 0,
        description: current.weather.description ?? '',
        icon: current.weather.icon ?? '01d',
        location: weatherData.nearestStation.name ?? 'Không xác định',
        timestamp: Date.now(),
      });
    }
  }, [weatherData, airQualityData, setEnvironmentData]);

  useEffect(() => {
    const requestLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          console.log('Quyền truy cập vị trí bị từ chối');
          setLocation({ latitude: 10.8231, longitude: 106.6297 });
          return;
        }

        const loc = await Location.getCurrentPositionAsync({});
        const newLocation = {
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        };

        // Lưu vào local store
        setLocation(newLocation);

        // Gửi vị trí lên backend nếu đã đăng nhập
        if (token) {
          try {
            await userApi.updateLocation(
              { lat: newLocation.latitude, lon: newLocation.longitude },
              token,
            );
            console.log('📍 User location synced to backend');
          } catch (error) {
            console.error('❌ Failed to sync location to backend:', error);
          }
        }
      } catch (error) {
        console.error('Lỗi khi lấy vị trí:', error);
        setLocation({ latitude: 10.8231, longitude: 106.6297 });
      }
    };

    requestLocation();
  }, [setLocation, token]);

  // Render functions for forecast items
  const renderWeatherForecastItem = useCallback(
    ({ item }: { item: WeatherForecastItem }) => (
      <HourlyForecastCard
        time={formatForecastTime(item.validFrom, 'daily')}
        icon={item.weather?.icon || '01d'}
        value={Math.round(item.temperature?.current ?? 0)}
        unit="°C"
        type="weather"
      />
    ),
    [],
  );

  const renderAirQualityForecastItem = useCallback(({ item }: { item: AirQualityForecastItem }) => {
    // Sử dụng EPA US AQI thay vì OpenWeather
    const aqiIndex = item.aqi?.epaUS?.index ?? 0;
    return (
      <HourlyForecastCard
        time={formatForecastTime(item.validFrom || item.dateObserved, 'hourly')}
        value={aqiIndex}
        unit="AQI"
        status={getEPAAQIForecastStatus(aqiIndex)}
        type="air-quality"
      />
    );
  }, []);

  // Process forecast data
  const weatherForecast = useMemo(() => {
    if (!weatherData?.forecast) return [];
    return limitArray(groupForecastByDay(weatherData.forecast), 7) as WeatherForecastItem[];
  }, [weatherData?.forecast]);

  const airQualityForecast = useMemo(() => {
    if (!airQualityData?.forecast) return [];
    return limitArray(airQualityData.forecast, 12) as AirQualityForecastItem[];
  }, [airQualityData?.forecast]);

  // Get current data from backend response
  const currentWeather = weatherData?.current;
  const weatherStation = weatherData?.nearestStation;
  const airQualityStation = airQualityData?.nearestStation;
  const currentAirQuality = airQualityData?.current;

  // EPA US AQI index and level
  const currentAQI = currentAirQuality?.aqi?.epaUS?.index ?? 0;
  const currentAQILevel = currentAirQuality?.aqi?.epaUS?.level;

  if (isLoading && !currentWeather) {
    return (
      <View style={styles.loadingContainer}>
        <Stack.Screen options={{ headerShown: false }} />
        <ActivityIndicator size="large" color={Colors.primary.blue} />
        <Text style={styles.loadingText}>Đang tải dữ liệu môi trường...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <WeatherHeader
        stationName={weatherStation?.name}
        temperature={
          currentWeather ? Math.round(currentWeather.temperature.current ?? 0) : undefined
        }
        description={currentWeather?.weather.description}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={handleRefresh}
            tintColor={Colors.primary.blue}
          />
        }
      >
        {currentWeather && (
          <>
            <AirQualitySection
              aqiIndex={currentAQI}
              aqiLevel={currentAQILevel}
              pollutants={currentAirQuality?.pollutants}
              humidity={currentWeather.atmospheric.humidity}
              stationInfo={airQualityStation}
            />

            <WeatherDetailsSection
              temperature={currentWeather.temperature.current}
              windSpeed={currentWeather.wind.speed}
              cloudiness={currentWeather.cloudiness}
              pressure={currentWeather.atmospheric.pressure}
              stationInfo={weatherStation}
            />

            {/* Weather Forecast Section */}
            <ForecastSection
              title="Dự báo thời tiết 7 ngày"
              data={weatherForecast}
              renderItem={renderWeatherForecastItem}
              keyExtractor={(item, index) => `weather-${item.validFrom || index}`}
              emptyText="Không có dữ liệu dự báo thời tiết"
            />

            {/* Air Quality Forecast Section */}
            <ForecastSection
              title="Dự báo chất lượng không khí"
              data={airQualityForecast}
              renderItem={renderAirQualityForecastItem}
              keyExtractor={(item, index) => `aq-${item.validFrom || item.dateObserved || index}`}
              emptyText="Không có dữ liệu dự báo chất lượng KK"
            />
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background.primary,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: Colors.text.secondary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
});
