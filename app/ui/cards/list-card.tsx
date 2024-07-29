import React from 'react';
import { ListCardProps } from '@/app/types';
import List from '../common/list';

export default function ListCard ({ 
  title, 
  description, 
  items,
  titleClassName,
   ...props 
  }: ListCardProps & { titleClassName?: string }) {
  return (
    <div
      className="flex flex-col min-h-[300px] w-full h-full bg-gray-800 text-gray-300 p-6 rounded-lg transform hover:scale-105 transition-transform duration-300 ease-in-out shadow-black shadow-lg hover:shadow-2xl border-gray-500"
      {...props}
    >
      <div className="text-left flex-grow">
        <h2 className={`mb-2 text-xl font-semibold ${titleClassName}`}>
          {title}
        </h2>
        <div className='border-b border-gray-500 mb-4'></div>
        {description && <p className="max-w-full text-left mb-4 text-md opacity-80 truncate-4-lines">
          {description}
        </p>}
        {items && items.length > 0 && (
          <List items={items} />
        )}
      </div>
    </div>
  );
};
