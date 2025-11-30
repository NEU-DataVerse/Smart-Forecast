import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Stack } from 'expo-router';
import { Bell, AlertTriangle } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useAppStore } from '@/store/appStore';
import AlertCard from '@/components/AlertCard';
import { useNotification } from '@/context/NotificationContext';

export default function AlertsScreen() {
  const { alerts, markAlertAsRead } = useAppStore();

  const unreadCount = alerts.filter((a) => !a.read).length;
  const { expoPushToken, notification, error } = useNotification();

  if (error) {
    console.error('Notification Error:', error);
  }

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Alerts',
          headerStyle: {
            backgroundColor: Colors.primary.blue,
          },
          headerTintColor: Colors.text.white,
        }}
      />

      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerIcon}>
            <Bell size={24} color={Colors.primary.blue} />
            {unreadCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{unreadCount}</Text>
              </View>
            )}
          </View>
          <View>
            <Text style={styles.headerTitle}>Các cảnh báo</Text>
            <Text style={styles.headerSubtitle}>
              {unreadCount > 0 ? `${unreadCount} unread` : 'Đã đọc hết!'}
            </Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {alerts.length === 0 ? (
          <View style={styles.emptyState}>
            <AlertTriangle size={64} color={Colors.text.light} />
            <Text style={styles.emptyText}>Chưa có thông báo nào</Text>
            <Text style={styles.emptySubtext}>
              Bạn sẽ nhận được cảnh báo tự động khi có sự kiện môi trường quan trọng xảy ra.
            </Text>
          </View>
        ) : (
          <>
            {alerts.map((alert) => (
              <AlertCard key={alert.id} alert={alert} onPress={() => markAlertAsRead(alert.id)} />
            ))}
          </>
        )}

        <Pressable style={styles.infoCard}>
          <Text>{expoPushToken}</Text>
          <Text>{notification?.request.content.title}</Text>
          {JSON.stringify(notification?.request.content.data, null, 2)}

          <Text style={styles.infoTitle}>Về các cảnh báo</Text>
          <Text style={styles.infoText}>Bạn sẽ nhận được cảnh báo tự động khi:</Text>
          <View style={styles.infoList}>
            <Text style={styles.infoItem}>• AQI vượt quá ngưỡng an toàn</Text>
            <Text style={styles.infoItem}>• Cảnh báo lũ lụt được phát hành</Text>
            <Text style={styles.infoItem}>• Nguy cơ sạt lở đất được phát hiện</Text>
            <Text style={styles.infoItem}>• Thời tiết nghiêm trọng đang đến gần</Text>
          </View>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  header: {
    backgroundColor: Colors.background.card,
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    marginRight: 16,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: Colors.status.unhealthy,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700' as const,
    color: Colors.text.white,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.text.primary,
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 20,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600' as const,
    color: Colors.text.primary,
    marginTop: 24,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  infoCard: {
    backgroundColor: Colors.background.card,
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 40,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text.primary,
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 12,
  },
  infoList: {
    marginLeft: 8,
  },
  infoItem: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 6,
    lineHeight: 20,
  },
});
