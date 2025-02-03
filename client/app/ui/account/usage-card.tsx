import { UsageType } from "@/app/types";

interface UsageCardProps {
    periodUsage: UsageType;
  }
  
  export default function UsageCard({ periodUsage }: UsageCardProps) {
    return (
      <div className='flex flex-col items-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-8 rounded-xl shadow-lg'>
        <h1 className='text-xl font-semibold opacity-90 mb-4'>{periodUsage.name}</h1>
        <span className='text-5xl font-bold my-auto'>{periodUsage.count}</span>
      </div>
    );
  }