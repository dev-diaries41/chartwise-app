'use client';
import { capitalizeFirstLetter } from '@/app/lib/helpers';
import { AnalysisUsageProps, Usage, UsageType } from '@/app/types';
import React from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useSubscription } from '@/app/providers/subscription';

function getCurrentMonth() {
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const currentMonthIndex = new Date(Date.now()).getUTCMonth();
  return monthNames[currentMonthIndex];
}

const AnalysisUsage: React.FC<AnalysisUsageProps> = ({ usage, period }) => {
  const { limit } = useSubscription();
  if (!limit) return null;
  
  const percentage = (usage / limit) * 100;

  return (
    <div className="bg-neutral-300 dark:bg-gray-700 text-white p-8 rounded-xl shadow-lg w-full">
      <h3 className="text-xl font-semibold mb-1">Monthly Usage</h3>
      <p className="text-md opacity-90 mb-4">{period}</p>
      <div className="w-48 mx-auto my-4">
        <CircularProgressbar 
          value={percentage} 
          text={`${Math.round(percentage)}%`} 
          styles={buildStyles({
            textColor: '#ffffff',
            pathColor: percentage > 80 ? '#ff0000' : '#00ff84',  // Red if usage is above 80%
            trailColor: '#2b2b2b'
          })} 
        />
      </div>
      <h2 className="text-3xl font-bold">{usage}</h2>
      <p className="text-md opacity-70">/ {limit} limit</p>
    </div>
  );
};

interface UsageCardProps {
  periodUsage: UsageType;
}

function UsageCard({ periodUsage }: UsageCardProps) {
  return (
    <div className='flex flex-col items-center bg-neutral-300 dark:bg-gray-700 p-8 rounded-xl shadow-lg'>
      <h1 className='text-xl font-semibold opacity-90 mb-4'>{periodUsage.name}</h1>
      <span className='text-5xl font-bold my-auto'>{periodUsage.count}</span>
    </div>
  );
}

export default function UsageDashboard({ usage }: { usage: Usage }) {
  const { userPlan } = useSubscription();

  return (
    <div className="relative flex-1 max-w-7xl mx-auto w-full">
      <div className="relative w-full flex flex-col max-w-5xl mx-auto lg:min-h-screen items-center text-center py-8 px-4">
        <div className="flex flex-col w-full min-h-screen items-center py-8 ">
          
          {/* Page Title and Plan Information */}
          <div className="flex justify-between w-full mb-8">
            <h1 className="text-3xl font-bold">Usage</h1>
            <div className="flex gap-4 font-medium items-center ">
              <p className="text-md opacity-90 ">Current Plan: <span className="font-semibold">{capitalizeFirstLetter(userPlan)}</span></p>
              {/* {userPlan !== 'Elite' && (
                <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">
                  Upgrade Plan
                </button>
              )}
              {userPlan !== 'Free' && (
                <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700">
                  Cancel Plan
                </button>
              )} */}
            </div>
          </div>

          {/* Usage Breakdown Cards */}
          <div className='w-full flex flex-wrap gap-4 justify-between items-center mb-8'>
            {Object.entries(usage).map(([key, value], index) => (
              <div key={index} className="w-full sm:w-1/2 lg:w-1/4 mb-6 sm:mb-0">
                <UsageCard periodUsage={{ name: capitalizeFirstLetter(key), count: value }} />
              </div>
            ))}
          </div>

          {/* Monthly Analysis Usage */}
          <AnalysisUsage usage={usage.month} period={getCurrentMonth()} />
        </div>
      </div>
    </div>
  );
}
