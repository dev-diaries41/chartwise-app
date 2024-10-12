'use client'
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

interface CarouselImageViewerProps {
  images: string[];
  switchInterval?: number
}

export default function CarouselImageViewer({ images, switchInterval }: CarouselImageViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (switchInterval) {
    useEffect(() => {
      const interval = setInterval(() => {
        goToNext();
      }, switchInterval);

      return () => clearInterval(interval);
    }, [currentIndex, switchInterval]);
  }

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

  const moreImagesExist = images.length > 10;
  const visibleDots = moreImagesExist ? 10 : images.length;

  return (
    <div className="relative w-full bg-transparent rounded-md shadow-md shadow-black group">
      <div className="relative overflow-hidden rounded-lg">
        <div className="carousel-container relative overflow-hidden w-full h-full">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {images.map((image, index) => (
              <div key={index} className="flex min-w-full relative aspect-ratio-wrapper">
                <div className="absolute inset-0 flex justify-center items-center">
                  <Image
                    quality={100}
                    src={image}
                    alt={`Slide ${index}`}
                    loading="lazy"
                    placeholder="blur"
                    blurDataURL={image}
                    fill={true}
                    style={{ objectFit: 'contain' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {images.length > 1 && (
        <div className="absolute top-0 left-0 right-0 bottom-0 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            type="button"
            aria-label="Previous slide"
            className="flex top-1/2 left-1 transform-translate-y-1/2 bg-gray-700 bg-opacity-50 justify-center items-center text-white p-2 rounded-full"
            onClick={goToPrevious}
          >
            <FontAwesomeIcon icon={faChevronLeft} className='w-4 h-4'/>
          </button>
          <button
            type="button"
            aria-label="Next slide"
            className="flex top-1/2 right-1 transform-translate-y-1/2 bg-gray-700 bg-opacity-50 justify-center items-center text-white p-2 rounded-full"
            onClick={goToNext}
          >
            <FontAwesomeIcon icon={faChevronRight} className='w-4 h-4'/>
          </button>
        </div>
      )}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
        {images.length > 1 && Array.from({ length: visibleDots }, (_, dotIndex) => {
          const index = dotIndex;
          return (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`h-2.5 w-2.5 rounded-full ${
                currentIndex === index ? 'bg-blue-500' : 'bg-white'
              }`}
            />
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
}
