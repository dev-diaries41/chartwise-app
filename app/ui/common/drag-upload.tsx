'use client';
import { useState } from 'react';
import { useDropzone, Accept } from 'react-dropzone';
import { FileUploaderProps } from '@/app/types';

export default function DragAndDropUpload({ 
  onFileUpload, 
  acceptedMimes, 
  maxFiles = 1,
  maxSize,
  children,
  className,
}: Omit<FileUploaderProps, 'acceptedFileExt'>) {

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const accept: Accept = acceptedMimes?.reduce((acc, ext) => {
    acc[ext] = [];
    return acc;
  }, {} as Accept);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      setErrorMessage(null); 
      onFileUpload(acceptedFiles); 
    },
    onDropRejected: (rejectedFiles) => {
      if (rejectedFiles.length > 0 && rejectedFiles[0].errors.some(err => err.code === 'too-many-files')) {
        setErrorMessage(`You can only upload up to ${maxFiles} file(s).`);
      };

      if (rejectedFiles.length > 0 && rejectedFiles[0].errors.some(err => err.code === 'file-invalid-type')) {
        setErrorMessage(`Unsupported file types.`);
      }

      if (rejectedFiles.length > 0 && rejectedFiles[0].errors.some(err => err.code === 'file-too-large')) {
        setErrorMessage(`Max file size exceeded.`);
      }
    },
    accept,
    maxFiles: maxFiles,
    maxSize
  });
  

  return (
    <div className='w-full'>
        {errorMessage && (
        <p className="text-left text-red-500 my-2">{errorMessage}</p>
      )}
      <div
        {...getRootProps()}
        className={`${className || 'flex flex-col justify-center items-center w-full h-[30vh] mx-auto border-2 border-dashed border-gray-300 dark:border-gray-700 p-6 rounded-md text-center'}`}
      >
        <input {...getInputProps()} />
        {children}
      </div>    
    </div>
  );
}
