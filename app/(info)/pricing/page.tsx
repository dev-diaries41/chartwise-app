import { PriceTable } from '@/app/ui/pricing/price-table';
import React from 'react';

export default async function Page() {
  const url = 'https://invoice.stripe.com/i/acct_1PZKw3RuKYxTJzY7/test_YWNjdF8xUFpLdzNSdUtZeFRKelk3LF9RUWJJYTM5UGJYcXU3MzVBdTZWNjFobTdPMWt3bGxoLDExMDg1NzI2NQ0200zY6IHGE7?s=ap'
  return (
    <div className="w-full  mx-auto flex flex-col items-center justify-center text-center pt-32 ">
      <h1 className="text-center text-4xl my-4 px-3 font-bold">Pricing</h1>
      <p className="max-w-5xl text-gray-200 mb-5 px-3">
      Subscribe today and take the guesswork out of trading      
      </p>
      <div className='container justify-center'>
      <PriceTable/>
      </div>
    </div>
  );
}
