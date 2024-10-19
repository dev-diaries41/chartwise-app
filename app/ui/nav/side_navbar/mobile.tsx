
'use client'
import React from 'react';
import Link from 'next/link';
import NavLinks from './links';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons/faBars';
import { navLinks, dashboardLinks } from '@/app/constants/navigation';
import {Logo, RecentAnalyses, UserPlanWidget} from '@/app/ui';
import UserProfileWidget from '../../account/user-profile';
import { useChartwise } from '@/app/providers/chartwise';
import { faClose, faGear } from '@fortawesome/free-solid-svg-icons';
import { useSettings } from '@/app/providers/settings';

interface MobileNavProps {
    email: string | null | undefined;
    isOpen: boolean;
    onToggleMenu: () => void;
}
export default function MobileNav({ 
email,
isOpen,
onToggleMenu

}: MobileNavProps){
  const {recentAnalyses, deleteAnalysis, viewAnalysis} = useChartwise();
  const {toggleSettings}=useSettings()
  
    return(
      <div className="lg:hidden w-full p-4 fixed top-0 z-50 opacity-95">
        <div className=' flex flex-row justify-between bg-transparent items-center'>
          <Link
            className="flex items-center justify-start rounded-ful z-50"
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
            <button
              className={`flex z-50`}
              onClick={onToggleMenu}
            >
              <FontAwesomeIcon icon={isOpen? faClose: faBars} size="lg" className="w-6 h-6" />
            </button>
          </div>
        </div>

        {isOpen && (
        <div className=" absolute top-0 right-0 flex flex-col w-full min-h-screen bg-gray-100 dark:bg-gray-800 border border-r-1 border-gray-700 pt-16  p-2">
          <NavLinks navItems={[...dashboardLinks]} />
          <div className="flex-1 mr-auto max-h-[50vh] overflow-y-auto mb-8 custom-scrollbar p-1 ">
            <RecentAnalyses analyses={recentAnalyses} onClick={viewAnalysis} onDelete={deleteAnalysis} />
          </div>
          {/* <button onClick={() => {
            toggleSettings();
            onToggleMenu()
            }}className='flex flex-row items-center justify-start gap-2 p-2 text-sm font-medium mt-auto focus:cursor-pointer'>
            <FontAwesomeIcon icon={faGear} className='w-4 h-4'/>
            Settings
          </button> */}
          <div className='flex flex-col mt-auto'>
            <NavLinks navItems={[ ...navLinks.filter(link => !['License', 'Terms', 'Privacy Policy', 'Pricing', 'Home'].includes(link.name))]} />
            <UserPlanWidget userId={email}/>
          </div>
          <div className="bg-gray-100 dark:bg-gray-700 rounded-md mt-3">
            <UserProfileWidget userId={email} />
          </div>
      </div>
        )}
    </div>
    )
}