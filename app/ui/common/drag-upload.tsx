'use client'
import React, { useCallback } from 'react';
import { useDropzone, Accept } from 'react-dropzone';
import FileUploader from './upload';
import { FileUploaderProps } from '@/app/types';

export default function DragAndDropUpload({ onFileUpload, acceptedMimes, acceptedFileExt }: FileUploaderProps) {

  const accept: Accept = acceptedMimes?.reduce((acc, ext) => {
    acc[ext] = [];
    return acc;
  }, {} as Accept);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach((file: File) => {
      onFileUpload([file]);
    });
  }, [onFileUpload]);

  const { getRootProps, isDragActive } = useDropzone({
    onDrop,
    accept,
  });

  return (
    <div
      {...getRootProps()}
      className={`flex flex-col justify-center items-center  w-full h-[30vh] mx-auto border-2 bg-gray-800 border-gray-700 p-6 rounded-md text-center shadow-lg shadow-black ${
        isDragActive ? 'border-emerald-500' : 'border-gray-500'
      }`}
    >
      <FileUploader 
      label='Upload Image'
      className = "flex max-w-[80%]  mx-auto justify-center items-center block cursor-pointer bg-emerald-700 hover:bg-emerald-500 text-white text-xl font-semibold p-2 rounded-3xl shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400"
      onFileUpload={onFileUpload} acceptedFileExt={acceptedFileExt} acceptedMimes={acceptedMimes}>
        Upload Image
      </FileUploader>
      <p className='text-light text-lg mt-4'>Or drop a file</p>
    </div>
  );
};