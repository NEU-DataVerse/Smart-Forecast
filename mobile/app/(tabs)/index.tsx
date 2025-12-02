import React, { useEffect } from 'react';
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
import { weatherApi, airQualityApi } from '@/services/api';
import EnvCard from '@/components/EnvCard';
import { NearbyAirQualityResponse } from '@/types';

export default function HomeScreen() {
  const { location, setLocation, environmentData, setEnvironmentData } = useAppStore();

  // Query for weather data from OpenWeatherMap
  const {
    data: weatherData,
    isLoading: isWeatherLoading,
    refetch: refetchWeather,
    isRefetching: isWeatherRefetching,
  } = useQuery({
    queryKey: ['weather', location],
    queryFn: async () => {
      if (!location) {
        throw new Error('Location not available');
      }
      return await weatherApi.getEnvironmentData(location.latitude, location.longitude);
    },
    enabled: !!location,
    retry: 3,
    retryDelay: 1000,
  });

  // Query for air quality data from backend API
  const {
    data: airQualityData,
    isLoading: isAirQualityLoading,
    refetch: refetchAirQuality,
    isRefetching: isAirQualityRefetching,
  } = useQuery<NearbyAirQualityResponse>({
    queryKey: ['airQuality', location],
    queryFn: async () => {
      if (!location) {
        throw new Error('Location not available');
      }
      return await airQualityApi.getNearbyAirQuality(location.latitude, location.longitude);
    },
    enabled: !!location,
    retry: 3,
    retryDelay: 1000,
  });

  const isLoading = isWeatherLoading || isAirQualityLoading;
  const isRefetching = isWeatherRefetching || isAirQualityRefetching;

  const handleRefresh = () => {
    refetchWeather();
    refetchAirQuality();
  };

  useEffect(() => {
    if (weatherData) {
      setEnvironmentData(weatherData);
    }
  }, [weatherData, setEnvironmentData]);

  useEffect(() => {
    const requestLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          console.log('Location permission denied');
          setLocation({ latitude: 10.8231, longitude: 106.6297 });
          return;
        }

        const loc = await Location.getCurrentPositionAsync({});
        setLocation({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        });
      } catch (error) {
        console.error('Error getting location:', error);
        setLocation({ latitude: 10.8231, longitude: 106.6297 });
      }
    };

    requestLocation();
  }, [setLocation]);

  const getAQIStatus = (aqi: number): 'good' | 'moderate' | 'unhealthy' | 'hazardous' => {
    if (aqi <= 1) return 'good';
    if (aqi <= 2) return 'moderate';
    if (aqi <= 3) return 'unhealthy';
    return 'hazardous';
  };

  const getAQILabel = (aqi: number): string => {
    // Use level from backend if available
    if (airQualityData?.current?.aqi?.openWeather?.level) {
      return airQualityData.current.aqi.openWeather.level;
    }
    const status = getAQIStatus(aqi);
    const labels = {
      good: 'Good',
      moderate: 'Moderate',
      unhealthy: 'Unhealthy',
      hazardous: 'Hazardous',
    };
    return labels[status];
  };

  // Get AQI index from backend or fallback to weather data
  const currentAQI = airQualityData?.current?.aqi?.openWeather?.index ?? environmentData?.aqi ?? 1;

  if (isLoading && !environmentData) {
    return (
      <View style={styles.loadingContainer}>
        <Stack.Screen options={{ headerShown: false }} />
        <ActivityIndicator size="large" color={Colors.primary.blue} />
        <Text style={styles.loadingText}>Loading environmental data...</Text>
      </View>
    );
  }

  const envData = environmentData || weatherData;
  const pollutants = airQualityData?.current?.pollutants;
  const stationInfo = airQualityData?.nearestStation;

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
        {envData && (
          <>
            <Text style={styles.locationText}>{envData.location}</Text>
            <View style={styles.mainTempContainer}>
              <Text style={styles.mainTemp}>{envData.temperature}°</Text>
              <Text style={styles.description}>{envData.description}</Text>
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
        {envData && (
          <>
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Air Quality</Text>
                {stationInfo && (
                  <View style={styles.stationInfo}>
                    <MapPin size={12} color={Colors.text.secondary} />
                    <Text style={styles.stationText}>
                      {stationInfo.name} ({stationInfo.distance.toFixed(1)} km)
                    </Text>
                  </View>
                )}
              </View>
              <View style={styles.grid}>
                <View style={styles.gridItem}>
                  <EnvCard
                    title="AQI"
                    value={getAQILabel(currentAQI)}
                    icon={<Activity size={20} color={Colors.status[getAQIStatus(currentAQI)]} />}
                    status={getAQIStatus(currentAQI)}
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
                    title="Humidity"
                    value={envData.humidity}
                    unit="%"
                    icon={<Droplets size={20} color={Colors.primary.blue} />}
                  />
                </View>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Weather Details</Text>
              <View style={styles.grid}>
                <View style={styles.gridItem}>
                  <EnvCard
                    title="Temperature"
                    value={envData.temperature}
                    unit="°C"
                    icon={<Thermometer size={20} color={Colors.primary.blue} />}
                  />
                </View>
                <View style={styles.gridItem}>
                  <EnvCard
                    title="Wind Speed"
                    value={envData.windSpeed.toFixed(1)}
                    unit="m/s"
                    icon={<Wind size={20} color={Colors.primary.blue} />}
                  />
                </View>
                <View style={styles.gridItem}>
                  <EnvCard
                    title="Clouds"
                    value={envData.clouds}
                    unit="%"
                    icon={<Cloud size={20} color={Colors.primary.blue} />}
                  />
                </View>
                <View style={styles.gridItem}>
                  <EnvCard
                    title="Pressure"
                    value={envData.pressure}
                    unit="hPa"
                    icon={<Gauge size={20} color={Colors.primary.blue} />}
                  />
                </View>
              </View>
            </View>
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
