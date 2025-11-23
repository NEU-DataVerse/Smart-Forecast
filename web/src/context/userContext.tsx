'use client';

import { userAxios } from '@/services/axios';
import { IUser } from '@/../../shared/src/types/user.types';
import React from 'react';
import { toast } from 'sonner';

interface LoginCredentials {
  access_token: string;
  user: {
    role: string;
  };
}

interface IUserContext {
  user: IUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  setUser: React.Dispatch<React.SetStateAction<IUser | null>>;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  login: (credentials: LoginCredentials) => void;
  logout: () => Promise<void>;
}

interface IUserProviderProps {
  children: React.ReactNode;
}

const UserContext = React.createContext<IUserContext | undefined>(undefined);

export const UserProvider: React.FC<IUserProviderProps> = ({ children }) => {
  const [user, setUser] = React.useState<IUser | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = React.useState<boolean>(false);

  async function fetchUser() {
    try {
      setLoading(true);

      // Check if token exists
      const token = localStorage.getItem('access_token');
      if (!token) {
        setUser(null);
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      // Set token in axios header
      userAxios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      const response = await userAxios.get('/auth/me');
      setUser(response.data);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      setUser(null);
      setIsAuthenticated(false);
      // Clear invalid token
      localStorage.removeItem('access_token');
      delete userAxios.defaults.headers.common['Authorization'];
    } finally {
      setLoading(false);
    }
  }

  function login(credentials: LoginCredentials) {
    try {
      const { access_token, user } = credentials;

      // Store token
      localStorage.setItem('access_token', access_token);

      // Update axios header
      userAxios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;

      // Update user context
      setUser(user as IUser);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Failed to update user context');
    }
  }

  async function logout() {
    try {
      setLoading(true);
      // Try to call logout endpoint (optional, don't fail if it errors)
      await userAxios.post('/auth/logout').catch(() => {});
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear all user data
      setUser(null);
      setIsAuthenticated(false);
      setLoading(false);

      // Clear all localStorage items
      localStorage.removeItem('access_token');
      localStorage.removeItem('user_role');
      localStorage.removeItem('rememberMe');
      localStorage.removeItem('userEmail');

      // Clear axios authorization header
      delete userAxios.defaults.headers.common['Authorization'];

      toast.success('Logged out successfully');

      // Redirect to login page
      window.location.href = '/login';
    }
  }

  React.useEffect(() => {
    fetchUser();
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        isAuthenticated,
        setUser,
        setIsAuthenticated,
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
