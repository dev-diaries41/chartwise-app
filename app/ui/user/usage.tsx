import { capitalizeFirstLetter } from '@/app/lib/utils/ui';
import { AnalysisUsageProps, Usage, UsageType } from '@/app/types';
import React from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import NotFound from '../common/not-found';



function getCurrentMonth() {
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const currentMonthIndex = new Date(Date.now()).getUTCMonth();
  return monthNames[currentMonthIndex];
}

const AnalysisUsage: React.FC<AnalysisUsageProps> = ({ usage, limit, period }) => {
  const percentage = (usage / limit) * 100;
  
  return (
    <div className="bg-gray-700 text-white p-8 rounded-xl shadow-lg w-full">
      <h3 className="text-xl font-semibold mb-1">Monthly Usage</h3>
      <p className="text-md text-gray-400 mb-4">{period}</p>
      <div className="w-48 mx-auto my-4">
        <CircularProgressbar 
          value={percentage} 
          text={`${Math.round(percentage)}%`} 
          styles={buildStyles({
            textColor: '#ffffff',
            pathColor: '#00ff84',
            trailColor: '#2b2b2b'
          })} 
        />
      </div>
      <h2 className="text-3xl font-bold">{usage}</h2>
      <p className="text-md text-gray-400">/ {limit} limit</p>
    </div>
  );
};



interface UsageCardProps {
  periodUsage: UsageType;
}

function UsageCard({ periodUsage }: UsageCardProps) {
  return (
    <div className='flex flex-col items-center bg-gray-700 p-8 rounded-xl shadow-lg'>
      <h1 className='text-xl font-semibold text-gray-300 mb-4'>{periodUsage.name}</h1>
      <span className='text-5xl font-bold text-gray-200 my-auto'>{periodUsage.count}</span>
    </div>
  );
}

export default function UsageDashboard({usage}: {usage: Usage | null}) {
  
  if (!usage) {
    return <NotFound title={'500 | Error fetching usage'} />;
  }

  return (
    <div className="flex flex-col w-full min-h-screen text-gray-200  items-center py-8 ">
      <h1 className="text-3xl font-bold mb-8 text-left">Usage</h1>
      <div className='w-full flex flex-wrap gap-4 justify-between items-center mb-8'>
        {Object.entries(usage).map(([key, value], index) => (
          <div key={index} className="w-full sm:w-1/2 lg:w-1/4 px-4 mb-6 sm:mb-0">
            <UsageCard periodUsage={{name: capitalizeFirstLetter(key), count: value}} />
          </div>
        ))}
      </div>
      <AnalysisUsage usage={usage.month} limit={100} period={getCurrentMonth()} />
    </div>
  );
}
