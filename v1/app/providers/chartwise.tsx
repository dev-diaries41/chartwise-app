import React, { createContext, useState, useContext, useEffect, ChangeEvent, } from 'react';
import { ProviderProps, IAnalysisUrl, IAnalyseCharts, StoredAnalysis } from '@/app/types';
import { StorageKeys } from '../constants/app';
import {LocalStorage} from "@/app/lib/storage"
import * as ChartwiseClient from '../lib/requests/chartwise-client';
import { RetryHandler } from 'devtilities';
import { useRouter } from 'next/navigation';


interface TradeContextProps {
  recentAnalyses: IAnalysisUrl[];
  setRecentAnalyses: React.Dispatch<React.SetStateAction<IAnalysisUrl[]>>; 
  analysisToView: IAnalysisUrl | null;
  setAnalysisToView: React.Dispatch<React.SetStateAction<IAnalysisUrl|null>>; 
  chartUrls: string[], 
  setChartUrls: React.Dispatch<React.SetStateAction<string[]>>;
  output: string | null, 
  setOutput: React.Dispatch<React.SetStateAction<string | null>>;
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
  const [recentAnalyses, setRecentAnalyses] = useState<IAnalysisUrl[]>([]);
  const [analysisToView, setAnalysisToView] = useState<IAnalysisUrl | null>(null);
  const [chartUrls, setChartUrls] = useState<string[] >([]);
  const [output, setOutput] = useState<string | null>(null);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [strategyAndCriteria, setStrategyAndCriteria] = useState(''); 
  const [risk, setRisk] = useState<number>(25);
  const router = useRouter();


  useEffect(() => {
    const addRecentAnalysis = (analysis: IAnalysisUrl) => {
      LocalStorage.append(StorageKeys.recentAnalyses, analysis);
      setRecentAnalyses(prevAnalyses => [...prevAnalyses, analysis])
    }
    if(chartUrls.length > 0 && output){
      const analysisToStore:  Omit<StoredAnalysis, 'userId'> = {analysis: output, chartUrls, metadata: {risk, strategyAndCriteria}};
      ChartwiseClient.saveAnalysis(analysisToStore).then(url => {
        if(url){
          setShareUrl(url);
          addRecentAnalysis({name:`Analysis-${Date.now()}`, analyseUrl: url});
        }
      });
    }
  }, [chartUrls, output]);


  useEffect(() => {
    const storedAnalyses = LocalStorage.get(StorageKeys.recentAnalyses);
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
      output, 
      setOutput,
      shareUrl, 
      setShareUrl,
      strategyAndCriteria, 
      setStrategyAndCriteria,
      risk, 
      setRisk,
      chartUrls, 
      setChartUrls,
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
    output,
    setOutput,
    shareUrl,
    strategyAndCriteria,
    setStrategyAndCriteria,
    risk,
    setRisk,
    chartUrls,
    setChartUrls
  } = context;

  const anaylsisParams: IAnalyseCharts = {
    chartUrls,
    metadata: {
      risk: risk.toString(), 
      strategyAndCriteria
    },
  }
  
  
  const viewAnalysis = (analysis: IAnalysisUrl) => {
    setAnalysisToView(analysis)
  }

  const deleteAnalysis = (analysis: IAnalysisUrl) => {
    LocalStorage.removeItemFromArray(StorageKeys.recentAnalyses, (storedAnaysis: IAnalysisUrl) => storedAnaysis.name!== analysis.name);
    setRecentAnalyses(prevAnalyses => prevAnalyses.filter((storedAnaysis: IAnalysisUrl) => storedAnaysis.name!== analysis.name))
  }


const removeAnalysis = () => {
    setOutput(null);
    setAnalysisToView(null);
  }
  
const onStrategyAndCriteriaChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
  setStrategyAndCriteria(event.target.value);
};

const onRiskChange = (value: any) => {
  setRisk(value);
};

const removeCharts = () => {
    setChartUrls([]);
    removeAnalysis();
};

const uploadCharts = async (files: File[]) => {
  const fileReaders = files.map(file => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.onerror = () => {
        reject(new Error('File reading has failed'));
      };
      reader.readAsDataURL(file);
    });
  });

  try {
    const urls = await Promise.all(fileReaders);
    setChartUrls(urls);
  } catch (error) {
    console.error('Failed to read files:', error);
  }
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


const analyseChart = async (analysis: IAnalyseCharts, userId: string) => {
    try {
      const jobId = await retryHandler.retry(
        async () => await ChartwiseClient.submitAnalysisRequest(analysis),
        async(error)=> await ChartwiseClient.refreshOnError(error as Error, userId)
      );
      return jobId;
    } catch (error) {
      throw error;
    }
  };

  const newAnalysis = () => {
    setStrategyAndCriteria('')
    setOutput(null);
    setChartUrls([]);
    setRisk(25);
  }

  const onAnalysisComplete = (output: string) => {
    setOutput(output);
    LocalStorage.remove(StorageKeys.jobId);
  }


  return {
    anaylsisParams,
    analysisToView,
    recentAnalyses,
    risk,
    output,
    strategyAndCriteria,
    shareUrl,
    chartUrls,
    newAnalysis,
    viewAnalysis,
    deleteAnalysis,
    removeAnalysis,
    analyseChart,
    removeCharts,
    onStrategyAndCriteriaChange,
    onAnalysisComplete,
    onRiskChange,
    getRiskTolerance,
    uploadCharts
  };
};

export { ChartwiseContext, ChartwiseProvider, useChartwise };