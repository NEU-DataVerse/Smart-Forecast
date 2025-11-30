import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Colors from '@/constants/colors';

interface EnvCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon?: React.ReactNode;
  status?: 'good' | 'moderate' | 'unhealthy' | 'hazardous';
  onPress?: () => void;
}

export default function EnvCard({ title, value, unit, icon, status, onPress }: EnvCardProps) {
  const statusColor = status ? Colors.status[status] : Colors.primary.blue;

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      onPress={onPress}
    >
      <View style={styles.cardHeader}>
        <View style={styles.iconContainer}>{icon}</View>
        <Text style={styles.title}>{title}</Text>
      </View>
      <View style={styles.valueContainer}>
        <Text style={styles.value}>{value}</Text>
        {unit && <Text style={styles.unit}>{unit}</Text>}
      </View>
      {status && <View style={[styles.statusBar, { backgroundColor: statusColor }]} />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.background.card,
    borderRadius: 16,
    padding: 16,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    minHeight: 120,
    justifyContent: 'space-between',
  },
  cardPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    marginRight: 8,
  },
  title: {
    fontSize: 14,
    color: Colors.text.secondary,
    fontWeight: '500' as const,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  value: {
    fontSize: 32,
    fontWeight: '700' as const,
    color: Colors.text.primary,
  },
  unit: {
    fontSize: 18,
    color: Colors.text.secondary,
    marginLeft: 4,
    fontWeight: '600' as const,
  },
  statusBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 4,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
});
