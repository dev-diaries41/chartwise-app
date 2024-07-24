'use client'
import { useLayoutEffect, useState } from 'react';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Receipt from '@/app/ui/order/receipt';
import OrderComplete from '@/app/ui//order/order-message';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import Stripe from 'stripe';
import * as Storage from '@/app/lib/storage/local'
import { StorageKeys, Time } from '@/app/constants/app';
import { getPlanFromPlanAmount } from '@/app/lib/user';
import { UserProfileInfo } from '@/app/types';
import useSubscription from '@/app/hooks/useSubscription';
import { useUser } from '@auth0/nextjs-auth0/client';

export default function OrderSuccess() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const sessionId = searchParams.get('session_id');
    const [checkOutDetails, setCheckoutDetails] = useState<Partial<Stripe.Response<Stripe.Checkout.Session>>|null>(null);
    const {user, isLoading} = useUser()
    const userId = user?.email;
    const {setUserPlan} = useSubscription(userId, isLoading);

    const getCheckoutSessionDetails = async () => {
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
          const expiresAt = Date.now() + Time.min;
          const updatedUserInfo = JSON.stringify({ userPlan: newUserPlan, expiresAt } as UserProfileInfo);
          if(newUserPlan){
            setUserPlan(newUserPlan)
            Storage.set(StorageKeys.subscription, updatedUserInfo);
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

    useLayoutEffect(() => {
      if(!sessionId){
        return router.push('/');
      }
      getCheckoutSessionDetails();
      
    },[])
    
    if(!sessionId || !checkOutDetails)return null;

    return (
        <div className='flex flex-col gap-8 justify-center items-center min-h-screen py-16 px-4 sm:px-6'>
          <Link href='/' className='flex flex-row items-left mr-auto gap-4'>
            <FontAwesomeIcon icon={faArrowLeft} className='w-6 h-6'/>
            Back
          </Link>
          <OrderComplete/>
          <table className="w-full flex items-center justify-center">
            <tbody>
              <tr>
                  <Receipt amount={checkOutDetails?.amount_total!} email={checkOutDetails?.customer_details?.email || ''} />
              </tr>
            </tbody>
          </table>
        </div>
     
    );
    
    };
    