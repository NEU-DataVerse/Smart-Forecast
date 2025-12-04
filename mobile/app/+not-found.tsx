import { Link, Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { AlertCircle } from 'lucide-react-native';
import Colors from '@/constants/colors';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Không tìm thấy trang' }} />
      <View style={styles.container}>
        <AlertCircle size={64} color={Colors.text.light} />
        <Text style={styles.title}>Không tìm thấy trang</Text>
        <Text style={styles.subtitle}>Trang bạn đang tìm kiếm không tồn tại.</Text>
        <Link href="/" style={styles.link}>
          <Text style={styles.linkText}>Về trang chủ</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    backgroundColor: Colors.background.primary,
  },
  title: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.text.primary,
    marginTop: 24,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  link: {
    backgroundColor: Colors.primary.blue,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  linkText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text.white,
  },
});
