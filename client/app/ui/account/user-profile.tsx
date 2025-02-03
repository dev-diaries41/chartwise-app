'use client';
import React from 'react';
import { faSignOut, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { UserProfileWidgetProps } from '@/app/types';
import { useSubscription } from '@/app/providers/subscription';
import Link from 'next/link';
import { logout } from '@/app/lib/actions';

export default function UserProfileWidget({ userId }: UserProfileWidgetProps) {
  const { userPlanOverview } = useSubscription();

  return (
    <div className="relative group">
  <div className="absolute -top-24 left-20 w-full p-4 bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity flex flex-col gap-2 z-50 shadow-md shadow-black text-sm hidden md:flex">
  <Link href="/dashboard/account" className="hover:bg-gray-200 hover:dark:bg-gray-800 w-full p-2 rounded-md ">
          Account
        </Link>
        <form
          action={async () => {
            await logout();
          }}
        >
          <button
            type="submit"
            className='w-full flex flex-row items-center group-hover:pointer-events-auto justify-start gap-2 p-2 py-3 text-sm font-medium mt-auto focus:cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-800 rounded-md'>
            <FontAwesomeIcon icon={faSignOut} className="w-4 h-4" />
            <span className="hidden md:inline">{'Log out'}</span>
          </button>
        </form>
      </div>

      <div className="w-full flex flex-row items-center p-2 justify-center hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md  pointer-events">
        <Link href={'/dashboard/account'} className="w-full flex flex-row gap-2 items-center text-left mr-auto">
          <FontAwesomeIcon icon={faUserCircle} className="w-4 h-4 rounded-full" />
          <div className="flex flex-col w-full gap-0 items-start overflow-hidden">
            {userId && <p className="w-full text-sm font-medium overflow-hidden overflow-ellipsis">{userId}</p>}
            <span className="text-xs font-medium opacity-50 overflow-hidden overflow-ellipsis">{`${userPlanOverview.plan || ''}`}</span>
          </div>
        </Link>
        <form
          action={async () => {
            await logout();
          }}
        >
          <button
            type="submit"
            className="lg:hidden flex flex-row items-center justify-end w-full gap-2 p-2 text-sm font-medium mt-auto focus:cursor-pointer ml-auto"
          >
            <FontAwesomeIcon icon={faSignOut} className="w-4 h-4" />
            <span className="hidden md:inline">{'Log out'}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
