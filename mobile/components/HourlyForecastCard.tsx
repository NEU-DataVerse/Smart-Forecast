import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
  Sun,
  Cloud,
  CloudRain,
  CloudSnow,
  CloudLightning,
  CloudFog,
  Wind,
  Droplets,
} from 'lucide-react-native';
import Colors from '@/constants/colors';

export type ForecastStatus = 'good' | 'moderate' | 'unhealthy' | 'hazardous';

interface HourlyForecastCardProps {
  time: string; // "09:00", "T2", "T3", etc.
  icon?: string; // OWM icon code: "01d", "02n", etc.
  value: number | string;
  unit?: string;
  status?: ForecastStatus;
  type?: 'weather' | 'air-quality';
}

// Map OWM icon codes to lucide icons
const getWeatherIconComponent = (iconCode: string, size: number, color: string) => {
  const code = iconCode?.slice(0, 2) || '01';

  switch (code) {
    case '01': // clear sky
      return <Sun size={size} color={color} />;
    case '02': // few clouds
    case '03': // scattered clouds
    case '04': // broken/overcast clouds
      return <Cloud size={size} color={color} />;
    case '09': // shower rain
    case '10': // rain
      return <CloudRain size={size} color={color} />;
    case '11': // thunderstorm
      return <CloudLightning size={size} color={color} />;
    case '13': // snow
      return <CloudSnow size={size} color={color} />;
    case '50': // mist/fog
      return <CloudFog size={size} color={color} />;
    default:
      return <Sun size={size} color={color} />;
  }
};

// Get AQI status color and icon
const getAQIStatusColor = (status?: ForecastStatus): string => {
  if (!status) return Colors.primary.blue;
  return Colors.status[status] || Colors.primary.blue;
};

const HourlyForecastCard = memo(function HourlyForecastCard({
  time,
  icon,
  value,
  unit,
  status,
  type = 'weather',
}: HourlyForecastCardProps) {
  const statusColor = status ? getAQIStatusColor(status) : Colors.primary.blue;
  const iconColor = type === 'air-quality' ? statusColor : Colors.primary.blue;

  return (
    <View style={styles.card}>
      <Text style={styles.time}>{time}</Text>

      <View style={styles.iconContainer}>
        {type === 'weather' && icon ? (
          getWeatherIconComponent(icon, 28, iconColor)
        ) : type === 'air-quality' ? (
          <Wind size={28} color={iconColor} />
        ) : (
          <Droplets size={28} color={iconColor} />
        )}
      </View>

      <View style={styles.valueContainer}>
        <Text style={[styles.value, status && { color: statusColor }]}>{value}</Text>
        {unit && <Text style={styles.unit}>{unit}</Text>}
      </View>

      {status && <View style={[styles.statusDot, { backgroundColor: statusColor }]} />}
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    width: 80,
    height: 120,
    backgroundColor: Colors.background.card,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 8,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  time: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text.secondary,
  },
  iconContainer: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  value: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  unit: {
    fontSize: 12,
    color: Colors.text.secondary,
    marginLeft: 2,
  },
  statusDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});

export default HourlyForecastCard;
