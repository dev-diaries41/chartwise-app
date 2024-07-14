import React from 'react';
import Image from 'next/image';

interface ChartAnalysisLoaderProps { 
  chartImageUrl: string, 
  loading: boolean;
  loadingText?: string;
  width?: number;
  height?: number;
}

export default function  ChartImageWithLoader({ 
  chartImageUrl, 
  loading, 
  loadingText = 'loading...',
  width = 500, // default width
  height = 500, // default height
}: ChartAnalysisLoaderProps){

  return (
    <div className={`relative flex max-w-[100%]  mx-auto`}>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center" style={{ backgroundColor: '#e0e0e0', animation: 'pulse 2.0s infinite' }}></div>
      )}
      <Image
        src={chartImageUrl}
        alt="Uploaded Chart"
        width={width}
        height={height}
        className={`w-full object-contain ${loading? 'opacity-50' : 'opacity-100'}`}
      />
      <style jsx>{`
        @keyframes pulse {
          0% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
          100% {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};
