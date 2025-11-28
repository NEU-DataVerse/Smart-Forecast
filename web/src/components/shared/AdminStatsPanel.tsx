'use client';

import { useUserContext } from '@/context/userContext';
import { UserRole } from '@smart-forecast/shared';
import { ReactNode } from 'react';

interface AdminStatsPanelProps {
  children: ReactNode;
}

/**
 * Wrapper component that only renders children for admin users
 */
export function AdminStatsPanel({ children }: AdminStatsPanelProps) {
  const { user } = useUserContext();

  if (!user || user.role !== UserRole.ADMIN) {
    return null;
  }

  return <>{children}</>;
}
