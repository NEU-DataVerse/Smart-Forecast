import React, { useMemo, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
// eslint-disable-next-line import/no-unresolved
import WebView from 'react-native-webview';
import type { MapRegion, Sensor } from '@/types';

interface Props {
  initialRegion: MapRegion;
  sensors: Sensor[];
  onSensorSelect: (sensorId: string) => void;
}

/**
 * Web-only component using WebView with Leaflet for OpenStreetMap
 * This only loads on web platform, not on native
 */
export default function CityMapWeb({ initialRegion, sensors, onSensorSelect }: Props) {
  const webViewRef = React.useRef<WebView>(null);

  const htmlContent = useMemo(() => {
    const markersScript = sensors
      .map(
        (sensor) =>
          `
        const marker${sensor.id} = L.marker([${sensor.latitude}, ${sensor.longitude}], {
          title: "${sensor.name.replace(/"/g, '\\"')}"
        });
        marker${sensor.id}.bindPopup(\`
          <div style="font-family: Arial; font-size: 12px; width: 200px;">
            <strong>${sensor.name.replace(/"/g, '\\"')}</strong><br/>
            <small>${sensor.type.replace('_', ' ').toUpperCase()}</small><br/>
            <hr style="margin: 6px 0;"/>
            ${sensor.lastReading.aqi ? `AQI: <strong>${sensor.lastReading.aqi}</strong><br/>` : ''}
            ${
              sensor.lastReading.temperature
                ? `Temperature: <strong>${sensor.lastReading.temperature}°C</strong><br/>`
                : ''
            }
            ${
              sensor.lastReading.humidity
                ? `Humidity: <strong>${sensor.lastReading.humidity}%</strong><br/>`
                : ''
            }
            Status: <span style="color: ${sensor.status === 'active' ? 'green' : 'red'}; font-weight: bold;">
              ${sensor.status.toUpperCase()}
            </span>
          </div>
        \`);
        marker${sensor.id}.on('click', function() {
          window.postMessage({ type: 'sensorSelect', sensorId: '${sensor.id}' }, '*');
        });
        marker${sensor.id}.addTo(map);
      `,
      )
      .join('\n');

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css" />
        <script src="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js"></script>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          html, body { width: 100%; height: 100%; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
          #map { width: 100%; height: 100%; }
          .leaflet-popup-content { margin: 0; }
          .leaflet-popup-content-wrapper { border-radius: 8px; }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script>
          const map = L.map('map').setView([${initialRegion.latitude}, ${initialRegion.longitude}], 11);
          
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19,
            minZoom: 2
          }).addTo(map);
          
          // User location marker
          L.circleMarker([${initialRegion.latitude}, ${initialRegion.longitude}], {
            radius: 8,
            fillColor: '#0066cc',
            color: '#0066cc',
            weight: 2,
            opacity: 1,
            fillOpacity: 0.8,
            className: 'user-marker'
          }).bindPopup('<strong>Your Location</strong>').addTo(map);
          
          // Add sensor markers
          ${markersScript}
          
          // Handle map load
          map.on('load', function() {
            map.invalidateSize();
          });
          
          // Listen for parent messages
          window.addEventListener('message', function(event) {
            if (event.data.type === 'getMapStatus') {
              window.parent.postMessage({ type: 'mapReady' }, '*');
            }
          });
        </script>
      </body>
      </html>
    `;
  }, [initialRegion, sensors]);

  const handleMessage = useCallback(
    (event: any) => {
      try {
        const data = JSON.parse(event.nativeEvent.data);
        if (data.type === 'sensorSelect') {
          console.log('Map selected sensor:', data.sensorId);
          onSensorSelect(data.sensorId);
        }
      } catch (error) {
        console.error('Error handling WebView message:', error);
      }
    },
    [onSensorSelect],
  );

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        source={{ html: htmlContent }}
        style={styles.webview}
        scrollEnabled={false}
        zoomEnabled={false}
        javaScriptEnabled={true}
        onMessage={handleMessage}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  webview: {
    flex: 1,
  },
});
