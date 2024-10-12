import SharedAnalysis from "@/app/ui/trader/shared-analysis";
import React, { Suspense } from "react";
import Loading from "./loading";
import { chartwiseAPI } from "@/app/lib/requests/chartwise-api";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import Error from "./error";

export const revalidate = 3600;

export default async function Page ({params}:  { params: { id: string } }){
  const {data: analysis} = await chartwiseAPI.getSharedAnalysis(params.id);

  return (
    <ErrorBoundary errorComponent={Error}>
      <Suspense fallback={<Loading/>}>
        <SharedAnalysis analysis={analysis} />
      </Suspense>
    </ErrorBoundary>
  );
}