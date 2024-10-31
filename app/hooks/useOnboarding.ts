import React, {useEffect, useState } from 'react'
import { StorageKeys } from '@/app/constants/global';
import { SessionStorage } from '@/app/lib/storage';
import { OnboardingAnswers } from '@/app/types';
import { completedOnboarding } from '@/app/lib/requests/chartwise-client';


const useOnboarding = (email: string | null | undefined) => {
    const [isVisible, setIsVisible] = useState(true);
    const [isOnboarded, setIsOnboarded] = useState(true);

    useEffect(() => {
        const result = SessionStorage.get<string>(StorageKeys.onboarding);
        if(result !== 'complete'){
            setIsOnboarded(false);
        }
    
      }, [])

    const closeOnboardingPopUp = () => {
        setIsVisible(false);
    };

    const onCompleteOnboarding = async (answers: OnboardingAnswers) => {
        if (email) {
            closeOnboardingPopUp();
            await completedOnboarding(email, answers);
            SessionStorage.set(StorageKeys.onboarding, 'complete');
        }
    };

    return {
        isVisible,
        isOnboarded,
        closeOnboardingPopUp,
        onCompleteOnboarding,
    };
};

export default useOnboarding;
