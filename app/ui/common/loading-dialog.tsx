import React from 'react';
import LoaderIndicator from '@/app/ui/utilities/loading-indicator';
import { themes } from '../../constants/layout/theme';
import { positions } from '@/app/constants/layout/style';
import { LoaderDialogProps } from '@/app/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

export default function LoaderDialog ({ title, description, position ='BOTTOM_RIGHT', onMinimize }:LoaderDialogProps) {
  return (
    <div
      className={`fixed ${positions[position]} flex flex-col animate-fadeIn text-left items-left p-6 rounded-md shadow-lg shadow-black opacity-95 bg-${themes.dark.secondary} z-[100]`}
      style={{
        width: 'calc(100% - 2rem)',
        maxWidth: '400px',
        backdropFilter: 'blur(8px)',
      }}
    >
      
      <div className="relative flex justify-left gap-4 items-center mb-4">
      <button
        className="absolute top-0 right-0 self-end p-1 text-sm  w-6 h-6  justify-center items-center text-gray-200 hover:text-gray-400"
        onClick={onMinimize}
      >
      <FontAwesomeIcon icon={faTimes} className="w-4 h-4 opacity-70" /> 
      </button>
      <LoaderIndicator size={24}/>
        <h2 className={`text-md font-bold max-w-[80%]`}>{title}</h2>
      </div>
      <p className={`text-sm mb-4`}>{description}</p>
      
    </div>
  );
};
