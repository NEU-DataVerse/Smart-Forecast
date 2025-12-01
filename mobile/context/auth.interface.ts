export interface User {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  role: 'admin' | 'user' | 'viewer';
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isSigningIn: boolean;
  token: string | null;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
}
