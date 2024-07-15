
'use client'
import React from 'react';
import Link from 'next/link';
import NavLinks from './sidenav-links';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons/faBars';
import { navLinks, footerLinks } from '@/app/constants/navigation';
import { UserProfile } from '@auth0/nextjs-auth0/client';
import {Logo, RecentAnalyses} from '@/app/ui';
import UserProfileWidget from '../../user/user-profile';
import { useTrader } from '@/app/providers/trader';
import { usePathname } from 'next/navigation';

interface MobileNavProps {
    user: UserProfile | undefined;
    isOpen: boolean;
    isLoading: boolean;
    onToggleMenu: () => void;
}
export default function MobileNav({
user,
isOpen,
isLoading,
onToggleMenu

}: MobileNavProps){
  const {recentAnalyses, handleDeleteAnalysis, handleViewAnalysis} = useTrader();
  const pathName = usePathname();
  

    return(

      <div className="lg:hidden relative w-full top-0 right-0 p-4">
      <div className=' flex flex-row justify-between bg-transparent items-center z-50'>
      <Link
        className="flex items-center justify-start rounded-3xl z-50"
        href="/"
      >
      <Logo
          src={'/chartwise-icon.png'}
          alt={'logo'}
          width={100}
          height={100}
        />
      </Link>
      <div className='flex flex-row justify-end items-center ml-auto gap-4'>
        <a
        href={user ? '/api/auth/logout' : '/api/auth/login'}
        className={`flex items-center justify-center bg-emerald-700 hover:bg-emerald-500 text-sm text-gray-200 font-semibold p-2 rounded-3xl shadow-md`}
      >
        {user ? 'Sign Out' : 'Sign In'}
      </a>
        <button
          className={`flex text-gray-200 hover:text-gray-200 z-50`}
          onClick={onToggleMenu}
        >
          <FontAwesomeIcon icon={faBars} size="lg" className="w-6 h-6" />
        </button>
      </div>
         
      </div>

       {isOpen && (
      <div className="absolute top-0 right-0 w-full min-h-screen bg-gray-800 border border-r-1 border-gray-700 pt-24 p-4 z-40 flex flex-col">
      <NavLinks navItems={[...navLinks, ...footerLinks.filter(link => !['License', 'Terms', 'Privacy policy'].includes(link.name))]} />
      <div className="flex-1 max-h-[50vh] overflow-y-auto mb-8 custom-scrollbar pl-2">
        <RecentAnalyses analyses={recentAnalyses} onClick={handleViewAnalysis} onDelete={handleDeleteAnalysis} />
      </div>
      <div className="bg-gray-700 p-2 rounded-md mt-auto">
        <UserProfileWidget userId={user?.email} isLoading={isLoading} />
      </div>
    </div>
    
      )}
    </div>
    )
}