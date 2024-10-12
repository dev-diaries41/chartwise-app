'use client';
 
import { faArrowRight, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { useFormState, useFormStatus } from 'react-dom';
import { authenticate } from '@/app/lib/actions';
import { Button } from '../common/button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
 
export default function LoginForm() {
  const [errorMessage, dispatch] = useFormState(authenticate, undefined);
 
  return (
    <form action={dispatch} className="md:max-w-[50%] mx-auto space-y-3">
      <div className="flex-1 rounded-lg px-6 pb-4 pt-8">
        <h1 className={`mb-3 text-2xl`}>
          Please log in to continue.
        </h1>
        <div className="w-full">
          <div>
            <label
              className="mb-2 mt-5 block text-xs font-medium"
              htmlFor="email"
            >
              Email
            </label>
            <div className="relative">
              <input
                className="peer block w-full bg-transparent rounded-md border border-gray-200 py-[9px] p-2 text-sm outline-2 placeholder:text-gray-500"
                id="email"
                type="email"
                name="email"
                placeholder="Enter email address"
                required
              />
            </div>
          </div>
          <div className="mt-4">
            <label
              className="mb-2 mt-5 block text-xs font-medium"
              htmlFor="password"
            >
              Password
            </label>
            <div className="relative">
              <input
                className="peer block w-full bg-transparent rounded-md border border-gray-200 py-[9px] p-2 text-sm outline-2 placeholder:text-gray-500"
                id="password"
                type="password"
                name="password"
                placeholder="Enter password"
                required
                minLength={6}
              />
            </div>
            <p className='my-4 mb-8' >
              Don't have an account?{' '}
              <Link href="/register" className="text-blue-500 hover:underline">
                Sign Up
              </Link>
            </p>   
          </div>
        </div>
        <LoginButton />
        <div
          className="flex h-8 items-end space-x-1"
          aria-live="polite"
          aria-atomic="true"
        >
          {errorMessage && (
            <>
              <FontAwesomeIcon icon={faExclamationCircle} className="h-5 w-5 text-red-500" />
              <p className="text-sm text-red-500">{errorMessage}</p>
            </>
          )}
        </div>
      </div>
    </form>
  );
}
 
function LoginButton() {
  const { pending } = useFormStatus();
 
  return (
    <button 
    type='submit'
    className="mt-4 w-full flex  gap-2 items-center justify-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" 
    aria-disabled={pending}
    disabled={pending}
    >
      {pending? 'Log in...' : 'Log in'} <FontAwesomeIcon icon={faArrowRight} className="h-5 w-5 text-gray-50 " />
    </button>
  );
}