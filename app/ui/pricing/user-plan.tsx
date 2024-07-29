'use client'
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLevelUpAlt } from '@fortawesome/free-solid-svg-icons'; // Replace with the icon similar to the one in your image
import Link from 'next/link';
import { UserProfileWidgetProps } from '@/app/types';
import useSubscription from '@/app/hooks/useSubscription';


export default function UserPlanWidget({userId, isLoading}: UserProfileWidgetProps) {
  const {userPlan} = useSubscription(userId, isLoading)
  const hideUpgradeWidget = !userId || isLoading || userPlan !== 'Free';
  if(hideUpgradeWidget)return null

  return (
    <div className='flex flex-col items-center p-1 bg-transparent text-gray-200  rounded-lg'>
    <Link href={'/#pricing'} className="w-full flex flex-row items-center gap-1">
        <FontAwesomeIcon icon={faLevelUpAlt} className="w-4 h-4"/>
      <div className='flex flex-col gap-0'>
        <div className="w-full text-sm font-medium">Upgrade plan</div>
        <div className="w-full text-xs opacity-50">Get increased usage</div>
      </div>
    </Link>
    </div>
    
  );
};
