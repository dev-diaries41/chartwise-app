import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { ProviderProps, UserPlan, UserProfileInfo } from '@/app/types';
import { getUserCredits, getUserPlan } from '../lib/user';
import { StorageKeys, Time } from '../constants/app';
import * as Storage from "@/app/lib/storage";
import { getUsage } from '../lib/requests/request';

interface SubscriptionContextProps {
  userPlan: UserPlan;
  setUserPlan: React.Dispatch<React.SetStateAction<UserPlan>>;
}

const SubscriptionContext = createContext<SubscriptionContextProps | undefined>(undefined);

const SubscriptionProvider = ({ children }: ProviderProps) => {
  const [userPlan, setUserPlan] = useState<UserPlan>('Free');

  return (
    <SubscriptionContext.Provider value={{
      userPlan,
      setUserPlan,
    }}>
      {children}
    </SubscriptionContext.Provider>
  );
};

const useSubscription = (userId: string | null | undefined, isLoading: boolean) => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }

  const { userPlan, setUserPlan } = context;
  const handleGetSubscriptionInfo = async (userId: string) => {  
    const cachedData = Storage.get(StorageKeys.subscription);
    if (cachedData) {
      const { userPlan, expiresAt } = cachedData;
      if (Date.now() < expiresAt) {
        setUserPlan(userPlan);
        return;
      }
    }

    const plan = await getUserPlan(userId);
    const ttl = 5 * Time.min;
    const expiresAt = Date.now() + ttl;
    setUserPlan(plan)
    Storage.set(StorageKeys.subscription, JSON.stringify({ userPlan: plan, expiresAt } as UserProfileInfo));
  };

  useEffect(() => {
    if (!isLoading && userId)  {
      handleGetSubscriptionInfo(userId);
    }
  }, [isLoading, userId,]);

  return {
    userPlan,
    setUserPlan,
  };
};

export { SubscriptionContext, SubscriptionProvider, useSubscription };
