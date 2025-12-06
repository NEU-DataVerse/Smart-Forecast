import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { Alert } from 'react-native';
import {
  GoogleSignin,
  isSuccessResponse,
  isErrorWithCode,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import { tokenStorage } from '@/utils/tokenStorage';
import { authApi } from '@/services/api';
import { AuthContextType } from './auth.interface';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Configure Google Sign-In with error handling
try {
  const webClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;
  if (!webClientId) {
    console.warn(
      '⚠️ EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID is not configured. Google Sign-In will not work.',
    );
  } else {
    GoogleSignin.configure({
      webClientId: webClientId,
      offlineAccess: true,
    });
  }
} catch (error) {
  console.error('❌ Failed to configure GoogleSignin:', error);
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthLoading, setIsAuthLoading] = React.useState(true);
  const [isSigningIn, setIsSigningIn] = React.useState(false);
  const [user, setUser] = React.useState<any>(null);
  const [token, setToken] = React.useState<string | null>(null);

  // Initialize auth on app start
  useEffect(() => {
    const initAuth = async () => {
      try {
        setIsAuthLoading(true);

        // Try to restore token and user from storage
        const savedToken = await tokenStorage.getToken();
        const savedUser = await tokenStorage.getUser();

        if (savedToken && savedUser) {
          setToken(savedToken);
          setUser(savedUser);
        }
        // No auto-login with demo user - require real sign-in
      } catch (error) {
        console.error('Error bootstrapping auth:', error);
      } finally {
        setIsAuthLoading(false);
      }
    };

    initAuth();
  }, []);

  const signInWithGoogle = async () => {
    try {
      setIsSigningIn(true);

      // Check if Google Client ID is configured
      const webClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;
      if (!webClientId) {
        Alert.alert(
          'Lỗi cấu hình',
          'Google Sign-In chưa được cấu hình. Vui lòng liên hệ quản trị viên.',
        );
        return;
      }

      // Check if Google Play Services are available
      await GoogleSignin.hasPlayServices();

      // Sign in with Google
      const response = await GoogleSignin.signIn();

      if (isSuccessResponse(response)) {
        const { idToken } = response.data;

        if (!idToken) {
          throw new Error('No ID token received from Google');
        }

        // Send idToken to backend for verification
        console.log('📤 Sending idToken to backend...');
        const authResponse = await authApi.googleSignIn(idToken);

        // Save token and user to storage
        await tokenStorage.saveToken(authResponse.access_token);
        await tokenStorage.saveUser(authResponse.user);

        // Update state
        setToken(authResponse.access_token);
        setUser(authResponse.user);

        if (authResponse.isNewUser) {
          Alert.alert('Chào mừng!', 'Tài khoản của bạn đã được tạo thành công.');
        }
      }
    } catch (error: any) {
      console.error('❌ Sign in error:', error);

      if (isErrorWithCode(error)) {
        switch (error.code) {
          case statusCodes.IN_PROGRESS:
            Alert.alert('Đang xử lý', 'Đăng nhập đang được thực hiện');
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            Alert.alert('Lỗi', 'Google Play Services không khả dụng hoặc cần cập nhật');
            break;
          case statusCodes.SIGN_IN_CANCELLED:
            // User cancelled, no alert needed
            break;
          default:
            Alert.alert('Lỗi đăng nhập', error.message || 'Không thể đăng nhập. Vui lòng thử lại.');
        }
      } else if (error.response) {
        // Backend error
        const message = error.response.data?.message || 'Lỗi từ server. Vui lòng thử lại.';
        Alert.alert('Lỗi đăng nhập', message);
      } else if (error.request) {
        // Network error
        Alert.alert(
          'Lỗi kết nối',
          'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng và thử lại.',
        );
      } else {
        Alert.alert('Lỗi đăng nhập', 'Không thể đăng nhập. Vui lòng thử lại.');
      }
      throw error;
    } finally {
      setIsSigningIn(false);
    }
  };

  const signOut = async () => {
    try {
      // Sign out from Google
      await GoogleSignin.signOut();

      // Clear local authentication
      await tokenStorage.clearAuth();
      setUser(null);
      setToken(null);
    } catch (error) {
      console.error('Error signing out:', error);
      // Still clear local state even if there's an error
      await tokenStorage.clearAuth();
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
