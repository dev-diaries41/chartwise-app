'use client'
import { useLayoutEffect, useState } from 'react';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Receipt from '@/app/ui/order/receipt';
import OrderComplete from '@/app/ui//order/order-message';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSubscription } from '@/app/providers/subscription';

export default function OrderSuccess() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const sessionId = searchParams.get('session_id');
    const {getCheckoutSessionDetails, checkOutDetails} = useSubscription();


    useLayoutEffect(() => {
      if(!sessionId){
        return router.push('/');
      }
      getCheckoutSessionDetails(sessionId, router);
      
    },[])
    
    if(!sessionId || !checkOutDetails)return null;

    return (
        <div className='flex flex-col gap-8 justify-center items-center min-h-screen py-16 px-4 sm:px-6 max-w-5xl mx-auto'>
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
    