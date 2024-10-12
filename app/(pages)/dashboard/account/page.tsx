import React, { Suspense } from 'react';
import UsageDashboard from '@/app/ui/user/usage';
import { auth } from '@/auth';
import { chartwiseAPI } from '@/app/lib/requests/chartwise-api';
import { Usage } from '@/app/types';
import Loading from './loading';
import { ErrorBoundary } from 'next/dist/client/components/error-boundary';
import Error from './error';
import { NextRequest } from 'next/server';
import { cookies } from "next/headers";

export const revalidate = 60;

async function getAllUsage(userId: string, token: string | undefined): Promise<Usage> {
    chartwiseAPI.token = token;

    const [todayData, monthData, totalData] = await Promise.all([
        chartwiseAPI.getUsage(userId, 'today'),
        chartwiseAPI.getUsage(userId, 'month'),
        chartwiseAPI.getUsage(userId, 'total'),
    ]);
    return { today: todayData.data, month: monthData.data, total: totalData.data };
}

export default async function Page({ req }: { req: NextRequest }) {
    const cookiesStore = cookies()
    const token = cookiesStore.get('jwt')?.value; 
    const session = await auth();
    const usage = await getAllUsage(session?.user?.email!, token);

    return (
        <ErrorBoundary errorComponent={Error}>
            <Suspense fallback={<Loading />}>
                <UsageDashboard usage={usage} />
            </Suspense>
        </ErrorBoundary>
    );
}
