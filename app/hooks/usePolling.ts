import { useState, useEffect } from'react';
import { Polling } from '@/app/lib/utils/polling';
import { PollOptions } from '@/app/types';

const usePolling = (callback: () => void, pollingOptions: PollOptions) => {
  const [polling, setPolling] = useState<Polling | null>(null);

  useEffect(() => {
    if (!polling) {
      setPolling(new Polling(callback, pollingOptions));
    }
    return () => {
      if (polling) {
        polling.stop();
      }
    };
  }, [callback, pollingOptions]);

  const startPolling = () => {
    if (polling) {
      polling.start();
    }
  };

  const stopPolling = () => {
    if (polling) {
      polling.stop();
    }
  };

  const restartPolling = () => {
    if (polling) {
      polling.stop();
      polling.start();
    }
  };

  return { startPolling, stopPolling, restartPolling };
};

export default usePolling;
