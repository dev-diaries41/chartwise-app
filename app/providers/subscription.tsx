import React, { createContext, useState, useContext, useEffect } from 'react';
import { ProviderProps, UserPlan, UserProfileInfo } from '@/app/types';
import { getUserPlan } from '../lib/user';
import { StorageKeys, Time } from '../constants/app';
import * as Storage from "@/app/lib/storage/local";

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
    const cachedData = Storage.get<UserProfileInfo>(StorageKeys.subscription);
    if (cachedData && typeof cachedData === 'object') {
      const { userPlan, expiresAt } = cachedData;
      if (Date.now() < expiresAt) {
        setUserPlan(userPlan);
        return;
      }
    }

    const plan = await getUserPlan(userId);
    const ttl = Time.min;
    const expiresAt = Date.now() + ttl;
    setUserPlan(plan)
    Storage.set(StorageKeys.subscription, JSON.stringify({ userPlan: plan, expiresAt } as UserProfileInfo));
  };

  useEffect(() => {
    if (!isLoading && userId)  {
      handleGetSubscriptionInfo(userId);
    }
  }, [isLoading, userId, handleGetSubscriptionInfo]);

  return {
    userPlan,
    setUserPlan,
  };
};

export { SubscriptionContext, SubscriptionProvider, useSubscription };
