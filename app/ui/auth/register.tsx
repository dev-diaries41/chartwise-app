'use client'
import React, { useEffect } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { register } from '@/app/lib/actions';
import InputError from '@/app/ui/common/form-error';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/navigation';
import Link from 'next/link';


export default function RegistrationForom(){
  const initialState = { message: '', errors: {}};
  const [state, dispatch] = useFormState(register, initialState);
  const router = useRouter();

  useEffect(() => {
    if(state.message === 'Registration successful'){
      setTimeout(() => router.push('/login'), 1500)
    }
  },[state])

  return (
    <form action={dispatch} className='md:max-w-[50%] w-full mx-auto p-4'>
      <div className="flex flex-col gap-4 w-full">
      <h1 className={`mb-3 text-2xl`}>
          Create your account
        </h1>
      {state.message === 'Registration successful' && (
          <div className='flex flex-row justify-start items-center gap-2'>
            <FontAwesomeIcon icon={faCheckCircle} className="h-5 w-5 text-emerald-500" />
            <p className="text-sm text-emerald-500">{state.message}</p>
          </div>
          )}
        <div className="relative">
          <InputError id='email-error' state={state} inputName={'email'} />
          <label htmlFor="email" className='mb-2 block text-sm font-medium'>Email</label>
          <input
            type="text"
            id="email"
            name="email"
            defaultValue=""
            className="peer block w-full cursor-pointer bg-transparent border-2 border-gray-500 p-2 rounded-md"
            placeholder='Enter email address'
            aria-describedby="email-error"
            required
          />
        </div>

        <div className="relative">
          <InputError id='password-error' state={state} inputName={'password'} />
          <label htmlFor="password" className='mb-2 block text-sm font-medium'>Password</label>
          <input
            type="password"
            id="password"
            name="password"
            className="peer block w-full cursor-pointer bg-transparent border-2 border-gray-500 p-2 rounded-md"
            defaultValue=""
            placeholder='Enter password'
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
            placeholder='Confirm your password'
            aria-describedby="confirm-password-error"
            required
          />
        </div>
        <p className='my-2' >
          Already have an account?{' '}
          <Link href="/login" className="text-blue-500 hover:underline">
            Login
          </Link>
        </p>   
        <div className='flex justify-center ml-auto w-[100%]'>
          <RegisterButton/>
        </div>
      </div>
    </form>
  );
};

function RegisterButton() {
  const { pending } = useFormStatus();
 
  return (
    <button 
    type='submit'
    className="mt-4 w-full flex  gap-2 items-center justify-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" 
    aria-disabled={pending}
    disabled={pending}
    > {pending? 'Sign up...' : 'Sign up'} 
    </button>
  );
}