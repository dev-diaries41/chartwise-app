import React from 'react';
import TradingViewWidget from '@/app/ui/chartwise/tradingview';

export default function Page() {
  return (
    <div className='relative flex-1 max-w-full mx-auto w-full'>
        <TradingViewWidget/> 
    </div>
  );
}