'use client'
import React, { useState } from 'react';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';

interface CarouselImageViewerProps {
  images: string[];
}

export default function CarouselImageViewer ({ images }: CarouselImageViewerProps){
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
  };

  // Determine if more images exist beyond the first 10
  const moreImagesExist = images.length > 10;

  // Determine how many dots to show (max 10)
  const visibleDots = moreImagesExist ? 10 : images.length;

  return (
    <div className="relative w-full max-w-2xl mx-auto bg-gray-700 rounded-md">
      <div className="relative overflow-hidden rounded-lg">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {images.map((image, index) => (
            <div key={index} className="min-w-full relative h-64">
              <Image
                src={image}
                alt={`Slide ${index}`}
                layout="fill"
                objectFit="contain"
                className="rounded-lg"
              />
            </div>
          ))}
        </div>
      </div>
      <button
        type='button'
        className="absolute flex top-1/2 left-2 transform -translate-y-1/2 bg-gray-800 bg-opacity-50 justify-center items-center text-white p-2 rounded-full "
        onClick={goToPrevious}
      >
      <FontAwesomeIcon icon={faArrowLeft}/>
      </button>
      <button
        type='button'
        className="absolute flex top-1/2 right-2 transform -translate-y-1/2 bg-gray-800 bg-opacity-50 text-white p-2 rounded-full justify-center items-center"
        onClick={goToNext}
      >
      <FontAwesomeIcon icon={faArrowRight} className=''/>
      </button>
      <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
        {Array.from({ length: visibleDots }, (_, dotIndex) => {
          const index = dotIndex;
          return (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`h-2.5 w-2.5 rounded-full bg-white ${
                currentIndex === index ? 'opacity-100' : 'opacity-50'
              }`}
            ></button>
          );
        })}
        {moreImagesExist && (
          <div className="h-2.5 w-2.5 rounded-full bg-gray-300 opacity-50 flex items-center justify-center">
            <span className="text-gray-800 text-xs">...</span>
          </div>
        )}
      </div>
    </div>
  );
};