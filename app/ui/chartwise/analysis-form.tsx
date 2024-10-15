'use client'
import { AcceptedImgMimes } from "@/app/constants/app";
import {CarouselImageViewer, MarkdownView, SliderInput, DragAndDropUpload, ActionRow} from "@/app/ui/";
import {faChevronDown, faChevronUp, faCopy, faMagnifyingGlassChart, faShareNodes, faTimes, faUpload, faWarning } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useChartwise } from "@/app/providers/chartwise";
import { AnalysisParamsSchema } from "@/app/constants/schemas";
import { copyTextToClipboard } from "@/app/lib/helpers";
import { ActionItem } from "@/app/types";
import { useState } from "react";


interface AnalysisFormProps {
    loading: boolean;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
    handleJobInProgress: (jobId: string) => void;
    handleFailedJobStart: (error: Error) => void;
}


  export default function AnalysisForm ({
    handleJobInProgress, 
    handleFailedJobStart, 
    loading, 
    setLoading,
    email
  }: AnalysisFormProps & {email: string | null | undefined}){
    const MAX_CHARS = 150;
    const {analysis, shareUrl, uploadCharts, removeAnalysis, onRiskChange, onStrategyAndCriteriaChange, getRiskTolerance, analyseChart,  removeCharts} = useChartwise();
    const [showStrategy, setShowStrategy] = useState(false);

    const AnalysisActionRow = () => {        
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

        const actions: ActionItem[] = [
          { icon: faCopy, onClick: () => copyTextToClipboard(analysis.output), tooltip: 'Copy' },
          { icon: faShareNodes, onClick: () => copyTextToClipboard(shareUrl), tooltip: 'Share', isVisible: !!shareUrl }
        ];
  
        return(
          <div className="w-full flex flex-row justify-start items-center gap-3 rounded-md mt-4 h-8">
            <div className="">
            { analysis.output && <ActionRow actions={actions}/>}
            </div>
            <button
              disabled={loading || !email || analysis.chartUrls.length < 1}
              className={`flex  items-center justify-center bg-emerald-500 text-sm ml-auto text-white font-semibold p-2 rounded-full shadow-md gap-2 ${loading || !email || analysis.chartUrls.length < 1? 'opacity-50' : 'opacity-100 hover:bg-emerald-500'}`}
              onClick={handleAnalyseChart}
            >
              <FontAwesomeIcon icon={faMagnifyingGlassChart} className="w-4 h-4"/>
              <span className="">Analyse Chart</span>
            </button>
          </div>
        )
      }

      const toggleStrategy = () => {
        setShowStrategy(prev => !prev);
      }
    
    return (
      <div className="relative w-full max-w-[100%] flex flex-col border-2 border-neutral-400 dark:border-gray-700 text-sm md:text-md shadow-md rounded-md mb-2" >
        <div className=" p-4">
          <div className={`flex lg:flex-row flex-col justify-between items-center gap-16 my-4 mb-8`}>
            {analysis.chartUrls.length > 0? (
            <div className="relative mb-auto w-full mt-4">
              <button 
                className="absolute top-0 right-0 mt-2 text-red-600 transform -translate-y-8 z-[20]"
                onClick={removeCharts}
              >
                <FontAwesomeIcon icon={faTimes} className="w-4 h-4"/>
              </button>
              <CarouselImageViewer images={analysis.chartUrls}/>
            </div>
            ):(
              <DragAndDropUpload onFileUpload={uploadCharts} acceptedMimes={AcceptedImgMimes} maxFiles={3}>
                <div className='flex flex-col gap-4 justify-center items-center'>
                  <FontAwesomeIcon icon={faUpload} className="w-8 h-8 text-emerald-500" />
                  <span className="text-lg font-semibold">Click to upload charts</span>
                </div>
                <p className='font-medium mt-4 opacity-80'>Or drag and drop a file (png or jpeg only)</p>
              </DragAndDropUpload>
            )}
            <div className="w-full">
              <SliderInput
                title={getRiskTolerance()}
                description="Adjust your risk tolerance"
                icon={faWarning}
                min={0}
                max={100}
                value={analysis.metadata.risk!} 
                onChange={onRiskChange}/>
            </div>
          </div>
       
          <button
            className="flex w-auto items-center justify-start font-medium gap-1 mb-2"
            onClick={toggleStrategy}
            >
            <FontAwesomeIcon icon={showStrategy? faChevronUp:faChevronDown} className="w-4 md:w-4 h-4 md:h-4"  />
            <span className="">Add strategy (optional)</span>
          </button>
          <div className="flex flex-row justify-between">
            <label htmlFor={'strategy'} className=" hidden flex flex-row block text-left font-medium mb-1 opacity-80">
              {`Strategy (optional):`}
            </label>      
          </div>
          { showStrategy && (
            <div className="flex flex-col items-center mb-4 w-full rounded-md border border-neutral-400 dark:border-gray-700 text-sm md:text-md ">
              <textarea
                id={"strategy"}
                name={"strategy"}
                placeholder={"Provide details about your trading strategy (e.g., breakout, swing trading) and any specific criteria (e.g., minimum risk-to-reward ratio, entry/exit rules) to help refine the analysis."}          
                className={`flex w-full  flex-grow min-h-[180px] lg:min-h-[100px] p-2 bg-transparent rounded-md focus:outline-none resize-none `}
                value={analysis.metadata.strategyAndCriteria}
                onChange={onStrategyAndCriteriaChange}
                aria-describedby={"strategy-criteria-error"}
                maxLength={MAX_CHARS} />
              <span className="p-2 w-full text-right opacity-50">{`${analysis.metadata?.strategyAndCriteria?.length}/${MAX_CHARS}`}</span> 
            </div>)
          }
          {analysis.output && (
            <div className="flex flex-col items-center justify-center w-full max-w-[100%] lg:max-w-[80%] overflow-auto mx-auto pb-8 mb-8 text-sm md:text-md">
              <MarkdownView content={analysis.output}/>
            </div>
          )}
        </div>
      
        <div className=" mt-auto w-full border-t-2 border-neutral-400 dark:border-gray-700 pb-4 px-4 rounded-b-md">
          <AnalysisActionRow/>
        </div>
    </div>
    )
  }