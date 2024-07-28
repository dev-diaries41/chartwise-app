import React from 'react'

export default function NotFound({title}: {title: string}){
    return (
        <div className='flex absolute inset-0 justify-center items-center w-full text-xl font-semibold py-16 text-gray-400'>
            {title}
        </div>
      )
}