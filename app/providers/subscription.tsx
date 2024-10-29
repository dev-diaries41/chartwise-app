'use client'
import React, { createContext, useState, useContext } from 'react';
import { ProviderProps, UserPlanOverView } from '@/app/types';
import { getPlanFromPlanAmount } from '@/app/lib/helpers';
import Stripe from 'stripe';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

interface SubscriptionContextProps {
  userPlanOverview: UserPlanOverView;
  setUserPlanOverview: React.Dispatch<React.SetStateAction<UserPlanOverView>>;
  limit: number;
  setLimit: React.Dispatch<React.SetStateAction<number>>;
  hasReachedLimit: boolean;
  setHasReachedLimit: React.Dispatch<React.SetStateAction<boolean>>;
  isUpgrading: boolean;
  setIsUpgrading: React.Dispatch<React.SetStateAction<boolean>>;
  checkOutDetails: Partial<Stripe.Response<Stripe.Checkout.Session>> | null;
  setCheckoutDetails: React.Dispatch<React.SetStateAction<Partial<Stripe.Response<Stripe.Checkout.Session>> | null>>;
}

const SubscriptionContext = createContext<SubscriptionContextProps | undefined>(undefined);

const SubscriptionProvider = React.memo(({ children, planInfo }: ProviderProps &  {planInfo: {
  limit: number;
  userPlanOverview: UserPlanOverView;
}}) => {
  const [userPlanOverview, setUserPlanOverview] = useState<UserPlanOverView>(planInfo.userPlanOverview);
  const [limit, setLimit] = useState<number>(planInfo.limit);
  const [hasReachedLimit, setHasReachedLimit] = useState<boolean>(false);
  const [isUpgrading, setIsUpgrading] = useState<boolean>(false);
  const [checkOutDetails, setCheckoutDetails] = useState<Partial<Stripe.Response<Stripe.Checkout.Session>>|null>(null);

  return (
    <SubscriptionContext.Provider value={{
      userPlanOverview,
      setUserPlanOverview,
      limit,
      setLimit,
      hasReachedLimit, 
      setHasReachedLimit,
      checkOutDetails, 
      setCheckoutDetails,isUpgrading, 
      setIsUpgrading
    
    }}>
      {children}
    </SubscriptionContext.Provider>
  );
});

const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }

  const {setUserPlanOverview, setCheckoutDetails, setHasReachedLimit, checkOutDetails, hasReachedLimit, limit, userPlanOverview, isUpgrading, setIsUpgrading} = context
  
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
          setUserPlanOverview(prev => ({...prev, plan: newUserPlan }))
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
  
  const toggleUpgradePop = ()=> {
    setIsUpgrading(prev => !prev)
  }

  const updatePlanOverviewToCancelled = ()=> {
    setUserPlanOverview(prev => ({...prev, cancel_at_period_end: true}))
  }

  return {
    checkOutDetails,
    isUpgrading,
    hasReachedLimit, 
    limit, 
    userPlanOverview,    
    getCheckoutSessionDetails,
    toggleUpgradePop,
    updatePlanOverviewToCancelled
  };
};

export { SubscriptionContext, SubscriptionProvider, useSubscription };
