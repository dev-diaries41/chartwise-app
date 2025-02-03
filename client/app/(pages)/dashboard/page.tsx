import React from 'react';
import {ChartAnalyser} from '@/app/ui';
import { auth } from '@/auth';

export default async function Page() {
  const session = await auth();
  const email = session?.user?.email;
  const hasCompletedOnboarding = session?.user?.metadata?.hasCompletedOnboarding;

  return (
    <div className='relative flex-1 max-w-full mx-auto w-full pt-12 md:pt-0 overflow-x-auto'>
        <div className="relative w-full flex flex-col  mx-auto min-h-screen items-center justify-center text-center px-4">  
          <ChartAnalyser email={email} hasCompletedOnboarding={hasCompletedOnboarding}/>
          <p className="flex text-xs text-gray-600 mt-auto p-2">ChartWise can make mistakes. Check guidelines.</p>
        </div>
    </div>
  );
}