import { copyTextToClipboard } from '@/app/lib/utils';
import { ActionRowProps } from '@/app/types';
import { faCopy, faShare, faShareNodes, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';


export default function ActionRow({onCopy, onDelete, shareUrl}:ActionRowProps) {
    return(
      <div className="flex flex-row justify-center items-center mr-auto gap-2">
        <div className="relative group">
          <button
            className="text-gray-400 cursor-pointer hover:bg-gray-700 p-1 rounded-md"
            onClick={onDelete}
          >
            <FontAwesomeIcon icon={faTrash} className="w-4 h-4"/>
          </button>
          <div className="absolute bottom-[-30px] left-1/2 transform -translate-x-1/2 p-1 bg-gray-700 text-white text-xs rounded opacity-0 group-hover:opacity-100">
            Delete
          </div>
        </div>
        <div className="relative group">
          <button
            className="text-gray-400 cursor-pointer hover:bg-gray-700 p-1 rounded-md"
            onClick={onCopy}
          >
            <FontAwesomeIcon icon={faCopy} className="w-4 h-4"/>
          </button>
          <div className="absolute bottom-[-30px] left-1/2 transform -translate-x-1/2 p-1 bg-gray-700 text-white text-xs rounded opacity-0 group-hover:opacity-100">
            Copy
          </div>
        </div>
       {shareUrl &&  <div className="relative group">
          <button
            className="text-gray-400 cursor-pointer hover:bg-gray-700 p-1 rounded-md"
            onClick={() => copyTextToClipboard(shareUrl)}
          >
            <FontAwesomeIcon icon={faShareNodes} className="w-4 h-4"/>
          </button>
          <div className="absolute bottom-[-30px] left-1/2 transform -translate-x-1/2 p-1 bg-gray-700 text-white text-xs rounded opacity-0 group-hover:opacity-100">
            Share
          </div>
        </div>}
      </div>
    )
  }