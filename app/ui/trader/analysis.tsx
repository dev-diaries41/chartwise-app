'use client'
import { DefaultToastOptions, StorageKeys, Time } from "@/app/constants/app";
import {ActionRow, PopUp, InfoDisplay, LoaderDialog, AnalysisForm} from "@/app/ui/";
import * as Storage from "@/app/lib/storage/local"
import { PollOptions } from "@/app/types";
import { DEFAULT_ERROR_MESSAGE, JobErrors, ServiceUsageErrors } from "@/app/constants/errors";
import { getJobStatus } from "@/app/lib/requests/chartwise-client";
import { useRouter } from "next/navigation";
import { FREE_USAGE_LIMIT_DESC, FREE_USAGE_LIMIT_TITLE, PLAN_USAGE_LIMIT_TITLE } from "@/app/constants/content/usage";
import { usePopUp, usePolling, useLoading } from "@/app/hooks";
import { toast } from "react-toastify";
import { copyTextToClipboard } from "@/app/lib/utils/ui";
import { useChartwise } from "@/app/providers/chartwise";
import { faCopy, faShareNodes, faTrash } from "@fortawesome/free-solid-svg-icons";


export function ChartAnalyser (){
  const router = useRouter();
  const {analysisResult, shareUrl, removeAnalysis, onAnalysisComplete} = useChartwise();
  const {showPopUp, closePopUp, popUpDescription, popUpTitle} = usePopUp();
  const { loading, setLoading, minimizeLoader, showLoadingDialog } = useLoading();

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

  const handleJobInProgress = (jobId: string) => {
    Storage.set(StorageKeys.jobId, jobId);
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
    toast.error(DEFAULT_ERROR_MESSAGE, DefaultToastOptions);
  };

  const pollJobStatus = async () => {
    try {
      const jobId = Storage.get<string>(StorageKeys.jobId);
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
    showPopUp(FREE_USAGE_LIMIT_TITLE, FREE_USAGE_LIMIT_DESC)
  };

  const onReachedSubUsageLimit = () => {
    toast.error(PLAN_USAGE_LIMIT_TITLE, DefaultToastOptions);
  };


  const handleSubscripe = () => {
    router.push('/pricing')
  }

  const actions = [
    { icon: faCopy, onClick: () => copyTextToClipboard(analysisResult), tooltip: 'Copy' },
    { icon: faShareNodes, onClick: () => copyTextToClipboard(analysisResult), tooltip: 'Share', condition: !!shareUrl }
  ];
  

  return (
    <div className="w-full flex flex-col mx-auto items-center">
      <AnalysisForm handleFailedJobStart={handleFailedJobStart} handleJobInProgress={handleJobInProgress} loading={loading} setLoading={setLoading}/>
      {analysisResult && (
      <div className="flex flex-col items-center justify-center w-full mt-8">
        <InfoDisplay info={analysisResult} title="Chart Analysis"/>
        <ActionRow actions={actions}/>
      </div>
    )}
  {(popUpTitle && popUpDescription) && <PopUp title={popUpTitle} description={popUpDescription} onConfirm={handleSubscripe} onClose={closePopUp} cta="Subscribe"/>}
      {showLoadingDialog && (
        <LoaderDialog
          onMinimize={minimizeLoader}
          position="BOTTOM_RIGHT"
          title="Analysing chart..."
          description="Chart analysis in progress. This can take a few seconds. Please do not refresh the page."/>
      )}
  </div>
  );
}