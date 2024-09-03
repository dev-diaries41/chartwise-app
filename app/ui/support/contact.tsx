'use client'
import React, { useEffect } from 'react';
import { useFormState } from 'react-dom';
import { sendNotification } from '@/app/lib/actions';
import InputError from '@/app/ui/common/form-error';
import { toast } from 'react-toastify';
import { DefaultToastOptions } from '@/app/constants/app';
import { SubmitButton } from '@/app/ui/common/button';

const supportOptions: {value:string, name: string}[] = [
  {
    name: 'Select Type',
    value: ''
  },
  {
    name: 'Issues',
    value: 'issues'
  },
  {
    name: 'Feature request',
    value: 'feature-request'
  }
]

export default function ContactForm(){
  const initialState = { message: '', errors: {}};
  const [state, dispatch] = useFormState(sendNotification, initialState);

  useEffect(() => {
    if(state.message === 'MESSAGE SENT'){
      toast.success('Message sent', DefaultToastOptions);
    }
  }, [state])

  return (
    <form action={dispatch} className='w-full'>
      <div className="flex flex-col gap-4 w-full">
      <div className="relative">
          <InputError id='feedback-type-error' state={state} inputName={'feedback-type'} />
          <label htmlFor="feedback-type" className='mb-2 block text-sm font-medium'>Type:</label>
          <select
            id="feedback-type"
            name="feedback-type"
            className="peer block w-full cursor-pointer bg-gray-800 border-2 border-gray-500 p-2 rounded-md"
            aria-describedby="feedback-type-error"
          >
            {
              supportOptions.map((option, index) => {
                return(
                  <option key={index.toString()} className='text-gray-200' value={option.value}>{option.name}</option>
                )
              })
            }
          </select>
        </div>
        <div className="relative">
          <InputError id='email-error' state={state} inputName={'email'} />
          <label htmlFor="email" className='mb-2 block text-sm font-medium'>Email:</label>
          <input
            type="text"
            id="email"
            name="email"
            defaultValue=""
            className="peer block w-full cursor-pointer bg-gray-800 border-2 border-gray-500 p-2 rounded-md"
            placeholder='johndoe@example.com'
            aria-describedby="email-error"
          />
        </div>

        <div className="relative">
          <InputError id='feedback-error' state={state} inputName={'feedback'} />
          <label htmlFor="feedback" className='mb-2 block text-sm font-medium'>Message:</label>
          <textarea
            id="feedback"
            name="feedback"
            className="peer block w-full cursor-pointer mb-4 bg-gray-800 border-2 border-gray-500 min-h-40 max-h-full flex-grow p-2 rounded-md"
            maxLength={500}
            defaultValue=""
            placeholder='Enter message...'
            aria-describedby="feedback-error"
          />
        </div>
        <div className='flex justify-center ml-auto w-[100%] lg:w-[25%] '>
        <SubmitButton/>
        </div>
      </div>
    </form>
  );
};
