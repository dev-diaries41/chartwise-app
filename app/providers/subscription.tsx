import React, { createContext, useState, useContext, useLayoutEffect } from 'react';
import { ProviderProps, UserPlan } from '@/app/types';
import { handleGetSubscriptionInfo } from '../lib/user';
import { useUser } from '@auth0/nextjs-auth0/client';

interface SubscriptionContextProps {
  userPlan: UserPlan | null;
  setUserPlan: React.Dispatch<React.SetStateAction<UserPlan | null>>;
  limit: number | null;
  setLimit: React.Dispatch<React.SetStateAction<number | null>>;

}

const SubscriptionContext = createContext<SubscriptionContextProps | undefined>(undefined);

const SubscriptionProvider = ({ children }: ProviderProps) => {
  const [userPlan, setUserPlan] = useState<UserPlan|null>(null);
  const [limit, setLimit] = useState<number|null>(null);
  const {user, isLoading} = useUser();
  const userId = user?.email;


  useLayoutEffect(() => {
    if (!isLoading && userId)  {
      handleGetSubscriptionInfo(userId).then(info =>{ 
        setUserPlan(info.plan);
        setLimit(info.limit);
      });
    }
  }, [isLoading, userId]);


  return (
    <SubscriptionContext.Provider value={{
      userPlan,
      setUserPlan,
      limit,
      setLimit
    }}>
      {children}
    </SubscriptionContext.Provider>
  );
};

const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }


  return context;
};

export { SubscriptionContext, SubscriptionProvider, useSubscription };
