import React from 'react';
import LoaderIndicator from '@/app/ui/common/loading-indicator';
import { positions } from '@/app/constants/layout';
import { LoaderDialogProps } from '@/app/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

export default function LoaderDialog ({ title, description, status, queue, position ='BOTTOM_RIGHT', onMinimize }:LoaderDialogProps) {
  return (
    <div
      className={`fixed ${positions[position]} flex flex-col animate-fadeIn text-left items-left p-6 rounded-md shadow-md shadow-black opacity-95 bg-white dark:bg-gray-800 z-[100]`}
      style={{
        width: 'calc(100% - 2rem)',
        maxWidth: '400px',
        backdropFilter: 'blur(8px)',
      }}
    >
      
      <div className="relative flex justify-left gap-4 items-center mb-4">
      <button
        className="absolute top-0 right-0 self-end p-1 text-sm  w-6 h-6  justify-center items-center"
        onClick={onMinimize}
      >
      <FontAwesomeIcon icon={faTimes} className="w-4 h-4 opacity-80 hover:opacity-100" /> 
      </button>
      <LoaderIndicator size={24}/>
        <h2 className={`text-md font-bold max-w-[80%]`}>{title}</h2>
      </div>
      <p className={`text-sm mb-4`}>{description}</p>
      <div className='flex flex-row items-center justify-between gap-2 mt-auto'>
        {status&&<p className={`text-sm mb-4 opacity-80`}>Status: {status}</p>}
        {(!!queue && queue > 0) && <p className={`text-sm mb-4 opacity-80`}>{`Queue: ${queue}`}</p>}
      </div>
    </div>
  );
};
