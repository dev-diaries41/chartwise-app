import React, {useState } from 'react'
import { StorageKeys } from '@/app/constants/global';
import { LocalStorage } from '@/app/lib/storage';
import { OnboardingAnswers } from '@/app/types';
import { completedOnboarding } from '@/app/lib/requests/chartwise-client';


const useOnboarding = (email: string | null | undefined) => {
    const [isVisible, setIsVisible] = useState(true);

    const closeOnboardingPopUp = () => {
        setIsVisible(false);
    };

    const onCompleteOnboarding = async (answers: OnboardingAnswers) => {
        if (email) {
            closeOnboardingPopUp();
            await completedOnboarding(email, answers);
            LocalStorage.set(StorageKeys.onboarding, 'complete');
        }
    };

    return {
        isVisible,
        closeOnboardingPopUp,
        onCompleteOnboarding
    };
};

export default useOnboarding;
