'use client'
import React, { useState } from 'react';
import Link from 'next/link';
import NavLinks from './sidenav-links';
import { navLinks } from '@/app/constants/navigation';
import { useUser } from '@auth0/nextjs-auth0/client';
import {RecentAnalyses, UserPlanWidget, Logo} from '@/app/ui';
import { usePathname } from 'next/navigation';
import { useChartwise } from '@/app/providers/chartwise';
import UserProfileWidget from '../../user/user-profile';
import MobileNav from './mobilenav';
import { useSettings } from '@/app/providers/settings';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear, faSignOut } from '@fortawesome/free-solid-svg-icons';

export default React.memo(function  SideNav(){
  const [isOpen, setIsOpen] = useState(false);
  const { user, isLoading } = useUser();
  const pathName = usePathname();
  const showRecentAnalyses = pathName === '/trader';
  const {recentAnalyses, handleDeleteAnalysis, handleViewAnalysis} = useChartwise();
  // const {toggleSettings} = useSettings();
 
  return (
    <>
      <div className="fixed flex flex-col rounded-r-md max-w-[200px] w-[200px] min-h-screen bg-gray-800 border border-r-1 border-gray-700 p-2 lg:block hidden z-[100]">
        <Link
          className="flex w-100 h-20 items-center justify-start rounded-3xl"
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
          { showRecentAnalyses && (

          <div className='mr-auto p-1'>
          <RecentAnalyses analyses={recentAnalyses} onClick={handleViewAnalysis} onDelete={handleDeleteAnalysis}/>

          </div>
          )}
          </div>
          }
         
          <div className="absolute bottom-0 right-0 left-0 p-3 flex flex-col gap-4">
          <a
            href={user ? '/api/auth/logout' : '/api/auth/login'}
            className='flex flex-row items-center justify-start gap-2 p-2 text-sm font-medium mt-auto focus:cursor-pointer' >
            <FontAwesomeIcon icon={faSignOut} className='w-4 h-4'/>
            {user ? 'Sign out' : 'Sign in'}
          </a>
            {/* <button onClick={() => {
            toggleSettings();
          }}className='flex flex-row items-center justify-start gap-2 p-2 text-sm font-medium mt-auto focus:cursor-pointer'>
            <FontAwesomeIcon icon={faGear} className='w-4 h-4'/>
            Settings
          </button> */}
          <UserPlanWidget userId={user?.email} isLoading={isLoading}/>
            <UserProfileWidget userId={user?.email} isLoading={isLoading}/>
          </div>
        </div>
      </div>
    <MobileNav user={user} isLoading={isLoading} isOpen={isOpen} onToggleMenu={()=> setIsOpen(prev => !prev)}/>
    </>
  );
})