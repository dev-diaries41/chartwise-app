'use client'
import React from 'react';
import AddEntryPopup from '@/app/ui/chartwise/journal-entry';
import { useJournal } from '@/app/providers/journal';
import TradeJournalTable from './journal-table';
import { TradeJournalEntry } from '@/app/types';

export default function TradeJournal({
  email, 
  iniitalEntries = []}: {
    email: string | null | undefined;
    iniitalEntries: TradeJournalEntry[] | undefined
  }) {
  const { showAddEntryPopup, entries, selectedEntry, toggleAddEntry, deleteEntry, submitEntry, openEntry, closePopUp } = useJournal();

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col items-center justify-center text-center px-4 overflow-auto">
      <TradeJournalTable entries={entries.length === 0? iniitalEntries : entries} onAddEntry={toggleAddEntry} onDeleteEntry={deleteEntry} onOpenEntry={openEntry}/>
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
