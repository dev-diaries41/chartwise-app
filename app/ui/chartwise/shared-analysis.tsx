import React from "react";
import { IAnalysis } from "@/app/types";
import { CarouselImageViewer, MarkdownView } from "@/app/ui";

export default function SharedAnalysis({ analysis }: { analysis: IAnalysis}) {
  
    return (
      <div className="flex flex-col max-w-5xl min-h-screen items-center justify-center text-center py-16 pt-24 px-4 animate-fadeIn mx-auto gap-4">
          <div className="w-full flex flex-row items-center justify-start text-left gap-2 mb-8">
        {/* <FontAwesomeIcon icon={faUserCircle} className="w-6 h-6"/> */}
        <h1 className="text-2xl md:text-3xl font-bold pl-8">{analysis.name}</h1>
      </div>
        <div className="w-full max-w-[90%] items-center">
          <CarouselImageViewer images={analysis.chartUrls} />
        </div>
        <MarkdownView content={analysis.output} />
      </div>
    );
  }