'use client';

import { Eye, EyeOff } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { userAxios } from '@/lib/axios';
import { useUserContext } from '@/context/userContext';

interface LoginResponse {
  access_token: string;
  user: {
    role: string;
  };
}

export function LoginForm({}: React.ComponentProps<'form'>) {
  const { isAuthenticated, login } = useUserContext();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    // Load remember me data on mount
    const storedRemember = localStorage.getItem('rememberMe') === 'true';
    const storedEmail = localStorage.getItem('userEmail') || '';
    setRememberMe(storedRemember);
    if (storedRemember) setEmail(storedEmail);
  }, []);

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    // Validation
    if (!email.trim() || !password.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setLoading(true);

    try {
      const response = await userAxios.post<LoginResponse>('/auth/login', {
        email,
        password,
      });

      const { access_token, user } = response.data;

      if (!access_token || !user) {
        throw new Error('Invalid response from server');
      }

      // Store token in localStorage
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('user_role', user.role);

      // Handle remember me
      if (rememberMe) {
        localStorage.setItem('rememberMe', 'true');
        localStorage.setItem('userEmail', email);
      } else {
        localStorage.removeItem('rememberMe');
        localStorage.removeItem('userEmail');
      }

      // Update user context with login info
      if (login) {
        login({ access_token, user });
      }

      // Update axios default header
      userAxios.defaults.headers.common[
        'Authorization'
      ] = `Bearer ${access_token}`;

      toast.success('Login successful');

      // Redirect to dashboard or verify page based on requirements
      router.push('/dashboard');
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        'Failed to login. Please try again.';
      toast.error(errorMessage);
      console.error('LoginForm error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  if (isAuthenticated) {
    return null;
  }

  return (
    <>
      <Card className="shadow-xl border-slate-200">
        <CardHeader className="space-y-1">
          <CardTitle>Welcome Back</CardTitle>
          <CardDescription>
            Sign in to your administrator account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@weather.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <button
                  type="button"
                  className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
                  onClick={() => router.push('/forgot-password')}
                  disabled={loading}
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  className="h-11 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors disabled:opacity-50"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(checked: boolean | 'indeterminate') =>
                  setRememberMe(checked === true)
                }
                disabled={loading}
              />
              <label
                htmlFor="remember"
                className="text-sm text-slate-600 cursor-pointer select-none"
              >
                Remember me for 30 days
              </label>
            </div>

            <Button type="submit" disabled={loading} className="w-full h-11">
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Signing In...</span>
                </div>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="mt-6 text-center">
        <p className="text-sm text-slate-500">
          You do not have an account?{' '}
          <button
            className="text-blue-600 hover:text-blue-700 transition-colors"
            type="button"
          >
            Contact your system administrator
          </button>
        </p>
      </div>
    </>
  );
}
