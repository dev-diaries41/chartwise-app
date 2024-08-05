'use client'
import { FontAwesomeIcon, FontAwesomeIconProps } from '@fortawesome/react-fontawesome';
import React, { ChangeEvent } from 'react';

interface SliderInputProps {
  title: string;
  description?: string;
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
  icon?: FontAwesomeIconProps['icon']
}

const SliderInput: React.FC<SliderInputProps> = ({ min, max, value, icon, title, description, onChange }) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(event.target.value);
    onChange(newValue);
  };

  const calculateBackgroundColor = (value: number) => {
    const green = Math.min(255, 510 - (value * 5.1));
    const red = Math.min(255, value * 5.1);
    return `rgb(${red}, ${green}, 0)`;
  };

  return (
    <div className="w-full flex flex-col items-left gap-1 mb-4">
      <div className='flex flex-row items-center justify-left gap-2 text-md opacity-80'>
        { icon && <FontAwesomeIcon icon={icon} className='w-4 h-4'/> }
        <h2 className="font-semibold  ">{title}</h2>
        <span className="font-semibold  ml-auto">{value}</span>
      </div>
      {description &&<p className="text-left mb-4">{description}</p>}
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={handleChange}
        style={{ background: calculateBackgroundColor(value) }}
        className="w-full h-2 rounded-lg appearance-none cursor-pointer range-sm"
      />
    </div>
  );
};

export default SliderInput
