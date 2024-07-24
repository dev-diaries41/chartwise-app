import React, { createContext, useState, useContext, ReactNode, } from 'react';
import { ProviderProps, IAnalysis } from '@/app/types';
import { removeItemFromArray } from '../lib/storage/local';
import { StorageKeys } from '../constants/app';

interface TradeContextProps {
  recentAnalyses: IAnalysis[];
  setRecentAnalyses: React.Dispatch<React.SetStateAction<IAnalysis[]>>; 
  analysisToView: IAnalysis | null;
  setAnalysisToView: React.Dispatch<React.SetStateAction<IAnalysis|null>>; 

}

const TradeContext = createContext<TradeContextProps | undefined>(undefined);



const TradeProvider = ({ children }: ProviderProps) => {
  const [recentAnalyses, setRecentAnalyses] = useState<IAnalysis[]>([]);
  const [analysisToView, setAnalysisToView] = useState<IAnalysis | null>(null);


  return (
    <TradeContext.Provider value={{ 
      analysisToView,
      recentAnalyses, 
      setRecentAnalyses,
      setAnalysisToView
      }}>
      {children}
    </TradeContext.Provider>
  );
};

// Hook for using the TradeContext
const useTrader = () => {
  const context = useContext(TradeContext);
  if (!context) {
    throw new Error('useTrader must be used within a TradeProvider');
  }
  const { analysisToView, recentAnalyses, setAnalysisToView, setRecentAnalyses } = context;

  const handleViewAnalysis = (analysis: IAnalysis) => {
    setAnalysisToView(analysis)
  }

  const handleDeleteAnalysis = (analysis: IAnalysis) => {
    removeItemFromArray(StorageKeys.recentAnalyses, (storedAnaysis: IAnalysis) => storedAnaysis.name!== analysis.name);
    setRecentAnalyses(prevAnalyses => prevAnalyses.filter((storedAnaysis: IAnalysis) => storedAnaysis.name!== analysis.name))
  }

  return {
    analysisToView,
    recentAnalyses,
    setAnalysisToView,
    setRecentAnalyses,
    handleViewAnalysis,
    handleDeleteAnalysis
  };
};

export { TradeContext, TradeProvider, useTrader };
