'use client'
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon, FontAwesomeIconProps } from '@fortawesome/react-fontawesome';
import React, { useState, ReactNode } from 'react';

interface DropDownMenuProps {
    title: string;
    children: ReactNode;
    icon?: FontAwesomeIconProps['icon']
    titleClassName?: string
}

export default function DropDownMenu({ title, children, icon, titleClassName }: DropDownMenuProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };
 
    return (
        <div className="w-full">
            <div className="w-full flex flex-row items-start cursor-pointer gap-2  rounded-md p-2 py-3" onClick={toggleExpand}>
                <div className='w-full flex flex-row items-center justify-start gap-2 '>
                    { icon && <FontAwesomeIcon icon={icon} className='w-4 h-4'/>}
                    <h2 className={titleClassName || "font-medium text-left"}>{title}</h2>
                </div>
                <button className="text-sm">
                    { <FontAwesomeIcon icon={isExpanded? faChevronUp: faChevronDown} className='w-3 h-3'/>}
                </button>
            </div>
            {isExpanded && (
                <div className="w-full">
                    {children}
                </div>
            )}
        </div>
    );
}
