import React from 'react';
import Link from 'next/link';
import { NavItem } from '@/app/types';


const FooterLinks = ({links}: {links: NavItem[]}) => {
  return (
      <div className="flex flex-col md:flex-row items-start text-left  justify-center gap-4 order-1 md:order-2">
        {links.map((footerItem, index) => {
            return (
              <Link
                key={index.toString()}
                href={footerItem.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-500 transition-colors"
              >
                {footerItem.name}
              </Link>
            )})}
      </div>
  );
};

export default FooterLinks