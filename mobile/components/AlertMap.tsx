import React, { useMemo } from 'react';
import { StyleSheet, View, ActivityIndicator, Text } from 'react-native';
import { WebView } from 'react-native-webview';
import type { MapRegion } from '@/types';
import type { IAlert, AlertLevel } from '@smart-forecast/shared';
import { AlertLevelColors } from '@smart-forecast/shared';
import Colors from '@/constants/colors';

// Opacity levels for different alert levels
const ALERT_LEVEL_OPACITY: Record<AlertLevel, number> = {
  LOW: 0.3,
  MEDIUM: 0.4,
  HIGH: 0.5,
  CRITICAL: 0.6,
};

interface Props {
  initialRegion: MapRegion;
  alerts: IAlert[];
  onAlertSelect: (alertId: string) => void;
  isLoading?: boolean;
}

export default function AlertMap({ initialRegion, alerts, onAlertSelect, isLoading }: Props) {
  // Filter alerts with valid polygon areas
  const alertsWithArea = useMemo(() => {
    return alerts.filter((alert) => {
      if (!alert.area?.coordinates?.[0]) return false;
      // Must have at least 3 points to form a polygon
      return alert.area.coordinates[0].length >= 3;
    });
  }, [alerts]);

  // Tạo nội dung HTML chứa bản đồ Leaflet + polygons
  const mapHtml = useMemo(() => {
    const alertsJson = JSON.stringify(alertsWithArea);
    const colorsJson = JSON.stringify(AlertLevelColors);
    const opacityJson = JSON.stringify(ALERT_LEVEL_OPACITY);
    const centerLat = initialRegion.latitude;
    const centerLng = initialRegion.longitude;

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
        <style>
          body { margin: 0; padding: 0; }
          #map { width: 100%; height: 100vh; }
          .alert-popup {
            min-width: 200px;
          }
          .alert-popup h3 {
            margin: 0 0 8px 0;
            font-size: 14px;
            font-weight: 600;
          }
          .alert-popup p {
            margin: 0 0 4px 0;
            font-size: 12px;
            color: #666;
          }
          .alert-level {
            display: inline-block;
            padding: 2px 8px;
            border-radius: 4px;
            font-size: 11px;
            font-weight: 600;
            color: white;
            margin-bottom: 8px;
          }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script>
          // Initialize map
          var map = L.map('map').setView([${centerLat}, ${centerLng}], 11);

          // Add OpenStreetMap tiles
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
          }).addTo(map);

          // Alert data and colors
          var alerts = ${alertsJson};
          var levelColors = ${colorsJson};
          var levelOpacity = ${opacityJson};

          // Level labels in Vietnamese
          var levelLabels = {
            'LOW': 'Thấp',
            'MEDIUM': 'Trung bình',
            'HIGH': 'Cao',
            'CRITICAL': 'Khẩn cấp'
          };

          // Type labels in Vietnamese
          var typeLabels = {
            'WEATHER': 'Thời tiết',
            'AIR_QUALITY': 'Chất lượng KK',
            'DISASTER': 'Thiên tai',
            'ENVIRONMENTAL': 'Môi trường'
          };

          // Check if alert is active (not expired)
          function isAlertActive(alert) {
            if (!alert.expiresAt) return true;
            return new Date() < new Date(alert.expiresAt);
          }

          // Create bounds to fit all polygons
          var bounds = L.latLngBounds([]);
          var hasPolygons = false;

          // Draw polygons for each alert
          alerts.forEach(function(alert) {
            if (!alert.area || !alert.area.coordinates || !alert.area.coordinates[0]) {
              return;
            }

            // Convert GeoJSON [lng, lat] to Leaflet [lat, lng]
            var latlngs = alert.area.coordinates[0].map(function(coord) {
              return [coord[1], coord[0]];
            });

            if (latlngs.length < 3) return;

            var color = levelColors[alert.level] || '#3b82f6';
            var opacity = levelOpacity[alert.level] || 0.4;
            var active = isAlertActive(alert);

            // Create polygon with styling based on level and status
            var polygon = L.polygon(latlngs, {
              color: color,
              fillColor: color,
              fillOpacity: active ? opacity : opacity * 0.5,
              weight: active ? 3 : 1,
              dashArray: active ? null : '5, 5',
              className: 'alert-polygon'
            }).addTo(map);

            // Extend bounds
            bounds.extend(polygon.getBounds());
            hasPolygons = true;

            // Create popup content
            var popupContent = '<div class="alert-popup">' +
              '<span class="alert-level" style="background-color: ' + color + '">' + 
                levelLabels[alert.level] + 
              '</span>' +
              '<h3>' + alert.title + '</h3>' +
              '<p><strong>Loại:</strong> ' + (typeLabels[alert.type] || alert.type) + '</p>' +
              '<p>' + alert.message.substring(0, 100) + (alert.message.length > 100 ? '...' : '') + '</p>' +
              '<p style="color: ' + (active ? '#22c55e' : '#ef4444') + '; font-weight: 600;">' +
                (active ? '⚡ Đang hoạt động' : '⏱️ Đã hết hạn') +
              '</p>' +
            '</div>';

            polygon.bindPopup(popupContent);

            // Handle click - send message to React Native
            polygon.on('click', function() {
              window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'alert',
                id: alert.id
              }));
            });
          });

          // Fit bounds to show all polygons
          if (hasPolygons && bounds.isValid()) {
            map.fitBounds(bounds, { padding: [30, 30], maxZoom: 13 });
          }
        </script>
      </body>
      </html>
    `;
  }, [initialRegion, alertsWithArea]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary.blue} />
        <Text style={styles.loadingText}>Đang tải cảnh báo...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <WebView
        originWhitelist={['*']}
        source={{ html: mapHtml }}
        style={styles.webview}
        onMessage={(event) => {
          try {
            const data = JSON.parse(event.nativeEvent.data);
            if (data.type === 'alert' && data.id) {
              onAlertSelect(data.id);
            }
          } catch {
            // Fallback for simple string message
            console.log('WebView message:', event.nativeEvent.data);
          }
        }}
        startInLoadingState={true}
        renderLoading={() => (
          <View style={styles.loading}>
            <ActivityIndicator size="large" color={Colors.primary.blue} />
          </View>
        )}
      />

      {/* Alert count badge */}
      {alertsWithArea.length > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{alertsWithArea.length} cảnh báo</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  webview: {
    flex: 1,
  },
  loading: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background.primary,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: Colors.text.secondary,
  },
  badge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: Colors.primary.blue,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
});
