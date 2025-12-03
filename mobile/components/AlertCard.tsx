import React, { memo } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Bell, X } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { Alert } from '@/types';

interface AlertCardProps {
  alert: Alert;
  onPress?: () => void;
  onDismiss?: () => void;
}

const AlertCard = memo(function AlertCard({ alert, onPress, onDismiss }: AlertCardProps) {
  const severityColor = {
    low: Colors.status.good,
    medium: Colors.status.moderate,
    high: Colors.status.unhealthy,
    critical: Colors.status.hazardous,
  }[alert.severity];

  const getTimeAgo = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor(diff / 60000);

    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        !alert.read && styles.unread,
        pressed && styles.pressed,
      ]}
      onPress={onPress}
    >
      <View style={styles.iconContainer}>
        <Bell size={20} color={severityColor} />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>{alert.title}</Text>
        <Text style={styles.message} numberOfLines={2}>
          {alert.message}
        </Text>
        <View style={styles.footer}>
          {alert.location && <Text style={styles.location}>{alert.location}</Text>}
          <Text style={styles.time}>{getTimeAgo(alert.timestamp)}</Text>
        </View>
      </View>

      {onDismiss && (
        <Pressable style={styles.dismissButton} onPress={onDismiss} hitSlop={8}>
          <X size={18} color={Colors.text.light} />
        </Pressable>
      )}
    </Pressable>
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.background.card,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  unread: {
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary.blue,
  },
  pressed: {
    opacity: 0.7,
    backgroundColor: Colors.background.cardPressed,
  },
  indicator: {
    width: 4,
    height: '100%',
    borderRadius: 2,
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
  },
  iconContainer: {
    marginRight: 12,
    marginLeft: 8,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text.primary,
    marginBottom: 4,
  },
  message: {
    fontSize: 14,
    color: Colors.text.secondary,
    lineHeight: 20,
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  location: {
    fontSize: 12,
    color: Colors.text.light,
  },
  time: {
    fontSize: 12,
    color: Colors.text.light,
  },
  dismissButton: {
    padding: 4,
  },
});

export default AlertCard;
