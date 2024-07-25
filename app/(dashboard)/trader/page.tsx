'use client'
import React from 'react';
import {LoadingIndicator, ChartAnalyser, Spacer} from '@/app/ui';
import { useUser } from '@auth0/nextjs-auth0/client';
import Link from 'next/link';

export default function Page() {
  const {isLoading} = useUser();

  if(isLoading){
    return (
      <div className="w-full flex flex-col max-w-5xl mx-auto lg:min-h-screen min-h-auto items-center justify-center text-center py-8 px-4">
      <LoadingIndicator size={50}/>
      </div>
    )
  }

  return (
    <div className="w-full flex flex-col max-w-5xl mx-auto lg:min-h-screen min-h-auto items-center justify-center text-center py-8 px-4">
      <div className='flex flex-row gap-4 justify-center items-center'>
        <h1 className="text-center text-4xl my-4 px-3 font-bold">Upload & Analyse</h1>
      </div>
      <p className="text-light mb-2 px-3 text-sm md:text-md lg:text-lg">
        Upload an image of the chart you want to analyse. See the upload guidelines and limitations <Link className="text-blue-500" href="/guide">here</Link>.
      </p>
      <p className="text-sm text-gray-600">Note: This is not financial advice.</p>
      <Spacer />
      <ChartAnalyser/>
    </div>
  );
}