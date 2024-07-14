'use client'
import useLoading from "@/app/hooks/useLoading";
import { getSharedAnalysis } from "@/app/lib/requests/request";
import { InfoDisplay, LoadingIndicator } from "@/app/ui";
import Image from "next/image";
import React, { useEffect, useState } from "react";

export default function Page ({params}:  { params: { id: string } }){
  const [chartImageUrl, setChartImageUrl] = useState<string | null>(null);
  const [analysisResult, setChartAnalysisResult] = useState<string | null>(null);
  const {loading, setLoading} = useLoading(true);
  const id = params.id;

  useEffect(() => {
    async function fetchAnalysis(id: string){
      try {
        const analysis = await getSharedAnalysis(id);
        setChartImageUrl(analysis.chartUrl);
        setChartAnalysisResult(analysis.analysis);
      }finally{
        setLoading(false);
      }
    }

    fetchAnalysis(id);
  }, [])

  if(loading){
    return (
      <div className='flex flex-col my-auto mx-auto justify-center items-center w-full py-16 '>
      <LoadingIndicator size={50}/>
      </div>
    )
  }


  if(!loading && (!chartImageUrl || !analysisResult)){
    return (
      <div className='flex flex-col my-auto mx-auto justify-center items-center w-full text-xl font-semibold py-16 text-gray-400'>
        404 | Analysis not found
      </div>
    )
  }


  return ( 
    <div className="flex flex-col max-w-4xl mx-auto my-auto items-center justify-center text-center py-16 px-4 animate-fadeIn">
      {chartImageUrl &&  (
        <div className="w-full max-w-[100%]">
        <Image
        src={chartImageUrl}
        alt="Uploaded Chart"
        width={500}
        height={500}
        className={`w-full object-contain`}
        />
        </div>
      )}
        {(analysisResult && chartImageUrl) && (
        <div className="flex flex-col items-center justify-center w-full mt-8">
          <InfoDisplay info={analysisResult} title="Chart Analysis"/>
        </div>
        )}
    </div>
  );
};