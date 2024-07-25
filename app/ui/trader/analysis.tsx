'use client'
import { AcceptedImgFiles, AcceptedImgMimes, DefaultToastOptions, StorageKeys, Time } from "@/app/constants/app";
import {ActionRow, PopUp, InfoDisplay, FileUploader, LoaderDialog} from "@/app/ui/";
import { faChartLine, faPaperclip, faTrash, faWarning } from "@fortawesome/free-solid-svg-icons";
import * as Storage from "@/app/lib/storage/local"
import Chart from "./chart";
import { PollOptions } from "@/app/types";
import { DEFAULT_ERROR_MESSAGE, JobErrors, ServiceUsageErrors } from "@/app/constants/errors";
import { getJobStatus } from "@/app/lib/requests/client";
import { useRouter } from "next/navigation";
import { FREE_USAGE_LIMIT_DESC, FREE_USAGE_LIMIT_TITLE, PLAN_USAGE_LIMIT_TITLE } from "@/app/constants/content/usage";
import { useUser } from "@auth0/nextjs-auth0/client";
import { usePopUp, useChartwise, usePolling, useLoading } from "@/app/hooks";
import { toast } from "react-toastify";
import { copyTextToClipboard } from "@/app/lib/utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SliderInput from "../forms/slider";

const MAX_CHARS = 150;

export function ChartAnalyser (){
  const {user} = useUser();
  const userId = user?.email;
  const router = useRouter();
  const {analysisResult, chartImageUrl, strategyAndCriteria, shareUrl, risk, handleRiskChange, analyseChart, removeAnalysis, removeChart, handleStrategyAndCriteriaChange, setChartAnalysisResult, uploadChart, getRiskTolerance} = useChartwise(router);
  const {showPopUp, closePopUp, popUpDescription, popUpTitle} = usePopUp();
  const { loading, setLoading, minimizeLoader, showLoadingDialog } = useLoading();

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


  const handleAnalyseChart = async () => {
    if(!userId || !chartImageUrl)return;
    if(analysisResult){
      setChartAnalysisResult(null);
    }
    setLoading(true);

    const formData = new FormData();
    formData.append('image', chartImageUrl);
    formData.append('strategyAndCriteria', strategyAndCriteria);
    formData.append('risk', risk.toString());

    try {
      const jobId = await analyseChart(userId, formData);
      onJobInProgress(jobId);
    } catch (error: any) {
      handleFailedJobStart(error)
    }
  };

  const handleSubscripe = () => {
    router.push('/pricing')
  }


  function AnalysisActionRow(){
    return(
      <div className="w-full flex flex-row justify-start items-center gap-4 rounded-md mt-4 h-10">
      <div className="">
      <FileUploader onFileUpload={uploadChart} acceptedFileExt={AcceptedImgFiles} acceptedMimes={AcceptedImgMimes}>
        <div className='flex flex-row gap-1 justify-center items-center'>
          <FontAwesomeIcon icon={faPaperclip} className="w-4 h-4" />
          <span className="hidden sm:inline">Upload Chart</span>
        </div>
      </FileUploader>
      </div>
      {chartImageUrl && (
        <button
        className="flex w-auto items-center justify-center text-red-500 text-sm  lg:mx-0 sm:mx-auto font-semibold p-4 gap-2"
        onClick={removeChart}
        disabled={loading}
      >
        <FontAwesomeIcon icon={faTrash} className="w-4 h-4"/>
        <span className="hidden sm:inline">Remove Chart</span>
        </button>
    )}
      <button
        disabled={loading || !userId || !chartImageUrl}
        className={`flex  items-center justify-center border-2 border-2 border-emerald-400 bg-emerald-700 text-sm  ml-auto text-white font-semibold p-2 rounded-full shadow-md gap-2 ${loading || !userId || !chartImageUrl? 'opacity-50' : 'opacity-100 hover:bg-emerald-500'}`}
        onClick={handleAnalyseChart}
      >
        <FontAwesomeIcon icon={faChartLine} className="w-4 h-4"/>
        <span className="">Analyse Chart</span>
      </button>
    </div>
    )
  }

  function AnalysisForm (){
    return (
      <div className="relative w-full max-w-[100%] flex flex-col bg-gray-800 border-2 border-gray-700 text-sm md:text-md lg:text-lg shadow-md rounded-md mb-2 p-4" >
        <div className="flex flex-row justify-between">
          <label htmlFor={'strategy-criteria'} className=" flex flex-row block text-left font-medium mb-1 text-gray-200">
            {`Strategy and Criteria (optional):`}
          </label>      
        </div>
        <div className="flex flex-col items-center mb-4 w-full bg-gray-800 rounded-md border border-gray-700 text-sm md:text-md lg:text-lg ">
        <textarea
          id={"strategy-criteria"}
          name={"strategy-criteria"}
          placeholder={"To optimise your analysis, provide details about your trading strategy (e.g., breakout, swing trading) and any criteria like minimum risk-to-reward ratio. Be specific."}
          className={`flex w-full  flex-grow min-h-[180px] lg:min-h-[100px] p-2 bg-transparent rounded-md focus:outline-none resize-none`}
          value={strategyAndCriteria}
          onChange={handleStrategyAndCriteriaChange}
          aria-describedby={"strategy-criteria-error"}
          maxLength={MAX_CHARS} />
          <span className="p-2 w-full text-right text-gray-400">{`${strategyAndCriteria.length}/${MAX_CHARS}`}</span> 
        </div>
       
          
        <div className="flex lg:flex-row flex-col justify-between items-center gap-16 my-4 pb-20">
          <div className="mb-auto w-full lg:w-[50%]">
            <SliderInput
              title={getRiskTolerance()}
              description="Adjust your risk tolerance"
              icon={faWarning}
              min={0}
              max={100}
              initialValue={risk}
              onChange={handleRiskChange}/>
            </div>
          {chartImageUrl && (
          <div className="mb-auto w-full lg:w-[50%]">
            <Chart chartImageUrl={chartImageUrl} loading={loading} />
          </div>
          )}
        </div>
        <div className="absolute bottom-0 right-0 left-0 w-full  bg-gray-900 border-t-2 border-gray-700 pb-4 px-4 rounded-md">
        <AnalysisActionRow/>
        </div>
    </div>
    )
  }


  return (
    <div className="w-full flex flex-col mx-auto items-center">
      <AnalysisForm/>
    {analysisResult && (
    <div className="flex flex-col items-center justify-center w-full mt-8">
      <InfoDisplay info={analysisResult} title="Chart Analysis"/>
      <ActionRow onCopy={() => copyTextToClipboard(analysisResult)} onDelete={removeAnalysis} shareUrl={shareUrl}/>
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