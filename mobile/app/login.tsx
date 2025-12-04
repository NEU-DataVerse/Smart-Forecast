import React from 'react';
import { View, Text, StyleSheet, Pressable, ActivityIndicator, Image } from 'react-native';
import { Stack, router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';
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
    } catch {
      // Error is already handled in AuthContext
      console.log('Sign in failed');
    }
  };

  return (
    <LinearGradient
      colors={[Colors.gradient.start, Colors.gradient.end]}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      <View style={styles.content}>
        {/* Logo Section */}
        <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.logoSection}>
          <View style={styles.logoContainer}>
            <Image
              source={require('@/assets/images/logo-smartforecast.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.tagline}>Theo dõi môi trường thông minh</Text>
        </Animated.View>

        {/* Sign In Section */}
        <Animated.View entering={FadeInUp.delay(300).springify()} style={styles.signInSection}>
          <Pressable
            style={({ pressed }) => [
              styles.googleButton,
              isSigningIn && styles.googleButtonDisabled,
              pressed && styles.googleButtonPressed,
            ]}
            onPress={handleGoogleSignIn}
            disabled={isSigningIn}
          >
            {isSigningIn ? (
              <ActivityIndicator color={Colors.primary.blue} size="small" />
            ) : (
              <View style={styles.googleButtonContent}>
                <View style={styles.googleIconContainer}>
                  <Text style={styles.googleIcon}>G</Text>
                </View>
                <Text style={styles.googleButtonText}>Tiếp tục với Google</Text>
              </View>
            )}
          </Pressable>
        </Animated.View>

        {/* Footer */}
        <Animated.View entering={FadeInUp.delay(500).springify()} style={styles.footer}>
          <Text style={styles.footerText}>
            Bằng việc đăng nhập, bạn đồng ý với{' '}
            <Text style={styles.footerLink}>Điều khoản sử dụng</Text> và{' '}
            <Text style={styles.footerLink}>Chính sách bảo mật</Text>
          </Text>
        </Animated.View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 120,
    paddingBottom: 50,
  },
  logoSection: {
    alignItems: 'center',
  },
  logoContainer: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(248, 250, 251, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  logo: {
    width: 140,
    height: 100,
  },
  tagline: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    fontWeight: '500',
  },
  signInSection: {
    width: '100%',
    alignItems: 'center',
  },
  googleButton: {
    width: '100%',
    height: 56,
    backgroundColor: Colors.text.white,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  googleButtonDisabled: {
    opacity: 0.7,
  },
  googleButtonPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.9,
  },
  googleButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  googleIconContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.text.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  googleIcon: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4285F4',
  },
  googleButtonText: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  footer: {
    paddingHorizontal: 20,
  },
  footerText: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    lineHeight: 20,
  },
  footerLink: {
    textDecorationLine: 'underline',
    fontWeight: '500',
  },
});
