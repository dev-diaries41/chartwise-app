import React from "react";
import { IAnalysis } from "@/app/types";
import { CarouselImageViewer, MarkdownView } from "@/app/ui";

export default function SharedAnalysis({ analysis }: { analysis: IAnalysis}) {
  
    return (
      <div className="flex flex-col max-w-5xl min-h-screen items-center justify-center text-center py-16 px-4 animate-fadeIn mx-auto gap-4">
        <div className="w-full max-w-[90%] items-center">
          <CarouselImageViewer images={analysis.chartUrls} />
        </div>
        <MarkdownView content={analysis.output} />
      </div>
    );
  }