
'use client'
import React from 'react';
import FooterLinks from './footer-links';
import InformationMenu from '@/app/ui/common/info-menu';
import { usePathname } from 'next/navigation';


export default function Footer() {
  const pathname = usePathname();
  const hide = pathname === '/trader'

  return (
    <footer className=" relative flex flex-col mt-auto justify-end py-8 text-gray-300">
      <div className="flex flex-col items-center text-center justify-center px-8 gap-4">
        <div className='lg:hidden'>
        <FooterLinks/>
        </div>
       {!hide&& <p className="text-gray-400">
          Copyright © {new Date().getFullYear()} FPF Labs. All rights reserved.
        </p>}
      </div>
      <div className='fixed bottom-4 right-4'>
      <InformationMenu/>
      </div>
    </footer>
  );
};
