import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, Platform, ScrollView } from 'react-native';
import { Stack } from 'expo-router';
import { MapPin } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useAppStore } from '@/store/appStore';
import MapLibreGL from '@maplibre/maplibre-react-native';

export default function MapScreen() {
  const { location, sensors } = useAppStore();
  const [selectedSensor, setSelectedSensor] = useState<string | null>(null);

  const loadMap =
    'https://tiles.goong.io/assets/goong_map_web.json?api_key=b7nUCVjr5WoudnWAr3mTdAtT28783RTQR4BBMkHP';
  const [coordinates] = useState([105.83991, 21.028]); // [lng, lat]
  const camera = useRef(null);

  const handleOnPress = (event: any) => {
    // Handle map press events here
    console.log('Map pressed:', event);
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Environmental Map',
          headerStyle: {
            backgroundColor: Colors.primary.blue,
          },
          headerTintColor: Colors.text.white,
        }}
      />

      {Platform.OS === 'web' ? (
        <View style={styles.webPlaceholder}>
          <MapPin size={64} color={Colors.text.light} />
          <Text style={styles.placeholderText}>Map view is available on mobile devices</Text>
          <Text style={styles.placeholderSubtext}>
            Scan the QR code to view the map on your phone
          </Text>
        </View>
      ) : (
        <>
          <MapLibreGL.MapView
            styleURL={loadMap}
            onPress={handleOnPress}
            style={styles.map}
            projection="globe"
            zoomEnabled={true}
          >
            <MapLibreGL.Camera ref={camera} zoomLevel={6} centerCoordinate={coordinates} />

            {sensors?.map((sensor) => (
              <MapLibreGL.PointAnnotation
                key={sensor.id}
                id={sensor.id}
                coordinate={[sensor.longitude, sensor.latitude]}
                onSelected={() => setSelectedSensor(sensor.id)}
              >
                <View style={styles.markerContainer}>
                  <MapPin size={32} color={Colors.primary.blue} />
                </View>
              </MapLibreGL.PointAnnotation>
            ))}
          </MapLibreGL.MapView>

          {selectedSensor && (
            <View style={styles.infoPanel}>
              {(() => {
                const sensor = sensors.find((s) => s.id === selectedSensor);
                if (!sensor) return null;
                return (
                  <ScrollView>
                    <Text style={styles.infoTitle}>{sensor.name}</Text>
                    <Text style={styles.infoSubtitle}>
                      {sensor.type.replace('_', ' ').toUpperCase()}
                    </Text>

                    <View style={styles.infoGrid}>
                      {sensor.lastReading.aqi && (
                        <View style={styles.infoItem}>
                          <Text style={styles.infoLabel}>AQI</Text>
                          <Text style={styles.infoValue}>{sensor.lastReading.aqi}</Text>
                        </View>
                      )}
                      {sensor.lastReading.temperature && (
                        <View style={styles.infoItem}>
                          <Text style={styles.infoLabel}>Temperature</Text>
                          <Text style={styles.infoValue}>{sensor.lastReading.temperature}°C</Text>
                        </View>
                      )}
                      {sensor.lastReading.humidity && (
                        <View style={styles.infoItem}>
                          <Text style={styles.infoLabel}>Humidity</Text>
                          <Text style={styles.infoValue}>{sensor.lastReading.humidity}%</Text>
                        </View>
                      )}
                    </View>

                    <View
                      style={[
                        styles.statusBadge,
                        {
                          backgroundColor:
                            sensor.status === 'active'
                              ? Colors.status.good
                              : Colors.status.unhealthy,
                        },
                      ]}
                    >
                      <Text style={styles.statusText}>{sensor.status.toUpperCase()}</Text>
                    </View>
                  </ScrollView>
                );
              })()}
            </View>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  markerContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.primary.blue,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  webPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background.primary,
    padding: 40,
  },
  placeholderText: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: Colors.text.primary,
    marginTop: 24,
    textAlign: 'center',
  },
  placeholderSubtext: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginTop: 8,
    textAlign: 'center',
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
    maxHeight: 300,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
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
    fontWeight: '600' as const,
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
    fontWeight: '600' as const,
    color: Colors.text.white,
  },
});
