import React, { useState } from 'react';
import { View, Text, StyleSheet, Platform, ScrollView, TouchableOpacity } from 'react-native';
import { Stack } from 'expo-router';
import { X } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useAppStore } from '@/store/appStore';
import { getAQIColor, getStatusColor } from '@/utils/mapLayerOptimization';

let MapLibreGL: any = null;

if (Platform.OS !== 'web') {
  MapLibreGL = require('@maplibre/maplibre-react-native').default;
  MapLibreGL.setAccessToken(null); // No token needed for OSM
}

export default function MapScreen() {
  const { location, sensors } = useAppStore();
  const [selectedSensor, setSelectedSensor] = useState<string | null>(null);

  const initialCoords = [location?.longitude || 106.6297, location?.latitude || 10.8231];

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
          <Text style={styles.placeholderText}>Map view is available on mobile devices</Text>
          <Text style={styles.placeholderSubtext}>
            Scan the QR code to view the map on your phone
          </Text>
        </View>
      ) : (
        <>
          <MapLibreGL.MapView
            style={styles.map}
            styleURL="https://demotiles.maplibre.org/style.json"
          >
            <MapLibreGL.Camera zoomLevel={12} centerCoordinate={initialCoords} />

            {sensors?.map((sensor) => {
              const aqi = sensor.lastReading?.aqi || 0;
              const markerColor = aqi > 0 ? getAQIColor(aqi) : getStatusColor(sensor.status);

              return (
                <MapLibreGL.PointAnnotation
                  key={sensor.id}
                  id={sensor.id}
                  coordinate={[sensor.longitude, sensor.latitude]}
                  onSelected={() => setSelectedSensor(sensor.id)}
                >
                  <View
                    style={[
                      styles.marker,
                      {
                        backgroundColor: markerColor,
                        borderColor: markerColor,
                      },
                    ]}
                  />
                </MapLibreGL.PointAnnotation>
              );
            })}
          </MapLibreGL.MapView>

          {selectedSensor && (
            <View style={styles.infoPanel}>
              {(() => {
                const sensor = sensors.find((s) => s.id === selectedSensor);
                if (!sensor) return null;
                const aqi = sensor.lastReading.aqi || 0;
                return (
                  <>
                    <View style={styles.infoPanelHeader}>
                      <View style={styles.infoPanelTitleContainer}>
                        <Text style={styles.infoTitle}>{sensor.name}</Text>
                        <Text style={styles.infoSubtitle}>
                          {sensor.type.replace('_', ' ').toUpperCase()}
                        </Text>
                      </View>
                      <TouchableOpacity
                        onPress={() => setSelectedSensor(null)}
                        style={styles.closeButton}
                      >
                        <X size={24} color={Colors.text.light} />
                      </TouchableOpacity>
                    </View>

                    <ScrollView>
                      <View style={styles.infoGrid}>
                        {aqi > 0 && (
                          <View style={styles.infoItem}>
                            <Text style={styles.infoLabel}>AQI</Text>
                            <Text style={[styles.infoValue, { color: getAQIColor(aqi) }]}>
                              {aqi}
                            </Text>
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
                                ? getStatusColor('active')
                                : getStatusColor('inactive'),
                          },
                        ]}
                      >
                        <Text style={styles.statusText}>{sensor.status.toUpperCase()}</Text>
                      </View>
                    </ScrollView>
                  </>
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
  marker: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
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
  infoPanelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  infoPanelTitleContainer: {
    flex: 1,
    marginRight: 12,
  },
  closeButton: {
    padding: 8,
    marginRight: -8,
    marginTop: -8,
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
    marginBottom: 0,
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
