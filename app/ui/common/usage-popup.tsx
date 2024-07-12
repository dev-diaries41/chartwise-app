'use client'
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { CTAPopUpProps } from '@/app/types';


export default function PopUp ({ onClose, onConfirm, title, description, cta }: CTAPopUpProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-8 lg:p-0 text-gray-200 ">
      <div className="bg-gray-700 rounded-lg shadow-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-white">{title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-400">
            <FontAwesomeIcon icon={faTimes} size="lg" />
          </button>
        </div>
        <p className="mb-6 text-left">
          {description}
        </p>
        <div className="flex justify-end gap-4">
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white font-semibold rounded-3xl shadow-sm"
          >
            {cta}
          </button>
        </div>
      </div>
    </div>
  );
};