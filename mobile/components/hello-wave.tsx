import { StyleSheet, Text } from 'react-native';

const styles = StyleSheet.create({
  wave: {
    fontSize: 28,
    lineHeight: 32,
    marginTop: -6,
  },
});

export function HelloWave() {
  return <Text style={styles.wave}>👋</Text>;
}
