import React, { useMemo } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import type { MapRegion, Sensor } from '@/types';
import Colors from '@/constants/colors';

interface Props {
  initialRegion: MapRegion;
  sensors: Sensor[];
  onSensorSelect: (sensorId: string) => void;
}

export default function CityMap({ initialRegion, sensors, onSensorSelect }: Props) {
  // Tạo nội dung HTML chứa bản đồ Leaflet + OpenStreetMap
  const mapHtml = useMemo(() => {
    // Chuyển dữ liệu sensors thành JSON để nhúng vào JS
    const sensorsJson = JSON.stringify(sensors);
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
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script>
          // 1. Khởi tạo bản đồ
          var map = L.map('map').setView([${centerLat}, ${centerLng}], 13);

          // 2. Thêm lớp gạch (Tiles) OpenStreetMap (Miễn phí, không cần Key)
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
          }).addTo(map);

          // 3. Fix lỗi icon mặc định của Leaflet khi chạy trong WebView
          var defaultIcon = L.icon({
            iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
            shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
          });

          // 4. Dữ liệu sensors từ React Native truyền vào
          var sensors = ${sensorsJson};

          // 5. Duyệt qua danh sách và tạo Marker
          sensors.forEach(function(sensor) {
            var markerColor = sensor.status === 'active' ? 'green' : 'red';
            
            // Lấy tọa độ (xử lý linh hoạt dù object là location.lat hay lat thẳng)
            var lat = sensor.latitude || (sensor.location && sensor.location.latitude);
            var lng = sensor.longitude || (sensor.location && sensor.location.longitude);

            if (lat && lng) {
              var marker = L.marker([lat, lng], { icon: defaultIcon }).addTo(map);
              
              // Khi click vào marker
              marker.on('click', function() {
                // Gửi tin nhắn ngược về React Native
                window.ReactNativeWebView.postMessage(sensor.id);
              });

              // (Tùy chọn) Hiển thị tên sensor bên dưới marker hoặc popup
              marker.bindPopup("<b>" + sensor.name + "</b><br>AQI: " + (sensor.lastReading.aqi || 'N/A'));
            }
          });
        </script>
      </body>
      </html>
    `;
  }, [initialRegion, sensors]);

  return (
    <View style={styles.container}>
      <WebView
        originWhitelist={['*']}
        source={{ html: mapHtml }}
        style={styles.webview}
        // Nhận tin nhắn từ WebView (khi user click vào marker)
        onMessage={(event) => {
          const sensorId = event.nativeEvent.data;
          console.log('WebView received click:', sensorId);
          onSensorSelect(sensorId);
        }}
        // Hiển thị loading khi đang tải map
        startInLoadingState={true}
        renderLoading={() => (
          <View style={styles.loading}>
            <ActivityIndicator size="large" color={Colors.primary?.blue || 'blue'} />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden', // Bo tròn góc nếu cần
    backgroundColor: '#fff',
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
});
