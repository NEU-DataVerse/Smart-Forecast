import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Pressable,
  ActivityIndicator,
  Image,
} from 'react-native';
import { Stack, router } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import Colors from '@/constants/colors';

export default function LoginScreen() {
  const { signInWithGoogle, isSigningIn, isAuthenticated } = useAuth();

  // Redirect to home if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated]);

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      router.replace('/(tabs)');
    } catch (error) {
      // Error is already handled in AuthContext
      console.log('Sign in failed');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      <View style={styles.content}>
        {/* Logo/Title Section */}
        <View style={styles.headerSection}>
          <Image
            source={require('@/assets/images/logo-smartforecast.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.subtitle}>Gửi thông báo về môi trường và thời tiết</Text>
        </View>

        {/* Features Section */}
        <View style={styles.featuresSection}>
          <FeatureItem
            icon="🌍"
            title="Giám sát thời gian thực"
            description="Theo dõi chất lượng không khí và thời tiết ngay lập tức"
          />
          <FeatureItem
            icon="⚠️"
            title="Cảnh báo thông minh"
            description="Nhận thông báo về các mối nguy ngay lập tức"
          />
          <FeatureItem
            icon="📊"
            title="Phân tích chi tiết"
            description="Xem dữ liệu môi trường chi tiết và xu hướng lịch sử"
          />
        </View>

        {/* Sign In Section */}
        <View style={styles.signInSection}>
          <Text style={styles.signInTitle}>Bắt đầu</Text>
          <Text style={styles.signInDescription}>
            Đăng nhập bằng tài khoản Google của bạn để truy cập ứng dụng
          </Text>

          <Pressable
            style={[styles.googleButton, isSigningIn && styles.googleButtonDisabled]}
            onPress={handleGoogleSignIn}
            disabled={isSigningIn}
          >
            {isSigningIn ? (
              <ActivityIndicator color={Colors.primary.blue} />
            ) : (
              <View style={styles.googleButtonContent}>
                <Text style={styles.googleIcon}>G</Text>
                <Text style={styles.googleButtonText}>Đăng nhập với Google</Text>
              </View>
            )}
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

interface FeatureItemProps {
  icon: string;
  title: string;
  description: string;
}

const FeatureItem = ({ icon, title, description }: FeatureItemProps) => (
  <View style={styles.featureItem}>
    <Text style={styles.featureIcon}>{icon}</Text>
    <View style={styles.featureTextContainer}>
      <Text style={styles.featureTitle}>{title}</Text>
      <Text style={styles.featureDescription}>{description}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  headerSection: {
    alignItems: 'center',
    marginTop: 40,
  },
  logo: {
    width: 240,
    height: 140,
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 15,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
  featuresSection: {
    marginVertical: 30,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: Colors.background.card,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  featureIcon: {
    fontSize: 28,
    marginRight: 16,
  },
  featureTextContainer: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 13,
    color: Colors.text.secondary,
  },
  signInSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  signInTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 8,
  },
  signInDescription: {
    fontSize: 14,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  messageContainer: {
    backgroundColor: 'rgba(255, 193, 7, 0.9)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#FBC02D',
  },
  messageText: {
    fontSize: 12,
    color: Colors.text.primary,
    fontWeight: '500',
    textAlign: 'center',
  },
  googleButton: {
    width: '100%',
    height: 54,
    backgroundColor: Colors.primary.blue,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 16,
    shadowColor: Colors.primary.blue,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  googleButtonDisabled: {
    opacity: 0.7,
  },
  googleButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  googleIcon: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text.white,
    marginRight: 12,
  },
  googleButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.white,
  },
});
