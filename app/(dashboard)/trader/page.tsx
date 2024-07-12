'use client'
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import useLoading from '@/app/hooks/useLoading';
import {LoadingIndicator, LoaderDialog, Spacer, ChartAnalyser, PopUp} from '@/app/ui';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useRouter } from 'next/navigation';

export default function Page() {
  const {user, isLoading} = useUser();
  const { loading, setLoading, minimizeLoader, showLoadingDialog, showLoadingMiniIndicator } = useLoading();
  const [popUpTitle, setPopUpTitle] = useState('');
  const [popUpDescription, setPopUpDescription] = useState('');
  const router = useRouter();


  useEffect(()=>{
   if(!user && !isLoading){
    setPopUpTitle('Sign In')
    setPopUpDescription('You must be signed in to use the Trading Assistant tool.');
   }
   
  },[user, isLoading])


  const handleSignIn = () => {
    removePopUp();
    router.push('/api/auth/login');
  }

  const handleClose = () => {
    removePopUp();
    router.push('/');
  }

  const removePopUp = () => {
    setPopUpDescription('');
    setPopUpTitle('');
  }

  if(isLoading){
    return (
      <div className='flex flex-col my-auto mx-auto justify-center items-center w-full pt-32'>
      <LoadingIndicator size={50}/>
      </div>
    )
  }

  return (
    <div className="flex flex-col max-w-4xl mx-auto my-auto items-center justify-center text-center pt-8 px-4">
      <div className='flex flex-row gap-4 justify-center items-center'>
        <h1 className="text-center text-4xl my-4 px-3">Trading Assistant</h1>
        { showLoadingMiniIndicator && <LoadingIndicator size={24}/>}
      </div>
      <p className="text-light mb-2 px-3">
        Upload an image of the chart you want to analyse. See the upload guidelines and limitations <Link className="text-blue-500" href="/trader/guide">here</Link>.
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
      {(popUpTitle && popUpDescription) && (
        <PopUp title={popUpTitle} description={popUpDescription} onConfirm={handleSignIn} onClose={handleClose} cta="Sign In"/>
      )}
    </div>
  );
}