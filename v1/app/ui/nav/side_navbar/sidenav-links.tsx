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
              'flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-transparent text-sm font-medium hover:bg-neutral-200 dark:hover:bg-gray-700 justify-start p-2 px-3',
              {
                'text-emerald-500': pathname === navItem.link,
              },
            )}
            {...(navItem.newPage
              ? { target: '_blank', rel: 'noopener noreferrer' }
              : {})}
          >
            {navItem.icon && <FontAwesomeIcon icon={navItem.icon} className="w-4 h-4" />}
            <p className="w-full">{navItem.name}</p>
          </Link>
        );
      })}
    </div>
  );
}
