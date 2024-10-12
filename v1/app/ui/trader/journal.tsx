'use client'
import React from 'react';
import AddEntryPopup from '@/app/ui/trader/journal-entry';
import { useJournal } from '@/app/providers/journal';
import TradeJournalTable from './journal-table';
import SuspenseFallback from '../common/suspense';
import { useSession } from 'next-auth/react';

export default function TradeJournal() {
  const { showAddEntryPopup, entries, loading, selectedEntry, toggleAddEntry, deleteEntry, submitEntry, openEntry, closePopUp } = useJournal();
  const {data: session} = useSession();
  const email = session?.user?.email;

  if(loading)return <SuspenseFallback/>

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col items-center justify-center text-center px-4 overflow-auto">
      <TradeJournalTable entries={entries} onAddEntry={toggleAddEntry} onDeleteEntry={deleteEntry} onOpenEntry={openEntry}/>
      {(showAddEntryPopup  || selectedEntry)&& (
        <AddEntryPopup
          onSubmit={(entry)=>submitEntry(entry, email)}
          onClose={closePopUp}
          numberOfEntries={entries.length}
        />
      )}
    </div>
  );
}
