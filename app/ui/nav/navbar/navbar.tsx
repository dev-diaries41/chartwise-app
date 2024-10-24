'use client'
import React, { useState, useEffect } from 'react';
import { navLinks } from '@/app/constants/navigation';
import NavLinks from '../side_navbar/links';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import { NavItemsProps } from '@/app/types';

const NavItems = ({ navItems }: NavItemsProps) => {
  return (
    <>
      {navItems.map((navItem, index) => {
        return (
          <Link key={index.toString()} href={navItem.link} className='md:text-lg font-medium'>
            {navItem.name}
          </Link>
        );
      })}
    </>
  );
};

export default function NavBar({ email }: { email: string }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  // Disable background scrolling when the menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';  // Disable scroll
    } else {
      document.body.style.overflow = '';  // Re-enable scroll
    }

    // Cleanup when component is unmounted
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const filteredHeaderLinks = navLinks.filter(
    (footerLink) => !['License', 'Terms', 'Privacy Policy', 'Guide', 'Home'].includes(footerLink.name)
  );
  const filteredMobHeaderLinks = navLinks.filter(
    (footerLink) => !['License', 'Terms', 'Privacy Policy', 'Guide'].includes(footerLink.name)
  );

  return (
    <nav className='flex items-center justify-center gap-5 '>
      <div className="md:hidden">
        <div className='flex flex-row justify-center items-center gap-4'>
          <button
            onClick={toggleMenu}
            className={`navbar-toggler relative z-50 ${isOpen ? "invert dark:invert-0" : ""}`}
            type="button"
          >
            <FontAwesomeIcon icon={isOpen ? faTimes : faBars} className='w-6 h-6' />
          </button>
        </div>

        {/* Dropdown menu */}
        {isOpen && (
          <div className="absolute top-0 right-0 flex flex-col min-h-screen w-full opacity-95 bg-white dark:bg-gray-800 border border-r-1 border-gray-700 text-lg text-black dark:text-white pt-16 p-4 z-40" id='navbar-menu'>
            <NavLinks navItems={filteredMobHeaderLinks} />
            <Link
              href={email ? '/dashboard' : '/login'}
              className="flex items-center justify-center  mt-auto mb-8 bg-emerald-700 hover:bg-emerald-600 border-2 border-emerald-400  text-white font-semibold p-2 rounded-full shadow-sm shadow-black text-sm md:text-md"
            >
              {email ? 'Analyse charts' : 'Log in'}
            </Link>
          </div>
        )}
      </div>
      <div className="md:flex items-center gap-5 hidden">
        <NavItems navItems={filteredHeaderLinks} />
        <Link
          href={email ? '/dashboard' : '/login'}
          className="flex items-center justify-center bg-emerald-700 hover:bg-emerald-600 border-2 border-emerald-400  text-white font-semibold p-2 rounded-full shadow-sm shadow-black text-sm md:text-md"
        >
          {email ? 'Analyse charts' : 'Log in'}
        </Link>
      </div>
    </nav>
  );
}
