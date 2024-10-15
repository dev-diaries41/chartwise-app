'use client'
import React, { createContext, useState, useContext, useEffect, ChangeEvent, } from 'react';
import { ProviderProps, IAnalysisUrl, AnalysisParams, IAnalyse } from '@/app/types';
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
  analysis: Omit<IAnalyse, 'userId'>; 
  setAnalysis: React.Dispatch<React.SetStateAction<Omit<IAnalyse, 'userId'>>>; 
  shareUrl: string | null, 
  setShareUrl:  React.Dispatch<React.SetStateAction<string | null>>;
}

const ChartwiseContext = createContext<TradeContextProps | undefined>(undefined);
const retryHandler = new RetryHandler(1); // Allow only 1 retry to handle expired token


const DefaultAnalysis: Omit<IAnalyse, 'userId'> = {
  output: '',
  chartUrls: [],
  metadata:{
    risk: 25,
    strategyAndCriteria: ''
  }
}

const ChartwiseProvider = ({ children }: ProviderProps) => {
  const [recentAnalyses, setRecentAnalyses] = useState<IAnalysisUrl[]>([]);
  const [analysisToView, setAnalysisToView] = useState<IAnalysisUrl | null>(null);
  const [analysis, setAnalysis] = useState<Omit<IAnalyse, 'userId'>>(DefaultAnalysis);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const router = useRouter();


  useEffect(() => {
    const saveAnalysis = async() => {
      const addRecentAnalysis = (analysisUrlFormat: IAnalysisUrl) => {
        LocalStorage.append(StorageKeys.recentAnalyses, analysisUrlFormat);
        setRecentAnalyses(prevAnalyses => [...prevAnalyses, analysisUrlFormat])
      }
      if(analysis.chartUrls.length > 0 && analysis.output){
        const url = await ChartwiseClient.saveAnalysis(analysis);
        if(url){
          setShareUrl(url);
          addRecentAnalysis({name:`Analysis-${Date.now()}`, analyseUrl: url});
        }
      }
    }
   saveAnalysis()
  }, [analysis, analysis.output]);


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
      analysis,
      setAnalysis,
      shareUrl, 
      setShareUrl,
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
    setAnalysisToView,
    recentAnalyses,
    setRecentAnalyses,
    analysis,
    setAnalysis,
    shareUrl,
  } = context;

  
  const viewAnalysis = (analysis: IAnalysisUrl) => {
    setAnalysisToView(analysis)
  }

  const deleteAnalysis = (analysis: IAnalysisUrl) => {
    LocalStorage.removeItemFromArray(StorageKeys.recentAnalyses, (storedAnaysis: IAnalysisUrl) => storedAnaysis.name!== analysis.name);
    setRecentAnalyses(prevAnalyses => prevAnalyses.filter((storedAnaysis: IAnalysisUrl) => storedAnaysis.name!== analysis.name))
  }


const removeAnalysis = () => {
    setAnalysis(prevAnalysis => ({...prevAnalysis, output: ''}))
    setAnalysisToView(null);
  }
  
const onStrategyAndCriteriaChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
  setAnalysis(prevAnalysis => ({...prevAnalysis, metadata: {...prevAnalysis.metadata, strategyAndCriteria: event.target.value}}))
};

const onRiskChange = (value: any) => {
  setAnalysis(prevAnalysis => ({...prevAnalysis, metadata: {...prevAnalysis.metadata, risk: value}}))

};

const removeCharts = () => {
    setAnalysis(prevAnalysis => ({...prevAnalysis, chartUrls: []}))
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
    setAnalysis(prevAnalysis => ({...prevAnalysis, chartUrls: urls}))
  } catch (error) {
    console.error('Failed to read files:', error);
  }
};


const getRiskTolerance = () => {
  switch(true){
    case analysis.metadata?.risk! <= 0.33 * 100:
      return 'Low risk';
    case analysis.metadata?.risk! <= 0.66 * 100 && analysis.metadata?.risk! > 0.33 * 100:
      return 'Med risk';
    case analysis.metadata?.risk! > 0.66 * 100:
      return 'High risk';
    default:
      return 'Risk';
  }
}


const analyseChart = async (analysis: AnalysisParams, userId: string) => {
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
   setAnalysis(DefaultAnalysis)
  }

  const onAnalysisComplete = (output: string) => {
    setAnalysis(prevAnalysis => ({...prevAnalysis, output}))
    LocalStorage.remove(StorageKeys.jobId);
  }



  return {
    analysis,
    analysisToView,
    recentAnalyses,
    shareUrl,
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