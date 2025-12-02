import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Stack } from 'expo-router';
// import Colors from '@/constants/colors'; // Giả sử bạn có file này
// import { useAppStore } from '@/store/appStore'; // Giả sử bạn có store này
import CityMap from '@/components/CityMap'; // Import component vừa tạo ở Bước 2

// --- MOCK DATA & CONSTANTS (Để chạy demo, bạn có thể xóa phần này nếu đã có file thật) ---
const Colors = {
  primary: { blue: '#007AFF' },
  text: { white: '#FFFFFF', primary: '#000000', secondary: '#666666', light: '#999999' },
  background: { card: '#FFFFFF' },
  status: { good: '#34C759', unhealthy: '#FF3B30' },
  shadow: '#000',
};

// Định nghĩa lại Type nếu chưa có
type MapRegion = {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
};

type Sensor = {
  id: string;
  name: string;
  type: string;
  location: { latitude: number; longitude: number };
  lastReading: { aqi?: number; temperature?: number; humidity?: number };
  status: 'active' | 'inactive';
};

// Mock Store Hook
const useAppStore = () => ({
  location: { latitude: 10.762622, longitude: 106.660172 }, // TP.HCM
  sensors: [
    {
      id: 's1',
      name: 'Sensor District 1',
      type: 'air_quality',
      location: { latitude: 10.7756, longitude: 106.7004 }, // Chợ Bến Thành
      lastReading: { aqi: 45, temperature: 30, humidity: 65 },
      status: 'active',
    },
    {
      id: 's2',
      name: 'Sensor District 5',
      type: 'air_quality',
      location: { latitude: 10.7546, longitude: 106.6664 },
      lastReading: { aqi: 112, temperature: 31, humidity: 60 },
      status: 'active',
    },
  ] as Sensor[],
});
// ---------------------------------------------------------------------------------

export default function MapScreen() {
  const { location, sensors } = useAppStore();
  const [selectedSensor, setSelectedSensor] = useState<string | null>(null);

  const initialRegion = useMemo<MapRegion>(
    () => ({
      latitude: location?.latitude ?? 10.8231,
      longitude: location?.longitude ?? 106.6297,
      latitudeDelta: 0.05, // Zoom gần hơn một chút để thấy rõ đường phố
      longitudeDelta: 0.05,
    }),
    [location?.latitude, location?.longitude],
  );

  const activeSensor = useMemo<Sensor | null>(() => {
    if (!selectedSensor) return null;
    return sensors.find((sensor) => sensor.id === selectedSensor) ?? null;
  }, [selectedSensor, sensors]);

  return (
    <View style={styles.container} testID="map-screen">
      <Stack.Screen
        options={{
          title: 'Bản đồ OpenStreetMap',
          headerStyle: { backgroundColor: Colors.primary.blue },
          headerTintColor: Colors.text.white,
        }}
      />

      <CityMap
        initialRegion={initialRegion}
        sensors={sensors}
        onSensorSelect={(sensorId) => {
          console.log('MapScreen sensor selected', sensorId);
          setSelectedSensor(sensorId);
        }}
      />

      {activeSensor && (
        <View style={styles.infoPanel} testID="sensor-info-panel">
          <ScrollView>
            <Text style={styles.infoTitle}>{activeSensor.name}</Text>
            <Text style={styles.infoSubtitle}>
              {activeSensor.type.replace('_', ' ').toUpperCase()}
            </Text>

            <View style={styles.infoGrid}>
              {activeSensor.lastReading.aqi !== undefined && (
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>AQI</Text>
                  <Text style={styles.infoValue}>{activeSensor.lastReading.aqi}</Text>
                </View>
              )}
              {activeSensor.lastReading.temperature !== undefined && (
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Temp</Text>
                  <Text style={styles.infoValue}>{activeSensor.lastReading.temperature}°C</Text>
                </View>
              )}
              {activeSensor.lastReading.humidity !== undefined && (
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Humidity</Text>
                  <Text style={styles.infoValue}>{activeSensor.lastReading.humidity}%</Text>
                </View>
              )}
            </View>

            <View
              style={[
                styles.statusBadge,
                {
                  backgroundColor:
                    activeSensor.status === 'active' ? Colors.status.good : Colors.status.unhealthy,
                },
              ]}
            >
              <Text style={styles.statusText}>{activeSensor.status.toUpperCase()}</Text>
            </View>
          </ScrollView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  infoPanel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.background.card,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40, // Thêm padding đáy cho an toàn trên iPhone X+
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  infoSubtitle: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 16,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  infoItem: {
    width: '33.33%',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 12,
    color: Colors.text.light,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text.white,
  },
});
