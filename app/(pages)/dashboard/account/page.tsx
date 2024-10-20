import React, { Suspense } from 'react';
import AccountOverview from '@/app/ui/account/account';
import { auth } from '@/auth';
import Loading from './loading';
import { ErrorBoundary } from 'next/dist/client/components/error-boundary';
import Error from './error';
import { NextRequest } from 'next/server';
import { getAllUsage } from '@/app/lib/data/usage';

export const revalidate = 60;

export default async function Page({ req }: { req: NextRequest }) {
    const session = await auth();
    const email = session?.user.email;
    const usage = await getAllUsage(email!);
   
    return (
        <ErrorBoundary errorComponent={Error}>
            <Suspense fallback={<Loading />}>
                <AccountOverview usage={usage} email={email!}/>
            </Suspense>
        </ErrorBoundary>
    );
}
