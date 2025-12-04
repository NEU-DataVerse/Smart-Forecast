import React, { memo } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/colors';

interface WeatherHeaderProps {
  stationName?: string;
  temperature?: number;
  description?: string;
}

const WeatherHeader = memo(function WeatherHeader({
  stationName,
  temperature,
  description,
}: WeatherHeaderProps) {
  return (
    <LinearGradient
      colors={[Colors.gradient.start, Colors.gradient.end]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.header}
    >
      <Text style={styles.headerTitle}>Smart Forecast</Text>
      <Text style={styles.locationText}>{stationName ?? 'Vị trí không xác định'}</Text>
      <View style={styles.mainTempContainer}>
        <Text style={styles.mainTemp}>{temperature !== undefined ? `${temperature}°` : '--°'}</Text>
        {description && <Text style={styles.description}>{description}</Text>}
      </View>
    </LinearGradient>
  );
});

const styles = StyleSheet.create({
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
});

export default WeatherHeader;
