import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { ProviderProps, UserPlan, UserProfileInfo } from '@/app/types';
import { getUserCredits, getUserPlan } from '../lib/user';
import { StorageKeys, Time } from '../constants/app';
import * as Storage from "@/app/lib/storage";
import { getUsage } from '../lib/requests/request';

interface SubscriptionContextProps {
  userPlan: UserPlan;
  setUserPlan: React.Dispatch<React.SetStateAction<UserPlan>>;
  credits: number | null;
  setCredits: React.Dispatch<React.SetStateAction<number | null>>;
}

const SubscriptionContext = createContext<SubscriptionContextProps | undefined>(undefined);

const SubscriptionProvider = ({ children }: ProviderProps) => {
  const [userPlan, setUserPlan] = useState<UserPlan>('Free');
  const [credits, setCredits] = useState<number | null>(null);

  return (
    <SubscriptionContext.Provider value={{
      userPlan,
      setUserPlan,
      credits,
      setCredits
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

  const { userPlan, setUserPlan, credits, setCredits } = context;

  const handleGetSubscriptionInfo = useCallback(async (userId: string | null | undefined) => {
    if (!userId) return;

    const cachedData = Storage.get(StorageKeys.subscription);
    if (cachedData) {
      const { userPlan, credits, expiresAt } = cachedData;
      if (Date.now() < expiresAt) {
        setUserPlan(userPlan);
        setCredits(credits);
        return;
      }
    }

    const plan = await getUserPlan(userId);
    const usage = await getUsage(userId, plan);
    const credits = getUserCredits(plan, usage);
    const ttl = 15 * Time.min;
    const expiresAt = Date.now() + ttl;
    setUserPlan(plan);
    setCredits(credits);
    Storage.set(StorageKeys.subscription, JSON.stringify({ userPlan: plan, expiresAt, credits } as UserProfileInfo));
  }, [setUserPlan, setCredits]);

  useEffect(() => {
    if (!isLoading )  {
      handleGetSubscriptionInfo(userId);
    }
  }, [isLoading, userId, handleGetSubscriptionInfo]);

  const decrementCredits = useCallback(() => {
    setCredits(prevCredits => prevCredits ? prevCredits - 1 : prevCredits);
    Storage.set(StorageKeys.subscription, JSON.stringify({ userPlan, expiresAt: Date.now() + 15 * Time.min, credits: credits ? credits - 1 : credits }));
  }, [setCredits, userPlan, credits]);

  return {
    userPlan,
    setUserPlan,
    credits,
    setCredits,
    decrementCredits
  };
};

export { SubscriptionContext, SubscriptionProvider, useSubscription };
