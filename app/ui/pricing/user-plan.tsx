import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons'; // Replace with the icon similar to the one in your image
import Link from 'next/link';

export default function UserPlanWidget() {
  return (
    <div className='flex flex-col items-center p-1 bg-transparent text-gray-200  rounded-lg shadow-md'>
    <Link href={'/pricing'} className="w-full flex flex-row items-center gap-1">
        <FontAwesomeIcon icon={faStar} className="w-6 w-6"/>
      <div className='flex flex-col gap-1'>
        <div className="w-full text-xs font-semibold">Upgrade plan</div>
        <div className="w-full text-xs opacity-50">Get more credits</div>
      </div>
    </Link>
    </div>
    
  );
};
