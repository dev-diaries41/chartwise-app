'use client'
import React, { useState } from 'react';
import { OnboardingAnswers, OnboardingQuestions } from '@/app/types';
import Image from 'next/image';

interface OnboardingProps extends Pick<WelcomePageProps, 'welcomeMessage' | 'welcomeTitle'> {
  onboardingQuestions: OnboardingQuestions[];
  onComplete: (answers: OnboardingAnswers) => void
}

interface WelcomePageProps {
  welcomeTitle: string;
  welcomeMessage: string;
  onContinue: () => void; 
  onSkip: () => void;
}

const WelcomePage = ({ welcomeMessage, welcomeTitle, onContinue, onSkip }: WelcomePageProps) => {
  return (
    <div className="bg-white dark:bg-gray-700 relative w-full max-w-5xl mx-auto rounded-md shadow-md shadow-black group animate-fadeIn">
      <div className="flex flex-col rounded-lg p-6 min-h-[400px]">
        <Image
            src={'/chartwise-icon.png'}
            alt={'logo'}
            width={40}
            height={40}
            className="max-w-9 max-h-9 md:max-w-12 md:max-h-12 mb-4"
            priority={true}
          />
        <h2 className="text-2xl md:text-3xl font-semibold text-center mb-4">
         {welcomeTitle}
        </h2>
        <p className="text-center mb-4 font-medium md:text-lg">
          {welcomeMessage}
        </p>
        <div className="w-full flex flex-row items-center justify-between gap-2 mt-auto">
          <button
            type="button"
            aria-label="Skip onboarding"
            className="flex justify-center items-center p-2 rounded-full"
            onClick={onSkip}
          >
            Skip
          </button>
          <button
            type="button"
            aria-label="Continue to onboarding questions"
            className="flex bg-emerald-500 justify-center items-center text-white p-2 rounded-full"
            onClick={onContinue}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default function OnboardingCarousel({ onboardingQuestions, welcomeMessage, welcomeTitle, onComplete }: OnboardingProps) {
  const [isIntroVisible, setIsIntroVisible] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});

  const handleOptionChange = (questionIndex: number, option: string) => {
    const currentQuestion = onboardingQuestions[questionIndex];
    const selectedOptions = answers[currentQuestion.questionCategory] || [];
    const isOptionSelected = selectedOptions.includes(option);

    setAnswers((prevAnswers) => {
      if (currentQuestion.allowMultipleAnswers) {
        return {
          ...prevAnswers,
          [currentQuestion.questionCategory]: isOptionSelected
            ? selectedOptions.filter((selectedOption) => selectedOption !== option)
            : [...selectedOptions, option],
        };
      } else {
        return {
          ...prevAnswers,
          [currentQuestion.questionCategory]: [option],
        };
      }
    });
  };

  const goToPrevious = () => {
    if (currentIndex === 0) return;
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? onboardingQuestions.length - 1 : prevIndex - 1));
  };


  const goToNext = async() => {
    if (currentIndex === onboardingQuestions.length - 1) {
      onComplete(answers);
    } else {
      setCurrentIndex((prevIndex) => (prevIndex === onboardingQuestions.length - 1 ? 0 : prevIndex + 1));
    }
  };

  const startOnboarding = () => {
    setIsIntroVisible(false);
  };

  return (
    <div className="absolute p-4 inset-0 mx-auto flex items-center justify-center bg-black bg-opacity-50 z-50 transition-opacity duration-300 ease-in-out">
      {isIntroVisible ? (
        <WelcomePage onContinue={startOnboarding} onSkip={()=>onComplete(answers)} welcomeMessage={welcomeMessage} welcomeTitle={welcomeTitle}/>
      ) : (
        <div className="bg-white dark:bg-gray-700 relative w-full max-w-5xl  rounded-md shadow-md shadow-black group">
          <div className="relative overflow-hidden rounded-lg p-6 min-h-[400px]">
            <div>
              <div className='flex flex-col gap-2 items-center mb-4'>
                <h2 className="text-xl md:text-2xl font-semibold text-center">
                  {onboardingQuestions[currentIndex].question}
                </h2>
                {onboardingQuestions[currentIndex].allowMultipleAnswers && (
                  <p className='md:text-lg opacity-80'>Tick all that apply.</p>
                )}
              </div>
              <div className="flex flex-col gap-4 pt-8">
                {onboardingQuestions[currentIndex].options.map((option, optionIndex) => (
                  <label key={optionIndex} className="flex items-center space-x-2">
                    <input
                      type={onboardingQuestions[currentIndex].allowMultipleAnswers ? "checkbox" : "radio"}
                      checked={answers[onboardingQuestions[currentIndex].questionCategory]?.includes(option) || false}
                      onChange={() => handleOptionChange(currentIndex, option)}
                      className="form-checkbox h-4 w-4 text-emerald-500"
                    />
                    <span className="text-sm">{option}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="w-full flex flex-row justify-between items-center p-8 pb-16 font-medium text-sm">
            {currentIndex > 0 && (
              <button
                type="button"
                aria-label="Go back to previous question"
                className={`flex bg-gray-500 justify-center items-center text-white p-2 rounded-full ${isIntroVisible ? 'hidden' : ''}`}
                onClick={goToPrevious}
              >
                Back
              </button>
            )}
            <button
              disabled={(answers[onboardingQuestions[currentIndex].questionCategory]?.length === 0 || !answers[onboardingQuestions[currentIndex].questionCategory])}
              type="button"
              aria-label="Continue to next question or complete onboarding"
              className={`flex bg-emerald-500 justify-center items-center text-white p-2 ml-auto rounded-full ${(answers[onboardingQuestions[currentIndex].questionCategory]?.length === 0 || !answers[onboardingQuestions[currentIndex].questionCategory])? 'opacity-50':''} ${isIntroVisible ? 'hidden' : ''}`}
              onClick={goToNext}
            >
              {currentIndex === onboardingQuestions.length - 1 ? 'Complete' : 'Continue'}
            </button>
          </div>

          <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
            {onboardingQuestions.length > 1 && onboardingQuestions.map((_, dotIndex) => (
              <button
                key={dotIndex}
                onClick={() => setCurrentIndex(dotIndex)}
                className={`h-2.5 w-2.5 rounded-full ${
                  currentIndex === dotIndex ? 'bg-blue-500' : 'bg-gray-300'
                } ${isIntroVisible ? 'hidden' : ''}`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}