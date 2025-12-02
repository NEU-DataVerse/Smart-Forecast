import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Pressable, ActivityIndicator } from 'react-native';
import { Stack, router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '@/context/AuthContext';

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
              Sign in with your Google account to access the app
            </Text>

            <Pressable
              style={[styles.googleButton, isSigningIn && styles.googleButtonDisabled]}
              onPress={handleGoogleSignIn}
              disabled={isSigningIn}
            >
              {isSigningIn ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <View style={styles.googleButtonContent}>
                  <Text style={styles.googleIcon}>G</Text>
                  <Text style={styles.googleButtonText}>Sign in with Google</Text>
                </View>
              )}
            </Pressable>
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
    height: 52,
    backgroundColor: '#fff',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
    color: '#4285F4',
    marginRight: 12,
  },
  googleButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
});
