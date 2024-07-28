'use client'
import React from 'react';
import {ChartAnalyser, Spacer, SuspenseFallback} from '@/app/ui';
import { useUser } from '@auth0/nextjs-auth0/client';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
// import { useSettings } from '@/app/providers/settings';
import { useChartwise } from '@/app/providers/chartwise';
import Switch from '@/app/ui/common/switch';
import TradingViewWidget from '@/app/ui/trader/tv-charts';

export default function Page() {
  const {isLoading} = useUser();
  // const {showSettings} = useSettings();
  const {toggleMode, mode, newAnalysis} = useChartwise();


  if(isLoading){
    return <SuspenseFallback/>
  }

  const TopActionRow = () => {
    return (
      <div className='absolute ml-auto md:top-4  right-0 left-0  flex flex-row justify-between items-center p-4 '>
        { mode === 'analysis' && (
          <button
              className="flex w-auto items-center justify-center text-sm mr-auto font-semibold gap-1"
              onClick={newAnalysis}
            >
              <FontAwesomeIcon icon={faPlusCircle} className="w-4 md:w-4 h-4 md:h-4"  />
              <span className="">New Analysis</span>
          </button>
        )}
            <div className='flex flex-row items-center justify-center ml-auto  text-sm font-medium focus:cursor-pointer'>
              Chart mode
              <Switch value={mode ==='analysis'? false:true} onChange={toggleMode} />
            </div>
        </div>
    )
  }


  return (
    <div className='relative flex-1 max-w-7xl mx-auto w-full'>
      {/* { showSettings && <Settings/>} */}
      <TopActionRow/>
        {
          mode === 'chart'? <TradingViewWidget/> : (
            <div className="relative w-full flex flex-col max-w-5xl mx-auto lg:min-h-screen  items-center justify-center text-center py-8 px-4">   
            <div className='flex flex-col w-full  my-auto mb-auto'>
            <div className='flex flex-row gap-4 justify-between items-center mt-4'>
              <h1 className="text-center text-xl md:text-3xl my-4 font-bold">Upload Chart & Analyse</h1>
            </div>
            {/* <p className="text-light mb-2 px-3 text-sm md:text-md lg:text-lg">
              Upload an image of the chart you want to analyse.
            </p> */}
            <Spacer  space={4}/>
            <ChartAnalyser/>
            </div>
          <p className="flex  text-xs text-gray-600 mt-auto p-2">ChartWise can make mistakes. Check upload guidelines and limitations <Link className="text-blue-500" href="/guide">here</Link>.</p>
         </div>
          )
        }
  
    </div>
   
  );
}