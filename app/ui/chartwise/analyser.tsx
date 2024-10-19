'use client'
import { useEffect, useLayoutEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { DefaultToastOptions, StorageKeys, Time } from "@/app/constants/global";
import {PopUp, LoaderDialog, AnalysisForm, OnboardingCarousel} from "@/app/ui/";
import {LocalStorage, SessionStorage} from "@/app/lib/storage"
import { OnboardingAnswers, PollOptions } from "@/app/types";
import { DEFAULT_ERROR_MESSAGE, JobErrors, ServiceUsageErrors } from "@/app/constants/errors";
import { completedOnboarding, getJobStatus, getNewToken } from "@/app/lib/requests/chartwise-client";
import { usePopUp, usePolling, useLoading, useOnboarding } from "@/app/hooks";
import { toast } from "react-toastify";
import { useChartwise } from "@/app/providers/chartwise";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AnalysisParamsSchema } from "@/app/constants/schemas";
import { CHARTWISE_WELCOME_MESSAGE, CHARTWISE_WELCOME_TITLE, onboardingQuestions } from "@/app/constants/onboarding";

const LOADER_DESCRIPTION = "Chart analysis in progress. This can take a few seconds. Please do not refresh the page.";
const LOADER_TITLE = "Analysing chart...";
const FREE_USAGE_LIMIT_TITLE = 'Free Usage Limit Reached';
const FREE_USAGE_LIMIT_DESC = 'You have reached the limit for free usage. Subscribe now to continue using.'
const PLAN_USAGE_LIMIT_TITLE = 'Subscription Usage Limit Reached';


export function ChartAnalyser ({email, hasCompletedOnboarding}: {email: string | null | undefined, hasCompletedOnboarding?: boolean}){
  const router = useRouter();
  const pathname = usePathname();
  const {analysis, analyseChart, removeAnalysis, onAnalysisComplete, newAnalysis} = useChartwise();
  const {showPopUp, closePopUp, popUpDescription, popUpTitle, popUpCta} = usePopUp();
  const { loading, setLoading, minimizeLoader, showLoadingDialog } = useLoading();
  const {isVisible, closeOnboardingPopUp} = useOnboarding()


  useLayoutEffect(() => {
    if(pathname !== '/dashboard'){
      router.push('/dashboard')
    }
  }, [])

  // Handle cwauth on first render
  useEffect(() => {
    const cwauth = SessionStorage.get<string>(StorageKeys.cwauth);
    if(cwauth === 'initialised') return;
    if(email){
      getNewToken({userId: email}).then(() => console.log('cwauth initialised'))
    }

    SessionStorage.set(StorageKeys.cwauth, 'initialised');
  }, [])

  const onJobFinished = () => {
    stopPolling();
    setLoading(false);

  }
  const onJobComplete = (chartAnalysis: string) => {
    onJobFinished();
    onAnalysisComplete(chartAnalysis);
  };

  const onJobFail = () => {
    onJobFinished();
    toast.error(DEFAULT_ERROR_MESSAGE, DefaultToastOptions);
  };


  const handleAnalyseChart = async () => {
    if(!email || analysis.chartUrls.length < 1)return;
    if(analysis.output){
      removeAnalysis();
    }
    setLoading(true);
    const {output, ...anaylsisParams} = analysis
    const validatedAnalysis = AnalysisParamsSchema.safeParse(anaylsisParams);
    if(!validatedAnalysis.success)throw new Error(JSON.stringify(validatedAnalysis.error))

    try {
      const jobId = await analyseChart(validatedAnalysis.data, email);
      handleJobInProgress(jobId);
    } catch (error: any) {
      handleFailedJobStart(error);
    }
  };

  const handleJobInProgress = (jobId: string) => {
    LocalStorage.set(StorageKeys.jobId, jobId);
    setTimeout(startPolling, 5 * Time.sec);
  };

  const handleFailedJobStart = async (error: Error) => {
    setLoading(false);
    
    if (error.message === ServiceUsageErrors.EXCEEDED_FREE_LIMIT) {
      return onReachedFreeUseLimit();
    } 
    if (error.message === ServiceUsageErrors.EXCEEDED_PLAN_LIMIT) {
      return onReachedSubUsageLimit();
    } 
    if(error.message.includes('429')){
      return toast.error('We are currently overloaded at the moment', DefaultToastOptions);
    }
    console.error("Unexepcted error here: ",error.message);
     toast.error(DEFAULT_ERROR_MESSAGE, DefaultToastOptions);
     return;
  };

  const pollJobStatus = async () => {
    try {
      const jobId = LocalStorage.get<string>(StorageKeys.jobId);
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
    interval: 5 * Time.sec,
    maxDuration: Time.min,
    maxErrors: 3,
    onMaxDuration: () => setLoading(false),
    onMaxErrors: () => setLoading(false),
  };

  const { startPolling, stopPolling } = usePolling(pollJobStatus, pollOptions);

  const onReachedFreeUseLimit = () => {
    showPopUp(FREE_USAGE_LIMIT_TITLE, FREE_USAGE_LIMIT_DESC, 'Subscribe');
  };

  const onReachedSubUsageLimit = () => {
    toast.error(PLAN_USAGE_LIMIT_TITLE, DefaultToastOptions);
  };

  const handleSubscripe = () => {
    router.push('/#pricing')
  }

  const onComplete = async(answers: OnboardingAnswers) => {
    if(email){
      await completedOnboarding(email, answers);
      closeOnboardingPopUp();
    }
  };

  return (
    <div className="w-full max-w-5xl flex flex-col mx-auto items-center  mb-auto md:my-auto py-8">
    {( !hasCompletedOnboarding && isVisible ) &&(
      <OnboardingCarousel 
      onComplete={onComplete} 
      onboardingQuestions={onboardingQuestions} 
      welcomeMessage={CHARTWISE_WELCOME_MESSAGE} 
      welcomeTitle={CHARTWISE_WELCOME_TITLE}/>
      )}      
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
      <p className="w-full flex text-sm md:text-md lg:text-lg text-left opacity-80 mb-4">You can upload up to 3 charts for different timeframes.</p>
      <AnalysisForm handleAnalyseChart={handleAnalyseChart} loading={loading}/>
      {(popUpTitle && popUpDescription) && <PopUp title={popUpTitle} description={popUpDescription} onConfirm={handleSubscripe} onClose={closePopUp} onConfirmCta={popUpCta}/>}
      {showLoadingDialog && (
        <LoaderDialog
          onMinimize={minimizeLoader}
          position="BOTTOM_RIGHT"
          title={LOADER_TITLE}
          description={LOADER_DESCRIPTION}/>
      )}
    </div>
  );
}