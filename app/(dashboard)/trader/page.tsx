'use client'
import React from 'react';
import Link from 'next/link';
import useLoading from '@/app/hooks/useLoading';
import {LoadingIndicator, LoaderDialog, Spacer, ChartAnalyser} from '@/app/ui';
import { useUser } from '@auth0/nextjs-auth0/client';

export default function Page() {
  const {isLoading} = useUser();
  const { loading, setLoading, minimizeLoader, showLoadingDialog, showLoadingMiniIndicator } = useLoading();

  if(isLoading){
    return (
      <div className='flex flex-col my-auto mx-auto justify-center items-center w-full py-16'>
      <LoadingIndicator size={50}/>
      </div>
    )
  }

  return (
    <div className="flex flex-col max-w-5xl mx-auto my-auto items-center justify-center text-center py-8 px-4">
      <div className='flex flex-row gap-4 justify-center items-center'>
        <h1 className="text-center text-4xl my-4 px-3 font-bold">Trading Assistant</h1>
        { showLoadingMiniIndicator && <LoadingIndicator size={24}/>}
      </div>
      <p className="text-light mb-2 px-3">
        Upload an image of the chart you want to analyse. See the upload guidelines and limitations <Link className="text-blue-500" href="/guide">here</Link>.
      </p>
      <p className="text-sm text-gray-600">Note: This is not financial advice.</p>
      <Spacer />
      <ChartAnalyser
        loading={loading}
        setLoading={setLoading}
      />
      {showLoadingDialog && (
        <LoaderDialog
          onMinimize={minimizeLoader}
          position="BOTTOM_RIGHT"
          title="Analysing chart..."
          description="Chart analysis in progress. This can take a few seconds. Please do not refresh the page."/>
      )}
    </div>
  );
}