import React from 'react';

interface SwitchProps {
  value: boolean;
  onChange?: (checked: boolean) => void;
}

export default function Switch({ value, onChange }: SwitchProps) {
  return (
    <label className="relative inline-flex items-center cursor-pointer ml-3">
      <input
        type="checkbox"
        checked={value}
        onChange={(e) => onChange && onChange(e.target.checked)}
        className="sr-only"
      />
      <div
        className={`relative w-10 h-6 p-1 ${value ? 'bg-green-300' : 'bg-gray-300'} rounded-full cursor-pointer transition-colors duration-200 ease-in-out`}
      >
        <div
          className={`absolute w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
            value ? 'translate-x-full bg-blue-500' : ''
          }`}
        ></div>
      </div>
    </label>
  );
};
