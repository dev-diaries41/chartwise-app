'use client'
import React, { useState } from 'react';
import Link from 'next/link';
import NavLinks from './sidenav-links';
import { dashboardLinks } from '@/app/constants/navigation';
import {RecentAnalyses, UserPlanWidget, Logo} from '@/app/ui';
import { useChartwise } from '@/app/providers/chartwise';
import UserProfileWidget from '../../user/user-profile';
import MobileNav from './mobilenav';
import { useSettings } from '@/app/providers/settings';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear, faSignOut } from '@fortawesome/free-solid-svg-icons';
import { logout } from '@/app/lib/actions';
import { useSession } from 'next-auth/react';

export default React.memo(function  SideNav(){
  const [isOpen, setIsOpen] = useState(false);
  const { data: session, status } = useSession();
  const email = session?.user?.email;
  const isLoading = status === 'loading';
  console.log({email})
  console.log('Status: ', status)
  console.log({isLoading})

  const {recentAnalyses, deleteAnalysis, viewAnalysis} = useChartwise();
  // const {toggleSettings} = useSettings();
 
  return (
    <>
      <div className="fixed flex flex-col w-[280px] min-h-screen bg-neutral-100 dark:bg-gray-800  p-2 lg:block hidden z-[100]">
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
            <div className='mr-auto p-1'>
              <RecentAnalyses analyses={recentAnalyses} onClick={viewAnalysis} onDelete={deleteAnalysis}/>
            </div>
          </div>
          <div className="absolute bottom-0 right-0 left-0 p-3 flex flex-col gap-4">
            <form action={async() => {
              await logout()}
              }>
              <button
                type='submit'
                className='flex flex-row items-center justify-start gap-2 p-2 text-sm font-medium mt-auto focus:cursor-pointer' >
                <FontAwesomeIcon icon={faSignOut} className='w-4 h-4'/>
                {'Sign out'}
              </button>
            </form>
         
            {/* <button onClick={() => {
            toggleSettings();
          }}className='flex flex-row items-center justify-start gap-2 p-2 text-sm font-medium mt-auto focus:cursor-pointer'>
            <FontAwesomeIcon icon={faGear} className='w-4 h-4'/>
            Settings
          </button> */}
            <UserPlanWidget userId={email} isLoading={isLoading}/>
            <UserProfileWidget userId={email} isLoading={isLoading}/>
          </div>
        </div>
      </div>
    <MobileNav email={email} isLoading={isLoading} isOpen={isOpen} onToggleMenu={()=> setIsOpen(prev => !prev)}/>
    </>
  );
})