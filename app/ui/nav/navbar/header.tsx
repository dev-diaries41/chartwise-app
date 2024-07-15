'use client'
import React from 'react';
import { NavBar } from '../..';
import Link from 'next/link';
import Logo from '../../logo';
import { usePathname } from 'next/navigation';

export default function Header({...props}) {
  const pathname = usePathname();

  if(pathname === '/trader')return null;
  
  return (
    <div 
    {...props}
    className='flex flex-row w-full max-w-7xl mx-auto items-center justify-between text-gray-200 z-50 px-4 pt-2'
    >
      <Link href={'/'} className='z-50'>
        <Logo src={'/chartwise-icon.png'}/>
      </Link>
    <NavBar/>
    </div>
  );
};
