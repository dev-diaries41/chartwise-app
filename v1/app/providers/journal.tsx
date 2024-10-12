'use client'
import React, { createContext, useState, useContext } from 'react';
import { ProviderProps, TradeJournalEntry } from '@/app/types';
import { placeholderEntries } from '../constants/placeholder';
import { RetryHandler } from 'devtilities';
import * as ChartwiseClient from "@/app/lib/requests/chartwise-client";
import { TradeJournalEntrySchemaNoUser } from '../constants/schemas';
 
interface JournalContextProps {
    entries: TradeJournalEntry[];
    setEntries: React.Dispatch<React.SetStateAction<TradeJournalEntry[]>>;
    selectedEntry: TradeJournalEntry | null;
    setSelectedEntry: React.Dispatch<React.SetStateAction<TradeJournalEntry|null>>;
    showAddEntryPopup: boolean;
    setShowAddEntryPopup: React.Dispatch<React.SetStateAction<boolean>>;
}

const JournalContext = createContext<JournalContextProps | undefined>(undefined);

const JournalProvider = ({ children }: ProviderProps) => {
    const [entries, setEntries] = useState<TradeJournalEntry[]>([]);
    const [selectedEntry, setSelectedEntry] = useState<TradeJournalEntry | null>(null);
    const [showAddEntryPopup, setShowAddEntryPopup] = useState(false);


  return (
    <JournalContext.Provider value={{
    entries, 
    setEntries,
    showAddEntryPopup, 
    setShowAddEntryPopup,
    selectedEntry, 
    setSelectedEntry
    }}>
      {children}
    </JournalContext.Provider>
  );
};

const useJournal = () => {
  const context = useContext(JournalContext);
  if (!context) {
    throw new Error('useJournal must be used within a JournalProvider');
  }

  const { entries, setEntries, showAddEntryPopup, setShowAddEntryPopup, selectedEntry, setSelectedEntry} = context;

  

  const addEntry = (newEntry: TradeJournalEntry) => {
    setEntries([...entries, newEntry]);
  };

  const updateEntry = (updatedEntry: TradeJournalEntry) => {
    setEntries((prevEntries) => {
      return prevEntries.map((entry) =>
        entry.entryId === updatedEntry.entryId ? updatedEntry : entry
      );
    });
  };

  const submitEntry = async(entry: TradeJournalEntry, userId: string | undefined | null) => {
    const validateEntry = TradeJournalEntrySchemaNoUser.safeParse(entry);
    if(!validateEntry.success){
      alert('error');
      return;
    }
    if (selectedEntry) {
      updateEntry(entry);
    } else {
      addEntry(entry);
    }
    try {
      const retryHandler = new RetryHandler(1)
      if(userId){
        await retryHandler.retry(
          async () => await ChartwiseClient.addJournalEntry(validateEntry.data),
          async(error)=> await ChartwiseClient.refreshOnError(error as Error, userId)
        );
      }
    } catch (error: any) {
      console.error('error adding:', error.message)
    }
  };
  
  const deleteEntry = (entryId: number) => {
    setEntries(entries.filter(entry => entry.entryId !== entryId));
  };

  const toggleAddEntry = () => {
    setShowAddEntryPopup(prev => !prev)
  }

  const openEntry = (entry: TradeJournalEntry) => {
    setSelectedEntry(entry)
  }

  const closePopUp = () => {
    setShowAddEntryPopup(false)
    setSelectedEntry(null)
  }

    return {
        entries,
        showAddEntryPopup,
        selectedEntry,
        deleteEntry,
        toggleAddEntry,
        openEntry,
        closePopUp,
        submitEntry
     };
};

export { JournalContext, JournalProvider, useJournal };
