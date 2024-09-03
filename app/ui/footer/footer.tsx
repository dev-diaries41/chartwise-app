
'use client'
import React from 'react';
import FooterLinks from './footer-links';
import InformationMenu from '@/app/ui/common/info-menu';
import { usePathname } from 'next/navigation';
import { shouldHide } from '@/app/lib/utils';


export default function Footer() {
  const pathname = usePathname();
  const pathsToHide = ['/dashboard']
  const hide = shouldHide(pathname, pathsToHide)
  
  return (
    <footer className="flex flex-col  justify-end  mt-auto text-gray-300 text-sm">
     {!hide&& <div className="flex flex-col items-center text-center justify-center px-8 gap-4  py-8">
        <div className='lg:hidden'>
        <FooterLinks/>
        </div>
       {!hide&& <p className="text-gray-400">
          Copyright © {new Date().getFullYear()} FPF Labs. All rights reserved.
        </p>}
      </div>}
      <div className='fixed bottom-4 right-4'>
      <InformationMenu/>
      </div>
    </footer>
  );
};
