import { ActionItem } from '@/app/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

const ActionRow = ({ actions }: { actions: ActionItem[] }) => {
  return (
    <div className="flex flex-row justify-center items-center mr-auto gap-2">
      {actions.map(({ icon, onClick, tooltip, isVisible = true }, index) => (
        isVisible && (
          <div key={index} className="w-full relative group">
            <button
              className="cursor-pointer p-1 rounded-md opacity-80"
              onClick={onClick}
            >
              <FontAwesomeIcon icon={icon} className="w-4 h-4"/>
            </button>
            <span className="absolute bottom-[-30px] left-1/2 transform -translate-x-1/2 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs rounded opacity-0 group-hover:opacity-100 max-w-24 w-24 p-2 shadow-md shadow-black">
              {tooltip}
            </span>
          </div>
        )
      ))}
    </div>
  );
};

export default React.memo(ActionRow);
