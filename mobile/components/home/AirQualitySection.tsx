import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Activity, Droplets, MapPin } from 'lucide-react-native';
import Colors from '@/constants/colors';
import EnvCard from '@/components/EnvCard';
import { getEPAAQIStatus, getEPAAQILabelVi } from '@/utils/aqi';
import type { Pollutants, NearestStationInfo } from '@/types';

interface AirQualitySectionProps {
  /** EPA US AQI index (0-500) */
  aqiIndex: number;
  /** English level string from API (optional, for translation) */
  aqiLevel?: string;
  /** Pollutants data */
  pollutants?: Pollutants;
  /** Humidity percentage */
  humidity?: number;
  /** Nearest station info */
  stationInfo?: NearestStationInfo;
}

const AirQualitySection = memo(function AirQualitySection({
  aqiIndex,
  aqiLevel,
  pollutants,
  humidity,
  stationInfo,
}: AirQualitySectionProps) {
  const aqiStatus = getEPAAQIStatus(aqiIndex);
  const aqiLabel = getEPAAQILabelVi(aqiIndex, aqiLevel);

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Chất lượng không khí</Text>
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
            value={aqiIndex}
            unit={aqiLabel}
            icon={<Activity size={20} color={Colors.status[aqiStatus]} />}
            status={aqiStatus}
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
            value={humidity ?? '--'}
            unit="%"
            icon={<Droplets size={20} color={Colors.primary.blue} />}
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

export default AirQualitySection;
