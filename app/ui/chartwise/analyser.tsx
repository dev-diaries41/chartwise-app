'use client'
import { useLayoutEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { DefaultToastOptions, Time } from "@/app/constants/global";
import {AnalysisForm, OnboardingCarousel} from "@/app/ui/";
import { DEFAULT_ERROR_MESSAGE, JobErrors, RequestErrors, ServiceUsageErrors } from "@/app/constants/errors";
import { usePopUp, useOnboarding } from "@/app/hooks";
import { toast } from "react-toastify";
import { useChartwise } from "@/app/providers/chartwise";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AnalysisParamsSchema } from "@/app/constants/schemas";
import { CHARTWISE_WELCOME_MESSAGE, CHARTWISE_WELCOME_TITLE, onboardingQuestions } from "@/app/constants/onboarding";
import PlanLimitAlert from "../cards/limit-card";
import { FREE_USAGE_LIMIT_DESC, FREE_USAGE_LIMIT_TITLE, PLAN_USAGE_LIMIT_DESC, PLAN_USAGE_LIMIT_TITLE } from "@/app/constants/messages";
import { Timer } from "devtilities";
import { useSubscription } from "@/app/providers/subscription";

export function ChartAnalyser ({email, hasCompletedOnboarding}: {email: string | null | undefined, hasCompletedOnboarding?: boolean}){
  const router = useRouter();
  const pathname = usePathname();
  const {analysis, analyseChart, removeAnalysis, newAnalysis} = useChartwise();
  const {reachedLimit} = useSubscription();
  const {showPopUp, closePopUp, popUpDescription, popUpTitle, popUpCta} = usePopUp();
  const {isVisible, isOnboarded, onCompleteOnboarding} = useOnboarding(email);

  useLayoutEffect(() => {
    if(pathname !== '/dashboard'){
      router.push('/dashboard')
    }
  }, [])

  const handleError= async (error: Error) => {
    // console.error(error.message)
    if (error.message === ServiceUsageErrors.EXCEEDED_FREE_LIMIT) {
      reachedLimit();
      return showPopUp(FREE_USAGE_LIMIT_TITLE, FREE_USAGE_LIMIT_DESC, 'Subscribe');
    } 

    if (error.message === ServiceUsageErrors.EXCEEDED_PLAN_LIMIT) {
      reachedLimit();
      return showPopUp(PLAN_USAGE_LIMIT_TITLE, PLAN_USAGE_LIMIT_DESC);
    } 

    if (error.message === JobErrors.TIMEOUT) {
      return toast.error(JobErrors.TIMEOUT, DefaultToastOptions);
    } 
    if(error.message.includes('429') || error.message.includes(RequestErrors.RATE_LIMIT_ERROR)){
      return toast.error(RequestErrors.RATE_LIMIT_ERROR, DefaultToastOptions);
    }
     toast.error(DEFAULT_ERROR_MESSAGE, DefaultToastOptions);
     return;
  };

  const handleAnalyseChart = async () => {
    if(!email || analysis.chartUrls.length < 1)return;
    if(analysis.output){
      removeAnalysis();
    }
    const {output, ...anaylsisParams} = analysis
    const validatedAnalysis = AnalysisParamsSchema.safeParse(anaylsisParams);

    try {
      if(!validatedAnalysis.success)throw new Error(JSON.stringify(validatedAnalysis.error));
      const timer = new Timer();
      await timer.timeoutFunction(()=> analyseChart(validatedAnalysis.data, email), (1.5*Time.min));
    } catch (error: any) {
      handleError(error);
    }
  };

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
      {(popUpTitle && popUpDescription) && <PlanLimitAlert onClose={closePopUp} title={popUpTitle} description={popUpDescription} onConfirmCta={popUpCta}/>}
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
      <p className="w-full flex text-sm md:text-md text-left opacity-80 mb-4">You can upload up to 3 charts for multi-timeframe analysis (Pro users only).</p>
      <AnalysisForm handleAnalyseChart={handleAnalyseChart}/>
    </div>
  );
}