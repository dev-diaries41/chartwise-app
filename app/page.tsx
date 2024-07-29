import { CarouselImageViewer, Faq, PriceTable } from '@/app/ui';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ListCard from './ui/cards/list-card';
import List from './ui/common/list';
import { ChartWiseBenefits, HowItWorksGuide, TraderProblems } from './constants/content/landing-page';



const Hero = () => {
  return (
    <section className='relative w-full h-screen'>
      <Image
        src={'/background.jpg'}
        alt='bg'
        layout='fill'
        className='absolute top-0 bottom-0 left-0 w-full h-screen opacity-10 object-cover'
      />
      <div className="animate-fadeIn relative flex flex-col max-w-5xl  w-full mx-auto items-center  text-center opacity-90 p-8 h-full">
        {/* <Background /> */}
        <div className="absolute top-0 left-0 w-[80%] h-[80%]">
          <div className="absolute inset-0 bg-gradient-radial from-gray-800 to-gray-900 opacity-50 blur-xl"></div>
        </div> 
        <div className="w-full z-[10] flex flex-col py-16 justify-center items-center">
          <h1 className="text-center lg:text-7xl md:text-5xl text-5xl my-4 px-3 font-bold text-gray-200">
            Chart analysis made easy! <span className="bg-gradient-to-r from-emerald-400 to-emerald-700 text-transparent bg-clip-text">Upload</span>.{" "}
            <span className="bg-gradient-to-r from-red-400 to-red-600 text-transparent bg-clip-text">Analyse</span>
          </h1>
         
          <div className='absolute bottom-48 sm:relative sm:bottom-auto flex flex-col w-full justify-center items-center'>
            <p className="text-md md:text-md lg:text-lg text-gray-200 mb-5 px-3 mt-4 max-w-[90%] md:max-w-[80%]">
            ChartWise helps traders identify patterns and trends, offering insights for precise trade strategies.</p>
            <Link
                href='/trader'
                className={`flex flex-row items-center gap-2 justify-center w-[80%] md:max-w-[60%] lg:max-w-[40%] bg-emerald-700 hover:bg-emerald-500 border-2 border-emerald-400 text-gray-200 font-semibold p-2 md:p-4 rounded-full shadow-md text-lg md:text-xl lg:text-2xl mt-4 `}>
                {'Get started for free'}
            </Link>
          </div>
        
        </div>
      </div>
    </section>
  )
}
const Pricing = () => {
  return (
    <section id='pricing' className="relative  flex flex-col bg-gray-800 w-full mx-auto items-center justify-center text-center py-16 mb-16">
    <h1 className="text-center text-3xl my-4 px-3 font-bold">Pricing</h1>
    <p className="max-w-5xl text-gray-200 mb-5 px-3">
    Invest in your trading success, start your subscription now!    
    </p>
    <div className='container justify-center py-16'>
      <PriceTable/>
    </div>
  </section>
  )
}

const Benefits = () => {
  return (
    <section id='benefits' className="w-full mx-auto flex flex-col items-center justify-center text-center py-16 mb-8">
      <h1 className="text-center text-3xl my-4 px-3 font-bold">Looking to improve your trading success?</h1>
      <div className="flex flex-col  md:flex-row w-full max-w-7xl justify-center items-center gap-8 my-8 p-4">
        <ListCard
          title={'Trading Challenges'}
          items={TraderProblems}
          titleClassName='text-red-500'
        />
          <ListCard
          title={'ChartWise Solutions'}
          items={ChartWiseBenefits}
          titleClassName='text-emerald-500'
        />
    </div>
    </section>
  )
}

const HowItWorks = () => {
  return (
    <section id='how-it-works' className="w-full mx-auto flex flex-col items-center justify-center text-center py-16 mb-16">
      <h1 className="text-center text-3xl my-4 px-3 font-bold">How to analyse charts with ChartWise?</h1>
      <div className="flex flex-col md:flex-row  w-full max-w-7xl justify-between items-center gap-8 my-8 p-4 mb-auto">
        <CarouselImageViewer images={['/chartwise-chart-mode.png', '/chartwise-analysis-mode.png']} />
        <div className='w-full lg:w-[40%] justify-start'>
        <List items={HowItWorksGuide} listType='numbered' />
        </div>
    </div>
    </section>
  )
}


const Page = () => {
  return (
    <div className='w-full my-auto'>
      <Hero/>
      <Benefits/>
      <HowItWorks/>
      <Pricing/>
      <Faq />
    </div>
  );
}

export default Page;
