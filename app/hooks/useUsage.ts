import { useLayoutEffect, useState } from 'react';
import { Usage } from '@/app/types';
import * as ChartwiseClient from '@/app/lib/requests/chartwise-client';
import { RetryHandler } from '@/app/lib/utils/retry';
import { StorageKeys, Time } from '../constants/app';
import {SessionStorage} from '@/app/lib/storage'

export function useUsage(userId: string | null | undefined) {
  const [usage, setUsage] = useState<Usage | null>(null);
  const [loading, setLoading] = useState(true);

  
  useLayoutEffect(() => {
    async function fetchUsage(userId: string) {
      const retryHandler = new RetryHandler(1); 

      try {
      if (SessionStorage.getCachedData<Usage>(StorageKeys.usage, setUsage)) {
        return;
      }
        const fetchedUsage = await retryHandler.retry(
          async () => await ChartwiseClient.getAllUsage(userId),
          (error)=>ChartwiseClient.refreshOnError(error, userId)
        );
        setUsage(fetchedUsage);
        if(fetchedUsage){
          SessionStorage.cacheData(StorageKeys.usage,fetchedUsage);
        }
      } catch (error) {
        console.error('Failed to fetch usage data:', error);
      } finally {
        setLoading(false);
      }
    }

    if (userId) {
      fetchUsage(userId);
    } 
    
  }, [userId]);

  return { usage, loading };
}
