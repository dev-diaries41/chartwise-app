'use client'
import React, { useEffect } from 'react';
import { NavItems } from '../nav-items';
import { footerLinks, headerLinks, navLinks } from '@/app/constants/navigation';
import NavLinks from '../side_navbar/sidenav-links';
import Link from 'next/link';

export default function NavBar() {

  const toggleMenu = () => {
    const menu = document.getElementById('navbar-menu');
    if (menu) {
      menu.classList.toggle('hidden');
    }
  };

  useEffect(() => {
    const menu = document.getElementById('navbar-menu');
    if (menu && !menu.classList.contains('hidden')) {
      menu.classList.add('hidden');
    }
  }, []);

  return (
    <nav className='flex items-center justify-center gap-5'>
      <div className="md:hidden">
        <button
          onClick={toggleMenu}
          className="navbar-toggler relative z-50"
          type="button"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Dropdown menu */}
        <div className="absolute top-0 right-0 w-full bg-gray-800 border border-r-1 border-gray-700 pt-24 p-4 z-40 hidden" id='navbar-menu'>
          <NavLinks navItems={[...navLinks, ...footerLinks.filter(link => !['License', 'Terms', 'Privacy Policy'].includes(link.name))]} />
         
        </div>
      </div>
      <div className="md:flex items-center gap-5 hidden">
        <NavItems navItems={headerLinks} />
        <Link
          href={'/trader'}
          className="flex items-center justify-center bg-emerald-700 hover:bg-emerald-500 border-2 border-emerald-400 text-sm text-white font-semibold p-2 px-4 rounded-full shadow-md"
        >
          {'Analyse chart'}
        </Link>
      </div>
    </nav>
  );
}
