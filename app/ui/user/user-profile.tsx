'use client'
import React from 'react';
import { faSignOut, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { UserProfileWidgetProps } from '@/app/types';
import { useSubscription } from '@/app/providers/subscription';
import Link from 'next/link';


export default function UserProfileWidget({ userId, isLoading }: UserProfileWidgetProps) {
  const { userPlan } = useSubscription(userId, isLoading);
  
  return (
    <div className="w-full flex flex-row items-center p-1 justify-center">
      <Link href={'/account'} className='w-full flex flex-row gap-2 items-center text-left mr-auto'>
        <FontAwesomeIcon icon={faUserCircle} className='w-4 h-4 rounded-full' />
        <div className='flex flex-col w-full gap-0 items-start overflow-hidden'>
          {userId && <p className='w-full text-sm font-medium overflow-hidden overflow-ellipsis'>{userId}</p>}
          <p className=' text-xs font-medium text-gray-400 overflow-hidden overflow-ellipsis'>{`${userPlan}`}</p>
        </div>
      </Link>
      
      <a
        href={userId ? '/api/auth/logout' : '/api/auth/login'}
        className='lg:hidden flex flex-row  items-center justify-end w-full gap-2 p-2 text-sm font-medium mt-auto focus:cursor-pointer ml-auto' >
        <FontAwesomeIcon icon={faSignOut} className='w-4 h-4'/>
        {userId ? 'Sign out' : 'Sign in'}
      </a>
    </div>
  );
};