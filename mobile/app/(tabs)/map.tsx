import React, { useMemo, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Modal } from 'react-native';
import { Stack } from 'expo-router';
import { AlertTriangle, X, Clock, Info, MapPin } from 'lucide-react-native';
import AlertMap from '@/components/AlertMap';
import Colors from '@/constants/colors';
import { useActiveAlerts, useRefreshAlerts } from '@/hooks/useAlerts';
import {
  IAlert,
  AlertLevelColors,
  AlertLevelLabels,
  AlertTypeLabels,
} from '@smart-forecast/shared';

type MapRegion = {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
};

export default function MapScreen() {
  // Alert state
  const { data: alerts, isLoading } = useActiveAlerts();
  const { refreshActive } = useRefreshAlerts();
  const [selectedAlert, setSelectedAlert] = useState<IAlert | null>(null);
  const [showAlertModal, setShowAlertModal] = useState(false);

  const initialRegion = useMemo<MapRegion>(
    () => ({
      latitude: 10.762622,
      longitude: 106.660172,
      latitudeDelta: 0.1,
      longitudeDelta: 0.1,
    }),
    [],
  );

  const handleAlertSelect = useCallback(
    (alertId: string) => {
      const alert = alerts?.find((a) => a.id === alertId);
      if (alert) {
        setSelectedAlert(alert);
        setShowAlertModal(true);
      }
    },
    [alerts],
  );

  const isAlertActive = (alert: IAlert): boolean => {
    if (!alert.expiresAt) return true;
    return new Date() < new Date(alert.expiresAt);
  };

  const formatDate = (date: Date | string): string => {
    const d = new Date(date);
    return d.toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <View style={styles.container} testID="map-screen">
      <Stack.Screen
        options={{
          title: 'Bản đồ Cảnh báo',
          headerStyle: { backgroundColor: Colors.primary.blue },
          headerTintColor: Colors.text.white,
        }}
      />

      {/* Alert Map */}
      <AlertMap
        initialRegion={initialRegion}
        alerts={alerts ?? []}
        onAlertSelect={handleAlertSelect}
        isLoading={isLoading}
      />

      {/* Alert Detail Modal */}
      <Modal
        visible={showAlertModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAlertModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Pressable style={styles.closeButton} onPress={() => setShowAlertModal(false)}>
              <X size={24} color={Colors.text.primary} />
            </Pressable>

            {selectedAlert && (
              <ScrollView showsVerticalScrollIndicator={false}>
                {/* Level Badge */}
                <View
                  style={[
                    styles.modalLevelBadge,
                    { backgroundColor: AlertLevelColors[selectedAlert.level] || '#3b82f6' },
                  ]}
                >
                  <AlertTriangle size={16} color="#fff" />
                  <Text style={styles.modalLevelText}>
                    {AlertLevelLabels[selectedAlert.level] || selectedAlert.level}
                  </Text>
                </View>

                {/* Title */}
                <Text style={styles.modalTitle}>{selectedAlert.title}</Text>

                {/* Type */}
                <View style={styles.modalInfoRow}>
                  <Info size={16} color={Colors.text.secondary} />
                  <Text style={styles.modalInfoLabel}>Loại:</Text>
                  <Text style={styles.modalInfoValue}>
                    {AlertTypeLabels[selectedAlert.type] || selectedAlert.type}
                  </Text>
                </View>

                {/* Time */}
                <View style={styles.modalInfoRow}>
                  <Clock size={16} color={Colors.text.secondary} />
                  <Text style={styles.modalInfoLabel}>Gửi lúc:</Text>
                  <Text style={styles.modalInfoValue}>{formatDate(selectedAlert.sentAt)}</Text>
                </View>

                {/* Expires */}
                {selectedAlert.expiresAt && (
                  <View style={styles.modalInfoRow}>
                    <Clock size={16} color={Colors.text.secondary} />
                    <Text style={styles.modalInfoLabel}>Hết hạn:</Text>
                    <Text
                      style={[
                        styles.modalInfoValue,
                        !isAlertActive(selectedAlert) && styles.expiredText,
                      ]}
                    >
                      {formatDate(selectedAlert.expiresAt)}
                      {!isAlertActive(selectedAlert) && ' (Đã hết hạn)'}
                    </Text>
                  </View>
                )}

                {/* Area indicator */}
                {selectedAlert.area && (
                  <View style={styles.modalInfoRow}>
                    <MapPin size={16} color={Colors.text.secondary} />
                    <Text style={styles.modalInfoLabel}>Khu vực:</Text>
                    <Text style={styles.modalInfoValue}>Có vùng ảnh hưởng</Text>
                  </View>
                )}

                {/* Message */}
                <Text style={styles.modalSectionTitle}>Nội dung</Text>
                <Text style={styles.modalMessage}>{selectedAlert.message}</Text>

                {/* Advice */}
                {selectedAlert.advice && (
                  <>
                    <Text style={styles.modalSectionTitle}>Khuyến cáo</Text>
                    <View style={styles.adviceBox}>
                      <Text style={styles.adviceText}>{selectedAlert.advice}</Text>
                    </View>
                  </>
                )}
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.background.primary,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '80%',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
    padding: 4,
  },
  modalLevelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 12,
  },
  modalLevelText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: 16,
    paddingRight: 40,
  },
  modalInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  modalInfoLabel: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  modalInfoValue: {
    fontSize: 14,
    color: Colors.text.primary,
    fontWeight: '500',
  },
  expiredText: {
    color: '#ef4444',
  },
  modalSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginTop: 16,
    marginBottom: 8,
  },
  modalMessage: {
    fontSize: 14,
    color: Colors.text.secondary,
    lineHeight: 22,
  },
  adviceBox: {
    backgroundColor: '#fef3c7',
    borderRadius: 8,
    padding: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#f59e0b',
  },
  adviceText: {
    fontSize: 14,
    color: '#92400e',
    lineHeight: 20,
  },
});
