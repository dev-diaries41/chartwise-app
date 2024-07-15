'use client'
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons'; // Replace with the icon similar to the one in your image
import Link from 'next/link';
import { UserProfileWidgetProps } from '@/app/types';
import useSubscription from '@/app/hooks/useSubscription';


export default function UserPlanWidget({userId, isLoading}: UserProfileWidgetProps) {
  const {userPlan} = useSubscription(userId, isLoading)
  const hideUpgradeWidget = !userId || isLoading || userPlan !== 'Free';
  if(hideUpgradeWidget)return null

  return (
    <div className='flex flex-col items-center p-1 bg-transparent text-gray-200  rounded-lg shadow-md'>
    <Link href={'/pricing'} className="w-full flex flex-row items-center gap-1">
        <FontAwesomeIcon icon={faStar} className="w-6 w-6"/>
      <div className='flex flex-col gap-1'>
        <div className="w-full text-xs font-semibold">Upgrade plan</div>
        <div className="w-full text-xs opacity-50">Get increased usage</div>
      </div>
    </Link>
    </div>
    
  );
};
