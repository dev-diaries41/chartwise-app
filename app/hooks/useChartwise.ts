import React, {ChangeEvent, useEffect, useState } from 'react'
import { useTrader } from '../providers/trader';
import * as Storage from "@/app/lib/storage/local"
import { StorageKeys } from '../constants/app';
import { IAnalysis } from '../types';
import * as ChartwiseClient from '../lib/requests/client';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { RetryHandler } from '../lib/utils';
import { AuthErrors } from '../constants/errors';

const retryHandler = new RetryHandler(1); // Allow only 1 retry to handle expired token

const useChartwise = (router: AppRouterInstance) => {
    const [chartImageUrl, setChartImageUrl] = useState<string | null>(null);
    const [analysisResult, setChartAnalysisResult] = useState<string | null>(null);
    const {analysisToView, setRecentAnalyses, setAnalysisToView} = useTrader();
    const [shareUrl, setShareUrl] = useState<string | null>(null);
    const [strategyAndCriteria, setStrategyAndCriteria] = useState(''); 
    const [risk, setRisk] = useState<number>(25);


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
      risk,
      analysisResult,
      chartImageUrl,
      strategyAndCriteria,
      shareUrl,
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
}

export default useChartwise;

