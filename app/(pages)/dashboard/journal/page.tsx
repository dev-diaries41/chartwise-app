import React, { Suspense } from 'react';
import TradeJournal from '@/app/ui/trader/journal';
import { cookies } from 'next/headers';
import { auth } from '@/auth';
import { NextRequest } from 'next/server';
import { chartwiseAPI } from '@/app/lib/requests/chartwise-api';
import { ErrorBoundary } from 'next/dist/client/components/error-boundary';
import Loading from './loading';
import Error from './error';

export default async function Page({ req }: { req: NextRequest }) {
  const session = await auth();
  const email = session?.user?.email;
  const cookiesStore = cookies();
  const token = cookiesStore.get('jwt')?.value; 
  chartwiseAPI.token = token;

  const {data} = await chartwiseAPI.getJournalEntries(1, 15) || {}// iniital entries
  const iniitalEntries = data?.data;

  return (
    <ErrorBoundary errorComponent={Error}>
      <Suspense fallback={<Loading />}>
        <TradeJournal email={email} iniitalEntries={iniitalEntries}/>
      </Suspense>
    </ErrorBoundary>
  );
}
