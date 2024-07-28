'use client'
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon, FontAwesomeIconProps } from '@fortawesome/react-fontawesome';
import React, { useState, ReactNode } from 'react';

interface DropDownMenuProps {
    title: string;
    children: ReactNode;
    icon?: FontAwesomeIconProps['icon']
}

export default function DropDownMenu({ title, children, icon }: DropDownMenuProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };
 
    return (
        <div className="w-full max-w-xl mx-auto p-2">
            <div className="w-full flex items-center cursor-pointer gap-2" onClick={toggleExpand}>
            <div className='flex flex-row items-center justify-center gap-2'>
                { icon && <FontAwesomeIcon icon={icon} className='w-4 h-4'/>}
                <h2 className="text-sm">{title}</h2>
            </div>
                <button className="text-sm">
                    {isExpanded ? <FontAwesomeIcon icon={faChevronUp} className='w-3 h-3'/> : <FontAwesomeIcon icon={faChevronDown} className='w-3 h-3'/>}
                </button>
            </div>
            {isExpanded && (
                <div className="w-full mt-4">
                    {children}
                </div>
            )}
        </div>
    );
}
