'use client'
import React, { createContext, useState, useContext, useEffect } from 'react';
import { ProviderProps, TradeJournalEntry } from '@/app/types';
import { placeholderEntries } from '../constants/placeholder';
import { useLoading } from '../hooks';
import { RetryHandler } from 'devtilities';
import * as ChartwiseClient from "@/app/lib/requests/chartwise-client";
import { useUser } from '@auth0/nextjs-auth0/client';
import { RequestErrors } from '../constants/errors';
import { TradeJournalEntrySchemaNoUser } from '../constants/schemas';
 
interface JournalContextProps {
    entries: TradeJournalEntry[];
    setEntries: React.Dispatch<React.SetStateAction<TradeJournalEntry[]>>;
    selectedEntry: TradeJournalEntry | null;
    setSelectedEntry: React.Dispatch<React.SetStateAction<TradeJournalEntry|null>>;
    showAddEntryPopup: boolean;
    loading: boolean;
    setShowAddEntryPopup: React.Dispatch<React.SetStateAction<boolean>>;
}

const JournalContext = createContext<JournalContextProps | undefined>(undefined);

const JournalProvider = ({ children }: ProviderProps) => {
    const [entries, setEntries] = useState<TradeJournalEntry[]>([]);
    const [selectedEntry, setSelectedEntry] = useState<TradeJournalEntry | null>(null);
    const [showAddEntryPopup, setShowAddEntryPopup] = useState(false);
    const { loading, setLoading } = useLoading(true);
    const {user, isLoading} = useUser();
    const userId = user?.email

    useEffect(()=>{
      async function fetchJournalEntries(userId: string){
        try{
          const retryHandler = new RetryHandler(1);
          const result = await retryHandler.retry(
            async () => await ChartwiseClient.getJournalEntries(1, 15),
            async(error)=> await ChartwiseClient.refreshOnError(error as Error, userId)
          );
          console.log("results: ", result);
          setEntries(result.data || []);
        }catch(error: any){
          console.error(error.message);
          if(error.message === RequestErrors.NO_DOCS_FOUND){
            setEntries([]);
          }
        }finally{
          setLoading(false);
        }
      }

      if(userId && !isLoading){
        fetchJournalEntries(userId);
      }
    },[isLoading, userId]);

  return (
    <JournalContext.Provider value={{
    loading,
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

  const { entries, loading, setEntries, showAddEntryPopup, setShowAddEntryPopup, selectedEntry, setSelectedEntry} = context;

  

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
        loading,
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
