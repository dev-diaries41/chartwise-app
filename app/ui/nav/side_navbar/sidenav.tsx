'use client'
import React, { useState } from 'react';
import Link from 'next/link';
import NavLinks from './sidenav-links';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons/faBars';
import { navLinks, footerLinks } from '@/app/constants/navigation';
import { useUser } from '@auth0/nextjs-auth0/client';
import {RecentAnalyses, UserPlanWidget, Logo} from '@/app/ui';
import { usePathname } from 'next/navigation';
import { useTrader } from '@/app/providers/trader';
import UserProfileWidget from '../../user/user-profile';

export default React.memo(function  SideNav(){
  const [isOpen, setIsOpen] = useState(false);
  const { user, isLoading } = useUser();
  const pathName = usePathname();
  const showRecentAnalyses = pathName === '/trader';
  const {recentAnalyses, handleDeleteAnalysis, handleViewAnalysis} = useTrader();

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
          { (showRecentAnalyses) && <div className="flex-1 max-h-[50vh] overflow-y-auto custom-scrollbar">
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
            <UserPlanWidget/>
            <UserProfileWidget userId={user?.email} isLoading={isLoading}/>
          </div>
        </div>
      </div>



      <div className="lg:hidden relative w-full top-0 right-0 p-4">
        <div className=' flex flex-row justify-between bg-transparent items-center z-50'>
        <Link
          className="flex items-center justify-start rounded-3xl z-50"
          href="/"
        >
        <Logo
            src={'/fpflabs-icon-100.png'}
            alt={'logo'}
            width={100}
            height={100}
          />
        </Link>
        <div className='flex flex-row justify-end items-center ml-auto gap-2'>
          <a
          href={user ? '/api/auth/logout' : '/api/auth/login'}
          className={`flex items-center justify-center bg-emerald-700 hover:bg-emerald-500 text-gray-200 font-semibold p-2 rounded-3xl shadow-md`}
        >
          {user ? 'Sign Out' : 'Sign In'}
        </a>
          <button
            className={`flex p-4 text-gray-200 hover:text-gray-200 z-50`}
            onClick={() => setIsOpen(prev => !prev)}
          >
            <FontAwesomeIcon icon={faBars} size="lg" className="w-6 h-6" />
          </button>
        </div>
           
        </div>

        {isOpen && (
          <div className="absolute top-0 right-0 w-full bg-gray-800 border border-r-1 border-gray-700  pt-24 p-4 z-40">
            <NavLinks navItems={[...navLinks, ...footerLinks.filter(link => !['License', 'Terms', 'Privacy policy'].includes(link.name))]} />
              <div className='mt-4 pl-2'>
              <UserProfileWidget userId={user?.email} isLoading={isLoading}/>

              </div>
            <div className="my-4 text-white">
              {/* Placeholder for credits and other elements */}
            </div>
          </div>
        )}
      </div>
    </>
  );
})