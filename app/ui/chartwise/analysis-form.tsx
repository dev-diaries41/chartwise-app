'use client'
import React from 'react'
import { AcceptedImgMimes } from "@/app/constants/global";
import {CarouselImageViewer, MarkdownView, RiskSlider, DragAndDropUpload, ActionRow} from "@/app/ui/";
import {faCopy, faMagnifyingGlassChart, faShareNodes, faTimes, faUpload, faWarning } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useChartwise } from "@/app/providers/chartwise";
import { copyTextToClipboard } from "@/app/lib/helpers";
import { ActionItem } from "@/app/types";
import StrategyDropdown from "./strategies";
import { useSubscription } from "@/app/providers/subscription";
import CircleLoadingIndicator from '../common/circle-loading-indicator';
import { useFormStatus } from 'react-dom';
import { PLACEHOLDER_A2 } from '@/app/constants/placeholder';


interface AnalysisFormProps {
  handleAnalyseChart: () => Promise<void>;
}

export default React.memo(function AnalysisForm ({
    handleAnalyseChart, 
  }: AnalysisFormProps){
  const {analysis, shareUrl, uploadCharts, onRiskChange, onStrategyChange, getRiskTolerance,  removeCharts} = useChartwise();
  const {userPlanOverview} = useSubscription();
  const disabled =  analysis.chartUrls.length < 1

  const actions: ActionItem[] = [
    { icon: faCopy, onClick: () => copyTextToClipboard(analysis.output), tooltip: 'Copy' },
    { icon: faShareNodes, onClick: () => copyTextToClipboard(shareUrl), tooltip: 'Share', isVisible: !!shareUrl },
    // { icon: faRefresh, onClick: ()=>handleAnalyseChart(), tooltip: 'Re-analyis', isVisible: analysis.chartUrls.length > 0 }
  ];
    
    return (
      <div className="relative w-full max-w-[100%] flex flex-col  bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm md:text-md shadow-sm shadow-black rounded-md mb-2" >
        <div className=" p-4">
          <div className={`flex lg:flex-row flex-col justify-between items-center gap-8 my-4`}>
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
            <div className="mb-auto w-full h-full">
              <DragAndDropUpload onFileUpload={uploadCharts} acceptedMimes={AcceptedImgMimes} maxFiles={(['Basic', 'Free'].includes(userPlanOverview.plan))? 1 : 3}>
                <div className='flex flex-col gap-4 justify-center items-center'>
                  <FontAwesomeIcon icon={faUpload} className="w-8 h-8 text-emerald-500" />
                  <span className="text-lg font-semibold">Click to upload charts</span>
                </div>
                <p className='font-medium mt-4 opacity-80'>Or drag and drop a file (png or jpeg only)</p>
              </DragAndDropUpload>
            </div>
              
            )}
            <div className="w-full flex flex-col gap-4 mb-auto  rounded-md bg-gray-100  dark:bg-gray-700 p-2 shadow-sm">
              <div className="w-full px-4">
                <RiskSlider
                  title={getRiskTolerance()}
                  description="Adjust your risk tolerance"
                  icon={faWarning}
                  min={0}
                  max={100}
                  value={analysis.metadata.risk!} 
                  onChange={onRiskChange}/>
              </div>
              <div className='mr-auto w-full p-2 '>
                <StrategyDropdown onStrategyChange={onStrategyChange} analysis={analysis}/>
              </div>
            </div>
          </div>
          
          {analysis.output && (
            <div className="flex flex-col w-full pb-8 mb-8 mx-auto max-w-4xl">
              <MarkdownView content={analysis.output}/>
            </div>
          )}
        </div>
      
        <div className=" mt-auto w-full border-t border-gray-200 dark:border-gray-700 pb-4 px-4 rounded-b-md">
          <div className="w-full flex flex-row justify-start items-center gap-3 rounded-md mt-4">
            <div className="">
            { analysis.output && <ActionRow actions={actions}/>}
            </div>
            <form action={handleAnalyseChart} className='ml-auto'>
              <AnalysisButton disabled={disabled}/>
            </form>
          </div>
        </div>
    </div>
    )
  })

  function AnalysisButton({disabled}: {disabled: boolean}) {
    const { pending } = useFormStatus();
    return (
      <button
        type='submit'
        disabled={disabled || pending}
        className={`flex  items-center justify-center bg-emerald-500 text-sm text-white font-semibold p-2 rounded-full shadow-md gap-2 ${disabled? 'opacity-50' : 'opacity-100 hover:bg-emerald-500'}`}
      >
        <FontAwesomeIcon icon={faMagnifyingGlassChart} className="w-4 h-4"/>
        <span className="">Analyse Chart</span>
        {(pending) && <CircleLoadingIndicator size={20}/>}
      </button>
    );
  }