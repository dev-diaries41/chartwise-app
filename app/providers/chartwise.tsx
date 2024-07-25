import React, { createContext, useState, useContext, useEffect, ChangeEvent, } from 'react';
import { ProviderProps, IAnalysis } from '@/app/types';
import { removeItemFromArray } from '../lib/storage/local';
import { StorageKeys } from '../constants/app';
import * as Storage from "@/app/lib/storage/local"
import * as ChartwiseClient from '../lib/requests/client';
import { RetryHandler } from '../lib/utils';
import { AuthErrors } from '../constants/errors';
import { useRouter } from 'next/navigation';


interface TradeContextProps {
  recentAnalyses: IAnalysis[];
  setRecentAnalyses: React.Dispatch<React.SetStateAction<IAnalysis[]>>; 
  analysisToView: IAnalysis | null;
  setAnalysisToView: React.Dispatch<React.SetStateAction<IAnalysis|null>>; 
  chartImageUrl: string | null, 
  setChartImageUrl: React.Dispatch<React.SetStateAction<string | null>>;
  analysisResult: string | null, 
  setChartAnalysisResult: React.Dispatch<React.SetStateAction<string | null>>;
  shareUrl: string | null, 
  setShareUrl:  React.Dispatch<React.SetStateAction<string | null>>;
  strategyAndCriteria: string, 
  setStrategyAndCriteria : React.Dispatch<React.SetStateAction<string>>;
  risk: number, 
  setRisk: React.Dispatch<React.SetStateAction<number>>;
}

const ChartwiseContext = createContext<TradeContextProps | undefined>(undefined);
const retryHandler = new RetryHandler(1); // Allow only 1 retry to handle expired token

const ChartwiseProvider = ({ children }: ProviderProps) => {
  const [recentAnalyses, setRecentAnalyses] = useState<IAnalysis[]>([]);
  const [analysisToView, setAnalysisToView] = useState<IAnalysis | null>(null);
  const [chartImageUrl, setChartImageUrl] = useState<string | null>(null);
  const [analysisResult, setChartAnalysisResult] = useState<string | null>(null);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [strategyAndCriteria, setStrategyAndCriteria] = useState(''); 
  const [risk, setRisk] = useState<number>(25);
  const router = useRouter()

  useEffect(() => {
    const addRecentAnalysis = (analysis: IAnalysis) => {
      Storage.append(StorageKeys.recentAnalyses, analysis);
      setRecentAnalyses(prevAnalyses => [...prevAnalyses, analysis])
    }
    if(chartImageUrl && analysisResult){
      ChartwiseClient.saveAnalysis(analysisResult, chartImageUrl).then(url => {
        if(url){
          setShareUrl(url);
          addRecentAnalysis({name:`Analysis-${Date.now()}`, analyseUrl: url});
        }
      });
    }
  }, [chartImageUrl, analysisResult]);


  useEffect(() => {
    const storedAnalyses = Storage.get(StorageKeys.recentAnalyses);
    if (Array.isArray(storedAnalyses)) {
    setRecentAnalyses(storedAnalyses);
    }
},[])

useEffect(() => {
  const viewRecentAnalysis = (analysis: IAnalysis) => {
      router.push(analysis.analyseUrl)
  }
  
  if(analysisToView){
  viewRecentAnalysis(analysisToView)
  }
},[analysisToView]);


  return (
    <ChartwiseContext.Provider value={{ 
      analysisToView,
      recentAnalyses, 
      setRecentAnalyses,
      setAnalysisToView,
      chartImageUrl, 
      setChartImageUrl,
      analysisResult, 
      setChartAnalysisResult,
      shareUrl, 
      setShareUrl,
      strategyAndCriteria, 
      setStrategyAndCriteria,
      risk, 
      setRisk
      }}>
      {children}
    </ChartwiseContext.Provider>
  );
};

const useChartwise = () => {
  const context = useContext(ChartwiseContext);
  if (!context) {
    throw new Error('useChartwise must be used within a ChartwiseProvider');
  }
  const {
    analysisToView,
    recentAnalyses,
    setAnalysisToView,
    setRecentAnalyses,
    chartImageUrl,
    setChartImageUrl,
    analysisResult,
    setChartAnalysisResult,
    shareUrl,
    strategyAndCriteria,
    setStrategyAndCriteria,
    risk,
    setRisk
  } = context;
  
  const handleViewAnalysis = (analysis: IAnalysis) => {
    setAnalysisToView(analysis)
  }

  const handleDeleteAnalysis = (analysis: IAnalysis) => {
    removeItemFromArray(StorageKeys.recentAnalyses, (storedAnaysis: IAnalysis) => storedAnaysis.name!== analysis.name);
    setRecentAnalyses(prevAnalyses => prevAnalyses.filter((storedAnaysis: IAnalysis) => storedAnaysis.name!== analysis.name))
  }





const removeAnalysis = () => {
    setChartAnalysisResult(null);
    setAnalysisToView(null);
  }
  
const handleStrategyAndCriteriaChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
  setStrategyAndCriteria(event.target.value);
};

const handleRiskChange = (value: any) => {
setRisk(value);
};

const removeChart = () => {
    setChartImageUrl(null);
    removeAnalysis();
  };

const uploadChart = async (file: File) => {
const reader = new FileReader();
reader.onloadend = () => {
    setChartImageUrl(reader.result as string);
};
reader.readAsDataURL(file);
};

const getRiskTolerance = () => {
  switch(true){
    case risk <= 0.33 * 100:
      return 'Low risk';
    case risk <= 0.66 * 100 && risk > 0.33 * 100:
      return 'Med risk';
    case risk > 0.66 * 100:
      return 'High risk';
    default:
      return 'Risk';
  }
}


const analyseChart = async (userId: string, formData: FormData) => {
    try {
      const jobId = await retryHandler.retry(
        async () => await ChartwiseClient.submitAnalysisRequest(formData),
        async (error) => {
          if (error.message.trim() === AuthErrors.MISSING_JWT_TOKEN || error.message.trim() === AuthErrors.EXPIRED_TOKEN) {
            const token = await ChartwiseClient.getNewToken({ userId });
            return!!token;
          }
          return false;
        }
      );
      return jobId;
    } catch (error) {
      throw error;
    }
  };

  return {
    analysisToView,
    recentAnalyses,
    risk,
    analysisResult,
    chartImageUrl,
    strategyAndCriteria,
    shareUrl,
    setAnalysisToView,
    setRecentAnalyses,
    handleViewAnalysis,
    handleDeleteAnalysis,
    analyseChart,
    removeAnalysis,
    handleStrategyAndCriteriaChange,
    removeChart,
    uploadChart,
    setChartImageUrl,
    setChartAnalysisResult,
    handleRiskChange,
    getRiskTolerance
  };
};

export { ChartwiseContext, ChartwiseProvider, useChartwise };