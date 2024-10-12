'use client';
import { FileUploaderProps } from '@/app/types';
import React, { useState } from 'react';

export default function FileUploader({ 
  children,
  onFileUpload,
  acceptedFileExt,
  acceptedMimes,
  fileLimit = 1, 
  className = " justify-center items-center block cursor-pointer  text-sm font-semibold focus:outline-none"
 }: FileUploaderProps) {
  const [inputKey, setInputKey] = useState(Date.now());

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) {
      return;
    }
    const selectedFiles = Array.from(event.target.files);

    if (selectedFiles.length > fileLimit) {
      alert(`You can only upload up to ${fileLimit} files.`);
      setInputKey(Date.now());
      return;
    }

    const validFiles = selectedFiles.filter(file => 
      acceptedMimes?.includes(file.type)
    );

    if (validFiles.length > 0) {
      onFileUpload(validFiles);
      setInputKey(Date.now());
    } else {
      alert(`None of the selected file types are supported.`);
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
          multiple={true}
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
