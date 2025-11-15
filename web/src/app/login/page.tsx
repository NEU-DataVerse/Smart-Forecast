'use client';
import { LoginForm } from '@/components/Loginfrom';
import { Suspense } from 'react';
import { Loading } from '@/components/ui/loading';
export default function Login() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen">
          <Loading variant="dots" size="lg" text="Loading" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
