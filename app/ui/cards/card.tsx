import React from 'react';
import { NavButton } from '@/app/ui/common/button';
import { CardProps } from '@/app/types';
import { faLink, faPlayCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function Card ({ 
  cta, 
  link, 
  title, 
  description, 
  tags, 
  metadata,
   ...props 
  }: CardProps) {
  return (
    <div
    className="flex flex-col min-h-[320px] opacity-90 bg-gray-700 text-gray-300 p-6 rounded-lg transform hover:scale-105 transition-transform duration-300 ease-in-out shadow-black shadow-lg hover:shadow-2xl border-gray-500"
      {...props}
    >
      <div className="text-left flex-grow" >
        <h2 className="mb-2 text-xl font-semibold">
          {title}
        </h2>
        <div className='border-b border-gray-500 mb-4'></div>
        <p className="max-w-full text-left mb-4 text-md opacity-50 truncate-4-lines">
          {description}
        </p>
        {tags && (
          <div className="mb-8 max-w-full mx-auto justify-left items-left flex flex-wrap gap-2 overflow-hidden">
            {tags.map((tag, index) => (
              <span key={index} className="bg-gray-800 text-gray-200 p-1 rounded-md text-sm opacity-70">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>


      <div className="max-w-full flex justify-between items-center text-left mt-auto">
        {metadata && (
          <div className="w-full text-md font-semibold text-gray-400">
            {metadata.map((item, index) => (
              <span key={index} className="mr-2">
                {item}
              </span>
            ))}
          </div>
        )}
        <NavButton 
          icon={faLink} 
          href={link} target="_blank" rel="noopener noreferrer"
          className="flex items-center h-12 w-12 justify-center bg-transparent border-2 border-emerald-500 hover:border-emerald-300 w-full  text-white font-semibold p-2 rounded-lg shadow-md gap-2"
        >
          {cta}
          <FontAwesomeIcon icon={faPlayCircle} className="w-4 h-4" /> 
        </NavButton>
      </div>
    </div>
  );
};
