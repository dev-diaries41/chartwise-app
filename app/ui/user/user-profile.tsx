'use client'
import React from 'react';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { UserProfileWidgetProps } from '@/app/types';
import { useSubscription } from '@/app/providers/subscription';


export default function UserProfileWidget({userId, isLoading}: UserProfileWidgetProps) {
const {userPlan, credits} = useSubscription(userId, isLoading);
  return (
    <div className="w-full flex flex-col items-center p-1">
     <div className='w-full flex flex-row gap-2 items-center'>
        <FontAwesomeIcon icon={faUserCircle} className='w-6 h-6'/>
       <div className='flex flex-col gap-1 items-center overflow-hidden'>
      {userId && <p className='w-full text-xs font-semibold overflow-hidden overflow-ellipsis'>{userId}</p>}
      <p className='w-full text-xs text-gray-400 overflow-hidden overflow-ellipsis'>{`${userPlan} ⦁ Credits ${credits||''}`}</p>
      </div>
     </div>
    </div>
  );
};