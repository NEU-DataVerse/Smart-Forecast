import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/colors';

interface GradientHeaderProps {
  title: string;
  subtitle?: string;
}

export default function GradientHeader({ title, subtitle }: GradientHeaderProps) {
  return (
    <LinearGradient
      colors={[Colors.gradient.start, Colors.gradient.end]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.header}
    >
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: Colors.text.white,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.text.white,
    opacity: 0.9,
  },
});
