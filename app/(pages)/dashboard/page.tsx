'use client'
import React from 'react';
import {ChartAnalyser, Spacer, SuspenseFallback} from '@/app/ui';
import { useUser } from '@auth0/nextjs-auth0/client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { useChartwise } from '@/app/providers/chartwise';
import TradingViewWidget from '@/app/ui/trader/tradingview';

export default function Page() {
  const {isLoading} = useUser();
  const {mode, newAnalysis} = useChartwise();


  if(isLoading){
    return <SuspenseFallback/>
  }
  return (
    <div className='relative flex-1 max-w-full mx-auto w-full'>
        {
          mode === 'chart'? <TradingViewWidget/> : (
            <div className="relative w-full flex flex-col max-w-5xl mx-auto min-h-screen items-center justify-center text-center py-8 px-4">   
              <div className='flex flex-col w-full mb-auto md:my-auto'>
                <div className='flex flex-row gap-4 justify-between items-center'>
                  <h1 className="text-center text-xl md:text-3xl my-4 font-bold">Upload & Analyse</h1>
                  
                  <button
                  className="flex w-auto items-center justify-center text-sm  font-semibold gap-1"
                  onClick={newAnalysis}
                >
                  <FontAwesomeIcon icon={faPlusCircle} className="w-4 md:w-4 h-4 md:h-4"  />
                  <span className="">New Analysis</span>
                  </button>
                </div>
                <p className="flex  text-sm md:text-md text-left md:text-md opacity-80">You can upload up to 3 charts for different timeframes.</p>
              <Spacer  space={4}/>
              <ChartAnalyser/>
            </div>
          <p className="flex  text-xs text-gray-600 mt-auto p-2">ChartWise can make mistakes. Check guidelines.</p>
         </div>
          )}
    </div>
  );
}