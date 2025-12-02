import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { tokenStorage } from '@/utils/tokenStorage';
import { AuthContextType } from './auth.interface';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

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
        } else {
          // Auto-login with demo user if no stored credentials
          const demoUser = {
            id: 'demo-user-' + Date.now(),
            email: 'demo@example.com',
            fullName: 'Demo User',
            role: 'user' as const,
          };
          const demoToken = 'demo-token-' + Date.now();

          await tokenStorage.saveToken(demoToken);
          await tokenStorage.saveUser(demoUser);

          setToken(demoToken);
          setUser(demoUser);
        }
      } catch (error) {
        console.error('Error bootstrapping auth:', error);
        // Still set demo user on error
        const demoUser = {
          id: 'demo-user-' + Date.now(),
          email: 'demo@example.com',
          fullName: 'Demo User',
          role: 'user' as const,
        };
        const demoToken = 'demo-token-' + Date.now();
        setToken(demoToken);
        setUser(demoUser);
      } finally {
        setIsAuthLoading(false);
      }
    };

    initAuth();
  }, []);

  const signInWithGoogle = async () => {
    try {
      setIsSigningIn(true);

      // Create demo user for development
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
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    } finally {
      setIsSigningIn(false);
    }
  };

  const signOut = async () => {
    try {
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
