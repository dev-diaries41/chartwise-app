'use client'
import { RecentAnalysesProps } from '@/app/types';
import React from 'react';
import DropDownMenu from '@/app/ui/common/dropdown-menu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';

export default function RecentAnalyses({
    analyses,
    onClick,
    onDelete
}: RecentAnalysesProps) {
    return (
        <DropDownMenu title="Recent Analyses">
            {analyses.map((analysis, index) => (
                <div 
                    key={index} 
                    className="p-2 flex justify-between items-center cursor-pointer text-gray-400 text-xs hover:bg-gray-700 rounded-md transition duration-300 overflow-hidden whitespace-nowrap relative group"
                >
                    <span 
                        className="flex-grow overflow-hidden overflow-ellipsis whitespace-nowrap pr-1"
                        onClick={() => onClick(analysis)}
                    >
                        {analysis.name}
                    </span>
                    <FontAwesomeIcon 
                        icon={faTrashAlt} 
                        className="ml-1 cursor-pointer text-red-500 hover:text-red-700 transition duration-300 opacity-0 group-hover:opacity-100"
                        onClick={() => onDelete(analysis)}
                    />
                </div>
            ))}
        </DropDownMenu>
    );
}
