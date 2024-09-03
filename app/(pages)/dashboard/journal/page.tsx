'use client'
import React from 'react';
import { JournalProvider } from '@/app/providers/journal';
import TradeJournal from '@/app/ui/trader/journal';

export default function Page() {

  return (
    <JournalProvider>
      <TradeJournal/>
    </JournalProvider>
  );
}
