'use client'
import React, {useState } from 'react';
import { NavItems } from '../nav-items';
import { navLinks } from '@/app/constants/navigation';
import NavLinks from '../side_navbar/sidenav-links';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faBars, faTimes } from '@fortawesome/free-solid-svg-icons';

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(prev => !prev)
  };

  const filteredHeaderLinks = navLinks.filter(footerLink => !['License', 'Terms', 'Privacy Policy', 'Guidelines', 'Home'].includes(footerLink.name))
  const filteredMobHeaderLinks = navLinks.filter(footerLink => !['License', 'Terms', 'Privacy Policy', 'Guidelines'].includes(footerLink.name))


  return (
    <nav className='flex items-center justify-center gap-5'>
      <div className="md:hidden">
        <div className='flex flex-row justify-center items-center gap-4'>
        <Link
          href={'/login'}
          className="flex items-center justify-center bg-emerald-700 hover:bg-emerald-500 text-sm text-white font-medium p-2 rounded-full shadow-md"
        >
          {'Sign In'}
        </Link>
        <button
          onClick={toggleMenu}
          className="navbar-toggler relative z-50"
          type="button"
        >
         <FontAwesomeIcon icon={isOpen? faTimes: faBars} className='w-6 h-6'/>
        </button>
        </div>
       

        {/* Dropdown menu */}
       {isOpen&&  <div className="absolute top-0 right-0 w-full bg-gray-800 border border-r-1 border-gray-700 pt-16 p-4 z-40" id='navbar-menu'>
          <NavLinks navItems={filteredMobHeaderLinks} />
        </div>}

      </div>
      <div className="md:flex items-center gap-5 hidden">
        <NavItems navItems={filteredHeaderLinks} />
        <Link
          href={'/login'}
          className="flex items-center justify-center bg-emerald-700 hover:bg-emerald-500  text-sm text-white font-medium p-2 px-4 rounded-full shadow-md"
        >
          {'Sign In'}
          </Link>
      </div>
    </nav>
  );
}
