'use client'
import React, { useState } from 'react';
import Link from 'next/link';
import NavLinks from './links';
import { dashboardLinks } from '@/app/constants/navigation';
import {RecentAnalyses, UserPlanWidget, Logo} from '@/app/ui';
import { useChartwise } from '@/app/providers/chartwise';
import UserProfileWidget from '../../account/user-profile';
import MobileNav from './mobile';
import { useSettings } from '@/app/providers/settings';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear, faSignOut } from '@fortawesome/free-solid-svg-icons';

export default React.memo(function  SideNav({email}: {email: string | null | undefined}){
  const [isOpen, setIsOpen] = useState(false);
  const {recentAnalyses, deleteAnalysis, viewAnalysis} = useChartwise();
  // const {toggleSettings} = useSettings();
 
  return (
    <>
      <div className="fixed flex flex-col w-[280px] min-h-screen bg-white dark:bg-gray-800 border-r border-gray-300 dark:border-gray-700  p-2 lg:block hidden z-[100]">
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
        <div className='flex h-full flex-col justify-between'>
          <NavLinks navItems={dashboardLinks} />
          <div className="flex-1 max-h-[50vh] overflow-y-auto custom-scrollbar">
            <div className='mr-auto px-1'>
              <RecentAnalyses analyses={recentAnalyses} onClick={viewAnalysis} onDelete={deleteAnalysis}/>
            </div>
          </div>
          <div className="absolute bottom-0 right-0 left-0 p-3 flex flex-col">
            {/* <button onClick={() => {
            toggleSettings();
          }}className='flex flex-row items-center justify-start gap-2 p-2 text-sm font-medium mt-auto focus:cursor-pointer'>
            <FontAwesomeIcon icon={faGear} className='w-4 h-4'/>
            Settings
          </button> */}
            <UserPlanWidget userId={email}/>
            <UserProfileWidget userId={email}/>
          </div>
        </div>
      </div>
    <MobileNav email={email} isOpen={isOpen} onToggleMenu={()=> setIsOpen(prev => !prev)}/>
    </>
  );
})