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
    <div className='flex items-center space-x-1'>
       <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            className="relative max-w-9 max-h-9 md:max-w-12 md:max-h-12 "
            priority={true}
          />
        <h1 className='w-full mr-2 text-lg sm:text-xl md:text-2xl font-semibold bg-gradient-to-r from-emerald-700 via-emerald-500 to-emerald-400 text-transparent bg-clip-text'>
          ChartWise
        </h1>
    </div>
  );
};
