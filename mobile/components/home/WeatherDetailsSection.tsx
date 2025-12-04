import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Thermometer, Wind, Cloud, Gauge, MapPin } from 'lucide-react-native';
import Colors from '@/constants/colors';
import EnvCard from '@/components/EnvCard';
import type { NearestStationInfo } from '@/types';

interface WeatherDetailsSectionProps {
  /** Temperature in Celsius */
  temperature?: number;
  /** Wind speed in m/s */
  windSpeed?: number;
  /** Cloudiness percentage */
  cloudiness?: number;
  /** Atmospheric pressure in hPa */
  pressure?: number;
  /** Nearest station info */
  stationInfo?: NearestStationInfo;
}

const WeatherDetailsSection = memo(function WeatherDetailsSection({
  temperature,
  windSpeed,
  cloudiness,
  pressure,
  stationInfo,
}: WeatherDetailsSectionProps) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Chi tiết thời tiết</Text>
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
            title="Nhiệt độ"
            value={temperature !== undefined ? Math.round(temperature) : '--'}
            unit="°C"
            icon={<Thermometer size={20} color={Colors.primary.blue} />}
          />
        </View>
        <View style={styles.gridItem}>
          <EnvCard
            title="Tốc độ gió"
            value={windSpeed !== undefined ? windSpeed.toFixed(1) : '--'}
            unit="m/s"
            icon={<Wind size={20} color={Colors.primary.blue} />}
          />
        </View>
        <View style={styles.gridItem}>
          <EnvCard
            title="Mây"
            value={cloudiness ?? '--'}
            unit="%"
            icon={<Cloud size={20} color={Colors.primary.blue} />}
          />
        </View>
        <View style={styles.gridItem}>
          <EnvCard
            title="Áp suất"
            value={pressure ?? '--'}
            unit="hPa"
            icon={<Gauge size={20} color={Colors.primary.blue} />}
          />
        </View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
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

export default WeatherDetailsSection;
