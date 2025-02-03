// app/reset-password/page.tsx

import CompletePasswordResetForm from '@/app/ui/auth/new-password';
import { verifyToken } from '@/app/lib/auth'; // Ensure this is the correct import path
import { AuthErrors } from '@/app/constants/errors';
import { redirect } from 'next/navigation';

const INVALID_LINK_ERROR = 'Invalid password reset link'
const EXPIRED_LINK_ERROR = 'Password reset link has expired'


interface PageProps {
  searchParams: Promise<{
    token?: string; // Optional token
  }>;
}
export default async function Page(props: PageProps) {
    const searchParams = await props.searchParams;
    const { token } = searchParams; // Get the token from searchParams

    if (!token) {
        redirect(`/forgot-password?error=${encodeURIComponent(INVALID_LINK_ERROR)}`);
    }

    let email = '';
    let errorMessage = '';

    try {
        const result = await verifyToken<{ email: string }>(token);
        email = result.email; // Get the email from the result
    } catch (error: any) {
        console.error(error);
        if (error.message === AuthErrors.EXPIRED_TOKEN) {
            errorMessage = EXPIRED_LINK_ERROR;
        } else {
            errorMessage = INVALID_LINK_ERROR;
        }
        redirect(`/forgot-password?error=${encodeURIComponent(errorMessage)}`);
    }

    return (
        <div className='w-full max-w-5xl my-auto mx-auto justify-center items-center'>
            <CompletePasswordResetForm email={email} />
        </div>
    );
}
