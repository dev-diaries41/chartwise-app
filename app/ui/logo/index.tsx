import React from 'react';
import Image from 'next/image';
import { LogoProps } from '@/app/types';

export default function Logo({
  src,
  alt = 'logo',
  width = 100,
  height = 100,
}: LogoProps) {
  return (
    <div className='flex items-center space-x-1 p-2'>
       <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            className="relative max-w-10 max-h-10"
            priority={true}
          />
        <h1 className='hidden md:block w-full mr-4 text-lg text-gray-200 font-bold'>
          ChartWise
        </h1>
    </div>
  );
};
