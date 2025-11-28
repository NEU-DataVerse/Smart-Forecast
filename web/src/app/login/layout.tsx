import { ReactNode } from 'react';
import { Cloud, CloudRain, Sun, Wind } from 'lucide-react';
interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-slate-50 to-cyan-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <Cloud className="absolute top-20 left-10 h-16 w-16 text-blue-200 opacity-30 animate-float" />
        <CloudRain className="absolute top-40 right-20 h-12 w-12 text-slate-300 opacity-40 animate-float-delayed" />
        <Sun className="absolute bottom-32 left-20 h-20 w-20 text-yellow-200 opacity-30 animate-float" />
        <Wind className="absolute bottom-20 right-32 h-14 w-14 text-cyan-200 opacity-30 animate-float-delayed" />
        <Cloud className="absolute top-1/2 left-1/3 h-10 w-10 text-blue-100 opacity-20 animate-float" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {children}

        <div className="mt-6 text-center">
          <p className="text-sm text-slate-500">
            You do not have an account?{' '}
            <button className="text-blue-600 hover:text-blue-700 transition-colors" type="button">
              Contact your system administrator
            </button>
          </p>
        </div>

        <div className="mt-8 text-center text-xs text-slate-400">
          <p>Smart Forecasting System v2.0</p>
          <p className="mt-1">© 2025 All rights reserved</p>
        </div>
      </div>
    </div>
  );
}
