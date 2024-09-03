'use client'
import useLoading from "@/app/hooks/useLoading";
import { getSharedAnalysis } from "@/app/lib/requests/chartwise-client";
import { StoredAnalysis } from "@/app/types";
import { CarouselImageViewer, InfoDisplay, SuspenseFallback } from "@/app/ui";
import NotFound from "@/app/ui/common/not-found";
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


  if (loading) {
    return <SuspenseFallback />;
  }
  
  if (!analysis) {
    return <NotFound title="404 | Analysis not found" />;
  }

  return (
    <div className="flex flex-col max-w-5xl min-h-screen items-center justify-center text-center py-16 px-4 animate-fadeIn mx-auto gap-4">
        <div className="w-full max-w-[90%] items-center">
          <CarouselImageViewer images={analysis.chartUrls}/>
        </div>
          <InfoDisplay info={analysis.analysis} title="Chart Analysis" />
    </div>
  );
}