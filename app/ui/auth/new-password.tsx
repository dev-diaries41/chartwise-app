'use client'
import React, { useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { resetPassword } from '@/app/lib/actions';
import InputError from '@/app/ui/common/form-error';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/navigation';
import {RESET_SUCCESS} from '@/app/constants/messages';
import CircleLoadingIndicator from '../common/circle-loading-indicator';
import { CompleteResetState } from '@/app/types';


export default function CompletePasswordResetForm({email}: any){
    const initialState = { message: '', errors: {}};
    const [state, dispatch] = useActionState((prevState: CompleteResetState, formData: FormData) => resetPassword(prevState, formData, email), initialState); // Pass email here
    const router = useRouter();
    console.log({email})


  useEffect(() => {
    if(state.message === RESET_SUCCESS){
      setTimeout(() => router.push('/login'), 1500)
    }
  },[state])

  return (
    <form action={dispatch} className='md:max-w-[50%] w-full mx-auto p-4'>
      <div className="flex flex-col gap-4 w-full">
      <h1 className={`mb-3 text-2xl`}>
          Create new password
        </h1>
         { state.message && <div className='flex flex-row justify-start items-center gap-2 rounded-md'>
            <FontAwesomeIcon icon={state.message === RESET_SUCCESS? faCheckCircle : faExclamationCircle} className={`h-5 w-5 ${state.message === RESET_SUCCESS? 'text-emerald-500' : 'text-red-500'}`} />
            <p className={`text-sm opacity-80`}>{state.message}</p>
          </div>}
          
        <div className="relative">
          <InputError id='password-error' state={state} inputName={'password'} />
          <label htmlFor="password" className='mb-2 block text-sm font-medium'>Password</label>
          <input
            type="password"
            id="password"
            name="password"
            className="peer block w-full cursor-pointer bg-transparent border-2 border-gray-500 p-2 rounded-md"
            defaultValue=""
            placeholder='Enter new password'
            aria-describedby="password-error"
            required
          />
        </div>

        <div className="relative">
          <InputError id='confirm-password-error' state={state} inputName={'confirm-password'} />
          <label htmlFor="confirm-password" className='mb-2 block text-sm font-medium'>Confirm password</label>
          <input
            type="password"
            id="confirm-password"
            name="confirm-password"
            className="peer block w-full cursor-pointer bg-transparent border-2 border-gray-500 p-2 rounded-md"
            defaultValue=""
            placeholder='Confirm your new password'
            aria-describedby="confirm-password-error"
            required
          />
        </div>
        <div className='flex justify-center ml-auto w-[100%]'>
          <CompletePasswordResetButton/>
        </div>
      </div>
    </form>
  );
};

function CompletePasswordResetButton() {
  const { pending } = useFormStatus();
 
  return (
    <button 
    type='submit'
    className="mt-4 w-full flex  gap-2 items-center justify-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" 
    aria-disabled={pending}
    disabled={pending}
    > {'Reset password'} 
      {pending && <CircleLoadingIndicator size={20}/>}
    </button>
  );
}