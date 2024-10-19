'use client';
import React, { useState, useEffect } from'react';
import NavLinks from '@/app/ui/nav/side_navbar/links';
import { navLinks } from '@/app/constants/navigation';

export default function InformationMenu () {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const filteredFooterLinks = navLinks.filter(footerLink =>!['Pricing', 'Home'].includes(footerLink.name))

  const handleClose = (event: MouseEvent) => {
    if (!(event.target instanceof HTMLElement)) return; // Ensures target is an HTMLElement
    if (!event.target.closest('.information-menu-container')) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClose);
    return () => {
      document.removeEventListener('click', handleClose);
    };
  }, []);

  return (
    <div className="information-menu-container relative hidden md:block">
      <button
        onClick={toggleMenu}
        className="border border-gray-700 rounded-full w-8 h-8 flex items-center justify-center text-xl focus:outline-none mt-auto"
      >
       ?
      </button>
      {isOpen && (
        <div className="absolute bottom-12 right-0 p-2 bg-gray-200 dark:bg-gray-800 border border-gray-700 rounded-md shadow-lg w-48 z-10">
         <NavLinks navItems={filteredFooterLinks}/>
        </div>
      )}
    </div>
  );
};