'use client'
import React, { useState } from 'react';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FAQ } from '@/app/types';
import { DISCORD_INVITE_URL, SUPPORT_EMAIL } from '@/app/constants/support';


export default function Faq({faq} :{faq: FAQ[]}){
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const handleToggle = (index: number) => {
    if (expandedIndex === index) {
      setExpandedIndex(null);
    } else {
      setExpandedIndex(index);
    }
  };
  
  return (
    <section id='support' className='mx-auto w-full  py-16 bg-gray-900'>
    <div className="max-w-7xl mx-auto flex flex-col gap-12">
      <div className="flex flex-col text-center basis-1/2">
        <h1 className="ttext-center text-3xl md:text-5xl mb-4 px-3 font-bold">
          Frequently Asked Questions
        </h1>
        <div className="flex flex-col text-center basis-1/2">
          <div className="text-base-content/80">
            Have questions or need help? You can send us an email at {' '}
            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              target="_blank"
              className="link text-base-content text-blue-500 underline"
            >
              {SUPPORT_EMAIL}
            </a>
            {' '} for support, or join the ChartWise{' '}
            <a
              className="link text-base-content text-blue-500 underline"
              target="_blank"
              href={DISCORD_INVITE_URL}
            >
              Discord community
            </a>
            {' '} to ask for help and stay updated on the latest updates.
          </div>
        </div>
      </div>
      <ul className="basis-1/2 rounded-md p-4">
        {faq.map((item, index) => (
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