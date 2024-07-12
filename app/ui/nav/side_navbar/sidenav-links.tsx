"use client"
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { NavItemsProps } from '@/app/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


export default function NavLinks({navItems}: NavItemsProps) {
  const pathname = usePathname();

  return (
    <div className='flex flex-col'>
      {navItems.map((navItem) => {
        return (
          <Link
            key={navItem.name}
            href={navItem.link}
            className={clsx(
              'flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-transparent p-3 text-sm font-medium hover:bg-gray-700 hover:text-emerald-600 md:flex-none md:justify-start md:p-2 md:px-3',
              {
                'bg-emerald-100 text-emerald-600': pathname === navItem.link,
              },
            )}
          >
            {navItem.icon && <FontAwesomeIcon icon={navItem.icon} className="w-6 h-6" />}
            <p className="w-full">{navItem.name}</p>
          </Link>
        );
      })}
    </div>
  );
}
