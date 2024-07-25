import { Background } from '@/app/ui';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlayCircle } from '@fortawesome/free-solid-svg-icons';


export default async function Page() {
  return (
    <div className='w-full my-auto'>
      <Image
      src={'/background.jpg'}
      alt='bg'
      width={1000}
      height={1000}
      className='absolute top-0 left-0 w-full h-screen object-cover opacity-10'
      />
       <div className="animate-fadeIn relative flex flex-col max-w-5xl w-full mx-auto items-center justify-center text-center  opacity-90 p-8">
        <Background />
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute inset-0 bg-gradient-radial from-gray-800 to-gray-900 opacity-50 blur-2xl"></div>
        </div> 
    
        {/* {make theis part in the centere of the page} */}
        <div className="w-full z-[10] flex flex-col py-16 justify-center items-center">
          <h1 className="text-center lg:text-7xl md:text-5xl text-4xl my-4 px-3 font-bold text-gray-200">
            Chart analysis made easy! <span className="bg-gradient-to-r from-emerald-400 to-emerald-700 text-transparent bg-clip-text">Upload</span>.{" "}
            <span className="bg-gradient-to-r from-red-400 to-red-600 text-transparent bg-clip-text">Analyse</span>. Trade
          </h1>
          <p className="text-sm md:text-md lg:text-lg text-gray-400 mb-5 px-3 opacity-90 mt-4 max-w-[100%] lg:max-w-[80%]">
          ChartWise helps traders identify patterns, trends, and more, and provides detailed insights to inform precise trade execution strategies.</p>
          <Link
            href='/trader'
            className={`w-[80%] md:w-[60%] lg:w-[40%] h-12 md:h-16 lg:h-20 flex flex-row items-center gap-2 justify-center bg-emerald-700 hover:bg-emerald-500 border-2 border-emerald-400 text-gray-200 font-semibold p-2 rounded-full shadow-md text-lg md:text-xl lg:text-2xl mt-4 bounce`}
          >
            {'Try for free'}
            <FontAwesomeIcon icon={faPlayCircle} className='w-4 md:w-6 h-4 md:h-6 mr-1'/>
          </Link>
        </div>
      </div>
    </div>
  );
}
