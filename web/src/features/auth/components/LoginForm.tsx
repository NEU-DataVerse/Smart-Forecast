'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useUserContext } from '@/context/userContext';
import {
  authenticateUser,
  storeAuthData,
  handleRememberMe,
  loadRememberedCredentials,
  validateEmail,
} from '@/services/auth';
import { LoginCard } from './LoginCard';
import { PasswordInput } from './PasswordInput';
import { RememberMeCheckbox } from './RememberMeCheckbox';

export function LoginForm({}: React.ComponentProps<'form'>) {
  const { isAuthenticated, login } = useUserContext();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    // Load remember me data on mount
    const { rememberMe: storedRemember, email: storedEmail } = loadRememberedCredentials();
    setRememberMe(storedRemember);
    if (storedRemember) setEmail(storedEmail);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    // Validation
    if (!email.trim() || !password.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    if (!validateEmail(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setLoading(true);

    try {
      // Authenticate user
      const result = await authenticateUser({ email, password });

      if (!result.success || !result.data) {
        toast.error(result.error || 'Failed to login');
        return;
      }

      const { access_token, user } = result.data;

      // Store authentication data
      storeAuthData(access_token, user.role);

      // Handle remember me
      handleRememberMe(rememberMe, email);

      // Update user context with login info
      if (login) {
        login({ access_token, user });
      }

      toast.success('Login successful');

      // Redirect to dashboard
      router.push('/dashboard');
    } catch (error: unknown) {
      toast.error('An unexpected error occurred');
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
      <LoginCard>
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
            <PasswordInput
              value={password}
              onChange={setPassword}
              disabled={loading}
              placeholder="Enter your password"
            />
          </div>

          <RememberMeCheckbox
            checked={rememberMe}
            onCheckedChange={setRememberMe}
            disabled={loading}
          />

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
      </LoginCard>

      <div className="mt-6 text-center">
        <p className="text-sm text-slate-500">
          You do not have an account?{' '}
          <button className="text-blue-600 hover:text-blue-700 transition-colors" type="button">
            Contact your system administrator
          </button>
        </p>
      </div>
    </>
  );
}
