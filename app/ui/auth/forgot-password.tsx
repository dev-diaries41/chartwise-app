
'use client'
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { useFormStatus } from 'react-dom';
import { sendPasswordResetEmail } from '@/app/lib/actions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CircleLoadingIndicator from '../common/circle-loading-indicator';
import InputError from '../common/form-error';
import { useSearchParams } from 'next/navigation';
import { useActionState } from 'react';

const resetMessage = 'Enter your Email address and we will send you instructions to reset your password.';

export default function ForgotPasswordForm() {
    const initialState = { message: '', errors: {} };
    const [state, dispatch] = useActionState(sendPasswordResetEmail, initialState);
    const searchParams = useSearchParams()
    const error = searchParams.get('error')
 
    return (
    <form action={dispatch} className="w-full space-y-3">
        <div className="w-full md:max-w-[50%] mx-auto rounded-lg px-6 pb-4 pt-8">
        <h1 className="mb-3 text-2xl">
                Reset your password
            </h1>
            {/* <p className="opacity-80 mb-4">{resetMessage}</p> */}
            {(state.message && state.message !== 'Something went wrong.') && (
                <p className="opacity-80 break-words my-4">{state.message}</p>
            )}

            {error && (
                <div className='flex flex-row items-center gap-2'>
                    <FontAwesomeIcon icon={faExclamationCircle} className="h-5 w-5 text-red-500" />
                    <p className="text-sm text-red-500">{error}</p>
                </div>
            )}
                
            <div className="relative">
                <InputError id='email-error' state={state} inputName={'email'} />
                <label className="mb-2 mt-5 block text-xs font-medium" htmlFor="email">
                    Email
                </label>
                <input
                className="peer block w-full bg-transparent rounded-md border border-gray-300 dark:border-gray-700 py-[9px] p-2 text-sm outline-2 placeholder:text-gray-500"
                id="email"
                type="email"
                name="email"
                aria-describedby="email-error"
                placeholder="Enter email address"
                required
                />
            </div>
            <SubmitButton />
            <div className="flex h-8 items-end space-x-1" aria-live="polite" aria-atomic="true">
            {state.message === 'Something went wrong.' && (
                <>
                    <FontAwesomeIcon icon={faExclamationCircle} className="h-5 w-5 text-red-500" />
                    <p className="text-sm text-red-500">{state.message}</p>
                </>
            )}
            </div>
        </div>
    </form>
    );
}

function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <button 
            type="submit"
            className="mt-4 w-full flex gap-2 items-center justify-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            aria-disabled={pending}
            disabled={pending}
        >
            {'Continue'} 
            {pending && <CircleLoadingIndicator size={20} />}
        </button>
    );
}
