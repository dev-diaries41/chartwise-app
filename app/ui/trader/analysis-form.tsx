'use client'
import { AcceptedImgFiles, AcceptedImgMimes } from "@/app/constants/app";
import {CarouselImageViewer, FileUploader, InfoDisplay, SliderInput} from "@/app/ui/";
import {faCopy, faMagnifyingGlassChart, faPaperclip, faShareNodes, faTimes, faWarning } from "@fortawesome/free-solid-svg-icons";
import { useUser } from "@auth0/nextjs-auth0/client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useChartwise } from "@/app/providers/chartwise";
import { AnalyseChartSchema } from "@/app/constants/schemas";
import ActionRow from "../common/action-row";
import { copyTextToClipboard } from "@/app/lib/utils";


interface AnalysisFormProps {
    loading: boolean;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
    handleJobInProgress: (jobId: string) => void;
    handleFailedJobStart: (error: Error) => void;
  }


  export default function AnalysisForm ({handleJobInProgress, handleFailedJobStart, loading, setLoading}: AnalysisFormProps){
    const MAX_CHARS = 150;
    const {shareUrl, anaylsisParams, analysisResult, chartUrls,  strategyAndCriteria, risk, uploadCharts, removeAnalysis, onRiskChange, onStrategyAndCriteriaChange, getRiskTolerance, analyseChart,  removeCharts} = useChartwise();
    
    const AnalysisActionRow = () => {
        const {user} = useUser();
        const userId = user?.email || 'testuser';
    
    
        const handleAnalyseChart = async () => {
            if(!userId || chartUrls.length < 1)return;
            if(analysisResult){
              removeAnalysis();
            }
            setLoading(true);
        
            const validatedAnalysis = AnalyseChartSchema.safeParse(anaylsisParams);
            if(!validatedAnalysis.success)throw new Error(JSON.stringify(validatedAnalysis.error))
        
            try {
              const jobId = await analyseChart(validatedAnalysis.data, userId);
              handleJobInProgress(jobId);
            } catch (error: any) {
              handleFailedJobStart(error);
            }
        };
    
        return(
          <div className="w-full flex flex-row justify-start items-center gap-3 rounded-md mt-4 h-10">
          <div className="">
          <FileUploader onFileUpload={uploadCharts} acceptedFileExt={AcceptedImgFiles} acceptedMimes={AcceptedImgMimes} fileLimit={3}>
            <div className='flex flex-row gap-1 justify-center items-center'>
              <FontAwesomeIcon icon={faPaperclip} className="w-4 h-4" />
              <span className="">Upload Chart</span>
            </div>
          </FileUploader>
          </div>
        
          <button
            disabled={loading || !userId || chartUrls.length < 1}
            className={`flex  items-center justify-center border-2 border-2 border-emerald-400 bg-emerald-700 text-sm  ml-auto text-white font-semibold p-2 rounded-full shadow-md gap-2 ${loading || !userId || chartUrls.length < 1? 'opacity-50' : 'opacity-100 hover:bg-emerald-500'}`}
            onClick={handleAnalyseChart}
          >
            <FontAwesomeIcon icon={faMagnifyingGlassChart} className="w-4 h-4"/>
            <span className="">Analyse Chart</span>
          </button>
        </div>
        )
      }
    
      const actions = [
        { icon: faCopy, onClick: () => copyTextToClipboard(analysisResult), tooltip: 'Copy' },
        { icon: faShareNodes, onClick: () => copyTextToClipboard(shareUrl), tooltip: 'Share', condition: !!shareUrl }
      ];

    return (
      <div className="relative w-full max-w-[100%] flex flex-col bg-gray-800 border-2 border-gray-700 text-sm md:text-md shadow-md rounded-md mb-2 p-4" >
        <div className="flex flex-row justify-between">
          <label htmlFor={'strategy-criteria'} className=" flex flex-row block text-left font-medium mb-1 opacity-80">
            {`Strategy and Criteria (optional):`}
          </label>      
        </div>
        <div className="flex flex-col items-center mb-4 w-full bg-gray-800 rounded-md border border-gray-700 text-sm md:text-md ">
        <textarea
          id={"strategy-criteria"}
          name={"strategy-criteria"}
          placeholder={"To optimise your analysis, provide details about your trading strategy (e.g., breakout, swing trading) and any criteria like minimum risk-to-reward ratio. Be specific."}
          className={`flex w-full  flex-grow min-h-[180px] lg:min-h-[100px] p-2 bg-transparent rounded-md focus:outline-none resize-none text-sm md:text-md`}
          value={strategyAndCriteria}
          onChange={onStrategyAndCriteriaChange}
          aria-describedby={"strategy-criteria-error"}
          maxLength={MAX_CHARS} />
          <span className="p-2 w-full text-right opacity-50">{`${strategyAndCriteria.length}/${MAX_CHARS}`}</span> 
        </div>
       
        <div className={`flex lg:flex-row flex-col justify-between items-center gap-16 my-4 ${analysisResult? 'pb-2' : 'pb-16'}`}>
          <div className="w-full lg:w-[50%]">
            <SliderInput
              title={getRiskTolerance()}
              description="Adjust your risk tolerance"
              icon={faWarning}
              min={0}
              max={100}
              value={risk} 
              onChange={onRiskChange}/>
            </div>
          {chartUrls.length > 0 && (
          <div className="relative mb-auto w-full lg:w-[50%] mt-4">
            <button 
              className="absolute top-0 right-0 mt-2  text-red-600 transform -translate-y-8 z-[20]"
              onClick={removeCharts}
            >
              <FontAwesomeIcon icon={faTimes} className="w-4 h-4"/>
            </button>
            <CarouselImageViewer images={chartUrls}/>
          </div>
          )}
        </div>
        {analysisResult && (
      <div className="flex flex-col items-center justify-center w-full max-w-[100%] lg:max-w-[80%] overflow-auto mx-auto pb-8 mb-8 text-sm md:text-md">
        <InfoDisplay info={analysisResult} title="Chart Analysis"/>
        <ActionRow actions={actions}/>
      </div>
    )}
        <div className="absolute bottom-0 right-0 left-0 w-full  bg-gray-900 border-t-2 border-gray-700 pb-4 px-4 rounded-md">
        <AnalysisActionRow/>
        </div>
    </div>
    )
  }