import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

export default function DefaultError({ title, reset }: { title: string, reset?: () => void }) {
    return (
        <div className='flex flex-col gap-6 absolute inset-0 justify-center items-center text-center w-full py-16 p-4'>
            <FontAwesomeIcon icon={faExclamationTriangle} className='text-6xl text-red-500 opacity-80' />
            <h1 className='text-2xl font-bold opacity-90'>{title}</h1>
            {reset && (
                <button
                    onClick={() => reset?.()}
                    className='px-6 py-2 mt-4 bg-blue-500 text-white text-lg font-medium rounded-lg shadow-lg hover:bg-blue-600 transition duration-200 ease-in-out'
                >
                    Try Again
                </button>
            )}
            <p className='text-md opacity-70'>Something went wrong. Please try again or contact support if the issue persists.</p>
        </div>
    );
}
