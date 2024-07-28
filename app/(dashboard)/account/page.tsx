'use client';
import React from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import UsageDashboard from '@/app/ui/user/usage';
import { SuspenseFallback } from '@/app/ui/';
import { useUsage } from '@/app/hooks/useUsage';

export default function Page() {
  const { user, isLoading } = useUser();
  const userId = user?.email;
  const { usage, loading } = useUsage(userId);

  if (isLoading || loading) {
    return <SuspenseFallback />;
  }

  return (
    <div className="relative flex-1 max-w-7xl mx-auto w-full">
      <div className="relative w-full flex flex-col max-w-5xl mx-auto lg:min-h-screen items-center text-center py-8 px-4">
        <UsageDashboard usage={usage} />
      </div>
    </div>
  );
}
