import React from 'react';
import { ListCardProps } from '@/app/types';
import List from '../common/list';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function ListCard ({ 
  title, 
  description, 
  items,
  icon,
  iconColor,
  titleClassName,
   ...props 
  }: ListCardProps & { titleClassName?: string }) {
  return (
    <div
      className="flex flex-col min-h-[300px] w-full h-full bg-gray-900 p-6 rounded-lg transform hover:scale-105 transition-transform duration-300 ease-in-out shadow-black shadow-lg hover:shadow-xl border border-gray-700"
      {...props}
    >
      <div className="text-left flex-grow">
        <div className='flex flex-row items-center gap-2 mb-2'>
        { icon && <FontAwesomeIcon icon={icon} color={iconColor} className='w-6 h-6'/>}
        <h2 className={` text-xl font-semibold ${titleClassName}`}>
          {title}
        </h2>
        </div>
      
        <div className=' mb-4'></div>
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
