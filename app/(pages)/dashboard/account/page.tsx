import React, { Suspense } from 'react';
import UsageDashboard from '@/app/ui/user/usage';
import { auth } from '@/auth';
import { getAllUsage } from '@/app/lib/requests/chartwise-api';
import Loading from './loading';
import { ErrorBoundary } from 'next/dist/client/components/error-boundary';
import Error from './error';
import { NextRequest } from 'next/server';
import { cookies } from "next/headers";

export const revalidate = 60;

export default async function Page({ req }: { req: NextRequest }) {
    const cookiesStore = cookies()
    const token = cookiesStore.get('jwt')?.value; 
    const session = await auth();
    const usage = await getAllUsage(session?.user?.email!, token);

    return (
        <ErrorBoundary errorComponent={Error}>
            <Suspense fallback={<Loading />}>
                <UsageDashboard usage={usage}/>
            </Suspense>
        </ErrorBoundary>
    );
}
