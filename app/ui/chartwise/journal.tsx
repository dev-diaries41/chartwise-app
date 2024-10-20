'use client'
import React from 'react';
import AddEntryPopup from '@/app/ui/chartwise/journal-entry';
import { useJournal } from '@/app/providers/journal';
import TradeJournalTable from './journal-table';
import { GetDocsResponse, TradeJournalEntry } from '@/app/types';

export default function TradeJournal({
  email, 
  initialEntries = [],
  metadata,
}: {
    email: string | null | undefined;
    initialEntries: TradeJournalEntry[] | undefined
    metadata:  Pick<GetDocsResponse, 'totalDocuments' | 'perPage' | 'page'> 
  }) {

  const { showAddEntryPopup, entries, selectedEntry, submitEntry, toggleAddEntry, deleteEntry, openEntry, closePopUp } = useJournal(initialEntries);

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col items-center justify-center text-center px-4 overflow-auto lg:max-h-screen pt-16">
      <TradeJournalTable  onAddEntry={toggleAddEntry} onDeleteEntry={deleteEntry} onOpenEntry={openEntry} metadata={metadata}/>
      {(showAddEntryPopup  || selectedEntry)&& (
        <AddEntryPopup
          email ={email!}
          onSubmit={submitEntry}
          onClose={closePopUp}
          numberOfEntries={metadata.totalDocuments || entries.length}
        />
      )}
    </div>
  );
}
