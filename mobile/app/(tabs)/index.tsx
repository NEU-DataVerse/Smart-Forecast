import React, { useCallback, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { Stack } from 'expo-router';
import * as Location from 'expo-location';
import { Thermometer, Droplets, Wind, Cloud, Activity, Gauge, MapPin } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useQuery } from '@tanstack/react-query';

import Colors from '@/constants/colors';
import { useAppStore } from '@/store/appStore';
import { useAuth } from '@/context/AuthContext';
import { weatherApi, airQualityApi, userApi } from '@/services/api';
import EnvCard from '@/components/EnvCard';
import HourlyForecastCard from '@/components/HourlyForecastCard';
import ForecastSection from '@/components/ForecastSection';
import {
  NearbyAirQualityResponse,
  NearbyWeatherResponse,
  WeatherDataResponse,
  AirQualityData,
} from '@/types';
import { formatForecastTime, getAQIStatus, groupForecastByDay, limitArray } from '@/utils/forecast';

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
        aqi: 1, // Sẽ được ghi đè bởi dữ liệu chất lượng không khí
        clouds: current.cloudiness ?? 0,
        windSpeed: current.wind.speed ?? 0,
        pressure: current.atmospheric.pressure ?? 0,
        description: current.weather.description ?? '',
        icon: current.weather.icon ?? '01d',
        location: weatherData.nearestStation.name ?? 'Không xác định',
        timestamp: Date.now(),
      });
    }
  }, [weatherData, setEnvironmentData]);

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
            // Không throw error - vẫn tiếp tục sử dụng app với vị trí local
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
    const aqiIndex = item.aqi?.openWeather?.index ?? 1;
    return (
      <HourlyForecastCard
        time={formatForecastTime(item.validFrom || item.dateObserved, 'hourly')}
        value={aqiIndex}
        unit="AQI"
        status={getAQIStatus(aqiIndex)}
        type="air-quality"
      />
    );
  }, []);

  // Process forecast data
  const weatherForecast = useMemo(() => {
    if (!weatherData?.forecast) return [];
    // Group by day and limit to 7 days
    return limitArray(groupForecastByDay(weatherData.forecast), 7) as WeatherForecastItem[];
  }, [weatherData?.forecast]);

  const airQualityForecast = useMemo(() => {
    if (!airQualityData?.forecast) return [];
    // Limit to 12 entries (3h intervals = ~36 hours)
    return limitArray(airQualityData.forecast, 12) as AirQualityForecastItem[];
  }, [airQualityData?.forecast]);

  const getLocalAQIStatus = (aqi: number): 'good' | 'moderate' | 'unhealthy' | 'hazardous' => {
    if (aqi <= 1) return 'good';
    if (aqi <= 2) return 'moderate';
    if (aqi <= 3) return 'unhealthy';
    return 'hazardous';
  };

  const getLocalAQILabel = (aqi: number): string => {
    // Use level from backend if available
    if (airQualityData?.current?.aqi?.openWeather?.level) {
      return airQualityData.current.aqi.openWeather.level;
    }
    const status = getLocalAQIStatus(aqi);
    const labels = {
      good: 'Good',
      moderate: 'Moderate',
      unhealthy: 'Unhealthy',
      hazardous: 'Hazardous',
    };
    return labels[status];
  };

  // Get AQI index from backend or fallback to weather data
  const currentAQI = airQualityData?.current?.aqi?.openWeather?.index ?? 1;

  // Get current weather from backend response
  const currentWeather = weatherData?.current;
  const weatherStation = weatherData?.nearestStation;

  if (isLoading && !currentWeather) {
    return (
      <View style={styles.loadingContainer}>
        <Stack.Screen options={{ headerShown: false }} />
        <ActivityIndicator size="large" color={Colors.primary.blue} />
        <Text style={styles.loadingText}>Đang tải dữ liệu môi trường...</Text>
      </View>
    );
  }

  const pollutants = airQualityData?.current?.pollutants;
  const airQualityStation = airQualityData?.nearestStation;

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <LinearGradient
        colors={[Colors.gradient.start, Colors.gradient.end]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Smart Forecast</Text>
        {currentWeather && (
          <>
            <Text style={styles.locationText}>
              {weatherStation?.name ?? 'Vị trí không xác định'}
            </Text>
            <View style={styles.mainTempContainer}>
              <Text style={styles.mainTemp}>
                {Math.round(currentWeather.temperature.current ?? 0)}°
              </Text>
              <Text style={styles.description}>{currentWeather.weather.description ?? ''}</Text>
            </View>
          </>
        )}
      </LinearGradient>

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
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Chất lượng không khí</Text>
                {airQualityStation && (
                  <View style={styles.stationInfo}>
                    <MapPin size={12} color={Colors.text.secondary} />
                    <Text style={styles.stationText}>
                      {airQualityStation.name} ({airQualityStation.distance.toFixed(1)} km)
                    </Text>
                  </View>
                )}
              </View>
              <View style={styles.grid}>
                <View style={styles.gridItem}>
                  <EnvCard
                    title="AQI"
                    value={getLocalAQILabel(currentAQI)}
                    icon={
                      <Activity size={20} color={Colors.status[getLocalAQIStatus(currentAQI)]} />
                    }
                    status={getLocalAQIStatus(currentAQI)}
                  />
                </View>
                <View style={styles.gridItem}>
                  <EnvCard
                    title="PM2.5"
                    value={pollutants?.pm25?.toFixed(1) ?? '--'}
                    unit="μg/m³"
                    icon={<Activity size={20} color={Colors.primary.blue} />}
                  />
                </View>
                <View style={styles.gridItem}>
                  <EnvCard
                    title="PM10"
                    value={pollutants?.pm10?.toFixed(1) ?? '--'}
                    unit="μg/m³"
                    icon={<Activity size={20} color={Colors.primary.blue} />}
                  />
                </View>
                <View style={styles.gridItem}>
                  <EnvCard
                    title="Độ ẩm"
                    value={currentWeather.atmospheric.humidity ?? '--'}
                    unit="%"
                    icon={<Droplets size={20} color={Colors.primary.blue} />}
                  />
                </View>
              </View>
            </View>

            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Chi tiết thời tiết</Text>
                {weatherStation && (
                  <View style={styles.stationInfo}>
                    <MapPin size={12} color={Colors.text.secondary} />
                    <Text style={styles.stationText}>
                      {weatherStation.name} ({weatherStation.distance.toFixed(1)} km)
                    </Text>
                  </View>
                )}
              </View>
              <View style={styles.grid}>
                <View style={styles.gridItem}>
                  <EnvCard
                    title="Nhiệt độ"
                    value={Math.round(currentWeather.temperature.current ?? 0)}
                    unit="°C"
                    icon={<Thermometer size={20} color={Colors.primary.blue} />}
                  />
                </View>
                <View style={styles.gridItem}>
                  <EnvCard
                    title="Tốc độ gió"
                    value={(currentWeather.wind.speed ?? 0).toFixed(1)}
                    unit="m/s"
                    icon={<Wind size={20} color={Colors.primary.blue} />}
                  />
                </View>
                <View style={styles.gridItem}>
                  <EnvCard
                    title="Mây"
                    value={currentWeather.cloudiness ?? '--'}
                    unit="%"
                    icon={<Cloud size={20} color={Colors.primary.blue} />}
                  />
                </View>
                <View style={styles.gridItem}>
                  <EnvCard
                    title="Áp suất"
                    value={currentWeather.atmospheric.pressure ?? '--'}
                    unit="hPa"
                    icon={<Gauge size={20} color={Colors.primary.blue} />}
                  />
                </View>
              </View>
            </View>

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
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.text.white,
    marginBottom: 8,
  },
  locationText: {
    fontSize: 16,
    color: Colors.text.white,
    opacity: 0.9,
    marginBottom: 20,
  },
  mainTempContainer: {
    alignItems: 'center',
  },
  mainTemp: {
    fontSize: 72,
    fontWeight: '300' as const,
    color: Colors.text.white,
    letterSpacing: -2,
  },
  description: {
    fontSize: 20,
    color: Colors.text.white,
    opacity: 0.9,
    textTransform: 'capitalize' as const,
    marginTop: 8,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: Colors.text.primary,
  },
  stationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  stationText: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
  },
  gridItem: {
    width: '50%',
    paddingHorizontal: 6,
    marginBottom: 12,
  },
});
