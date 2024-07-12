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
            className="relative w-12 h-12"
          />
      <h1 className='w-full mr-4 text-lg  text-gray-200 font-bold'>
        ChartWise
      </h1>
    </div>
  );
};
