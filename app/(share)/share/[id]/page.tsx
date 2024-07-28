'use client'
import useLoading from "@/app/hooks/useLoading";
import { getSharedAnalysis } from "@/app/lib/requests/chartwise-client";
import { StoredAnalysis } from "@/app/types";
import { InfoDisplay, SuspenseFallback } from "@/app/ui";
import NotFound from "@/app/ui/common/not-found";
import Image from "next/image";
import React, { useEffect, useState } from "react";

export default function Page ({params}:  { params: { id: string } }){
  const [analysis, setAnalysis] = useState<StoredAnalysis|null>(null);
  const {loading, setLoading} = useLoading(true);
  const id = params.id;

  useEffect(() => {
    async function fetchAnalysis(id: string){
      try {
        const analysis = await getSharedAnalysis(id);
        setAnalysis(analysis);
      }catch(error){
      }
      finally{
        setLoading(false);
      }
    }

    fetchAnalysis(id);
  }, [])


  if(loading){
    return <SuspenseFallback/>
  }

  if(!loading && !analysis){
    return <NotFound title={'404 | Analysis not found'} />;
  }


  return ( 
    <div className="flex flex-col max-w-5xl mx-auto my-auto items-center justify-center text-center py-16 px-4 animate-fadeIn">
      {analysis &&  (
        <div className="w-full max-w-[100%]">
        <Image
        src={analysis?.chartUrl}
        alt="Uploaded Chart"
        width={2048}
        height={2048}
        className={`w-full object-contain`}
        />
        </div>
      )}
        {analysis && (
        <div className="flex flex-col items-center justify-center w-full mt-8">
          <InfoDisplay info={analysis.analysis} title="Chart Analysis"/>
        </div>
        )}
    </div>
  );
};