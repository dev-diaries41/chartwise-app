import React from 'react';
import Image from 'next/image';

interface ChartAnalysisLoaderProps { 
  chartImageUrl: string, 
  loading: boolean;
  width?: number;
  height?: number;
}

export default function Chart({ 
  chartImageUrl, 
  loading, 
  width = 500, // default width
  height = 500, // default height
}: ChartAnalysisLoaderProps){

  return (
    <div className="relative flex mr-auto max-w-[500px] max-h-[500px] border border-gray-700 rounded-md">
      {loading && (
        <div 
          className="absolute inset-0 " 
        >
          <div 
            className="absolute inset-0 flex items-center justify-center" 
            style={{ 
              backgroundColor: '#e0e0e0', 
              animation: 'pulse 2.0s infinite',
              objectFit: 'contain'
            }} 
          >
          </div>
        </div>
      )}
      <Image
        src={chartImageUrl}
        alt="Uploaded Chart"
        width={width}
        height={height}
        objectFit='contain'
        className={`object-contain ${loading ? 'opacity-50' : 'opacity-100'}`}
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
