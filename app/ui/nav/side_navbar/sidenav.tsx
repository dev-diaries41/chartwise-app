'use client'
import React, { useState } from 'react';
import Link from 'next/link';
import NavLinks from './sidenav-links';
import { navLinks } from '@/app/constants/navigation';
import { useUser } from '@auth0/nextjs-auth0/client';
import {RecentAnalyses, UserPlanWidget, Logo} from '@/app/ui';
import { usePathname } from 'next/navigation';
import { useTrader } from '@/app/providers/trader';
import UserProfileWidget from '../../user/user-profile';
import useSubscription from '@/app/hooks/useSubscription';
import MobileNav from './mobilenav';

export default React.memo(function  SideNav(){
  const [isOpen, setIsOpen] = useState(false);
  const { user, isLoading } = useUser();
  const userId = user?.email;
  const pathName = usePathname();
  const showRecentAnalyses = pathName === '/trader';
  const {recentAnalyses, handleDeleteAnalysis, handleViewAnalysis} = useTrader();
  const {userPlan} = useSubscription(userId, isLoading);
  const showUpgradeWidget = userPlan === 'Free' && !isLoading;


  return (
    <>
      <div className="fixed flex flex-col max-w-[200px] w-[200px] min-h-screen bg-gray-800 border border-r-1 border-gray-700 p-2 lg:block hidden z-[100]">
        <Link
          className="flex w-100 h-32 items-center justify-start rounded-3xl"
          href="/"
        >
          <Logo
            src={'/chartwise-icon.png'}
            alt={'logo'}
            width={100}
            height={100}
          />
        </Link>
        <div className='flex h-full flex-col justify-between gap-4'>
          <NavLinks navItems={navLinks} />
          {showRecentAnalyses && <div className="flex-1 max-h-[50vh] overflow-y-auto custom-scrollbar">
          { showRecentAnalyses && <RecentAnalyses analyses={recentAnalyses} onClick={handleViewAnalysis} onDelete={handleDeleteAnalysis}/>}
          </div>
          }
          <a
            href={user ? '/api/auth/logout' : '/api/auth/login'}
            className={`flex items-center justify-center bg-emerald-700 hover:bg-emerald-500 text-sm text-white font-semibold p-2 rounded-3xl shadow-md`}
          >
            {user ? 'Sign Out' : 'Sign In'}
          </a>
          <div className="absolute bottom-0 right-0 left-0 p-3 flex flex-col gap-4">
            {showUpgradeWidget && <UserPlanWidget/>}
            <UserProfileWidget userId={user?.email} isLoading={isLoading}/>
          </div>
        </div>
      </div>
    <MobileNav user={user} isLoading={isLoading} isOpen={isOpen} onToggleMenu={()=> setIsOpen(prev => !prev)}/>
    </>
  );
})