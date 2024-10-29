'use client'
import { useEffect, useLayoutEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { DefaultToastOptions, StorageKeys, Time } from "@/app/constants/global";
import {LoaderDialog, AnalysisForm, OnboardingCarousel, MarkdownView} from "@/app/ui/";
import {LocalStorage} from "@/app/lib/storage"
import { JobReceipt, PollOptions } from "@/app/types";
import { DEFAULT_ERROR_MESSAGE, JobErrors, RequestErrors, ServiceUsageErrors } from "@/app/constants/errors";
import { getJobStatus, getNewToken } from "@/app/lib/requests/chartwise-client";
import { usePopUp, usePolling, useOnboarding } from "@/app/hooks";
import { toast } from "react-toastify";
import { useChartwise } from "@/app/providers/chartwise";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AnalysisParamsSchema } from "@/app/constants/schemas";
import { CHARTWISE_WELCOME_MESSAGE, CHARTWISE_WELCOME_TITLE, onboardingQuestions } from "@/app/constants/onboarding";
import PlanLimitAlert from "../cards/limit-card";
import { FREE_USAGE_LIMIT_DESC, FREE_USAGE_LIMIT_TITLE, PLAN_USAGE_LIMIT_DESC, PLAN_USAGE_LIMIT_TITLE, CHARTWISE_LOADER_TITLE, CHARTWISE_LOADER_DESCRIPTION } from "@/app/constants/messages";

export function ChartAnalyser ({email, hasCompletedOnboarding}: {email: string | null | undefined, hasCompletedOnboarding?: boolean}){
  const router = useRouter();
  const pathname = usePathname();
  const {analysis, analyseChart, removeAnalysis, onAnalysisComplete, newAnalysis} = useChartwise();
  const {showPopUp, closePopUp, popUpDescription, popUpTitle, popUpCta} = usePopUp();
  const {isVisible, onCompleteOnboarding} = useOnboarding(email);
  const [isOnboarded, setIsOnboarded] = useState(true);
  const [jobReceipt, setJobReceipt] = useState<JobReceipt | null>(null);
  const loading = !!jobReceipt?.status && !['completed', 'failed'].includes(jobReceipt?.status);
  const [minimize, setMinimize] = useState(false);


  useLayoutEffect(() => {
    if(pathname !== '/dashboard'){
      router.push('/dashboard')
    }
    const result = LocalStorage.get<string>(StorageKeys.onboarding);
    if(result !== 'complete'){
      setIsOnboarded(false);
    }

  }, [])

  useEffect(() => {
    const fetchToken = async () => {
      if (email) {
        try {
          await getNewToken({ email });
          console.log('cwauth initialised');
          // SessionStorage.set(StorageKeys.cwauth, 'initialised');
        } catch (error) {
          console.error('Error fetching token:', error);
        }
      }
    };
  
    fetchToken();
  }, [email]);
  
  

  const onJobFinished = (status: JobReceipt['status']) => {
    stopPolling();
    updateJobReceipt(status);

  }

  const updateJobReceipt = (status: JobReceipt['status']) => {
    setJobReceipt(prev => prev === null? prev : ({...prev, status}))
  }

  const onJobComplete = (chartAnalysis: string) => {
    onJobFinished('completed');
    onAnalysisComplete(chartAnalysis);
  };

  const onJobFail = () => {
    onJobFinished('failed');
    toast.error(DEFAULT_ERROR_MESSAGE, DefaultToastOptions);
  };


  const handleAnalyseChart = async () => {
    if(!email || analysis.chartUrls.length < 1)return;
    if(analysis.output){
      removeAnalysis();
    }
    const {output, ...anaylsisParams} = analysis
    const validatedAnalysis = AnalysisParamsSchema.safeParse(anaylsisParams);
    if(!validatedAnalysis.success)throw new Error(JSON.stringify(validatedAnalysis.error))

    try {
      const receipt = await analyseChart(validatedAnalysis.data, email);
      handleJobInProgress(receipt);
    } catch (error: any) {
      handleFailedJobStart(error);
    }
  };

  const handleJobInProgress = (receipt: JobReceipt) => {
    if (!receipt.jobId) throw new Error(JobErrors.INVALID_JOB_ID);
    setJobReceipt(receipt);
    LocalStorage.set(StorageKeys.jobId, receipt.jobId);
    setTimeout(startPolling, 5 * Time.sec);
  };

  const handleFailedJobStart = async (error: Error) => {
    setJobReceipt(null);
    
    if (error.message === ServiceUsageErrors.EXCEEDED_FREE_LIMIT) {
      return onReachedFreeUseLimit();
    } 

    if (error.message === ServiceUsageErrors.EXCEEDED_PLAN_LIMIT) {
      return onReachedSubUsageLimit();
    } 
    if(error.message.includes('429') || error.message.includes(RequestErrors.RATE_LIMIT_ERROR)){
      return toast.error(RequestErrors.RATE_LIMIT_ERROR, DefaultToastOptions);
    }
     toast.error(DEFAULT_ERROR_MESSAGE, DefaultToastOptions);
     return;
  };

  const pollJobStatus = async () => {
    const jobId = LocalStorage.get<string>(StorageKeys.jobId);
    if (!jobId) throw new Error(JobErrors.INVALID_JOB_ID);

    const { data, status } = await getJobStatus(jobId);
    updateJobReceipt(status);
    if (status === 'completed') {
      onJobComplete(data.output);
    } else if (status === 'failed') {
      onJobFail();
    }
  };
  
  const pollOptions: PollOptions = {
    interval: 5 * Time.sec,
    maxDuration: 2 * Time.min,
    maxErrors: 3,
    onMaxDuration: onJobFail,
    onMaxErrors: onJobFail,
  };

  const { startPolling, stopPolling } = usePolling(pollJobStatus, pollOptions);

  const onReachedFreeUseLimit = () => {
    showPopUp(FREE_USAGE_LIMIT_TITLE, FREE_USAGE_LIMIT_DESC, 'Subscribe');
  };

  const onReachedSubUsageLimit = () => {
    showPopUp(PLAN_USAGE_LIMIT_TITLE, PLAN_USAGE_LIMIT_DESC);
  };

  const toggleLoaderDialog = () => {
    setMinimize(prev => !prev)
  }

  return (
    <div className="w-full max-w-5xl flex flex-col mx-auto items-center  mb-auto md:my-auto py-8">
    {( !hasCompletedOnboarding && isVisible && !isOnboarded ) &&(
      <OnboardingCarousel 
      onComplete={onCompleteOnboarding} 
      onboardingQuestions={onboardingQuestions} 
      welcomeMessage={CHARTWISE_WELCOME_MESSAGE} 
      welcomeTitle={CHARTWISE_WELCOME_TITLE}/>
      )}
      <div className="absolute top-4 z-50">
      {(popUpTitle && popUpDescription) &&<PlanLimitAlert onClose={closePopUp} title={popUpTitle} description={popUpDescription} onConfirmCta={popUpCta}/>}
      </div>
      <div className='w-full flex flex-row gap-4 justify-between items-center'>
        <h1 className="text-left text-xl md:text-3xl my-4 font-bold">Upload & Analyse</h1>
        <button
          className="flex w-auto items-center justify-center text-sm md:text-md lg:text-lg font-medium gap-1"
          onClick={newAnalysis}
          >
          <FontAwesomeIcon icon={faPlusCircle} className="w-4 md:w-4 h-4 md:h-4"  />
          <span className="">New Analysis</span>
        </button> 
      </div>
      <p className="w-full flex text-sm md:text-md lg:text-lg text-left opacity-80 mb-4">You can upload up to 3 charts for multi-timeframe analysis (Pro users only).</p>
  
      <AnalysisForm handleAnalyseChart={handleAnalyseChart} status={jobReceipt?.status}/>
      {(loading && !minimize) && (
        <LoaderDialog
          position="BOTTOM_RIGHT"
          title={CHARTWISE_LOADER_TITLE}
          description={CHARTWISE_LOADER_DESCRIPTION}
          status={jobReceipt?.status}
          queue={jobReceipt?.queue}
          onMinimize={toggleLoaderDialog}
          />
      )}
    </div>
  );
}