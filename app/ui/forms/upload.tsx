'use client';
import { FileUploaderProps } from '@/app/types';
import React, { useState } from 'react';


export default function FileUploader({ 
  children,
  onFileUpload,
  acceptedFileExt,
  acceptedMimes,
  className = " justify-center items-center block cursor-pointer text-white text-sm font-semibold shadow-md focus:outline-none"

 }: FileUploaderProps) {
  const [inputKey, setInputKey] = useState(Date.now());

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) {
      return;
    }
    const selectedFile = event.target.files[0];
    const mime = selectedFile.type;

    if (acceptedMimes?.includes(mime)) {
      onFileUpload(selectedFile);
      setInputKey(Date.now()); // Reset the file input
    } else {
      alert(`The file type ${mime} is not supported.`);
    }
  };

  return (
    <div className="flex w-full max-w-lg justify-center items-center">
      <div className="w-full">
        <input
          type="file"
          id="file"
          name="file"
          key={inputKey}
          onChange={handleFileChange}
          accept={acceptedFileExt?.join(',')}
          className="hidden"
        />
        <label
          htmlFor="file"
          className={className}
        >
          {children}
        </label>
      </div>
    </div>
  );
}
