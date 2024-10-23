'use client';
import { capitalizeFirstLetter, getCurrentMonth } from '@/app/lib/helpers';
import { Usage } from '@/app/types';
import React from 'react';
import 'react-circular-progressbar/dist/styles.css';
import { useSubscription } from '@/app/providers/subscription';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine } from '@fortawesome/free-solid-svg-icons';
import { cancelSubscription } from '@/app/lib/subscription';
import { usePopUp } from '@/app/hooks';
import PopUp from '../common/popup';
import AnalysisUsage from './usage';
import UsageCard from './usage-card';
import AccountInformation from './account-info';
import { CANCEL_MESSAGE_DESC, CANCEL_MESSAGE_TITLE } from '@/app/constants/messages';
import { toast } from 'react-toastify';
import { DefaultToastOptions } from '@/app/constants/global';
import UpgradePopUp from '../pricing/upgrade-popup';


export default function AccountOverview({ usage , email }: { usage: Usage, email:string }) {
  const { userPlanOverview, isUpgrading,toggleUpgradePop, updatePlanOverviewToCancelled } = useSubscription();
  const {showPopUp, closePopUp, popUpDescription, popUpTitle, popUpCta} = usePopUp();

  const cancelSub = async() => {
    const isCancelled = await cancelSubscription(email);
    // if(isCancelled){
    //   toast('Subscription cancelled successfully', DefaultToastOptions)
    // }else{
    //   toast.error('There waas an error cancelling your subscription. Please try again.', DefaultToastOptions)
    // }
    closePopUp();
    if(isCancelled){
      updatePlanOverviewToCancelled();
    }
  }

  const initiateCancelSub = ()=>showPopUp(CANCEL_MESSAGE_TITLE, CANCEL_MESSAGE_DESC, 'Cancel')


  return (
    <div className=" flex-1 max-w-7xl mx-auto w-full">
      <div className=" w-full flex flex-col  mx-auto  items-center text-center px-4 " >
        <div className="flex flex-col w-full min-h-screen items-center py-8 pt-24 lg:pt-8">
          <AccountInformation email={email} userPlanOverview={userPlanOverview} onCancel={initiateCancelSub} onUpgrade={toggleUpgradePop}/>
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
{ isUpgrading && <UpgradePopUp email={email!} onClose={toggleUpgradePop} currentPlan={userPlanOverview.plan}/>}    
</div>
  );
}
