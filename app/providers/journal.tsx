'use client'
import React, { createContext, useState, useContext, useEffect, useLayoutEffect } from 'react';
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

const useJournal = (initialEntries?: TradeJournalEntry[]) => {
  const context = useContext(JournalContext);
  if (!context) {
    throw new Error('useJournal must be used within a JournalProvider');
  }

  const { entries, setEntries, showAddEntryPopup, setShowAddEntryPopup, selectedEntry, setSelectedEntry} = context;

  if(initialEntries){
    useLayoutEffect(()=>{
      if(initialEntries.length > 0){
        setEntries(initialEntries)
      }
    },[])
  }
  

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

  const submitEntry = async(entry: TradeJournalEntry) => {
    console.log(entry)
    if (selectedEntry) {
      updateEntry(entry);
    } else {
      addEntry(entry);
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
