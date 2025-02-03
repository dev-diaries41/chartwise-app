import { CANCELLATION_NOTICE } from "@/app/constants/messages";
import { UserPlanOverView } from "@/app/types";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

interface AccountInformationProps {
  email: string; 
  userPlanOverview: UserPlanOverView, 
  onCancel: () => void
  onUpgrade: () => void

}

export default function  AccountInformation({email, userPlanOverview, onCancel, onUpgrade}:AccountInformationProps ) {
  const hasCancelled = (userPlanOverview.cancel_at_period_end && userPlanOverview.plan !== 'Free');
  const isActiveSubscriber = (userPlanOverview.plan !== 'Free' && !userPlanOverview.cancel_at_period_end);
  const canUpgrade = (['Basic'].includes(userPlanOverview.plan) && !userPlanOverview.cancel_at_period_end);

  return (
    <div className='w-full flex flex-col mb-8'>
      <div className="w-full flex flex-row items-center justify-start text-left gap-2 mb-8">
        <FontAwesomeIcon icon={faUserCircle} className="w-6 h-6"/>
        <h1 className="text-2xl md:text-3xl font-bold">Account overview</h1>
      </div>
      { hasCancelled && <p className="font-medium mb-2 text-left text-red-500 opacity-80">{CANCELLATION_NOTICE}</p>}      
      <h1 className="font-semibold mb-2 mr-auto opacity-80">Account information</h1>
      <div className="relative w-full flex flex-col items-center justify center gap-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md p-4 mb-4">
        <div className="w-full flex flex-col md:flex-row items-start justify-between gap-2 overflow-hidden">
            <span className='font-medium opacity-80'>
                Email
            </span>
            <span className=''>
                {email}
            </span>
        </div>
        <div className="w-full h-px bg-gray-200 dark:bg-gray-700"></div>
        <div className="w-full flex flex-row items-start justify-between gap-4">
            <span className='font-medium opacity-80'>
                Plan
            </span>
            <span>
                {userPlanOverview.plan}
            </span>
        </div>
      </div>
      <div className="flex gap-4 font-medium items-center ml-auto text-sm md:text-md">
        {userPlanOverview.plan === 'Free' && (
          <Link href={'/#pricing'} className="bg-emerald-500 p-2 rounded-full text-white font-medium hover:bg-emerald-400">
            Subscribe
          </Link>
        )}
        {isActiveSubscriber && (
            <button onClick={onCancel} className="border border-red-500 text-black dark:text-white p-2 rounded-full font-medium hover:bg-red-400">
              Cancel Plan
            </button>
        )}
        {canUpgrade &&  (
          <button onClick={onUpgrade} className="bg-emerald-500 p-2 rounded-full text-white font-medium hover:bg-emerald-400">
            Upgrade
          </button>
      )}
      {/* {userPlanOverview.plan !== 'Free' && (
          <Link href={'https://billing.stripe.com/p/login/test_eVa8wT4XQ6HqayY000'} className="bg-emerald-500 p-2 rounded-full text-white font-medium hover:bg-emerald-400">
            Manage Subscription
          </Link>
        )} */}
      </div>
    </div>
  )
}
