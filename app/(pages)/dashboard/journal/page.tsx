'use server'
import React, { Suspense } from 'react';
import TradeJournal from '@/app/ui/chartwise/journal';
import { auth } from '@/auth';
import { NextRequest } from 'next/server';
import { ErrorBoundary } from 'next/dist/client/components/error-boundary';
import Loading from './loading';
import Error from './error';
import { getJournalEntries } from '@/app/lib/data/journal';

export default async function Page({ req }: { req: NextRequest }) {
  const session = await auth();
  const email = session?.user?.email;
  const result = await getJournalEntries(email!, 1, 15);

  const {data, totalDocuments, page, perPage} = result || {};
  const iniitalEntries = data;
  const metadata = {totalDocuments, page, perPage};

  return (
    <ErrorBoundary errorComponent={Error}>
      <Suspense fallback={<Loading />}>
        <TradeJournal email={email} initialEntries={iniitalEntries} metadata={metadata}/>
      </Suspense>
    </ErrorBoundary>
  );
}
