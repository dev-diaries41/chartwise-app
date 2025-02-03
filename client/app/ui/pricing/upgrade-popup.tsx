'use client'
import React, { useState } from 'react';
import List from '../common/list';
import CircleLoadingIndicator from '../common/circle-loading-indicator'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { upgradeSubscription } from '@/app/lib/subscription';
import { UserPlan } from '@/app/types';
import { useFormStatus } from 'react-dom';
import { pro } from '@/app/constants/messages';



interface PricingPlanPopUp {
    proPlanFeatures?: string[] ;
    elitePlanFeatures?: string[] ;
    email: string;
    currentPlan: UserPlan;
    onClose: ()=> void

}

export default function  UogradePopUp({email, proPlanFeatures = pro, currentPlan, onClose}: PricingPlanPopUp){
    const [upgradeResult, setUpgradeResult] = useState<{success:boolean; message: string;} | null>(null);


  const upgradeSub = async(planToUpgrade: UserPlan) => {
    const result = await upgradeSubscription(email, planToUpgrade);
        setUpgradeResult(result)
  }

  return (
    <div className="absolute p-4 inset-0 mx-auto flex items-center justify-center bg-black bg-opacity-50 z-50 transition-opacity duration-300 ease-in-out">
    <div className="relative bg-white dark:bg-gray-900 p-8 rounded-lg max-w-5xl mx-auto text-center shadow-md shadow-black">
      <h2 className="text-3xl font-semibold my-4">Upgrade Plan</h2>
      <p className={`text-md text-gray-400 ${upgradeResult? 'mb-4': 'mb-10'}`}>
      Choose a plan to upgrade to. Your payment card will be charged immediately upon upgrading.      
      </p>
     {upgradeResult?.message && <p className={`text-md  ${upgradeResult?.success? 'text-emerald-500': 'text-red-500'} mb-4`}>
        {upgradeResult.message}
      </p>
      }

      <button
        className="absolute top-4 right-4 opacity-80 hover:text-white"
        onClick={onClose}
      >
        <FontAwesomeIcon icon={faTimes} size="lg" />
      </button>


      <div className="flex flex-col md:flex-row justify-between gap-8 ">
        {/* Pro Plan */}
        { currentPlan === 'Basic' && <div className="relative bg-gray-100 dark:bg-gray-800 p-6 rounded-lg w-full md:w-1/2 mx-auto">
          <h3 className="text-2xl font-semibold mb-4">Pro</h3>
          <p className="text-2xl mb-4">
            £25.99 <span className="text-lg opacity-80">per month</span>
          </p>
          <form action={async()=>{
            await upgradeSub('Pro')
          }}>
           <UpgradeButton/>
          </form>
         
          <ul className="text-left space-y-2">
            <List items={proPlanFeatures} className="list-disc list-inside space-y-2 w-full text-start text-md"/>
          </ul>
        </div>}
      </div>
    </div>
    </div>   

  );
};

function UpgradeButton() {
  const { pending } = useFormStatus();
 
  return (
    <button 
    type='submit'
    className="bg-emerald-500 flex items-center w-full justify-center mx-auto text-white py-2 px-4 rounded-full mb-6 hover:bg-emerald-400 gap-2"
    aria-disabled={pending}
    disabled={pending}
    >
      {'Upgrade'} 
      {pending && <CircleLoadingIndicator size={20}/>}
    </button>
  );
}

// const PricingPlanPopUp: React.FC = () => {
//   return (
//     <div className="bg-gray-900 text-white p-8 rounded-lg max-w-5xl mx-auto text-center">
//       <h2 className="text-3xl font-semibold mb-4">Pricing</h2>
//       <p className="text-lg text-gray-400 mb-2">Trade smarter with ChartWise!</p>
//       <p className="text-md text-gray-400 mb-10">
//         Subscribe to a ChartWise plan to improve your trading outcomes.
//       </p>

//       <div className="flex flex-col md:flex-row justify-between gap-8">
//         {/* Pro Plan */}
//         <div className="relative bg-gray-800 p-6 rounded-lg w-full md:w-1/2">
//           <div className="absolute top-4 right-4 bg-yellow-400 text-gray-900 font-bold py-1 px-3 rounded-md text-sm">
//             Most popular
//           </div>
//           <h3 className="text-2xl font-semibold mb-4">Pro</h3>
//           <p className="text-2xl mb-4">
//             £25.99 <span className="text-lg text-gray-400">per month</span>
//           </p>
//           <button className="bg-green-600 text-white py-2 px-4 rounded-md mb-6 hover:bg-green-500">
//             Subscribe
//           </button>
//           <ul className="text-left space-y-2">
//             <li>500 chart analyses</li>
//             <li>Multi-timeframe analysis - upload up to 3 charts for different timeframes</li>
//             <li>Trade journal - keep a record of your trades</li>
//             <li>Trade journal insights - AI-powered insights based on your trade journal</li>
//           </ul>
//         </div>
//      
//       </div>
//     </div>
//   );
// };

// export default PricingPlanPopUp;


