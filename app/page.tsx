import { CarouselImageViewer, Faq, PriceTable } from '@/app/ui';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import List from './ui/common/list';
import { faBook, faClock, faLayerGroup, faMagnifyingGlassChart, faShieldAlt, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { faChartLine } from '@fortawesome/free-solid-svg-icons/faChartLine';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Faqs } from '@/app/constants/faq';

export const revalidate = 3600

export const HowItWorksGuide = [
'Go to the  charts page and take a snapshot of the chart, or use an existing image.',
'Go back to the analysis page, upload the chart, and optionally add strategy, and adjust risk tolerance.'
]

export const ChartWiseBenefits: {
  title: string;
  description: string;
  icon: IconDefinition
}[] = [
  {
    title: "AI-Powered Chart Analysis",
    description: "Our AI analyzes charts, identifying trends, patterns, and anomalies to give you clear, actionable insights.",
    icon: faMagnifyingGlassChart
  },
  {
    title: "Strategy Optimization",
    description: "Receive AI-generated trade strategies that align with your risk tolerance and trading goals, making precise decisions easier.",
    icon: faChartLine
  },
  {
    title: "Multi-Timeframe Insights",
    description: "Upload multiple charts across different timeframes and get a comprehensive analysis that correlates data for better understanding.",
    icon: faLayerGroup
  },
  {
    title: "Risk Management",
    description: "Get tailored risk management advice, including stop loss and take profit levels, based on your trade setup and market volatility.",
    icon: faShieldAlt
  },
  {
    title: "Save Time",
    description: "Quickly understand complex charts without spending hours manually analyzing trends and data.",
    icon: faClock
  },
];

const HeroDescription = 'ChartWise helps traders identify patterns and trends, offering insights for precise trade strategies.';



const Hero = () => {
  return (
    <section className='relative w-full h-screen bg-gray-900'>
      <Image
        src={'/background.jpg'}
        alt='bg'
        width={2048}
        height={2048}
        priority={true}
        className='absolute top-0 bottom-0 left-0 w-full h-screen opacity-20 object-cover'
      />
      <div className="animate-fadeIn relative flex flex-col max-w-5xl  w-full mx-auto items-center  text-center opacity-90 p-8 h-full">
        <div className="w-full z-[10] flex flex-col py-16 pt-16 md:pt-48 justify-center items-center ">
          <h1 className="text-center lg:text-7xl md:text-5xl text-5xl my-4 px-3 font-bold text-gray-200">
            Chart analysis made easy! <span className="bg-gradient-to-r from-emerald-400 to-emerald-700 text-transparent bg-clip-text">Upload</span>.{" "}
            <span className="bg-gradient-to-r from-red-400 to-red-600 text-transparent bg-clip-text">Analyse</span>
          </h1>
         
          <div className='absolute bottom-48 sm:relative sm:bottom-auto flex flex-col w-full justify-center items-center'>
            <p className="text-md md:text-lg lg:text-xl font-medium mb-5 px-3 mt-4 max-w-[90%] md:max-w-[80%]">
            {HeroDescription}</p>
            <Link
                href={'/dashboard'}
                className={`flex flex-row items-center gap-2 justify-center w-[80%] md:max-w-[60%] lg:max-w-[40%] bg-emerald-700 hover:bg-emerald-600 border-2 border-emerald-400 text-gray-200 font-semibold p-2 md:p-4 rounded-full shadow-md text-lg md:text-xl lg:text-2xl mt-4 `}>
                {'Get started for free'}
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}



const Benefits = () => {
  return (
    <section id='benefits' className="w-full mx-auto flex flex-col items-center justify-center text-center py-16  bg-gradient-radial at-tl from-gray-800 to-gray-900">
      <h1 className="text-center text-3xl md:text-5xl my-4 px-3 font-bold">How ChartWise can improve your trading success</h1>
      <div className="flex flex-col  md:flex-row w-full max-w-7xl justify-center items-center gap-8 my-8 p-4">
            <div className='grid grid-cols-1 md:grid-cols-2  justify-center items-center gap-8 mb-16'>
          {
            ChartWiseBenefits.map((benefit, index) => {
              return(
                <div key={index} className='flex flex-col justify-center items-start text-left gap-4 mb-10 p-4'>
                  <FontAwesomeIcon icon={benefit.icon} className="text-emerald-500 w-8 h-8 md:w-10 md:h-10 mb-4" />
                  <h1 className='font-semibold text-xl md:text-2xl'>{benefit.title}</h1>
                  <p className='font-medium md:text-lg opacity-80'>{benefit.description}</p>
                </div>
              )})
          }
        </div>
    </div>
    </section>
  )
}

const HowItWorks = () => {
  return (
    <section id='how-it-works' className=" w-full mx-auto flex flex-col items-center justify-center text-center py-16  bg-gray-900" >
      <h1 className="text-center text-3xl md:text-5xl my-4 px-3 font-bold">How to analyse charts with ChartWise</h1>
      <div className="flex flex-col md:flex-row  w-full max-w-7xl justify-between items-center gap-8 my-8 p-4 mb-auto">
          <CarouselImageViewer images={['/analysis-page-v3.png', '/chart-page-v2.png']}  switchInterval={5000}/>
        <div className='justify-start font-medium'>
          <List items={HowItWorksGuide} listType='numbered' />
        </div>
    </div>
    </section>
  )
}

const Pricing = () => {
  return (
    <section id='pricing' className="flex flex-col bg-gray-900 w-full mx-auto items-center justify-center text-center py-16">
      <h1 className="text-center text-3xl md:text-5xl my-4 px-3 font-bold">Pricing</h1>
      <h2 className="text-center text-lg md:text-2xl my-4 px-3 font-semibold opacity-80">
      Trade smarter with ChartWise!
      </h2>
      <p className="max-w-5xl md:text-lg mb-5 px-3 opacity-80">
        Subscribe to a ChartWise plan to improve your trading outcomes.
      </p>
      <div className='w-full justify-center py-16'>
        <PriceTable/>
      </div>
    </section>
  )
}

const Page = () => {
  return (
    <div className='w-full my-auto text-white overflow-hidden'>
      <Hero/>
      <Benefits/>
      <HowItWorks/>
      <Pricing/>
      <Faq faq={Faqs}/>
    </div>
  );
}

export default Page;