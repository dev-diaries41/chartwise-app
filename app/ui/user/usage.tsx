import React from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

interface AnalysisUsageProps {
  usage: number;
  limit: number;
  period: string;
}

const AnalysisUsage: React.FC<AnalysisUsageProps> = ({ usage, limit, period }) => {
  const percentage = (usage / limit) * 100;
  
  return (
    <div className="bg-gray-900 text-white p-6 rounded-lg w-64">
      <h3 className="text-lg font-semibold">Project's Monthly Bill</h3>
      <p className="text-sm text-gray-400">{period}</p>
      <div className="w-24 mx-auto my-4">
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
      <h2 className="text-2xl font-bold">${usage.toFixed(2)}</h2>
      <p className="text-sm text-gray-400">/ ${limit.toFixed(2)} limit</p>
      <button 
        className="mt-4 bg-green-400 text-gray-900 py-2 px-4 rounded hover:bg-green-300"
      >
        Increase limit
      </button>
    </div>
  );
};

export default AnalysisUsage