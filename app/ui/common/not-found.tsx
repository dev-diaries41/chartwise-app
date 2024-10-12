import React from 'react'

export default function DefaultError({title, reset}: {title: string, reset?: () => void}){
    return (
        <div className='flex flex-col gap-8 absolute inset-0 justify-center items-center w-full py-16'>
            <h1 className='text-xl font-bold  opacity-80'>{title}</h1>
            { reset && <button
            onClick={() => reset?.()}
            >
            <h2 className='text-lg font-medium opacity-80'>Try again</h2>
            </button>}
        </div>
    )
}