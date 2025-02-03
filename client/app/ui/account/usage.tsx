'use client';
import { AnalysisUsageProps } from '@/app/types';
import React from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useSubscription } from '@/app/providers/subscription';



export default function  AnalysisUsage({ usage, period }: AnalysisUsageProps) {
  const { limit } = useSubscription();
  if (!limit) return null;
  
  const percentage = (usage / limit) * 100;

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-8 rounded-xl shadow-lg w-full">
      <h3 className="text-xl font-semibold mb-1">Monthly Usage</h3>
      <p className="text-md opacity-90 mb-4">{period}</p>
      <div className="w-48 mx-auto my-4">
        <CircularProgressbar 
          value={percentage} 
          text={`${Math.round(percentage)}%`} 
          styles={buildStyles({
            pathColor: percentage > 80 ? '#ff0000' : '#00ff84',  // Red if usage is above 80%
            trailColor: '#3f3f3f'
          })} 
        />
      </div>
      <h2 className="text-3xl font-bold">{usage}</h2>
      <p className="text-md opacity-70">/ {limit} limit</p>
    </div>
  );
};

