import { userAxios } from './axios';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  user: {
    role: string;
  };
}

export interface AuthResult {
  success: boolean;
  data?: LoginResponse;
  error?: string;
}

//  Validate email format

export const validateEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// Authenticate user with email and password

export const authenticateUser = async (credentials: LoginCredentials): Promise<AuthResult> => {
  try {
    const response = await userAxios.post<LoginResponse>('/auth/login', credentials);

    const { access_token, user } = response.data;

    if (!access_token || !user) {
      return {
        success: false,
        error: 'Invalid response from server',
      };
    }

    return {
      success: true,
      data: response.data,
    };
  } catch (error: unknown) {
    const err = error as {
      response?: { data?: { message?: string } };
      message?: string;
    };
    const errorMessage =
      err?.response?.data?.message || err?.message || 'Failed to login. Please try again.';

    return {
      success: false,
      error: errorMessage,
    };
  }
};

// Store authentication data in localStorage
export const storeAuthData = (accessToken: string, userRole: string): void => {
  localStorage.setItem('access_token', accessToken);
  localStorage.setItem('user_role', userRole);

  // Lưu vào cookie để middleware có thể đọc
  document.cookie = `access_token=${accessToken}; path=/; max-age=${7 * 24 * 60 * 60}`; // 7 days

  // Update axios default header
  userAxios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
};

//  Handle "remember me" functionality

export const handleRememberMe = (rememberMe: boolean, email: string): void => {
  if (rememberMe) {
    localStorage.setItem('rememberMe', 'true');
    localStorage.setItem('userEmail', email);
  } else {
    localStorage.removeItem('rememberMe');
    localStorage.removeItem('userEmail');
  }
};

//  Load remembered credentials
export const loadRememberedCredentials = (): {
  rememberMe: boolean;
  email: string;
} => {
  const rememberMe = localStorage.getItem('rememberMe') === 'true';
  const email = localStorage.getItem('userEmail') || '';

  return { rememberMe, email };
};

//  Clear authentication data

export const clearAuthData = (): void => {
  // Xóa localStorage
  localStorage.removeItem('access_token');
  localStorage.removeItem('role');
  localStorage.removeItem('rememberedEmail');
  localStorage.removeItem('rememberedPassword');

  // Xóa cookie
  document.cookie = 'access_token=; path=/; max-age=0';
  // Xóa axios header
  delete userAxios.defaults.headers.common['Authorization'];
};
