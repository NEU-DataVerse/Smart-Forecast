'use client';

import { authService } from '@/services/api';
import { IUserProfile } from '@smart-forecast/shared';
import { useRouter } from 'next/navigation';
import React from 'react';
import { toast } from 'sonner';
interface IUserContext {
  user: IUserProfile | null;
  loading: boolean;
  isAuthenticated: boolean;
  setUser: React.Dispatch<React.SetStateAction<IUserProfile | null>>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}
interface IUserProviderProps {
  children: React.ReactNode;
}

const UserContext = React.createContext<IUserContext | undefined>(undefined);

export const UserProvider: React.FC<IUserProviderProps> = ({ children }) => {
  const router = useRouter();
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
  const [user, setUser] = React.useState<IUserProfile | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = React.useState<boolean>(false);

  async function fetchUser() {
    try {
      setLoading(true);
      const response = await authService.getCurrentUser();
      setUser(response);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }

  async function login(email: string, password: string) {
    try {
      setLoading(true);
      // Authenticate user
      const result = await authService.authenticate({ email, password });

      if (!result.success || !result.data) {
        toast.error(result.error || 'Failed to login');
        setLoading(false);
        return;
      }

      // Fetch user profile after successful login
      await fetchUser();

      toast.success('Login successful');

      // Redirect to dashboard
      router.push('/dashboard');
    } catch (error: unknown) {
      toast.error('An unexpected error occurred');
      console.error('Login error:', error);
      setLoading(false);
    }
  }

  function logout() {
    authService.clearAuthData();
    setUser(null);
    setIsAuthenticated(false);
    router.push('/login');
  }

  // Fetch user on mount if not on login page
  React.useEffect(() => {
    if (pathname !== '/login') {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [pathname]);

  // Redirect to login only after loading completes
  React.useEffect(() => {
    if (!loading && !isAuthenticated && pathname !== '/login') {
      router.push('/login');
    }
  }, [isAuthenticated, loading, pathname, router]);

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        isAuthenticated,
        setUser,
        login,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = (): IUserContext => {
  const context = React.useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};
