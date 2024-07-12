import { SelectorProps } from '@/app/types';
import React from 'react';



export default function Selector ({
  options,
  placeholderOption,
  ...props
}: SelectorProps) {
  return (
    <div className={`flex w-full`}>
      <select
        {...props}        
        className="w-full p-2 text-md text-white bg-transparent border border-gray-700 rounded-md"
      >
        <option className="bg-gray-800" value="">{placeholderOption}</option>
        {options.map(option => (
          <option key={option.value} className="bg-gray-800" value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};