'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useUserContext } from '@/context/userContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff } from 'lucide-react';
import { validateEmail } from '@/lib/utils';

export function LoginForm({}: React.ComponentProps<'form'>) {
  const { isAuthenticated, login } = useUserContext();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    // Validation
    if (!email.trim() || !password.trim()) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }

    if (!validateEmail(email)) {
      toast.error('Vui lòng nhập địa chỉ email hợp lệ');
      return;
    }

    setLoading(true);
    await login(email, password);
    setLoading(false);
  };

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  return (
    <Card className="shadow-xl border-slate-200">
      <CardHeader className="space-y-1">
        <CardTitle>Chào mừng trở lại</CardTitle>
        <CardDescription>Đăng nhập vào tài khoản quản trị viên của bạn</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Địa chỉ Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@smartforecast.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Mật khẩu</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Nhập mật khẩu của bạn"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-11 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors disabled:opacity-50"
                aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            <button
              type="button"
              className="text-sm text-blue-600 hover:text-blue-700 transition-colors cursor-pointer"
              onClick={() => router.push('/forgot-password')}
              disabled={loading}
            >
              Quên mật khẩu?
            </button>
          </div>

          <Button type="submit" disabled={loading} className="w-full h-11">
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Đang đăng nhập...</span>
              </div>
            ) : (
              'Đăng nhập'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
