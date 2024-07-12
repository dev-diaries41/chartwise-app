'use client'
import React, { useState, ReactNode } from 'react';

interface DropDownMenuProps {
    title: string;
    children: ReactNode;
}

export default function DropDownMenu({ title, children }: DropDownMenuProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <div className="w-full max-w-xl mx-auto p-2">
            <div className="flex justify-between items-center cursor-pointer" onClick={toggleExpand}>
                <h2 className="text-sm">{title}</h2>
                <button className="text-sm">
                    {isExpanded ? '▲' : '▼'}
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
