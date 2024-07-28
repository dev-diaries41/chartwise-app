import React, { createContext, useState, useContext, useEffect, ChangeEvent, } from 'react';
import { ProviderProps, IAnalysisUrl, Mode, StoredAnalysis, IAnalyseChart } from '@/app/types';
import { removeItemFromArray } from '../lib/storage/local';
import { StorageKeys } from '../constants/app';
import * as Storage from "@/app/lib/storage/local"
import * as ChartwiseClient from '../lib/requests/chartwise-client';
import { RetryHandler } from '../lib/utils/retry';
import { useRouter } from 'next/navigation';


interface TradeContextProps {
  recentAnalyses: IAnalysisUrl[];
  setRecentAnalyses: React.Dispatch<React.SetStateAction<IAnalysisUrl[]>>; 
  analysisToView: IAnalysisUrl | null;
  setAnalysisToView: React.Dispatch<React.SetStateAction<IAnalysisUrl|null>>; 
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
  mode: Mode; 
  setMode: React.Dispatch<React.SetStateAction<Mode>>;
}

const ChartwiseContext = createContext<TradeContextProps | undefined>(undefined);
const retryHandler = new RetryHandler(1); // Allow only 1 retry to handle expired token

const ChartwiseProvider = ({ children }: ProviderProps) => {
  const [recentAnalyses, setRecentAnalyses] = useState<IAnalysisUrl[]>([]);
  const [analysisToView, setAnalysisToView] = useState<IAnalysisUrl | null>(null);
  const [chartImageUrl, setChartImageUrl] = useState<string | null>(null);
  const [analysisResult, setChartAnalysisResult] = useState<string | null>(null);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [strategyAndCriteria, setStrategyAndCriteria] = useState(''); 
  const [risk, setRisk] = useState<number>(25);
  const [mode, setMode] = useState<Mode>('analysis')
  const router = useRouter()


  useEffect(() => {
    const addRecentAnalysis = (analysis: IAnalysisUrl) => {
      Storage.append(StorageKeys.recentAnalyses, analysis);
      setRecentAnalyses(prevAnalyses => [...prevAnalyses, analysis])
    }
    if(chartImageUrl && analysisResult){
      const analysisToStore = {analysis: analysisResult, chartUrl: chartImageUrl, metadata: {risk, strategyAndCriteria}};
      ChartwiseClient.saveAnalysis(analysisToStore).then(url => {
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
  const viewRecentAnalysis = (analysis: IAnalysisUrl) => {
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
      setRisk,
      mode, 
      setMode
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
    setRisk,
    mode,
    setMode
  } = context;
  const anaylsisParams: IAnalyseChart = {
    chartUrl: chartImageUrl || '',
    metadata: {risk: risk.toString(), strategyAndCriteria},
  }
  
  const handleViewAnalysis = (analysis: IAnalysisUrl) => {
    setAnalysisToView(analysis)
  }

  const handleDeleteAnalysis = (analysis: IAnalysisUrl) => {
    removeItemFromArray(StorageKeys.recentAnalyses, (storedAnaysis: IAnalysisUrl) => storedAnaysis.name!== analysis.name);
    setRecentAnalyses(prevAnalyses => prevAnalyses.filter((storedAnaysis: IAnalysisUrl) => storedAnaysis.name!== analysis.name))
  }

  const toggleMode = () => {
    setMode(prevMode => prevMode === 'analysis'? 'chart' : 'analysis')
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
        async(error)=> await ChartwiseClient.refreshOnError(error, userId)
      );
      return jobId;
    } catch (error) {
      throw error;
    }
  };

  const newAnalysis = () => {
    setStrategyAndCriteria('')
    setChartAnalysisResult(null);
    setChartImageUrl(null);
    setRisk(25);
  }

  const onAnalysisComplete = (output: string) => {
    setChartAnalysisResult(output);
    Storage.remove(StorageKeys.jobId);
  }

  return {
    anaylsisParams,
    analysisToView,
    recentAnalyses,
    risk,
    analysisResult,
    chartImageUrl,
    strategyAndCriteria,
    shareUrl,
    mode,
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
    getRiskTolerance,
    toggleMode,
    newAnalysis,
    onAnalysisComplete
  };
};

export { ChartwiseContext, ChartwiseProvider, useChartwise };