'use client'
import React from 'react';
import { faSignOut, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { UserProfileWidgetProps } from '@/app/types';
import { useSubscription } from '@/app/providers/subscription';
import Link from 'next/link';
import { logout } from '@/app/lib/actions';


export default function UserProfileWidget({ userId }: UserProfileWidgetProps) {
  const { userPlan } = useSubscription();
  
  return (
    <div className="w-full flex flex-row items-center p-1 justify-center">
      <Link href={'/dashboard/account'} className='w-full flex flex-row gap-2 items-center text-left mr-auto'>
        <FontAwesomeIcon icon={faUserCircle} className='w-4 h-4 rounded-full' />
        <div className='flex flex-col w-full gap-0 items-start overflow-hidden'>
          {userId && <p className='w-full text-sm font-medium overflow-hidden overflow-ellipsis'>{userId}</p>}
          <span className=' text-xs font-medium opacity-50 overflow-hidden overflow-ellipsis'>{`${userPlan||''}`}</span>
        </div>
      </Link>
      <form action={async() => {
        await logout()}
        }>
        <button
          type='submit'
          className='lg:hidden flex flex-row  items-center justify-end w-full gap-2 p-2 text-sm font-medium mt-auto focus:cursor-pointer ml-auto' >
          <FontAwesomeIcon icon={faSignOut} className='w-4 h-4'/>
          {'Sign out'}
        </button>
      </form>
    </div>
  );
};