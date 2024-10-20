'use client';
import { capitalizeFirstLetter, getCurrentMonth } from '@/app/lib/helpers';
import { Usage } from '@/app/types';
import React from 'react';
import 'react-circular-progressbar/dist/styles.css';
import { useSubscription } from '@/app/providers/subscription';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { cancelSubscription } from '@/app/lib/subscription';
import { usePopUp } from '@/app/hooks';
import PopUp from '../common/popup';
import AnalysisUsage from './usage';
import UsageCard from './usage-card';
import AccountInformation from './account-info';

const CANCEL_MESSAGE_TITLE ='Cancel subscription';
const CANCEL_MESSAGE_DESC ='Are you sure you want to cancel? If you decide to cancel your subscription will last till end of bill date.';


export default function AccountOverview({ usage = {
  today: 5, month: 20, total: 35
}, email }: { usage: Usage, email:string }) {
  const { userPlanOverview } = useSubscription();
  const {showPopUp, closePopUp, popUpDescription, popUpTitle, popUpCta} = usePopUp();
  const cancelSub = async() => {
    await cancelSubscription(email);
    closePopUp();
  }

  return (
    <div className="relative flex-1 max-w-7xl mx-auto w-full">
      <div className="relative w-full flex flex-col  mx-auto  items-center text-center px-4 " >
        <div className="flex flex-col w-full min-h-screen items-center py-8 pt-24 lg:pt-8">
          <AccountInformation email={email} userPlanOverview={userPlanOverview} onCancel={()=>showPopUp(CANCEL_MESSAGE_TITLE, CANCEL_MESSAGE_DESC, 'Cancel')}/>
          <div className="flex flex-col justify-center items-start gap-2 w-full mb-4">
            <div className="w-full flex flex-row items-center justify-start gap-2">
              <FontAwesomeIcon icon={faChartLine} className="w-4 h-4"/>
              <h1 className="text-xl md:text-2xl font-bold">Usage</h1>
            </div>
            <p className="opacity-80">Number of analyses</p>
          </div>

          <div className='w-full flex flex-wrap gap-4 justify-between items-center mb-8'>
            {Object.entries(usage).map(([key, value], index) => (
              <div key={index} className="w-full sm:w-full lg:w-1/4 mb-6 sm:mb-0">
                <UsageCard periodUsage={{ name: capitalizeFirstLetter(key), count: value }} />
              </div>
            ))}
          </div>

          <AnalysisUsage usage={usage.month} period={getCurrentMonth()} />
        </div>
      </div>
      {(popUpTitle && popUpDescription) && (
        <PopUp 
        title={popUpTitle} 
        description={popUpDescription} 
        onClose={closePopUp} 
        onConfirm={cancelSub} 
        onConfirmCta={popUpCta}
        onConfirmClassName={`px-4 py-2 bg-red-500 hover:bg-red-400 text-white font-medium rounded-full shadow-sm `}
        />
        )}
    </div>
  );
}
