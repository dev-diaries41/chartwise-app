'use client'
import { AcceptedImgFiles, AcceptedImgMimes, DefaultToastOptions, StorageKeys, Time } from "@/app/constants/app";
import {DragAndDropUpload, ActionRow, PopUp, InfoDisplay} from "@/app/ui/";
import { useEffect, useState } from "react";
import { Button } from "@/app/ui/buttons/button";
import { faChartLine, faTrash } from "@fortawesome/free-solid-svg-icons";
import * as Storage from "@/app/lib/storage"
import ChartImageWithLoader from "./loader-chart";
import { IAnalysis, LoadingState, PollOptions } from "@/app/types";
import { DEFAULT_ERROR_MESSAGE, AuthErrors, JobErrors, ServiceUsageErrors } from "@/app/constants/errors";
import { RetryHandler, getJobStatus, getNewToken, saveAnalysis, submitAnalysisRequest } from "@/app/lib/requests/request";
import { useRouter } from "next/navigation";
import { FREE_USAGE_LIMIT_DESC, FREE_USAGE_LIMIT_TITLE, PLAN_USAGE_LIMIT_TITLE } from "@/app/constants/content/usage";
import usePolling from "@/app/hooks/usePolling";
import { useTrader } from "@/app/providers/trader";
import { useUser } from "@auth0/nextjs-auth0/client";
import { toast } from "react-toastify";
import { copyTextToClipboard } from "@/app/lib/utils";

export const ChartAnalyser = ({ loading, setLoading }: Pick<LoadingState, 'loading' |'setLoading'>) => {
  const {user, isLoading} = useUser();
  const userId = user?.email;
  const [chartImageUrl, setChartImageUrl] = useState<string | null>(null);
  const [analysisResult, setChartAnalysisResult] = useState<string | null>(null);
  const [popUpTitle, setPopUpTitle] = useState('');
  const [popUpDescription, setPopUpDescription] = useState('');
  const {analysisToView, setRecentAnalyses, setAnalysisToView} = useTrader();
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const router = useRouter();

  // On mount set recent charts
  useEffect(() => {
    const storedAnalyses = Storage.get(StorageKeys.recentAnalyses);
    if (Array.isArray(storedAnalyses)) {
      setRecentAnalyses(storedAnalyses);
    }
  },[])

  useEffect(() => {
    if(analysisToView){
      viewRecentAnalysis(analysisToView)
    }
  },[analysisToView]);

  // Using hook because when using in onComplete chartImageUrl is null;

  useEffect(() => {
    if(chartImageUrl && analysisResult){
      saveAnalysis(analysisResult, chartImageUrl).then(url => {
        if(url){
          setShareUrl(url);
          addRecentAnalysis({name:`Analysis-${Date.now()}`, analyseUrl: url});
        }
      });
    }
  }, [chartImageUrl, analysisResult]);


  const addRecentAnalysis = (analysis: IAnalysis) => {
    Storage.append(StorageKeys.recentAnalyses, analysis);
    setRecentAnalyses(prevAnalyses => [...prevAnalyses, analysis])
  }

  const viewRecentAnalysis = (analysis: IAnalysis) => {
    router.push(analysis.analyseUrl)
  }

  const onJobComplete = (chartAnalysis: string) => {
    stopPolling();
    setChartAnalysisResult(chartAnalysis);
    Storage.remove(StorageKeys.jobId);
    setLoading(false);
  };

  const onJobFail = () => {
    stopPolling();
    toast.error(DEFAULT_ERROR_MESSAGE, DefaultToastOptions);
    setLoading(false);
  };

  const onJobInProgress = (jobId: string) => {
    Storage.set(StorageKeys.jobId, jobId);
    setTimeout(startPolling, 2 * Time.sec);
  };

  const handleFailedJobStart = async (errorMessage: string) => {
    setLoading(false);
    
    if (errorMessage === ServiceUsageErrors.EXCEEDED_FREE_LIMIT) {
      return onReachedFreeUseLimit();
    } 
    if (errorMessage === ServiceUsageErrors.EXCEEDED_PLAN_LIMIT) {
      return onReachedSubUsageLimit();
    } 
    toast.error(DEFAULT_ERROR_MESSAGE, DefaultToastOptions);
  };

  const pollJobStatus = async () => {
    try {
      const jobId = Storage.get(StorageKeys.jobId);
      if (!jobId) throw new Error(JobErrors.INVALID_JOB_ID);
  
      const { data, status } = await getJobStatus(jobId);
  
      if (status === 'completed') {
        onJobComplete(data.output);
      } else if (status === 'failed') {
        onJobFail();
      }
    } catch (error) {
      toast.error(DEFAULT_ERROR_MESSAGE, DefaultToastOptions);
      setLoading(false);
      throw error;
    }
  };
  
  const pollOptions: PollOptions = {
    interval: 4 * Time.sec,
    maxDuration: Time.min,
    maxErrors: 3,
  };

  const { startPolling, stopPolling } = usePolling(pollJobStatus, pollOptions);

  const onReachedFreeUseLimit = () => {
    setPopUpTitle(FREE_USAGE_LIMIT_TITLE);
    setPopUpDescription(FREE_USAGE_LIMIT_DESC);
  };

  const onReachedSubUsageLimit = () => {
    toast.error(PLAN_USAGE_LIMIT_TITLE, DefaultToastOptions);
  };

  const retryHandler = new RetryHandler(1); // Allow only 1 retry to handle expired token

  const handleAnalyseChart = async () => {
    if(!userId)return;
    if (!chartImageUrl) return;
    if(analysisResult){
      setChartAnalysisResult(null);
    }
    setLoading(true);

    const formData = new FormData();
    formData.append('image', chartImageUrl);
    formData.append('userId', userId);

    try {
      const jobId = await retryHandler.retry(
        async () => await submitAnalysisRequest(formData),
        async(error) => {
          if(error.message.trim() === AuthErrors.MISSING_JWT_TOKEN || error.message.trim() === AuthErrors.EXPIRED_TOKEN ){
            const token = await getNewToken({userId})
            return !!token
          }
          return false
        }
      );
      onJobInProgress(jobId);
    } catch (error: any) {
      handleFailedJobStart(error.message)
    }
  };

  
  const handleFileUpload = async (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setChartImageUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setChartImageUrl(null);
    handleRemoveAnalysis();
  };

  const handleSubscripe = () => {
    router.push('/pricing')
  }

  const handleCloseUsageMsg = () => {
    setPopUpTitle('');
    setPopUpDescription('');
  }

  const handleRemoveAnalysis = () => {
    setChartAnalysisResult(null);
    setAnalysisToView(null);
  }

  return ( 
    <div className="flex flex-col w-full mx-auto items-center justify-center">
      {chartImageUrl ? (
        <div className="w-full max-w-[100%]">
          <ChartImageWithLoader chartImageUrl={chartImageUrl} loading={loading} loadingText="Analysing chart please wait a few seconds..." />
          <div className="flex justify-center mt-4 gap-4 mx-auto">
            <Button
              icon={faTrash}
              className="flex w-full  max-w-[100%] lg:max-w-[80%] items-center justify-center bg-red-700 hover:bg-red-500 lg:mx-0 sm:mx-auto text-white font-bold p-4 rounded-md shadow-md gap-2"
              onClick={handleRemoveImage}
              disabled={loading}
            >
              Remove chart
            </Button>
            <Button
              icon={faChartLine}
              className="flex w-full max-w-[100%] lg:max-w-[80%]  items-center justify-center bg-emerald-700 hover:bg-emerald-500 lg:mx-0 sm:mx-auto text-white font-bold p-4 rounded-md shadow-md gap-2"
              onClick={handleAnalyseChart}
              disabled={loading || !userId}
            >
              Analyse
            </Button>
          </div>
        </div>
      ) : (
        <DragAndDropUpload onFileUpload={handleFileUpload} acceptedMimes={AcceptedImgMimes} acceptedFileExt={AcceptedImgFiles} />
      )}
      {(popUpTitle && popUpDescription) && <PopUp title={popUpTitle} description={popUpDescription} onConfirm={handleSubscripe} onClose={handleCloseUsageMsg} cta="Subscribe"/>}
        {analysisResult && (
        <div className="flex flex-col items-center justify-center w-full mt-8">
          <InfoDisplay info={analysisResult} title="Chart Analysis"/>
          <ActionRow onCopy={() => copyTextToClipboard(analysisResult)} onDelete={handleRemoveAnalysis} shareUrl={shareUrl}/>
        </div>
        )}
    </div>
  );
};