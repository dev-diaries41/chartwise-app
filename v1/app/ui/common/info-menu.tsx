'use client'
import React, { useState } from 'react';
import NavLinks from '@/app/ui/nav/side_navbar/sidenav-links';
import { navLinks } from '@/app/constants/navigation';

export default function InformationMenu () {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const filteredFooterLinks = navLinks.filter(footerLink => !['Pricing', 'Home'].includes(footerLink.name))


  return (
    <div className="relative hidden md:block">
      <button
        onClick={toggleMenu}
        className="border border-gray-700 invert dark:invert-0 text-white rounded-full w-8 h-8 flex items-center justify-center text-xl focus:outline-none shadow-md shadow-black mt-auto"
      >
        ?
      </button>
      {isOpen && (
        <div className="absolute bottom-12 right-0 p-2 bg-neutral-200 dark:bg-gray-800 border border-gray-700 rounded-md shadow-lg w-48 z-10">
         <NavLinks navItems={filteredFooterLinks}/>
        </div>
      )}
    </div>
  );
};
