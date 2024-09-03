'use client'
import React from 'react';
import { NavBar } from '../..';
import Link from 'next/link';
import Logo from '../../logo';
import { usePathname } from 'next/navigation';
import { shouldHide } from '@/app/lib/utils';

export default function Header({...props}) {
  const pathname = usePathname();
  const pathsToHide = ['/dashboard'];

  if(shouldHide(pathname, pathsToHide))return null;
  
  return (
    <div 
    {...props}
    className='sticky top-0 flex flex-row w-full mx-auto items-center justify-between pt-2 z-50'
    >
      <div className='flex flex-row w-full max-w-7xl mx-auto items-center justify-between px-4'>
      <Link href={'/'} className='z-50'>
        <Logo src={'/chartwise-icon.png'}/>
      </Link>
    <NavBar/>
      </div>
    </div>
  );
};
