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
            <div className="w-full flex flex-row items-center cursor-pointer gap-2" onClick={toggleExpand}>
                <div className='w-full flex flex-row items-center justify-start gap-2'>
                    { icon && <FontAwesomeIcon icon={icon} className='w-4 h-4'/>}
                    <h2 className="text-sm">{title}</h2>
                </div>
                <button className="text-sm">
                    { <FontAwesomeIcon icon={isExpanded? faChevronUp: faChevronDown} className='w-3 h-3'/>}
                </button>
            </div>
            {isExpanded && (
                <div className="w-full pt-4">
                    {children}
                </div>
            )}
        </div>
    );
}
