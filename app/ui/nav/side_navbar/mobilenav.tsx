
'use client'
import React from 'react';
import Link from 'next/link';
import NavLinks from './sidenav-links';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons/faBars';
import { navLinks, footerLinks } from '@/app/constants/navigation';
import { UserProfile } from '@auth0/nextjs-auth0/client';
import {Logo, RecentAnalyses, UserPlanWidget} from '@/app/ui';
import UserProfileWidget from '../../user/user-profile';
import { useChartwise } from '@/app/providers/chartwise';
import { faClose, faGear } from '@fortawesome/free-solid-svg-icons';
import { useSettings } from '@/app/providers/settings';
import Switch from '../../common/switch';

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
  const {recentAnalyses, deleteAnalysis, viewAnalysis, mode, toggleMode} = useChartwise();
  const {toggleSettings}=useSettings()
  
    return(
      <div className="lg:hidden w-full p-4">
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
          <div className='flex flex-row justify-end items-center ml-auto'>
          <div className='flex flex-row items-center ml-auto justify-between text-sm p-3 font-medium focus:cursor-pointer text-gray-400'>
          Chart mode
          <Switch value={mode ==='analysis'? false:true} onChange={toggleMode} />
        </div>
            <button
              className={`flex text-gray-200 hover:text-gray-200 z-50`}
              onClick={onToggleMenu}
            >
              <FontAwesomeIcon icon={isOpen? faClose: faBars} size="lg" className="w-6 h-6" />
            </button>
          </div>
        </div>

        {isOpen && (
        <div className="absolute top-0 right-0 flex flex-col w-full min-h-screen bg-gray-800 border border-r-1 border-gray-700 pt-24  p-2 z-40 ">
        <NavLinks navItems={[...navLinks, ...footerLinks.filter(link => !['License', 'Terms', 'Privacy Policy', 'Pricing'].includes(link.name))]} />
        <div className="flex-1 mr-auto max-h-[50vh] overflow-y-auto mb-8 custom-scrollbar p-1">
          <RecentAnalyses analyses={recentAnalyses} onClick={viewAnalysis} onDelete={deleteAnalysis} />
        </div>
        {/* <button onClick={() => {
          toggleSettings();
          onToggleMenu()
          }}className='flex flex-row items-center justify-start gap-2 p-2 text-sm font-medium mt-auto focus:cursor-pointer'>
          <FontAwesomeIcon icon={faGear} className='w-4 h-4'/>
          Settings
        </button> */}
        <div className='mt-auto'>
        <UserPlanWidget userId={user?.email} isLoading={isLoading}/>

        </div>
        <div className="bg-gray-700 p-2 rounded-md mt-auto">
          <UserProfileWidget userId={user?.email} isLoading={isLoading} />
        </div>
    </div>
      )}
    </div>
    )
}