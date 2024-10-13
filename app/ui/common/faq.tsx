'use client'
import React, { useState } from 'react';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const FAQ = [
  {
      question: 'Is there a free trial?',
      answer: ['Users who are not subscribed can use the tool 5 times a day for free, with a max of 30 times a month.'],
  },
  {
      question: 'How do payments work?',
      answer: ["Once you subscribe, you'll allocated a set amount of uses corresponding to the plan you chose. These will be reset every month."],
  },
  {
      question: 'Will new features be added?',
      answer: ["Yes, we'll add new features based on user needs. An idea currently being explored is scheduling weekly analysis reports for specific assets and receiving results via Telegram."],
  },
  {
    question: 'How long does the analysis take?',
    answer: [ "The analysis usually takes a 10 - 15 seconds, but it can take longer during peak times."]

  },
  {
      question: 'Is the analysis always accurate?',
      answer: [
          'The analysis is AI generated and may not always be 100% accurate and should be used as guidance or to build confluence, not as financial advice.',
      ],
  },
];


export default function Faq(){
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const handleToggle = (index: number) => {
    if (expandedIndex === index) {
      setExpandedIndex(null);
    } else {
      setExpandedIndex(index);
    }
  };
  

  return (
    <section id='faq' className='mx-auto w-full  py-16 mb-16'>
    <div className="max-w-7xl mx-auto flex flex-col gap-12">
      <div className="flex flex-col text-center basis-1/2">
        <h1 className="ttext-center text-3xl mb-4 px-3 font-bold">
          Frequently Asked Questions
        </h1>
       
      </div>
      <ul className="basis-1/2 rounded-md p-4">
        {FAQ.map((item, index) => (
          <li key={index}>
            <button
              className="relative flex gap-2 items-center w-full py-5 text-base font-semibold text-left border-t md:text-lg border-base-content/10"
              aria-expanded={expandedIndex === index}
              onClick={() => handleToggle(index)}
            >
              <span className="flex-1 text-base-content">{item.question}</span>
              <FontAwesomeIcon
                icon={expandedIndex === index ? faChevronUp : faChevronDown}
                className="w-4 h-4 ml-auto text-base-content"
              />
            </button>
            <div
              className="transition-all duration-300 ease-in-out opacity-80 overflow-hidden"
              style={{
                maxHeight: expandedIndex === index ? '100%' : '0',
                opacity: expandedIndex === index ? '1' : '0',
              }}
            >
              <div className="pb-5 leading-relaxed">
                {item.answer.map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  </section>
  );
};