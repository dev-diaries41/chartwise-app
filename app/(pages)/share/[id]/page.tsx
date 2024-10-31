import SharedAnalysis from "@/app/ui/chartwise/shared-analysis";
import React, { Suspense } from "react";
import Loading from "./loading";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import Error from "./error";
import { getAnalysis } from "@/app/lib/data/analysis";

export const revalidate = 3600;

export default async function Page(props:  { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const analysis = await getAnalysis(params.id)

  return (
    <ErrorBoundary errorComponent={Error}>
      <Suspense fallback={<Loading/>}>
        <SharedAnalysis analysis={analysis}/>
      </Suspense>
    </ErrorBoundary>
  );
}