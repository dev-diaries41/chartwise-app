import React, { createContext, useState, useContext, useLayoutEffect } from 'react';
import { ProviderProps, UserPlan } from '@/app/types';
import { cacheUserPlan, getPlanFromPlanAmount, handleGetSubscriptionInfo } from '../lib/user';
import Stripe from 'stripe';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { useSession } from 'next-auth/react';

interface SubscriptionContextProps {
  userPlan: UserPlan | null;
  setUserPlan: React.Dispatch<React.SetStateAction<UserPlan | null>>;
  limit: number | null;
  setLimit: React.Dispatch<React.SetStateAction<number | null>>;
  checkOutDetails: Partial<Stripe.Response<Stripe.Checkout.Session>> | null;
  setCheckoutDetails: React.Dispatch<React.SetStateAction<Partial<Stripe.Response<Stripe.Checkout.Session>> | null>>;
}

const SubscriptionContext = createContext<SubscriptionContextProps | undefined>(undefined);

const SubscriptionProvider = ({ children }: ProviderProps) => {
  const [userPlan, setUserPlan] = useState<UserPlan|null>(null);
  const [limit, setLimit] = useState<number|null>(null);
  const [checkOutDetails, setCheckoutDetails] = useState<Partial<Stripe.Response<Stripe.Checkout.Session>>|null>(null);

  const { data: session, status } = useSession();
  const email = session?.user?.email;
  const isLoading = status === 'loading';


  useLayoutEffect(() => {
    if (!isLoading && email)  {
      handleGetSubscriptionInfo(email).then(info =>{ 
        setUserPlan(info.plan);
        setLimit(info.limit);
      });
    }
  }, [isLoading, email]);


  return (
    <SubscriptionContext.Provider value={{
      userPlan,
      setUserPlan,
      limit,
      setLimit,
      checkOutDetails, 
      setCheckoutDetails
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

  const {setUserPlan, setCheckoutDetails} = context
  
  const getCheckoutSessionDetails = async (sessionId: string, router: AppRouterInstance) => {
    try {
      const url = `/api/order/complete?session_id=${sessionId}`;
      const res = await fetch(url);
      const { session } = await res.json();
      if (!session) {
        router.push('/'); // Redirect to root page
        return;
      }
      const { customer_details, status, amount_total, created } = session as  Stripe.Response<Stripe.Checkout.Session>;
      if(amount_total){
        const newUserPlan = getPlanFromPlanAmount(amount_total)
        if(newUserPlan){
          setUserPlan(newUserPlan)
          cacheUserPlan(newUserPlan)
        }
      }
  
      setCheckoutDetails({ customer_details, status, amount_total, created });
      if (status !== 'complete') {
        router.push('/'); // Redirect to root page
      }
    } catch (error) {
      router.push('/'); // Redirect to root page
    }
  };


  return {
    ...context,
    getCheckoutSessionDetails
  };
};

export { SubscriptionContext, SubscriptionProvider, useSubscription };
