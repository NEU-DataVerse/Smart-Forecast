import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { Platform } from 'react-native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { authApi } from '@/services/api';
import { useAppStore } from '@/store/appStore';
import { tokenStorage } from '@/utils/tokenStorage';
import { AuthContextType } from './auth.interface';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { user, setUser, token, setToken, isAuthLoading, setIsAuthLoading } = useAppStore();
  const [isSigningIn, setIsSigningIn] = React.useState(false);

  // Initialize auth on app start
  useEffect(() => {
    bootstrapAsync();
  }, []);

  const bootstrapAsync = async () => {
    try {
      setIsAuthLoading(true);

      // Try to restore token and user from storage
      const savedToken = await tokenStorage.getToken();
      const savedUser = await tokenStorage.getUser();

      if (savedToken && savedUser) {
        setToken(savedToken);
        setUser(savedUser);
      }
    } catch (error) {
      console.error('Error bootstrapping auth:', error);
    } finally {
      setIsAuthLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      setIsSigningIn(true);

      // Check if Google Client ID is configured
      const webClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;
      if (!webClientId) {
        throw new Error(
          'Google Sign-In not configured. Please add EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID to .env file.',
        );
      }

      // On web platform, show a demo/test login flow
      if (Platform.OS === 'web') {
        // For web, use a demo user for testing
        const demoUser = {
          id: 'demo-user-' + Date.now(),
          email: 'demo@example.com',
          fullName: 'Demo User',
          role: 'user' as const,
        };

        // Save demo user
        await tokenStorage.saveToken('demo-token-' + Date.now());
        await tokenStorage.saveUser(demoUser);

        // Update store
        setToken('demo-token-' + Date.now());
        setUser(demoUser);

        return;
      }

      try {
        // Configure Google Sign In (for native platforms only)
        await GoogleSignin.configure({
          webClientId,
          offlineAccess: false,
        });

        // Check if device supports Google Play Services (Android only)
        if (Platform.OS === 'android') {
          await GoogleSignin.hasPlayServices();
        }

        // Sign in with Google
        const userInfo = await GoogleSignin.signIn();
        const idToken = userInfo.data?.idToken;

        if (!idToken) {
          throw new Error('No ID token from Google');
        }

        // Send ID token to backend
        const response = await authApi.googleSignIn(idToken);

        // Save token and user
        await tokenStorage.saveToken(response.access_token);
        await tokenStorage.saveUser(response.user);

        // Update store
        setToken(response.access_token);
        setUser(response.user);
      } catch (googleError) {
        // If Google Sign-In fails (DEVELOPER_ERROR, network, etc),
        // fallback to demo user for development/testing
        console.warn('Google Sign-In failed, using demo account:', googleError);

        // Create demo user as fallback
        const demoUser = {
          id: 'demo-user-' + Date.now(),
          email: 'demo@example.com',
          fullName: 'Demo User',
          role: 'user' as const,
        };

        // Save demo user
        await tokenStorage.saveToken('demo-token-' + Date.now());
        await tokenStorage.saveUser(demoUser);

        // Update store
        setToken('demo-token-' + Date.now());
        setUser(demoUser);

        // Still throw error so user sees notification
        throw new Error(
          'Google Sign-In unavailable. Using demo account for testing. Please configure Google OAuth properly for production.',
        );
      }
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    } finally {
      setIsSigningIn(false);
    }
  };

  const signOut = async () => {
    try {
      // On web platform, just clear local storage
      if (Platform.OS === 'web') {
        await tokenStorage.clearAuth();
        setUser(null);
        setToken(null);
        return;
      }

      // Configure Google Sign In before signing out (for native platforms)
      try {
        await GoogleSignin.configure({
          webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID || '',
        });
        await GoogleSignin.signOut();
      } catch (googleError) {
        // If Google Sign In fails, continue with clearing local auth
        console.warn('Google Sign Out error (continuing with local logout):', googleError);
      }

      // Clear local authentication
      await tokenStorage.clearAuth();
      setUser(null);
      setToken(null);
    } catch (error) {
      console.error('Error signing out:', error);
      // Still clear local state even if there's an error
      setUser(null);
      setToken(null);
    }
  };

  const value: AuthContextType = {
    user,
    isLoading: isAuthLoading,
    isSigningIn,
    token,
    signInWithGoogle,
    signOut,
    isAuthenticated: !!user && !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
