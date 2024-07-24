import React from 'react';
import FileUploader from '@/app/ui/forms/upload';
import Selector from '@/app/ui/forms/selectors';
import {  Option } from '@/app/types';
import { AcceptedDocFiles, AcceptedMimes } from '@/app/constants/app';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload } from '@fortawesome/free-solid-svg-icons';



export default function ChartForm ({
  onFileUpload,
  onChartTypeChange,
  onGenerateChart,
  onChartTitleChange,
  chartTitle,
  chartType,
  disabled,
}: ChartFormProps){
    
  const chartOptions: Option[] = [
    { value: 'line', label: 'Line Chart' },
    { value: 'bar', label: 'Bar Chart' },
    { value: 'pie', label: 'Pie Chart' },
    { value: 'horizontal bar', label: 'Horizontal Bar Chart' },
  ];

  return (
    <div className="w-full flex flex-col bg-gray-800 border-2 border-gray-700 text-md shadow-md rounded-md mb-2" >
      <label className="hidden text-gray-200">Chart title (optional)</label>
      <input
        type="text"
        value={chartTitle}
        onChange={onChartTitleChange}
        placeholder="Chart title (optional)"
        className="w-full p-2 pt-4 pl-4 text-gray-200 bg-transparent focus:outline-none"
      />
      <div className='mx-4 border-b border-gray-700 mb-4'></div>
      <div className="w-full flex flex-row justify-between items-center mb-2 p-4 gap-4 rounded-md">
        <div className='w-[60%] mr-auto'>
        <Selector options={chartOptions} value={chartType} onChange={onChartTypeChange} placeholderOption="Select a chart type" />

        </div>
        <div className="">
        <FileUploader onFileUpload={onFileUpload} acceptedMimes={AcceptedMimes} acceptedFileExt={AcceptedDocFiles}>
          <div className='flex flex-row gap-1 justify-center items-center'>
            <FontAwesomeIcon icon={faUpload} className="w-4 h-4" />
            <span className="hidden sm:inline">Upload</span>
          </div>
        </FileUploader>

        </div>
        <button
          disabled={disabled}
          className={`${disabled? `flex w-auto justify-center bg-emerald-700 text-sm opacity-50` : `flex w-auto justify-center bg-emerald-700 hover:bg-emerald-500`} text-gray-200 font-bold p-2  px-4 rounded-3xl`}
          onClick={onGenerateChart}
        >
          Generate
        </button>
      </div>
    </div>
  );
};

