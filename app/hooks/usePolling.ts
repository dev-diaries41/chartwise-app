import { useState, useEffect, useCallback, useRef } from 'react';
import { PollOptions } from '@/app/types';
import { Polling } from 'devtilities';

const usePolling = (callback: () => void | Promise<void>, pollingOptions: PollOptions) => {
  const pollingRef = useRef<Polling | null>(null); // Using ref to hold the polling instance
  const [isPolling, setIsPolling] = useState(false); // Track whether polling is active

  const memoizedCallback = useCallback(callback, [callback]);
  const memoizedPollingOptions = useRef(pollingOptions); // Use ref to hold polling options

  const startPolling = () => {
    if (!pollingRef.current) {
      pollingRef.current = new Polling(memoizedCallback, memoizedPollingOptions.current);
    }
    pollingRef.current.start();
    setIsPolling(true);
  };

  const stopPolling = () => {
    if (pollingRef.current) {
      pollingRef.current.stop();
      pollingRef.current = null; // Clear the polling instance
      setIsPolling(false); // Reset polling state
    }
  };

  useEffect(() => {
    return () => {
      stopPolling();
    };
  }, []);

  return { startPolling, stopPolling, isPolling }; 
};

export default usePolling;
