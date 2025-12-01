import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  Alert,
  Pressable,
  Platform,
} from 'react-native';
import { Stack } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';

export default function LoginScreen() {
  const { signInWithGoogle, isSigningIn } = useAuth();
  const [loginMessage, setLoginMessage] = React.useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    try {
      setLoginMessage(null);
      await signInWithGoogle();
      // If we get here, login was successful
      setLoginMessage(null);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Sign in failed. Please try again.';

      // Check if this is a demo account fallback
      if (errorMessage.includes('demo account')) {
        setLoginMessage('Using demo account for testing...');
        Alert.alert('Demo Mode', 'Google Sign-In unavailable. Using demo account for testing.');
      } else {
        Alert.alert('Sign In Failed', errorMessage);
      }

      console.error('Login error:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      <LinearGradient colors={['#667eea', '#764ba2']} style={styles.gradient}>
        <View style={styles.content}>
          {/* Logo/Title Section */}
          <View style={styles.headerSection}>
            <Text style={styles.title}>Smart Forecast</Text>
            <Text style={styles.subtitle}>Environmental Monitoring & Alerts</Text>
          </View>

          {/* Features Section */}
          <View style={styles.featuresSection}>
            <FeatureItem
              icon="🌍"
              title="Real-time Monitoring"
              description="Track air quality and weather"
            />
            <FeatureItem
              icon="⚠️"
              title="Smart Alerts"
              description="Get notified of hazards instantly"
            />
            <FeatureItem
              icon="📊"
              title="Analytics"
              description="View detailed environmental data"
            />
          </View>

          {/* Sign In Section */}
          <View style={styles.signInSection}>
            <Text style={styles.signInTitle}>Get Started</Text>
            <Text style={styles.signInDescription}>
              {Platform.OS === 'web'
                ? 'Click Sign In to access the app (Demo mode on web)'
                : 'Sign in with your Google account to access all features'}
            </Text>

            {loginMessage && (
              <View style={styles.messageContainer}>
                <Text style={styles.messageText}>{loginMessage}</Text>
              </View>
            )}

            {isSigningIn ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#667eea" />
                <Text style={styles.loadingText}>Signing in...</Text>
              </View>
            ) : (
              <View style={styles.buttonContainer}>
                <Pressable style={styles.googleButton} onPress={handleGoogleSignIn}>
                  <Text style={styles.googleButtonText}>Sign in with Google</Text>
                </Pressable>
              </View>
            )}

            <Text style={styles.termsText}>
              By signing in, you agree to our Terms of Service and Privacy Policy
            </Text>
          </View>
        </View>
      </LinearGradient>
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
    <View>
      <Text style={styles.featureTitle}>{title}</Text>
      <Text style={styles.featureDescription}>{description}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  headerSection: {
    alignItems: 'center',
    marginTop: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  featuresSection: {
    marginVertical: 40,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
  },
  featureIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  signInSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  signInTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  signInDescription: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.8)',
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
    color: '#333',
    fontWeight: '500',
    textAlign: 'center',
  },
  googleButton: {
    width: '100%',
    height: 48,
    backgroundColor: '#4285F4',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 16,
  },
  googleButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  fallbackButton: {
    width: '100%',
    height: 48,
    backgroundColor: '#fff',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 16,
    flexDirection: 'row',
  },
  fallbackButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  loadingContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#667eea',
    fontWeight: '600',
  },
  termsText: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
    marginTop: 16,
    paddingHorizontal: 10,
  },
});
